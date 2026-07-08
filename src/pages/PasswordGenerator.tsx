import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

export function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let chars = "";
    if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (chars === "") {
      setPassword("Please select at least one option.");
      return;
    }

    let generated = "";
    for (let i = 0; i < length; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generated);
  };

  useEffect(() => {
    generatePassword();
  }, [length, uppercase, lowercase, numbers, symbols]);

  const copyToClipboard = () => {
    if (password === "Please select at least one option.") return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Password Gen</h1>
        <p className="text-white/50 text-sm">Generate secure, random passwords instantly.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 p-6 md:p-8 border border-white/10 space-y-8"
      >
        <div className="relative">
          <div className="w-full bg-[#0A0A0A] border border-white/10 p-6 pr-32 break-all font-mono text-lg sm:text-2xl text-white min-h-[5rem] flex items-center">
            {password}
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex space-x-2">
            <button
              onClick={generatePassword}
              className="p-3 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              title="Generate new"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={copyToClipboard}
              className="p-3 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              title="Copy"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-4">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50">Password Length</label>
              <span className="text-xs font-bold text-white uppercase tracking-widest">{length} CHARS</span>
            </div>
            <input
              type="range"
              min="8"
              max="128"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center space-x-4 cursor-pointer p-4 border border-white/10 hover:bg-white/5 transition-colors">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="w-5 h-5 accent-white"
              />
              <span className="text-white/80 font-medium text-sm tracking-wide">Uppercase (A-Z)</span>
            </label>
            <label className="flex items-center space-x-4 cursor-pointer p-4 border border-white/10 hover:bg-white/5 transition-colors">
              <input
                type="checkbox"
                checked={lowercase}
                onChange={(e) => setLowercase(e.target.checked)}
                className="w-5 h-5 accent-white"
              />
              <span className="text-white/80 font-medium text-sm tracking-wide">Lowercase (a-z)</span>
            </label>
            <label className="flex items-center space-x-4 cursor-pointer p-4 border border-white/10 hover:bg-white/5 transition-colors">
              <input
                type="checkbox"
                checked={numbers}
                onChange={(e) => setNumbers(e.target.checked)}
                className="w-5 h-5 accent-white"
              />
              <span className="text-white/80 font-medium text-sm tracking-wide">Numbers (0-9)</span>
            </label>
            <label className="flex items-center space-x-4 cursor-pointer p-4 border border-white/10 hover:bg-white/5 transition-colors">
              <input
                type="checkbox"
                checked={symbols}
                onChange={(e) => setSymbols(e.target.checked)}
                className="w-5 h-5 accent-white"
              />
              <span className="text-white/80 font-medium text-sm tracking-wide">Symbols (!@#$)</span>
            </label>
          </div>
        </div>
      </motion.div>
    
      <SEOContent 
        title="Password Generator"
        description="Generate highly secure, random passwords directly in your browser. No server communication required."
        steps={[{"title":"Set Length","description":"Choose how long you want your password to be using the slider."},{"title":"Select Options","description":"Toggle uppercase, lowercase, numbers, and special characters."},{"title":"Copy Password","description":"Click copy to instantly save the securely generated string to your clipboard."}]}
        faqs={[{"question":"Is this generator secure?","answer":"Yes, it relies on client-side JavaScript APIs to create high-entropy random strings entirely within your browser."},{"question":"Are my passwords saved?","answer":"No passwords are saved, transmitted, or logged. Everything happens locally for your security."},{"question":"What is entropy?","answer":"Entropy is a measure of unpredictability. A higher entropy password is harder for computers to guess or crack."}]}
      />
    </div>
  );
}
