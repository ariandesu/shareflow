import { Hono } from "hono";
import { cors } from "hono/cors";
import { createClient } from "@supabase/supabase-js";
import { Redis } from "@upstash/redis/cloudflare";

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
  API_MASTER_KEY: string;
  BUCKET: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS
app.use(
  "/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// Base62 character set
const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function generateBase62Code(length: number): string {
  let code = "";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    const index = array[i] % BASE62.length;
    code += BASE62[index];
  }
  return code;
}

// Helper: create Redis client only if credentials are available
function getRedis(env: Bindings): Redis | null {
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    return new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return null;
}

// 1. POST /api/text -> Create a new snippet
app.post("/api/text", async (c) => {
  const { text } = await c.req.json<{ text?: string }>();
  if (!text || typeof text !== "string") {
    return c.json({ error: "Text is required" }, 400);
  }

  // Set up clients
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
  const redis = getRedis(c.env);

  // Check rate limit by IP (only if Redis is available)
  if (redis) {
    try {
      const clientIP = c.req.header("CF-Connecting-IP") || "anonymous";
      const rateLimitKey = `ratelimit:${clientIP}`;
      const currentCount = await redis.incr(rateLimitKey);
      if (currentCount === 1) {
        await redis.expire(rateLimitKey, 60);
      }
      if (currentCount > 10) {
        return c.json({ error: "Rate limit exceeded. Please try again in a minute." }, 429);
      }
    } catch (e) {
      // Redis failed, skip rate limiting
    }
  }

  let code = "";
  let attempts = 0;
  const maxAttempts = 5;
  let isUnique = false;

  while (!isUnique && attempts < maxAttempts) {
    code = generateBase62Code(4);
    const { data, error } = await supabase
      .from("snippets")
      .select("id")
      .eq("id", code)
      .maybeSingle();

    if (!error && !data) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    return c.json({ error: "Failed to generate unique code. Please try again." }, 500);
  }

  // Save to Supabase
  const { error: dbError } = await supabase.from("snippets").insert({
    id: code,
    text,
    views: 0,
  });

  if (dbError) {
    return c.json({ error: `Database error: ${dbError.message}` }, 500);
  }

  // Cache snippet in Redis (if available)
  if (redis) {
    try {
      const cacheSnippet = { id: code, text, views: 0, createdAt: Date.now() };
      await redis.set(`snippet:${code}`, JSON.stringify(cacheSnippet), { ex: 86400 });
    } catch (e) {
      // Redis caching failed, not critical
    }
  }

  // Get request origin to return full share URL
  const origin = c.req.url ? new URL(c.req.url).origin : "";

  return c.json({
    code,
    url: `${origin}/t/${code}`,
  });
});

// 2. GET /api/text/:code -> Retrieve a snippet
app.get("/api/text/:code", async (c) => {
  const code = c.req.param("code");
  if (!code) {
    return c.json({ error: "Code is required" }, 400);
  }

  const redis = getRedis(c.env);
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);

  const redisKey = `snippet:${code}`;

  // Try Cache First (if Redis is available)
  if (redis) {
    try {
      let cached: any = await redis.get(redisKey);
      if (cached) {
        const views = (cached.views || 0) + 1;
        cached.views = views;

        await redis.set(redisKey, JSON.stringify(cached), { keepTtl: true });

        c.executionCtx.waitUntil(
          (async () => {
            await supabase.rpc("increment_snippet_views", { snippet_id: code });
          })()
        );

        return c.json(cached);
      }
    } catch (e) {
      // Redis read failed, fall through to DB
    }
  }

  // Query Database
  const { data, error } = await supabase
    .from("snippets")
    .select("*")
    .eq("id", code)
    .maybeSingle();

  if (error || !data) {
    return c.json({ error: "Text snippet not found" }, 404);
  }

  // Increment views in DB
  const { data: updatedData } = await supabase
    .from("snippets")
    .update({ views: data.views + 1 })
    .eq("id", code)
    .select()
    .maybeSingle();

  const finalData = updatedData || data;

  const snippet = {
    id: finalData.id,
    text: finalData.text,
    views: finalData.views,
    createdAt: new Date(finalData.created_at).getTime(),
  };

  // Cache snippet in Redis (if available)
  if (redis) {
    try {
      await redis.set(redisKey, JSON.stringify(snippet), { ex: 86400 });
    } catch (e) {
      // Redis caching failed, not critical
    }
  }

  return c.json(snippet);
});

// 3. POST /api/file -> Upload a small file to R2 (Cloud Sync)
app.post("/api/file", async (c) => {
  const body = await c.req.parseBody();
  const file = body['file'] as File;
  if (!file) return c.json({ error: "File is required" }, 400);

  if (file.size > 10 * 1024 * 1024) {
    return c.json({ error: "File must be smaller than 10MB" }, 400);
  }

  let code = "";
  let isUnique = false;
  let attempts = 0;
  while (!isUnique && attempts < 5) {
    code = generateBase62Code(4);
    const existing = await c.env.BUCKET.head(code);
    if (!existing) isUnique = true;
    attempts++;
  }

  if (!isUnique) return c.json({ error: "Failed to generate unique code" }, 500);

  const arrayBuffer = await file.arrayBuffer();
  await c.env.BUCKET.put(code, arrayBuffer, {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
    customMetadata: { 
      filename: file.name,
      size: String(file.size),
      mimeType: file.type || 'application/octet-stream',
      expiresAt: String(Date.now() + 24 * 60 * 60 * 1000) // 24 Hours
    }
  });

  return c.json({ code });
});

