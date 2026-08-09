import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GitCompareArrows, RefreshCw } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

type Mode = "line" | "char";

function lcsLengths(a: string[], b: string[]) {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp;
}

interface Token {
  type: "same" | "add" | "rem";
  text: string;
}

function diffTokens(a: string[], b: string[]): Token[] {
  const dp = lcsLengths(a, b);
  const out: Token[] = [];
  let i = a.length;
  let j = b.length;
  const stack: Token[] = [];
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      stack.push({ type: "same", text: a[i - 1] });
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      stack.push({ type: "rem", text: a[i - 1] });
      i--;
    } else {
      stack.push({ type: "add", text: b[j - 1] });
      j--;
    }
  }
  while (i > 0) {
    stack.push({ type: "rem", text: a[i - 1] });
    i--;
  }
  while (j > 0) {
    stack.push({ type: "add", text: b[j - 1] });
    j--;
  }
  return stack.reverse();
}

const SAMPLE_A = `const greet = (name) => {\n  return "Hello, " + name;\n};\n\nconsole.log(greet("World"));`;
const SAMPLE_B = `const greet = (name = "friend") => {\n  return "Hi, " + name;\n};\n\nconsole.log(greet());`;

export default function TextDiff() {
  const [left, setLeft] = useState(SAMPLE_A);
  const [right, setRight] = useState(SAMPLE_B);
  const [mode, setMode] = useState<Mode>("line");

  const splitBy = (text: string, m: Mode) => (m === "line" ? text.split("\n") : text.split(""));

  const result = useMemo<Token[]>(() => {
    return diffTokens(splitBy(left, mode), splitBy(right, mode));
  }, [left, right, mode]);

  const additions = result.filter(t => t.type === "add").length;
  const removals = result.filter(t => t.type === "rem").length;

  const renderText = (type: string, text: string, i: number) => {
    const key = `${type}-${i}`;
    if (mode === "line") {
      return (
        <div key={key} className={`px-3 py-0.5 font-mono text-xs whitespace-pre-wrap break-all ${type === "same" ? "text-white/60" : type === "add" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
          {text === "" ? " " : text}
        </div>
      );
    }
    return (
      <span key={key} className={`font-mono text-sm ${type === "same" ? "text-white/60" : type === "add" ? "bg-green-500/40 text-green-100" : "bg-red-500/40 text-red-100"}`}>
        {text}
      </span>
    );
  };

  const renderToken = (type: Token["type"], text: string, i: number) => {
    return renderText(type, text, i);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Text Diff</h1>
        <p className="text-white/50 text-sm">Compare two versions of any text and see exactly what changed.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            {(["line", "char"] as Mode[]).map(m => (
              <button key={m} onClick={() => setMode(m)} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${mode === m ? "bg-white text-black border-white" : "border-white/20 text-white/60"}`}>
                {m === "char" ? "Char Diff" : "Line Diff"}
              </button>
            ))}
          </div>
          <button onClick={() => { setLeft(""); setRight(""); }} className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white underline underline-offset-4 flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Clear
          </button>
        </div>

        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Original (left)</p>
          <textarea value={left} onChange={e => setLeft(e.target.value)} spellCheck={false}
            className="w-full h-40 p-4 bg-white/5 border border-white/10 outline-none font-mono text-xs text-white/80 resize-y" />
        </div>
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Modified (right)</p>
          <textarea value={right} onChange={e => setRight(e.target.value)} spellCheck={false}
            className="w-full h-40 p-4 bg-white/5 border border-white/10 outline-none font-mono text-xs text-white/80 resize-y" />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="bg-white/5 border border-white/10 px-4 py-2 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500/60" />
            <span className="text-xs font-bold text-green-300">+{additions}</span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">additions</span>
          </div>
          <div className="bg-white/5 border border-white/10 px-4 py-2 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500/60" />
            <span className="text-xs font-bold text-red-300">-{removals}</span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">removals</span>
          </div>
        </div>

        <div className="flex-1 bg-[#0A0A0A] border border-white/10 overflow-auto min-h-[200px]">
          <div className="flex items-center gap-2 p-3 border-b border-white/10 sticky top-0 bg-[#0A0A0A]">
            <GitCompareArrows className="w-4 h-4 text-white/40" />
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Diff Result</span>
          </div>
          <div className="py-2">
            {mode === "char" ? <div className="px-3">{result.map((t, i) => renderText(t.type, t.text, i))}</div> : result.map((t, i) => renderToken(t.type, t.text, i))}
          </div>
        </div>
      </motion.div>

      <SEOContent
        title="Text Diff Tool"
        description="Compare text files online and see exactly what changed. Line and character-level diff comparison free in your browser."
        steps={[
          { title: "Paste text", description: "Add your original (left) and modified (right) versions." },
          { title: "Compare", description: "Additions and removals are highlighted instantly." },
          { title: "Analyze", description: "Use the counts to review exactly what changed." },
        ]}
        faqs={[
          { question: "Is there a line limit?", answer: "No. Compare as much text as you like — everything is processed locally." },
          { question: "Does it highlight code?", answer: "Any text works, including code. Character mode is ideal for spotting tiny changes." },
          { question: "Is my text uploaded?", answer: "Never. The comparison runs entirely in your browser." },
        ]}
      />
    </div>
  );
}