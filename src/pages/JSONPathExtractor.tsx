import { useState } from "react";
import { Search, Copy, Download, Check, Sparkles, Code } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

export default function JSONPathExtractor() {
  const [jsonInput, setJsonInput] = useState(`{
  "store": {
    "book": [
      { "category": "reference", "author": "Nigel Rees", "title": "Sayings of the Century", "price": 8.95 },
      { "category": "fiction", "author": "Evelyn Waugh", "title": "Sword of Honour", "price": 12.99 },
      { "category": "fiction", "author": "Herman Melville", "title": "Moby Dick", "isbn": "0-553-21311-3", "price": 8.99 }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
}`);
  const [query, setQuery] = useState("store.book[0].title");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const evaluatePath = (): string => {
    try {
      if (!jsonInput.trim()) return "";
      const parsed = JSON.parse(jsonInput);
      if (!query.trim()) return JSON.stringify(parsed, null, 2);

      // Simple dot notation & array index evaluator
      const parts = query.replace(/^[\$\.]/, "").split(/\.|\/|\[|\]/).filter(Boolean);
      let current: any = parsed;
      for (const part of parts) {
        if (current === undefined || current === null) break;
        const key = isNaN(Number(part)) ? part : Number(part);
        current = current[key];
      }
      if (current === undefined) return "// Path not found";
      return typeof current === "object" ? JSON.stringify(current, null, 2) : String(current);
    } catch (e: any) {
      return `// Error: ${e.message}`;
    }
  };

  const output = evaluatePath();

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 gap-8">
      <div className="text-center space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest">
          <Search className="w-4 h-4" /> Tool #44 • Developer Utilities
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-slate-950 dark:text-white">
          JSONPath Query & Data Extractor
        </h1>
        <p className="text-sm text-slate-600 dark:text-white/60 font-medium">
          Query, filter, and extract specific values from nested JSON objects using path expressions.
        </p>
      </div>

      <div className="w-full bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-white/10">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-white/70">JSONPath Query:</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. store.book[0].title"
            className="flex-1 px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-xs font-bold font-mono text-slate-950 dark:text-white outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/70">
              JSON Input
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                try {
                  if (e.target.value.trim()) JSON.parse(e.target.value);
                  setError("");
                } catch (err: any) {
                  setError(err.message);
                }
              }}
              rows={16}
              placeholder="Paste JSON here..."
              className="w-full p-4 font-mono text-xs bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-2xl text-slate-950 dark:text-white outline-none focus:border-emerald-500 transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/70">
              <span>Extracted Output</span>
              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Output"}
              </button>
            </div>
            <textarea
              readOnly
              value={output}
              rows={16}
              className="w-full p-4 font-mono text-xs bg-slate-900 text-emerald-400 border border-slate-800 rounded-2xl outline-none resize-none"
            />
          </div>
        </div>
      </div>

      <SEOContent
        title="Free JSONPath Query & Data Extractor Online"
        description="Query and extract nested properties from JSON data payloads online with path expressions."
        steps={[
          { title: "Paste JSON Payload", description: "Paste your JSON response into the left panel." },
          { title: "Enter Path Query", description: "Type your property path expression (e.g., store.book[0].title)." },
          { title: "Copy Extracted Value", description: "Copy the extracted value directly into your code." }
        ]}
      />
    </div>
  );
}
