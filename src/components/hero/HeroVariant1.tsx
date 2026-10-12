/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  Copy,
  Check,
  Activity,
  ShieldCheck,
  ArrowRight,
  Wifi,
  Sparkles,
  Lock,
  Radio,
  FileCheck2,
  HardDriveDownload
} from "lucide-react";
import { ThreeVisualizer } from "../ThreeVisualizer";

interface HeroVariant1Props {
  onNotify?: (text: string, type?: "success" | "error") => void;
}

export function HeroVariant1({ onNotify }: HeroVariant1Props) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Island interactive states: 'idle' | 'streaming' | 'secure' | 'peer'
  const [islandState, setIslandState] = useState<"idle" | "streaming" | "secure" | "peer">("idle");
  const [islandExpanded, setIslandExpanded] = useState(false);

  // Transfer HUD state
  const [simulatedProgress, setSimulatedProgress] = useState(68);
  const [isSimulating, setIsSimulating] = useState(false);
  const [transferSpeed, setTransferSpeed] = useState(94.8);
  const [copiedLink, setCopiedLink] = useState(false);
  const [stagedFilesCount, setStagedFilesCount] = useState<number | null>(null);

  const notify = (msg: string, type: "success" | "error" = "success") => {
    if (onNotify) {
      onNotify(msg, type);
    }
  };

  // Speed jitter simulation when actively streaming
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      const jitter = (Math.random() * 18 - 8);
      setTransferSpeed((prev) => Math.max(72, Math.min(124, Number((prev + jitter).toFixed(1)))));
    }, 400);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleCopyP2PLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/file-share`;
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      notify("P2P Link copied to clipboard. Ready to share!", "success");
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      notify("Failed to copy link automatically.", "error");
    }
  };

  const handleSimulateStream = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setIslandState("streaming");
    setSimulatedProgress(12);
    setTransferSpeed(98.4);
    notify("Simulating high-speed WebRTC P2P DataChannel stream...", "success");

    const interval = setInterval(() => {
      setSimulatedProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulating(false);
          setIslandState("secure");
          notify("Transfer 100% complete via WebRTC DataChannel (0 bytes stored).", "success");
          return 100;
        }
        return prev + 11;
      });
    }, 260);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const count = e.dataTransfer.files.length;
      setStagedFilesCount(count);
      setIslandState("streaming");
      notify(`Staged ${count} file(s). Entering WebRTC P2P room...`, "success");
      setTimeout(() => {
        navigate("/file-share");
      }, 700);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const count = e.target.files.length;
      setStagedFilesCount(count);
      setIslandState("streaming");
      notify(`Selected ${count} file(s). Entering WebRTC P2P room...`, "success");
      setTimeout(() => {
        navigate("/file-share");
      }, 600);
    }
  };

  return (
    <section className="text-center pt-2 sm:pt-6 flex flex-col items-center w-full transition-colors duration-300">
      {/* Cupertino Dynamic Island Status Capsule */}
      <div className="relative mb-6 z-20">
        <div
          onClick={() => setIslandExpanded(!islandExpanded)}
          className={`cursor-pointer transition-all duration-300 ease-out flex items-center justify-between gap-3 px-4 py-2 rounded-full border shadow-lg backdrop-blur-2xl ${
            islandExpanded
              ? "bg-black text-white dark:bg-white dark:text-black border-white/20 dark:border-black/20 scale-105 px-5 py-2.5"
              : "bg-white/80 dark:bg-[#181a20]/90 text-[#1d1d1f] dark:text-[#f5f5f7] border-[#d2d2d7]/60 dark:border-white/10 hover:border-[#0071e3]/60"
          }`}
        >
          {/* Status Indicator Left */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  islandState === "streaming" ? "bg-[#34c759]" : "bg-[#0071e3]"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  islandState === "streaming" ? "bg-[#34c759]" : "bg-[#0071e3]"
                }`}
              />
            </span>

            <span className="text-[11px] font-bold tracking-wide uppercase">
              {islandState === "idle" && "ShareFlow 2.0 • WebRTC Core"}
              {islandState === "streaming" && `Active P2P Stream • ${transferSpeed} MB/s`}
              {islandState === "secure" && "100% Zero-Knowledge • 0 Bytes Stored"}
              {islandState === "peer" && "Direct Host Candidate • Latency < 12ms"}
            </span>
          </div>

          {/* Pill Tags Right */}
          <div className="flex items-center gap-1.5 text-[10px] font-semibold">
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-[#0071e3]/10 text-[#0071e3] dark:bg-[#0071e3]/20 dark:text-[#38bdf8]">
              AirDrop Web
            </span>
            <span className="inline-flex px-2 py-0.5 rounded-full bg-[#34c759]/10 text-[#34c759] dark:bg-[#34c759]/20 dark:text-[#4ade80]">
              AES-GCM
            </span>
          </div>
        </div>

        {/* Dynamic Island Expanded Panel */}
        {islandExpanded && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-80 sm:w-96 p-4 rounded-2xl bg-black/95 dark:bg-zinc-900/95 text-white backdrop-blur-2xl border border-white/20 shadow-2xl z-30 text-left animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs">
              <span className="font-bold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#34c759] animate-pulse" />
                <span>WebRTC DataChannel Telemetry</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">P2P v2.4</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-300">
              <div className="bg-white/5 p-2 rounded-xl">
                <span className="text-zinc-400 block text-[9px] uppercase">Signaling Relay</span>
                <span className="font-bold text-white">Cloudflare Edge</span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl">
                <span className="text-zinc-400 block text-[9px] uppercase">Payload Storage</span>
                <span className="font-bold text-[#34c759]">0 Bytes Retained</span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl">
                <span className="text-zinc-400 block text-[9px] uppercase">Cipher Suite</span>
                <span className="font-bold text-white">AES-256-GCM</span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl">
                <span className="text-zinc-400 block text-[9px] uppercase">Stream Pipe</span>
                <span className="font-bold text-[#38bdf8]">Unlimited GB</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] max-w-4xl leading-[1.08] mb-5">
        Share files at the speed of light.{" "}
        <span className="bg-gradient-to-r from-[#0071e3] via-[#00a3ff] to-[#34c759] bg-clip-text text-transparent">
          Peer-to-peer.
        </span>
      </h1>

      <p className="text-base sm:text-xl text-[#6e6e73] dark:text-[#a1a1aa] font-normal max-w-2xl leading-relaxed mb-9">
        Direct browser-to-browser WebRTC datachannels. Unlimited file sizes. Zero cloud storage egress. Protected by client-side AES-GCM-256 encryption.
      </p>

      {/* Interactive Cupertino Glass Hub */}
      <div className="w-full max-w-5xl bg-[#f5f5f7] dark:bg-[#12141a] border border-[#e5e5ea] dark:border-white/10 rounded-3xl p-4 sm:p-7 shadow-xl transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* 3D Three.js Visualizer Card */}
          <div className="relative w-full min-h-[340px] sm:min-h-[380px] bg-white dark:bg-[#181a20] border border-[#e5e5ea] dark:border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs group">
            <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md border border-[#e5e5ea] dark:border-white/10 text-[11px] font-semibold text-[#6e6e73] dark:text-[#a1a1aa]">
              <span className="w-2 h-2 rounded-full bg-[#34c759] animate-pulse"></span>
              <span>Three.js P2P Core • Drag to Rotate</span>
            </div>

            <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md border border-[#e5e5ea] dark:border-white/10 text-[10px] font-mono font-bold text-[#0071e3] dark:text-[#38bdf8]">
              <Wifi className="w-3 h-3" />
              <span>&lt; 12ms</span>
            </div>

            {/* Three.js Canvas */}
            <ThreeVisualizer />

            <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between px-3 py-2 rounded-xl bg-white/80 dark:bg-black/70 backdrop-blur-md border border-[#e5e5ea] dark:border-white/10 text-[11px] font-medium text-[#6e6e73] dark:text-[#a1a1aa]">
              <span>Direct Device-to-Device Mesh</span>
              <span className="text-[#34c759] font-bold">100% P2P Active</span>
            </div>
          </div>

          {/* Interactive File Drop & Live HUD */}
          <div className="bg-white dark:bg-[#181a20] border border-[#e5e5ea] dark:border-white/10 rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-5 text-left shadow-xs">
            {/* Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#0071e3]/40 hover:border-[#0071e3] dark:border-[#0071e3]/50 dark:hover:border-[#38bdf8] bg-[#fbfbfd] hover:bg-[#0071e3]/5 dark:bg-[#12141a]/60 dark:hover:bg-[#0071e3]/10 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-full bg-[#0071e3] text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-[#0071e3]/20 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="font-bold text-base text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
                {stagedFilesCount ? `Staged ${stagedFilesCount} file(s) — Click to add more` : "Drop Files Here to Share"}
              </div>
              <div className="text-xs text-[#6e6e73] dark:text-[#a1a1aa]">
                Direct browser stream • Unlimited file sizes • Instant P2P link
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Active Transfer Telemetry Card */}
            <div className="bg-[#f5f5f7] dark:bg-[#12141a] border border-[#e5e5ea] dark:border-white/10 rounded-xl p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] truncate max-w-[220px]">
                  video_production_master_4k.mov (4.2 GB)
                </span>
                <span className="font-mono font-bold text-[#34c759] flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 animate-pulse text-[#34c759]" />
                  <span>{transferSpeed} MB/s</span>
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-[#e5e5ea] dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0071e3] via-[#00a3ff] to-[#34c759] rounded-full transition-all duration-300"
                  style={{ width: `${simulatedProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#86868b] dark:text-zinc-400">
                <span>
                  {(4.2 * (simulatedProgress / 100)).toFixed(2)} GB / 4.20 GB ({simulatedProgress}%)
                </span>
                <span className="flex items-center gap-1 text-[#0071e3] dark:text-[#38bdf8]">
                  <Lock className="w-3 h-3" />
                  <span>WebRTC AES-GCM-256</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleCopyP2PLink}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-none cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? "Link Copied!" : "Copy Instant P2P Link"}</span>
              </button>

              <button
                type="button"
                onClick={handleSimulateStream}
                disabled={isSimulating}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#f5f5f7] dark:bg-[#12141a] hover:bg-[#e5e5ea] dark:hover:bg-zinc-800 disabled:opacity-60 text-[#1d1d1f] dark:text-[#f5f5f7] border border-[#d2d2d7] dark:border-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition-all focus:outline-none cursor-pointer"
              >
                <Activity className="w-4 h-4 text-[#0071e3] dark:text-[#38bdf8]" />
                <span>{isSimulating ? `Streaming (${simulatedProgress}%)` : "Test Speed Stream"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
