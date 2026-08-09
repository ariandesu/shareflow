import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, RefreshCw, Copy, Check } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EpochConverter() {
  const [timestamp, setTimestamp] = useState(() => String(Math.floor(Date.now() / 1000)));
  const [dateInput, setDateInput] = useState(() => toLocalInput(new Date()));
  const [now, setNow] = useState(() => Date.now());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const { sec, ms } = useMemo(() => {
    const num = Number(timestamp.trim());
    if (isNaN(num) || timestamp.trim() === "") return { sec: "-", ms: "-" };
    const isMs = num > 9999999999;
    return { sec: String(Math.floor(isMs ? num / 1000 : num)), ms: String(num) };
  }, [timestamp]);

  const handleTimestamp = (val: string) => {
    setTimestamp(val);
    const num = Number(val.trim());
    if (!Number.isNaN(num) && val.trim()) {
      const isMs = num > 9999999999;
      const d = new Date(isMs ? num : num * 1000);
      if (!Number.isNaN(d.getTime())) setDateInput(toLocalInput(d));
    }
  };

  const handleDate = (val: string) => {
    setDateInput(val);
    const d = new Date(val);
    if (!Number.isNaN(d.getTime())) setTimestamp(String(Math.floor(d.getTime() / 1000)));
  };

  const setCurrent = () => {
    const s = Math.floor(Date.now() / 1000);
    setTimestamp(String(s));
    setDateInput(toLocalInput(new Date()));
  };

  const copySec = async () => {
    await navigator.clipboard.writeText(sec);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const utcDisplay = useMemo(() => {
    const num = Number(timestamp.trim());
    if (Number.isNaN(num) || timestamp.trim() === "") return "—";
    const isMs = num > 9999999999;
    const d = new Date(isMs ? num : num * 1000);
    return Number.isNaN(d.getTime()) ? "Invalid date" : d.toISOString().slice(0, 19).replace("T", " ") + " UTC";
  }, [timestamp]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Epoch Converter</h1>
        <p className="text-white/50 text-sm">Convert Unix timestamps to human-readable dates and back — live.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 flex-1 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50">Unix Timestamp</label>
              <button onClick={setCurrent} className="text-[10px] font-bold text-white/50 hover:text-white flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Now
              </button>
            </div>
            <input type="text" value={timestamp} onChange={e => handleTimestamp(e.target.value)} spellCheck={false}
              className="w-full p-3 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-lg text-white" />
            <div className="grid grid-cols-2 gap-3">
              <button onClick={copySec} className="bg-white text-black text-xs font-black uppercase tracking-widest py-3 flex items-center justify-center gap-2 hover:bg-white/80 transition-colors">
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copied ? "Copied" : "Copy Sec"}
              </button>
              <div className="bg-[#0A0A0A] border border-white/10 flex items-center justify-center font-mono text-xs text-white/60">ms: {ms}</div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Local Date &amp; Time</label>
            <input type="datetime-local" value={dateInput} onChange={e => handleDate(e.target.value)}
              className="w-full p-3 bg-[#0A0A0A] border border-white/15 outline-none font-mono text-white" />
            <div className="bg-[#0A0A0A] border border-white/10 p-3">
              <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">UTC</p>
              <p className="font-mono text-sm text-white/80">{utcDisplay}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-white/40" />
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Current epoch</p>
              <p className="font-mono text-lg font-bold">{Math.floor(now / 1000)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Now (local)</p>
            <p className="font-mono text-sm text-white/60">{new Date(now).toLocaleTimeString()}</p>
          </div>
        </div>
      </motion.div>

      <SEOContent
        title="Epoch Timestamp Converter"
        description="Convert Unix epoch timestamps (seconds or milliseconds) to human-readable dates live in your browser. Free online epoch converter."
        steps={[
          { title: "Enter timestamp", description: "Paste a Unix timestamp in seconds or milliseconds." },
          { title: "Or pick a date", description: "Use the date picker to get the equivalent timestamp." },
          { title: "Copy", description: "Copy the generated value for code or other tools." },
        ]}
        faqs={[
          { question: "Seconds or milliseconds?", answer: "10-digit values are seconds; 13-digit values are milliseconds, detected automatically." },
          { question: "Is this affected by timezones?", answer: "The timestamp is an absolute instant. Only the readable display converts to your local timezone, plus a UTC reference." },
          { question: "Is my data shared?", answer: "No. All conversion runs locally in your browser." },
        ]}
      />
    </div>
  );
}