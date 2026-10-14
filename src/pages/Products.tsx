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
  Layers,
  Code2,
  Palette,
  Terminal,
  Zap,
  Download,
  Eye,
  SlidersHorizontal,
  CreditCard,
  ShoppingBag
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
  const [promptFilterType, setPromptFilterType] = useState<"all" | "free" | "paid">("all");
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
    if (promptFilterType === "free" && !p.isFree) return false;
    if (promptFilterType === "paid" && p.isFree) return false;
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
          <Sparkles className="w-3.5 h-3.5 text-[#0071e3] dark:text-[#38bdf8]" />
          <span>SHAREFLOW DIGITAL GOODS STORE • 2026 EDITION</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1d1d1f] dark:text-white max-w-3xl leading-tight">
          AI Website Design Prompts & Lossless 8K Wallpapers.
        </h1>
        <p className="text-sm sm:text-base text-[#6e6e73] dark:text-[#a1a1aa] max-w-2xl mt-3 leading-relaxed">
          Production-grade prompts inspired by <a href="https://superdesign.dev" target="_blank" rel="noreferrer" className="text-[#0071e3] dark:text-[#38bdf8] underline hover:opacity-80">SuperDesign.dev</a> for v0, Bolt, and Lovable, plus handcrafted HDR10 8K desktop wallpapers. 100% free sponsor unlocks & micro-pricing via SupportKori.
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
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] shadow-xs">
            {/* Tool Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-semibold text-[#86868b] dark:text-[#71717a] mr-1 flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5" /> Engine:
              </span>
              {["All", "v0", "Bolt.new", "Lovable", "Cursor", "Claude", "Universal"].map((tool) => (
                <button
                  key={tool}
                  type="button"
                  onClick={() => setPromptTool(tool)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    promptTool === tool
                      ? "bg-[#0071e3] text-white shadow-xs"
                      : "bg-[#f5f5f7] dark:bg-[#181a20] text-[#6e6e73] dark:text-[#a1a1aa] hover:text-[#1d1d1f] dark:hover:text-white"
                  }`}
                >
                  {tool}
                </button>
              ))}
            </div>

            {/* Free vs Paid Toggle */}
            <div className="flex items-center gap-1 bg-[#f5f5f7] dark:bg-[#181a20] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPromptFilterType("all")}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  promptFilterType === "all" ? "bg-white dark:bg-[#27272a] text-[#1d1d1f] dark:text-white shadow-xs" : "text-[#6e6e73] dark:text-[#a1a1aa]"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setPromptFilterType("free")}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  promptFilterType === "free" ? "bg-[#34c759] text-white shadow-xs" : "text-[#6e6e73] dark:text-[#a1a1aa]"
                }`}
              >
                🎁 Free SuperDesign
              </button>
              <button
                type="button"
                onClick={() => setPromptFilterType("paid")}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  promptFilterType === "paid" ? "bg-[#0071e3] text-white shadow-xs" : "text-[#6e6e73] dark:text-[#a1a1aa]"
                }`}
              >
                💎 SupportKori Packs
              </button>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {["All", "Landing Page", "Dashboard", "E-Commerce", "Portfolio", "Micro-SaaS", "Mobile UI"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setPromptCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  promptCategory === cat
                    ? "bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f]"
                    : "bg-white dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] text-[#6e6e73] dark:text-[#a1a1aa] hover:border-[#0071e3]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Prompts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="bg-white dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] hover:border-[#0071e3] dark:hover:border-[#0071e3] rounded-3xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-200 group"
              >
                {/* Visual Header / Mockup Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#090D16]">
                  <img
                    src={prompt.previewImage}
                    alt={prompt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Badges on preview */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {prompt.targetTool}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-slate-300 border border-white/10">
                      {prompt.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    {prompt.isFree ? (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#34c759] text-white shadow-xs">
                        Free Giveaway
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#0071e3] text-white shadow-xs">
                        ৳{prompt.priceBdt} / ${prompt.priceUsd}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-xs">
                    <span className="text-[11px] font-mono text-cyan-300">
                      {prompt.copyCount.toLocaleString()} builders used
                    </span>
                    {prompt.livePreviewUrl && (
                      <a
                        href={prompt.livePreviewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] underline flex items-center gap-1 hover:text-white"
                      >
                        <span>Demo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 flex flex-col gap-4 flex-1 justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#1d1d1f] dark:text-white group-hover:text-[#0071e3] transition-colors leading-snug">
                      {prompt.title}
                    </h3>
                    <p className="text-xs text-[#6e6e73] dark:text-[#a1a1aa] mt-2 leading-relaxed line-clamp-2">
                      {prompt.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#e5e5ea] dark:border-[#27272a] flex flex-col gap-1.5">
                      {prompt.features.slice(0, 3).map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#1d1d1f] dark:text-[#e4e4e7]">
                          <Check className="w-3.5 h-3.5 text-[#34c759] flex-shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="pt-2">
                    {prompt.isFree ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (unlockedPromptId === prompt.id) {
                            setSelectedPrompt(prompt);
                          } else {
                            handleStartPromptUnlock(prompt);
                          }
                        }}
                        className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                      >
                        {unlockedPromptId === prompt.id ? (
                          <>
                            <Eye className="w-4 h-4 text-white" />
                            <span>View Full Prompt</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-white" />
                            <span>Unlock Free Prompt</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {prompt.supportKoriUrl && (
                          <a
                            href={prompt.supportKoriUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full min-h-[40px] py-2 px-3 rounded-xl bg-[#34c759] hover:bg-[#2eb350] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Buy via SupportKori (৳{prompt.priceBdt} / bKash)</span>
                          </a>
                        )}
                        {prompt.gumroadUrl && (
                          <a
                            href={`${prompt.gumroadUrl}?wanted=true`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full min-h-[38px] py-1.5 px-3 rounded-xl bg-[#1d1d1f] dark:bg-[#27272a] hover:bg-black text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Buy via Gumroad (${prompt.priceUsd})</span>
                          </a>
                        )}
                      </div>
                    )}
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
                className="bg-white dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] hover:border-[#8b5cf6] dark:hover:border-[#8b5cf6] rounded-3xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-200 group"
              >
                {/* Preview Image with Badges */}
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <img
                    src={wp.previewUrl}
                    alt={wp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#8b5cf6] text-white shadow-xs">
                      {wp.itemCount} Master Wallpapers
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-xs">
                    <span className="text-[11px] font-medium text-slate-300">
                      Format: {wp.format}
                    </span>
                    <span className="font-bold text-emerald-400">
                      Retail: {wp.price}
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
                      <span className="text-xs font-bold text-[#34c759] bg-[#eafaf1] dark:bg-[#34c759]/15 px-2 py-0.5 rounded-full">
                        100% OFF with Sponsor
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#1d1d1f] dark:text-white group-hover:text-[#8b5cf6] transition-colors leading-snug">
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

                  {/* Actions */}
                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartWallpaperUnlock(wp)}
                      className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Unlock 100% OFF Coupon</span>
                    </button>
                    <a
                      href={`${wp.gumroadBaseUrl}/l/${wp.gumroadSlug}?wanted=true`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-h-[38px] py-1.5 px-3 rounded-xl bg-[#f5f5f7] dark:bg-[#181a20] hover:bg-[#e5e5ea] dark:hover:bg-[#27272a] text-[#1d1d1f] dark:text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Direct Checkout ({wp.price})</span>
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
      {/* MODAL 2: FULL AI PROMPT INSPECTION & 1-CLICK CLIPBOARD COPY              */}
      {/* ========================================================================= */}
      {selectedPrompt && (unlockedPromptId === selectedPrompt.id || selectedPrompt.isFree === false) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#12141a] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#e5e5ea] dark:border-[#27272a] relative text-left max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSelectedPrompt(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f5f5f7] dark:bg-[#181a20] hover:bg-[#e5e5ea] dark:hover:bg-[#27272a] text-[#86868b] dark:text-[#a1a1aa] hover:text-[#1d1d1f] dark:hover:text-white flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#eafaf1] dark:bg-[#34c759]/15 text-[#34c759]">
                Ready to Generate
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#f5f5f7] dark:bg-[#181a20] text-[#0071e3] dark:text-[#38bdf8]">
                {selectedPrompt.targetTool}
              </span>
              <span className="text-[11px] font-medium text-[#86868b] dark:text-[#71717a]">
                {selectedPrompt.category}
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white pr-8">
              {selectedPrompt.title}
            </h3>

            {/* Scrollable Prompt Viewer */}
            <div className="mt-4 overflow-y-auto pr-1 flex flex-col gap-4 flex-1">
              {selectedPrompt.systemInstruction && (
                <div className="p-3.5 rounded-2xl bg-[#f5f5f7] dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#6e6e73] dark:text-[#a1a1aa] flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-[#0071e3]" /> System Persona / Instruction:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopySystemInstruction(selectedPrompt.systemInstruction!)}
                      className="text-[11px] font-semibold text-[#0071e3] dark:text-[#38bdf8] hover:underline"
                    >
                      {copiedSystemText ? "Copied!" : "Copy Persona"}
                    </button>
                  </div>
                  <p className="text-xs font-mono text-[#1d1d1f] dark:text-slate-300 leading-relaxed">
                    {selectedPrompt.systemInstruction}
                  </p>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-[#090D16] border border-[#27272a] text-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5" /> Prompt Specification (Ready for AI Generator):
                  </span>
                </div>
                <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed text-slate-300 select-all max-h-64 overflow-y-auto">
                  {selectedPrompt.promptContent}
                </pre>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-[#e5e5ea] dark:border-[#27272a] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleDownloadPrompt(selectedPrompt)}
                className="py-2.5 px-4 rounded-xl bg-[#f5f5f7] dark:bg-[#181a20] hover:bg-[#e5e5ea] dark:hover:bg-[#27272a] text-[#1d1d1f] dark:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Save .txt</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopyPromptText(selectedPrompt.promptContent)}
                className="flex-1 py-2.5 px-6 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {copiedPromptText ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-white" />
                    <span>Copy Full Prompt to Clipboard</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
