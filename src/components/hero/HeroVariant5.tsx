/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Key,
  Fingerprint,
  FileCheck,
  CheckCircle2,
  ExternalLink,
  Zap,
  ArrowRight,
  EyeOff,
  DatabaseZap,
  Cpu
} from "lucide-react";

interface HeroVariant5Props {
  onNotify?: (text: string, type?: "success" | "error") => void;
}

export function HeroVariant5({ onNotify }: HeroVariant5Props) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"security" | "specs">("security");
  const [copiedFingerprint, setCopiedFingerprint] = useState(false);

  const notify = (msg: string, type: "success" | "error" = "success") => {
    if (onNotify) onNotify(msg, type);
  };

  const sampleFingerprint = "7F:2A:9C:E4:10:8B:53:D9:6A:F1:C3:48:DE:3B:55:01";

  const handleCopyFingerprint = async () => {
    try {
      await navigator.clipboard.writeText(sampleFingerprint);
      setCopiedFingerprint(true);
      notify("Ephemeral Session SHA-256 Fingerprint copied!", "success");
      setTimeout(() => setCopiedFingerprint(false), 2200);
    } catch {
      notify("Failed to copy fingerprint.", "error");
    }
  };

  return (
    <section className="text-left pt-2 sm:pt-6 flex flex-col items-center w-full transition-colors duration-300">
      <div className="w-full max-w-5xl flex flex-col gap-8">
        {/* Top Trust Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-[#34c759] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#1d1d1f] dark:text-white">
                  Zero-Knowledge End-to-End Encryption
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#34c759]/10 text-[#34c759] border border-[#34c759]/20">
                  AUDITED
                </span>
              </div>
              <span className="text-xs text-[#86868b] dark:text-[#a1a1aa]">
                Client-Side WebCrypto AES-GCM-256 • Keys never leave device RAM
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="px-3 py-1.5 rounded-xl bg-[#f5f5f7] dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a] text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center gap-1.5">
              <EyeOff className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>Zero Log Policy</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-[#f5f5f7] dark:bg-[#181a20] border border-[#e5e5ea] dark:border-[#27272a] text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center gap-1.5">
              <DatabaseZap className="w-3.5 h-3.5 text-[#34c759]" />
              <span>0 B Storage</span>
            </span>
          </div>
        </div>

        {/* Hero Title and Summary */}
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0071e3] dark:text-[#38bdf8] uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Enterprise Security &amp; Privacy Tier</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1d1d1f] dark:text-white leading-[1.1]">
            Transfer Sensitive Files With{" "}
            <span className="bg-gradient-to-r from-[#0071e3] via-teal-500 to-[#34c759] bg-clip-text text-transparent">
              Absolute Cryptographic Trust.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#6e6e73] dark:text-[#a1a1aa] font-normal max-w-3xl leading-relaxed">
            Engineered for high-security environments, whistleblowers, and developers. Every payload is encrypted in-browser before leaving your machine; intermediate network nodes only see opaque ciphertext.
          </p>
        </div>

        {/* Dual Pane: Cryptographic Vault & Interactive Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Action Box */}
          <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-xl">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold text-[#86868b] dark:text-[#a1a1aa] uppercase tracking-wider">
                Cryptographic Direct Dispatch
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] dark:text-white">
                Launch Encrypted P2P Vault Room
              </h3>
              <p className="text-xs sm:text-sm text-[#6e6e73] dark:text-[#a1a1aa] leading-relaxed">
                Generates a one-time ephemeral AES-GCM session key pair. Files are transferred directly to connected peers through WebRTC DataChannels and wiped from browser memory upon completion.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/file-share")}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-sm shadow-md shadow-[#0071e3]/25 flex items-center justify-center gap-2 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.03] active:scale-[0.96]"
              >
                <Zap className="w-4 h-4" />
                <span>Initialize Secure Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate("/f")}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#f5f5f7] dark:bg-[#181a20] hover:bg-[#e5e5ea] dark:hover:bg-[#27272a] text-[#1d1d1f] dark:text-white font-semibold text-sm border border-[#e5e5ea] dark:border-[#27272a] flex items-center justify-center gap-2 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.03] active:scale-[0.96]"
              >
                <Key className="w-4 h-4 text-[#34c759]" />
                <span>Enter Room Code</span>
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#e5e5ea] dark:border-[#27272a] text-xs">
              <div className="flex items-center gap-2 text-[#6e6e73] dark:text-[#a1a1aa]">
                <CheckCircle2 className="w-4 h-4 text-[#34c759] flex-shrink-0" />
                <span>No backend decryptability</span>
              </div>
              <div className="flex items-center gap-2 text-[#6e6e73] dark:text-[#a1a1aa]">
                <CheckCircle2 className="w-4 h-4 text-[#34c759] flex-shrink-0" />
                <span>Ephemeral DTLS certificates</span>
              </div>
            </div>
          </div>

          {/* Right Verification Card: Live Fingerprint & Cipher Spec */}
          <div className="lg:col-span-5 rounded-3xl bg-[#0b0c0e] text-white border border-[#27272a] p-6 sm:p-7 flex flex-col justify-between font-mono shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-[#38bdf8]" />
                  <span className="text-xs font-bold text-white">Live Cryptographic Audit</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#34c759] font-bold">
                  VALIDATED
                </span>
              </div>

              {/* Fingerprint Box */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 mb-4">
                <span className="text-[10px] text-zinc-400 block uppercase mb-1">
                  SHA-256 Session Fingerprint
                </span>
                <span className="text-xs text-[#38bdf8] font-bold break-all block">
                  {sampleFingerprint}
                </span>
                <button
                  type="button"
                  onClick={handleCopyFingerprint}
                  className="mt-2 text-[11px] text-zinc-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  {copiedFingerprint ? (
                    <span className="text-[#34c759] font-bold">✓ Copied to clipboard</span>
                  ) : (
                    <span>Copy verification hash</span>
                  )}
                </button>
              </div>

              {/* Cipher Suite Table */}
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Symmetric Cipher:</span>
                  <span className="font-bold text-white">AES-GCM 256-bit</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Key Derivation:</span>
                  <span className="font-bold text-white">PBKDF2 / SHA-256</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Transport Security:</span>
                  <span className="font-bold text-white">DTLS 1.3 / SRTP</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Cloud Memory Cache:</span>
                  <span className="font-bold text-[#34c759]">0 Bytes Retained</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Pure Client-Side WebCrypto API</span>
              <Cpu className="w-4 h-4 text-zinc-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