// 4. POST /api/file/p2p -> Register a P2P session (instantly generates code)
app.post("/api/file/p2p", async (c) => {
  const { name, size, mimeType, offer } = await c.req.json<{ name?: string, size?: number, mimeType?: string, offer?: any }>();
  if (!name || size === undefined) {
    return c.json({ error: "Name and size are required" }, 400);
  }

  let code = "";
  let isUnique = false;
  let attempts = 0;
  while (!isUnique && attempts < 5) {
    code = generateBase62Code(4);
    const existing = await c.env.BUCKET.head(`p2p-${code}`);
    const existingFile = await c.env.BUCKET.head(code);
    if (!existing && !existingFile) isUnique = true;
    attempts++;
  }

  if (!isUnique) return c.json({ error: "Failed to generate unique code" }, 500);

  const sessionData = JSON.stringify({
    type: 'p2p',
    name,
    size,
    mimeType: mimeType || 'application/octet-stream',
    offer: offer || null,
    createdAt: Date.now()
  });

  await c.env.BUCKET.put(`p2p-${code}`, sessionData, {
    customMetadata: {
      expiresAt: String(Date.now() + 10 * 60 * 1000) // 10 minutes
    }
  });

  return c.json({ code });
});

// 4b. POST /api/file/p2p/:code/offer -> Upload SDP offer in the background
app.post("/api/file/p2p/:code/offer", async (c) => {
  const code = c.req.param("code");
  const { offer } = await c.req.json<{ offer?: any }>();
  if (!offer) return c.json({ error: "WebRTC offer is required" }, 400);

  const obj = await c.env.BUCKET.get(`p2p-${code}`);
  if (!obj) return c.json({ error: "P2P session not found" }, 404);

  const text = await obj.text();
  const data = JSON.parse(text);
  data.offer = offer;

  await c.env.BUCKET.put(`p2p-${code}`, JSON.stringify(data), {
    customMetadata: {
      expiresAt: String(Date.now() + 10 * 60 * 1000)
    }
  });

  return c.json({ success: true });
});

// 5. POST /api/file/p2p/:code/answer -> Receiver posts SDP answer
app.post("/api/file/p2p/:code/answer", async (c) => {
  const code = c.req.param("code");
  const { answer } = await c.req.json<{ answer?: any }>();
  if (!answer) return c.json({ error: "Answer is required" }, 400);

  await c.env.BUCKET.put(`p2p-answer-${code}`, JSON.stringify({ answer }), {
    customMetadata: {
      expiresAt: String(Date.now() + 10 * 60 * 1000)
    }
  });

  return c.json({ success: true });
});

// 6. GET /api/file/p2p/:code/answer -> Sender polls for SDP answer
app.get("/api/file/p2p/:code/answer", async (c) => {
  const code = c.req.param("code");
  const obj = await c.env.BUCKET.get(`p2p-answer-${code}`);
  if (!obj) {
    return c.json({ status: "waiting" });
  }

  const text = await obj.text();
  const data = JSON.parse(text);

  return c.json({ status: "ready", answer: data.answer });
});

// 7. GET /api/file/:code -> Get file or P2P metadata
app.get("/api/file/:code", async (c) => {
  const code = c.req.param("code");

  // Check if it is a Server File
  const fileObj = await c.env.BUCKET.head(code);
  if (fileObj) {
    const expiresAt = Number(fileObj.customMetadata?.expiresAt);
    if (expiresAt && Date.now() > expiresAt) {
      c.executionCtx.waitUntil(c.env.BUCKET.delete(code));
      return c.json({ error: "File has expired" }, 410);
    }
    return c.json({
      type: 'server',
      name: fileObj.customMetadata?.filename || 'download',
      size: Number(fileObj.customMetadata?.size || fileObj.size),
      mimeType: fileObj.customMetadata?.mimeType || fileObj.httpMetadata?.contentType || 'application/octet-stream',
      createdAt: fileObj.uploaded.getTime()
    });
  }

  // Check if it is a P2P Session
  const p2pObj = await c.env.BUCKET.get(`p2p-${code}`);
  if (p2pObj) {
    const expiresAt = Number(p2pObj.customMetadata?.expiresAt);
    if (expiresAt && Date.now() > expiresAt) {
      c.executionCtx.waitUntil(c.env.BUCKET.delete(`p2p-${code}`));
      return c.json({ error: "P2P session has expired" }, 410);
    }
    const text = await p2pObj.text();
    const data = JSON.parse(text);
    return c.json({
      type: 'p2p',
      name: data.name,
      size: data.size,
      mimeType: data.mimeType,
      createdAt: data.createdAt,
      offer: data.offer
    });
  }

  return c.json({ error: "File not found or expired" }, 404);
});

// 8. GET /api/file/:code/download -> Download R2 file
app.get("/api/file/:code/download", async (c) => {
  const code = c.req.param("code");
  const object = await c.env.BUCKET.get(code);
  
  if (!object) return c.json({ error: "File not found in storage" }, 404);

  const expiresAt = Number(object.customMetadata?.expiresAt);
  if (expiresAt && Date.now() > expiresAt) {
    c.executionCtx.waitUntil(c.env.BUCKET.delete(code));
    return c.json({ error: "File has expired" }, 410);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  if (object.customMetadata?.filename) {
    const encodedName = encodeURIComponent(object.customMetadata.filename);
    headers.set('Content-Disposition', `attachment; filename*=UTF-8''${encodedName}`);
  } else {
    headers.set('Content-Disposition', `attachment; filename="download"`);
  }

  return new Response(object.body as ReadableStream, {
    headers,
  });
});

export default app;
