import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ExternalLink,
  RotateCw,
  Laptop,
  Tablet,
  Smartphone,
  Lock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Share2,
  Check,
} from "lucide-react";
import { PromptItem } from "../types/prompt";

interface PromptPreviewModalProps {
  prompt: PromptItem | null;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
  supportKoriUrl?: string;
}

export const PromptPreviewModal: React.FC<PromptPreviewModalProps> = ({
  prompt,
  isOpen,
  onClose,
  onNext,
  onPrev,
  hasNext = true,
  hasPrev = true,
  supportKoriUrl = "https://supportkori.com/p/mhr3d",
}) => {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [displayMode, setDisplayMode] = useState<"interactive" | "screenshot">("interactive");
  const [iframeLoading, setIframeLoading] = useState<boolean>(true);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  // Reset state when prompt changes
  useEffect(() => {
    if (prompt) {
      setIframeLoading(true);
      setIframeKey((prev) => prev + 1);
      setDisplayMode("interactive");
      setViewport("desktop");
    }
  }, [prompt?.id]);

  // Handle keyboard shortcuts (Escape to close, Left/Right for prev/next)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" && onNext && hasNext) {
        onNext();
      } else if (e.key === "ArrowLeft" && onPrev && hasPrev) {
        onPrev();
      }
    },
    [isOpen, onClose, onNext, onPrev, hasNext, hasPrev]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll and notify layout when modal is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isOpen && prompt) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("preview-modal-open");
      window.dispatchEvent(
        new CustomEvent("preview-modal-toggle", { detail: { isOpen: true } })
      );
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("preview-modal-open");
      window.dispatchEvent(
        new CustomEvent("preview-modal-toggle", { detail: { isOpen: false } })
      );
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("preview-modal-open");
      window.dispatchEvent(
        new CustomEvent("preview-modal-toggle", { detail: { isOpen: false } })
      );
    };
  }, [isOpen, prompt]);

  if (!isOpen || !prompt) return null;

  const liveUrl = prompt.localPreviewUrl || prompt.previewUrl;
  const screenshot = prompt.screenshotUrl || (prompt.slug ? `/screenshots/${prompt.slug}.png` : null);
  const buyUrl = prompt.buyUrl || supportKoriUrl;

  const handleReload = () => {
    setIframeLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleCopyLink = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://shareflow.mhr3d.online";
    const shareUrl = `${origin}/products?tab=prompts&selected=${encodeURIComponent(
      prompt.slug || prompt.id
    )}`;
    try {
      if (typeof window !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      }
    } catch (err) {
      console.warn("Failed to copy link:", err);
    }
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="prompt-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-1 sm:p-2 md:p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Backdrop click to close */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Modal Window */}
      <div className="relative w-full max-w-[98vw] 2xl:max-w-[1720px] h-[96vh] max-h-[97vh] flex flex-col bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10">
        {/* Modal Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-2 sm:py-2.5 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/50 flex-shrink-0">
          {/* Left: Component Title & Badges */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Nav Arrows */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onPrev}
                disabled={!hasPrev}
                title="Previous prompt (Left Arrow)"
                className="p-1.5 rounded-lg border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-700 dark:text-zinc-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={!hasNext}
                title="Next prompt (Right Arrow)"
                className="p-1.5 rounded-lg border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-700 dark:text-zinc-300 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  id="prompt-modal-title"
                  className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 truncate"
                >
                  {prompt.title}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {prompt.category}
                </span>
                {prompt.targetTool && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400">
                    {prompt.targetTool}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Viewport Controls, Reload, Share, Unlock Action, Close */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Mode Switcher: Interactive vs Screenshot */}
            <div className="flex items-center bg-zinc-200/70 dark:bg-zinc-800/80 p-0.5 rounded-lg text-xs border border-zinc-300 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => setDisplayMode("interactive")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  displayMode === "interactive"
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
              >
                <Sparkles className="w-3 h-3 text-blue-500" />
                <span>Interactive</span>
              </button>
              {screenshot && (
                <button
                  type="button"
                  onClick={() => setDisplayMode("screenshot")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    displayMode === "screenshot"
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Capture</span>
                </button>
              )}
            </div>

            {/* Responsive Viewport Switcher (Interactive Mode only) */}
            {displayMode === "interactive" && (
              <div className="hidden sm:flex items-center bg-zinc-200/70 dark:bg-zinc-800/80 p-0.5 rounded-lg border border-zinc-300 dark:border-zinc-700">
                <button
                  type="button"
                  onClick={() => setViewport("desktop")}
                  title="Desktop viewport (100%)"
                  className={`p-1.5 rounded-md transition-all ${
                    viewport === "desktop"
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport("tablet")}
                  title="Tablet viewport (768px)"
                  className={`p-1.5 rounded-md transition-all ${
                    viewport === "tablet"
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
                  }`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport("mobile")}
                  title="Mobile viewport (390px)"
                  className={`p-1.5 rounded-md transition-all ${
                    viewport === "mobile"
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Reload Button */}
            {displayMode === "interactive" && (
              <button
                type="button"
                onClick={handleReload}
                title="Reload live canvas"
                className="p-1.5 rounded-lg border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
              >
                <RotateCw className={`w-3.5 h-3.5 ${iframeLoading ? "animate-spin text-blue-500" : ""}`} />
              </button>
            )}

            {/* Share Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy link to component"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 font-medium transition-colors"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Share</span>
                </>
              )}
            </button>

            {/* Direct Unlock via SupportKori Action */}
            <a
              href={buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] keep-white"
              title="Unlock prompt on SupportKori (৳49)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get Prompt (৳{prompt.priceBdt || 49})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Open In New Tab */}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open live component in standalone tab"
                className="p-1.5 rounded-lg border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              title="Close modal (Escape)"
              className="p-1.5 rounded-lg border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewport Canvas Area */}
        <div className="flex-1 min-h-0 w-full bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
          {/* Simulated Browser Bar */}
          <div className="w-full h-7 flex-shrink-0 bg-zinc-900/90 border-b border-zinc-800/80 px-3 flex items-center justify-between text-zinc-400 text-[10px] font-mono select-none">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2 h-2 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-zinc-950/80 border border-zinc-800 text-[10px] text-zinc-400 truncate max-w-xs">
              <span className="text-emerald-500 text-[9px]">🔒</span>
              <span className="truncate">
                {liveUrl ? liveUrl.replace(/^https?:\/\/[^/]+/, "shareflow.mhr3d.online") : "shareflow.mhr3d.online/previews"}
              </span>
            </div>
            <div className="text-[10px] uppercase font-bold text-zinc-500">
              {displayMode === "interactive" ? viewport : "1440px Screenshot"}
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div
            className={`flex-1 min-h-0 w-full flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
              viewport === "desktop" || displayMode === "screenshot"
                ? "w-full h-full"
                : viewport === "tablet"
                ? "w-full max-w-[768px] h-full shadow-2xl border-x border-zinc-800"
                : "w-full max-w-[420px] h-full shadow-2xl border-x border-zinc-800"
            }`}
          >
            {displayMode === "interactive" ? (
              <div className="relative w-full h-full bg-zinc-950 flex flex-col">
                {iframeLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950/90 text-white gap-2">
                    <RotateCw className="w-6 h-6 animate-spin text-blue-500" />
                    <span className="text-xs font-medium text-zinc-400">
                      Loading interactive Superdesign preview...
                    </span>
                  </div>
                )}
                {liveUrl ? (
                  <iframe
                    key={`${prompt.slug}-${iframeKey}`}
                    src={liveUrl}
                    title={prompt.title}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
                    className="w-full h-full flex-1 border-none bg-zinc-950"
                    onLoad={() => setIframeLoading(false)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 text-xs">
                    Live preview URL not available.
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full overflow-y-auto bg-zinc-950 scrollbar-thin scrollbar-thumb-zinc-700 flex flex-col">
                {screenshot ? (
                  <img
                    src={screenshot}
                    alt={`${prompt.title} full capture`}
                    className="w-full h-auto block select-none pointer-events-auto"
                    loading="eager"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
                    No screenshot capture available.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom: Production Prompt Specification & SupportKori Unlock */}
        <div className="p-2.5 sm:px-4 sm:py-2.5 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-start gap-3 w-full sm:w-auto">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  Production System Prompt & Bundle
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  ৳{prompt.priceBdt || 49} BDT
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 line-clamp-1 max-w-xl">
                {prompt.description ||
                  "Production-grade prompt specifications, design tokens, and source assets."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-shrink-0">
            <a
              href={buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-xs"
            >
              <span>SupportKori Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] keep-white"
            >
              <span>Unlock for ৳{prompt.priceBdt || 49} BDT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : modalContent;
};
