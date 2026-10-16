/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Sparkles,
  ExternalLink,
  Monitor,
  Smartphone,
  Tablet,
  Layers,
  Zap,
  Download,
  Search,
  Maximize2,
  Minimize2,
  RotateCw,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  ArrowRight,
  Filter,
  Palette,
  ChevronLeft,
  X,
  CreditCard,
  CheckCircle2,
  SlidersHorizontal,
  Code2,
  Camera,
  Image as ImageIcon
} from "lucide-react";
import initialPrompts from "../../data/prompts.json";
import initialWallpapers from "../../data/wallpapers.json";
import { PromptItem } from "../types/prompt";
import { WallpaperBundle } from "../types/wallpaper";

const SUPPORTKORI_URL = "https://www.supportkori.com/mhr3d";
const BUNDLE_PARTS = [
  { label: "Part 1 (Prompts 1-62)", url: "/products/shareflow-superdesign-bundle-part1.zip", size: "17.7 MB" },
  { label: "Part 2 (Prompts 63-124)", url: "/products/shareflow-superdesign-bundle-part2.zip", size: "15.1 MB" },
  { label: "Part 3 (Prompts 125-186)", url: "/products/shareflow-superdesign-bundle-part3.zip", size: "13.5 MB" },
  { label: "Part 4 (Prompts 187-247)", url: "/products/shareflow-superdesign-bundle-part4.zip", size: "17.0 MB" },
];
const ADSTERRA_SMART_LINK = "https://poochingdesolate.com/kbh3b1i8?key=2be98717904ae1521ea80373ae4d1933";

const CATEGORIES = [
  "All",
  "Landing Page",
  "Style",
  "Animation",
  "UI Component",
  "Mobile App",
  "Dashboard"
] as const;

