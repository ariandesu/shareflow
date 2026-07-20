import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "";

type ApiKey = { id: string; name: string; prefix: string; created_at: string; last_used_at: string | null; revoked: boolean };
type UsageLog = { id: string; api_key_id: string; endpoint: string; method: string; status: number; created_at: string };

export default function DeveloperDashboard() {
  const { user, token, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [usage, setUsage] = useState<UsageLog[]>([]);
  const [keyName, setKeyName] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  if (!token) return <Navigate to="/dev/login" replace />;

  useEffect(() => {
    fetchKeys();
  }, [token]);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const [keysRes, usageRes] = await Promise.all([
        fetch(`${API_BASE}/api/keys`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/keys/usage`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (keysRes.ok) { const d = await keysRes.json(); setKeys(d.keys); }
      if (usageRes.ok) { const d = await usageRes.json(); setUsage(d.usage); }
    } catch {}
    setLoading(false);
  };

  const createKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim() || !token) return;
    const res = await fetch(`${API_BASE}/api/keys`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ name: keyName }) });
    if (res.ok) {
      const d = await res.json();
      setNewKey(d.key);
      setKeyName("");
      fetchKeys();
    }
  };

  const revokeKey = async (id: string) => {
    if (!token) return;
    await fetch(`${API_BASE}/api/keys/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchKeys();
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  if (!user) return null;

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full py-8 px-4">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-1">Dashboard</h1>
          <p className="text-white/50 text-sm">Welcome back, {user.name}</p>
        </div>
        <div className="flex gap-3">
          {isAdmin && (
            <button onClick={() => navigate("/dev/admin")} className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold uppercase tracking-widest hover:bg-yellow-500/20 transition-colors">
              Admin
            </button>
          )}
          <button onClick={() => { logout(); navigate("/dev"); }} className="px-4 py-2 bg-white/5 border border-white/10 text-white/50 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
            Sign Out
          </button>
        </div>
      </div>

      {newKey && (
        <div className="bg-green-500/10 border border-green-500/30 p-4 mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-green-400 mb-2">API Key Created — Copy it now, it won't be shown again.</p>
          <div className="flex gap-2">
            <code className="flex-1 bg-black/40 p-3 text-sm font-mono text-green-400 break-all">{newKey}</code>
            <button onClick={() => copyKey(newKey)} className="px-3 py-2 bg-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-colors whitespace-nowrap">Copy</button>
          </div>
          <button onClick={() => setNewKey(null)} className="mt-2 text-xs text-white/40 hover:text-white/70">Dismiss</button>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 p-6 mb-8">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Create API Key</h3>
        <form onSubmit={createKey} className="flex gap-3">
          <input type="text" value={keyName} onChange={e => setKeyName(e.target.value)} placeholder="e.g., Production, Dev Server" className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors" />
          <button type="submit" className="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-white/80 transition-colors whitespace-nowrap">Generate</button>
        </form>
      </div>

      <div className="mb-8">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Your API Keys</h3>
        {loading ? (
          <p className="text-sm text-white/40">Loading...</p>
        ) : keys.length === 0 ? (
          <p className="text-sm text-white/40">No API keys yet. Create one above.</p>
        ) : (
          <div className="divide-y divide-white/5 border border-white/10">
            {keys.map((key) => (
              <div key={key.id} className="flex items-center gap-4 p-4 text-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{key.name}</p>
                  <p className="text-xs text-white/30 font-mono mt-0.5">{key.prefix}••••••••</p>
                  <p className="text-xs text-white/20 mt-0.5">Created {new Date(key.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  {key.revoked ? (
                    <span className="text-xs text-red-400 font-bold uppercase">Revoked</span>
                  ) : (
                    <button onClick={() => revokeKey(key.id)} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest hover:bg-red-500/20 transition-colors">
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Recent API Usage</h3>
        {usage.length === 0 ? (
          <p className="text-sm text-white/40">No API usage yet. Start building!</p>
        ) : (
          <div className="divide-y divide-white/5 border border-white/10 max-h-80 overflow-y-auto">
            {usage.map((log) => (
              <div key={log.id} className="flex items-center gap-4 p-3 text-xs font-mono">
                <span className="text-white/40">{new Date(log.created_at).toLocaleString()}</span>
                <span className={`px-1.5 py-0.5 text-[10px] font-bold uppercase ${log.method === "GET" ? "text-green-400 bg-green-400/10" : "text-blue-400 bg-blue-400/10"}`}>{log.method}</span>
                <span className="text-white/60 flex-1">{log.endpoint}</span>
                <span className={`${log.status < 400 ? "text-green-400" : "text-red-400"}`}>{log.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
