import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ShieldCheck, KeyRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "";

export default function DeveloperLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [step2FA, setStep2FA] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (email.trim().toLowerCase() === "mahirfaisalarian@gmail.com") {
      try {
        const res = await fetch(`${API_BASE}/api/admin/request-2fa`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.error || "Admin sign-in failed.");
          return;
        }
        setPassword("");
        setStep2FA(true);
      } catch {
        setError("Could not reach the sign-in service. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }
    try {
      const result = await login(email, password);
      if (result.error) setError(result.error);
      else navigate("/dev/dashboard");
    } catch {
      setError("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = twoFACode.trim();
    if (code.length !== 6) {
      setError("Please enter a valid 6-digit 2FA code.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/admin/verify-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data?.error || "Invalid verification code.");
        return;
      }
      navigate("/admin", { replace: true });
    } catch {
      setError("Could not verify the code. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 relative">
      <style>{`
        input { 
          position: relative !important; 
          z-index: 9999 !important; 
          pointer-events: auto !important; 
          cursor: text !important;
        }
      `}</style>
      <div className="w-full max-w-sm bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-md shadow-2xl relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            {step2FA ? <KeyRound className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase text-white">
              {step2FA ? "Telegram 2FA" : "Sign In"}
            </h1>
            <p className="text-white/50 text-xs">
              {step2FA ? "Enter 6-digit Telegram code" : "Developer & Admin Portal Access"}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!step2FA ? (
          <form onSubmit={handleInitialSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/40 rounded-lg transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/40 rounded-lg transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold uppercase tracking-widest text-xs py-3.5 rounded-lg transition-colors disabled:opacity-50 shadow-lg"
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>
            <p className="text-center text-xs text-white/30 pt-2">
              No account?{" "}
              <Link to="/dev/signup" className="text-emerald-400 hover:text-emerald-300 font-bold">
                Create one
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerify2FA} className="flex flex-col gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <span>2FA code sent to Mahir's Telegram (`8941576242`). Check Telegram for your code.</span>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1 block">
                6-Digit Telegram 2FA Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-center tracking-[0.5em] font-mono text-lg text-emerald-400 focus:outline-none focus:border-emerald-500/40 rounded-lg"
                placeholder="123456"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold uppercase tracking-widest text-xs py-3.5 rounded-lg transition-colors disabled:opacity-50 shadow-lg"
            >
              {loading ? "Verifying 2FA..." : "Verify & Unlock Portal"}
            </button>
            <button
              type="button"
              onClick={() => setStep2FA(false)}
              className="w-full text-xs text-white/40 hover:text-white pt-2 text-center"
            >
              ← Back to Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
