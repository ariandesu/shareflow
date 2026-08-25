import { useState } from "react";
import { Code2, Copy, Download, Check, ShieldCheck } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

export default function JSONToZod() {
  const [jsonInput, setJsonInput] = useState(`{
  "id": 101,
  "username": "ariandesu",
  "email": "dev@mhr3d.online",
  "age": 25,
  "isActive": true,
  "roles": ["admin", "developer"]
}`);
  const [schemaName, setSchemaName] = useState("userSchema");
  const [exported, setExported] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const jsonToZod = (val: any, indentLevel = 1): string => {
    const indent = "  ".repeat(indentLevel);
    if (val === null) return "z.null()";
    if (typeof val === "string") {
      if (val.includes("@") && val.includes(".")) return "z.string().email()";
      if (val.startsWith("http://") || val.startsWith("https://")) return "z.string().url()";
      return "z.string()";
    }
    if (typeof val === "number") {
      return Number.isInteger(val) ? "z.number().int()" : "z.number()";
    }
    if (typeof val === "boolean") return "z.boolean()";
    if (Array.isArray(val)) {
      if (val.length === 0) return "z.array(z.any())";
      return `z.array(${jsonToZod(val[0], indentLevel)})`;
    }
    if (typeof val === "object") {
      const keys = Object.keys(val);
      if (keys.length === 0) return "z.object({})";
      const fields = keys.map((key) => `${indent}${key}: ${jsonToZod(val[key], indentLevel + 1)}`);
      return `z.object({\n${fields.join(",\n")}\n${"  ".repeat(indentLevel - 1)}})`;
    }
    return "z.any()";
  };

  const getZodOutput = (): string => {
    try {
      if (!jsonInput.trim()) return "";
      const parsed = JSON.parse(jsonInput);
      const prefix = exported ? `export const ${schemaName.trim() || "mySchema"} =` : `const ${schemaName.trim() || "mySchema"} =`;
      const typePrefix = exported ? `export type ${schemaName.trim() ? schemaName.charAt(0).toUpperCase() + schemaName.slice(1) : "MyType"} = z.infer<typeof ${schemaName.trim() || "mySchema"}>;` : "";
      return `import { z } from "zod";\n\n${prefix} ${jsonToZod(parsed, 1)};\n\n${typePrefix}`;
    } catch (e: any) {
      return `// Invalid JSON: ${e.message}`;
    }
  };

  const zodOutput = getZodOutput();

  const handleCopy = () => {
    navigator.clipboard.writeText(zodOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([zodOutput], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${schemaName || "schema"}.ts`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 gap-8">
      <div className="text-center space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" /> Tool #41 • Developer Utilities
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-slate-950 dark:text-white">
          JSON to Zod Schema Converter
        </h1>
        <p className="text-sm text-slate-600 dark:text-white/60 font-medium">
          Instantly convert raw JSON payloads into clean, strictly typed Zod validation schemas with type inference.
        </p>
      </div>

      <div className="w-full bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-white/70">Schema Name:</label>
            <input
              type="text"
              value={schemaName}
              onChange={(e) => setSchemaName(e.target.value)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-xs font-bold text-slate-950 dark:text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/70">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={exported}
                onChange={(e) => setExported(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
              Export Schema & Type
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/70">
              <span>JSON Payload Input</span>
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

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/70">
              <span>Zod Schema Output</span>
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
              value={zodOutput}
              rows={16}
              className="w-full p-4 font-mono text-xs bg-slate-900 text-emerald-400 border border-slate-800 rounded-2xl outline-none resize-none"
            />
          </div>
        </div>
      </div>

      <SEOContent
        title="Free JSON to Zod Schema Converter Online"
        description="Convert raw JSON data payloads into clean, strictly typed Zod validation schemas with automatic TypeScript type inference."
        steps={[
          { title: "Paste JSON Payload", description: "Copy and paste any JSON response from your API into the input area." },
          { title: "Configure Zod Schema Name", description: "Set your schema constant name and toggle type exports." },
          { title: "Copy or Download Zod Code", description: "Click Copy or Download to save your Zod schema into your TypeScript project." }
        ]}
      />
    </div>
  );
}
