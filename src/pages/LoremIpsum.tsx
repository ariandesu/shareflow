import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, RefreshCw, FileText } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");

const SENTENCES = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
];

function randWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function makeParagraph(): string {
  const sentenceCount = 5 + Math.floor(Math.random() * 4);
  let paragraph = "";
  for (let i = 0; i < sentenceCount; i++) {
    const base = SENTENCES[i % SENTENCES.length];
    const injected = randWord();
    let sentence: string;
    if (Math.random() < 0.6) {
      sentence = base;
    } else {
      const words = base.replace(/\.$/, "").split(" ");
      const idx = 2 + Math.floor(Math.random() * Math.max(1, words.length - 3));
      words.splice(idx, 0, injected);
      sentence = words.join(" ").replace(/,\s*$/, "") + ".";
    }
    paragraph += (paragraph ? " " : "") + sentence;
  }
  return paragraph;
}

function generate(mode: "words" | "sentences" | "paragraphs", count: number): string {
  const out: string[] = [];
  if (mode === "words") {
    for (let i = 0; i < count; i++) out.push(randWord());
    return out.join(" ");
  }
  if (mode === "sentences") {
    for (let i = 0; i < count; i++) out.push(SENTENCES[i % SENTENCES.length]);
    return out.join(" ");
  }
  for (let p = 0; p < count; p++) out.push(makeParagraph());
  return out.join("\n\n");
}

export default function LoremIpsum() {
  const [mode, setMode] = useState<"words" | "sentences" | "paragraphs">("paragraphs");
  const [count, setCount] = useState(3);
  const [seed, setSeed] = useState(0);
  const [copied, setCopied] = useState(false);

  const text = useMemo(() => generate(mode, count), [mode, count, seed]);

  const copyAll = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const wordCount = useMemo(() => text.split(/\s+/).filter(Boolean).length, [text]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Lorem Ipsum</h1>
        <p className="text-white/50 text-sm">Generate placeholder text for mockups, prototypes and layout testing.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            {(["words", "sentences", "paragraphs"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${mode === m ? "bg-white text-black border-white" : "border-white/20 text-white/60"}`}>
                {m}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest">
            Count
            <input type="number" min={1} max={100} value={count} onChange={e => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              className="w-16 p-2 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-xs text-white" />
          </label>
          <button onClick={() => setSeed(s => s + 1)} className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Regenerate
          </button>
          <button onClick={copyAll} className="ml-auto text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white flex items-center gap-1">
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 px-4 py-2 flex items-center gap-2 w-fit">
          <FileText className="w-3 h-3 text-white/40" />
          <span className="text-xs font-bold">{wordCount} words</span>
        </div>

        <textarea readOnly value={text} spellCheck={false}
          className="flex-1 min-h-[360px] p-6 bg-[#0A0A0A] border border-white/10 outline-none text-sm leading-relaxed text-white/70 resize-none" />
      </motion.div>

      <SEOContent
        title="Lorem Ipsum Generator"
        description="Free lorem ipsum text generator — create placeholder words, sentences or paragraphs instantly for designs and mockups."
        steps={[
          { title: "Pick a unit", description: "Generate by words, sentences or paragraphs." },
          { title: "Set the count", description: "Choose how much text you need." },
          { title: "Copy", description: "Copy the placeholder text into your project." },
        ]}
        faqs={[
          { question: "What is lorem ipsum?", answer: "Scrambled Latin placeholder text historically used as a stand-in for real content in layouts." },
          { question: "Can I control the length?", answer: "Yes — switch between words, sentences and paragraphs and set an exact count." },
          { question: "Do you generate real words?", answer: "It's pseudo-random scrambled Latin from the classic lorem ipsum passage, so it looks like natural text." },
        ]}
      />
    </div>
  );
}