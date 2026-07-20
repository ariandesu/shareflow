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

type User = { id: string; email: string; name: string; role: string; created_at: string };
type Session = { id: string; user_id: string; token: string; expires_at: string };

type Variables = {
  user: User;
  api_key_id: string;
  api_user_id: string;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use("/*", cors({ origin: "*", allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowHeaders: ["Content-Type", "Authorization"] }));

app.get("/", (c) => c.json({ name: "ShareFlow API", version: "1.0.0", docs: "https://shareflow.mhr3d.online/dev" }));

app.post("/api/admin/setup", async (c) => {
  const auth = c.req.header("Authorization") || "";
  const key = auth.replace("Bearer ", "");
  if (key !== c.env.API_MASTER_KEY) return c.json({ error: "Unauthorized" }, 401);
  const { email, password, name } = await c.req.json<any>();
  if (!email || !password) return c.json({ error: "Email and password required" }, 400);
  const normalizedEmail = email.toLowerCase().trim();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
  const existing = await supabase.from("users").select("id, role").eq("email", normalizedEmail).maybeSingle();
  if (existing.data) {
    await supabase.from("users").update({ role: "admin" }).eq("id", existing.data.id);
    return c.json({ message: "User already exists, promoted to admin" });
  }
  const salt = generateHex(16);
  const passwordHash = await hashPassword(password, salt);
  const { data: user, error } = await supabase.from("users").insert({ email: normalizedEmail, password_hash: `${salt}:${passwordHash}`, name: name || normalizedEmail.split("@")[0], role: "admin" }).select().single();
  if (error) return c.json({ error: "Setup failed", detail: error.message }, 500);
  return c.json({ message: "Admin user created", email: user.email });
});

const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function generateCode(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => BASE62[b % BASE62.length]).join("");
}

function generateHex(bytes: number): string {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, "0")).join("");
}

function getRedis(env: Bindings): Redis | null {
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN)
    return new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN });
  return null;
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: new TextEncoder().encode(salt), iterations: 100000, hash: "SHA-256" }, key, 256);
  return Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function getUserFromToken(c: any): Promise<User | null> {
  const auth = c.req.header("Authorization") || "";
  const token = auth.replace("Bearer ", "");
  if (!token) return null;
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
  const { data } = await supabase.from("sessions").select("*, users!inner(*)").eq("token", token).gte("expires_at", new Date().toISOString()).maybeSingle();
  return data?.users || null;
}

