/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Sparkles,
  ExternalLink,
  Zap,
  Search,
  RotateCw,
  SlidersHorizontal,
  Filter,
  Palette,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Monitor,
  Layers,
} from "lucide-react";
import initialPrompts from "../../data/prompts.json";
import initialWallpapers from "../../data/wallpapers.json";
import { PromptItem } from "../types/prompt";
import { WallpaperBundle } from "../types/wallpaper";
import { PromptCard } from "../components/PromptCard";
import { PromptPreviewModal } from "../components/PromptPreviewModal";

const SUPPORTKORI_URL = "https://www.supportkori.com/mhr3d";

const CATEGORIES = [
  "All",
  "Landing Page",
  "Style",
  "Animation",
  "UI Component",
  "Mobile App",
  "Dashboard",
];

function matchesCategory(p: PromptItem, cat: string): boolean {
  if (cat === "All") return true;
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
        tags.includes("hero") ||
        tags.includes("portfolio"))) ||
    (cat === "UI Component" &&
      (tags.includes("ui component") ||
        tags.includes("component") ||
        tags.includes("navbar") ||
        tags.includes("card") ||
        tags.includes("pricing-table"))) ||
    (cat === "Animation" &&
      (tags.includes("animation") ||
        tags.includes("motion") ||
        tags.includes("shader") ||
        tags.includes("aurora"))) ||
    (cat === "Style" &&
      (tags.includes("style") ||
        tags.includes("editorial") ||
        tags.includes("minimal") ||
        tags.includes("brutalist") ||
        tags.includes("glassmorphism"))) ||
    (cat === "Mobile App" &&
      (tags.includes("mobile app") ||
        tags.includes("mobile") ||
        tags.includes("ios"))) ||
    (cat === "Dashboard" &&
      (tags.includes("dashboard") ||
        tags.includes("admin") ||
        tags.includes("analytics") ||
        tags.includes("table")))
  );
}

