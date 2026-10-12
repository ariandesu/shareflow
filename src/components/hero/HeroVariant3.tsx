/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileUp,
  Download,
  ShieldCheck,
  Zap,
  ArrowRight,
  Lock,
  Sparkles,
  CheckCircle2,
  KeyRound
} from "lucide-react";

interface HeroVariant3Props {
  onNotify?: (text: string, type?: "success" | "error") => void;
}

export function HeroVariant3({ onNotify }: HeroVariant3Props) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"send" | "receive">("send");
  const [codeDigits, setCodeDigits] = useState(["", "", "", ""]);

  const notify = (msg: string, type: "success" | "error" = "success") => {
    if (onNotify) onNotify(msg, type);
  };

  const handleDigitChange = (index: number, val: string) => {
    const cleaned = val.toUpperCase().slice(-1);
    const newDigits = [...codeDigits];
    newDigits[index] = cleaned;
    setCodeDigits(newDigits);

    // Auto-advance input
    if (cleaned && index < 3) {
      const nextInput = document.getElementById(`digit-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit if all 4 digits entered
    if (cleaned && index === 3 && newDigits.every((d) => d.length > 0)) {
      const fullCode = newDigits.join("");
      notify(`Joining peer room [${fullCode}]...`, "success");
      setTimeout(() => {
        navigate(`/f?code=${encodeURIComponent(fullCode)}`);
      }, 400);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !codeDigits[index] && index > 0) {
      const prevInput = document.getElementById(`digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleReceiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = codeDigits.join("");
    if (fullCode.length < 4) {
      notify("Please enter a 4-digit code to connect.", "error");
      return;
    }
    notify(`Joining peer room [${fullCode}]...`, "success");
    navigate(`/f?code=${encodeURIComponent(fullCode)}`);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      notify(`Selected ${e.dataTransfer.files.length} file(s). Creating direct WebRTC stream...`, "success");
      setTimeout(() => navigate("/file-share"), 400);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      notify(`Selected ${e.target.files.length} file(s). Entering room...`, "success");
      setTimeout(() => navigate("/file-share"), 400);
    }
  };

  return (
    <section className="text-center pt-4 sm:pt-10 flex flex-col items-center w-full transition-colors duration-300">
      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#f5f5f7] dark:bg-[#181a20] text-[#0071e3] dark:text-[#38bdf8] border border-[#d2d2d7]/50 dark:border-white/10 mb-6 shadow-xs">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Minimal P2P Transfer Architecture</span>
      </div>

      {/* Hero Headline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] max-w-4xl leading-[1.08] mb-5">
        Transfer Anything.{" "}
        <span className="bg-gradient-to-r from-[#0071e3] via-sky-500 to-[#34c759] bg-clip-text text-transparent">
          Zero Footprint.
        </span>
      </h1>

      <p className="text-base sm:text-xl text-[#6e6e73] dark:text-[#a1a1aa] font-normal max-w-2xl leading-relaxed mb-10">
        No accounts, no file size caps, no permanent storage. Just direct encrypted streams between devices anywhere on earth.
      </p>

      {/* Dual Action Segmented Pod */}
      <div className="w-full max-w-xl bg-white dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] rounded-3xl p-6 sm:p-8 shadow-xl transition-all">
        {/* Segmented Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#f5f5f7] dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a] mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("send")}
            className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "send"
                ? "bg-white dark:bg-[#27272a] text-[#1d1d1f] dark:text-white shadow-sm"
                : "text-[#6e6e73] dark:text-[#a1a1aa] hover:text-[#1d1d1f] dark:hover:text-white"
            }`}
          >
            <FileUp className="w-4 h-4 text-[#0071e3]" />
            <span>Send Files</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("receive")}
            className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "receive"
                ? "bg-white dark:bg-[#27272a] text-[#1d1d1f] dark:text-white shadow-sm"
                : "text-[#6e6e73] dark:text-[#a1a1aa] hover:text-[#1d1d1f] dark:hover:text-white"
            }`}
          >
            <Download className="w-4 h-4 text-[#34c759]" />
            <span>Receive via Code</span>
          </button>
        </div>

        {/* Tab Content: Send */}
        {activeTab === "send" && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-[#0071e3]/30 dark:border-[#0071e3]/50 hover:border-[#0071e3] dark:hover:border-[#38bdf8] bg-[#fbfbfd] hover:bg-[#0071e3]/5 dark:bg-[#181a20]/60 dark:hover:bg-[#0071e3]/10 rounded-2xl p-8 sm:p-10 cursor-pointer transition-all text-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#0071e3] text-white flex items-center justify-center mx-auto mb-3.5 shadow-md shadow-[#0071e3]/20 group-hover:scale-105 transition-transform">
                <FileUp className="w-7 h-7 stroke-[2.2]" />
              </div>
              <h3 className="font-bold text-base text-[#1d1d1f] dark:text-white mb-1">
                Drop files here or click to select
              </h3>
              <p className="text-xs text-[#6e6e73] dark:text-[#a1a1aa] max-w-sm mx-auto">
                Any file type, unlimited gigabytes, direct browser-to-browser pipe
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            <button
              type="button"
              onClick={() => navigate("/file-share")}
              className="w-full py-3.5 rounded-2xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-sm shadow-md shadow-[#0071e3]/25 flex items-center justify-center gap-2 transition-all"
            >
              <span>Open Dedicated File Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab Content: Receive */}
        {activeTab === "receive" && (
          <form onSubmit={handleReceiveSubmit} className="flex flex-col gap-5 animate-in fade-in duration-200">
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs font-semibold text-[#6e6e73] dark:text-[#a1a1aa]">
                Enter 4-Character Room Code
              </span>
              <div className="flex items-center justify-center gap-2.5 sm:gap-3">
                {codeDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`digit-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl bg-[#f5f5f7] dark:bg-[#181a20] border-2 border-[#e5e5ea] dark:border-[#27272a] text-center font-mono text-xl sm:text-2xl font-black text-[#1d1d1f] dark:text-white focus:outline-none focus:border-[#0071e3] dark:focus:border-[#38bdf8] transition-all uppercase"
                    placeholder="•"
                  />
                ))}
              </div>
            </div>

            <p className="text-[11px] text-[#86868b] dark:text-[#a1a1aa] text-center">
              Code is provided by the sender. Once entered, download begins immediately without caching on our servers.
            </p>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#1d1d1f] dark:bg-white text-white dark:text-black font-semibold text-sm shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>Connect &amp; Download Stream</span>
            </button>
          </form>
        )}
      </div>

      {/* Bottom Trust Indicators */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-10 text-xs text-[#6e6e73] dark:text-[#a1a1aa]">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#34c759]" />
          <span>No file size limits</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0071e3]" />
          <span>Client-side AES-GCM-256</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>RAM-only streaming</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-purple-500" />
          <span>Zero cloud egress</span>
        </div>
      </div>
    </section>
  );
}
