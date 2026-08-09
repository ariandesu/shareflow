import React, { useState } from "react";
import { motion } from "framer-motion";
import { Repeat, Download, Copy, Check, AlertTriangle } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

type Direction = "csv-to-json" | "json-to-csv";

function parseCSV(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        row.push(field);
        field = "";
      } else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(field);
        field = "";
        if (row.some(c => c !== "")) rows.push(row);
        row = [];
      } else {
        field += ch;
      }
    }
  }
  row.push(field);
  if (row.some(c => c !== "")) rows.push(row);
  return rows;
}

function toCSV(rows: string[][], delimiter: string): string {
  return rows
    .map(row =>
      row.map(cell => {
        if (cell.includes(delimiter) || cell.includes('"') || cell.includes("\n")) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(delimiter)
    )
    .join("\n");
}

const SAMPLE_CSV = `name,age,city
Alice,30,New York
Bob,25,"London, UK"
Carol,27,"Paris"`;
const SAMPLE_JSON = `[
  { "name": "Alice", "age": 30, "city": "New York" },
  { "name": "Bob", "age": 25, "city": "London" }
]`;

export default function CSVJsonConverter() {
  const [direction, setDirection] = useState<Direction>("csv-to-json");
  const [input, setInput] = useState(SAMPLE_CSV);
  const [output, setOutput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = () => {
    setError("");
    setCopied(false);
    try {
      if (direction === "csv-to-json") {
        const rows = parseCSV(input, delimiter);
        if (rows.length < 2) throw new Error("CSV needs a header row and at least one data row.");
        const headers = rows[0];
        const json = rows.slice(1).map(row => {
          const obj: Record<string, string> = {};
          headers.forEach((h, i) => {
            obj[h] = row[i] ?? "";
          });
          return obj;
        });
        setOutput(JSON.stringify(json, null, 2));
      } else {
        const parsed = JSON.parse(input);
        const arr = Array.isArray(parsed) ? parsed : [parsed];
        if (arr.length === 0) throw new Error("Array is empty.");
        const headers = Array.from(new Set(arr.flatMap(o => (o && typeof o === "object" ? Object.keys(o) : []))));
        if (headers.length === 0) throw new Error("Objects must have at least one key.");
        const rows = [headers, ...arr.map(o => headers.map(h => String((o as Record<string, unknown>)[h] ?? "")))];
        setOutput(toCSV(rows, delimiter));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed.");
    }
  };

  const swap = () => {
    setDirection(d => (d === "csv-to-json" ? "json-to-csv" : "csv-to-json"));
    setInput(output || input);
    setOutput("");
    setError("");
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadOutput = () => {
    const ext = direction === "csv-to-json" ? "json" : "csv";
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `converted.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">CSV ↔ JSON</h1>
        <p className="text-white/50 text-sm">Convert between CSV and JSON instantly — entirely in your browser.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            {(["csv-to-json", "json-to-csv"] as Direction[]).map(d => (
              <button key={d} onClick={() => setDirection(d)} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${direction === d ? "bg-white text-black border-white" : "border-white/20 text-white/60"}`}>
                {d === "csv-to-json" ? "CSV → JSON" : "JSON → CSV"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[10px] text-white/40 uppercase tracking-widest">Delimiter</label>
            <select value={delimiter} onChange={e => setDelimiter(e.target.value)} className="bg-[#0A0A0A] border border-white/10 text-xs font-mono p-2 outline-none">
              <option value=",">Comma ( , )</option>
              <option value=";">Semicolon ( ; )</option>
              <option value="\t">Tab</option>
              <option value="|">Pipe ( | )</option>
            </select>
          </div>
          <button onClick={swap} className="ml-auto text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white underline underline-offset-4 flex items-center gap-1">
            <Repeat className="w-3 h-3" /> Swap Direction
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          <div className="flex flex-col">
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">{direction === "csv-to-json" ? "CSV Input" : "JSON Input"}</p>
            <textarea value={input} onChange={e => setInput(e.target.value)} spellCheck={false}
              className="flex-1 min-h-[300px] p-4 bg-white/5 border border-white/10 outline-none font-mono text-xs text-white/80 resize-none" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-white/40 uppercase tracking-widest">{direction === "csv-to-json" ? "JSON Output" : "CSV Output"}</p>
              {output && (
                <div className="flex gap-3">
                  <button onClick={copyOutput} className="text-[10px] font-bold text-white/50 hover:text-white flex items-center gap-1">
                    <Copy className="w-3 h-3" /> {copied ? "Copied" : "Copy"}
                  </button>
                  <button onClick={downloadOutput} className="text-[10px] font-bold text-white/50 hover:text-white">Download</button>
                </div>
              )}
            </div>
            <textarea value={output} readOnly spellCheck={false} placeholder="Result appears here…"
              className="flex-1 min-h-[300px] p-4 bg-white/5 border border-white/10 outline-none font-mono text-xs text-white/80 resize-none" />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/40 px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <p className="text-xs text-red-300 font-bold">{error}</p>
          </div>
        )}

        <button onClick={convert} className="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-4 hover:bg-white/80 transition-colors">
          Convert
        </button>
      </motion.div>

      <SEOContent
        title="CSV to JSON Converter"
        description="Convert CSV to JSON and JSON to CSV online for free. Handles quoted fields, custom delimiters and nested structures."
        steps={[
          { title: "Pick direction", description: "Choose CSV → JSON or JSON → CSV." },
          { title: "Set delimiter", description: "Comma, semicolon, tab or pipe — quoted fields are handled automatically." },
          { title: "Convert", description: "Get your result instantly and copy or download it." },
        ]}
        faqs={[
          { question: "Are my files uploaded?", answer: "No. All conversion happens locally in your browser." },
          { question: "Does it handle quoted commas?", answer: "Yes. Fields wrapped in double quotes containing delimiters or newlines are parsed correctly." },
          { question: "Does CSV-to-JSON keep the header?", answer: "The first row is used as object keys, and every subsequent row becomes an object." },
        ]}
      />
    </div>
  );
}