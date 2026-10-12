/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  Sparkles,
  Layers,
  Terminal,
  Focus,
  Network,
  ShieldCheck,
  Sun,
  Moon,
  Check
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export type HeroVariantId = "variant1" | "variant2" | "variant3" | "variant4" | "variant5";

export interface HeroVariantMeta {
  id: HeroVariantId;
  label: string;
  shortTag: string;
  subtitle: string;
  icon: typeof Sparkles;
}

export const HERO_VARIANTS: HeroVariantMeta[] = [
  {
    id: "variant1",
    label: "1. Cupertino Dynamic Island",
    shortTag: "Apple Glass",
    subtitle: "Dynamic status capsule, 3D WebRTC visualizer, and simulated transfer HUD.",
    icon: Sparkles
  },
  {
    id: "variant2",
    label: "2. Cyberpunk Terminal",
    shortTag: "Hacker / Matrix",
    subtitle: "High-tech CLI stream ticker, peer code connect box, and packet diagnostics.",
    icon: Terminal
  },
  {
    id: "variant3",
    label: "3. Minimal Dual Pod",
    shortTag: "Minimalist Focus",
    subtitle: "Bold typography with centered in-place tabbed dropzone & 4-digit code entry.",
    icon: Focus
  },
  {
    id: "variant4",
    label: "4. Orbital Network",
    shortTag: "Mesh & Dock",
    subtitle: "Interactive peer-to-peer node mesh visualizer and floating quick-tools dock.",
    icon: Network
  },
  {
    id: "variant5",
    label: "5. Enterprise Vault",
    shortTag: "Zero-Knowledge",
    subtitle: "Security-first fintech layout with live SHA-256 fingerprint & cipher audit.",
    icon: ShieldCheck
  }
];

interface HeroSwitcherProps {
  currentVariant: HeroVariantId;
  onChangeVariant: (id: HeroVariantId) => void;
}

export function HeroSwitcher({ currentVariant, onChangeVariant }: HeroSwitcherProps) {
  const { theme, toggleTheme } = useTheme();
  const activeMeta = HERO_VARIANTS.find((v) => v.id === currentVariant) || HERO_VARIANTS[0];

  return (
    <div className="w-full max-w-5xl mx-auto mb-4 sm:mb-8 transition-all">
      {/* Container Card */}
      <div className="p-3 sm:p-4 rounded-3xl bg-white/95 dark:bg-[#12141a]/95 backdrop-blur-xl border border-[#e5e5ea] dark:border-[#27272a] shadow-lg flex flex-col gap-3">
        {/* Top Control Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-1 sm:px-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0071e3] to-[#34c759] flex items-center justify-center text-white shadow-xs transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 hover:rotate-6 cursor-pointer">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#1d1d1f] dark:text-white flex items-center gap-1.5">
                Hero Section Design Studio
                <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-[#0071e3]/10 dark:bg-[#0071e3]/20 text-[#0071e3] dark:text-[#38bdf8]">
                  5 Designs
                </span>
              </span>
              <p className="text-[11px] text-[#86868b] dark:text-[#a1a1aa] hidden sm:block">
                Select any design below to preview. Seamlessly test light &amp; dark mode demos.
              </p>
            </div>
          </div>

          {/* Dark Mode Demo Switch */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f5f5f7] dark:bg-[#181a20] hover:bg-[#e5e5ea] dark:hover:bg-[#27272a] border border-[#e5e5ea] dark:border-[#27272a] text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] shadow-xs cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-95"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dark Mode Active</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#6e6e73]" />
                  <span>Light Mode Active</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 5 Hero Design Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {HERO_VARIANTS.map((v) => {
            const Icon = v.icon;
            const isSelected = v.id === currentVariant;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onChangeVariant(v.id)}
                className={`group flex flex-col items-start gap-1 p-2.5 sm:p-3 rounded-2xl border text-left cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.03] active:scale-[0.96] ${
                  isSelected
                    ? "bg-[#0071e3] text-white border-[#0071e3] shadow-md shadow-[#0071e3]/25 scale-[1.02] ring-2 ring-[#0071e3]/30"
                    : "bg-[#fbfbfd] dark:bg-[#181a20] text-[#1d1d1f] dark:text-[#f5f5f7] border-[#e5e5ea] dark:border-[#27272a] hover:border-[#0071e3]/50 hover:bg-white dark:hover:bg-[#1f222a]"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 ${
                    isSelected ? "bg-white/20 text-white" : "bg-[#f5f5f7] dark:bg-[#27272a] text-[#0071e3] dark:text-[#38bdf8]"
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-white text-[#0071e3] flex items-center justify-center text-[10px] animate-in zoom-in-50 duration-200">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold leading-tight mt-1 truncate w-full">
                  {v.label}
                </span>
                <span className={`text-[10px] font-semibold transition-colors duration-200 ${
                  isSelected ? "text-white/80" : "text-[#86868b] dark:text-[#a1a1aa]"
                }`}>
                  {v.shortTag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Variant Description Bar */}
        <div className="px-3 py-2 rounded-xl bg-[#f5f5f7] dark:bg-[#181a20] text-[11px] text-[#6e6e73] dark:text-[#a1a1aa] flex items-center justify-between">
          <span className="truncate">
            <strong className="text-[#1d1d1f] dark:text-white mr-1.5">{activeMeta.label}:</strong>
            {activeMeta.subtitle}
          </span>
          <span className="text-[10px] font-mono font-bold text-[#0071e3] dark:text-[#38bdf8] flex-shrink-0 ml-2">
            PREVIEW LIVE
          </span>
        </div>
      </div>
    </div>
  );
}
