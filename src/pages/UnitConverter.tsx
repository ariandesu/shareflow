import React, { useState } from "react";
import { motion } from "framer-motion";
import { SEOContent } from "../components/SEOContent";

export default function UnitConverter() {
  const [baseSize, setBaseSize] = useState(16);
  const [pxValue, setPxValue] = useState<string>("16");
  const [remValue, setRemValue] = useState<string>("1");
  
  // Bytes Converter
  const [bytes, setBytes] = useState<string>("1024");
  const [kb, setKb] = useState<string>("1");
  const [mb, setMb] = useState<string>("0.0009765625");

  const handlePxChange = (val: string) => {
    setPxValue(val);
    const px = parseFloat(val);
    if (!isNaN(px)) {
      setRemValue((px / baseSize).toString());
    } else {
      setRemValue("");
    }
  };

  const handleRemChange = (val: string) => {
    setRemValue(val);
    const rem = parseFloat(val);
    if (!isNaN(rem)) {
      setPxValue((rem * baseSize).toString());
    } else {
      setPxValue("");
    }
  };

  const handleBytesChange = (val: string) => {
    setBytes(val);
    const b = parseFloat(val);
    if (!isNaN(b)) {
      setKb((b / 1024).toString());
      setMb((b / (1024 * 1024)).toString());
    } else {
      setKb(""); setMb("");
    }
  };

  const handleKbChange = (val: string) => {
    setKb(val);
    const k = parseFloat(val);
    if (!isNaN(k)) {
      setBytes((k * 1024).toString());
      setMb((k / 1024).toString());
    } else {
      setBytes(""); setMb("");
    }
  };

  const handleMbChange = (val: string) => {
    setMb(val);
    const m = parseFloat(val);
    if (!isNaN(m)) {
      setBytes((m * 1024 * 1024).toString());
      setKb((m * 1024).toString());
    } else {
      setBytes(""); setKb("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Unit Converter</h1>
        <p className="text-white/50 text-sm">Convert CSS length units and data sizes.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="space-y-6">
          <h2 className="text-lg font-bold tracking-widest uppercase border-b border-white/10 pb-4">CSS Length (px / rem)</h2>
          <div className="bg-white/5 p-6 border border-white/10 space-y-6">
            <div className="space-y-2 max-w-xs">
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Base Font Size (px)</label>
              <input
                type="number"
                value={baseSize}
                onChange={(e) => {
                  const newBase = Number(e.target.value);
                  setBaseSize(newBase);
                  const px = parseFloat(pxValue);
                  if (!isNaN(px) && newBase > 0) {
                    setRemValue((px / newBase).toString());
                  }
                }}
                className="w-full p-3 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-sm text-white/80"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Pixels (px)</label>
                <input
                  type="number"
                  value={pxValue}
                  onChange={(e) => handlePxChange(e.target.value)}
                  className="w-full p-4 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-sm text-white/80"
                />
              </div>
              <div className="hidden md:block text-white/30 text-2xl font-black mt-6">=</div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Rem (rem)</label>
                <input
                  type="number"
                  value={remValue}
                  onChange={(e) => handleRemChange(e.target.value)}
                  className="w-full p-4 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-sm text-white/80"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-bold tracking-widest uppercase border-b border-white/10 pb-4">Data Size</h2>
          <div className="bg-white/5 p-6 border border-white/10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Bytes</label>
                <input
                  type="number"
                  value={bytes}
                  onChange={(e) => handleBytesChange(e.target.value)}
                  className="w-full p-4 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-sm text-white/80"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Kilobytes (KB)</label>
                <input
                  type="number"
                  value={kb}
                  onChange={(e) => handleKbChange(e.target.value)}
                  className="w-full p-4 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-sm text-white/80"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Megabytes (MB)</label>
                <input
                  type="number"
                  value={mb}
                  onChange={(e) => handleMbChange(e.target.value)}
                  className="w-full p-4 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-sm text-white/80"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    
      <SEOContent 
        title="Unit Converter"
        description="Instantly convert between CSS units like Pixels and Rems, or data sizes like Bytes, KB, and MB."
        steps={[{"title":"Set base font size","description":"Enter your root HTML font size (typically 16px) for accurate rem calculations."},{"title":"Convert CSS values","description":"Type a value in either pixels (px) or rems to see the equivalent conversion instantly."},{"title":"Convert data sizes","description":"Use the data size section to convert between Bytes, Kilobytes, and Megabytes."}]}
        faqs={[{"question":"Why use rem over px?","answer":"Using 'rem' (root em) improves accessibility by allowing elements to scale relative to the user's browser font size preferences."},{"question":"What is the standard base font size?","answer":"Most browsers default to a base font size of 16px."},{"question":"Is 1 KB equal to 1000 or 1024 bytes?","answer":"In computer memory contexts (binary), 1 Kilobyte (KB) is traditionally 1024 bytes. This tool uses the binary (1024) standard for conversions."}]}
      />
    </div>
  );
}
