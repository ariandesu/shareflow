import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Contrast, RefreshCw } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace("#", "").trim();
  if (/^[0-9a-fA-F]{6}$/.test(clean)) {
    const n = parseInt(clean, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    const n = clean.split("").map(c => parseInt(c + c, 16));
    return [n[0], n[1], n[2]];
  }
  return null;
}

function luminance([r, g, b]: [number, number, number]): number {
  const chan = [r, g, b].map(v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * chan[0] + 0.7152 * chan[1] + 0.0722 * chan[2];
}

function contrastRatio(a: [number, number, number], b: [number, number, number]): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function randomHex(): string {
  const n = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
  return "#" + n;
}

type Level = { label: string; pass: boolean; large: boolean };

export default function ColorContrastChecker() {
  const [fg, setFg] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");

  const fgRgb = useMemo(() => hexToRgb(fg), [fg]);
  const bgRgb = useMemo(() => hexToRgb(bg), [bg]);

  const ratio = fgRgb && bgRgb ? contrastRatio(fgRgb, bgRgb) : 0;

  const levels: Level[] = [
    { label: "AA — Body text", pass: ratio >= 4.5, large: ratio >= 4.5 },
    { label: "AA — Large text", pass: ratio >= 3, large: ratio >= 3 },
    { label: "AAA — Body text", pass: ratio >= 7, large: ratio >= 7 },
    { label: "AAA — Large text", pass: ratio >= 4.5, large: ratio >= 4.5 },
  ];

  const status = (l: Level) => (l.label.includes("Large") ? l.large : l.pass);

  const swap = () => {
    setFg(bg);
    setBg(fg);
  };

  const randomize = () => {
    setFg(randomHex());
    setBg(randomHex());
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Color Contrast Checker</h1>
        <p className="text-white/50 text-sm">Check WCAG contrast ratios between any two colors.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 flex-1 flex flex-col">
        <div className="bg-white/5 border border-white/10 p-6 space-y-5 flex-1 flex flex-col justify-center rounded-none" style={{ background: bg }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: fg }}>Sample Body Text</p>
          <p className="text-lg font-bold" style={{ color: fg }}>
            The quick brown fox jumps over the lazy dog while the five boxing wizards jump quickly.
          </p>
          <p className="text-2xl font-black" style={{ color: fg }}>Large Heading Text</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-white/40 uppercase tracking-widest mb-2 block">Foreground</label>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3">
              <input type="color" value={fg} onChange={e => setFg(e.target.value)} className="w-10 h-10 border-0 bg-transparent cursor-pointer" />
              <input type="text" value={fg} onChange={e => setFg(e.target.value)} spellCheck={false} className="flex-1 bg-transparent outline-none font-mono text-sm text-white uppercase" />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-white/40 uppercase tracking-widest mb-2 block">Background</label>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3">
              <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-10 h-10 border-0 bg-transparent cursor-pointer" />
              <input type="text" value={bg} onChange={e => setBg(e.target.value)} spellCheck={false} className="flex-1 bg-transparent outline-none font-mono text-sm text-white uppercase" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={swap} className="bg-white/10 text-xs font-bold uppercase tracking-widest px-4 py-2 hover:bg-white/20 transition-colors">Swap</button>
          <button onClick={randomize} className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Random
          </button>
        </div>

        {!fgRgb || !bgRgb ? (
          <p className="text-xs text-red-400 font-bold">Enter valid hex colors (e.g. #ffffff).</p>
        ) : (
          <div className="bg-white/5 border border-white/10 p-6 flex items-center gap-6">
            <div className="text-center">
              <p className="text-5xl font-black">{ratio.toFixed(2)}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Contrast ratio</p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-2">
              {levels.map(l => (
                <div key={l.label} className="flex items-center gap-2 bg-[#0A0A0A] border border-white/10 px-3 py-2">
                  <span className={`w-2 h-2 rounded-full ${status(l) ? "bg-green-400" : "bg-red-500"}`} />
                  <span className="text-[10px] text-white/60">{l.label}</span>
                  <span className="ml-auto text-[10px] font-bold text-white/40">{status(l) ? "PASS" : "FAIL"}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <SEOContent
        title="Color Contrast Checker"
        description="Free WCAG contrast checker — calculate the contrast ratio between foreground and background colors and see AA/AAA compliance."
        steps={[
          { title: "Pick colors", description: "Choose a foreground and background color with the pickers or hex inputs." },
          { title: "See the ratio", description: "The WCAG contrast ratio is calculated instantly." },
          { title: "Check compliance", description: "AA and AAA pass/fail results are shown for body and large text." },
        ]}
        faqs={[
          { question: "What contrast ratio should I aim for?", answer: "For body text, WCAG AA requires 4.5:1. Large text (18pt+ or 14pt bold) requires 3:1. AAA is stricter at 7:1 and 4.5:1." },
          { question: "What formats are supported?", answer: "6-digit and 3-digit hex colors, e.g. #ffffff or #fff." },
          { question: "Do calculations run locally?", answer: "Yes — the WCAG luminance math runs entirely in your browser." },
        ]}
      />
    </div>
  );
}