export function Products() {
  // Store Tab: "prompts" or "wallpapers"
  const [activeTab, setActiveTab] = useState<"prompts" | "wallpapers">("prompts");

  // Prompts Catalog State
  const [prompts] = useState<PromptItem[]>(initialPrompts as unknown as PromptItem[]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Selected Prompt for Right-Hand Detail Canvas
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);
  
  // Interactive Viewport Mockup & Display Mode State
  const [displayMode, setDisplayMode] = useState<"interactive" | "screenshot">("interactive");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [iframeLoading, setIframeLoading] = useState<boolean>(true);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [copiedPromptNotice, setCopiedPromptNotice] = useState<boolean>(false);

  // Mobile View Toggle: "list" or "preview"
  const [mobileView, setMobileView] = useState<"list" | "preview">("list");

  // Wallpapers Tab State (Preserved)
  const [wallpapers] = useState<WallpaperBundle[]>(initialWallpapers as unknown as WallpaperBundle[]);
  const [wallpaperCategory, setWallpaperCategory] = useState<string>("All");
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperBundle | null>(null);
  const [adStep, setAdStep] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const previewFrameRef = useRef<HTMLDivElement>(null);

  // Sync with URL query parameters (?selected=slug&category=cat)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedSlug = params.get("selected");
    const categoryParam = params.get("category");

    if (categoryParam) {
      const matchedCat = CATEGORIES.find(
        (c) => c.toLowerCase() === categoryParam.toLowerCase().replace(/-/g, " ")
      );
      if (matchedCat) {
        setSelectedCategory(matchedCat);
      }
    }

    if (prompts.length > 0) {
      if (selectedSlug) {
        const found = prompts.find(
          (p) => p.slug === selectedSlug || p.id === selectedSlug
        );
        if (found) {
          setSelectedPrompt(found);
          setMobileView("preview");
          return;
        }
      }
      // Default to first item if none selected
      if (!selectedPrompt) {
        setSelectedPrompt(prompts[0]);
      }
    }
  }, [prompts]);

  // Update URL search parameters when selection changes
  const updateUrlParams = (slug?: string, cat?: string) => {
    const params = new URLSearchParams(window.location.search);
    if (slug) {
      params.set("selected", slug);
    }
    if (cat && cat !== "All") {
      params.set("category", cat.toLowerCase().replace(/\s+/g, "-"));
    } else {
      params.delete("category");
    }
    const newRelativePathQuery = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newRelativePathQuery);
  };

  const handleSelectPrompt = (prompt: PromptItem) => {
    setSelectedPrompt(prompt);
    setIframeLoading(true);
    setIframeKey((prev) => prev + 1);
    setMobileView("preview");
    updateUrlParams(prompt.slug, selectedCategory);
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedTag(null);
    updateUrlParams(selectedPrompt?.slug, cat);
  };

  // Filtered prompts based on Category, Search Query, and Active Tag
  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      // Category match
      let matchesCat = true;
      if (selectedCategory !== "All") {
        const catLower = selectedCategory.toLowerCase();
        const pCatLower = (p.category || "").toLowerCase();
        const tags = (p.tags || []).map((t) => t.toLowerCase());
        
        matchesCat =
          pCatLower === catLower ||
          tags.includes(catLower) ||
          (selectedCategory === "Landing Page" &&
            (tags.includes("landing-page") ||
              tags.includes("landing page") ||
              tags.includes("saas") ||
              tags.includes("portfolio") ||
              tags.includes("hero"))) ||
          (selectedCategory === "UI Component" &&
            (tags.includes("ui component") ||
              tags.includes("component") ||
              tags.includes("navbar") ||
              tags.includes("pricing-table") ||
              tags.includes("card"))) ||
          (selectedCategory === "Animation" &&
            (tags.includes("animation") ||
              tags.includes("motion") ||
              tags.includes("shader") ||
              tags.includes("aurora"))) ||
          (selectedCategory === "Style" &&
            (tags.includes("style") ||
              tags.includes("brutalist") ||
              tags.includes("editorial") ||
              tags.includes("minimal") ||
              tags.includes("glassmorphism"))) ||
          (selectedCategory === "Mobile App" &&
            (tags.includes("mobile app") || tags.includes("mobile") || tags.includes("ios"))) ||
          (selectedCategory === "Dashboard" &&
            (tags.includes("dashboard") || tags.includes("admin") || tags.includes("analytics")));
      }

      // Search match
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = (p.title || "").toLowerCase().includes(q);
        const descMatch = (p.description || "").toLowerCase().includes(q);
        const tagMatch = (p.tags || []).some((t) => t.toLowerCase().includes(q));
        matchesSearch = titleMatch || descMatch || tagMatch;
      }

      // Tag filter match
      let matchesTag = true;
      if (selectedTag) {
        matchesTag = (p.tags || []).some(
          (t) => t.toLowerCase() === selectedTag.toLowerCase()
        );
      }

      return matchesCat && matchesSearch && matchesTag;
    });
  }, [prompts, selectedCategory, searchQuery, selectedTag]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: prompts.length };
    CATEGORIES.forEach((cat) => {
      if (cat === "All") return;
      const count = prompts.filter((p) => {
        const catLower = cat.toLowerCase();
        const pCatLower = (p.category || "").toLowerCase();
        const tags = (p.tags || []).map((t) => t.toLowerCase());
        return (
          pCatLower === catLower ||
          tags.includes(catLower) ||
          (cat === "Landing Page" &&
            (tags.includes("landing-page") ||
              tags.includes("landing page") ||
              tags.includes("saas") ||
              tags.includes("hero"))) ||
          (cat === "UI Component" &&
            (tags.includes("ui component") || tags.includes("component"))) ||
          (cat === "Animation" &&
            (tags.includes("animation") || tags.includes("motion"))) ||
          (cat === "Style" && (tags.includes("style") || tags.includes("editorial"))) ||
          (cat === "Mobile App" && (tags.includes("mobile app") || tags.includes("mobile"))) ||
          (cat === "Dashboard" && (tags.includes("dashboard") || tags.includes("analytics")))
        );
      }).length;
      counts[cat] = count;
    });
    return counts;
  }, [prompts]);

  // Collect popular tags for quick filter chips
  const popularTags = useMemo(() => {
    const tagCount: Record<string, number> = {};
    prompts.forEach((p) => {
      (p.tags || []).forEach((t) => {
        const tl = t.toLowerCase();
        if (["responsive", "desktop", "inter", "layout"].includes(tl)) return;
        tagCount[tl] = (tagCount[tl] || 0) + 1;
      });
    });
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
  }, [prompts]);

  const handleCopyLink = () => {
    if (!selectedPrompt) return;
    const url = `${window.location.origin}/products?selected=${selectedPrompt.slug || selectedPrompt.id}&category=${selectedCategory.toLowerCase().replace(/\s+/g, "-")}`;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyLockedNotice = () => {
    setCopiedPromptNotice(true);
    setTimeout(() => setCopiedPromptNotice(false), 2500);
  };

  // Category Badge Color Helper
  const getCategoryBadgeClass = (category?: string) => {
    switch (category) {
      case "Style":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "Animation":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "UI Component":
        return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
      case "Landing Page":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Mobile App":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "Dashboard":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20";
    }
  };

  // Wallpapers Tab Filtering & Logic (Preserved)
  const filteredWallpapers = useMemo(() => {
    return wallpapers.filter((w) => {
      if (wallpaperCategory === "All") return true;
      return w.category === wallpaperCategory;
    });
  }, [wallpapers, wallpaperCategory]);

  const handleStartAdStep = () => {
    window.open(ADSTERRA_SMART_LINK, "_blank");
    if (adStep < 4) {
      setAdStep(adStep + 1);
    } else {
      setIsUnlocked(true);
      setCouponCode("SF-100-FREE");
    }
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-4 pb-12">
      {/* Top Banner / Store Header */}
      <div className="w-full bg-white dark:bg-[#121316] border border-[#e5e5ea] dark:border-[#27272a] rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 self-center md:self-start px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SUPERDESIGN PROMPT WORKSPACE • 240+ PROMPTS &amp; PREVIEWS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
            Curated AI UI Design Library &amp; Live Interactive Canvas
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6e73] dark:text-[#a1a1aa] max-w-2xl">
            Test live interactive component previews directly in your browser. Every prompt is hand-crafted and ready for Cursor, Claude, Bolt, v0, and Windsurf. Unlock individual prompts for ৳49 BDT on SupportKori or download the full bundle.
          </p>
        </div>

        {/* Master Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/50">
            <span className="text-xs font-semibold px-2 text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <Download className="w-3.5 h-3.5" /> Bundle ZIP:
            </span>
            {BUNDLE_PARTS.map((part, idx) => (
              <a
                key={part.url}
                href={part.url}
                download={part.url.split("/").pop()}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 border border-zinc-200/80 dark:border-zinc-700 shadow-2xs hover:scale-105 active:scale-95 transition-all"
                title={`${part.label} (${part.size}) - full prompt folders with markdown, HTML previews, and full-page screenshots`}
              >
                Part {idx + 1} <span className="opacity-60 text-[10px]">({part.size})</span>
              </a>
            ))}
          </div>

          <a
            href={SUPPORTKORI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs sm:text-sm transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>SupportKori Profile (৳49)</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Primary Tab Switcher: Prompts Library vs 8K Wallpapers */}
      <div className="flex items-center justify-between border-b border-[#e5e5ea] dark:border-[#27272a] pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("prompts")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "prompts"
                ? "bg-[#0071e3] text-white shadow-xs"
                : "text-[#6e6e73] dark:text-[#a1a1aa] hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>AI Design Prompts ({prompts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("wallpapers")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "wallpapers"
                ? "bg-[#0071e3] text-white shadow-xs"
                : "text-[#6e6e73] dark:text-[#a1a1aa] hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground"
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>8K Wallpapers ({wallpapers.length})</span>
          </button>
        </div>

        {/* Mobile View Toggle (Visible only on mobile screens when in prompts tab) */}
        {activeTab === "prompts" && (
          <div className="flex md:hidden items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setMobileView("list")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                mobileView === "list"
                  ? "bg-white dark:bg-zinc-700 text-foreground shadow-xs"
                  : "text-muted-foreground"
              }`}
            >
              List ({filteredPrompts.length})
            </button>
            <button
              type="button"
              onClick={() => setMobileView("preview")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                mobileView === "preview"
                  ? "bg-white dark:bg-zinc-700 text-foreground shadow-xs"
                  : "text-muted-foreground"
              }`}
            >
              Live Preview
            </button>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: AI DESIGN PROMPTS (SUPERDESIGN LIBRARY WORKSPACE)
         ───────────────────────────────────────────────────────────── */}
      {activeTab === "prompts" && (
        <div className="flex flex-col gap-3">
          {/* Category Navigation Pills (Superdesign Top Bar) */}
          <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-medium border-b border-[#e5e5ea] dark:border-[#27272a]">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = categoryCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                    isSelected
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-xs scale-[1.02]"
                      : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected
                        ? "bg-white/20 text-white dark:bg-zinc-950/20 dark:text-zinc-950 font-extrabold"
                        : "bg-zinc-200 dark:bg-zinc-800 text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Master Superdesign Two-Column Layout */}
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 items-start min-h-[720px]">
            {/* ─────────────────────────────────────────────────────────
                LEFT COLUMN: SEARCH, TAGS, AND PROMPTS SCROLL LIST (35%)
               ───────────────────────────────────────────────────────── */}
            <div
              className={`md:col-span-4 lg:col-span-4 flex flex-col gap-3 bg-white dark:bg-[#121316] border border-[#e5e5ea] dark:border-[#27272a] rounded-2xl p-3 shadow-xs h-[780px] ${
                mobileView === "preview" ? "hidden md:flex" : "flex"
              }`}
            >
              {/* Search Bar */}
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search prompts, styles, animations..."
                  className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#0071e3] transition-all text-foreground"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Popular Tag Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                {popularTags.map((tag) => {
                  const active = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(active ? null : tag)}
                      className={`px-2.5 py-1 rounded-md whitespace-nowrap border transition-all ${
                        active
                          ? "bg-[#0071e3] border-[#0071e3] text-white font-semibold"
                          : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>

              {/* Status Header */}
              <div className="flex items-center justify-between px-1 text-[11px] text-muted-foreground font-medium">
                <span>
                  Showing {filteredPrompts.length} prompt
                  {filteredPrompts.length !== 1 ? "s" : ""}
                </span>
                {selectedTag && (
                  <button
                    type="button"
                    onClick={() => setSelectedTag(null)}
                    className="text-[#0071e3] hover:underline flex items-center gap-1"
                  >
                    Clear #{selectedTag}
                  </button>
                )}
              </div>

              {/* Prompts Scrollable List */}
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {filteredPrompts.length === 0 ? (
                  <div className="h-48 flex flex-col items-center justify-center text-center p-4">
                    <p className="text-xs text-muted-foreground">
                      No design prompts found matching your query.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("All");
                        setSelectedTag(null);
                      }}
                      className="mt-3 text-xs text-[#0071e3] hover:underline font-semibold"
                    >
                      Reset all filters
                    </button>
                  </div>
                ) : (
                  filteredPrompts.map((item) => {
                    const isSelected = selectedPrompt?.slug === item.slug || selectedPrompt?.id === item.id;
                    return (
                      <div
                        key={item.slug || item.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelectPrompt(item)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleSelectPrompt(item);
                          }
                        }}
                        className={`group pt-2 pb-2 px-2.5 rounded-xl cursor-pointer transition-all duration-150 flex gap-3 text-left ${
                          isSelected
                            ? "bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-300 dark:border-zinc-700 shadow-xs"
                            : "hover:bg-zinc-50 dark:hover:bg-zinc-900/60 border border-transparent"
                        }`}
                      >
                        {/* Thumbnail Image */}
                        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 relative">
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-900 text-white font-bold text-xs">
                              UI
                            </div>
                          )}
                          <div className="absolute top-1 left-1 px-1 py-0.5 rounded text-[8px] font-extrabold uppercase bg-black/60 text-white backdrop-blur-xs">
                            ৳49
                          </div>
                        </div>

                        {/* Title, Category & Tags */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              <span
                                className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${getCategoryBadgeClass(
                                  item.category
                                )}`}
                              >
                                {item.category || "Landing Page"}
                              </span>
                              {(item.tags || []).slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] text-muted-foreground truncate max-w-[80px]"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <h3 className="text-xs sm:text-sm font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-[#0071e3] transition-colors">
                              {item.title}
                            </h3>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              ৳49 BDT
                            </span>
                            <span className="text-[10px] group-hover:translate-x-0.5 transition-transform text-[#0071e3] font-medium flex items-center gap-0.5">
                              View Preview →
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────
                RIGHT COLUMN: SUPERDESIGN LIVE INTERACTIVE CANVAS (65%)
               ───────────────────────────────────────────────────────── */}
            <div
              className={`md:col-span-8 lg:col-span-8 flex flex-col gap-3 bg-white dark:bg-[#121316] border border-[#e5e5ea] dark:border-[#27272a] rounded-2xl p-4 sm:p-5 shadow-xs ${
                mobileView === "list" ? "hidden md:flex" : "flex"
              }`}
            >
              {selectedPrompt ? (
                <>
                  {/* Prompt Header & Actions */}
                  <div className="flex flex-col gap-3 border-b border-[#e5e5ea] dark:border-[#27272a] pb-4">
                    {/* Back to list button on mobile */}
                    <button
                      type="button"
                      onClick={() => setMobileView("list")}
                      className="md:hidden inline-flex items-center gap-1 text-xs text-[#0071e3] font-semibold mb-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back to Prompts List</span>
                    </button>

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(
                              selectedPrompt.category
                            )}`}
                          >
                            {selectedPrompt.category}
                          </span>
                          {(selectedPrompt.tags || []).slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-md text-[11px] bg-zinc-100 dark:bg-zinc-800 text-muted-foreground"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight leading-snug">
                          {selectedPrompt.title}
                        </h2>
                      </div>

                      {/* Primary Price & Buy Action */}
                      <div className="flex items-center gap-2.5 flex-shrink-0">
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-muted-foreground">Prompt Price</span>
                          <span className="text-lg font-extrabold text-foreground">
                            ৳49 <span className="text-xs font-medium text-muted-foreground">BDT</span>
                          </span>
                        </div>
                        <a
                          href={SUPPORTKORI_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Buy on SupportKori (৳49)</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Curated Architectural & Aesthetic Breakdown */}
                    {selectedPrompt.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-3">
                        <span className="font-semibold text-foreground mr-1.5">
                          Architectural Philosophy:
                        </span>
                        {selectedPrompt.description}
                      </p>
                    )}

                    {/* Preview Viewport & Display Controls */}
                    <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                      {/* Left: Mode Switcher (Interactive vs Full Screenshot) */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700/60">
                          <button
                            type="button"
                            onClick={() => setDisplayMode("interactive")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              displayMode === "interactive"
                                ? "bg-white dark:bg-zinc-900 text-foreground shadow-xs font-bold"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Monitor className="w-3.5 h-3.5" />
                            <span>Live Interactive</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDisplayMode("screenshot")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              displayMode === "screenshot"
                                ? "bg-white dark:bg-zinc-900 text-foreground shadow-xs font-bold"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Full Screenshot</span>
                          </button>
                        </div>

                        {/* Responsive Viewport Switcher (When in Interactive Mode) */}
                        {displayMode === "interactive" && (
                          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700/60">
                            <button
                              type="button"
                              onClick={() => setViewport("desktop")}
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                viewport === "desktop"
                                  ? "bg-white dark:bg-zinc-900 text-foreground shadow-xs font-bold"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                              title="Desktop (100% width)"
                            >
                              <Monitor className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Desktop</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setViewport("tablet")}
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                viewport === "tablet"
                                  ? "bg-white dark:bg-zinc-900 text-foreground shadow-xs font-bold"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                              title="Tablet (768px width)"
                            >
                              <Tablet className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Tablet</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setViewport("mobile")}
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                viewport === "mobile"
                                  ? "bg-white dark:bg-zinc-900 text-foreground shadow-xs font-bold"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                              title="Mobile (390px width)"
                            >
                              <Smartphone className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Mobile</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Tool Actions: Reload, Share, Standalone / Download Screenshot */}
                      <div className="flex items-center gap-1.5">
                        {displayMode === "interactive" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIframeLoading(true);
                              setIframeKey((prev) => prev + 1);
                            }}
                            className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-muted-foreground hover:text-foreground transition-colors"
                            title="Reload preview"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <a
                            href={selectedPrompt.screenshotUrl || `/screenshots/${selectedPrompt.slug}.png`}
                            download={`${selectedPrompt.slug}-fullpage-screenshot.png`}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-semibold text-foreground transition-colors"
                            title="Download full page high-resolution PNG screenshot"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download PNG</span>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
                          title="Copy shareable link"
                        >
                          {copiedUrl ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-500">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Share</span>
                            </>
                          )}
                        </button>

                        <a
                          href={
                            displayMode === "interactive"
                              ? selectedPrompt.localPreviewUrl || selectedPrompt.previewUrl
                              : selectedPrompt.screenshotUrl || `/screenshots/${selectedPrompt.slug}.png`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0071e3]/10 hover:bg-[#0071e3]/20 text-[#0071e3] text-xs font-semibold transition-colors"
                          title={
                            displayMode === "interactive"
                              ? "Open standalone interactive preview in new tab"
                              : "Open full-resolution screenshot in new tab"
                          }
                        >
                          <span>{displayMode === "interactive" ? "Full Standalone" : "Open Full-Res"}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* ───────────────────────────────────────────────────
                      MACOS STYLE BROWSER FRAME MOCKUP (LIVE PREVIEW & SCREENSHOT)
                     ─────────────────────────────────────────────────── */}
                  <div
                    ref={previewFrameRef}
                    className="w-full flex flex-col items-center justify-center bg-zinc-100 dark:bg-[#090a0d] border border-zinc-300 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-inner p-2 sm:p-4 min-h-[560px]"
                  >
                    {/* Centered Device Mockup Frame */}
                    <div
                      className={`transition-all duration-300 ease-out bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col ${
                        displayMode === "screenshot" || viewport === "desktop"
                          ? "w-full"
                          : viewport === "tablet"
                          ? "w-full max-w-[768px]"
                          : "w-full max-w-[390px]"
                      }`}
                    >
                      {/* Browser Window Chrome / Address Bar */}
                      <div className="h-9 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-3 flex items-center justify-between gap-2">
                        {/* macOS Window Controls */}
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
                          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
                          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]" />
                        </div>

                        {/* Simulated Safe Address Bar */}
                        <div className="flex-1 max-w-sm mx-auto h-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-2 flex items-center justify-center text-[10px] text-muted-foreground font-mono truncate">
                          <span className="text-emerald-500 mr-1">🔒</span>
                          <span className="truncate">
                            {displayMode === "interactive"
                              ? `shareflow.mhr3d.online/previews/${selectedPrompt.slug || selectedPrompt.id}.html`
                              : `shareflow.mhr3d.online/screenshots/${selectedPrompt.slug || selectedPrompt.id}.png`}
                          </span>
                        </div>

                        <div className="w-16 text-right text-[10px] text-muted-foreground uppercase font-semibold">
                          {displayMode === "interactive" ? viewport : "1440px PNG"}
                        </div>
                      </div>

                      {/* Display Container: Live Interactive or Full-Page Screenshot */}
                      {displayMode === "interactive" ? (
                        <div className="relative w-full h-[520px] bg-zinc-950">
                          {iframeLoading && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-xs text-white gap-2">
                              <RotateCw className="w-5 h-5 animate-spin text-[#0071e3]" />
                              <span className="text-xs font-medium text-zinc-300">
                                Loading live Superdesign preview...
                              </span>
                            </div>
                          )}

                          <iframe
                            key={`${selectedPrompt.slug}-${iframeKey}`}
                            src={selectedPrompt.localPreviewUrl || selectedPrompt.previewUrl}
                            title={selectedPrompt.title}
                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
                            className="w-full h-full border-none bg-zinc-950"
                            onLoad={() => setIframeLoading(false)}
                          />
                        </div>
                      ) : (
                        <div className="relative w-full h-[540px] overflow-y-auto bg-zinc-950 scrollbar-thin scrollbar-thumb-zinc-700">
                          <img
                            src={selectedPrompt.screenshotUrl || `/screenshots/${selectedPrompt.slug}.png`}
                            alt={`${selectedPrompt.title} full page preview`}
                            className="w-full h-auto block select-none pointer-events-auto shadow-md"
                            loading="eager"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ───────────────────────────────────────────────────
                      BOTTOM CARD: LOCKED PRODUCTION PROMPT SPECIFICATION
                     ─────────────────────────────────────────────────── */}
                  <div className="w-full bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-foreground">
                            Production System Prompt Locked
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            SupportKori Exclusive (৳49)
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
                          The complete, production-tested system prompt specification, design token configurations, and responsive code are protected. Purchasers on SupportKori receive the unredacted prompt files and offline bundle.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={handleCopyLockedNotice}
                        className="px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        {copiedPromptNotice ? "Redirecting..." : "View Spec Details"}
                      </button>

                      <a
                        href={SUPPORTKORI_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span>Unlock for ৳49</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-[600px] flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                  <Monitor className="w-10 h-10 mb-3 opacity-30" />
                  <p className="text-sm font-semibold">Select a prompt to preview</p>
                  <p className="text-xs max-w-sm mt-1">
                    Choose any design from the left sidebar to preview its live interactive canvas and architectural blueprint.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: 8K WALLPAPERS (PRESERVED CATALOG & ADSTERRA UNLOCK)
         ───────────────────────────────────────────────────────────── */}
      {activeTab === "wallpapers" && (
        <div className="flex flex-col gap-6">
          {/* Wallpaper Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {["All", "Minimal", "Nature", "Abstract", "Cyberpunk", "Space", "Anime"].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setWallpaperCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    wallpaperCategory === cat
                      ? "bg-[#0071e3] text-white shadow-xs"
                      : "bg-[#f5f5f7] dark:bg-[#181a20] text-[#6e6e73] dark:text-[#a1a1aa] hover:text-[#1d1d1f] dark:hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Wallpapers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWallpapers.map((bundle) => (
              <div
                key={bundle.id}
                className="bg-white dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                  <img
                    src={bundle.thumbnailUrl}
                    alt={bundle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-md">
                    {bundle.category}
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                    {bundle.resolution}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#1d1d1f] dark:text-white mb-1.5">
                      {bundle.title}
                    </h3>
                    <p className="text-xs text-[#6e6e73] dark:text-[#a1a1aa] line-clamp-2 leading-relaxed">
                      {bundle.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#e5e5ea] dark:border-[#27272a] flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[#1d1d1f] dark:text-white">
                      ৳{bundle.priceBdt} BDT
                    </span>
                    <a
                      href={SUPPORTKORI_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold transition-all"
                    >
                      <span>Unlock on SupportKori</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
