import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DeveloperSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signup(email, password, name || email.split("@")[0]);
    setLoading(false);
    if (result.error) setError(result.error);
    else setSent(true);
  };

  if (sent) {
    return (
      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">Check Your Email</h1>
          <p className="text-white/50 text-sm mb-6">A 6-digit verification code was sent to</p>
          <p className="text-white/70 font-mono text-sm mb-8">{email}</p>
          <p className="text-xs text-white/30">Enter the code on the login page after verifying. Code expires in 24 hours.</p>
          <Link to="/dev/login" className="inline-block mt-6 px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-white/80 transition-colors">
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

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
