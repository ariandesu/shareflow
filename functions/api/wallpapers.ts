/**
 * Cloudflare Pages Function: /api/wallpapers
 * Serves lossless 8K/OLED/Dual-monitor wallpaper bundle catalog and handles admin curation.
 */

import wallpapersData from "../../data/wallpapers.json";
import { type AdminEnv, isAdminRequest, jsonResponse } from "./admin/_auth";

interface Env extends AdminEnv {}

export async function onRequestGet(context: { request: Request; env: Env }) {
  try {
    const url = new URL(context.request.url);
    const category = url.searchParams.get("category");
    const includeInactive = url.searchParams.get("all") === "true" &&
      await isAdminRequest(context.request, context.env.ADMIN_SESSION_SECRET);

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
    return jsonResponse({ success: false, error: err?.message || "Failed to load wallpapers" }, 500);
  }
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  if (!await isAdminRequest(context.request, context.env.ADMIN_SESSION_SECRET)) return jsonResponse({ success: false, error: "Admin authentication required." }, 401);
  if (!context.env.SHAREFLOW_KV) return jsonResponse({ success: false, error: "Catalog storage is not configured." }, 503);
  let body: Record<string, unknown>;
  try { body = await context.request.json() as Record<string, unknown>; }
  catch { return jsonResponse({ success: false, error: "Invalid JSON body." }, 400); }
  if (typeof body.title !== "string" || !body.title.trim()) return jsonResponse({ success: false, error: "Title is required." }, 400);
  try {
    const stored = await context.env.SHAREFLOW_KV.get<any[]>("shareflow_wallpapers", { type: "json" });
    const items = Array.isArray(stored) && stored.length ? stored : (wallpapersData as any[]);
    const id = typeof body.id === "string" && body.id ? body.id : body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (items.some((item) => item.id === id)) return jsonResponse({ success: false, error: "A wallpaper with this ID already exists." }, 409);
    const wallpaper = { ...body, id, active: true, createdAt: new Date().toISOString() };
    await context.env.SHAREFLOW_KV.put("shareflow_wallpapers", JSON.stringify([wallpaper, ...items]));
    return jsonResponse({ success: true, wallpaper });
  } catch { return jsonResponse({ success: false, error: "Could not save wallpaper catalog." }, 500); }
}

export async function onRequestPatch(context: { request: Request; env: Env }) {
  if (!await isAdminRequest(context.request, context.env.ADMIN_SESSION_SECRET)) return jsonResponse({ success: false, error: "Admin authentication required." }, 401);
  if (!context.env.SHAREFLOW_KV) return jsonResponse({ success: false, error: "Catalog storage is not configured." }, 503);
  const id = new URL(context.request.url).searchParams.get("id");
  if (!id) return jsonResponse({ success: false, error: "Wallpaper ID is required." }, 400);
  try {
    const stored = await context.env.SHAREFLOW_KV.get<any[]>("shareflow_wallpapers", { type: "json" });
    const items = Array.isArray(stored) && stored.length ? stored : (wallpapersData as any[]);
    const wallpaper = items.find((item) => item.id === id);
    if (!wallpaper) return jsonResponse({ success: false, error: "Wallpaper not found." }, 404);
    wallpaper.active = wallpaper.active === false;
    await context.env.SHAREFLOW_KV.put("shareflow_wallpapers", JSON.stringify(items));
    return jsonResponse({ success: true, wallpaper });
  } catch { return jsonResponse({ success: false, error: "Could not update wallpaper catalog." }, 500); }
}

export async function onRequestDelete(context: { request: Request; env: Env }) {
  if (!await isAdminRequest(context.request, context.env.ADMIN_SESSION_SECRET)) return jsonResponse({ success: false, error: "Admin authentication required." }, 401);
  if (!context.env.SHAREFLOW_KV) return jsonResponse({ success: false, error: "Catalog storage is not configured." }, 503);
  const id = new URL(context.request.url).searchParams.get("id");
  if (!id) return jsonResponse({ success: false, error: "Wallpaper ID is required." }, 400);
  try {
    const stored = await context.env.SHAREFLOW_KV.get<any[]>("shareflow_wallpapers", { type: "json" });
    const items = Array.isArray(stored) && stored.length ? stored : (wallpapersData as any[]);
    const next = items.filter((item) => item.id !== id);
    if (next.length === items.length) return jsonResponse({ success: false, error: "Wallpaper not found." }, 404);
    await context.env.SHAREFLOW_KV.put("shareflow_wallpapers", JSON.stringify(next));
    return jsonResponse({ success: true });
  } catch { return jsonResponse({ success: false, error: "Could not update wallpaper catalog." }, 500); }
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
