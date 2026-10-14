export interface AdminKV {
  get<T = unknown>(key: string, options: { type: "json" }): Promise<T | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface AdminEnv {
  SHAREFLOW_KV?: AdminKV;
  ADMIN_PASSWORD?: string;
  ADMIN_SESSION_SECRET?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_HOME_CHANNEL?: string;
}

export const ADMIN_EMAIL = "mahirfaisalarian@gmail.com";
export const SESSION_COOKIE = "sf_admin_session";
export const SESSION_TTL_SECONDS = 8 * 60 * 60;

export function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
  });
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function decodeBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function hmac(secret: string, value: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
}

export async function createAdminSession(secret: string, now = Date.now()): Promise<string> {
  const payload = encodeBase64Url(new TextEncoder().encode(JSON.stringify({
    sub: ADMIN_EMAIL,
    iat: Math.floor(now / 1000),
    exp: Math.floor(now / 1000) + SESSION_TTL_SECONDS,
  })));
  const signature = encodeBase64Url(await hmac(secret, payload));
  return `${payload}.${signature}`;
}

export async function isAdminRequest(request: Request, secret?: string, now = Date.now()): Promise<boolean> {
  if (!secret || secret.length < 32) return false;
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookie = cookieHeader.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  if (!cookie) return false;

  const token = cookie.slice(SESSION_COOKIE.length + 1);
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  try {
    const validSignature = await crypto.subtle.verify(
      "HMAC",
      await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]),
      decodeBase64Url(parts[1]),
      new TextEncoder().encode(parts[0]),
    );
    if (!validSignature) return false;
    const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[0]))) as { sub?: string; exp?: number; iat?: number };
    const nowSeconds = Math.floor(now / 1000);
    return payload.sub === ADMIN_EMAIL && typeof payload.exp === "number" && payload.exp > nowSeconds &&
      typeof payload.iat === "number" && payload.iat <= nowSeconds + 60;
  } catch {
    return false;
  }
}

export function sessionCookie(value: string): string {
  return `${SESSION_COOKIE}=${value}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; Secure; SameSite=Strict`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
}
