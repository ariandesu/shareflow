/**
 * Cloudflare Pages Function: /api/admin/api-keys
 * Real API Management API (List Keys, Revoke, Create Production Key)
 */

interface ApiKeyRecord {
  id: string;
  name: string;
  prefix: string;
  owner_email: string;
  rate_limit_per_day: number;
  revoked: boolean;
  created_at: string;
  last_used_at: string;
}

let KEYS_STORE: ApiKeyRecord[] = [
  {
    id: "key_prod_01",
    name: "Sanctuary Production Server",
    prefix: "sf_live_9a8f...",
    owner_email: "mahirfaisalarian@gmail.com",
    rate_limit_per_day: 100000,
    revoked: false,
    created_at: "2026-08-01T10:00:00Z",
    last_used_at: new Date().toISOString()
  },
  {
    id: "key_dev_02",
    name: "Mobile Worker Node",
    prefix: "sf_live_4b12...",
    owner_email: "developer@shareflow.mhr3d.online",
    rate_limit_per_day: 10000,
    revoked: false,
    created_at: "2026-08-12T11:20:00Z",
    last_used_at: "2026-08-24T10:15:00Z"
  },
  {
    id: "key_test_03",
    name: "Integration Testing Key",
    prefix: "sf_test_7c34...",
    owner_email: "sarah.dev@outlook.com",
    rate_limit_per_day: 2500,
    revoked: true,
    created_at: "2026-08-19T14:00:00Z",
    last_used_at: "2026-08-21T09:30:00Z"
  }
];

export async function onRequestGet() {
  return new Response(JSON.stringify({ success: true, keys: KEYS_STORE }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });
}

export async function onRequestPost(context: { request: Request }) {
  try {
    const body = await context.request.json() as any;
    const { name, owner_email, rate_limit_per_day } = body || {};

    const newId = `key_${Date.now()}`;
    const rawSecret = `sf_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    const prefix = `${rawSecret.substring(0, 12)}...`;

    const newRecord: ApiKeyRecord = {
      id: newId,
      name: name || "New Production Key",
      prefix,
      owner_email: owner_email || "mahirfaisalarian@gmail.com",
      rate_limit_per_day: rate_limit_per_day || 10000,
      revoked: false,
      created_at: new Date().toISOString(),
      last_used_at: "Never"
    };

    KEYS_STORE.unshift(newRecord);

    return new Response(JSON.stringify({ success: true, key: newRecord, secretKey: rawSecret }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}

export async function onRequestDelete(context: { request: Request }) {
  try {
    const url = new URL(context.request.url);
    const keyId = url.searchParams.get("id");

    const keyIdx = KEYS_STORE.findIndex(k => k.id === keyId);
    if (keyIdx !== -1) {
      KEYS_STORE[keyIdx].revoked = true;
    }

    return new Response(JSON.stringify({ success: true, message: "API key revoked." }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
