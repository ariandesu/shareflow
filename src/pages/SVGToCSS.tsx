import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Upload, Copy, Check } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

type EncodeMode = "url" | "base64";

export default function SVGToCSS() {
  const [svgCode, setSvgCode] = useState(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/>
  <path d="M12 16v-4M12 8h.01"/>
</svg>`);
  const [encodeMode, setEncodeMode] = useState<EncodeMode>("url");
  const [copiedField, setCopiedField] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSvgCode(reader.result as string);
    reader.readAsText(file);
  };

  const encodedSvg = useMemo(() => {
    try {
      if (encodeMode === "base64") {
        return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgCode)))}`;
      }
      // URL encode (more efficient for SVGs)
      const encoded = svgCode
        .replace(/\s+/g, " ")
        .replace(/"/g, "'")
        .replace(/%/g, "%25")
        .replace(/#/g, "%23")
        .replace(/{/g, "%7B")
        .replace(/}/g, "%7D")
        .replace(/</g, "%3C")
        .replace(/>/g, "%3E");
      return `data:image/svg+xml,${encoded}`;
    } catch {
      return "";
    }
  }, [svgCode, encodeMode]);

  const bgImageCSS = `background-image: url("${encodedSvg}");`;
  const bgShorthandCSS = `background: url("${encodedSvg}") no-repeat center / contain;`;
  const maskCSS = `-webkit-mask-image: url("${encodedSvg}");\nmask-image: url("${encodedSvg}");\n-webkit-mask-size: contain;\nmask-size: contain;\n-webkit-mask-repeat: no-repeat;\nmask-repeat: no-repeat;`;

  const copy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 2000);
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <button onClick={() => copy(text, field)} className="text-white/40 hover:text-white transition-colors flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold">
      {copiedField === field ? <><Check className="w-3 h-3 text-green-400" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">SVG to CSS</h1>
        <p className="text-white/50 text-sm">Convert SVG code to CSS background-image and mask-image — instantly.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Input */}
        <div className="bg-white/5 p-6 border border-white/10 flex flex-col space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">SVG Input</h3>
            <div className="flex flex-wrap gap-2">
              <input type="file" accept=".svg" onChange={handleFileUpload} className="hidden" id="svg-upload" />
              <label htmlFor="svg-upload" className="cursor-pointer flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white">
                <Upload className="w-3 h-3" /> Upload
              </label>
            </div>
          </div>

          <textarea
            value={svgCode}
            onChange={(e) => setSvgCode(e.target.value)}
            placeholder="Paste SVG code here..."
            className="flex-1 min-h-[200px] p-4 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-xs text-white/80 resize-none leading-relaxed"
            spellCheck={false}
          />

          {/* Encode mode toggle */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setEncodeMode("url")} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${encodeMode === "url" ? "bg-white text-black border-white" : "border-white/20 text-white/60"}`}>
              URL Encode
            </button>
            <button onClick={() => setEncodeMode("base64")} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${encodeMode === "base64" ? "bg-white text-black border-white" : "border-white/20 text-white/60"}`}>
              Base64
            </button>
          </div>

          {/* Preview */}
          <div className="bg-[#0A0A0A] border border-white/10 p-8 flex items-center justify-center min-h-[120px]">
            {encodedSvg ? (
              <div className="w-24 h-24" style={{ backgroundImage: `url("${encodedSvg}")`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }} />
            ) : (
              <span className="text-xs text-white/30">Invalid SVG</span>
            )}
          </div>
        </div>

        {/* Output */}
        <div className="bg-white/5 p-6 border border-white/10 flex flex-col space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 pb-4 border-b border-white/10">CSS Output</h3>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50">Background Image</label>
              <CopyButton text={bgImageCSS} field="bg" />
            </div>
            <pre className="p-4 bg-[#0A0A0A] border border-white/10 font-mono text-xs text-white/70 overflow-x-auto whitespace-pre-wrap break-all">{bgImageCSS}</pre>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50">Background Shorthand</label>
              <CopyButton text={bgShorthandCSS} field="short" />
            </div>
            <pre className="p-4 bg-[#0A0A0A] border border-white/10 font-mono text-xs text-white/70 overflow-x-auto whitespace-pre-wrap break-all">{bgShorthandCSS}</pre>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50">Mask Image (for icons)</label>
              <CopyButton text={maskCSS} field="mask" />
            </div>
            <pre className="p-4 bg-[#0A0A0A] border border-white/10 font-mono text-xs text-white/70 overflow-x-auto whitespace-pre-wrap break-all">{maskCSS}</pre>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50">Data URI</label>
              <CopyButton text={encodedSvg} field="uri" />
            </div>
            <pre className="p-4 bg-[#0A0A0A] border border-white/10 font-mono text-[10px] text-white/50 overflow-x-auto max-h-24 whitespace-pre-wrap break-all">{encodedSvg}</pre>
          </div>

          {/* Size comparison */}
          <div className="mt-auto pt-4 border-t border-white/10 flex gap-4">
            <div className="flex-1 p-3 bg-[#0A0A0A] border border-white/10 text-center">
              <p className="text-[10px] text-white/40 uppercase tracking-widest">SVG Size</p>
              <p className="text-sm font-mono">{new Blob([svgCode]).size} B</p>
            </div>
            <div className="flex-1 p-3 bg-[#0A0A0A] border border-white/10 text-center">
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Encoded Size</p>
              <p className="text-sm font-mono">{new Blob([encodedSvg]).size} B</p>
            </div>
          </div>
        </div>
      </motion.div>

      <SEOContent
        title="SVG to CSS Converter"
        description="Convert SVG code to CSS background-image and mask-image data URIs. URL-encode or Base64-encode."
        steps={[
          { title: "Paste SVG", description: "Paste your SVG code or upload an .svg file." },
          { title: "Choose encoding", description: "Select URL encoding (smaller) or Base64 encoding (broader compatibility)." },
          { title: "Copy CSS", description: "Copy the generated CSS code for background-image or mask-image usage." },
        ]}
        faqs={[
          { question: "URL encode vs Base64?", answer: "URL encoding is typically smaller for SVGs. Base64 has broader compatibility but is ~33% larger." },
          { question: "What is mask-image for?", answer: "CSS mask-image lets you use an SVG as a mask, so you can color it with background-color. Perfect for icons." },
          { question: "Why inline SVGs in CSS?", answer: "Inlining SVGs as data URIs eliminates HTTP requests, reduces latency, and keeps icons self-contained in your stylesheet." },
        ]}
      />
    </div>
  );
}
