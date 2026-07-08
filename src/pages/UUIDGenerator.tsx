import React, { useState } from "react";
import { motion } from "motion/react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

export function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>(Array.from({ length: 5 }, () => crypto.randomUUID()));
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateNew = () => {
    setUuids(Array.from({ length: 5 }, () => crypto.randomUUID()));
    setCopiedIndex(null);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">UUID Gen</h1>
        <p className="text-white/50 text-sm">Generate valid version 4 UUIDs instantly.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 p-6 md:p-8 border border-white/10 space-y-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/50">Generated UUIDs</h2>
          <button
            onClick={generateNew}
            className="flex items-center space-x-2 text-white hover:text-white/80 font-black uppercase tracking-widest text-[10px] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Regenerate</span>
          </button>
        </div>

        <div className="space-y-3">
          {uuids.map((uuid, index) => (
            <div 
              key={index} 
              className="group flex items-center justify-between p-4 bg-[#0A0A0A] hover:bg-white/5 border border-white/10 transition-colors"
            >
              <code className="font-mono text-white/80 text-sm sm:text-base break-all pr-4 tracking-widest">
                {uuid}
              </code>
              <button
                onClick={() => copyToClipboard(uuid, index)}
                className="p-3 text-white/50 group-hover:text-white group-hover:bg-white/10 transition-colors flex-shrink-0"
                title="Copy"
              >
                {copiedIndex === index ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    
      <SEOContent 
        title="UUID Generator"
        description="Generate valid version 4 UUIDs instantly. Perfect for database keys and unique identifiers."
        steps={[{"title":"Click Generate","description":"The tool automatically generates a fresh Version 4 UUID upon loading."},{"title":"Generate More","description":"Click the generate button to create as many new unique IDs as you need."},{"title":"Copy","description":"Click the copy icon to copy the UUID to your clipboard."}]}
        faqs={[{"question":"What is a UUID?","answer":"A Universally Unique Identifier (UUID) is a 128-bit number used to identify information in computer systems."},{"question":"What does Version 4 mean?","answer":"Version 4 UUIDs are generated randomly, as opposed to earlier versions that used MAC addresses or time-based generation."},{"question":"Are collisions possible?","answer":"While theoretically possible, the number of random version-4 UUIDs is so vast that a collision is practically impossible."}]}
      />
    </div>
  );
}
