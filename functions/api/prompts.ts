/** Cloudflare Pages Function: public prompt catalog and authenticated catalog management. */
import promptsData from "../../data/prompts.json";
import { type AdminEnv, isAdminRequest, jsonResponse } from "./admin/_auth";

interface Env extends AdminEnv {}
type Prompt = Record<string, unknown> & { id: string; active?: boolean; isFree?: boolean; category?: string; targetTool?: string };
const KV_KEY = "shareflow_prompts";

async function loadPrompts(env: Env): Promise<Prompt[]> {
  if (env.SHAREFLOW_KV) {
    const stored = await env.SHAREFLOW_KV.get<Prompt[]>(KV_KEY, { type: "json" });
    if (Array.isArray(stored)) return stored;
  }
  return promptsData as Prompt[];
}

async function savePrompts(env: Env, prompts: Prompt[]): Promise<void> {
  if (!env.SHAREFLOW_KV) throw new Error("Catalog storage is not configured.");
  await env.SHAREFLOW_KV.put(KV_KEY, JSON.stringify(prompts));
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function onRequestGet(context: { request: Request; env: Env }) {
  try {
    const url = new URL(context.request.url);
    const includeInactive = url.searchParams.get("all") === "true" && await isAdminRequest(context.request, context.env.ADMIN_SESSION_SECRET);
    let prompts = await loadPrompts(context.env);
    if (!includeInactive) prompts = prompts.filter((prompt) => prompt.active !== false);
    const category = url.searchParams.get("category");
    const tool = url.searchParams.get("tool");
    const freeOnly = url.searchParams.get("free") === "true";
    if (category && category !== "All") prompts = prompts.filter((prompt) => prompt.category === category);
    if (tool && tool !== "All") prompts = prompts.filter((prompt) => prompt.targetTool === tool);
    if (freeOnly) prompts = prompts.filter((prompt) => prompt.isFree === true);
    const safePrompts = prompts.map((prompt) => prompt.isFree === false
      ? { ...prompt, promptContent: "Purchase to download the complete prompt collection." }
      : prompt);
    return jsonResponse({ success: true, prompts: safePrompts, total: safePrompts.length }, 200, { "Cache-Control": "public, max-age=60" });
  } catch {
    return jsonResponse({ success: false, error: "Failed to load prompts." }, 500);
  }
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  if (!await isAdminRequest(context.request, context.env.ADMIN_SESSION_SECRET)) return jsonResponse({ success: false, error: "Admin authentication required." }, 401);
  if (!context.env.SHAREFLOW_KV) return jsonResponse({ success: false, error: "Catalog storage is not configured." }, 503);
  let body: Record<string, unknown>;
  try { body = await context.request.json() as Record<string, unknown>; }
  catch { return jsonResponse({ success: false, error: "Invalid JSON body." }, 400); }
  if (typeof body.title !== "string" || typeof body.promptContent !== "string" || !body.title.trim() || !body.promptContent.trim()) {
    return jsonResponse({ success: false, error: "Title and prompt content are required." }, 400);
  }
  try {
    const prompts = await loadPrompts(context.env);
    const id = typeof body.id === "string" && body.id ? body.id : slug(body.title);
    if (prompts.some((prompt) => prompt.id === id)) return jsonResponse({ success: false, error: "A prompt with this ID already exists." }, 409);
    const prompt = { ...body, id, active: true, copyCount: 0, createdAt: new Date().toISOString() } as Prompt;
    await savePrompts(context.env, [prompt, ...prompts]);
    return jsonResponse({ success: true, prompt });
  } catch { return jsonResponse({ success: false, error: "Could not save the prompt catalog." }, 500); }
}

export async function onRequestPatch(context: { request: Request; env: Env }) {
  if (!await isAdminRequest(context.request, context.env.ADMIN_SESSION_SECRET)) return jsonResponse({ success: false, error: "Admin authentication required." }, 401);
  if (!context.env.SHAREFLOW_KV) return jsonResponse({ success: false, error: "Catalog storage is not configured." }, 503);
  const id = new URL(context.request.url).searchParams.get("id");
  if (!id) return jsonResponse({ success: false, error: "Prompt ID is required." }, 400);
  try {
    const prompts = await loadPrompts(context.env);
    const prompt = prompts.find((item) => item.id === id);
    if (!prompt) return jsonResponse({ success: false, error: "Prompt not found." }, 404);
    let body: Record<string, unknown> = {};
    try { body = await context.request.json() as Record<string, unknown>; } catch { /* Toggle does not require a body. */ }
    if (body.action === "toggle") prompt.active = prompt.active === false;
    if (typeof body.isFree === "boolean") prompt.isFree = body.isFree;
    if (typeof body.priceBdt === "number") prompt.priceBdt = body.priceBdt;
    if (typeof body.priceUsd === "number") prompt.priceUsd = body.priceUsd;
    await savePrompts(context.env, prompts);
    return jsonResponse({ success: true, prompt });
  } catch { return jsonResponse({ success: false, error: "Could not update the prompt catalog." }, 500); }
}

export async function onRequestDelete(context: { request: Request; env: Env }) {
  if (!await isAdminRequest(context.request, context.env.ADMIN_SESSION_SECRET)) return jsonResponse({ success: false, error: "Admin authentication required." }, 401);
  if (!context.env.SHAREFLOW_KV) return jsonResponse({ success: false, error: "Catalog storage is not configured." }, 503);
  const id = new URL(context.request.url).searchParams.get("id");
  if (!id) return jsonResponse({ success: false, error: "Prompt ID is required." }, 400);
  try {
    const prompts = await loadPrompts(context.env);
    const next = prompts.filter((prompt) => prompt.id !== id);
    if (next.length === prompts.length) return jsonResponse({ success: false, error: "Prompt not found." }, 404);
    await savePrompts(context.env, next);
    return jsonResponse({ success: true });
  } catch { return jsonResponse({ success: false, error: "Could not update the prompt catalog." }, 500); }
}
