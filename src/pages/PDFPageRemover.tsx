import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Download, X, ArrowUp, ArrowDown, FileText, Scissors } from "lucide-react";
import { SEOContent } from "../components/SEOContent";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface Thumb {
  page: number;
  url: string;
}

export default function PDFPageRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [thumbs, setThumbs] = useState<Thumb[]>([]);
  const [isWorking, setIsWorking] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputName, setOutputName] = useState("");
  const [originalCount, setOriginalCount] = useState(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setOutputUrl(null);
    setThumbs([]);
    setFile(selected);
    setIsWorking(true);
    try {
      const bytes = await selected.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      setOriginalCount(pdf.numPages);
      setOrder(Array.from({ length: pdf.numPages }, (_, i) => i + 1));

      const rendered: Thumb[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.35 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        // @ts-expect-error - pdfjs-dist types require canvas but canvasContext works at runtime
        await page.render({ canvasContext: ctx, viewport }).promise;
        rendered.push({ page: i, url: canvas.toDataURL("image/png") });
      }
      setThumbs(rendered);
    } catch (err) {
      console.error("Load failed:", err);
    }
    setIsWorking(false);
  };

  const movePage = (index: number, dir: -1 | 1) => {
    setOrder(prev => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const removePage = (originalPage: number) => {
    setOrder(prev => prev.filter(p => p !== originalPage));
  };

  const downloadPDF = async () => {
    if (!file) return;
    setIsWorking(true);
    try {
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes);
      const out = await PDFDocument.create();
      const indices = order.map(p => p - 1);
      const copied = await out.copyPages(src, indices);
      copied.forEach(page => out.addPage(page));
      const outBytes = await out.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });
      if (outputUrl) URL.revokeObjectURL(outputUrl);
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
      setOutputName(`${file.name.replace(/\.pdf$/i, "")}-pages-${order.length}.pdf`);
    } catch (err) {
      console.error("Save failed:", err);
    }
    setIsWorking(false);
  };

  const reset = () => {
    setFile(null);
    setOrder([]);
    setThumbs([]);
    setOutputUrl(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">PDF Page Remover</h1>
        <p className="text-white/50 text-sm">Remove, reorder and organize PDF pages — entirely in your browser.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 flex-1 flex flex-col">
        {!file ? (
          <div className="flex-1 border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center p-12 transition-colors hover:border-white/40">
            <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" id="pdf-page-remover-upload" />
            <label htmlFor="pdf-page-remover-upload" className="cursor-pointer flex flex-col items-center space-y-4">
              <div className="p-4 bg-[#0A0A0A] rounded-full border border-white/10">
                <Upload className="w-8 h-8 text-white/50" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-white/80">Upload a PDF</p>
                <p className="text-xs text-white/40 mt-1">Delete or reorder its pages</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="space-y-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between bg-white/5 p-6 border border-white/10">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 truncate">{file.name}</h3>
                <p className="text-[10px] text-white/30 mt-1">
                  {order.length} of {originalCount} pages kept
                </p>
              </div>
              <button onClick={reset} className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white underline underline-offset-4">
                Change File
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Page {order.length === 1 ? "is" : "order"} — current sequence:</span>
              <div className="flex flex-wrap gap-1">
                {order.map((p, i) => (
                  <span key={`${p}-${i}`} className="w-7 h-7 bg-[#0A0A0A] border border-white/15 text-[10px] font-bold flex items-center justify-center text-white/70">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 flex-1 overflow-y-auto">
              {order.map((p, i) => {
                const thumb = thumbs.find(t => t.page === p);
                return (
                  <div key={`${p}-${i}`} className="bg-[#0A0A0A] border border-white/10 flex flex-col">
                    <div className="relative">
                      {thumb ? <img src={thumb.url} alt={`Page ${p}`} className="w-full object-contain bg-white" /> : (
                        <div className="aspect-[3/4] flex items-center justify-center bg-white">
                          <FileText className="w-6 h-6 text-black/20" />
                        </div>
                      )}
                      <span className="absolute top-1 left-1 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5">#{i + 1} · p{p}</span>
                      <button onClick={() => removePage(p)} className="absolute top-1 right-1 bg-red-600 text-white p-1 hover:bg-red-500 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-2">
                      <button onClick={() => movePage(i, -1)} disabled={i === 0} className="text-white/40 hover:text-white disabled:opacity-20 p-1">
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button onClick={() => movePage(i, 1)} disabled={i === order.length - 1} className="text-white/40 hover:text-white disabled:opacity-20 p-1">
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {order.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-white/20 gap-3">
                  <Scissors className="w-12 h-12" />
                  <p className="text-xs uppercase tracking-widest">All pages removed</p>
                </div>
              )}
            </div>

            {outputUrl ? (
              <a href={outputUrl} download={outputName} className="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-4 hover:bg-white/80 transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download {outputName}
              </a>
            ) : (
              <button onClick={downloadPDF} disabled={isWorking || order.length === 0} className="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-4 hover:bg-white/80 transition-colors disabled:opacity-50">
                {isWorking ? "Processing..." : `Save PDF (${order.length} pages)`}
              </button>
            )}
          </div>
        )}
      </motion.div>

      <SEOContent
        title="PDF Page Remover"
        description="Delete, reorder and organize pages in a PDF file for free online. No uploads, no sign-up required."
        steps={[
          { title: "Upload PDF", description: "Select the PDF you want to edit." },
          { title: "Remove & reorder", description: "Click X to delete pages or use arrows to reorder them." },
          { title: "Download", description: "Save the edited PDF with a single click." },
        ]}
        faqs={[
          { question: "Are my files uploaded?", answer: "No. The PDF is processed entirely in your browser using pdf.js and pdf-lib." },
          { question: "Can I reorder pages?", answer: "Yes. Use the up/down arrows on each thumbnail to change the page sequence." },
          { question: "Is the file modification reversible?", answer: "Keep your original file. This tool edits a copy — your original PDF is never modified." },
        ]}
      />
    </div>
  );
}