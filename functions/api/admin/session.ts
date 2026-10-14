import { type AdminEnv, clearSessionCookie, isAdminRequest, jsonResponse } from "./_auth";

export async function onRequestGet(context: { request: Request; env: AdminEnv }) {
  const authenticated = await isAdminRequest(context.request, context.env.ADMIN_SESSION_SECRET);
  return jsonResponse({ authenticated }, authenticated ? 200 : 401);
}

export async function onRequestDelete() {
  return jsonResponse({ success: true }, 200, { "Set-Cookie": clearSessionCookie() });
}
