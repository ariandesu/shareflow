import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CryptoJS from "crypto-js";
import { Copy, Check } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState({
    MD5: "",
    SHA1: "",
    SHA256: "",
    SHA512: "",
  });
  const [copied, setCopied] = useState("");

  useEffect(() => {
    if (!input) {
      setHashes({ MD5: "", SHA1: "", SHA256: "", SHA512: "" });
      return;
    }
    
    setHashes({
      MD5: CryptoJS.MD5(input).toString(),
      SHA1: CryptoJS.SHA1(input).toString(),
      SHA256: CryptoJS.SHA256(input).toString(),
      SHA512: CryptoJS.SHA512(input).toString(),
    });
  }, [input]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Hash Generator</h1>
        <p className="text-white/50 text-sm">Generate MD5, SHA-1, SHA-256, and SHA-512 hashes.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            className="w-full h-64 p-4 bg-[#0A0A0A] border border-white/10 focus:border-white/30 outline-none resize-none font-mono text-sm text-white/80 placeholder:text-white/20"
          />
        </div>

        <div className="space-y-4">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo} className="space-y-2 relative">
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50">
                {algo}
              </label>
              <div className="relative">
                <input
                  readOnly
                  value={hash}
                  placeholder={input ? "Generating..." : ""}
                  className="w-full p-4 pr-12 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-sm text-white/80"
                />
                {hash && (
                  <button
                    onClick={() => copyToClipboard(hash, algo)}
                    className="absolute top-2 right-2 p-2 bg-white text-black hover:bg-white/80 transition-colors"
                    title="Copy"
                  >
                    {copied === algo ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    
      <SEOContent 
        title="Hash Generator"
        description="Generate cryptographic hashes online. Create MD5, SHA-1, SHA-256, and SHA-512 hashes instantly."
        steps={[{"title":"Input your string","description":"Type or paste the text you want to hash into the main input field."},{"title":"View generated hashes","description":"The tool instantly calculates the MD5, SHA-1, SHA-256, and SHA-512 hashes."},{"title":"Copy to clipboard","description":"Click the copy icon next to your desired hash algorithm to use it elsewhere."}]}
        faqs={[{"question":"What is a hash function?","answer":"A hash function is an algorithm that converts input data of any size into a fixed-size string of characters, typically representing a digital footprint of the data."},{"question":"Is MD5 secure for passwords?","answer":"No, MD5 and SHA-1 are considered cryptographically broken and vulnerable to collision attacks. They should not be used for secure password hashing."},{"question":"Are the hashes generated locally?","answer":"Yes, all hashing happens locally in your browser using JavaScript. No data is transmitted over the network."}]}
      />
    </div>
  );
}
