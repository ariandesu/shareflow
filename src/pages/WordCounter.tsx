import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Type, Copy, Hash } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

export default function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s+/g, "").length;
    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0).length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
    const lines = text.split("\n").length;
    const readingTime = Math.max(1, Math.ceil(words.length / 220));
    const speakingTime = Math.max(1, Math.ceil(words.length / 130));

    const freq = new Map<string, number>();
    words.forEach(w => {
      const word = w.toLowerCase().replace(/[^a-z0-9']/g, "");
      if (word) freq.set(word, (freq.get(word) || 0) + 1);
    });
    const top = Array.from(freq.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);

    return { words: words.length, chars, charsNoSpaces, sentences, paragraphs, lines, readingTime, speakingTime, top };
  }, [text]);

  const copyStats = async () => {
    const lines = [
      `Words: ${stats.words}`,
      `Characters: ${stats.chars}`,
      `Characters (no spaces): ${stats.charsNoSpaces}`,
      `Sentences: ${stats.sentences}`,
      `Paragraphs: ${stats.paragraphs}`,
      `Lines: ${stats.lines}`,
      `Reading time: ~${stats.readingTime} min`,
      `Speaking time: ~${stats.speakingTime} min`,
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
  };

  const cards: [string, number][] = [
    ["Words", stats.words],
    ["Characters", stats.chars],
    ["No Spaces", stats.charsNoSpaces],
    ["Sentences", stats.sentences],
    ["Paragraphs", stats.paragraphs],
    ["Lines", stats.lines],
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Word Counter</h1>
        <p className="text-white/50 text-sm">Live character, word, sentence and reading-time statistics.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 flex-1 flex flex-col">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {cards.map(([label, value]) => (
            <div key={label} className="bg-white/5 border border-white/10 p-4 text-center">
              <p className="text-3xl font-black">{value.toLocaleString()}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-white/5 border border-white/10 px-4 py-2 flex items-center gap-2">
            <Type className="w-3 h-3 text-white/40" />
            <span className="text-xs font-bold">~{stats.readingTime} min</span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">reading</span>
          </div>
          <div className="bg-white/5 border border-white/10 px-4 py-2 flex items-center gap-2">
            <span className="text-xs font-bold">~{stats.speakingTime} min</span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">speaking</span>
          </div>
          <button onClick={copyStats} className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white underline underline-offset-4 flex items-center gap-1">
            <Copy className="w-3 h-3" /> Copy stats
          </button>
        </div>

        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Start typing or paste your text here…"
          className="flex-1 min-h-[280px] p-4 bg-white/5 border border-white/10 outline-none font-mono text-sm text-white/80 resize-none" />

        {stats.words > 0 && (
          <div className="bg-white/5 border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Hash className="w-4 h-4 text-white/40" />
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Top Keywords</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {stats.top.map(([word, count]) => (
                <span key={word} className="bg-[#0A0A0A] border border-white/10 px-3 py-1.5 text-xs font-mono text-white/70 flex items-center gap-2">
                  {word}
                  <span className="text-white/30">{count}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <SEOContent
        title="Word Counter"
        description="Free online word and character counter. Analyze sentences, paragraphs, reading time and top keywords in real time."
        steps={[
          { title: "Type or paste", description: "Enter any text in the editor." },
          { title: "Read stats live", description: "Words, characters, sentences and time estimates update instantly." },
          { title: "Share", description: "Copy stats or review keyword frequency for SEO and writing." },
        ]}
        faqs={[
          { question: "What counts as a word?", answer: "Any whitespace-separated token counts. Punctuation attached to words is ignored." },
          { question: "How is reading time calculated?", answer: "Using the standard 220 words-per-minute average for reading and 130 wpm for speaking." },
          { question: "Does this upload my text?", answer: "No. Everything runs locally in your browser." },
        ]}
      />
    </div>
  );
}