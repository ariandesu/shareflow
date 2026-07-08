import React, { useState } from "react";
import { motion } from "motion/react";
import { Copy, Check, Send, Search } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

export function TextShare() {
  const [text, setText] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sharedUrl, setSharedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const [retrieveCode, setRetrieveCode] = useState("");
  const [retrievedText, setRetrievedText] = useState("");
  const [retrieveLoading, setRetrieveLoading] = useState(false);
  const [retrieveError, setRetrieveError] = useState("");

  const handleShare = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setError("");
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${baseUrl}/api/text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (res.ok) {
        setCode(data.code);
        setSharedUrl(data.url);
      } else {
        setError(data.error || "Failed to share text");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetrieve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!retrieveCode.trim()) return;
    setRetrieveLoading(true);
    setRetrieveError("");
    setRetrievedText("");
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${baseUrl}/api/text/${retrieveCode.trim()}`);
      const data = await res.json();
      if (res.ok) {
        setRetrievedText(data.text);
      } else {
        setRetrieveError(data.error || "Snippet not found");
      }
    } catch (err) {
      setRetrieveError("An error occurred. Please try again.");
    } finally {
      setRetrieveLoading(false);
    }
  };

  const copyToClipboard = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-left space-y-2">
        <h1 className="text-[28px] sm:text-[40px] leading-none font-bold tracking-tighter uppercase">Text Share</h1>
        <p className="text-white/50 text-sm">Share text instantly without logging in.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        {/* Create Share */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 border border-white/10 p-4 sm:p-6 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-bold uppercase tracking-widest bg-white text-black px-2 py-0.5">Share</span>
            <Send className="w-5 h-5 text-white/50" />
          </div>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here..."
            className="w-full h-48 p-4 bg-[#0A0A0A] border border-white/10 focus:border-white/30 outline-none resize-none font-mono text-sm text-white/80 placeholder:text-white/20 mb-4"
          />
          {error && <p className="text-red-400 text-xs mb-4 uppercase tracking-widest">{error}</p>}
          
          <button
            onClick={handleShare}
            disabled={isLoading || !text.trim()}
            className="w-full py-4 border-2 border-white font-black uppercase text-sm tracking-widest hover:bg-white hover:text-black transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isLoading ? "Sharing..." : "Generate Link"}
          </button>

          {code && (
            <div className="mt-6 p-4 bg-white/10 border border-white/20">
              <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2 font-bold">Success</p>
              <div className="flex items-center space-x-2">
                <code className="flex-1 bg-[#0A0A0A] px-3 py-2 border border-white/10 text-lg font-bold text-white text-center tracking-widest">
                  {code}
                </code>
                <button
                  onClick={() => copyToClipboard(code)}
                  className="p-3 bg-white text-black hover:bg-white/80 transition-colors"
                  title="Copy code"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Retrieve Share */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 border border-white/10 p-4 sm:p-6 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-bold uppercase tracking-widest bg-white/20 text-white px-2 py-0.5">Retrieve</span>
            <Search className="w-5 h-5 text-white/50" />
          </div>
          
          <form onSubmit={handleRetrieve} className="flex flex-col sm:flex-row gap-2 mb-6">
            <input
              type="text"
              value={retrieveCode}
              onChange={(e) => setRetrieveCode(e.target.value)}
              placeholder="Enter Code"
              className="flex-1 p-4 bg-[#0A0A0A] border border-white/10 focus:border-white/30 outline-none text-center font-bold tracking-widest text-lg text-white placeholder:text-white/20 normal-case"
              maxLength={4}
            />
            <button
              type="submit"
              disabled={retrieveLoading || !retrieveCode.trim()}
              className="bg-white text-black px-6 py-4 min-h-[58px] font-black uppercase tracking-widest text-sm hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              Fetch
            </button>
          </form>
          {retrieveError && <p className="text-red-400 text-xs mb-4 uppercase tracking-widest">{retrieveError}</p>}
          
          <div className="flex-1 relative min-h-[12rem]">
             <textarea
              readOnly
              value={retrievedText}
              placeholder="Retrieved text..."
              className="w-full h-full p-4 bg-[#0A0A0A] border border-white/10 outline-none resize-none font-mono text-sm text-white/80 placeholder:text-white/20"
            />
            {retrievedText && (
               <button
                  onClick={() => copyToClipboard(retrievedText)}
                  className="absolute top-2 right-2 p-2 bg-white text-black hover:bg-white/80 transition-colors"
                  title="Copy text"
                >
                  <Copy className="w-4 h-4" />
                </button>
            )}
          </div>
        </motion.div>
      </div>
    
      <SEOContent 
        title="Text Share"
        description="Secure, instant, anonymous text sharing. Create auto-expiring links."
        steps={[{"title":"Write Note","description":"Paste or type the text you want to share securely."},{"title":"Generate Link","description":"Click the button to create a unique shareable URL."},{"title":"Share","description":"Send the link to someone. The text is securely stored until it expires."}]}
        faqs={[{"question":"Is my text encrypted?","answer":"Data is transmitted securely, but standard links are accessible to anyone who has the exact URL."},{"question":"How long is data kept?","answer":"Data may be automatically purged based on the service's expiration policies."},{"question":"Do I need an account?","answer":"No, sharing is completely anonymous and requires no registration."}]}
      />
    </div>
  );
}
