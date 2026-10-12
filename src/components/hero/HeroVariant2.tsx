/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Terminal,
  Zap,
  Shield,
  Download,
  ArrowRight,
  Copy,
  Check,
  Cpu,
  Wifi,
  CornerDownLeft,
  Flame,
  Radio
} from "lucide-react";

interface HeroVariant2Props {
  onNotify?: (text: string, type?: "success" | "error") => void;
}

export function HeroVariant2({ onNotify }: HeroVariant2Props) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [peerCode, setPeerCode] = useState("");
  const [activeLogIndex, setActiveLogIndex] = useState(0);
  const [simulatedPackets, setSimulatedPackets] = useState(1420);
  const [copiedCode, setCopiedCode] = useState(false);

  const logs = [
    "[WEBRTC_CORE] STUN signaling resolved via Cloudflare Edge relay",
    "[HANDSHAKE] Initializing local ephemeral DTLS-SRTP context",
    "[CRYPTO] Client-side AES-GCM-256 session key generated in RAM",
    "[DATALINK] Direct peer-to-peer DataChannel established (0 server bytes)",
    "[STREAM] Throughput saturated at 98.4 MB/s • Packet loss: 0.00%"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLogIndex((prev) => (prev + 1) % logs.length);
      setSimulatedPackets((p) => p + Math.floor(Math.random() * 45 + 15));
    }, 2400);
    return () => clearInterval(interval);
  }, [logs.length]);

  const notify = (msg: string, type: "success" | "error" = "success") => {
    if (onNotify) onNotify(msg, type);
  };

  const handleJoinPeer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!peerCode.trim()) {
      notify("Please enter a valid 4-character room code.", "error");
      return;
    }
    notify(`Connecting to peer node [${peerCode.toUpperCase()}]...`, "success");
    navigate(`/f?code=${encodeURIComponent(peerCode.trim().toUpperCase())}`);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      notify(`Staged ${e.target.files.length} file(s). Initializing high-speed pipe...`, "success");
      setTimeout(() => navigate("/file-share"), 400);
    }
  };

  const handleCopyQuickCode = async () => {
    try {
      await navigator.clipboard.writeText("SF-9824");
      setCopiedCode(true);
      notify("Demo Room Code SF-9824 copied to clipboard!", "success");
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      notify("Failed to copy code.", "error");
    }
  };

  return (
    <section className="text-left pt-2 sm:pt-6 flex flex-col items-center w-full transition-colors duration-300">
      <div className="w-full max-w-5xl flex flex-col gap-8">
        {/* Terminal Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5e5ea] dark:border-[#27272a] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1d1d1f] dark:bg-white text-white dark:text-black flex items-center justify-center font-mono font-bold text-xs shadow-sm">
              &gt;_
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">
                  SHAREFLOW_CLI://v2.4
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#34c759]/10 text-[#34c759] border border-[#34c759]/20 font-bold">
                  DIRECT_MESH_ACTIVE
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#86868b] dark:text-[#a1a1aa]">
                P2P DataChannel Subsystem • Zero Intermediate Servers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f5f5f7] dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a] text-[#6e6e73] dark:text-[#a1a1aa]">
              <Cpu className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>Packets: <strong className="text-[#1d1d1f] dark:text-white">{simulatedPackets.toLocaleString()}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f5f5f7] dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a] text-[#6e6e73] dark:text-[#a1a1aa]">
              <Wifi className="w-3.5 h-3.5 text-[#34c759]" />
              <span>RTT: <strong className="text-[#34c759]">9.2ms</strong></span>
            </div>
          </div>
        </div>

        {/* Hero Headline & Subtitle */}
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#0071e3] dark:text-[#38bdf8] uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>High-Throughput WebRTC Stream Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] leading-[1.1]">
            Encrypted Data Transmission.{" "}
            <span className="bg-gradient-to-r from-[#0071e3] to-[#34c759] bg-clip-text text-transparent">
              Direct Memory Pipe.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#6e6e73] dark:text-[#a1a1aa] font-normal max-w-3xl leading-relaxed">
            Eliminate cloud storage relays. ShareFlow connects sending and receiving browser runtimes over encrypted WebRTC DataChannels with client-side key generation.
          </p>
        </div>

        {/* Cyber Dual Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Console: Quick Drop & Peer Connector */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Direct Send Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files.length > 0) {
                  notify(`Staged ${e.dataTransfer.files.length} file(s). Entering room...`, "success");
                  setTimeout(() => navigate("/file-share"), 400);
                }
              }}
              className="group cursor-pointer rounded-2xl border-2 border-dashed border-[#0071e3]/40 dark:border-[#0071e3]/60 hover:border-[#0071e3] dark:hover:border-[#38bdf8] bg-white dark:bg-[#12141a] p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0071e3]/10 dark:bg-[#0071e3]/20 text-[#0071e3] dark:text-[#38bdf8] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-[#1d1d1f] dark:text-white mb-1">
                Drop Payload to Initialize P2P Stream
              </h3>
              <p className="text-xs text-[#6e6e73] dark:text-[#a1a1aa] max-w-sm mb-4">
                Unlimited file sizes • Zero upload to server • In-memory AES-GCM-256
              </p>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold shadow-sm transition-all">
                Select Files from Machine
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Peer Code Connect Box */}
            <form
              onSubmit={handleJoinPeer}
              className="rounded-2xl border border-[#e5e5ea] dark:border-[#27272a] bg-white dark:bg-[#12141a] p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-3 shadow-xs"
            >
              <div className="flex-1 w-full">
                <label className="block text-[10px] font-mono uppercase text-[#86868b] dark:text-[#a1a1aa] mb-1 font-bold">
                  Connect to Peer Room Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={peerCode}
                    onChange={(e) => setPeerCode(e.target.value)}
                    placeholder="Enter 4-letter code (e.g. SF-9824)"
                    maxLength={10}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f5f5f7] dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a] text-sm font-mono text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:border-[#0071e3] uppercase placeholder:normal-case placeholder:text-xs"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1d1d1f] dark:bg-white text-white dark:text-black font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity self-end sm:mb-0.5"
              >
                <span>Connect</span>
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Right Console: Live Packet Log Terminal */}
          <div className="lg:col-span-5 rounded-2xl border border-[#e5e5ea] dark:border-[#27272a] bg-[#12141a] text-white p-5 flex flex-col justify-between font-mono shadow-lg">
            <div>
              {/* Terminal Titlebar */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="text-[11px] text-zinc-400 font-bold ml-1">stream_telemetry.log</span>
                </div>
                <span className="text-[10px] text-[#34c759] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34c759] animate-ping" />
                  LIVE
                </span>
              </div>

              {/* Monospace Log Lines */}
              <div className="flex flex-col gap-2.5 text-[11px] text-zinc-300">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg transition-all ${
                      index === activeLogIndex
                        ? "bg-white/10 text-white border-l-2 border-[#0071e3]"
                        : "opacity-60 text-zinc-400"
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Demo Node Box */}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Sample Seed Peer</span>
                <span className="font-mono text-xs font-bold text-[#38bdf8]">SF-9824</span>
              </div>
              <button
                type="button"
                onClick={handleCopyQuickCode}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-[#34c759]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? "Copied" : "Copy Code"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-white dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] flex items-center gap-2 text-[#1d1d1f] dark:text-[#f5f5f7]">
            <Shield className="w-4 h-4 text-[#34c759]" />
            <span>Zero Server Egress</span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] flex items-center gap-2 text-[#1d1d1f] dark:text-[#f5f5f7]">
            <Zap className="w-4 h-4 text-[#0071e3]" />
            <span>Direct WebRTC Pipe</span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] flex items-center gap-2 text-[#1d1d1f] dark:text-[#f5f5f7]">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Ephemeral Secrets</span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] flex items-center gap-2 text-[#1d1d1f] dark:text-[#f5f5f7]">
            <Download className="w-4 h-4 text-purple-500" />
            <span>Unlimited File Size</span>
          </div>
        </div>
      </div>
    </section>
  );
}
