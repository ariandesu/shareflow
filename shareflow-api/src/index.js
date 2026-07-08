import { Hono } from "hono";
import { cors } from "hono/cors";
import { createClient } from "@supabase/supabase-js";
import { Redis } from "@upstash/redis/cloudflare";
const app = new Hono();
// Enable CORS
app.use("/*", cors({
    origin: "*", // Or specific domains like the Cloudflare Pages URL
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
}));
// Base62 character set
const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function generateBase62Code(length) {
    let code = "";
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
        const index = array[i] % BASE62.length;
        code += BASE62[index];
    }
    return code;
}
// 1. POST /api/text -> Create a new snippet
app.post("/api/text", async (c) => {
    const { text } = await c.req.json();
    if (!text || typeof text !== "string") {
        return c.json({ error: "Text is required" }, 400);
    }
    // Set up clients
    const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
    const redis = new Redis({
        url: c.env.UPSTASH_REDIS_REST_URL,
        token: c.env.UPSTASH_REDIS_REST_TOKEN,
    });
    // Check rate limit by IP (limit: 10 shares per minute)
    const clientIP = c.req.header("CF-Connecting-IP") || "anonymous";
    const rateLimitKey = `ratelimit:${clientIP}`;
    const currentCount = await redis.incr(rateLimitKey);
    if (currentCount === 1) {
        await redis.expire(rateLimitKey, 60); // 1 minute window
    }
    if (currentCount > 10) {
        return c.json({ error: "Rate limit exceeded. Please try again in a minute." }, 429);
    }
    let code = "";
    let attempts = 0;
    const maxAttempts = 5;
    let isUnique = false;
    while (!isUnique && attempts < maxAttempts) {
        code = generateBase62Code(6);
        // Check if code is unique in Supabase
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
    // Cache snippet in Upstash Redis (expires in 24 hours)
    const cacheSnippet = { id: code, text, views: 0, createdAt: Date.now() };
    await redis.set(`snippet:${code}`, JSON.stringify(cacheSnippet), { ex: 86400 });
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
    const redis = new Redis({
        url: c.env.UPSTASH_REDIS_REST_URL,
        token: c.env.UPSTASH_REDIS_REST_TOKEN,
    });
    const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
    const redisKey = `snippet:${code}`;
    // Try Cache First
    let cached = await redis.get(redisKey);
    if (cached) {
        // Update local object view count
        const views = (cached.views || 0) + 1;
        cached.views = views;
        // Save updated view count back to cache
        await redis.set(redisKey, JSON.stringify(cached), { keepTtl: true });
        // Update DB views asynchronously in background
        c.executionCtx.waitUntil((async () => {
            await supabase.rpc("increment_snippet_views", { snippet_id: code });
        })());
        return c.json(cached);
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
    // Cache snippet in Redis
    await redis.set(redisKey, JSON.stringify(snippet), { ex: 86400 });
    return c.json(snippet);
});
export default app;
