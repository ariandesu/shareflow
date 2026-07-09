import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Download, Scissors, FileText } from "lucide-react";
import { SEOContent } from "../components/SEOContent";
import { PDFDocument } from "pdf-lib";

export default function PDFSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [rangeInput, setRangeInput] = useState("");
  const [splitMode, setSplitMode] = useState<"select" | "every">("select");
  const [everyN, setEveryN] = useState(1);
  const [splitUrls, setSplitUrls] = useState<{ name: string; url: string; pages: number }[]>([]);
  const [isSplitting, setIsSplitting] = useState(false);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    try {
      const bytes = await selected.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const count = pdf.getPageCount();
      setFile(selected);
      setPdfBytes(bytes);
      setPageCount(count);
      setSelectedPages(new Set());
      setSplitUrls([]);
      setRangeInput(`1-${count}`);
    } catch {
      console.error("Failed to load PDF");
    }
  };

  const togglePage = (page: number) => {
    setSelectedPages(prev => {
      const next = new Set(prev);
      if (next.has(page)) next.delete(page);
      else next.add(page);
      return next;
    });
  };

  const selectAll = () => {
    const all = new Set<number>();
    for (let i = 1; i <= pageCount; i++) all.add(i);
    setSelectedPages(all);
  };

  const selectNone = () => setSelectedPages(new Set());

  const applyRange = () => {
    const pages = new Set<number>();
    rangeInput.split(",").forEach(part => {
      const trimmed = part.trim();
      const rangeMatch = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);
      if (rangeMatch) {
        const start = Math.max(1, parseInt(rangeMatch[1]));
        const end = Math.min(pageCount, parseInt(rangeMatch[2]));
        for (let i = start; i <= end; i++) pages.add(i);
      } else {
        const num = parseInt(trimmed);
        if (num >= 1 && num <= pageCount) pages.add(num);
      }
    });
    setSelectedPages(pages);
  };

  const splitPDF = async () => {
    if (!pdfBytes) return;
    setIsSplitting(true);
    setSplitUrls([]);

    try {
      if (splitMode === "select") {
        const sorted = Array.from(selectedPages).sort((a, b) => a - b);
        if (sorted.length === 0) { setIsSplitting(false); return; }
        const srcDoc = await PDFDocument.load(pdfBytes);
        const newDoc = await PDFDocument.create();
        const indices = sorted.map(p => p - 1);
        const copiedPages = await newDoc.copyPages(srcDoc, indices);
        copiedPages.forEach(page => newDoc.addPage(page));
        const bytes = await newDoc.save();
        const blob = new Blob([bytes], { type: "application/pdf" });
        setSplitUrls([{
          name: `extracted-pages-${sorted.join(",")}.pdf`,
          url: URL.createObjectURL(blob),
          pages: sorted.length,
        }]);
      } else {
        const srcDoc = await PDFDocument.load(pdfBytes);
        const total = srcDoc.getPageCount();
        const results: { name: string; url: string; pages: number }[] = [];
        for (let start = 0; start < total; start += everyN) {
          const end = Math.min(start + everyN, total);
          const newDoc = await PDFDocument.create();
          const indices = Array.from({ length: end - start }, (_, i) => start + i);
          const copiedPages = await newDoc.copyPages(srcDoc, indices);
          copiedPages.forEach(page => newDoc.addPage(page));
          const bytes = await newDoc.save();
          const blob = new Blob([bytes], { type: "application/pdf" });
          results.push({
            name: `split-pages-${start + 1}-to-${end}.pdf`,
            url: URL.createObjectURL(blob),
            pages: end - start,
          });
        }
        setSplitUrls(results);
      }
    } catch (err) {
      console.error("Split failed:", err);
    }
    setIsSplitting(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">PDF Splitter</h1>
        <p className="text-white/50 text-sm">Extract or split pages from a PDF — entirely in your browser.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 flex-1 flex flex-col">
        {!file ? (
          <div className="flex-1 border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center p-12 transition-colors hover:border-white/40">
            <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" id="pdf-split-upload" />
            <label htmlFor="pdf-split-upload" className="cursor-pointer flex flex-col items-center space-y-4">
              <div className="p-4 bg-[#0A0A0A] rounded-full border border-white/10">
                <Upload className="w-8 h-8 text-white/50" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-white/80">Upload a PDF to split</p>
                <p className="text-xs text-white/40 mt-1">Select a PDF file to extract or split pages</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
            <div className="lg:col-span-2 bg-white/5 p-6 border border-white/10 flex flex-col space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">{file.name}</h3>
                  <p className="text-[10px] text-white/30 mt-1">{pageCount} pages</p>
                </div>
                <button onClick={() => { setFile(null); setPdfBytes(null); setSelectedPages(new Set()); setSplitUrls([]); }} className="text-xs font-bold uppercase tracking-widest text-white hover:text-white/80 underline underline-offset-4">
                  Change File
                </button>
              </div>

              {/* Split mode toggle */}
              <div className="flex gap-2">
                <button onClick={() => setSplitMode("select")} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${splitMode === "select" ? "bg-white text-black border-white" : "border-white/20 text-white/60"}`}>
                  Select Pages
                </button>
                <button onClick={() => setSplitMode("every")} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${splitMode === "every" ? "bg-white text-black border-white" : "border-white/20 text-white/60"}`}>
                  Split Every N
                </button>
              </div>

              {splitMode === "select" ? (
                <>
                  {/* Range input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={rangeInput}
                      onChange={(e) => setRangeInput(e.target.value)}
                      placeholder="e.g. 1-3, 5, 7-10"
                      className="flex-1 p-3 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-sm text-white/80"
                    />
                    <button onClick={applyRange} className="px-4 py-2 bg-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-colors">Apply</button>
                  </div>

                  {/* Page grid */}
                  <div className="flex gap-2 mb-2">
                    <button onClick={selectAll} className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white underline underline-offset-4">All</button>
                    <button onClick={selectNone} className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white underline underline-offset-4">None</button>
                    <span className="text-[10px] text-white/30 ml-auto">{selectedPages.size} selected</span>
                  </div>
                  <div className="grid grid-cols-8 sm:grid-cols-10 gap-2 overflow-y-auto max-h-60">
                    {Array.from({ length: pageCount }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => togglePage(page)}
                        className={`aspect-square border text-xs font-bold flex items-center justify-center transition-colors ${selectedPages.has(page) ? "bg-white text-black border-white" : "border-white/20 text-white/50 hover:border-white/40"}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Split every N pages</label>
                  <input
                    type="number"
                    min={1}
                    max={pageCount}
                    value={everyN}
                    onChange={(e) => setEveryN(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-3 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-sm text-white/80"
                  />
                  <p className="text-[10px] text-white/30">Will create {Math.ceil(pageCount / everyN)} files</p>
                </div>
              )}
            </div>

            {/* Output panel */}
            <div className="bg-white/5 p-6 border border-white/10 flex flex-col space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 pb-4 border-b border-white/10">Output</h3>

              <button
                onClick={splitPDF}
                disabled={isSplitting || (splitMode === "select" && selectedPages.size === 0)}
                className="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-4 hover:bg-white/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Scissors className="w-4 h-4" />
                {isSplitting ? "Splitting..." : "Split PDF"}
              </button>

              {splitUrls.length > 0 && (
                <div className="space-y-2 flex-1 overflow-y-auto">
                  {splitUrls.map((result, i) => (
                    <a key={i} href={result.url} download={result.name} className="flex items-center gap-3 bg-[#0A0A0A] border border-white/10 p-4 hover:border-white/30 transition-colors">
                      <FileText className="w-4 h-4 text-white/40 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{result.name}</p>
                        <p className="text-[10px] text-white/40">{result.pages} page{result.pages !== 1 ? "s" : ""}</p>
                      </div>
                      <Download className="w-4 h-4 text-white/50" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      <SEOContent
        title="PDF Splitter"
        description="Split PDF files or extract specific pages from a PDF document entirely in your browser."
        steps={[
          { title: "Upload a PDF", description: "Select a PDF file from your device to split or extract pages from." },
          { title: "Select pages", description: "Choose individual pages, enter a page range, or set a split interval." },
          { title: "Download", description: "Split the PDF and download the resulting files." },
        ]}
        faqs={[
          { question: "Can I extract non-consecutive pages?", answer: "Yes. Click individual page numbers or use range syntax like '1-3, 5, 7-10' to select any combination." },
          { question: "Is my PDF uploaded anywhere?", answer: "No. All processing happens locally in your browser. Your PDF never leaves your device." },
          { question: "What does 'Split Every N' do?", answer: "It divides the PDF into multiple files, each containing N pages. The last file may have fewer pages." },
        ]}
      />
    </div>
  );
}
