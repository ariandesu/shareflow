/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileUp,
  Download,
  FileText,
  Shield,
  Zap,
  Lock,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Activity,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { ThreeVisualizer } from "../components/ThreeVisualizer";

interface ToolItem {
  name: string;
  desc: string;
  href: string;
  icon: string;
  category: "dev" | "pdf" | "media" | "security";
}

const TOOLS_LIST: ToolItem[] = [
  // Developer
  { name: "JSON Formatter", desc: "Format, validate, syntax highlight and minify JSON data.", href: "/json-formatter", icon: "🛠️", category: "dev" },
  { name: "JSON to TypeScript", desc: "Instantly generate typed interfaces from JSON objects.", href: "/json-to-typescript", icon: "🔷", category: "dev" },
  { name: "JSON to Zod", desc: "Generate runtime Zod validation schemas with type safety.", href: "/json-to-zod", icon: "🛡️", category: "dev" },
  { name: "SQL Formatter", desc: "Beautify and structure SQL statements across standard dialects.", href: "/sql-formatter", icon: "🗄️", category: "dev" },
  { name: "Regex Tester", desc: "Interactive regular expressions validator with regex explanations.", href: "/regex-tester", icon: "🎯", category: "dev" },
  { name: "Base64 Converter", desc: "Encode and decode raw strings, files, and images in Base64.", href: "/base64", icon: "📦", category: "dev" },
  { name: "Markdown Preview", desc: "Live GitHub-flavored Markdown editor with instant HTML export.", href: "/markdown-preview", icon: "📝", category: "dev" },
  { name: "Cron Generator", desc: "Visual schedule builder for UNIX cron jobs with explanations.", href: "/cron-generator", icon: "⏱️", category: "dev" },

  // Security & Crypto
  { name: "JWT Decoder", desc: "Decode headers, claims, and verify JSON Web Token signatures.", href: "/jwt-decoder", icon: "🔑", category: "security" },
  { name: "Hash Generator", desc: "Compute SHA-256, SHA-512, MD5, and HMAC hashes client-side.", href: "/hash-generator", icon: "🔒", category: "security" },
  { name: "Password Generator", desc: "High-entropy cryptographically secure password generator.", href: "/password-generator", icon: "🛡️", category: "security" },
  { name: "QR Code Generator", desc: "Create high-res vector SVG QR codes with error correction.", href: "/qr-generator", icon: "📱", category: "security" },
  { name: "UUID Generator", desc: "Generate RFC-compliant UUID v4 / v7 identifiers in bulk.", href: "/uuid", icon: "🆔", category: "security" },

  // PDF Toolkit
  { name: "PDF Merger", desc: "Combine multiple PDF documents into one cleanly without upload.", href: "/pdf-merger", icon: "📄", category: "pdf" },
  { name: "PDF Splitter", desc: "Extract and separate page ranges from any PDF document.", href: "/pdf-splitter", icon: "✂️", category: "pdf" },
  { name: "PDF to Images", desc: "Render high-resolution PNG pages directly from PDF pages.", href: "/pdf-to-images", icon: "🖼️", category: "pdf" },
  { name: "Images to PDF", desc: "Convert photo galleries and scans into standard PDF books.", href: "/images-to-pdf", icon: "📚", category: "pdf" },
  { name: "PDF Text Extractor", desc: "Extract raw readable text strings from any PDF file.", href: "/pdf-text-extractor", icon: "📋", category: "pdf" },

  // Media & Images
  { name: "Image Compressor", desc: "Client-side WebP, PNG, and JPEG lossy/lossless optimizer.", href: "/image-compressor", icon: "🗜️", category: "media" },
  { name: "Image Resizer", desc: "Resize dimensions with aspect ratio locking and DPI control.", href: "/image-resizer", icon: "📐", category: "media" },
  { name: "Image Converter", desc: "Convert formats between WebP, PNG, JPEG, SVG, and AVIF.", href: "/image-converter", icon: "🔄", category: "media" },
  { name: "EXIF Metadata Stripper", desc: "Remove GPS tags and camera device metadata from photos.", href: "/exif-remover", icon: "🔍", category: "media" },
  { name: "Color Picker", desc: "HSL, HEX, and RGB inspector with palette generator.", href: "/color-picker", icon: "🎨", category: "media" },
];

