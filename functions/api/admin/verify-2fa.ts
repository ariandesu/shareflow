/** Cloudflare Pages Function: verify Telegram challenge and issue HttpOnly session. */
import { type AdminEnv, createAdminSession, jsonResponse, sessionCookie } from "./_auth";

export async function onRequestPost(context: { request: Request; env: AdminEnv }) {
  const { env } = context;
  const kv = env.SHAREFLOW_KV;
  if (!kv || !env.ADMIN_SESSION_SECRET || env.ADMIN_SESSION_SECRET.length < 32) {
    return jsonResponse({ success: false, error: "Admin sign-in is not configured. Contact the site administrator." }, 503);
  }

  let body: { email?: unknown; code?: unknown };
  try {
    body = await context.request.json() as typeof body;
  } catch {
    return jsonResponse({ success: false, error: "Invalid request." }, 400);
  }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (email !== "mahirfaisalarian@gmail.com" || !/^\d{6}$/.test(code)) {
    return jsonResponse({ success: false, error: "Enter the six-digit code sent to the admin Telegram." }, 400);
  }

  const key = `admin:2fa:${email}`;
  const challenge = await kv.get<{ salt: string; hash: string; attempts: number }>(key, { type: "json" });
  if (!challenge) return jsonResponse({ success: false, error: "Code expired. Request a new one." }, 401);
  if (challenge.attempts >= 5) {
    await kv.delete(key);
    return jsonResponse({ success: false, error: "Too many incorrect attempts. Request a new code." }, 429);
  }
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${challenge.salt}:${code}`));
  const supplied = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  if (supplied !== challenge.hash) {
    await kv.put(key, JSON.stringify({ ...challenge, attempts: challenge.attempts + 1 }), { expirationTtl: 300 });
    return jsonResponse({ success: false, error: "Incorrect verification code." }, 401);
  }

  await kv.delete(key);
  const session = await createAdminSession(env.ADMIN_SESSION_SECRET);
  return jsonResponse({ success: true, message: "Admin sign-in successful." }, 200, {
    "Set-Cookie": sessionCookie(session),
  });
}
