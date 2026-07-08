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

export default app;
