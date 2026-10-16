/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
  Sparkles,
  Check,
  Gift,
  ArrowRight,
  ExternalLink,
  Copy,
  CheckCircle2,
  Monitor,
  Smartphone,
  Tablet,
  Layers,
  Code2,
  Palette,
  Terminal,
  Zap,
  Download,
  Eye,
  SlidersHorizontal,
  CreditCard,
  ShoppingBag,
  Clock,
  Search,
  Maximize2
} from "lucide-react";
import initialPrompts from "../../data/prompts.json";
import initialWallpapers from "../../data/wallpapers.json";
import { PromptItem, PromptCategory, TargetTool } from "../types/prompt";
import { WallpaperBundle, WallpaperCategory } from "../types/wallpaper";

const ADSTERRA_SMART_LINK = "https://poochingdesolate.com/kbh3b1i8?key=2be98717904ae1521ea80373ae4d1933";

export function Products() {
  // Store Tab: "prompts" or "wallpapers"
  const [activeTab, setActiveTab] = useState<"prompts" | "wallpapers">("prompts");

  // Prompts State
  const [prompts, setPrompts] = useState<PromptItem[]>(initialPrompts as unknown as PromptItem[]);
  const [promptCategory, setPromptCategory] = useState<string>("All");
  const [promptTool, setPromptTool] = useState<string>("All");
  const [promptSearch, setPromptSearch] = useState<string>("");
  const [previewPrompt, setPreviewPrompt] = useState<PromptItem | null>(null);
  const [previewViewport, setPreviewViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);
  const [unlockedPromptId, setUnlockedPromptId] = useState<string | null>(null);
  const [copiedPromptText, setCopiedPromptText] = useState(false);
  const [copiedSystemText, setCopiedSystemText] = useState(false);

  // Wallpapers State
  const [wallpapers, setWallpapers] = useState<WallpaperBundle[]>(initialWallpapers as unknown as WallpaperBundle[]);
  const [wallpaperCategory, setWallpaperCategory] = useState<string>("All");
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperBundle | null>(null);

  // Shared Adsterra Unlock State
  const [adStep, setAdStep] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [unlockTargetType, setUnlockTargetType] = useState<"wallpaper" | "prompt" | null>(null);

  // Fetch live catalog from backend if available
  useEffect(() => {
    fetch("/api/prompts?all=false")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.prompts) && data.prompts.length > 0) {
          setPrompts(data.prompts);
        }
      })
      .catch(() => {});

    fetch("/api/wallpapers?all=false")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.wallpapers) && data.wallpapers.length > 0) {
          setWallpapers(data.wallpapers);
        }
      })
      .catch(() => {});
  }, []);

  // Filter Prompts
  const filteredPrompts = prompts.filter((p) => {
    if (promptCategory !== "All" && p.category !== promptCategory) return false;
    if (promptTool !== "All" && p.targetTool !== promptTool) return false;
    if (promptSearch.trim()) {
      const q = promptSearch.toLowerCase();
      const matchTitle = (p.title || "").toLowerCase().includes(q);
      const matchDesc = (p.description || "").toLowerCase().includes(q);
      const matchTags = Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }
    return true;
  });

  // Filter Wallpapers
  const filteredWallpapers = wallpapers.filter((w) => {
    if (wallpaperCategory !== "All" && w.category !== wallpaperCategory) return false;
    return true;
  });

  // Start Adsterra Unlock for Wallpaper
  const handleStartWallpaperUnlock = (wallpaper: WallpaperBundle) => {
    setSelectedWallpaper(wallpaper);
    setUnlockTargetType("wallpaper");
    setAdStep(1);
    setIsUnlocked(false);
    setCouponCode("");
  };

  // Start Adsterra Unlock for Free Prompt
  const handleStartPromptUnlock = (prompt: PromptItem) => {
    setSelectedPrompt(prompt);
    setUnlockTargetType("prompt");
    setAdStep(1);
    setIsUnlocked(false);
  };

  const handleAdStepClick = async () => {
    window.open(ADSTERRA_SMART_LINK, "_blank", "noopener,noreferrer");

    if (adStep < 5) {
      setAdStep((prev) => prev + 1);
    } else {
      setIsUnlocked(true);
      if (unlockTargetType === "wallpaper" && selectedWallpaper) {
        try {
          const res = await fetch("/api/mint-coupon", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: selectedWallpaper.id })
          });
          const data = await res.json();
          if (data && data.couponCode) {
            setCouponCode(data.couponCode);
          } else {
            const fallbackHash = Math.random().toString(36).substring(2, 8).toUpperCase();
            setCouponCode(`SF100_WALL_${fallbackHash}`);
          }
        } catch {
          const fallbackHash = Math.random().toString(36).substring(2, 8).toUpperCase();
          setCouponCode(`SF100_WALL_${fallbackHash}`);
        }
      } else if (unlockTargetType === "prompt" && selectedPrompt) {
        setUnlockedPromptId(selectedPrompt.id);
        // Track copy/unlock on backend
        fetch(`/api/prompts/${selectedPrompt.id}/copy`, { method: "POST" }).catch(() => {});
      }
    }
  };

  const handleCopyCoupon = () => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode);
      setCopiedCoupon(true);
      setTimeout(() => setCopiedCoupon(false), 2000);
    }
  };

  const handleCopyPromptText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptText(true);
    setTimeout(() => setCopiedPromptText(false), 2000);
  };

  const handleCopySystemInstruction = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSystemText(true);
    setTimeout(() => setCopiedSystemText(false), 2000);
  };

  const handleDownloadPrompt = (prompt: PromptItem) => {
    const blob = new Blob(
      [
        `=======================================================\n`,
        `SHAREFLOW AI DESIGN PROMPT: ${prompt.title.toUpperCase()}\n`,
        `Target Tool: ${prompt.targetTool} | Category: ${prompt.category}\n`,
        `Reference: https://shareflow.mhr3d.online\n`,
        `=======================================================\n\n`,
        `[SYSTEM PERSONA / INSTRUCTION]\n`,
        `${prompt.systemInstruction || "You are an expert principal UI/UX frontend designer."}\n\n`,
        `[PROMPT CONTENT / DESIGN SPECIFICATION]\n`,
        `${prompt.promptContent}\n`
      ],
      { type: "text/plain;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shareflow-prompt-${prompt.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-16">
      {/* Hero Header */}
      <div className="text-center pt-4 sm:pt-6 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#f5f5f7] dark:bg-[#181a20] text-[#0071e3] dark:text-[#38bdf8] border border-[#d2d2d7]/50 dark:border-[#27272a] mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
          <span>SHAREFLOW DIGITAL GOODS • 110+ AI PROMPTS LIVE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1d1d1f] dark:text-white max-w-3xl leading-tight">
          AI Website Design Prompts &amp; Lossless 8K Wallpapers.
        </h1>
        <p className="text-sm sm:text-base text-[#6e6e73] dark:text-[#a1a1aa] max-w-2xl mt-3 leading-relaxed">
          Production-tested architecture blueprints engineered for v0, Bolt.new, Lovable &amp; Cursor. Explore live interactive previews before unlocking on SupportKori for just ৳49.
        </p>

        {/* Master Catalog Switcher Tabs */}
        <div className="mt-8 flex items-center p-1.5 bg-[#f5f5f7] dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a] rounded-2xl shadow-inner gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("prompts")}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "prompts"
                ? "bg-white dark:bg-[#27272a] text-[#0071e3] dark:text-white shadow-sm"
                : "text-[#6e6e73] dark:text-[#a1a1aa] hover:text-[#1d1d1f] dark:hover:text-white"
            }`}
          >
            <Zap className="w-4 h-4 text-[#0071e3] dark:text-[#38bdf8]" />
            <span>AI Design Prompts</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#eafaf1] dark:bg-[#34c759]/20 text-[#34c759]">
              {prompts.length} Prompts
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("wallpapers")}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "wallpapers"
                ? "bg-white dark:bg-[#27272a] text-[#0071e3] dark:text-white shadow-sm"
                : "text-[#6e6e73] dark:text-[#a1a1aa] hover:text-[#1d1d1f] dark:hover:text-white"
            }`}
          >
            <Monitor className="w-4 h-4 text-[#8b5cf6]" />
            <span>8K Wallpaper Packs</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f3e8ff] dark:bg-[#8b5cf6]/20 text-[#8b5cf6]">
              {wallpapers.length} Packs
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: AI WEBSITE DESIGN PROMPTS                                     */}
      {/* ========================================================================= */}
      {activeTab === "prompts" && (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
          {/* Sub-Filters Ribbon */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] shadow-xs">
            {/* Tool Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <span className="text-xs font-semibold text-[#86868b] dark:text-[#71717a] mr-1 flex items-center gap-1 shrink-0">
                <Code2 className="w-3.5 h-3.5" /> Engine:
              </span>
              {["All", "v0", "Bolt.new", "Lovable", "Cursor", "Claude", "Universal"].map((tool) => (
                <button
                  key={tool}
                  type="button"
                  onClick={() => setPromptTool(tool)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                    promptTool === tool
                      ? "bg-[#0071e3] text-white shadow-xs"
                      : "bg-[#f5f5f7] dark:bg-[#181a20] text-[#6e6e73] dark:text-[#a1a1aa] hover:text-[#1d1d1f] dark:hover:text-white"
                  }`}
                >
                  {tool}
                </button>
              ))}
            </div>

            {/* Search Input Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#86868b] dark:text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={promptSearch}
                onChange={(e) => setPromptSearch(e.target.value)}
                placeholder="Search 110+ prompts (e.g. SaaS, Fintech, Bento, 3D)..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#f5f5f7] dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a] text-[#1d1d1f] dark:text-white placeholder-[#86868b] dark:placeholder-[#71717a] focus:outline-none focus:border-[#0071e3] transition-colors"
              />
              {promptSearch && (
                <button
                  type="button"
                  onClick={() => setPromptSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Chips & Counter */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {["All", "Landing Page", "Dashboard", "Micro-SaaS", "E-Commerce", "Portfolio", "Mobile UI"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setPromptCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    promptCategory === cat
                      ? "bg-[#0071e3] text-white shadow-xs"
                      : "bg-white dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] text-[#6e6e73] dark:text-[#a1a1aa] hover:border-[#0071e3]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="text-xs font-medium text-[#86868b] dark:text-[#71717a] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Showing <strong>{filteredPrompts.length}</strong> of {prompts.length} Prompts • ৳49 BDT on SupportKori</span>
            </div>
          </div>

          {/* Prompts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="bg-white dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] hover:border-[#0071e3]/60 dark:hover:border-[#0071e3]/60 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 group"
              >
                {/* Visual Header / Mockup Preview */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#090D16]">
                  <iframe
                    src={`/previews/${prompt.id}.html`}
                    title={prompt.title}
                    loading="lazy"
                    className="w-[200%] h-[200%] transform scale-50 origin-top-left pointer-events-none select-none opacity-80 group-hover:opacity-100 transition-opacity"
                    sandbox="allow-scripts allow-same-origin"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                  {/* Badges on preview */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20">
                      {prompt.targetTool}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-slate-300 border border-white/10">
                      {prompt.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#0071e3] text-white shadow-md flex items-center gap-1">
                      <span>৳49 BDT</span>
                    </span>
                  </div>

                  {/* Hover Overlay button for Live Preview */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px] z-20">
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewPrompt(prompt);
                        setPreviewViewport("desktop");
                      }}
                      className="px-4 py-2 rounded-xl bg-white/95 dark:bg-[#181a20]/95 text-[#1d1d1f] dark:text-white font-bold text-xs shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-[#0071e3]" />
                      <span>Interactive Live Preview</span>
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-xs z-10">
                    <span className="text-[11px] font-mono text-cyan-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>SupportKori Exclusive</span>
                    </span>
                    <span className="text-[10px] font-medium text-white/70">
                      Full Blueprint Included
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 flex flex-col gap-4 flex-1 justify-between">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-bold text-[#1d1d1f] dark:text-white group-hover:text-[#0071e3] transition-colors line-clamp-1">
                      {prompt.title}
                    </h3>
                    <p className="text-xs text-[#6e6e73] dark:text-[#a1a1aa] line-clamp-2 leading-relaxed">
                      {prompt.description}
                    </p>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {prompt.features.slice(0, 3).map((feat, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-[#f5f5f7] dark:bg-[#181a20] text-[#6e6e73] dark:text-[#a1a1aa] border border-[#e5e5ea] dark:border-[#27272a]"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-[#e5e5ea]/60 dark:border-[#27272a]/60 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewPrompt(prompt);
                        setPreviewViewport("desktop");
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#f5f5f7] dark:bg-[#181a20] hover:bg-[#e5e5ea] dark:hover:bg-[#27272a] text-[#1d1d1f] dark:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-[#e5e5ea] dark:border-[#27272a] cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#0071e3]" />
                      <span>Live Preview</span>
                    </button>

                    <a
                      href={prompt.supportKoriUrl || "https://www.supportkori.com/mhr3d"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 text-center"
                    >
                      <span>Buy ৳49</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: 8K LOSSLESS WALLPAPER PACKS                                   */}
      {/* ========================================================================= */}
      {activeTab === "wallpapers" && (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
          {/* Wallpaper Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {["All", "Desktop 8K", "Mobile OLED", "Dual Monitor", "3D Sci-Fi", "Minimalist Dark"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setWallpaperCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  wallpaperCategory === cat
                    ? "bg-[#8b5cf6] text-white shadow-xs"
                    : "bg-white dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] text-[#6e6e73] dark:text-[#a1a1aa] hover:border-[#8b5cf6]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Wallpapers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredWallpapers.map((wp) => (
              <div
                key={wp.id}
                className="bg-white dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] rounded-3xl overflow-hidden flex flex-col justify-between shadow-xs select-none pointer-events-none cursor-not-allowed opacity-90 transition-all duration-200"
              >
                {/* Preview Image with Badges */}
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <img
                    src={wp.previewUrl}
                    alt={wp.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20">
                      {wp.resolution}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-purple-300 border border-purple-500/30">
                      {wp.aspectRatio}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500 text-white shadow-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Coming Soon</span>
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-xs">
                    <span className="text-[11px] font-medium text-slate-300">
                      Format: {wp.format}
                    </span>
                    <span className="font-bold text-purple-300">
                      {wp.itemCount} Master Wallpapers
                    </span>
                  </div>
                </div>

                {/* Wallpaper Info & Details */}
                <div className="p-6 flex flex-col gap-4 flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#f3e8ff] dark:bg-[#8b5cf6]/20 text-[#8b5cf6]">
                        {wp.category}
                      </span>
                      <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        Catalog Preview
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#1d1d1f] dark:text-white leading-snug">
                      {wp.title}
                    </h3>
                    <p className="text-xs text-[#6e6e73] dark:text-[#a1a1aa] mt-2 leading-relaxed">
                      {wp.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#e5e5ea] dark:border-[#27272a] flex flex-col gap-1.5">
                      {wp.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#1d1d1f] dark:text-[#e4e4e7]">
                          <Check className="w-3.5 h-3.5 text-[#8b5cf6] flex-shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions - Unclickable Coming Soon */}
                  <div className="pt-2">
                    <div className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#f5f5f7] dark:bg-[#1a1d24] text-[#86868b] dark:text-[#71717a] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#e5e5ea] dark:border-[#27272a] shadow-xs cursor-not-allowed">
                      <Clock className="w-3.5 h-3.5 text-purple-500" />
                      <span>Coming Soon</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: 5-STEP ADSTERRA SPONSOR UNLOCK                                   */}
      {/* ========================================================================= */}
      {((unlockTargetType === "wallpaper" && selectedWallpaper) ||
        (unlockTargetType === "prompt" && selectedPrompt && !isUnlocked)) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#12141a] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e5e5ea] dark:border-[#27272a] relative text-left">
            <button
              onClick={() => {
                setUnlockTargetType(null);
                setSelectedWallpaper(null);
                setSelectedPrompt(null);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f5f5f7] dark:bg-[#181a20] hover:bg-[#e5e5ea] dark:hover:bg-[#27272a] text-[#86868b] dark:text-[#a1a1aa] hover:text-[#1d1d1f] dark:hover:text-white flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#eafaf1] dark:bg-[#34c759]/15 text-[#34c759]">
                Sponsored Unlock Flow
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white">
              {unlockTargetType === "wallpaper" ? selectedWallpaper?.title : selectedPrompt?.title}
            </h3>
            <p className="text-xs text-[#6e6e73] dark:text-[#a1a1aa] mt-1">
              Support ShareFlow via sponsor clicks to unlock free access.
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a] flex flex-col gap-3">
              {!isUnlocked ? (
                <>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1d1d1f] dark:text-white">Sponsor Verification Progress</span>
                    <span className="font-mono font-bold text-[#0071e3] dark:text-[#38bdf8]">{adStep} of 5</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#e5e5ea] dark:bg-[#27272a] overflow-hidden">
                    <div
                      className="h-full bg-[#0071e3] rounded-full transition-all duration-300"
                      style={{ width: `${(adStep / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#86868b] dark:text-[#a1a1aa] leading-relaxed">
                    Click below to visit the sponsored page. Once step 5 completes, your {unlockTargetType === "wallpaper" ? "100% OFF Gumroad coupon" : "AI prompt specification"} will be granted immediately.
                  </p>
                  <button
                    onClick={handleAdStepClick}
                    className="w-full min-h-[44px] mt-2 py-3 px-4 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span>{adStep === 0 ? "Start Step 1 (Visit Sponsor)" : `Continue Step ${adStep + 1} of 5`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 text-center py-2">
                  <CheckCircle2 className="w-10 h-10 text-[#34c759] mx-auto" />
                  <h4 className="font-bold text-base text-[#1d1d1f] dark:text-white">Wallpaper Pack Unlocked!</h4>
                  <p className="text-xs text-[#6e6e73] dark:text-[#a1a1aa]">
                    Use this 100% OFF coupon code on Gumroad to claim your lossless 8K bundle for free:
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      readOnly
                      value={couponCode}
                      className="flex-1 text-center font-mono font-bold text-sm py-2.5 px-3 bg-white dark:bg-[#12141a] border border-[#0071e3] rounded-xl text-[#0071e3] dark:text-[#38bdf8]"
                    />
                    <button
                      onClick={handleCopyCoupon}
                      className="px-4 py-2.5 bg-[#0071e3] text-white rounded-xl text-xs font-semibold hover:bg-[#0077ed]"
                    >
                      {copiedCoupon ? "Copied" : "Copy"}
                    </button>
                  </div>
                  {selectedWallpaper && (
                    <a
                      href={`${selectedWallpaper.gumroadBaseUrl}/l/${selectedWallpaper.gumroadSlug}?wanted=true`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#1d1d1f] dark:bg-white hover:bg-black dark:hover:bg-[#f5f5f7] text-white dark:text-[#1d1d1f] font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Claim Free on Gumroad</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: INTERACTIVE LIVE PREVIEW MODAL (FULL SCREEN / DEVICE TOGGLE)      */}
      {/* ========================================================================= */}
      {previewPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#12141a] rounded-3xl max-w-6xl w-full h-[90vh] shadow-2xl border border-[#e5e5ea] dark:border-[#27272a] flex flex-col overflow-hidden relative">
            {/* Header */}
            <div className="p-4 sm:px-6 py-3.5 border-b border-[#e5e5ea] dark:border-[#27272a] flex flex-wrap items-center justify-between gap-3 bg-[#fafafc] dark:bg-[#15171f]">
              {/* Title & Badges */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#0071e3] text-white">
                    {previewPrompt.targetTool}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f5f5f7] dark:bg-[#20232b] text-[#6e6e73] dark:text-[#a1a1aa] border border-[#e5e5ea] dark:border-[#27272a]">
                    {previewPrompt.category}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#1d1d1f] dark:text-white truncate">
                  {previewPrompt.title}
                </h3>
              </div>

              {/* Viewport Controls & Actions */}
              <div className="flex items-center gap-2">
                {/* Viewport Toggles */}
                <div className="hidden sm:flex items-center gap-1 bg-[#f5f5f7] dark:bg-[#181a20] p-1 rounded-xl border border-[#e5e5ea] dark:border-[#27272a]">
                  <button
                    type="button"
                    onClick={() => setPreviewViewport("desktop")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                      previewViewport === "desktop"
                        ? "bg-white dark:bg-[#27272a] text-[#0071e3] dark:text-[#38bdf8] shadow-xs"
                        : "text-[#6e6e73] dark:text-[#a1a1aa] hover:text-[#1d1d1f] dark:hover:text-white"
                    }`}
                    title="Desktop Preview"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewViewport("tablet")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                      previewViewport === "tablet"
                        ? "bg-white dark:bg-[#27272a] text-[#0071e3] dark:text-[#38bdf8] shadow-xs"
                        : "text-[#6e6e73] dark:text-[#a1a1aa] hover:text-[#1d1d1f] dark:hover:text-white"
                    }`}
                    title="Tablet Preview"
                  >
                    <Tablet className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Tablet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewViewport("mobile")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                      previewViewport === "mobile"
                        ? "bg-white dark:bg-[#27272a] text-[#0071e3] dark:text-[#38bdf8] shadow-xs"
                        : "text-[#6e6e73] dark:text-[#a1a1aa] hover:text-[#1d1d1f] dark:hover:text-white"
                    }`}
                    title="Mobile Viewport"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Mobile</span>
                  </button>
                </div>

                {/* Open in full tab button */}
                <a
                  href={`/previews/${previewPrompt.id}.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-xl bg-[#f5f5f7] dark:bg-[#181a20] hover:bg-[#e5e5ea] dark:hover:bg-[#27272a] text-[#6e6e73] dark:text-[#a1a1aa] hover:text-[#1d1d1f] dark:hover:text-white border border-[#e5e5ea] dark:border-[#27272a] transition-colors"
                  title="Open Preview in New Tab"
                >
                  <Maximize2 className="w-4 h-4" />
                </a>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setPreviewPrompt(null)}
                  className="w-8 h-8 rounded-full bg-[#f5f5f7] dark:bg-[#181a20] hover:bg-[#e5e5ea] dark:hover:bg-[#27272a] text-[#86868b] dark:text-[#a1a1aa] hover:text-[#1d1d1f] dark:hover:text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Interactive Preview Canvas */}
            <div className="flex-1 bg-[#090D16] p-2 sm:p-4 overflow-hidden flex items-center justify-center relative">
              <div
                className={`transition-all duration-300 h-full flex items-center justify-center overflow-hidden ${
                  previewViewport === "desktop"
                    ? "w-full rounded-xl"
                    : previewViewport === "tablet"
                    ? "w-[768px] max-w-full rounded-2xl shadow-2xl border-4 border-[#27272a]"
                    : "w-[390px] max-w-full rounded-3xl shadow-2xl border-4 border-[#27272a]"
                }`}
              >
                <iframe
                  src={`/previews/${previewPrompt.id}.html`}
                  title={previewPrompt.title}
                  className="w-full h-full bg-[#0a0f1d] border-0 rounded-lg"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>

            {/* Footer Bar */}
            <div className="p-4 sm:px-6 py-3 border-t border-[#e5e5ea] dark:border-[#27272a] bg-white dark:bg-[#12141a] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
                  ৳49 BDT Only
                </div>
                <div className="text-xs text-[#6e6e73] dark:text-[#a1a1aa]">
                  <span className="font-semibold text-[#1d1d1f] dark:text-white">SupportKori Blueprint:</span> Complete prompt specification unlocked upon payment.
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setPreviewPrompt(null)}
                  className="py-2.5 px-4 rounded-xl bg-[#f5f5f7] dark:bg-[#181a20] hover:bg-[#e5e5ea] dark:hover:bg-[#27272a] text-[#1d1d1f] dark:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
                <a
                  href={previewPrompt.supportKoriUrl || "https://www.supportkori.com/mhr3d"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial py-2.5 px-6 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm text-center"
                >
                  <span>Unlock Prompt on SupportKori (৳49)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
