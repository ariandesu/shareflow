import { Link } from "react-router-dom";
import { Check, Coffee, Twitter, Share2, Sparkles, Shield, Bookmark, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { MONETIZATION_CONFIG } from "../config/monetization";
import { SITE_URL } from "../config/site";

interface TransferSuccessCardProps {
  fileName?: string;
  fileSizeFormatted?: string;
  isSender?: boolean;
  onReset?: () => void;
  className?: string;
}

export function TransferSuccessCard({
  fileName = "File package",
  fileSizeFormatted = "Direct Stream",
  isSender = true,
  onReset,
  className = "",
}: TransferSuccessCardProps) {
  const shareText = encodeURIComponent(
    `Just transferred a file browser-to-browser using ShareFlow via WebRTC with 0 bytes uploaded to any cloud server! ⚡ No 2GB caps or upload wait: ${SITE_URL}`
  );
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${shareText}`;
  const redditShareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(
    SITE_URL
  )}&title=${encodeURIComponent("Zero-knowledge browser-to-browser P2P file transfer tool with 0 byte server limits")}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={`w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a] shadow-xl text-[#1d1d1f] dark:text-[#f5f5f7] space-y-6 ${className}`}
    >
      {/* Success Banner */}
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2 shadow-xs">
          <Check className="w-8 h-8 stroke-[2.5]" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>100% Direct P2P Transfer Complete</span>
        </div>
        <h3 className="text-2xl font-black tracking-tight text-[#1d1d1f] dark:text-white">
          {isSender ? "Transfer Delivered Successfully!" : "Download Completed!"}
        </h3>
        <p className="text-xs text-[#6e6e73] dark:text-[#a1a1aa] max-w-md">
          {fileName} ({fileSizeFormatted}) streamed socket-to-socket via WebRTC DataChannel.
        </p>
      </div>

      {/* Dynamic Architecture Cost Stats */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#121316] border border-[#e5e5ea] dark:border-[#27272a] text-center">
        <div>
          <div className="text-[11px] font-semibold text-[#86868b] dark:text-[#71717a] uppercase">Cloud Egress</div>
          <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">$0.00</div>
        </div>
        <div>
          <div className="text-[11px] font-semibold text-[#86868b] dark:text-[#71717a] uppercase">Disk Retained</div>
          <div className="text-base font-extrabold text-[#0071e3] dark:text-[#38bdf8]">0 Bytes</div>
        </div>
        <div>
          <div className="text-[11px] font-semibold text-[#86868b] dark:text-[#71717a] uppercase">Encryption</div>
          <div className="text-base font-extrabold text-purple-600 dark:text-purple-400">DTLS / SCTP</div>
        </div>
      </div>

      {/* Action 1: Support Signaling Infrastructure */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
            <Coffee className="w-4 h-4" />
            <span>Keep Our Open Signaling Servers Alive</span>
          </div>
          <p className="text-[11px] text-[#6e6e73] dark:text-[#a1a1aa]">
            ShareFlow is 100% free with no tracking. Support our WebRTC signaling nodes.
          </p>
        </div>
        <a
          href={MONETIZATION_CONFIG.supportSignalingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-xs active:scale-95 inline-flex items-center gap-1.5"
        >
          <span>☕ Tip $3</span>
        </a>
      </div>

      {/* Action 2: Viral Loop / Explore 40+ Utilities */}
      <div className="space-y-3 pt-2 border-t border-[#e5e5ea] dark:border-[#27272a]">
        <div className="flex items-center justify-between text-xs font-bold text-[#1d1d1f] dark:text-white">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>Explore 40+ Client-Side Utilities</span>
          </span>
          <span className="text-[11px] text-[#86868b] font-normal flex items-center gap-1">
            <Bookmark className="w-3 h-3" />
            <span>Press Ctrl+D to bookmark</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link
            to="/pdf-merger"
            className="px-3 py-1.5 rounded-xl bg-[#f5f5f7] dark:bg-[#1e2026] hover:bg-[#0071e3]/10 hover:text-[#0071e3] transition-colors"
          >
            PDF Merger (Local)
          </Link>
          <Link
            to="/image-compressor"
            className="px-3 py-1.5 rounded-xl bg-[#f5f5f7] dark:bg-[#1e2026] hover:bg-[#0071e3]/10 hover:text-[#0071e3] transition-colors"
          >
            Image Compressor
          </Link>
          <Link
            to="/text-share"
            className="px-3 py-1.5 rounded-xl bg-[#f5f5f7] dark:bg-[#1e2026] hover:bg-[#0071e3]/10 hover:text-[#0071e3] transition-colors"
          >
            Self-Destructing Note
          </Link>
          <Link
            to="/jwt-decoder"
            className="px-3 py-1.5 rounded-xl bg-[#f5f5f7] dark:bg-[#1e2026] hover:bg-[#0071e3]/10 hover:text-[#0071e3] transition-colors"
          >
            JWT Token Inspector
          </Link>
        </div>
      </div>

      {/* Action 3: 1-Click Share & Send Another Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#e5e5ea] dark:border-[#27272a]">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">Share:</span>
          <a
            href={twitterShareUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-[#f5f5f7] dark:bg-[#1e2026] hover:text-[#1da1f2] hover:bg-[#1da1f2]/10 transition-colors"
            title="Share on X / Twitter"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href={redditShareUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-[#f5f5f7] dark:bg-[#1e2026] hover:text-[#ff4500] hover:bg-[#ff4500]/10 transition-colors"
            title="Share on Reddit"
          >
            <Share2 className="w-4 h-4" />
          </a>
        </div>

        {onReset && (
          <button
            onClick={onReset}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-xs transition-colors shadow-xs"
          >
            Send Another File
          </button>
        )}
      </div>
    </motion.div>
  );
}
