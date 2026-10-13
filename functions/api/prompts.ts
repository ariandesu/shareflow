/**
 * Cloudflare Pages Function: /api/prompts
 * Serves AI website design prompts (Free SuperDesign giveaways + Low-cost SupportKori bundles)
 */

import promptsData from "../../data/prompts.json";

interface Env {
  SHAREFLOW_KV?: any;
}

export async function onRequestGet(context: { request: Request; env: Env }) {
  try {
    const url = new URL(context.request.url);
    const category = url.searchParams.get("category");
    const tool = url.searchParams.get("tool");
    const freeOnly = url.searchParams.get("free") === "true";
    const includeInactive = url.searchParams.get("all") === "true";

    let prompts: any[] = [];
    if (context.env?.SHAREFLOW_KV) {
      try {
        const stored = await context.env.SHAREFLOW_KV.get("shareflow_prompts", { type: "json" });
        if (Array.isArray(stored) && stored.length > 0) {
          prompts = stored;
        }
      } catch (kvErr) {
        console.warn("[KV Prompts Load Error]", kvErr);
      }
    }

    if (prompts.length === 0) {
      prompts = promptsData as any[];
    }

    let filtered = prompts;
    if (!includeInactive) {
      filtered = filtered.filter((p) => p.active !== false);
    }
    if (category && category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (tool && tool !== "All") {
      filtered = filtered.filter((p) => p.targetTool === tool);
    }
    if (freeOnly) {
      filtered = filtered.filter((p) => p.isFree === true);
    }

    return new Response(JSON.stringify({ success: true, prompts: filtered, total: filtered.length }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message || "Failed to load prompts" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