export function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "dev" | "pdf" | "media" | "security">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [simulatedProgress, setSimulatedProgress] = useState(68);
  const [isSimulating, setIsSimulating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleCopyP2PLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/file-share`;
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      showToast("P2P Link copied to clipboard. Ready to share!", "success");
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      showToast("Failed to copy link automatically.", "error");
    }
  };

  const handleSimulateStream = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulatedProgress(10);
    showToast("Simulating WebRTC high-speed P2P pipe (94.8 MB/s)...", "success");

    const interval = setInterval(() => {
      setSimulatedProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulating(false);
          showToast("Transfer completed via WebRTC DataChannel (0 bytes stored).", "success");
          return 100;
        }
        return prev + 15;
      });
    }, 280);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      showToast(`Staged ${e.dataTransfer.files.length} file(s). Navigating to P2P room...`, "success");
      setTimeout(() => {
        navigate("/file-share");
      }, 600);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      showToast(`Selected ${e.target.files.length} file(s). Entering P2P room...`, "success");
      setTimeout(() => {
        navigate("/file-share");
      }, 500);
    }
  };

  // Filter tools
  const filteredTools = TOOLS_LIST.filter((tool) => {
    const matchesCat = selectedCategory === "all" || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col gap-14 sm:gap-20 pb-16">
      {/* Toast Notification (Instagram Reel Items #12, #13) */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-md ${
            toastMessage.type === "success"
              ? "bg-white/95 border-[#34c759]/30 text-[#1d1d1f]"
              : "bg-white/95 border-[#ff3b30]/30 text-[#ff3b30]"
          }`}>
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-[#34c759] flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#ff3b30] flex-shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="text-center pt-6 sm:pt-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#f5f5f7] text-[#0071e3] border border-[#d2d2d7]/50 mb-5 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#0071e3] animate-pulse"></span>
          SHAREFLOW 2.0 • SERVERLESS UTILITY PLATFORM
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1d1d1f] max-w-4xl leading-[1.08] mb-5">
          Share files at the speed of light.{" "}
          <span className="bg-gradient-to-r from-[#0071e3] to-[#34c759] bg-clip-text text-transparent">
            Peer-to-peer.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-[#6e6e73] font-normal max-w-2xl leading-relaxed mb-10">
          Direct browser-to-browser WebRTC datachannels. Unlimited file sizes. Zero cloud storage egress. Protected by client-side AES-GCM-256 encryption.
        </p>

        {/* Interactive Three.js P2P Drop Hub */}
        <div className="w-full max-w-5xl bg-[#f5f5f7] border border-[#e5e5ea] rounded-3xl p-4 sm:p-7 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* 3D Three.js Visualizer Card */}
            <div className="relative w-full min-h-[340px] sm:min-h-[380px] bg-white border border-[#e5e5ea] rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs">
              <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#e5e5ea] text-[11px] font-semibold text-[#6e6e73]">
                <span className="w-2 h-2 rounded-full bg-[#34c759]"></span>
                <span>Three.js P2P Core Visualizer • Drag to Rotate</span>
              </div>
              <ThreeVisualizer />
            </div>

            {/* Interactive File Drop & HUD */}
            <div className="bg-white border border-[#e5e5ea] rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-5 text-left shadow-xs">
              {/* Drop Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#0071e3]/40 hover:border-[#0071e3] bg-[#fbfbfd] hover:bg-[#0071e3]/5 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#0071e3] text-white flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-105 transition-transform">
                  <Zap className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="font-bold text-base text-[#1d1d1f] mb-1">
                  Drop Files Here to Share
                </div>
                <div className="text-xs text-[#6e6e73]">
                  Direct browser stream • No file size limits • Instant P2P link
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Active Transfer Telemetry Card */}
              <div className="bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl p-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1d1d1f] truncate max-w-[220px]">
                    video_production_master_4k.mov (4.2 GB)
                  </span>
                  <span className="font-mono font-bold text-[#34c759]">
                    94.8 MB/s
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-[#e5e5ea] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0071e3] to-[#34c759] rounded-full transition-all duration-300"
                    style={{ width: `${simulatedProgress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-[#86868b]">
                  <span>
                    {(4.2 * (simulatedProgress / 100)).toFixed(2)} GB / 4.20 GB ({simulatedProgress}%)
                  </span>
                  <span>WebRTC DataChannel • E2E Encrypted</span>
                </div>
              </div>

              {/* Action Buttons (Instagram Reel Item #11) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleCopyP2PLink}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-none"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? "Link Copied!" : "Copy Instant P2P Link"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSimulateStream}
                  disabled={isSimulating}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#f5f5f7] hover:bg-[#e5e5ea] disabled:opacity-60 text-[#1d1d1f] border border-[#d2d2d7] text-xs font-semibold flex items-center justify-center gap-2 transition-all focus:outline-none"
                >
                  <Activity className="w-4 h-4 text-[#0071e3]" />
                  <span>{isSimulating ? "Streaming..." : "Test Speed Stream"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Bento Grid Section */}
      <section className="w-full max-w-7xl mx-auto flex flex-col gap-6">
        <div className="text-left">
          <span className="text-xs font-bold text-[#0071e3] uppercase tracking-wider">
            Flagship Capabilities
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight mt-1">
            Engineered for absolute privacy and extreme speed.
          </h2>
          <p className="text-sm text-[#6e6e73] mt-1 max-w-xl">
            Everything happens inside your browser runtime. Zero intermediary servers. Zero retention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Card 1: P2P File Transfer (Span 8) */}
          <div className="md:col-span-8 bg-[#f5f5f7] border border-[#e5e5ea] rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 hover:shadow-md transition-shadow">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#0071e3] border border-[#e5e5ea] text-[11px] font-bold mb-4">
                <FileUp className="w-3.5 h-3.5" />
                <span>FLAGSHIP 01 • UNLIMITED CAPACITY</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] tracking-tight">
                Peer-to-Peer File Transfer
              </h3>
              <p className="text-sm text-[#6e6e73] mt-2 leading-relaxed max-w-xl">
                Direct device-to-device streaming through browser WebRTC datachannels. Send 10GB raw video files, disk images, or datasets with zero server egress limits.
              </p>
            </div>

            <div className="bg-white border border-[#e5e5ea] rounded-2xl p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1d1d1f]">Local WebRTC Channel</span>
                <span className="font-mono font-bold text-[#34c759]">CONNECTED (100% P2P)</span>
              </div>
              <div className="text-[11px] font-mono text-[#6e6e73] bg-[#f5f5f7] p-2.5 rounded-xl border border-[#e5e5ea]">
                Cipher: AES-GCM-256 | Hash: SHA-256 Chunk Verification | Egress: 0 Bytes Stored
              </div>
            </div>

            <div>
              <Link
                to="/file-share"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0071e3] hover:underline"
              >
                <span>Launch File Share Room</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Ephemeral Text Share (Span 4) */}
          <div className="md:col-span-4 bg-[#f5f5f7] border border-[#e5e5ea] rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 hover:shadow-md transition-shadow">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#0071e3] border border-[#e5e5ea] text-[11px] font-bold mb-4">
                <FileText className="w-3.5 h-3.5" />
                <span>FLAGSHIP 02 • EPHEMERAL SECRECY</span>
              </div>
              <h3 className="text-xl font-bold text-[#1d1d1f] tracking-tight">
                Text & Code Share
              </h3>
              <p className="text-sm text-[#6e6e73] mt-2 leading-relaxed">
                Self-destructing text notes, API tokens, and snippets. Set 10-minute expiry or single-read destruction.
              </p>
            </div>

            <div className="bg-white border border-[#e5e5ea] rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#eafaf1] text-[#1e8449]">
                  Self-Destruct
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#eafaf1] text-[#1e8449]">
                  Burn on Read
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#86868b] mt-1">
                shareflow.app/t/8x92a • 1 view left
              </div>
            </div>

            <div>
              <Link
                to="/text-share"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0071e3] hover:underline"
              >
                <span>Open Secret Notepad</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Developer Starter Kits (Span 6) */}
          <div className="md:col-span-6 bg-[#f5f5f7] border border-[#e5e5ea] rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 hover:shadow-md transition-shadow">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#0071e3] border border-[#e5e5ea] text-[11px] font-bold mb-4">
                <Layers className="w-3.5 h-3.5" />
                <span>DEVELOPER STORE • FREE BLUEPRINTS</span>
              </div>
              <h3 className="text-xl font-bold text-[#1d1d1f] tracking-tight">
                Production Boilerplates
              </h3>
              <p className="text-sm text-[#6e6e73] mt-2 leading-relaxed">
                Download battle-tested starter kits: FastAPI + SQLite backend, Multi-threaded Async Scrapers, and Docker production blueprints.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-white border border-[#e5e5ea] rounded-xl text-xs font-semibold text-[#1d1d1f]">
                ⚡ FastAPI + SQLite Kit
              </span>
              <span className="px-3 py-1.5 bg-white border border-[#e5e5ea] rounded-xl text-xs font-semibold text-[#1d1d1f]">
                🕷️ Async Scraper Engine
              </span>
              <span className="px-3 py-1.5 bg-white border border-[#e5e5ea] rounded-xl text-xs font-semibold text-[#1d1d1f]">
                🐳 Docker & K8s Spec
              </span>
            </div>

            <div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0071e3] hover:underline"
              >
                <span>Browse Developer Kits</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 4: Edge Architecture (Span 6) */}
          <div className="md:col-span-6 bg-[#f5f5f7] border border-[#e5e5ea] rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 hover:shadow-md transition-shadow">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#0071e3] border border-[#e5e5ea] text-[11px] font-bold mb-4">
                <Shield className="w-3.5 h-3.5" />
                <span>INFRASTRUCTURE • CLOUDFLARE EDGE</span>
              </div>
              <h3 className="text-xl font-bold text-[#1d1d1f] tracking-tight">
                Zero Server Overhead
              </h3>
              <p className="text-sm text-[#6e6e73] mt-2 leading-relaxed">
                Signals broker over Cloudflare Workers WebSocket relays. Payloads never touch disk or databases. Zero storage cost, infinite scale.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-white border border-[#e5e5ea] rounded-2xl p-4 text-center">
              <div>
                <div className="text-[11px] text-[#86868b] font-medium">Global Latency</div>
                <div className="text-sm font-bold text-[#1d1d1f] font-mono mt-0.5">&lt;15ms</div>
              </div>
              <div>
                <div className="text-[11px] text-[#86868b] font-medium">Storage Egress</div>
                <div className="text-sm font-bold text-[#34c759] font-mono mt-0.5">$0.00</div>
              </div>
              <div>
                <div className="text-[11px] text-[#86868b] font-medium">Availability</div>
                <div className="text-sm font-bold text-[#1d1d1f] font-mono mt-0.5">99.99%</div>
              </div>
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6e6e73]">
                <Shield className="w-3.5 h-3.5 text-[#34c759]" />
                <span>100% Client-Side Cryptography</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 40+ Built-in High-Performance Utilities Directory */}
      <section className="w-full max-w-7xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#0071e3] uppercase tracking-wider">
              DEVELOPER & CREATOR SUITE
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight mt-1">
              40+ Built-In High-Performance Utilities
            </h2>
            <p className="text-sm text-[#6e6e73] mt-1">
              Zero external installs. 100% client-side execution in your browser.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter utilities..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-full bg-[#f5f5f7] border border-[#e5e5ea] focus:border-[#0071e3] focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: "all", label: "All Utilities (40+)" },
            { id: "dev", label: "Developer & Code" },
            { id: "pdf", label: "PDF Toolkit" },
            { id: "media", label: "Media & Images" },
            { id: "security", label: "Security & Crypto" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? "bg-[#1d1d1f] text-white shadow-xs"
                  : "bg-[#f5f5f7] text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#e5e5ea]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <Link
              key={tool.name}
              to={tool.href}
              className="bg-white border border-[#e5e5ea] hover:border-[#0071e3] rounded-2xl p-5 flex items-start gap-4 hover:shadow-md transition-all duration-150 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-105 transition-transform">
                {tool.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="text-sm font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors truncate">
                  {tool.name}
                </h4>
                <p className="text-xs text-[#6e6e73] leading-relaxed mt-1 line-clamp-2">
                  {tool.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Architecture & Comparison Section */}
      <section className="w-full max-w-7xl mx-auto flex flex-col gap-6">
        <div className="text-left">
          <span className="text-xs font-bold text-[#0071e3] uppercase tracking-wider">
            ZERO-KNOWLEDGE PRIVACY
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight mt-1">
            Why ShareFlow P2P Outperforms Centralized Cloud
          </h2>
          <p className="text-sm text-[#6e6e73] mt-1">
            A direct architectural comparison against legacy cloud lockers.
          </p>
        </div>

        <div className="bg-[#f5f5f7] border border-[#e5e5ea] rounded-3xl p-4 sm:p-8 overflow-x-auto">
          <table className="w-full min-w-[550px] text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#e5e5ea]">
                <th className="py-3 px-4 font-bold text-[#1d1d1f]">Architecture Characteristic</th>
                <th className="py-3 px-4 font-bold text-[#0071e3]">ShareFlow 2.0 WebRTC</th>
                <th className="py-3 px-4 font-bold text-[#6e6e73]">WeTransfer / Dropbox</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5ea]/60">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#1d1d1f]">Data Routing</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#eafaf1] text-[#1e8449]">
                    Direct Peer-to-Peer
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#fde8e8] text-[#c81e1e]">
                    Server Upload & Storage
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#1d1d1f]">File Size Ceiling</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#eafaf1] text-[#1e8449]">
                    Unlimited (Direct Stream)
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#fde8e8] text-[#c81e1e]">
                    2GB Cap (Free Tier)
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#1d1d1f]">Server Data Retention</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#eafaf1] text-[#1e8449]">
                    0 Bytes Stored
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#fde8e8] text-[#c81e1e]">
                    Stored on Cloud Buckets
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#1d1d1f]">Client Encryption</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#eafaf1] text-[#1e8449]">
                    AES-GCM-256 in Browser
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#fde8e8] text-[#c81e1e]">
                    Server-Side Decryption Possible
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#1d1d1f]">Account Requirement</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#eafaf1] text-[#1e8449]">
                    Zero Registration Required
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#fde8e8] text-[#c81e1e]">
                    Email & Login Walls
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#1d1d1f]">Built-in Dev Utilities</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#eafaf1] text-[#1e8449]">
                    40+ In-Browser Tools
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#fde8e8] text-[#c81e1e]">
                    None
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
