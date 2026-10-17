import React, { useState, useRef } from "react";
import { Sparkles, Eye, Zap, ExternalLink } from "lucide-react";
import { PromptItem } from "../types/prompt";
import { getPromptMedia } from "../utils/promptMedia";

interface PromptCardProps {
  item: PromptItem;
  isSelected?: boolean;
  onClick: () => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  item,
  isSelected = false,
  onClick,
}) => {
  const media = getPromptMedia(item);
  const [isHovered, setIsHovered] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && !videoError) {
      videoRef.current.play().catch(() => {
        // Autoplay policy or interrupt safely ignored
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current && !videoError) {
      videoRef.current.pause();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  // Determine pricing label
  const isFree = Boolean(item.isFree);
  const priceDisplay = isFree ? "Free" : `৳${item.priceBdt || 49} BDT`;
  const supportKoriUrl = item.buyUrl || "https://supportkori.com/creator/mahirfaisal";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex flex-col text-left rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer ${
        isSelected
          ? "ring-2 ring-blue-500 shadow-lg shadow-blue-500/10 bg-zinc-50 dark:bg-zinc-900 border border-blue-500/40"
          : "bg-white dark:bg-zinc-900/70 hover:bg-zinc-50/90 dark:hover:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm hover:shadow-xl"
      }`}
    >
      {/* 1:1 Square Media Preview Container */}
      <div className="relative w-full aspect-square overflow-hidden bg-zinc-950/20 dark:bg-zinc-950/60 rounded-t-2xl">
        {/* GIF Preview (Highest Priority for animated visual) */}
        {media.gifUrl && !imageError ? (
          <img
            src={media.gifUrl}
            alt={item.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : media.videoUrl && !videoError ? (
          /* Video Looping Preview */
          <video
            ref={videoRef}
            src={media.videoUrl}
            poster={media.imageUrl}
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Fallback Static Screenshot */
          <img
            src={imageError ? "/placeholder-preview.png" : media.imageUrl}
            alt={item.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* Ambient Dark Gradient for Badge Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
          {/* Category Pill */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-md bg-black/70 text-white border border-white/20 shadow-sm keep-white">
            {item.category || "UI"}
          </span>

          {/* Pricing Pill */}
          <span
            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold backdrop-blur-md shadow-sm keep-white ${
              isFree
                ? "bg-emerald-600 text-white border border-emerald-400/30"
                : "bg-blue-600 text-white border border-blue-400/30"
            }`}
          >
            {!isFree && <Zap className="w-2.5 h-2.5 fill-white" />}
            {priceDisplay}
          </span>
        </div>

        {/* Bottom Interactive / Live Indicator Badge */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/70 backdrop-blur-md text-white border border-white/20 keep-white">
            <Sparkles className="w-2.5 h-2.5 text-blue-400" />
            Interactive
          </span>

          {/* Hover "Open Preview" Pill */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600 text-white shadow-md keep-white transition-all duration-200 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
            }`}
          >
            <Eye className="w-2.5 h-2.5" />
            Preview
          </span>
        </div>
      </div>

      {/* Card Metadata Footer */}
      <div className="p-3.5 flex flex-col justify-between flex-grow bg-white dark:bg-[#12141a]">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {item.title}
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
            {item.description || "Production-ready prompt and interactive design component."}
          </p>
        </div>

        {/* Tags, Tool row & SupportKori Quick Action */}
        <div className="mt-2.5 pt-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60 text-[11px]">
          <span className="text-zinc-500 dark:text-zinc-400 font-mono">
            {item.targetTool || "Universal"}
          </span>
          <div className="flex items-center gap-1.5">
            {item.tags && item.tags.length > 0 && (
              <span className="text-zinc-500 dark:text-zinc-400 truncate max-w-[90px]">
                #{item.tags[0]}
              </span>
            )}
            <a
              href={supportKoriUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white font-semibold text-[10px] transition-colors"
              title="Unlock prompt on SupportKori (৳49)"
            >
              <span>Get Prompt</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
