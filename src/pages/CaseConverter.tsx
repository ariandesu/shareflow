import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, TextCursorInput } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

type CaseType = "camel" | "pascal" | "snake" | "kebab" | "upper" | "lower" | "title" | "sentence" | "capitalize";

const CASES: { id: CaseType; label: string }[] = [
  { id: "camel", label: "camelCase" },
  { id: "pascal", label: "PascalCase" },
  { id: "snake", label: "snake_case" },
  { id: "kebab", label: "kebab-case" },
  { id: "upper", label: "UPPER CASE" },
  { id: "lower", label: "lower case" },
  { id: "title", label: "Title Case" },
  { id: "sentence", label: "Sentence case" },
  { id: "capitalize", label: "Capitalized" },
];

function toWords(input: string): string[] {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

function convert(input: string, type: CaseType): string {
  const words = toWords(input);
  switch (type) {
    case "camel":
      return words.map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())).join("");
    case "pascal":
      return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
    case "snake":
      return words.join("_").toLowerCase();
    case "kebab":
      return words.join("-").toLowerCase();
    case "upper":
      return input.toUpperCase();
    case "lower":
      return input.toLowerCase();
    case "title":
      return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    case "sentence": {
      const lower = input.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
    case "capitalize":
      return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
  }
}

export default function CaseConverter() {
  const [input, setInput] = useState("hello world, this is shareflow!");
  const [copied, setCopied] = useState<CaseType | null>(null);

  const outputs = useMemo(() => {
    const map = new Map<CaseType, string>();
    CASES.forEach(c => map.set(c.id, convert(input, c.id)));
    return map;
  }, [input]);

  const copy = async (type: CaseType) => {
    await navigator.clipboard.writeText(outputs.get(type) || "");
    setCopied(type);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Case Converter</h1>
        <p className="text-white/50 text-sm">Convert text between camelCase, snake_case, kebab-case and more — instantly.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 flex-1 flex flex-col">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TextCursorInput className="w-4 h-4 text-white/40" />
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Input text</p>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)} spellCheck={false}
            className="w-full h-32 p-4 bg-white/5 border border-white/10 outline-none font-mono text-sm text-white/80 resize-none" />
        </div>

        <div className="space-y-3 flex-1">
          {CASES.map(c => {
            const value = outputs.get(c.id) || "";
            const isCopied = copied === c.id;
            return (
              <div key={c.id} className="bg-white/5 border border-white/10 flex items-stretch">
                <div className="w-36 sm:w-44 flex-shrink-0 border-r border-white/10 px-4 py-3 flex flex-col justify-center">
                  <span className="text-xs font-bold">{c.label}</span>
                </div>
                <code className="flex-1 px-4 py-3 text-sm font-mono text-white/80 break-all self-center">{value}</code>
                <button onClick={() => copy(c.id)} className="px-4 flex-shrink-0 border-l border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-colors" aria-label={`Copy ${c.label}`}>
                  {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[10px] text-white/40 uppercase tracking-widest">{input.length} characters · {toWords(input).length} words</p>
          <button onClick={() => setInput("")} className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white underline underline-offset-4">Clear</button>
        </div>
      </motion.div>

      <SEOContent
        title="Case Converter"
        description="Free online case converter — camelCase, PascalCase, snake_case, kebab-case, title case, uppercase and more, instantly."
        steps={[
          { title: "Type or paste", description: "Enter the text you want to convert." },
          { title: "Pick a case", description: "See every format transfer live as you type." },
          { title: "Copy", description: "Click the copy icon to grab any conversion." },
        ]}
        faqs={[
          { question: "Which cases are supported?", answer: "camelCase, PascalCase, snake_case, kebab-case, UPPERCASE, lowercase, Title Case, Sentence case and Capitalized." },
          { question: "Can it convert existing camelCase input?", answer: "Yes. Mixed-case input is split intelligently before converting to any other format." },
          { question: "Does anything get uploaded?", answer: "No. Conversion happens entirely in your browser." },
        ]}
      />
    </div>
  );
}