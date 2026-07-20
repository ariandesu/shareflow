import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const endpoints = [
  { method: "POST", path: "/api/text", desc: "Create a text snippet" },
  { method: "GET", path: "/api/text/:code", desc: "Retrieve a text snippet" },
  { method: "POST", path: "/api/file", desc: "Upload a file (multipart)" },
  { method: "GET", path: "/api/file/:code", desc: "Get file metadata" },
  { method: "GET", path: "/api/file/:code/download", desc: "Download a file" },
  { method: "POST", path: "/api/file/p2p", desc: "Initiate P2P file transfer" },
];

export default function DeveloperGateway() {
  const { user } = useAuth();

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full py-8 px-4">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Developer Gateway</h1>
        <p className="text-white/50 text-sm font-mono">Build with ShareFlow — integrate text sharing, file sharing, and P2P transfers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white/5 border border-white/10 p-6 flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Getting Started</h3>
          <p className="text-sm text-white/60 mb-4 flex-1">Get your API key and start building in minutes. Full REST API with simple authentication.</p>
          <Link to={user ? "/dev/dashboard" : "/dev/login"} className="text-sm font-bold text-white hover:text-white/70 transition-colors uppercase tracking-wider">
            {user ? "Dashboard →" : "Sign In →"}
          </Link>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">API Reference</h3>
          <p className="text-sm text-white/60 mb-4 flex-1">Comprehensive REST API for text snippets, file uploads, and peer-to-peer transfers.</p>
          <a href="#endpoints" className="text-sm font-bold text-white hover:text-white/70 transition-colors uppercase tracking-wider">View Endpoints →</a>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Pricing</h3>
          <p className="text-sm text-white/60 mb-4 flex-1">Free tier: 1,000 requests/day. No credit card required. Rate limits apply per IP.</p>
          <span className="text-sm font-bold text-white/30 uppercase tracking-wider">Free Forever</span>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-6 mb-10">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Authentication</h3>
        <p className="text-sm text-white/60 mb-4">All API requests require a Bearer token in the Authorization header:</p>
        <pre className="bg-black/40 p-4 text-xs font-mono text-green-400/80 overflow-x-auto">
{`curl -H "Authorization: Bearer sf_your_api_key_here" \\n  https://shareflow-api.shareflow.workers.dev/api/text \\n  -d '{"text":"Hello World"}'`}
        </pre>
      </div>

      <div id="endpoints" className="mb-10">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">API Endpoints</h3>
        <div className="divide-y divide-white/5 border border-white/10">
          {endpoints.map((ep) => (
            <div key={ep.path} className="flex items-center gap-4 p-4 text-sm font-mono">
              <span className={`text-xs font-bold px-2 py-0.5 uppercase ${
                ep.method === "GET" ? "text-green-400 bg-green-400/10" : "text-blue-400 bg-blue-400/10"
              }`}>{ep.method}</span>
              <span className="text-white/70 flex-1">{ep.path}</span>
              <span className="text-white/40 hidden sm:block">{ep.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {user && (
        <div className="bg-white/5 border border-white/10 p-6 text-center">
          <p className="text-sm text-white/60 mb-2">You are signed in as <strong className="text-white">{user.email}</strong></p>
          <Link to="/dev/dashboard" className="text-sm font-bold text-white hover:text-white/70 transition-colors uppercase tracking-wider">Go to Dashboard →</Link>
        </div>
      )}
    </div>
  );
}
