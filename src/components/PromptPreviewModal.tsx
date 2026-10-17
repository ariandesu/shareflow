import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  ExternalLink,
  Copy,
  Check,
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
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [copiedSpecNotice, setCopiedSpecNotice] = useState<boolean>(false);

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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !prompt) return null;

  const liveUrl = prompt.localPreviewUrl || prompt.previewUrl;
  const screenshot = prompt.screenshotUrl || (prompt.slug ? `/screenshots/${prompt.slug}.png` : null);

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

  const handleCopyPrompt = async () => {
    if (!prompt?.prompt) return;
    try {
      if (typeof window !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(prompt.prompt);
        setCopiedPrompt(true);
        setTimeout(() => setCopiedPrompt(false), 2000);
      }
    } catch (err) {
      console.warn("Failed to copy prompt:", err);
    }
  };

  const handleCopyLockedNotice = () => {
    setCopiedSpecNotice(true);
    setTimeout(() => {
      setCopiedSpecNotice(false);
      if (typeof window !== "undefined") {
        window.open(supportKoriUrl, "_blank");
      }
    }, 800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="prompt-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Backdrop click to close */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Modal Window */}
      <div className="relative w-full max-w-6xl max-h-[94vh] flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10">
        {/* Modal Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-900/50">
          {/* Left: Component Title & Badges */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Nav Arrows */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onPrev}
                disabled={!hasPrev}
                title="Previous prompt (Left Arrow)"
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-600 dark:text-zinc-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={!hasNext}
                title="Next prompt (Right Arrow)"
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-600 dark:text-zinc-300 transition-colors"
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
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {prompt.targetTool}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Viewport Controls, Reload, Share, Close */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Mode Switcher: Interactive vs Screenshot */}
            <div className="flex items-center bg-zinc-200/70 dark:bg-zinc-800/80 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setDisplayMode("interactive")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  displayMode === "interactive"
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
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
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Capture</span>
                </button>
              )}
            </div>

            {/* Responsive Viewport Switcher (Interactive Mode only) */}
            {displayMode === "interactive" && (
              <div className="hidden sm:flex items-center bg-zinc-200/70 dark:bg-zinc-800/80 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewport("desktop")}
                  title="Desktop viewport (100%)"
                  className={`p-1.5 rounded-md transition-all ${
                    viewport === "desktop"
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
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
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
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
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
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
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
              >
                <RotateCw className={`w-3.5 h-3.5 ${iframeLoading ? "animate-spin text-blue-500" : ""}`} />
              </button>
            )}

            {/* Copy Prompt Action */}
            {prompt.prompt && (
              <button
                type="button"
                onClick={handleCopyPrompt}
                title="Copy prompt text to clipboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 text-xs font-semibold shadow-xs transition-all"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            )}

            {/* Copy Share Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy link to component"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 font-medium transition-colors"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Share</span>
                </>
              )}
            </button>

            {/* Open In New Tab */}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open live component in standalone tab"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Open Tab</span>
              </a>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              title="Close modal (Escape)"
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewport Canvas Area */}
        <div className="flex-1 w-full bg-zinc-950 flex flex-col items-center justify-center overflow-hidden min-h-[420px] sm:min-h-[520px]">
          {/* Simulated Browser Bar */}
          <div className="w-full h-7 bg-zinc-900/90 border-b border-zinc-800/80 px-3 flex items-center justify-between text-zinc-400 text-[10px] font-mono select-none">
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
            className={`flex-1 w-full flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
              viewport === "desktop" || displayMode === "screenshot"
                ? "w-full"
                : viewport === "tablet"
                ? "w-full max-w-[768px] shadow-2xl border-x border-zinc-800"
                : "w-full max-w-[390px] shadow-2xl border-x border-zinc-800"
            }`}
          >
            {displayMode === "interactive" ? (
              <div className="relative w-full h-[460px] sm:h-[540px] bg-zinc-950">
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
                    className="w-full h-full border-none bg-zinc-950"
                    onLoad={() => setIframeLoading(false)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 text-xs">
                    Live preview URL not available.
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-[460px] sm:h-[540px] overflow-y-auto bg-zinc-950 scrollbar-thin scrollbar-thumb-zinc-700">
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
        <div className="p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-start gap-3 w-full sm:w-auto">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  Production System Prompt & Bundle
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  ৳{prompt.priceBdt || 49} BDT
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1 max-w-xl">
                {prompt.description ||
                  "Production-grade prompt specifications, design tokens, and source assets."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-shrink-0">
            <button
              type="button"
              onClick={handleCopyLockedNotice}
              className="px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {copiedSpecNotice ? "Redirecting..." : "View Spec Details"}
            </button>

            <a
              href={supportKoriUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Unlock for ৳{prompt.priceBdt || 49}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
