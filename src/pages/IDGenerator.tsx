import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Copy, Check, Fingerprint } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

type IdType = "uuid" | "ulid" | "cuid" | "nanoid";

const ID_TYPES: { id: IdType; label: string; hint: string }[] = [
  { id: "uuid", label: "UUID v4", hint: "128-bit random identifier" },
  { id: "ulid", label: "ULID", hint: "Sortable, 26-char Crockford base32" },
  { id: "cuid", label: "CUID", hint: "Collision-resistant, URL-safe" },
  { id: "nanoid", label: "Nano ID", hint: "Tiny, URL-friendly" },
];

function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function ulid(): string {
  const time = Date.now();
  let s = "";
  for (let i = 9; i >= 0; i--) s = CROCKFORD[(time / Math.pow(32, i)) % 32 | 0] + s;
  for (let i = 0; i < 16; i++) s += CROCKFORD[Math.floor(Math.random() * 32)];
  return s;
}

function cuid(): string {
  const timestamp = Date.now().toString(36);
  const counter = Math.floor(Math.random() * 1e6).toString(36);
  const randomPart = Array.from({ length: 4 }, () => Math.floor(Math.random() * 36).toString(36)).join("");
  return `c${timestamp}${counter}${randomPart}`;
}

const NANO_ALPHABET = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

function nanoid(size = 21): string {
  let id = "";
  for (let i = 0; i < size; i++) id += NANO_ALPHABET[Math.floor(Math.random() * NANO_ALPHABET.length)];
  return id;
}

export default function IDGenerator() {
  const [type, setType] = useState<IdType>("uuid");
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  const ids = useMemo(() => {
    const gen = type === "uuid" ? uuid : type === "ulid" ? ulid : type === "cuid" ? cuid : nanoid;
    return Array.from({ length: count }, () => gen());
  }, [type, count, seed]);

  const copy = async (id: string) => {
    await navigator.clipboard.writeText(id);
    setCopied(id);
    setTimeout(() => setCopied(null), 1200);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(ids.join("\n"));
    setCopied("__all__");
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">ID Generator</h1>
        <p className="text-white/50 text-sm">Generate UUIDs, ULIDs, CUIDs and Nano IDs in bulk.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2">
          {ID_TYPES.map(t => (
            <button key={t.id} onClick={() => setType(t.id)} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${type === t.id ? "bg-white text-black border-white" : "border-white/20 text-white/60"}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[10px] text-white/40 uppercase tracking-widest">
          <span>{ID_TYPES.find(t => t.id === type)?.hint}</span>
          <label className="flex items-center gap-2">
            Count
            <input type="number" min={1} max={50} value={count} onChange={e => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))} className="w-16 p-2 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-xs text-white" />
          </label>
          <button onClick={() => setSeed(s => s + 1)} className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Regenerate
          </button>
          <button onClick={copyAll} className="ml-auto text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white flex items-center gap-1">
            {copied === "__all__" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copied === "__all__" ? "Copied" : "Copy all"}
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 flex-1 overflow-y-auto divide-y divide-white/5">
          {ids.map(id => (
            <div key={id} className="flex items-center gap-3 px-4 py-2.5">
              <Fingerprint className="w-4 h-4 text-white/30 flex-shrink-0" />
              <code className="flex-1 font-mono text-sm text-white/80 break-all">{id}</code>
              <button onClick={() => copy(id)} className="text-white/40 hover:text-white transition-colors flex-shrink-0" aria-label="Copy">
                {copied === id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      <SEOContent
        title="UUID / ULID / CUID Generator"
        description="Free online ID generator for UUID v4, ULID, CUID and Nano ID identifiers. Generate in bulk right in your browser."
        steps={[
          { title: "Pick a format", description: "UUID v4, ULID, CUID or Nano ID." },
          { title: "Choose a count", description: "Generate up to 50 at once." },
          { title: "Copy", description: "Copy individual IDs or all of them." },
        ]}
        faqs={[
          { question: "What is the difference between the formats?", answer: "UUID v4 is the standard 36-char format. ULIDs are 26 chars and timestamp-sortable. CUIDs are collision-resistant and URL-safe, and Nano IDs are the smallest." },
          { question: "Are these cryptographically secure?", answer: "They use the browser's Math.random. For security-critical keys prefer a cryptographically secure generator." },
          { question: "Is anything uploaded?", answer: "No. All IDs are generated locally in your browser." },
        ]}
      />
    </div>
  );
}