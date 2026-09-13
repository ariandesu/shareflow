/**
 * Cloudflare Pages Function: /api/text
 * Creates a new text share snippet and returns a 4-character code and full URL.
 */

interface Env {
  TEXT_STORE?: any;
  KV?: any;
  SHAREFLOW_KV?: any;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
}

declare global {
  var __SHAREFLOW_TEXT_STORE__: Map<string, { id: string; text: string; createdAt: number; views: number }> | undefined;
}

if (!globalThis.__SHAREFLOW_TEXT_STORE__) {
  globalThis.__SHAREFLOW_TEXT_STORE__ = new Map();
}

const memoryStore = globalThis.__SHAREFLOW_TEXT_STORE__;

function generateCode(length = 4): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body = (await context.request.json().catch(() => ({}))) as any;
    const { text } = body || {};

    if (!text || typeof text !== "string" || !text.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "Text content is required." }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const code = generateCode(4);
    const now = Date.now();
    const snippet = { id: code, text: text.trim(), createdAt: now, views: 0 };

    // 1. Store in In-Memory Edge Cache
    memoryStore.set(code, snippet);

    // 2. Store in KV if bound
    const kv = context.env.TEXT_STORE || context.env.KV || context.env.SHAREFLOW_KV;
    if (kv && typeof kv.put === "function") {
      try {
        await kv.put(`snippet:${code}`, JSON.stringify(snippet), { expirationTtl: 86400 * 30 }); // 30 days
      } catch (e) {
        console.warn("[KV Put Error]", e);
      }
    }

    // 3. Store in Supabase REST API if configured
    if (context.env.SUPABASE_URL && context.env.SUPABASE_ANON_KEY) {
      try {
        await fetch(`${context.env.SUPABASE_URL}/rest/v1/snippets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: context.env.SUPABASE_ANON_KEY,
            Authorization: `Bearer ${context.env.SUPABASE_ANON_KEY}`,
            Prefer: "resolution=merge-duplicates",
          },
          body: JSON.stringify({ id: code, text: text.trim(), views: 0 }),
        });
      } catch (e) {
        console.warn("[Supabase Insert Error]", e);
      }
    }

    const origin = new URL(context.request.url).origin;
    const shareUrl = `${origin}/t/${code}`;

    return new Response(
      JSON.stringify({
        success: true,
        code,
        url: shareUrl,
        message: "Text snippet shared successfully.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || "Failed to share text." }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
