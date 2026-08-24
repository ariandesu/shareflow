import React from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  QrCode,
  Palette,
  Key,
  Hash,
  Binary,
  FileJson,
  FileCode2,
  Square,
  Layout,
  Grid3X3,
  Ruler,
  Fingerprint,
  LockOpen,
  Search,
  Minimize,
  Maximize,
  ShieldCheck,
  RefreshCw,
  FileUp,
  Scissors,
  Image as ImageIcon,
  FileImage,
  FileSearch,
  Timer,
  Calculator,
  Code2,
  Sparkles,
  Eye,
  Dices,
  Coins,
  Table2,
  AlignLeft,
  Layers,
  GitCompareArrows,
  Repeat,
  Clock,
  Type,
  TextCursorInput,
  Globe,
  Contrast,
  Percent
} from "lucide-react";
import { motion } from "motion/react";

const tools = [
  {
    name: "Developer Starter Kits",
    category: "Store",
    description: "Production FastAPI, Scraper, and DevOps starter kits. Download 100% free!",
    icon: <Sparkles className="w-6 h-6 text-emerald-400" />,
    href: "/products",
    featured: true,
  },
  {
    name: "File Share",
    category: "Flagship",
    description: "Transfer files up to 10MB via cloud or unlimited size via P2P.",
    icon: <FileUp className="w-6 h-6 text-black" />,
    href: "/file-share",
    featured: true,
  },
  {
    name: "Text Share",
    category: "Flagship",
    description: "Secure, instant, anonymous text sharing. Auto-expiring links.",
    icon: <FileText className="w-6 h-6 text-black" />,
    href: "/text-share",
    featured: true,
  },

  {
    name: "QR Generator",
    category: "Utilities",
    description: "Custom, vector-ready codes.",
    icon: <QrCode className="w-5 h-5 text-white" />,
    href: "/qr-generator",
  },
  {
    name: "Gradient Studio",
    category: "Utilities",
    description: "CSS3 & Tailwind palettes.",
    icon: <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]"></div>,
    href: "/gradient-generator",
  },
  {
    name: "JSON Format",
    category: "Developer",
    description: "Clean, validate & minify.",
    icon: <div className="font-mono text-white/40 text-lg">{`{ ... }`}</div>,
    href: "/json-formatter",
  },
  {
    name: "Password Gen",
    category: "Utilities",
    description: "Strong entropy keys.",
    icon: <Key className="w-5 h-5 text-white" />,
    href: "/password-generator",
  },
  {
    name: "UUID Gen",
    category: "Developer",
    description: "Valid version 4 UUIDs.",
    icon: <Hash className="w-5 h-5 text-white" />,
    href: "/uuid",
  },
  {
    name: "Base64",
    category: "Developer",
    description: "Encode or decode strings.",
    icon: <Binary className="w-5 h-5 text-white" />,
    href: "/base64",
  },
  {
    name: "Markdown Preview",
    category: "Developer",
    description: "Write & preview in real-time.",
    icon: <FileCode2 className="w-5 h-5 text-white" />,
    href: "/markdown-preview",
  },
  {
    name: "Color Picker",
    category: "Developer",
    description: "Select and convert HEX, RGB, HSL.",
    icon: <Palette className="w-5 h-5 text-white" />,
    href: "/color-picker",
  },
  {
    name: "Box Shadow",
    category: "Developer",
    description: "Visual CSS shadow generator.",
    icon: <Square className="w-5 h-5 text-white" />,
    href: "/box-shadow",
  },
  {
    name: "Flexbox",
    category: "Developer",
    description: "Flexbox layout playground.",
    icon: <Layout className="w-5 h-5 text-white" />,
    href: "/flexbox",
  },
  {
    name: "Grid Gen",
    category: "Developer",
    description: "Visual CSS Grid builder.",
    icon: <Grid3X3 className="w-5 h-5 text-white" />,
    href: "/grid",
  },
  {
    name: "Unit Conv",
    category: "Developer",
    description: "Convert CSS sizes and bytes.",
    icon: <Ruler className="w-5 h-5 text-white" />,
    href: "/unit-converter",
  },
  {
    name: "Hash Gen",
    category: "Developer",
    description: "MD5, SHA-1, SHA-256 hashes.",
    icon: <Fingerprint className="w-5 h-5 text-white" />,
    href: "/hash-generator",
  },
  {
    name: "JWT Decoder",
    category: "Developer",
    description: "Decode token payloads.",
    icon: <LockOpen className="w-5 h-5 text-white" />,
    href: "/jwt-decoder",
  },
  {
    name: "Regex Tester",
    category: "Developer",
    description: "Test JS regular expressions.",
    icon: <Search className="w-5 h-5 text-white" />,
    href: "/regex-tester",
  },
  {
    name: "Image Compress",
    category: "Image",
    description: "Browser-based JPEG compression.",
    icon: <Minimize className="w-5 h-5 text-white" />,
    href: "/image-compressor",
  },
  {
    name: "Image Resize",
    category: "Image",
    description: "Precise aspect ratio scaling.",
    icon: <Maximize className="w-5 h-5 text-white" />,
    href: "/image-resizer",
  },
  {
    name: "EXIF Remover",
    category: "Image",
    description: "Strip photo metadata.",
    icon: <ShieldCheck className="w-5 h-5 text-white" />,
    href: "/exif-remover",
  },
  {
    name: "Image Convert",
    category: "Image",
    description: "PNG, JPG, WebP, AVIF converter.",
    icon: <RefreshCw className="w-5 h-5 text-white" />,
    href: "/image-converter",
  },
  {
    name: "PDF Merger",
    category: "PDF",
    description: "Combine multiple PDFs.",
    icon: <FileUp className="w-5 h-5 text-white" />,
    href: "/pdf-merger",
  },
  {
    name: "PDF Splitter",
    category: "PDF",
    description: "Extract or split PDF pages.",
    icon: <Scissors className="w-5 h-5 text-white" />,
    href: "/pdf-splitter",
  },
  {
    name: "PDF to Images",
    category: "PDF",
    description: "Render PDF pages as PNG/JPG.",
    icon: <ImageIcon className="w-5 h-5 text-white" />,
    href: "/pdf-to-images",
  },
  {
    name: "Images to PDF",
    category: "PDF",
    description: "Combine images into a PDF.",
    icon: <FileImage className="w-5 h-5 text-white" />,
    href: "/images-to-pdf",
  },
  {
    name: "Metadata",
    category: "Utilities",
    description: "View file EXIF & properties.",
    icon: <FileSearch className="w-5 h-5 text-white" />,
    href: "/metadata-viewer",
  },
  {
    name: "Timer",
    category: "Utilities",
    description: "Multiple countdown timers.",
    icon: <Timer className="w-5 h-5 text-white" />,
    href: "/countdown-timer",
  },
  {
    name: "Calculator",
    category: "Utilities",
    description: "Scientific calculator.",
    icon: <Calculator className="w-5 h-5 text-white" />,
    href: "/calculator",
  },
  {
    name: "SVG to CSS",
    category: "Developer",
    description: "Convert SVG to data URI CSS.",
    icon: <Code2 className="w-5 h-5 text-white" />,
    href: "/svg-to-css",
  },
  {
    name: "CSS Animation",
    category: "Developer",
    description: "Generate keyframe animations.",
    icon: <Sparkles className="w-5 h-5 text-white" />,
    href: "/css-animation",
  },
  {
    name: "Color Blind",
    category: "Utilities",
    description: "Simulate color vision deficiency.",
    icon: <Eye className="w-5 h-5 text-white" />,
    href: "/color-blindness",
  },
  {
    name: "Dice Roller",
    category: "Utilities",
    description: "D4–D100 with crypto random.",
    icon: <Dices className="w-5 h-5 text-white" />,
    href: "/dice-roller",
  },
  {
    name: "Coin Flip",
    category: "Utilities",
    description: "Animated coin with stats.",
    icon: <Coins className="w-5 h-5 text-white" />,
    href: "/coin-flip",
  },
  {
    name: "CSV Viewer",
    category: "Utilities",
    description: "Sort, filter, search CSV data.",
    icon: <Table2 className="w-5 h-5 text-white" />,
    href: "/csv-viewer",
  },
  {
    name: "HTML Beautify",
    category: "Developer",
    description: "Format & minify HTML code.",
    icon: <AlignLeft className="w-5 h-5 text-white" />,
    href: "/html-beautifier",
  },
  {
    name: "Z-Index",
    category: "Developer",
    description: "3D z-index layer visualizer.",
    icon: <Layers className="w-5 h-5 text-white" />,
    href: "/z-index",
  },
  {
    name: "PDF Text Extract",
    category: "PDF",
    description: "Extract text from any PDF.",
    icon: <FileText className="w-5 h-5 text-white" />,
    href: "/pdf-text-extractor",
  },
  {
    name: "Page Remover",
    category: "PDF",
    description: "Remove and reorder PDF pages.",
    icon: <Scissors className="w-5 h-5 text-white" />,
    href: "/pdf-page-remover",
  },
  {
    name: "Text Diff",
    category: "Developer",
    description: "Compare two text versions.",
    icon: <GitCompareArrows className="w-5 h-5 text-white" />,
    href: "/text-diff",
  },
  {
    name: "CSV ↔ JSON",
    category: "Developer",
    description: "Convert between formats.",
    icon: <Repeat className="w-5 h-5 text-white" />,
    href: "/csv-json",
  },
  {
    name: "Epoch Convert",
    category: "Utilities",
    description: "Timestamps to readable dates.",
    icon: <Clock className="w-5 h-5 text-white" />,
    href: "/epoch-converter",
  },
  {
    name: "Word Counter",
    category: "Utilities",
    description: "Words, chars & reading time.",
    icon: <Type className="w-5 h-5 text-white" />,
    href: "/word-counter",
  },
  {
    name: "Case Convert",
    category: "Utilities",
    description: "camelCase to kebab-case & more.",
    icon: <TextCursorInput className="w-5 h-5 text-white" />,
    href: "/case-converter",
  },
  {
    name: "Timezone",
    category: "Utilities",
    description: "Multi-zone world clocks.",
    icon: <Globe className="w-5 h-5 text-white" />,
    href: "/timezone-converter",
  },
  {
    name: "Contrast Check",
    category: "Developer",
    description: "WCAG color contrast ratios.",
    icon: <Contrast className="w-5 h-5 text-white" />,
    href: "/color-contrast",
  },
  {
    name: "Percent Calc",
    category: "Utilities",
    description: "Increases, margins & discounts.",
    icon: <Percent className="w-5 h-5 text-white" />,
    href: "/percentage-calculator",
  },
  {
    name: "Lorem Ipsum",
    category: "Utilities",
    description: "Instant placeholder text.",
    icon: <FileText className="w-5 h-5 text-white" />,
    href: "/lorem-ipsum",
  },
  {
    name: "ID Generator",
    category: "Developer",
    description: "UUID, ULID, CUID & Nano ID.",
    icon: <Fingerprint className="w-5 h-5 text-white" />,
    href: "/id-generator",
  },
  {
    name: "Time Now",
    category: "Utilities",
    description: "Live clock in your timezone.",
    icon: <Clock className="w-5 h-5 text-white" />,
    href: "/time",
  },
];

