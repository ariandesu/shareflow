/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Share2,
  FileUp,
  Download,
  FileText,
  QrCode,
  ShoppingBag,
  Zap,
  Shield,
  Wifi,
  Sparkles,
  ArrowRight,
  HardDrive,
  Laptop,
  Smartphone,
  Globe
} from "lucide-react";

interface HeroVariant4Props {
  onNotify?: (text: string, type?: "success" | "error") => void;
}

export function HeroVariant4({ onNotify }: HeroVariant4Props) {
  const navigate = useNavigate();
  const [activeNode, setActiveNode] = useState<"sender" | "receiver" | "pipe">("pipe");

  const notify = (msg: string, type: "success" | "error" = "success") => {
    if (onNotify) onNotify(msg, type);
  };

  const dockItems = [
    { name: "Direct Share", href: "/file-share", icon: FileUp, badge: "P2P", color: "from-blue-500 to-indigo-600" },
    { name: "Receive Stream", href: "/f", icon: Download, badge: "Code", color: "from-emerald-500 to-teal-600" },
    { name: "Secret Note", href: "/text-share", icon: FileText, badge: "Burn", color: "from-amber-500 to-orange-600" },
    { name: "QR Connect", href: "/qr-generator", icon: QrCode, badge: "Scan", color: "from-purple-500 to-pink-600" },
    { name: "Developer Kits", href: "/products", icon: ShoppingBag, badge: "SDK", color: "from-cyan-500 to-blue-600" },
  ];

  return (
    <section className="text-center pt-2 sm:pt-6 flex flex-col items-center w-full transition-colors duration-300">
      {/* Network Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#f5f5f7] dark:bg-[#181a20] text-[#0071e3] dark:text-[#38bdf8] border border-[#d2d2d7]/50 dark:border-white/10 mb-5 shadow-xs transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 cursor-default">
        <Wifi className="w-3.5 h-3.5 text-[#34c759] animate-pulse" />
        <span>Decentralized WebRTC Mesh Network</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] max-w-4xl leading-[1.08] mb-5">
        Zero Relays. Zero Logs.{" "}
        <span className="bg-gradient-to-r from-[#0071e3] via-indigo-500 to-[#34c759] bg-clip-text text-transparent">
          Direct Orbital Transfer.
        </span>
      </h1>

      <p className="text-base sm:text-xl text-[#6e6e73] dark:text-[#a1a1aa] font-normal max-w-2xl leading-relaxed mb-9">
        Devices form an authenticated peer-to-peer data mesh over WebRTC. Files stream directly between memories with zero intermediation.
      </p>

      {/* Orbital Interactive Canvas & Visualizer Container */}
      <div className="w-full max-w-5xl rounded-3xl bg-white dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] p-6 sm:p-8 shadow-xl relative overflow-hidden mb-8">
        {/* Background Radial Glow */}
        <div className="absolute inset-0 bg-radial from-[#0071e3]/5 via-transparent to-transparent pointer-events-none" />

        {/* Orbital Network Diagram */}
        <div className="relative z-10 w-full min-h-[260px] sm:min-h-[300px] flex flex-col sm:flex-row items-center justify-around gap-6">
          {/* Node 1: Sender Node */}
          <div
            onClick={() => {
              setActiveNode("sender");
              notify("Sender Node: In-memory chunking with WebCrypto AES-GCM-256.", "success");
            }}
            className={`cursor-pointer group flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-95 ${
              activeNode === "sender"
                ? "bg-[#0071e3]/10 border-[#0071e3] scale-105 shadow-lg"
                : "bg-[#f5f5f7] dark:bg-[#181a20] border-[#e5e5ea] dark:border-[#27272a] hover:border-[#0071e3]/50"
            }`}
          >
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0071e3] to-sky-400 flex items-center justify-center text-white shadow-md shadow-[#0071e3]/30">
              <Laptop className="w-8 h-8" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#34c759] border-2 border-white dark:border-[#12141a]" />
            </div>
            <div className="text-center">
              <span className="font-bold text-sm text-[#1d1d1f] dark:text-white block">Host Node</span>
              <span className="text-[11px] font-mono text-[#86868b] dark:text-[#a1a1aa]">Client Browser A</span>
            </div>
          </div>

          {/* Center Connection WebRTC Pipe */}
          <div
            onClick={() => {
              setActiveNode("pipe");
              notify("Direct P2P DataChannel: Latency < 12ms, 0 Bytes stored in cloud.", "success");
            }}
            className="flex-1 max-w-xs flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="w-full flex items-center justify-between text-[11px] font-mono text-[#86868b] dark:text-[#a1a1aa] px-2">
              <span className="text-[#0071e3] font-bold">100% Direct</span>
              <span className="text-[#34c759] font-bold">0 Server Storage</span>
            </div>

            {/* Animated Pipe Line */}
            <div className="relative w-full h-3 bg-[#e5e5ea] dark:bg-[#27272a] rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0071e3] via-teal-400 to-[#34c759] animate-pulse" />
              <div className="absolute top-0 bottom-0 w-8 bg-white/70 dark:bg-white/90 rounded-full blur-xs animate-ping" />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5f5f7] dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a] text-[10px] font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
              <Zap className="w-3 h-3 text-[#34c759]" />
              <span>WebRTC SCTP DataChannel</span>
            </div>
          </div>

          {/* Node 2: Receiver Node */}
          <div
            onClick={() => {
              setActiveNode("receiver");
              notify("Receiver Node: Real-time chunk reassembly into Blob with zero server hops.", "success");
            }}
            className={`cursor-pointer group flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-95 ${
              activeNode === "receiver"
                ? "bg-[#34c759]/10 border-[#34c759] scale-105 shadow-lg"
                : "bg-[#f5f5f7] dark:bg-[#181a20] border-[#e5e5ea] dark:border-[#27272a] hover:border-[#34c759]/50"
            }`}
          >
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#34c759] to-emerald-400 flex items-center justify-center text-white shadow-md shadow-[#34c759]/30">
              <Smartphone className="w-8 h-8" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#0071e3] border-2 border-white dark:border-[#12141a]" />
            </div>
            <div className="text-center">
              <span className="font-bold text-sm text-[#1d1d1f] dark:text-white block">Peer Node</span>
              <span className="text-[11px] font-mono text-[#86868b] dark:text-[#a1a1aa]">Client Browser B</span>
            </div>
          </div>
        </div>

        {/* Telemetry Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-[#e5e5ea] dark:border-[#27272a] text-left">
          <div className="p-3.5 rounded-xl bg-[#f5f5f7] dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a]">
            <span className="text-[10px] font-bold text-[#86868b] dark:text-[#a1a1aa] uppercase tracking-wider block">P2P Network Latency</span>
            <span className="text-lg font-black text-[#1d1d1f] dark:text-white font-mono">&lt; 12 ms</span>
            <span className="text-[10px] text-[#34c759] block font-semibold mt-0.5">Ultra-low direct roundtrip</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#f5f5f7] dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a]">
            <span className="text-[10px] font-bold text-[#86868b] dark:text-[#a1a1aa] uppercase tracking-wider block">Transfer Throughput</span>
            <span className="text-lg font-black text-[#1d1d1f] dark:text-white font-mono">Up to 1.2 Gbps</span>
            <span className="text-[10px] text-[#0071e3] dark:text-[#38bdf8] block font-semibold mt-0.5">Line-rate peer speed</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#f5f5f7] dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a]">
            <span className="text-[10px] font-bold text-[#86868b] dark:text-[#a1a1aa] uppercase tracking-wider block">Cloud Storage Incurred</span>
            <span className="text-lg font-black text-[#34c759] font-mono">0.00 MB</span>
            <span className="text-[10px] text-[#86868b] dark:text-[#a1a1aa] block font-semibold mt-0.5">Never leaves peer RAM</span>
          </div>
        </div>
      </div>

      {/* Floating macOS-Style Dock */}
      <div className="w-full max-w-2xl px-2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[11px] font-semibold text-[#86868b] dark:text-[#a1a1aa] uppercase tracking-wider">
            Quick Actions Dock
          </span>
          <div className="w-full p-2.5 rounded-2xl bg-white/90 dark:bg-[#12141a]/90 backdrop-blur-xl border border-[#e5e5ea] dark:border-white/10 shadow-2xl flex items-center justify-around gap-2">
            {dockItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="group flex flex-col items-center gap-1.5 p-2 sm:px-3 rounded-xl hover:bg-[#f5f5f7] dark:hover:bg-[#1f222a] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 hover:-translate-y-1.5 active:scale-95"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-[#1d1d1f] dark:text-[#f5f5f7] whitespace-nowrap">
                    {item.name}
                  </span>
                  <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-[#f5f5f7] dark:bg-[#27272a] text-[#86868b] dark:text-[#a1a1aa]">
                    {item.badge}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
