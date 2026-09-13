/**
 * Cloudflare Pages Function: /api/text/[code]
 * Retrieves a text share snippet by its 4-character code.
 */

interface Env {
  TEXT_STORE?: any;
  KV?: any;
  SHAREFLOW_KV?: any;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
}

// Global in-memory map across warm edge functions
declare global {
  var __SHAREFLOW_TEXT_STORE__: Map<string, { id: string; text: string; createdAt: number; views: number }> | undefined;
}

if (!globalThis.__SHAREFLOW_TEXT_STORE__) {
  globalThis.__SHAREFLOW_TEXT_STORE__ = new Map();
}

const memoryStore = globalThis.__SHAREFLOW_TEXT_STORE__;

export async function onRequestGet(context: { request: Request; params: { code?: string }; env: Env }) {
  try {
    const rawCode = context.params?.code || new URL(context.request.url).pathname.split("/").pop() || "";
    const code = rawCode.trim().toUpperCase();

    if (!code) {
      return new Response(
        JSON.stringify({ success: false, error: "Snippet code is required." }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    let snippet: { id: string; text: string; createdAt: number; views: number } | null = null;

    // 1. Check KV if bound
    const kv = context.env.TEXT_STORE || context.env.KV || context.env.SHAREFLOW_KV;
    if (kv && typeof kv.get === "function") {
      try {
        const raw = await kv.get(`snippet:${code}`);
        if (raw) {
          snippet = JSON.parse(raw);
        }
      } catch (e) {
        console.warn("[KV Get Error]", e);
      }
    }

    // 2. Check Supabase REST API if not found in KV
    if (!snippet && context.env.SUPABASE_URL && context.env.SUPABASE_ANON_KEY) {
      try {
        const res = await fetch(`${context.env.SUPABASE_URL}/rest/v1/snippets?id=eq.${code}&select=*`, {
          headers: {
            apikey: context.env.SUPABASE_ANON_KEY,
            Authorization: `Bearer ${context.env.SUPABASE_ANON_KEY}`,
          },
        });
        if (res.ok) {
          const rows = (await res.json()) as any[];
          if (rows && rows.length > 0) {
            snippet = {
              id: rows[0].id,
              text: rows[0].text,
              createdAt: rows[0].created_at ? new Date(rows[0].created_at).getTime() : Date.now(),
              views: Number(rows[0].views || 0),
            };
          }
        }
      } catch (e) {
        console.warn("[Supabase Get Error]", e);
      }
    }

    // 3. Fallback to In-Memory Edge Cache
    if (!snippet && memoryStore.has(code)) {
      snippet = memoryStore.get(code)!;
    }

    if (!snippet) {
      return new Response(
        JSON.stringify({ success: false, error: "Text snippet not found or expired." }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Increment views
    snippet.views = (snippet.views || 0) + 1;
    memoryStore.set(code, snippet);

    if (kv && typeof kv.put === "function") {
      try {
        await kv.put(`snippet:${code}`, JSON.stringify(snippet), { expirationTtl: 86400 * 30 });
      } catch (e) {}
    }

    return new Response(
      JSON.stringify({
        success: true,
        id: snippet.id,
        code: snippet.id,
        text: snippet.text,
        createdAt: snippet.createdAt,
        views: snippet.views,
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
      JSON.stringify({ success: false, error: err?.message || "Failed to retrieve text snippet." }),
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
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
