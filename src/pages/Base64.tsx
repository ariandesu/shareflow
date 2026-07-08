import React, { useState } from "react";
import { motion } from "motion/react";
import { Copy, Check, ArrowRightLeft } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

export function Base64() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  let output = "";
  try {
    if (input) {
      if (mode === "encode") {
        output = btoa(unescape(encodeURIComponent(input)));
        if (error) setError("");
      } else {
        output = decodeURIComponent(escape(atob(input)));
        if (error) setError("");
      }
    }
  } catch (e) {
    if (mode === "decode" && !error) {
      setError("Invalid Base64 string");
    }
  }

  const copyToClipboard = () => {
    if (!output || error) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Base64 Encode/Decode</h1>
        <p className="text-white/50 text-sm">Easily encode or decode Base64 strings.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 p-6 md:p-8 border border-white/10"
      >
        <div className="flex justify-start mb-8">
          <div className="flex space-x-4 border-b border-white/10 w-full pb-4">
            <button
              onClick={() => { setMode("encode"); setError(""); }}
              className={`px-4 py-2 font-black tracking-widest text-sm uppercase transition-all ${
                mode === "encode" ? "text-white border-b-2 border-white" : "text-white/50 hover:text-white"
              }`}
            >
              Encode
            </button>
            <button
              onClick={() => { setMode("decode"); setError(""); }}
              className={`px-4 py-2 font-black tracking-widest text-sm uppercase transition-all ${
                mode === "decode" ? "text-white border-b-2 border-white" : "text-white/50 hover:text-white"
              }`}
            >
              Decode
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-stretch">
          <div className="space-y-2 flex flex-col">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
              {mode === "encode" ? "Text" : "Base64"} Input
            </label>
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
              }}
              placeholder={`Enter ${mode === "encode" ? "text" : "Base64"} here...`}
              className="flex-1 w-full h-64 p-4 bg-[#0A0A0A] border border-white/10 focus:border-white/30 outline-none resize-none font-mono text-sm text-white/80 placeholder:text-white/20"
            />
          </div>

          <div className="hidden md:flex justify-center items-center text-white/20 pt-8">
            <ArrowRightLeft className="w-8 h-8" />
          </div>

          <div className="space-y-2 flex flex-col relative">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
              {mode === "encode" ? "Base64" : "Text"} Output
            </label>
            <div className="relative flex-1">
              <textarea
                readOnly
                value={error ? error : output}
                placeholder="Result will appear here..."
                className={`w-full h-full min-h-[16rem] p-4 bg-[#0A0A0A] border outline-none resize-none font-mono text-sm ${
                  error ? "border-red-400 text-red-400 uppercase tracking-widest" : "border-white/10 text-white/80"
                } placeholder:text-white/20`}
              />
              {output && !error && (
                <button
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 p-2 bg-white text-black hover:bg-white/80 transition-colors"
                  title="Copy"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    
      <SEOContent 
        title="Base64 Encoder / Decoder"
        description="A free online tool to securely encode text to Base64 or decode Base64 strings back to plain text in your browser."
        steps={[{"title":"Choose mode","description":"Select whether you want to encode plain text to Base64 or decode a Base64 string back to text."},{"title":"Input data","description":"Paste or type your text or Base64 string into the input field."},{"title":"Get result","description":"The converted output will appear instantly in the right panel, ready to be copied."}]}
        faqs={[{"question":"What is Base64 encoding?","answer":"Base64 is a way to represent binary data using printable ASCII characters. It is commonly used for embedding images in HTML/CSS and transferring data in URLs."},{"question":"Is my data secure?","answer":"Yes, this tool processes all data locally in your browser. No data is sent to our servers."},{"question":"Can I encode files?","answer":"This specific tool is designed for text encoding. For files, you would need a dedicated file-to-Base64 converter."}]}
      />
    </div>
  );
}
