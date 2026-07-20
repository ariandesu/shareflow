import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "";

type AdminUser = { id: string; email: string; name: string; role: string; created_at: string; last_login_at: string | null };
type AdminKey = { id: string; name: string; prefix: string; user_id: string; created_at: string; revoked: boolean; users: { email: string; name: string } };
type AdminStats = { totalUsers: number; totalKeys: number; totalRequests: number; recentRequests: any[] };

export default function AdminDashboard() {
  const { user, token, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"users" | "keys" | "stats">("stats");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [keys, setKeys] = useState<AdminKey[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  if (!token || !isAdmin) return <Navigate to="/dev" replace />;

  useEffect(() => {
    fetchAll();
  }, [token, isAdmin]);

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

      <div className="flex gap-1 border-b border-white/10 mb-8">
        {(["stats", "users", "keys"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${tab === t ? "text-white border-b-2 border-white" : "text-white/30 hover:text-white/60"}`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-white/40">Loading...</p>
      ) : tab === "stats" && stats ? (
        <div>
          <div className="grid grid-cols-3 gap-4 mb-8">
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
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Recent Requests</h3>
            <div className="divide-y divide-white/5 border border-white/10 max-h-80 overflow-y-auto">
              {stats.recentRequests.map((r: any, i: number) => (
                <div key={i} className="flex items-center gap-4 p-3 text-xs font-mono">
                  <span className="text-white/40">{new Date(r.created_at).toLocaleString()}</span>
                  <span className="text-white/60 flex-1">{r.endpoint}</span>
                  <span className={`${r.status < 400 ? "text-green-400" : "text-red-400"}`}>{r.status}</span>
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
                <p className="font-medium text-white">{u.name}</p>
                <p className="text-xs text-white/40 font-mono">{u.email}</p>
                <p className="text-xs text-white/20">Joined {new Date(u.created_at).toLocaleDateString()}</p>
              </div>
              <select value={u.role} onChange={e => changeRole(u.id, e.target.value)} className="bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white font-bold uppercase tracking-widest focus:outline-none">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-white/5 border border-white/10">
          {keys.map((k) => (
            <div key={k.id} className="flex items-center gap-4 p-4 text-sm">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white">{k.name}</p>
                <p className="text-xs text-white/40 font-mono">{k.prefix}••••••••</p>
                <p className="text-xs text-white/30">by {k.users?.email || "unknown"}</p>
              </div>
              {k.revoked ? <span className="text-xs text-red-400 font-bold uppercase">Revoked</span> : <span className="text-xs text-green-400 font-bold uppercase">Active</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
