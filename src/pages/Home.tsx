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
  Layers
} from "lucide-react";
import { motion } from "motion/react";

const tools = [
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
            <span className="bg-white text-black px-3 py-0.5 mt-1 inline-block">Universe</span>
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

        {/* Flagship */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.filter(t => t.featured).map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="sm:col-span-2 row-span-1 bg-white text-black p-6 flex flex-col justify-between group h-[300px]"
            >
              <Link to={tool.href} className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase tracking-widest bg-black text-white px-2 py-0.5 light-theme-invert">Flagship</span>
                    {tool.icon}
                  </div>
                  <h3 className="text-4xl font-bold tracking-tighter uppercase mt-4">{tool.name}</h3>
                  <p className="text-black/60 text-sm mt-2 font-medium light-theme-text-muted">{tool.description}</p>
                </div>
                <div className="mt-8 w-full py-4 border-2 border-black font-black text-center uppercase text-sm tracking-widest group-hover:bg-black group-hover:text-white transition-colors light-theme-btn">
                  Start Shareing
                </div>
              </Link>
            </motion.div>
          ))}
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

        {/* API Access */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-[#111] border-2 border-dashed border-white/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between group gap-4 min-h-[160px] mt-4"
        >
          <div className="max-w-[100%] sm:max-w-[60%]">
            <h4 className="font-bold uppercase tracking-tighter text-xl">Developer Gateway (Coming Soon)</h4>
            <p className="text-xs text-white/40 mt-1">Scale ShareFlow tools in your own applications. Generous free tier with Redis caching.</p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-3 w-full sm:w-auto">
            <span className="text-[10px] text-white/20 font-mono">v1/api/endpoint</span>
            <button className="px-4 py-2 bg-white/20 text-white/50 text-[10px] font-black uppercase tracking-widest cursor-not-allowed whitespace-nowrap">Coming Soon</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
