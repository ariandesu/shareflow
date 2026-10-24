/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileUp,
  FileText,
  Shield,
  ArrowRight,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { HeroVariant3 } from "../components/hero/HeroVariant3";

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
  { name: "Scientific Calculator", desc: "Perform complex arithmetic, trigonometry, logarithms, and scientific math.", href: "/scientific-calculator", icon: "🧮", category: "dev" },
  { name: "SVG to CSS", desc: "Convert SVG code or files into CSS background images and data URLs.", href: "/svg-to-css", icon: "🎨", category: "dev" },
  { name: "Z-Index Visualizer", desc: "Interactive 3D stacking context and z-index layering visualizer.", href: "/z-index", icon: "📑", category: "dev" },
  { name: "Text Diff", desc: "Compare and highlight character-level differences between two texts.", href: "/text-diff", icon: "🔍", category: "dev" },
  { name: "Word Counter", desc: "Count words, characters, sentences, paragraphs, and reading time.", href: "/word-counter", icon: "📊", category: "dev" },
  { name: "Timezone Converter", desc: "Convert timestamps and schedules across world timezones seamlessly.", href: "/timezone-converter", icon: "🌐", category: "dev" },
  { name: "Time Now", desc: "Accurate current atomic time, UTC offsets, and world clocks.", href: "/time", icon: "⏰", category: "dev" },
  { name: "Unit Converter", desc: "Convert length, mass, digital storage, temperature, and speed units.", href: "/unit-converter", icon: "📐", category: "dev" },

  // Security & Crypto
  { name: "JWT Decoder", desc: "Decode headers, claims, and verify JSON Web Token signatures.", href: "/jwt-decoder", icon: "🔑", category: "security" },
  { name: "Hash Generator", desc: "Compute SHA-256, SHA-512, MD5, and HMAC hashes client-side.", href: "/hash-generator", icon: "🔒", category: "security" },
  { name: "Password Generator", desc: "High-entropy cryptographically secure password generator.", href: "/password-generator", icon: "🛡️", category: "security" },
  { name: "QR Code Generator", desc: "Create high-res vector SVG QR codes with error correction.", href: "/qr-generator", icon: "📱", category: "security" },
  { name: "UUID Generator", desc: "Generate RFC-compliant UUID v4 / v7 identifiers in bulk.", href: "/uuid", icon: "🆔", category: "security" },

  // PDF Toolkit
  { name: "PDF Utility Studio", desc: "All-in-one unified workspace: merge, split, rotate, sign, compress & OCR.", href: "/pdf-utility", icon: "⚡", category: "pdf" },
  { name: "PDF Compressor", desc: "Downsample DPI and compress PDF file size up to 85% in-browser.", href: "/pdf-compressor", icon: "🗜️", category: "pdf" },
  { name: "PDF Merger", desc: "Combine multiple PDF documents into one cleanly without upload.", href: "/pdf-merger", icon: "📄", category: "pdf" },
  { name: "PDF Splitter", desc: "Extract and separate page ranges from any PDF document.", href: "/pdf-splitter", icon: "✂️", category: "pdf" },
  { name: "PDF Rotator", desc: "Rotate pages 90°/180° and visually reorganize PDF page sequence.", href: "/pdf-rotator", icon: "🔄", category: "pdf" },
  { name: "PDF Watermark", desc: "Stamp custom text watermarks or automated pagination across PDF pages.", href: "/pdf-watermark", icon: "🏷️", category: "pdf" },
  { name: "PDF Signer", desc: "Draw or type legal signatures and burn them directly onto PDF documents.", href: "/pdf-signer", icon: "✍️", category: "pdf" },
  { name: "PDF Page Remover", desc: "Select and delete unwanted pages from PDF files with live previews.", href: "/pdf-page-remover", icon: "🗑️", category: "pdf" },
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
  const [selectedCategory, setSelectedCategory] = useState<"all" | "dev" | "pdf" | "media" | "security">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [renderDeferred, setRenderDeferred] = useState(false);

  useEffect(() => {
    const enable = () => setRenderDeferred(true);
    window.addEventListener("scroll", enable, { once: true, passive: true });
    window.addEventListener("touchstart", enable, { once: true, passive: true });
    window.addEventListener("mousemove", enable, { once: true, passive: true });

    // Yield to browser main thread so Hero paints and becomes interactive immediately
    const t = setTimeout(enable, 1200);
    return () => {
      window.removeEventListener("scroll", enable);
      window.removeEventListener("touchstart", enable);
      window.removeEventListener("mousemove", enable);
      clearTimeout(t);
    };
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
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
    <div className="w-full flex flex-col gap-12 sm:gap-16 pb-16 transition-colors duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-md ${
            toastMessage.type === "success"
              ? "bg-white/95 dark:bg-[#181a20]/95 border-[#34c759]/30 text-[#1d1d1f] dark:text-[#f5f5f7]"
              : "bg-white/95 dark:bg-[#181a20]/95 border-[#ff3b30]/30 text-[#ff3b30]"
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

      {/* Minimal Dual Pod Hero Section */}
      <HeroVariant3 onNotify={showToast} />

      {/* Flagship Bento Grid Section */}
      <section className="w-full max-w-7xl mx-auto flex flex-col gap-6">
        <div className="text-left">
          <span className="text-xs font-bold text-[#0071e3] dark:text-[#38bdf8] uppercase tracking-wider">
            Flagship Capabilities
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#1d1d1f] dark:text-white tracking-tight mt-1">
            Engineered for absolute privacy and extreme speed.
          </h2>
          <p className="text-sm text-[#6e6e73] dark:text-[#a1a1aa] mt-1 max-w-xl">
            Everything happens inside your browser runtime. Zero intermediary servers. Zero retention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Card 1: P2P File Transfer (Span 8) */}
          <div
            onClick={() => navigate("/file-share")}
            className="md:col-span-8 bg-[#f5f5f7] dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer group"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#181a20] text-[#0071e3] dark:text-[#38bdf8] border border-[#e5e5ea] dark:border-[#27272a] text-[11px] font-bold mb-4">
                <FileUp className="w-3.5 h-3.5" />
                <span>FLAGSHIP 01 • UNLIMITED CAPACITY</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">
                Peer-to-Peer File Transfer
              </h3>
              <p className="text-sm text-[#6e6e73] dark:text-[#a1a1aa] mt-2 leading-relaxed max-w-xl">
                Direct device-to-device streaming through browser WebRTC datachannels. Send 10GB raw video files, disk images, or datasets with zero server egress limits.
              </p>
            </div>

            <div className="bg-white dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a] rounded-2xl p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1d1d1f] dark:text-white">Local WebRTC Channel</span>
                <span className="font-mono font-bold text-[#34c759]">CONNECTED (100% P2P)</span>
              </div>
              <div className="text-[11px] font-mono text-[#6e6e73] dark:text-[#a1a1aa] bg-[#f5f5f7] dark:bg-[#12141a] p-2.5 rounded-xl border border-[#e5e5ea] dark:border-[#27272a]">
                Cipher: AES-GCM-256 | Hash: SHA-256 Chunk Verification | Egress: 0 Bytes Stored
              </div>
            </div>

            <div>
              <Link
                to="/file-share"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0071e3] dark:text-[#38bdf8] hover:underline"
              >
                <span>Launch File Share Room</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Ephemeral Text Share (Span 4) */}
          <div
            onClick={() => navigate("/text-share")}
            className="md:col-span-4 bg-[#f5f5f7] dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer group"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#181a20] text-[#0071e3] dark:text-[#38bdf8] border border-[#e5e5ea] dark:border-[#27272a] text-[11px] font-bold mb-4">
                <FileText className="w-3.5 h-3.5" />
                <span>FLAGSHIP 02 • EPHEMERAL SECRECY</span>
              </div>
              <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">
                Text &amp; Code Share
              </h3>
              <p className="text-sm text-[#6e6e73] dark:text-[#a1a1aa] mt-2 leading-relaxed">
                Self-destructing text notes, API tokens, and snippets. Set 10-minute expiry or single-read destruction.
              </p>
            </div>

            <div className="bg-white dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a] rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#eafaf1] dark:bg-emerald-950/40 text-[#1e8449] dark:text-[#34c759] border border-[#34c759]/20">
                  Self-Destruct
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#eafaf1] dark:bg-emerald-950/40 text-[#1e8449] dark:text-[#34c759] border border-[#34c759]/20">
                  Burn on Read
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#86868b] dark:text-[#a1a1aa] mt-1">
                shareflow.app/t/8x92a • 1 view left
              </div>
            </div>

            <div>
              <Link
                to="/text-share"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0071e3] dark:text-[#38bdf8] hover:underline"
              >
                <span>Open Secret Notepad</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Developer Starter Kits (Span 6) */}
          <div
            onClick={() => navigate("/products")}
            className="md:col-span-6 bg-[#f5f5f7] dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer group"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#181a20] text-[#0071e3] dark:text-[#38bdf8] border border-[#e5e5ea] dark:border-[#27272a] text-[11px] font-bold mb-4">
                <Layers className="w-3.5 h-3.5" />
                <span>DEVELOPER STORE • FREE BLUEPRINTS</span>
              </div>
              <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">
                Production Boilerplates
              </h3>
              <p className="text-sm text-[#6e6e73] dark:text-[#a1a1aa] mt-2 leading-relaxed">
                Download battle-tested starter kits: FastAPI + SQLite backend, Multi-threaded Async Scrapers, and Docker production blueprints.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-white dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a] rounded-xl text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                ⚡ FastAPI + SQLite Kit
              </span>
              <span className="px-3 py-1.5 bg-white dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a] rounded-xl text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                🕷️ Async Scraper Engine
              </span>
              <span className="px-3 py-1.5 bg-white dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a] rounded-xl text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                🐳 Docker &amp; K8s Spec
              </span>
            </div>

            <div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0071e3] dark:text-[#38bdf8] hover:underline"
              >
                <span>Browse Developer Kits</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 4: Edge Architecture (Span 6) */}
          <div
            onClick={() => navigate("/file-share")}
            className="md:col-span-6 bg-[#f5f5f7] dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer group"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#181a20] text-[#0071e3] dark:text-[#38bdf8] border border-[#e5e5ea] dark:border-[#27272a] text-[11px] font-bold mb-4">
                <Shield className="w-3.5 h-3.5" />
                <span>INFRASTRUCTURE • CLOUDFLARE EDGE</span>
              </div>
              <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">
                Zero Server Overhead
              </h3>
              <p className="text-sm text-[#6e6e73] dark:text-[#a1a1aa] mt-2 leading-relaxed">
                Signals broker over Cloudflare Workers WebSocket relays. Payloads never touch disk or databases. Zero storage cost, infinite scale.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-white dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a] rounded-2xl p-4 text-center">
              <div>
                <div className="text-[11px] text-[#86868b] dark:text-[#a1a1aa] font-medium">Global Latency</div>
                <div className="text-sm font-bold text-[#1d1d1f] dark:text-white font-mono mt-0.5">&lt;15ms</div>
              </div>
              <div>
                <div className="text-[11px] text-[#86868b] dark:text-[#a1a1aa] font-medium">Storage Egress</div>
                <div className="text-sm font-bold text-[#34c759] font-mono mt-0.5">$0.00</div>
              </div>
              <div>
                <div className="text-[11px] text-[#86868b] dark:text-[#a1a1aa] font-medium">Availability</div>
                <div className="text-sm font-bold text-[#1d1d1f] dark:text-white font-mono mt-0.5">99.99%</div>
              </div>
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6e6e73] dark:text-[#a1a1aa]">
                <Shield className="w-3.5 h-3.5 text-[#34c759]" />
                <span>100% Client-Side Cryptography</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Below the fold sections: deferred to keep main thread completely idle during hero initial paint */}
      {renderDeferred && (
        <>
          {/* 40+ Built-in High-Performance Utilities Directory */}
          <section className="w-full max-w-7xl mx-auto flex flex-col gap-8 content-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#0071e3] dark:text-[#38bdf8] uppercase tracking-wider">
              DEVELOPER &amp; CREATOR SUITE
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#1d1d1f] dark:text-white tracking-tight mt-1">
              40+ Built-In High-Performance Utilities
            </h2>
            <p className="text-sm text-[#6e6e73] dark:text-[#a1a1aa] mt-1">
              Zero external installs. 100% client-side execution in your browser.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-[#86868b] dark:text-[#a1a1aa] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter utilities..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-full bg-[#f5f5f7] dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a] text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:border-[#0071e3] focus:bg-white dark:focus:bg-[#12141a] focus:outline-none transition-all"
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
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-95 ${
                selectedCategory === cat.id
                  ? "bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] shadow-xs"
                  : "bg-[#f5f5f7] dark:bg-[#181a20] text-[#6e6e73] dark:text-[#a1a1aa] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-[#e5e5ea] dark:hover:bg-[#27272a]"
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
              className="bg-white dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] hover:border-[#0071e3] dark:hover:border-[#0071e3] rounded-2xl p-5 flex items-start gap-4 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] dark:bg-[#181a20] flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                {tool.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="text-sm font-bold text-[#1d1d1f] dark:text-white group-hover:text-[#0071e3] dark:group-hover:text-[#38bdf8] transition-colors truncate">
                  {tool.name}
                </h4>
                <p className="text-xs text-[#6e6e73] dark:text-[#a1a1aa] leading-relaxed mt-1 line-clamp-2">
                  {tool.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Architecture & Comparison Section */}
      <section className="w-full max-w-7xl mx-auto flex flex-col gap-6 content-auto">
        <div className="text-left">
          <span className="text-xs font-bold text-[#0071e3] dark:text-[#38bdf8] uppercase tracking-wider">
            ZERO-KNOWLEDGE PRIVACY
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#1d1d1f] dark:text-white tracking-tight mt-1">
            Why ShareFlow P2P Outperforms Centralized Cloud
          </h2>
          <p className="text-sm text-[#6e6e73] dark:text-[#a1a1aa] mt-1">
            A direct architectural comparison against legacy cloud lockers.
          </p>
        </div>

        <div className="bg-[#f5f5f7] dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] rounded-3xl p-4 sm:p-8 overflow-x-auto">
          <table className="w-full min-w-[550px] text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#e5e5ea] dark:border-[#27272a]">
                <th className="py-3 px-4 font-bold text-[#1d1d1f] dark:text-white">Architecture Characteristic</th>
                <th className="py-3 px-4 font-bold text-[#0071e3] dark:text-[#38bdf8]">ShareFlow 2.0 WebRTC</th>
                <th className="py-3 px-4 font-bold text-[#6e6e73] dark:text-[#a1a1aa]">WeTransfer / Dropbox</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5ea]/60 dark:divide-[#27272a]">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#1d1d1f] dark:text-white">Data Routing</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#eafaf1] dark:bg-emerald-950/40 text-[#1e8449] dark:text-[#34c759] border border-[#34c759]/20">
                    Direct Peer-to-Peer
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#fde8e8] dark:bg-rose-950/40 text-[#c81e1e] dark:text-rose-400 border border-rose-500/20">
                    Server Upload &amp; Storage
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#1d1d1f] dark:text-white">File Size Ceiling</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#eafaf1] dark:bg-emerald-950/40 text-[#1e8449] dark:text-[#34c759] border border-[#34c759]/20">
                    Unlimited (Direct Stream)
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#fde8e8] dark:bg-rose-950/40 text-[#c81e1e] dark:text-rose-400 border border-rose-500/20">
                    2GB Cap (Free Tier)
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#1d1d1f] dark:text-white">Server Data Retention</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#eafaf1] dark:bg-emerald-950/40 text-[#1e8449] dark:text-[#34c759] border border-[#34c759]/20">
                    0 Bytes Stored
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#fde8e8] dark:bg-rose-950/40 text-[#c81e1e] dark:text-rose-400 border border-rose-500/20">
                    Stored on Cloud Buckets
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#1d1d1f] dark:text-white">Client Encryption</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#eafaf1] dark:bg-emerald-950/40 text-[#1e8449] dark:text-[#34c759] border border-[#34c759]/20">
                    AES-GCM-256 in Browser
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#fde8e8] dark:bg-rose-950/40 text-[#c81e1e] dark:text-rose-400 border border-rose-500/20">
                    Server-Side Decryption Possible
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#1d1d1f] dark:text-white">Account Requirement</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#eafaf1] dark:bg-emerald-950/40 text-[#1e8449] dark:text-[#34c759] border border-[#34c759]/20">
                    Zero Registration Required
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#fde8e8] dark:bg-rose-950/40 text-[#c81e1e] dark:text-rose-400 border border-rose-500/20">
                    Email &amp; Login Walls
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#1d1d1f] dark:text-white">Built-in Dev Utilities</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#eafaf1] dark:bg-emerald-950/40 text-[#1e8449] dark:text-[#34c759] border border-[#34c759]/20">
                    40+ In-Browser Tools
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-[#fde8e8] dark:bg-rose-950/40 text-[#c81e1e] dark:text-rose-400 border border-rose-500/20">
                    None
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
        </>
      )}
    </div>
  );
}