export function Home() {
  return (
    <div className="flex-1 flex flex-col w-full h-full max-w-6xl mx-auto">
      {/* Hero Header */}
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[42px] sm:text-[72px] font-black leading-[1.1] tracking-tighter uppercase mb-4"
          >
            Utility<br />
            <span className="bg-slate-950 text-white dark:bg-white dark:text-slate-950 px-3 py-0.5 mt-1 inline-block rounded-md">Universe</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/50 max-w-md"
          >
            The high-performance toolkit for developers and creators. No accounts. No subscriptions. 100% serverless at the edge.
          </motion.p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">API Health</span>
          <div className="flex gap-1 h-4">
            <div className="w-1.5 bg-green-500/80 rounded-full"></div>
            <div className="w-1.5 bg-green-500/80 rounded-full"></div>
            <div className="w-1.5 bg-green-500/80 rounded-full"></div>
            <div className="w-1.5 bg-green-500/80 rounded-full"></div>
            <div className="w-1.5 bg-green-500/80 rounded-full"></div>
            <div className="w-1.5 bg-green-500/80 rounded-full"></div>
            <div className="w-1.5 bg-yellow-500/80 rounded-full"></div>
            <div className="w-1.5 bg-green-500/80 rounded-full"></div>
          </div>
        </div>
      </div>


      {/* Tool Grid Categories */}
      <div className="flex flex-col gap-12 flex-1">

        {/* STORE BANNER HIGHLIGHT */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500 text-slate-950 px-2 py-0.5 rounded">
                Store Featured
              </span>
              <span className="text-xs text-emerald-400 font-semibold">100% Free Downloads</span>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white">Developer Starter Kits & Boilerplates</h3>
            <p className="text-xs text-white/60">FastAPI + SQLite, Multi-Threaded Async Web Scraper, Docker PDF Cheatsheets & more.</p>
          </div>
          <Link
            to="/products"
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all hover:scale-105 whitespace-nowrap shadow-lg flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Explore Store →
          </Link>
        </motion.div>

        {/* FLAGSHIP SIDE-BY-SIDE HERO SECTION (FILE SHARE & TEXT SHARE) */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Flagship Tools</h2>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* FILE SHARE CARD */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#111] light-theme-dark-card p-8 rounded-3xl flex flex-col justify-between group shadow-2xl hover:shadow-emerald-500/10 transition-all border border-white/10"
            >
              <Link to="/file-share" className="flex flex-col h-full justify-between space-y-6">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/40">
                      Flagship #1
                    </span>
                    <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/40">
                      <FileUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                  <h3 className="text-4xl font-black tracking-tighter uppercase mt-6 text-white">File Share</h3>
                  <p className="text-white/70 text-sm mt-3 font-medium leading-relaxed">
                    Transfer files up to 10MB via high-speed Cloudflare edge storage or unlimited file sizes via encrypted peer-to-peer WebRTC connection.
                  </p>
                </div>
                <div className="mt-6 w-full py-4 bg-emerald-500 text-slate-950 font-extrabold text-center uppercase text-xs tracking-widest rounded-2xl group-hover:bg-emerald-400 transition-colors shadow-md">
                  Launch File Share →
                </div>
              </Link>
            </motion.div>

            {/* TEXT SHARE CARD */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#111] light-theme-dark-card p-8 rounded-3xl flex flex-col justify-between group shadow-2xl hover:shadow-emerald-500/10 transition-all border border-white/10"
            >
              <Link to="/text-share" className="flex flex-col h-full justify-between space-y-6">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/40">
                      Flagship #2
                    </span>
                    <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/40">
                      <FileText className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                  <h3 className="text-4xl font-black tracking-tighter uppercase mt-6 text-white">Text Share</h3>
                  <p className="text-white/70 text-sm mt-3 font-medium leading-relaxed">
                    Instant, anonymous text and code sharing. Create secure, self-destructing links with custom expiration timers and view counter protection.
                  </p>
                </div>
                <div className="mt-6 w-full py-4 bg-emerald-500 text-slate-950 font-extrabold text-center uppercase text-xs tracking-widest rounded-2xl group-hover:bg-emerald-400 transition-colors shadow-md">
                  Launch Text Share →
                </div>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Categories */}
        {["Developer", "Image", "PDF", "Utilities"].map((cat, catIdx) => (
          <div key={cat}>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-black uppercase tracking-tighter">{cat} Tools</h2>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tools.filter(t => t.category === cat).map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    to={tool.href}
                    className="block bg-white/5 border border-white/10 p-6 flex flex-col justify-between hover:bg-white/10 transition-all h-full min-h-[160px]"
                  >
                    <div className="mb-4">
                      {React.isValidElement(tool.icon) && tool.icon.type !== 'div' ? (
                        <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
                          {tool.icon}
                        </div>
                      ) : (
                        tool.icon
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold uppercase tracking-tighter text-lg">{tool.name}</h4>
                      <p className="text-xs text-white/40">{tool.description}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* Developer Gateway */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-[#111] border-2 border-white/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between group gap-4 min-h-[160px] mt-4"
        >
          <div className="max-w-[100%] sm:max-w-[60%]">
            <h4 className="font-bold uppercase tracking-tighter text-xl">Developer Gateway</h4>
            <p className="text-xs text-white/40 mt-1">Build with ShareFlow — API keys, usage tracking, full REST API. Sign up and start integrating.</p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-3 w-full sm:w-auto">
            <span className="text-[10px] text-white/20 font-mono">v1/api/live</span>
            <Link to="/dev" className="px-5 py-2.5 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-black uppercase tracking-widest whitespace-nowrap hover:bg-emerald-600 hover:text-white transition-colors rounded-lg shadow-md">Sign In</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
