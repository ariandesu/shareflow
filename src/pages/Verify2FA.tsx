import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Verify2FA() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { verify2FA } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as any)?.email || "";

  useEffect(() => {
    if (!email) navigate("/dev/login");
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) { setError("Session expired. Please login again."); return; }
    setLoading(true);
    const result = await verify2FA(email, code);
    setLoading(false);
    if (result.error) setError(result.error);
    else navigate("/dev/dashboard");
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">Verify Login</h1>
        <p className="text-white/50 text-sm mb-2">Enter the 6-digit code sent to</p>
        <p className="text-white/70 text-sm font-mono mb-8">{email}</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <div className="bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">{error}</div>}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2 block">Verification Code</label>
            <input
              type="text" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} required
              maxLength={6} inputMode="numeric" autoFocus
              className="w-full bg-white/5 border border-white/10 px-4 py-4 text-2xl font-mono text-white text-center tracking-[12px] placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
              placeholder="000000"
            />
          </div>
          <button type="submit" disabled={loading || code.length !== 6} className="w-full bg-white text-black font-bold uppercase tracking-widest text-xs py-3 hover:bg-white/80 transition-colors disabled:opacity-50">
            {loading ? "Verifying..." : "Verify & Sign In"}
          </button>
          <p className="text-center text-xs text-white/30">
            <Link to="/dev/login" className="text-white hover:text-white/70 font-bold">Back to login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
