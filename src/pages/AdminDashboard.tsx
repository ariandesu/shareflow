import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "";

type AdminUser = { id: string; email: string; name: string; role: string; created_at: string; last_login_at: string | null; total_requests: number; suspended: boolean };
type AdminKey = { id: string; name: string; key_value?: string; prefix?: string; user_id: string; created_at: string; revoked?: boolean; users: { email: string; name: string } };
type AdminStats = { totalUsers: number; totalKeys: number; totalRequests: number; recentRequests: any[]; topUsers: { id: string; email: string; name: string; requests: number }[] };
type UserUsage = { keys: any[]; usage: any[] };

export default function AdminDashboard() {
  const { user, token, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"stats" | "users" | "keys" | "user-usage">("stats");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [keys, setKeys] = useState<AdminKey[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userUsage, setUserUsage] = useState<UserUsage | null>(null);
  const [usageLoading, setUsageLoading] = useState(false);

  if (!token || !isAdmin) return <Navigate to="/dev" replace />;

  useEffect(() => { fetchAll(); }, [token, isAdmin]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [usersRes, keysRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/users`, { headers }),
        fetch(`${API_BASE}/api/admin/keys`, { headers }),
        fetch(`${API_BASE}/api/admin/stats`, { headers }),
      ]);
      if (usersRes.ok) { const d = await usersRes.json(); setUsers(d.users); }
      if (keysRes.ok) { const d = await keysRes.json(); setKeys(d.keys); }
      if (statsRes.ok) { const d = await statsRes.json(); setStats(d); }
    } catch {}
    setLoading(false);
  };

  const changeRole = async (userId: string, role: string) => {
    if (!token) return;
    await fetch(`${API_BASE}/api/admin/users/${userId}/role`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ role }) });
    fetchAll();
  };

  const toggleSuspend = async (userId: string, current: boolean) => {
    if (!token) return;
    await fetch(`${API_BASE}/api/admin/users/${userId}/suspend`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ suspended: !current }) });
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, suspended: !current } : u));
  };

  const showUserUsage = async (userId: string) => {
    setSelectedUserId(userId);
    setUsageLoading(true);
    setTab("user-usage");
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userId}/usage`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setUserUsage(await res.json());
    } catch {}
    setUsageLoading(false);
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-1">Admin Panel</h1>
          <p className="text-white/50 text-sm">System management</p>
        </div>
        <button onClick={() => navigate("/dev/dashboard")} className="px-4 py-2 bg-white/5 border border-white/10 text-white/50 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
          Dashboard
        </button>
      </div>

      <div className="flex gap-1 border-b border-white/10 mb-8 overflow-x-auto">
        {(["stats", "users", "keys", "user-usage"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${tab === t ? "text-white border-b-2 border-white" : "text-white/30 hover:text-white/60"}`}>
            {t === "user-usage" ? "User Usage" : t}
          </button>
        ))}
      </div>

      {loading && tab !== "user-usage" ? (
        <p className="text-sm text-white/40">Loading...</p>
      ) : tab === "stats" && stats ? (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 p-6 text-center">
              <p className="text-3xl font-black text-white">{stats.totalUsers}</p>
              <p className="text-xs text-white/30 font-bold uppercase tracking-widest mt-1">Users</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 text-center">
              <p className="text-3xl font-black text-white">{stats.totalKeys}</p>
              <p className="text-xs text-white/30 font-bold uppercase tracking-widest mt-1">API Keys</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 text-center">
              <p className="text-3xl font-black text-white">{stats.totalRequests}</p>
              <p className="text-xs text-white/30 font-bold uppercase tracking-widest mt-1">Requests</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 text-center">
              <p className="text-3xl font-black text-white">{stats.topUsers?.length || 0}</p>
              <p className="text-xs text-white/30 font-bold uppercase tracking-widest mt-1">Active Users</p>
            </div>
          </div>

          {stats.topUsers && stats.topUsers.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Top Users by Requests</h3>
              <div className="divide-y divide-white/5 border border-white/10">
                {stats.topUsers.map((u, i) => (
                  <div key={u.id} className="flex items-center gap-4 p-3 text-sm">
                    <span className="text-xs font-bold text-white/20 w-6">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{u.name}</p>
                      <p className="text-xs text-white/40 font-mono truncate">{u.email}</p>
                    </div>
                    <span className="text-sm font-bold text-white">{u.requests.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Recent Requests</h3>
            <div className="divide-y divide-white/5 border border-white/10 max-h-80 overflow-y-auto">
              {stats.recentRequests.map((r: any, i: number) => (
                <div key={i} className="flex items-center gap-4 p-3 text-xs font-mono">
                  <span className="text-white/40 w-32 shrink-0">{new Date(r.created_at).toLocaleString()}</span>
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold uppercase shrink-0 ${r.method === "GET" ? "text-green-400 bg-green-400/10" : "text-blue-400 bg-blue-400/10"}`}>{r.method || "GET"}</span>
                  <span className="text-white/60 flex-1 truncate">{r.endpoint}</span>
                  <span className={`shrink-0 ${r.status < 400 ? "text-green-400" : "text-red-400"}`}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : tab === "users" ? (
        <div className="divide-y divide-white/5 border border-white/10">
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-4 p-4 text-sm">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white truncate">{u.name}</p>
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 ${u.role === "admin" ? "text-yellow-400 bg-yellow-400/10" : u.suspended ? "text-red-400 bg-red-400/10" : "text-green-400 bg-green-400/10"}`}>
                    {u.suspended ? "Suspended" : u.role}
                  </span>
                </div>
                <p className="text-xs text-white/40 font-mono">{u.email}</p>
                <div className="flex gap-4 mt-1 text-xs text-white/20">
                  <span>Joined {new Date(u.created_at).toLocaleDateString()}</span>
                  <span>{u.total_requests} requests</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => showUserUsage(u.id)} className="px-2 py-1.5 bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                  Usage
                </button>
                <select value={u.role} onChange={e => changeRole(u.id, e.target.value)} className="bg-white/5 border border-white/10 px-2 py-1.5 text-[10px] text-white font-bold uppercase tracking-widest focus:outline-none">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button onClick={() => toggleSuspend(u.id, u.suspended)} className={`px-2 py-1.5 border text-[10px] font-bold uppercase tracking-widest transition-colors ${u.suspended ? "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20" : "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"}`}>
                  {u.suspended ? "Unsuspend" : "Suspend"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : tab === "user-usage" && selectedUserId ? (
        <div>
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => { setTab("users"); setSelectedUserId(null); setUserUsage(null); }} className="text-xs text-white/40 hover:text-white">&larr; Back to Users</button>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/30">User Usage</h3>
          </div>
          {usageLoading ? (
            <p className="text-sm text-white/40">Loading...</p>
          ) : userUsage ? (
            <div>
              {userUsage.keys.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">API Keys ({userUsage.keys.length})</h4>
                  <div className="divide-y divide-white/5 border border-white/10">
                    {userUsage.keys.map((k: any) => (
                      <div key={k.id} className="flex items-center gap-4 p-3 text-sm">
                        <span className="text-white font-medium">{k.name}</span>
                        <code className="text-xs text-white/40 font-mono">{k.key_value?.substring(0, 14)}••••••</code>
                        <span className="text-xs text-white/20 ml-auto">Created {new Date(k.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Recent Requests ({userUsage.usage.length})</h4>
                {userUsage.usage.length === 0 ? (
                  <p className="text-sm text-white/40">No requests yet.</p>
                ) : (
                  <div className="divide-y divide-white/5 border border-white/10 max-h-96 overflow-y-auto">
                    {userUsage.usage.map((log: any) => (
                      <div key={log.id} className="flex items-center gap-4 p-3 text-xs font-mono">
                        <span className="text-white/40 w-32 shrink-0">{new Date(log.created_at).toLocaleString()}</span>
                        <span className={`px-1.5 py-0.5 text-[10px] font-bold uppercase shrink-0 ${log.method === "GET" ? "text-green-400 bg-green-400/10" : "text-blue-400 bg-blue-400/10"}`}>{log.method}</span>
                        <span className="text-white/60 flex-1 truncate">{log.endpoint}</span>
                        <span className={`shrink-0 ${log.status < 400 ? "text-green-400" : "text-red-400"}`}>{log.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/40">Select a user to view usage</p>
          )}
        </div>
      ) : tab === "usage" && !selectedUserId ? (
        <p className="text-sm text-white/40">Select a user from the Users tab to view usage details.</p>
      ) : (
        <div className="divide-y divide-white/5 border border-white/10">
          {keys.map((k) => (
            <div key={k.id} className="flex items-center gap-4 p-4 text-sm">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white">{k.name}</p>
                <p className="text-xs text-white/40 font-mono">{k.key_value?.substring(0, 14) || k.prefix || "••••"}••••••</p>
                <p className="text-xs text-white/30">by {k.users?.email || "unknown"}</p>
              </div>
              <span className={`text-xs font-bold uppercase ${k.revoked ? "text-red-400" : "text-green-400"}`}>{k.revoked ? "Revoked" : "Active"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
