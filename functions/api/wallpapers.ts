/**
 * Cloudflare Pages Function: /api/wallpapers
 * Serves lossless 8K/OLED/Dual-monitor wallpaper bundle catalog and handles admin curation.
 */

import wallpapersData from "../../data/wallpapers.json";

interface Env {
  SHAREFLOW_KV?: any;
}

export async function onRequestGet(context: { request: Request; env: Env }) {
  try {
    const url = new URL(context.request.url);
    const category = url.searchParams.get("category");
    const includeInactive = url.searchParams.get("all") === "true";

    // Attempt to load from KV if available, otherwise fallback to bundled static data
    let bundles: any[] = [];
    if (context.env?.SHAREFLOW_KV) {
      try {
        const stored = await context.env.SHAREFLOW_KV.get("shareflow_wallpapers", { type: "json" });
        if (Array.isArray(stored) && stored.length > 0) {
          bundles = stored;
        }
      } catch (kvErr) {
        console.warn("[KV Wallpapers Load Error]", kvErr);
      }
    }

    if (bundles.length === 0) {
      bundles = wallpapersData as any[];
    }

    let filtered = bundles;
    if (!includeInactive) {
      filtered = filtered.filter((w) => w.active !== false);
    }
    if (category && category !== "All") {
      filtered = filtered.filter((w) => w.category === category);
    }

    return new Response(JSON.stringify({ success: true, wallpapers: filtered, total: filtered.length }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message || "Failed to load wallpapers" }), {
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
