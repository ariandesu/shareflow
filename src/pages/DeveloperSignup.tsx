import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DeveloperSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signup(email, password, name || email.split("@")[0]);
    setLoading(false);
    if (result.error) setError(result.error);
    else navigate("/dev/dashboard");
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">Sign Up</h1>
        <p className="text-white/50 text-sm mb-8">Create a developer account</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <div className="bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">{error}</div>}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-white/30 mb-1 block">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors" placeholder="Your name" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-white/30 mb-1 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-white/30 mb-1 block">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors" placeholder="At least 6 characters" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-white text-black font-bold uppercase tracking-widest text-xs py-3 hover:bg-white/80 transition-colors disabled:opacity-50">
            {loading ? "Creating account..." : "Create Account"}
          </button>
          <p className="text-center text-xs text-white/30">
            Already have an account?{" "}
            <Link to="/dev/login" className="text-white hover:text-white/70 font-bold">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
