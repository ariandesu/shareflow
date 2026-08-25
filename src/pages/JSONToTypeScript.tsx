import { useState } from "react";
import { Code2, Copy, Download, Check, Sparkles } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

export default function JSONToTypeScript() {
  const [jsonInput, setJsonInput] = useState(`{
  "id": 101,
  "name": "ShareFlow Platform",
  "isProduction": true,
  "metrics": {
    "impressions": 184,
    "revenue": 0.002
  },
  "tags": ["webrtc", "fastapi", "react"]
}`);
  const [interfaceName, setInterfaceName] = useState("ShareFlowData");
  const [exportKeyword, setExportKeyword] = useState(true);
  const [optionalProps, setOptionalProps] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const generateType = (val: any, indentLevel = 1): string => {
    const indent = "  ".repeat(indentLevel);
    if (val === null) return "any";
    if (Array.isArray(val)) {
      if (val.length === 0) return "any[]";
      const itemType = generateType(val[0], indentLevel);
      return `${itemType}[]`;
    }
    if (typeof val === "object") {
      const keys = Object.keys(val);
      if (keys.length === 0) return "Record<string, any>";
      const lines = keys.map((key) => {
        const opt = optionalProps ? "?" : "";
        return `${indent}${key}${opt}: ${generateType(val[key], indentLevel + 1)};`;
      });
      return `{\n${lines.join("\n")}\n${"  ".repeat(indentLevel - 1)}}`;
    }
    return typeof val;
  };

  const getTsOutput = (): string => {
    try {
      if (!jsonInput.trim()) return "";
      const parsed = JSON.parse(jsonInput);
      const prefix = exportKeyword ? "export interface" : "interface";
      const body = generateType(parsed, 1);
      return `${prefix} ${interfaceName.trim() || "RootObject"} ${body}`;
    } catch (e: any) {
      return `// Invalid JSON: ${e.message}`;
    }
  };

  const tsOutput = getTsOutput();

  const handleCopy = () => {
    navigator.clipboard.writeText(tsOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([tsOutput], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${interfaceName || "types"}.ts`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 gap-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest">
          <Code2 className="w-4 h-4" /> Tool #40 • Developer Utilities
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-slate-950 dark:text-white">
          JSON to TypeScript Converter
        </h1>
        <p className="text-sm text-slate-600 dark:text-white/60 font-medium">
          Instantly convert raw JSON payloads into clean, strictly typed TypeScript interfaces.
        </p>
      </div>

      {/* Main Options & Code Panel */}
      <div className="w-full bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-white/70">Interface Name:</label>
            <input
              type="text"
              value={interfaceName}
              onChange={(e) => setInterfaceName(e.target.value)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-xs font-bold text-slate-950 dark:text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/70">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={exportKeyword}
                onChange={(e) => setExportKeyword(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
              Export Keyword
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={optionalProps}
                onChange={(e) => setOptionalProps(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
              Optional Properties (?)
            </label>
          </div>
        </div>

        {/* Editor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* JSON Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/70">
              <span>JSON Input</span>
              {error && <span className="text-red-500">{error}</span>}
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
              placeholder="Paste JSON payload here..."
              className="w-full p-4 font-mono text-xs bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-2xl text-slate-950 dark:text-white outline-none focus:border-emerald-500 transition-colors resize-none"
            />
          </div>

          {/* TypeScript Output */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/70">
              <span>TypeScript Output</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1 bg-slate-950 text-white dark:bg-white/10 hover:bg-emerald-600 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> .ts
                </button>
              </div>
            </div>
            <textarea
              readOnly
              value={tsOutput}
              rows={16}
              className="w-full p-4 font-mono text-xs bg-slate-900 text-emerald-400 border border-slate-800 rounded-2xl outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <SEOContent
        title="Free JSON to TypeScript Interface Converter Online"
        description="Convert raw JSON data payloads into clean, type-safe TypeScript interfaces instantly in your browser."
        steps={[
          { title: "Paste JSON Payload", description: "Copy and paste any JSON response from your API into the JSON input panel." },
          { title: "Configure Interface Options", description: "Set your interface name and toggle export keywords or optional properties." },
          { title: "Copy or Download TypeScript File", description: "Click Copy or Download to save your generated .ts interface file directly." }
        ]}
      />
    </div>
  );
}
