import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Upload, Search, ArrowUpDown, Copy, Check } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

export default function CSVViewer() {
  const [rawText, setRawText] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [delimiter, setDelimiter] = useState(",");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [copied, setCopied] = useState(false);
  const [inputMode, setInputMode] = useState<"upload" | "paste">("upload");

  const parseCSV = (text: string, delim: string) => {
    const lines: string[][] = [];
    let current: string[] = [];
    let field = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const next = text[i + 1];

      if (inQuotes) {
        if (ch === '"' && next === '"') {
          field += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          field += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === delim) {
          current.push(field.trim());
          field = "";
        } else if (ch === "\n" || (ch === "\r" && next === "\n")) {
          current.push(field.trim());
          field = "";
          if (current.some(c => c !== "")) lines.push(current);
          current = [];
          if (ch === "\r") i++;
        } else {
          field += ch;
        }
      }
    }
    // Last field/line
    current.push(field.trim());
    if (current.some(c => c !== "")) lines.push(current);

    return lines;
  };

  const loadCSV = (text: string) => {
    setRawText(text);
    // Auto-detect delimiter
    const firstLine = text.split("\n")[0] || "";
    let detectedDelim = delimiter;
    if (firstLine.includes("\t") && !firstLine.includes(",")) detectedDelim = "\t";
    else if (firstLine.includes(";") && !firstLine.includes(",")) detectedDelim = ";";
    setDelimiter(detectedDelim);

    const parsed = parseCSV(text, detectedDelim);
    if (parsed.length > 0) {
      setHeaders(parsed[0]);
      setRows(parsed.slice(1));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => loadCSV(reader.result as string);
    reader.readAsText(file);
  };

  const handlePaste = () => {
    loadCSV(rawText);
  };

  const reparseWithDelimiter = (d: string) => {
    setDelimiter(d);
    const parsed = parseCSV(rawText, d);
    if (parsed.length > 0) {
      setHeaders(parsed[0]);
      setRows(parsed.slice(1));
    }
  };

  // Filter and sort
  const processedRows = useMemo(() => {
    let filtered = rows;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = rows.filter(row => row.some(cell => cell.toLowerCase().includes(q)));
    }
    if (sortCol !== null) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortCol] || "";
        const bVal = b[sortCol] || "";
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortDir === "asc" ? aNum - bNum : bNum - aNum;
        }
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }
    return filtered;
  }, [rows, searchQuery, sortCol, sortDir]);

  const handleSort = (col: number) => {
    if (sortCol === col) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const exportJSON = () => {
    const data = processedRows.map(row => {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h] = row[i] || ""; });
      return obj;
    });
    const json = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">CSV Viewer</h1>
        <p className="text-white/50 text-sm">View, sort, and filter CSV data — entirely in your browser.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 flex-1 flex flex-col">
        {headers.length === 0 ? (
          <div className="space-y-6 flex-1 flex flex-col">
            <div className="flex gap-2">
              <button onClick={() => setInputMode("upload")} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${inputMode === "upload" ? "bg-white text-black border-white" : "border-white/20 text-white/60"}`}>Upload File</button>
              <button onClick={() => setInputMode("paste")} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${inputMode === "paste" ? "bg-white text-black border-white" : "border-white/20 text-white/60"}`}>Paste CSV</button>
            </div>

            {inputMode === "upload" ? (
              <div className="flex-1 border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center p-12 transition-colors hover:border-white/40">
                <input type="file" accept=".csv,.tsv,.txt" onChange={handleFileUpload} className="hidden" id="csv-upload" />
                <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center space-y-4">
                  <div className="p-4 bg-[#0A0A0A] rounded-full border border-white/10">
                    <Upload className="w-8 h-8 text-white/50" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold uppercase tracking-widest text-white/80">Upload a CSV file</p>
                    <p className="text-xs text-white/40 mt-1">CSV, TSV, or text files</p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="flex-1 flex flex-col space-y-4">
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste CSV data here..."
                  className="flex-1 min-h-[200px] p-4 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-xs text-white/80 resize-none"
                  spellCheck={false}
                />
                <button onClick={handlePaste} disabled={!rawText.trim()} className="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-4 hover:bg-white/80 transition-colors disabled:opacity-50">
                  Parse CSV
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 flex-1 flex flex-col">
            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-center bg-white/5 p-4 border border-white/10">
              <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-[#0A0A0A] border border-white/10 px-3">
                <Search className="w-4 h-4 text-white/30" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="flex-1 p-2 bg-transparent outline-none text-sm text-white/80" />
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Delimiter:</span>
                {[",", ";", "\t"].map(d => (
                  <button key={d} onClick={() => reparseWithDelimiter(d)} className={`px-3 py-1 text-xs font-bold border transition-colors ${delimiter === d ? "bg-white text-black border-white" : "border-white/20 text-white/60"}`}>
                    {d === "\t" ? "TAB" : d}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-white/30 font-mono">{processedRows.length} rows · {headers.length} cols</span>
              <button onClick={exportJSON} className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white">
                {copied ? <><Check className="w-3 h-3 text-green-400" /> Copied JSON</> : <><Copy className="w-3 h-3" /> Export JSON</>}
              </button>
              <button onClick={() => { setHeaders([]); setRows([]); setRawText(""); setSearchQuery(""); setSortCol(null); }} className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white underline underline-offset-4">
                Clear
              </button>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto border border-white/10">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-[#111] z-10">
                  <tr>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white/30 border-b border-white/10 w-12">#</th>
                    {headers.map((h, i) => (
                      <th key={i} onClick={() => handleSort(i)} className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white/50 border-b border-white/10 cursor-pointer hover:text-white transition-colors whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          {h}
                          {sortCol === i && <ArrowUpDown className="w-3 h-3" />}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {processedRows.slice(0, 500).map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-2 text-[10px] text-white/20 font-mono border-b border-white/5">{rowIndex + 1}</td>
                      {headers.map((_, colIndex) => (
                        <td key={colIndex} className="px-4 py-2 text-xs text-white/70 border-b border-white/5 font-mono max-w-[300px] truncate">
                          {row[colIndex] || ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {processedRows.length > 500 && (
                <div className="p-4 text-center text-xs text-white/30">Showing first 500 of {processedRows.length} rows</div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      <SEOContent
        title="CSV Viewer"
        description="Upload or paste CSV data to view it as a sortable, filterable table. Export to JSON."
        steps={[
          { title: "Load data", description: "Upload a CSV file or paste CSV text directly." },
          { title: "Explore", description: "Search, sort by column, and browse your data in a clean table." },
          { title: "Export", description: "Copy your data as JSON to the clipboard." },
        ]}
        faqs={[
          { question: "What delimiters are supported?", answer: "Comma, semicolon, and tab delimiters are supported. The tool auto-detects the delimiter." },
          { question: "How many rows can it handle?", answer: "The viewer can parse large files but displays the first 500 rows for performance. All rows are included in search and export." },
          { question: "Is my data uploaded?", answer: "No. All parsing and viewing happens entirely in your browser. Your data never leaves your device." },
        ]}
      />
    </div>
  );
}
