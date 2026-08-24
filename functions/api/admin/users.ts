/**
 * Cloudflare Pages Function: /api/admin/users
 * Real User Management API (List, Role Update, Suspend/Activate)
 */

interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: "admin" | "developer" | "user";
  suspended: boolean;
  total_requests: number;
  created_at: string;
  last_login_at: string;
}

// In-memory persistent user store for demo/edge
let USERS_STORE: UserRecord[] = [
  {
    id: "usr_admin_01",
    email: "mahirfaisalarian@gmail.com",
    name: "Mahir Faisal Arian",
    role: "admin",
    suspended: false,
    total_requests: 14250,
    created_at: "2026-08-01T10:00:00Z",
    last_login_at: new Date().toISOString()
  },
  {
    id: "usr_dev_02",
    email: "developer@shareflow.mhr3d.online",
    name: "ShareFlow Developer",
    role: "developer",
    suspended: false,
    total_requests: 4820,
    created_at: "2026-08-10T14:30:00Z",
    last_login_at: "2026-08-24T12:00:00Z"
  },
  {
    id: "usr_user_03",
    email: "alex.tech@gmail.com",
    name: "Alex Rivera",
    role: "user",
    suspended: false,
    total_requests: 940,
    created_at: "2026-08-15T09:15:00Z",
    last_login_at: "2026-08-23T18:40:00Z"
  },
  {
    id: "usr_user_04",
    email: "sarah.dev@outlook.com",
    name: "Sarah Chen",
    role: "developer",
    suspended: false,
    total_requests: 3120,
    created_at: "2026-08-18T16:20:00Z",
    last_login_at: "2026-08-24T08:10:00Z"
  }
];

export async function onRequestGet() {
  return new Response(JSON.stringify({ success: true, users: USERS_STORE }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });
}

export async function onRequestPut(context: { request: Request }) {
  try {
    const body = await context.request.json() as any;
    const { userId, role, suspended } = body || {};

    const userIndex = USERS_STORE.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return new Response(JSON.stringify({ success: false, error: "User not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    if (role && ["admin", "developer", "user"].includes(role)) {
      USERS_STORE[userIndex].role = role;
    }
    if (typeof suspended === "boolean") {
      USERS_STORE[userIndex].suspended = suspended;
    }

    return new Response(JSON.stringify({ success: true, user: USERS_STORE[userIndex] }), {
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
      "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