export function Products() {
  // Tab State: "prompts" or "wallpapers"
  const [activeTab, setActiveTab] = useState<"prompts" | "wallpapers">("prompts");

  // Prompts State
  const [prompts] = useState<PromptItem[]>(initialPrompts as unknown as PromptItem[]);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "alpha">("recent");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Wallpapers Tab State
  const [wallpapers] = useState<WallpaperBundle[]>(initialWallpapers as unknown as WallpaperBundle[]);
  const [wallpaperCategory, setWallpaperCategory] = useState<string>("All");

  // Sync with URL Query Parameters (?selected=slug&category=cat&tab=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get("category");
    const selectedSlug = params.get("selected");
    const tabParam = params.get("tab");

    if (tabParam === "wallpapers") {
      setActiveTab("wallpapers");
    }

    if (catParam) {
      const catLower = catParam.toLowerCase();
      const matched = CATEGORIES.find(
        (c) => c.toLowerCase().replace(/\s+/g, "-") === catLower
      );
      if (matched) setSelectedCategory(matched);
    }

    if (selectedSlug && prompts.length > 0) {
      const found = prompts.find(
        (p) => p.slug === selectedSlug || p.id === selectedSlug
      );
      if (found) {
        setSelectedPrompt(found);
        setIsModalOpen(true);
      }
    }
  }, [prompts]);

  // Update URL Query Parameters
  const updateUrlParams = (slug?: string, cat?: string) => {
    const params = new URLSearchParams(window.location.search);
    if (activeTab === "prompts") {
      params.set("tab", "prompts");
      if (cat && cat !== "All") {
        params.set("category", cat.toLowerCase().replace(/\s+/g, "-"));
      } else {
        params.delete("category");
      }
      if (slug) {
        params.set("selected", slug);
      } else {
        params.delete("selected");
      }
    } else {
      params.set("tab", "wallpapers");
      params.delete("selected");
      params.delete("category");
    }
    const newRelativePathQuery = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newRelativePathQuery);
  };

  const handleSelectPrompt = (prompt: PromptItem) => {
    setSelectedPrompt(prompt);
    setIsModalOpen(true);
    updateUrlParams(prompt.slug || prompt.id, selectedCategory);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    updateUrlParams(undefined, selectedCategory);
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedTag(null);
    updateUrlParams(selectedPrompt?.slug, cat);
  };

  // Filter Prompts based on Category, Search Query, and Active Tag
  const filteredPrompts = useMemo(() => {
    const list = prompts.filter((p) => {
      // Category match
      const matchesCat = matchesCategory(p, selectedCategory);

      // Search match
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = (p.title || "").toLowerCase().includes(q);
        const descMatch = (p.description || "").toLowerCase().includes(q);
        const toolMatch = (p.targetTool || "").toLowerCase().includes(q);
        const tagMatch = (p.tags || []).some((t) => t.toLowerCase().includes(q));
        matchesSearch = titleMatch || descMatch || toolMatch || tagMatch;
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

    if (sortBy === "popular") {
      return [...list].sort((a, b) => (b.copyCount || 0) - (a.copyCount || 0));
    }
    if (sortBy === "alpha") {
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    }
    return list; // "recent" preserves curated bundle order
  }, [prompts, selectedCategory, searchQuery, selectedTag, sortBy]);

  // Pagination Configuration & State
  const ITEMS_PER_PAGE = 20;

  // Reset to page 1 whenever search, category, tag, or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedTag, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredPrompts.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredPrompts.length);

  const paginatedPrompts = useMemo(() => {
    return filteredPrompts.slice(startIndex, endIndex);
  }, [filteredPrompts, startIndex, endIndex]);

  const handlePageChange = (newPage: number) => {
    const clamped = Math.min(Math.max(newPage, 1), totalPages);
    setCurrentPage(clamped);
    if (gridRef.current) {
      const headerOffset = 90;
      const elementPosition = gridRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (safeCurrentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (safeCurrentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: prompts.length };
    CATEGORIES.forEach((cat) => {
      if (cat === "All") return;
      counts[cat] = prompts.filter((p) => matchesCategory(p, cat)).length;
    });
    return counts;
  }, [prompts]);

  // Extract popular tags
  const popularTags = useMemo(() => {
    const tagMap: Record<string, number> = {};
    prompts.forEach((p) => {
      (p.tags || []).forEach((t) => {
        const clean = t.trim().toLowerCase();
        if (clean && !["responsive", "desktop", "inter", "layout"].includes(clean)) {
          tagMap[clean] = (tagMap[clean] || 0) + 1;
        }
      });
    });
    return Object.entries(tagMap)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [prompts]);

  // Modal Next/Prev navigation indices
  const currentIndex = selectedPrompt
    ? filteredPrompts.findIndex(
        (p) => (p.slug || p.id) === (selectedPrompt.slug || selectedPrompt.id)
      )
    : -1;

  const handleNextPrompt = () => {
    if (currentIndex >= 0 && currentIndex < filteredPrompts.length - 1) {
      const nextItem = filteredPrompts[currentIndex + 1];
      setSelectedPrompt(nextItem);
      updateUrlParams(nextItem.slug || nextItem.id, selectedCategory);
    }
  };

  const handlePrevPrompt = () => {
    if (currentIndex > 0) {
      const prevItem = filteredPrompts[currentIndex - 1];
      setSelectedPrompt(prevItem);
      updateUrlParams(prevItem.slug || prevItem.id, selectedCategory);
    }
  };

  // Wallpapers Tab Filtering & Logic (Coming Soon Vault)
  const filteredWallpapers = useMemo(() => {
    return wallpapers.filter((w) => {
      if (wallpaperCategory === "All") return true;
      return w.category === wallpaperCategory;
    });
  }, [wallpapers, wallpaperCategory]);

  return (
    <div className="w-full flex flex-col gap-5 pb-16">
      {/* Primary Tab Switcher: Prompts Library vs 8K Wallpapers */}
      <div className="flex items-center justify-between border-b border-[#e5e5ea] dark:border-[#27272a] pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab("prompts");
              updateUrlParams(selectedPrompt?.slug, selectedCategory);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "prompts"
                ? "bg-[#0071e3] text-white shadow-xs keep-white"
                : "text-zinc-600 dark:text-[#a1a1aa] hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>AI Design Prompts ({prompts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("wallpapers");
              updateUrlParams(undefined, undefined);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "wallpapers"
                ? "bg-[#0071e3] text-white shadow-xs keep-white"
                : "text-zinc-600 dark:text-[#a1a1aa] hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>8K Wallpapers</span>
            <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
              Coming Soon
            </span>
          </button>
        </div>

        <a
          href={SUPPORTKORI_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs sm:text-sm transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98] keep-white"
        >
          <span>SupportKori Store (৳49)</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: AI DESIGN PROMPTS (THREEUI-STYLE SQUARE CARD SHOWCASE)
         ───────────────────────────────────────────────────────────── */}
      {activeTab === "prompts" && (
        <div className="flex flex-col gap-5">
          {/* Controls Bar: Category Pills + Search + Sort */}
          <div className="flex flex-col gap-3.5">
            {/* Top Bar: Search Input, Sort Dropdown & Item Count */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 240+ interactive components, styles, prompts..."
                  className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 shadow-xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">
                  Showing {filteredPrompts.length} {filteredPrompts.length === 1 ? "prompt" : "prompts"}
                </span>

                <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl px-2.5 py-1.5 shadow-xs">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "recent" | "popular" | "alpha")}
                    className="bg-transparent text-xs text-zinc-800 dark:text-zinc-200 font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="recent" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">Recent / Featured</option>
                    <option value="popular" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">Most Popular</option>
                    <option value="alpha" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">Alphabetical (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category Navigation Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count = categoryCounts[cat] || 0;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleSelectCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 shadow-xs font-semibold ${
                      isSelected
                        ? "bg-[#0071e3] text-white shadow-blue-500/20 keep-white"
                        : "bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700/80"
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isSelected
                          ? "bg-white/20 text-white keep-white"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-transparent"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tags Row */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              <span className="text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3" />
                Tags:
              </span>
              {popularTags.slice(0, 14).map((tag) => {
                const isTagSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(isTagSelected ? null : tag)}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors border ${
                      isTagSelected
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 font-semibold"
                        : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200/90 dark:border-zinc-800"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
              {selectedTag && (
                <button
                  type="button"
                  onClick={() => setSelectedTag(null)}
                  className="text-xs text-[#0071e3] hover:underline font-semibold ml-2 whitespace-nowrap"
                >
                  Clear #{selectedTag}
                </button>
              )}
            </div>
          </div>

          {/* ThreeUI-Style Square Cards Showcase Grid */}
          {filteredPrompts.length === 0 ? (
            <div className="min-h-[360px] flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <Sparkles className="w-8 h-8 text-muted-foreground/50 mb-3" />
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                No components found
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                We couldn't find any design prompts matching your search or active category filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedTag(null);
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#0071e3] text-white text-xs font-semibold hover:bg-blue-600 transition-colors shadow-xs"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div ref={gridRef} className="flex flex-col gap-6 scroll-mt-24">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                {paginatedPrompts.map((item) => (
                  <PromptCard
                    key={item.id || item.slug}
                    item={item}
                    isSelected={selectedPrompt?.id === item.id}
                    onClick={() => handleSelectPrompt(item)}
                  />
                ))}
              </div>

              {/* Responsive, Accessible Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 pt-6 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                    Showing <span className="font-semibold text-zinc-900 dark:text-zinc-100">{startIndex + 1}</span>–<span className="font-semibold text-zinc-900 dark:text-zinc-100">{endIndex}</span> of{" "}
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{filteredPrompts.length}</span> components
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Previous Button */}
                    <button
                      type="button"
                      aria-label="Previous Page"
                      onClick={() => handlePageChange(safeCurrentPage - 1)}
                      disabled={safeCurrentPage <= 1}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        safeCurrentPage <= 1
                          ? "bg-zinc-100 dark:bg-zinc-800/40 text-zinc-400 dark:text-zinc-600 border border-zinc-200/50 dark:border-zinc-800/50 cursor-not-allowed"
                          : "bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700/80 cursor-pointer shadow-xs"
                      }`}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Prev</span>
                    </button>

                    {/* Numeric Page Buttons (Desktop/Tablet) */}
                    <div className="hidden sm:flex items-center gap-1">
                      {getPageNumbers().map((page, idx) => {
                        if (page === "...") {
                          return (
                            <span
                              key={`ellipsis-${idx}`}
                              className="px-2 py-1 text-xs text-zinc-400 dark:text-zinc-600 select-none"
                            >
                              ...
                            </span>
                          );
                        }
                        const pageNum = Number(page);
                        const isCurrent = pageNum === safeCurrentPage;
                        return (
                          <button
                            key={`page-${pageNum}`}
                            type="button"
                            onClick={() => handlePageChange(pageNum)}
                            className={`min-w-[32px] h-8 px-2.5 rounded-xl text-xs font-semibold transition-all ${
                              isCurrent
                                ? "bg-[#0071e3] text-white shadow-blue-500/20 keep-white"
                                : "bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700/80 cursor-pointer"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    {/* Mobile Page Indicator */}
                    <div className="sm:hidden px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-xs font-semibold text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800">
                      {safeCurrentPage} / {totalPages}
                    </div>

                    {/* Next Button */}
                    <button
                      type="button"
                      aria-label="Next Page"
                      onClick={() => handlePageChange(safeCurrentPage + 1)}
                      disabled={safeCurrentPage >= totalPages}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        safeCurrentPage >= totalPages
                          ? "bg-zinc-100 dark:bg-zinc-800/40 text-zinc-400 dark:text-zinc-600 border border-zinc-200/50 dark:border-zinc-800/50 cursor-not-allowed"
                          : "bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700/80 cursor-pointer shadow-xs"
                      }`}
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Interactive Preview Modal */}
          <PromptPreviewModal
            prompt={selectedPrompt}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onNext={handleNextPrompt}
            onPrev={handlePrevPrompt}
            hasNext={currentIndex < filteredPrompts.length - 1}
            hasPrev={currentIndex > 0}
            supportKoriUrl={SUPPORTKORI_URL}
          />
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: 8K WALLPAPERS (COMING SOON PREVIEW VAULT)
         ───────────────────────────────────────────────────────────── */}
      {activeTab === "wallpapers" && (
        <div className="flex flex-col gap-8">
          {/* Coming Soon Hero Showcase */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 sm:p-8 md:p-10 text-white shadow-2xl">
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0071e3]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl flex flex-col gap-4">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 w-fit">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>IN PRODUCTION • COMING SOON</span>
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Lossless 8K & OLED Wallpaper Vault
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                We are rendering and color-calibrating an exclusive library of uncompressed 8K (7680×4320) master wallpapers and true #000000 AMOLED visuals. Rendered with HDR10 dynamic range and DCI-P3 color profiles for Retina, multi-monitor, and 21:9 ultrawide screens.
              </p>

              {/* Spec Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-sm">
                  <Monitor className="w-5 h-5 text-[#0071e3] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-white">Lossless 8K Masters</div>
                    <div className="text-[11px] text-zinc-400 leading-snug">Native 7680×4320 renders with zero compression artifacts.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-sm">
                  <Layers className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-white">True OLED Pure Black</div>
                    <div className="text-[11px] text-zinc-400 leading-snug">85%+ true #000000 black depth for zero battery drain.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-white">HDR10 & Ultrawide</div>
                    <div className="text-[11px] text-zinc-400 leading-snug">Tailored aspect ratios for 16:9, 21:9 ultrawide, and multi-display.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {["All", "Minimal", "Nature", "Abstract", "Cyberpunk", "Space", "Anime"].map((cat) => (
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
            ))}
          </div>

          {/* Wallpapers Teaser Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWallpapers.map((bundle) => (
              <div
                key={bundle.id}
                className="bg-white dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group relative"
              >
                {/* Preview Image with Coming Soon Badges */}
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                  <img
                    src={bundle.previewUrl}
                    alt={bundle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-black shadow-xs">
                      Coming Soon
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-sm border border-white/10">
                      {bundle.resolution || "8K UHD"}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/60 text-zinc-300 backdrop-blur-sm border border-white/10">
                      {bundle.category}
                    </span>
                  </div>

                  {/* Bottom overlay info */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-mono text-[11px] text-zinc-300">
                      Lossless 8K
                    </span>
                    <span className="text-[11px] font-semibold text-zinc-300">
                      Master Bundle
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                  <div className="flex flex-col gap-1.5">
                    <h4 className="text-sm sm:text-base font-bold text-[#1d1d1f] dark:text-white line-clamp-1 group-hover:text-[#0071e3] transition-colors">
                      {bundle.title}
                    </h4>
                    <p className="text-xs text-[#6e6e73] dark:text-[#a1a1aa] line-clamp-2 leading-relaxed">
                      {bundle.description}
                    </p>
                  </div>

                  {/* Features */}
                  {bundle.features && bundle.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {bundle.features.slice(0, 3).map((f, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-[10px] text-zinc-600 dark:text-zinc-400 font-medium border border-zinc-200/50 dark:border-zinc-700/50"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Coming Soon Button */}
                  <div className="pt-2 border-t border-[#f2f2f7] dark:border-zinc-800">
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-not-allowed border border-zinc-200 dark:border-zinc-700/50"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Releasing Soon</span>
                    </button>
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
