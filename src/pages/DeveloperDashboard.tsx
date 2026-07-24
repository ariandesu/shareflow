import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import {
  getSavedApiKeys,
  saveApiKey,
  deleteApiKey,
  getKeysCountByProvider,
  fetchLiveModelsForApiKey,
  detectProvider,
  SavedApiKey,
  PROVIDER_FALLBACK_MODELS
} from "../utils/aiKeyStorage";
import { Key, Trash2, Check, Sparkles, Cpu, ShieldCheck } from "lucide-react";

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

  // Multi-provider AI Key state
  const [aiKeys, setAiKeys] = useState<SavedApiKey[]>(() => getSavedApiKeys());
  const [inputKey, setInputKey] = useState("");
  const [inputKeyName, setInputKeyName] = useState("");
  const [customBaseUrl, setCustomBaseUrl] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<SavedApiKey["provider"] | "Auto">("Auto");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [inspectingKey, setInspectingKey] = useState<SavedApiKey | null>(null);
  const [keyModels, setKeyModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);

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

  // AI Key Handlers
  const handleSaveAiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;

    const providerArg = selectedProvider === "Auto" ? undefined : selectedProvider;
    const saved = saveApiKey(inputKey, inputKeyName, providerArg, customBaseUrl);
    setAiKeys(getSavedApiKeys());
    setInputKey("");
    setInputKeyName("");
    setCustomBaseUrl("");
    setSaveStatus(`Saved key for ${saved.provider}!`);
    setTimeout(() => setSaveStatus(null), 3000);
    handleInspectKey(saved);
  };

  const handleDeleteAiKey = (id: string) => {
    const updated = deleteApiKey(id);
    setAiKeys(updated);
    if (inspectingKey?.id === id) {
      setInspectingKey(null);
      setKeyModels([]);
    }
  };

  const handleInspectKey = async (k: SavedApiKey) => {
    setInspectingKey(k);
    setLoadingModels(true);
    setKeyModels([]);
    const models = await fetchLiveModelsForApiKey(k.key, k.baseUrl, k.provider);
    if (models && models.length > 0) {
      setKeyModels(models);
    } else {
      setKeyModels(PROVIDER_FALLBACK_MODELS[k.provider] || []);
    }
    setLoadingModels(false);
  };

  const providerCounts = getKeysCountByProvider();

  if (!user) return null;

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full py-8 px-4">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-1">Developer Dashboard</h1>
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

      {/* MULTI-PROVIDER AI KEYS MANAGER */}
      <div className="bg-[#0E0E0E] border border-emerald-500/30 p-6 mb-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold uppercase tracking-widest text-white">
                Multi-Provider AI API Keys
              </h2>
            </div>
            <p className="text-xs text-white/50">
              Save AI API keys from NVIDIA NIM, OpenAI, OpenRouter, Groq, Alibaba Qwen, or Custom endpoints for present & future Code Helper sessions.
            </p>
          </div>

          <button
            onClick={() => navigate("/code-helper")}
            className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs uppercase tracking-widest hover:bg-emerald-500/30 transition-colors whitespace-nowrap"
          >
            Launch Code Helper →
          </button>
        </div>

        {/* PROVIDER KEYS COUNT BREAKDOWN BADGES */}
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Saved Keys Summary ({providerCounts.total} Total Keys)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {[
              "NVIDIA NIM",
              "OpenAI",
              "OpenRouter",
              "Groq",
              "Alibaba Qwen",
              "Custom"
            ].map((prov) => {
              const count = providerCounts.counts[prov] || 0;
              return (
                <div
                  key={prov}
                  className={`p-3 border text-center flex flex-col justify-between transition-colors ${
                    count > 0
                      ? "bg-emerald-500/10 border-emerald-500/40 text-white"
                      : "bg-white/5 border-white/10 text-white/30"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider block truncate">
                    {prov}
                  </span>
                  <span className="text-lg font-black tracking-tighter mt-1">
                    {count} {count === 1 ? "Key" : "Keys"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SAVE NEW AI KEY FORM */}
        <form onSubmit={handleSaveAiKey} className="bg-black/50 border border-white/10 p-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/70 flex items-center gap-2">
            <Key className="w-3.5 h-3.5 text-yellow-400" />
            Save New AI Provider Key
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={inputKeyName}
              onChange={(e) => setInputKeyName(e.target.value)}
              placeholder="Key Label (e.g. My NVIDIA NIM Key)"
              className="bg-white/5 border border-white/10 px-3 py-2 text-xs font-mono text-white placeholder-white/30 outline-none focus:border-white/40"
            />
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value as any)}
              className="bg-white/5 border border-white/10 px-3 py-2 text-xs font-mono text-white/80 outline-none"
            >
              <option value="Auto">Auto-Detect Provider</option>
              <option value="NVIDIA NIM">NVIDIA NIM (nvapi-...)</option>
              <option value="OpenAI">OpenAI (sk-proj-...)</option>
              <option value="OpenRouter">OpenRouter (sk-or-...)</option>
              <option value="Groq">Groq (gsk_...)</option>
              <option value="Alibaba Qwen">Alibaba Qwen (sk-...)</option>
              <option value="Custom">Custom Base URL</option>
            </select>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Paste API Key (nvapi-..., gsk_..., sk-...)"
              className="bg-white/5 border border-white/10 px-3 py-2 text-xs font-mono text-white placeholder-white/30 outline-none focus:border-white/40"
              required
            />
          </div>

          {selectedProvider === "Custom" && (
            <input
              type="text"
              value={customBaseUrl}
              onChange={(e) => setCustomBaseUrl(e.target.value)}
              placeholder="Custom Base URL (e.g. https://my-ollama-server.com/v1)"
              className="w-full bg-white/5 border border-white/10 px-3 py-2 text-xs font-mono text-white placeholder-white/30 outline-none focus:border-white/40"
            />
          )}

          <div className="flex justify-between items-center pt-1">
            {saveStatus ? (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> {saveStatus}
              </span>
            ) : (
              <span className="text-[11px] text-white/40 font-mono">
                Key will be saved locally in your browser for all present and future sessions.
              </span>
            )}

            <button
              type="submit"
              className="px-6 py-2 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-white/80 transition-colors"
            >
              Save Key & Fetch Models
            </button>
          </div>
        </form>

        {/* LIST OF SAVED AI KEYS */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
            Your Saved Provider Keys ({aiKeys.length})
          </h4>

          {aiKeys.length === 0 ? (
            <p className="text-xs text-white/40 italic">No custom AI keys saved yet. Add one above.</p>
          ) : (
            <div className="divide-y divide-white/10 border border-white/10 bg-black/40">
              {aiKeys.map((k) => (
                <div key={k.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white uppercase tracking-wider">{k.name}</span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-mono text-[10px] uppercase border border-emerald-500/30">
                        {k.provider}
                      </span>
                    </div>
                    <p className="font-mono text-white/40 text-[11px]">
                      Key: <span className="text-white/60">{k.key.slice(0, 10)}••••••••</span>
                    </p>
                    <p className="font-mono text-white/30 text-[10px]">
                      Endpoint: {k.baseUrl}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleInspectKey(k)}
                      className="px-3 py-1.5 bg-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/20 transition-colors"
                    >
                      Inspect Models
                    </button>

                    <button
                      onClick={() => handleDeleteAiKey(k.id)}
                      className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                      title="Delete Key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MODEL INSPECTOR */}
        {inspectingKey && (
          <div className="bg-black border border-white/20 p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                Available Models for {inspectingKey.name} ({inspectingKey.provider})
              </h4>
              <button onClick={() => setInspectingKey(null)} className="text-xs text-white/40 hover:text-white">
                Close
              </button>
            </div>

            {loadingModels ? (
              <p className="text-xs text-white/40 font-mono animate-pulse">Querying {inspectingKey.baseUrl}/models...</p>
            ) : keyModels.length === 0 ? (
              <p className="text-xs text-white/40">No models returned from provider API.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 bg-white/5">
                {keyModels.map((m) => (
                  <span key={m} className="px-2.5 py-1 bg-black border border-white/20 font-mono text-[11px] text-emerald-300">
                    {m}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* SHAREFLOW API KEYS SECTION */}
      <div className="bg-white/5 border border-white/10 p-6 mb-8">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Create ShareFlow API Key</h3>
        <form onSubmit={createKey} className="flex gap-3">
          <input type="text" value={keyName} onChange={e => setKeyName(e.target.value)} placeholder="e.g., Production, Dev Server" className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors" />
          <button type="submit" className="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-white/80 transition-colors whitespace-nowrap">Generate</button>
        </form>
      </div>

      <div className="mb-8">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Your ShareFlow API Keys</h3>
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