async function requireUser(c: any, next: any) {
  const user = await getUserFromToken(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  c.set("user", user);
  await next();
}

async function requireAdmin(c: any, next: any) {
  const user = await getUserFromToken(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  if (user.role !== "admin") return c.json({ error: "Forbidden" }, 403);
  c.set("user", user);
  await next();
}

// ─── Auth ──────────────────────────────────────────────────────────────────────

app.post("/api/auth/register", async (c) => {
  const { email, password, name } = await c.req.json<any>();
  if (!email || !password) return c.json({ error: "Email and password required" }, 400);
  if (password.length < 6) return c.json({ error: "Password must be at least 6 characters" }, 400);
  const normalizedEmail = email.toLowerCase().trim();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
  const existing = await supabase.from("users").select("id").eq("email", normalizedEmail).maybeSingle();
  if (existing.data) return c.json({ error: "Email already registered" }, 409);
  const salt = generateHex(16);
  const passwordHash = await hashPassword(password, salt);
  const { data: user, error } = await supabase.from("users").insert({ email: normalizedEmail, password_hash: `${salt}:${passwordHash}`, name: name || normalizedEmail.split("@")[0], role: "user" }).select().single();
  if (error) return c.json({ error: "Registration failed", detail: error.message }, 500);
  const token = generateHex(32);
  await supabase.from("sessions").insert({ user_id: user.id, token, expires_at: new Date(Date.now() + 7 * 86400000).toISOString() });
  return c.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

app.post("/api/auth/login", async (c) => {
  const { email, password } = await c.req.json<any>();
  if (!email || !password) return c.json({ error: "Email and password required" }, 400);
  const normalizedEmail = email.toLowerCase().trim();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
  const { data: user } = await supabase.from("users").select("*").eq("email", normalizedEmail).maybeSingle();
  if (!user) return c.json({ error: "Invalid email or password" }, 401);
  const [salt, hash] = user.password_hash.split(":");
  const check = await hashPassword(password, salt);
  if (check !== hash) return c.json({ error: "Invalid email or password" }, 401);
  const token = generateHex(32);
  await supabase.from("sessions").insert({ user_id: user.id, token, expires_at: new Date(Date.now() + 7 * 86400000).toISOString() });
  await supabase.from("users").update({ last_login_at: new Date().toISOString() }).eq("id", user.id);
  return c.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

app.post("/api/auth/logout", async (c) => {
  const auth = c.req.header("Authorization") || "";
  const token = auth.replace("Bearer ", "");
  if (token) {
    const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
    await supabase.from("sessions").delete().eq("token", token);
  }
  return c.json({ success: true });
});

app.get("/api/auth/me", requireUser, async (c) => {
  const user = c.get("user");
  return c.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role, created_at: user.created_at } });
});

// ─── API Keys ─────────────────────────────────────────────────────────────────

app.post("/api/keys", requireUser, async (c) => {
  try {
    const user = c.get("user");
    const { name } = await c.req.json<any>();
    if (!name) return c.json({ error: "Key name is required" }, 400);
    const key = "sf_" + generateHex(24);
    const prefix = key.substring(0, 10);
    const res = await fetch(`${c.env.SUPABASE_URL}/rest/v1/api_keys`, {
      method: "POST", headers: { "Content-Type": "application/json", apikey: c.env.SUPABASE_ANON_KEY, Authorization: `Bearer ${c.env.SUPABASE_ANON_KEY}`, Prefer: "return=representation" },
      body: JSON.stringify({ user_id: user.id, name, key_value: key, prefix }),
    });
    if (!res.ok) { const err = await res.text(); return c.json({ error: "Failed to create key", status: res.status, detail: err?.substring(0, 500) }, 500); }
    const data = await res.json();
    const row = Array.isArray(data) ? data[0] : data;
    return c.json({ id: row.id, name: row.name, key: row.key_value, prefix: row.prefix, created_at: row.created_at });
  } catch (e: any) {
    return c.json({ error: "Exception", detail: e?.message || String(e) }, 500);
  }
});

app.get("/api/keys", requireUser, async (c) => {
  const user = c.get("user");
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
  const { data } = await supabase.from("api_keys").select("id, name, prefix, created_at, last_used_at, revoked").eq("user_id", user.id).order("created_at", { ascending: false });
  return c.json({ keys: data || [] });
});

app.delete("/api/keys/:id", requireUser, async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
  const { data: key } = await supabase.from("api_keys").select("id").eq("id", id).eq("user_id", user.id).maybeSingle();
  if (!key) return c.json({ error: "Key not found" }, 404);
  await supabase.from("api_keys").update({ revoked: true }).eq("id", id);
  return c.json({ success: true });
});

app.get("/api/keys/usage", requireUser, async (c) => {
  const user = c.get("user");
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
  const { data: keys } = await supabase.from("api_keys").select("id, name, prefix").eq("user_id", user.id);
  if (!keys || keys.length === 0) return c.json({ usage: [] });
  const keyIds = keys.map(k => k.id);
  const { data: logs } = await supabase.from("api_usage_logs").select("*").in("api_key_id", keyIds).order("created_at", { ascending: false }).limit(100);
  return c.json({ usage: logs || [], keys });
});

// ─── Admin ─────────────────────────────────────────────────────────────────────

async function adminFetch(url: string, env: Bindings, opts?: any) {
  return fetch(`${env.SUPABASE_URL}/rest/v1/${url}`, {
    headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`, ...opts?.headers },
    ...opts,
  });
}

app.get("/api/admin/users", requireAdmin, async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
  const { data: users } = await supabase.from("users").select("id, email, name, role, created_at, last_login_at").order("created_at", { ascending: false });
  if (!users) return c.json({ users: [] });
  const userIds = users.map((u: any) => u.id);
  const { data: usageCounts } = await supabase.from("api_usage_logs").select("user_id", { count: "exact", head: false });
  const countMap: Record<string, number> = {};
  if (usageCounts) {
    for (const log of usageCounts) { const uid = (log as any).user_id; if (uid) countMap[uid] = (countMap[uid] || 0) + 1; }
  }
  const enriched = users.map((u: any) => ({ ...u, total_requests: countMap[u.id] || 0, suspended: false }));
  return c.json({ users: enriched });
});

app.get("/api/admin/users/:id/usage", requireAdmin, async (c) => {
  const id = c.req.param("id");
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
  const { data: keys } = await supabase.from("api_keys").select("id, name, key_value, created_at").eq("user_id", id);
  if (!keys) return c.json({ keys: [], usage: [] });
  const keyIds = keys.map((k: any) => k.id);
  if (keyIds.length === 0) return c.json({ keys: [], usage: [] });
  const { data: logs } = await supabase.from("api_usage_logs").select("*").in("api_key_id", keyIds).order("created_at", { ascending: false }).limit(200);
  return c.json({ keys, usage: logs || [] });
});

app.get("/api/admin/keys", requireAdmin, async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
  const { data } = await supabase.from("api_keys").select("*, users(email, name)").order("created_at", { ascending: false });
  return c.json({ keys: data || [] });
});

app.get("/api/admin/stats", requireAdmin, async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
  const [usersRes, keysRes, logsRes] = await Promise.all([
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("api_keys").select("id", { count: "exact", head: true }),
    supabase.from("api_usage_logs").select("id", { count: "exact", head: true }),
  ]);
  const { data: recentLogs } = await supabase.from("api_usage_logs").select("created_at, endpoint, status, method").order("created_at", { ascending: false }).limit(50);
  const { data: topUsers } = await supabase.from("api_usage_logs").select("user_id").limit(5000);
  const userCounts: Record<string, number> = {};
  if (topUsers) { for (const r of topUsers) { const uid = (r as any).user_id; if (uid) userCounts[uid] = (userCounts[uid] || 0) + 1; } }
  const topUserIds = Object.entries(userCounts).sort((a: any, b: any) => b[1] - a[1]).slice(0, 10).map(([id]) => id);
  let topUsersDetail: any[] = [];
  if (topUserIds.length > 0) {
    const { data: ud } = await supabase.from("users").select("id, email, name").in("id", topUserIds);
    if (ud) topUsersDetail = topUserIds.map(id => ({ id, email: (ud as any).find((u: any) => u.id === id)?.email || "unknown", name: (ud as any).find((u: any) => u.id === id)?.name || "unknown", requests: userCounts[id] }));
  }
  return c.json({
    totalUsers: usersRes.count || 0,
    totalKeys: keysRes.count || 0,
    totalRequests: logsRes.count || 0,
    recentRequests: recentLogs || [],
    topUsers: topUsersDetail,
  });
});

app.put("/api/admin/users/:id/role", requireAdmin, async (c) => {
  const id = c.req.param("id");
  const { role } = await c.req.json<any>();
  if (!["user", "admin"].includes(role)) return c.json({ error: "Invalid role" }, 400);
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
  await supabase.from("users").update({ role }).eq("id", id);
  return c.json({ success: true });
});

app.put("/api/admin/users/:id/suspend", requireAdmin, async (c) => {
  const id = c.req.param("id");
  const { suspended } = await c.req.json<any>();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
  const res = await fetch(`${c.env.SUPABASE_URL}/rest/v1/users?id=eq.${id}`, {
    method: "PATCH", headers: { "Content-Type": "application/json", apikey: c.env.SUPABASE_ANON_KEY, Authorization: `Bearer ${c.env.SUPABASE_ANON_KEY}` },
    body: JSON.stringify({ suspended }),
  });
  if (!res.ok) return c.json({ error: "Failed to update user" }, 500);
  return c.json({ success: true, suspended });
});

// ─── API Key Middleware for public API routes ────────────────────────────────

async function apiKeyAuth(c: any, next: any) {
  const auth = c.req.header("Authorization") || "";
  const key = auth.replace("Bearer ", "");
  if (key && key.startsWith("sf_")) {
    const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
    const { data } = await supabase.from("api_keys").select("id, user_id").eq("key_value", key).eq("revoked", false).maybeSingle();
    if (data) {
      c.set("api_key_id", data.id);
      c.set("api_user_id", data.user_id);
      supabase.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", data.id).then(() => {});
    }
  }
  await next();
}

async function logUsage(c: any, next: any) {
  await next();
  const apiKeyId = c.get("api_key_id");
  if (apiKeyId) {
    const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
    const url = new URL(c.req.url);
    supabase.from("api_usage_logs").insert({
      api_key_id: apiKeyId, user_id: c.get("api_user_id"),
      endpoint: url.pathname, method: c.req.method, status: c.res.status, ip: c.req.header("CF-Connecting-IP") || "",
    }).then(() => {});
  }
}

// ─── Existing Routes (with API key middleware) ─────────────────────────────

app.post("/api/text", apiKeyAuth, logUsage, async (c) => {
  const { text } = await c.req.json<{ text?: string }>();
  if (!text || typeof text !== "string") return c.json({ error: "Text is required" }, 400);
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
  const redis = getRedis(c.env);
  if (redis) {
    try {
      const clientIP = c.req.header("CF-Connecting-IP") || "anonymous";
      const count = await redis.incr(`ratelimit:${clientIP}`);
      if (count === 1) await redis.expire(`ratelimit:${clientIP}`, 60);
      if (count > 10) return c.json({ error: "Rate limit exceeded" }, 429);
    } catch {}
  }
  let code = "";
  for (let i = 0; i < 5; i++) {
    code = generateCode(4);
    const { data } = await supabase.from("snippets").select("id").eq("id", code).maybeSingle();
    if (!data) break;
  }
  const { error: dbError } = await supabase.from("snippets").insert({ id: code, text, views: 0 });
  if (dbError) return c.json({ error: "Database error" }, 500);
  if (redis) { try { await redis.set(`snippet:${code}`, JSON.stringify({ id: code, text, views: 0, createdAt: Date.now() }), { ex: 86400 }); } catch {} }
  const origin = new URL(c.req.url).origin;
  return c.json({ code, url: `${origin}/t/${code}` });
});

app.get("/api/text/:code", apiKeyAuth, logUsage, async (c) => {
  const code = c.req.param("code");
  const redis = getRedis(c.env);
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
  if (redis) {
    try {
      const cached: any = await redis.get(`snippet:${code}`);
      if (cached) {
        cached.views = (cached.views || 0) + 1;
        await redis.set(`snippet:${code}`, JSON.stringify(cached), { keepTtl: true });
        c.executionCtx.waitUntil((async () => { try { await supabase.rpc("increment_snippet_views", { snippet_id: code }); } catch {} })());
        return c.json(cached);
      }
    } catch {}
  }
  const { data, error } = await supabase.from("snippets").select("*").eq("id", code).maybeSingle();
  if (error || !data) return c.json({ error: "Not found" }, 404);
  const { data: updatedData } = await supabase.from("snippets").update({ views: data.views + 1 }).eq("id", code).select().maybeSingle();
  const finalData = updatedData || data;
  const snippet = { id: finalData.id, text: finalData.text, views: finalData.views, createdAt: new Date(finalData.created_at).getTime() };
  if (redis) { try { await redis.set(`snippet:${code}`, JSON.stringify(snippet), { ex: 86400 }); } catch {} }
  return c.json(snippet);
});

app.post("/api/file", apiKeyAuth, logUsage, async (c) => {
  const body = await c.req.parseBody();
  const file = body['file'] as File;
  if (!file) return c.json({ error: "File is required" }, 400);
  if (file.size > 10 * 1024 * 1024) return c.json({ error: "File must be smaller than 10MB" }, 400);
  let code = "";
  for (let i = 0; i < 5; i++) {
    code = generateCode(4);
    const existing = await c.env.BUCKET.head(code);
    if (!existing) break;
  }
  const arrayBuffer = await file.arrayBuffer();
  await c.env.BUCKET.put(code, arrayBuffer, {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
    customMetadata: { filename: file.name, size: String(file.size), mimeType: file.type || 'application/octet-stream', expiresAt: String(Date.now() + 24 * 60 * 60 * 1000) }
  });
  return c.json({ code });
});

app.post("/api/file/p2p", apiKeyAuth, logUsage, async (c) => {
  const { name, size, mimeType } = await c.req.json<any>();
  if (!name || size === undefined) return c.json({ error: "Name and size are required" }, 400);
  let code = "";
  for (let i = 0; i < 5; i++) {
    code = generateCode(4);
    const exists = await c.env.BUCKET.head(`p2p-${code}`);
    const file = await c.env.BUCKET.head(code);
    if (!exists && !file) break;
  }
  await c.env.BUCKET.put(`p2p-${code}`, JSON.stringify({ type: 'p2p', name, size, mimeType: mimeType || 'application/octet-stream', offer: null, createdAt: Date.now() }), {
    customMetadata: { expiresAt: String(Date.now() + 10 * 60 * 1000) }
  });
  return c.json({ code });
});

app.post("/api/file/p2p/:code/offer", apiKeyAuth, logUsage, async (c) => {
  const code = c.req.param("code");
  const { offer } = await c.req.json<any>();
  if (!offer) return c.json({ error: "WebRTC offer is required" }, 400);
  const obj = await c.env.BUCKET.get(`p2p-${code}`);
  if (!obj) return c.json({ error: "P2P session not found" }, 404);
  const data = JSON.parse(await obj.text());
  data.offer = offer;
  await c.env.BUCKET.put(`p2p-${code}`, JSON.stringify(data), { customMetadata: { expiresAt: String(Date.now() + 10 * 60 * 1000) } });
  return c.json({ success: true });
});

app.post("/api/file/p2p/:code/answer", async (c) => {
  const code = c.req.param("code");
  const { answer } = await c.req.json<any>();
  if (!answer) return c.json({ error: "Answer is required" }, 400);
  await c.env.BUCKET.put(`p2p-answer-${code}`, JSON.stringify({ answer }), { customMetadata: { expiresAt: String(Date.now() + 10 * 60 * 1000) } });
  return c.json({ success: true });
});

app.get("/api/file/p2p/:code/answer", async (c) => {
  const code = c.req.param("code");
  const obj = await c.env.BUCKET.get(`p2p-answer-${code}`);
  if (!obj) return c.json({ status: "waiting" });
  const data = JSON.parse(await obj.text());
  return c.json({ status: "ready", answer: data.answer });
});

app.get("/api/file/:code", apiKeyAuth, logUsage, async (c) => {
  const code = c.req.param("code");
  const fileObj = await c.env.BUCKET.head(code);
  if (fileObj) {
    const expiresAt = Number(fileObj.customMetadata?.expiresAt);
    if (expiresAt && Date.now() > expiresAt) { c.executionCtx.waitUntil(c.env.BUCKET.delete(code)); return c.json({ error: "File has expired" }, 410); }
    return c.json({ type: 'server', name: fileObj.customMetadata?.filename || 'download', size: Number(fileObj.customMetadata?.size || fileObj.size), mimeType: fileObj.customMetadata?.mimeType || 'application/octet-stream', createdAt: fileObj.uploaded.getTime() });
  }
  const p2pObj = await c.env.BUCKET.get(`p2p-${code}`);
  if (p2pObj) {
    const expiresAt = Number(p2pObj.customMetadata?.expiresAt);
    if (expiresAt && Date.now() > expiresAt) { c.executionCtx.waitUntil(c.env.BUCKET.delete(`p2p-${code}`)); return c.json({ error: "P2P session has expired" }, 410); }
    const data = JSON.parse(await p2pObj.text());
    return c.json({ type: 'p2p', name: data.name, size: data.size, mimeType: data.mimeType, createdAt: data.createdAt, offer: data.offer });
  }
  return c.json({ error: "File not found or expired" }, 404);
});

app.get("/api/file/:code/download", async (c) => {
  const code = c.req.param("code");
  const object = await c.env.BUCKET.get(code);
  if (!object) return c.json({ error: "File not found" }, 404);
  const expiresAt = Number(object.customMetadata?.expiresAt);
  if (expiresAt && Date.now() > expiresAt) { c.executionCtx.waitUntil(c.env.BUCKET.delete(code)); return c.json({ error: "File has expired" }, 410); }
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  if (object.customMetadata?.filename) headers.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(object.customMetadata.filename)}`);
  return new Response(object.body as ReadableStream, { headers });
});

export default app;
