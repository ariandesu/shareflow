import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Play, Pause } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

interface Keyframe {
  offset: number; // 0-100
  properties: Record<string, string>;
}

const PRESETS: Record<string, { keyframes: Keyframe[]; properties: Record<string, string> }> = {
  fade: {
    keyframes: [
      { offset: 0, properties: { opacity: "0" } },
      { offset: 100, properties: { opacity: "1" } },
    ],
    properties: { duration: "0.5s", easing: "ease-in-out" },
  },
  slideUp: {
    keyframes: [
      { offset: 0, properties: { transform: "translateY(20px)", opacity: "0" } },
      { offset: 100, properties: { transform: "translateY(0)", opacity: "1" } },
    ],
    properties: { duration: "0.6s", easing: "ease-out" },
  },
  slideDown: {
    keyframes: [
      { offset: 0, properties: { transform: "translateY(-20px)", opacity: "0" } },
      { offset: 100, properties: { transform: "translateY(0)", opacity: "1" } },
    ],
    properties: { duration: "0.6s", easing: "ease-out" },
  },
  bounce: {
    keyframes: [
      { offset: 0, properties: { transform: "translateY(0)" } },
      { offset: 20, properties: { transform: "translateY(0)" } },
      { offset: 40, properties: { transform: "translateY(-30px)" } },
      { offset: 50, properties: { transform: "translateY(0)" } },
      { offset: 60, properties: { transform: "translateY(-15px)" } },
      { offset: 80, properties: { transform: "translateY(0)" } },
      { offset: 100, properties: { transform: "translateY(0)" } },
    ],
    properties: { duration: "1s", easing: "ease" },
  },
  rotate: {
    keyframes: [
      { offset: 0, properties: { transform: "rotate(0deg)" } },
      { offset: 100, properties: { transform: "rotate(360deg)" } },
    ],
    properties: { duration: "1s", easing: "linear" },
  },
  pulse: {
    keyframes: [
      { offset: 0, properties: { transform: "scale(1)" } },
      { offset: 50, properties: { transform: "scale(1.05)" } },
      { offset: 100, properties: { transform: "scale(1)" } },
    ],
    properties: { duration: "2s", easing: "ease-in-out" },
  },
  shake: {
    keyframes: [
      { offset: 0, properties: { transform: "translateX(0)" } },
      { offset: 10, properties: { transform: "translateX(-10px)" } },
      { offset: 20, properties: { transform: "translateX(10px)" } },
      { offset: 30, properties: { transform: "translateX(-10px)" } },
      { offset: 40, properties: { transform: "translateX(10px)" } },
      { offset: 50, properties: { transform: "translateX(-5px)" } },
      { offset: 60, properties: { transform: "translateX(5px)" } },
      { offset: 70, properties: { transform: "translateX(-2px)" } },
      { offset: 80, properties: { transform: "translateX(2px)" } },
      { offset: 100, properties: { transform: "translateX(0)" } },
    ],
    properties: { duration: "0.8s", easing: "ease" },
  },
  flip: {
    keyframes: [
      { offset: 0, properties: { transform: "perspective(400px) rotateY(0)" } },
      { offset: 40, properties: { transform: "perspective(400px) rotateY(170deg)" } },
      { offset: 50, properties: { transform: "perspective(400px) rotateY(190deg)" } },
      { offset: 80, properties: { transform: "perspective(400px) rotateY(360deg)" } },
      { offset: 100, properties: { transform: "perspective(400px) rotateY(360deg)" } },
    ],
    properties: { duration: "1s", easing: "ease-in-out" },
  },
};

