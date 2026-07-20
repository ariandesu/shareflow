import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("sf_token"));
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const t = localStorage.getItem("sf_token");
    if (!t) { setUser(null); setLoading(false); return; }
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${t}` } });
      if (!res.ok) { localStorage.removeItem("sf_token"); setToken(null); setUser(null); }
      else { const d = await res.json(); setUser(d.user); }
    } catch { setUser(null); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const d = await res.json();
      if (!res.ok) return { error: d.error || "Login failed" };
      localStorage.setItem("sf_token", d.token);
      setToken(d.token);
      setUser(d.user);
      return {};
    } catch { return { error: "Network error" }; }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, name }) });
      const d = await res.json();
      if (!res.ok) return { error: d.error || "Registration failed" };
      localStorage.setItem("sf_token", d.token);
      setToken(d.token);
      setUser(d.user);
      return {};
    } catch { return { error: "Network error" }; }
  };

  const logout = async () => {
    try { await fetch(`${API_BASE}/api/auth/logout`, { method: "POST", headers: { Authorization: `Bearer ${token}` } }); } catch {}
    localStorage.removeItem("sf_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