export default function CSSAnimationGenerator() {
  const [preset, setPreset] = useState("bounce");
  const [duration, setDuration] = useState("1s");
  const [delay, setDelay] = useState("0s");
  const [easing, setEasing] = useState("ease");
  const [iterations, setIterations] = useState("infinite");
  const [direction, setDirection] = useState("normal");
  const [fillMode, setFillMode] = useState("none");
  const [animName, setAnimName] = useState("myAnimation");
  const [isPlaying, setIsPlaying] = useState(true);
  const [copiedField, setCopiedField] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = PRESETS[preset];
    if (p?.properties) {
      setDuration(p.properties.duration || "1s");
      setEasing(p.properties.easing || "ease");
    }
  }, [preset]);

  const keyframes = PRESETS[preset]?.keyframes || PRESETS.bounce.keyframes;

  const keyframesCSS = useMemo(() => {
    let css = `@keyframes ${animName} {\n`;
    keyframes.forEach(kf => {
      css += `  ${kf.offset}% {\n`;
      Object.entries(kf.properties).forEach(([prop, val]) => {
        css += `    ${prop}: ${val};\n`;
      });
      css += `  }\n`;
    });
    css += `}`;
    return css;
  }, [keyframes, animName]);

  const animationCSS = `animation: ${animName} ${duration} ${easing} ${delay} ${iterations} ${direction} ${fillMode};`;
  const fullCSS = `${keyframesCSS}\n\n.animated-element {\n  ${animationCSS}\n}`;

  const copy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 2000);
  };

  const CopyBtn = ({ text, field }: { text: string; field: string }) => (
    <button onClick={() => copy(text, field)} className="text-white/40 hover:text-white transition-colors flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold">
      {copiedField === field ? <><Check className="w-3 h-3 text-green-400" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}
    </button>
  );

  // Generate inline style for preview
  const previewStyle = useMemo(() => {
    const style: React.CSSProperties = {};
    if (isPlaying) {
      style.animation = `${preset}-preview ${duration} ${easing} ${delay} ${iterations} ${direction} ${fillMode}`;
    }
    return style;
  }, [preset, duration, easing, delay, iterations, direction, fillMode, isPlaying]);

  // Inject keyframes as a style tag
  const styleTag = useMemo(() => {
    let css = `@keyframes ${preset}-preview {\n`;
    keyframes.forEach(kf => {
      css += `${kf.offset}% { ${Object.entries(kf.properties).map(([p, v]) => `${p}: ${v}`).join("; ")}; }\n`;
    });
    css += `}`;
    return css;
  }, [keyframes, preset]);

  const easings = ["linear", "ease", "ease-in", "ease-out", "ease-in-out", "cubic-bezier(0.4, 0, 0.2, 1)"];
  const directions = ["normal", "reverse", "alternate", "alternate-reverse"];
  const fillModes = ["none", "forwards", "backwards", "both"];

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <style>{styleTag}</style>

      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">CSS Animation</h1>
        <p className="text-white/50 text-sm">Generate CSS keyframe animations with live preview.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-1">
        {/* Controls */}
        <div className="bg-white/5 p-6 border border-white/10 flex flex-col space-y-6 overflow-y-auto">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 pb-4 border-b border-white/10">Settings</h3>

          {/* Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Preset</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.keys(PRESETS).map(p => (
                <button key={p} onClick={() => setPreset(p)} className={`py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${preset === p ? "bg-white text-black border-white" : "border-white/20 text-white/60 hover:border-white/40"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Animation name */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Name</label>
            <input type="text" value={animName} onChange={(e) => setAnimName(e.target.value.replace(/\s/g, "-"))} className="w-full p-3 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-sm text-white/80" />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Duration</label>
            <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full p-3 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-sm text-white/80" placeholder="1s" />
          </div>

          {/* Delay */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Delay</label>
            <input type="text" value={delay} onChange={(e) => setDelay(e.target.value)} className="w-full p-3 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-sm text-white/80" placeholder="0s" />
          </div>

          {/* Easing */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Easing</label>
            <select value={easing} onChange={(e) => setEasing(e.target.value)} className="w-full p-3 bg-[#0A0A0A] border border-white/10 outline-none text-sm text-white/80">
              {easings.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          {/* Iterations */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Iterations</label>
            <input type="text" value={iterations} onChange={(e) => setIterations(e.target.value)} className="w-full p-3 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-sm text-white/80" placeholder="infinite" />
          </div>

          {/* Direction */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Direction</label>
            <select value={direction} onChange={(e) => setDirection(e.target.value)} className="w-full p-3 bg-[#0A0A0A] border border-white/10 outline-none text-sm text-white/80">
              {directions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Fill Mode */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Fill Mode</label>
            <select value={fillMode} onChange={(e) => setFillMode(e.target.value)} className="w-full p-3 bg-[#0A0A0A] border border-white/10 outline-none text-sm text-white/80">
              {fillModes.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        {/* Preview & Output */}
        <div className="lg:col-span-2 flex flex-col space-y-8">
          {/* Preview */}
          <div className="bg-[#0A0A0A] border border-white/10 p-8 flex flex-col items-center justify-center min-h-[250px] relative">
            <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Preview</span>
            <button onClick={() => setIsPlaying(!isPlaying)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <div ref={previewRef} style={previewStyle} className="w-24 h-24 bg-white rounded-lg" />
          </div>

          {/* Code output */}
          <div className="bg-white/5 p-6 border border-white/10 flex flex-col space-y-6 flex-1">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Generated CSS</h3>
              <CopyBtn text={fullCSS} field="full" />
            </div>
            <pre className="p-4 bg-[#0A0A0A] border border-white/10 font-mono text-xs text-white/70 overflow-auto flex-1 whitespace-pre-wrap">{fullCSS}</pre>
          </div>
        </div>
      </motion.div>

      <SEOContent
        title="CSS Animation Generator"
        description="Create custom CSS keyframe animations with a visual editor. Choose presets or customize every property."
        steps={[
          { title: "Choose a preset", description: "Start with a preset animation like bounce, fade, shake, or flip." },
          { title: "Customize", description: "Adjust duration, easing, delay, iterations, direction, and fill mode." },
          { title: "Copy CSS", description: "Copy the generated @keyframes and animation CSS to use in your project." },
        ]}
        faqs={[
          { question: "Can I customize the keyframes?", answer: "Currently, keyframes are preset-based. Choose the closest preset and modify the generated CSS code directly." },
          { question: "What is fill-mode?", answer: "'forwards' keeps the final keyframe state after completion. 'backwards' applies the first keyframe during delay. 'both' does both." },
          { question: "What does 'alternate' direction do?", answer: "The animation plays forward, then backward, then forward — creating a smooth yo-yo effect." },
        ]}
      />
    </div>
  );
}
