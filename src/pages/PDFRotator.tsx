import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Download, RotateCw, RotateCcw, ArrowUp, ArrowDown, FileText, Check, RefreshCw } from "lucide-react";
import { SEOContent } from "../components/SEOContent";
import { PDFDocument, degrees } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface PageItem {
  pageNumber: number; // 1-indexed
  rotation: number; // 0, 90, 180, 270
  thumbUrl: string;
}

export default function PDFRotator() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl(null);
    setOutputSize(null);
    setFile(selected);
    setIsLoading(true);

    try {
      const buffer = await selected.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const loadedPages: PageItem[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.35 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await (page.render as any)({ canvasContext: ctx, viewport }).promise;

        loadedPages.push({
          pageNumber: i,
          rotation: 0,
          thumbUrl: canvas.toDataURL("image/jpeg", 0.75),
        });
      }

      setPages(loadedPages);
    } catch (err) {
      console.error("Failed to load PDF:", err);
      alert("Failed to load PDF. Please make sure it is a valid, unencrypted PDF file.");
    } finally {
      setIsLoading(false);
    }
  };

  const rotatePage = (index: number, delta: number) => {
    setPages((prev) =>
      prev.map((p, idx) => {
        if (idx !== index) return p;
        const newRotation = (p.rotation + delta + 360) % 360;
        return { ...p, rotation: newRotation };
      })
    );
  };

  const rotateAll = (delta: number) => {
    setPages((prev) =>
      prev.map((p) => ({
        ...p,
        rotation: (p.rotation + delta + 360) % 360,
      }))
    );
  };

  const movePage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= pages.length) return;
    setPages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, item);
      return copy;
    });
  };

  const exportRotatedPdf = async () => {
    if (!file || pages.length === 0) return;
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer);
      const outDoc = await PDFDocument.create();

      for (const item of pages) {
        // Copy the specific page (0-indexed)
        const [copiedPage] = await outDoc.copyPages(srcDoc, [item.pageNumber - 1]);
        const currentAngle = copiedPage.getRotation().angle;
        copiedPage.setRotation(degrees((currentAngle + item.rotation) % 360));
        outDoc.addPage(copiedPage);
      }

      const outBytes = await outDoc.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });

      if (outputUrl) URL.revokeObjectURL(outputUrl);
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
      setOutputSize(blob.size);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to rotate and export PDF. Please check the file and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col text-[#1d1d1f] dark:text-[#f5f5f7]">
      {/* Header */}
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">
          PDF Rotator &amp; Reorganizer
        </h1>
        <p className="text-[#6e6e73] dark:text-white/50 text-sm">
          Rotate individual or all pages, reorder sequence, and export without server uploads.
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 flex-1">
        {!file ? (
          <div className="border-2 border-dashed border-[#e5e5ea] dark:border-white/20 bg-white dark:bg-white/5 rounded-3xl flex flex-col items-center justify-center p-12 transition-colors hover:border-[#0071e3]">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="pdf-upload"
            />
            <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center space-y-4">
              <div className="p-4 bg-[#f5f5f7] dark:bg-[#0A0A0A] rounded-2xl border border-[#e5e5ea] dark:border-white/10 text-[#0071e3]">
                <Upload className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-[#1d1d1f] dark:text-white/80">
                  Select a PDF to Rotate &amp; Reorder
                </p>
                <p className="text-xs text-[#6e6e73] dark:text-white/40 mt-1">
                  100% Client-Side • Zero Bytes Transmitted
                </p>
              </div>
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            {/* File info bar and global controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#0071e3]/10 text-[#0071e3]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1d1d1f] dark:text-white truncate max-w-xs sm:max-w-md">
                    {file.name}
                  </h4>
                  <p className="text-[11px] text-[#6e6e73] dark:text-[#a1a1aa]">
                    {pages.length} Pages • {formatBytes(file.size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => rotateAll(90)}
                  className="px-3 py-1.5 rounded-xl bg-[#f5f5f7] dark:bg-[#1f222a] hover:bg-[#e5e5ea] dark:hover:bg-[#27272a] text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Rotate all pages 90° clockwise"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Rotate All 90°</span>
                </button>
                <button
                  type="button"
                  onClick={() => rotateAll(180)}
                  className="px-3 py-1.5 rounded-xl bg-[#f5f5f7] dark:bg-[#1f222a] hover:bg-[#e5e5ea] dark:hover:bg-[#27272a] text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Rotate all pages 180°"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Rotate All 180°</span>
                </button>
                <label
                  htmlFor="pdf-upload-change"
                  className="px-3 py-1.5 rounded-xl bg-[#f5f5f7] dark:bg-[#1f222a] hover:bg-[#e5e5ea] text-xs font-bold cursor-pointer transition-colors"
                >
                  Change File
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="pdf-upload-change"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[#0071e3] animate-spin" />
                <p className="text-xs font-bold uppercase tracking-wider text-[#6e6e73]">
                  Rendering page thumbnails in WebAssembly...
                </p>
              </div>
            ) : (
              /* Visual Grid of Pages */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {pages.map((p, idx) => (
                  <div
                    key={`${p.pageNumber}-${idx}`}
                    className="p-3 rounded-2xl bg-white dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] shadow-xs flex flex-col items-center space-y-3 relative group"
                  >
                    {/* Header info */}
                    <div className="w-full flex items-center justify-between text-[11px] font-bold text-[#86868b]">
                      <span>Page {p.pageNumber}</span>
                      {p.rotation !== 0 && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                          +{p.rotation}°
                        </span>
                      )}
                    </div>

                    {/* Thumbnail preview with live CSS rotation */}
                    <div className="w-full aspect-[3/4] bg-[#f5f5f7] dark:bg-[#0A0A0A] rounded-xl overflow-hidden flex items-center justify-center p-1 border border-[#e5e5ea] dark:border-white/5">
                      <img
                        src={p.thumbUrl}
                        alt={`Page ${p.pageNumber}`}
                        className="max-w-full max-h-full object-contain transition-transform duration-300"
                        style={{ transform: `rotate(${p.rotation}deg)` }}
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between w-full gap-1 pt-1 border-t border-[#e5e5ea] dark:border-[#27272a]">
                      <button
                        type="button"
                        onClick={() => rotatePage(idx, -90)}
                        className="p-1.5 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#1f222a] text-[#6e6e73] hover:text-[#0071e3] transition-colors"
                        title="Rotate 90° Counter-Clockwise"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => rotatePage(idx, 90)}
                        className="p-1.5 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#1f222a] text-[#6e6e73] hover:text-[#0071e3] transition-colors"
                        title="Rotate 90° Clockwise"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <div className="h-3 w-px bg-[#e5e5ea] dark:bg-[#27272a]" />
                      <button
                        type="button"
                        onClick={() => movePage(idx, idx - 1)}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#1f222a] disabled:opacity-30 text-[#6e6e73] transition-colors"
                        title="Move Page Earlier"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => movePage(idx, idx + 1)}
                        disabled={idx === pages.length - 1}
                        className="p-1.5 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#1f222a] disabled:opacity-30 text-[#6e6e73] transition-colors"
                        title="Move Page Later"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Export and Download Bar */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-bold text-sm text-[#1d1d1f] dark:text-white">
                  Ready to Export Rotated PDF
                </h4>
                <p className="text-xs text-[#6e6e73] dark:text-[#a1a1aa]">
                  All changes are compiled locally in-memory using pdf-lib without loss of resolution.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={exportRotatedPdf}
                  disabled={isProcessing || pages.length === 0}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 shadow-xs flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <RotateCw className="w-4 h-4" />
                      <span>Apply &amp; Render PDF</span>
                    </>
                  )}
                </button>

                {outputUrl && (
                  <a
                    href={outputUrl}
                    download={`rotated-${file.name}`}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download ({outputSize ? formatBytes(outputSize) : "PDF"})</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <SEOContent
        title="PDF Rotator & Reorganizer"
        description="Rotate individual pages or entire documents 90, 180, or 270 degrees. Reorder pages with visual thumbnail previews 100% in-browser."
        steps={[
          { title: "Upload PDF", description: "Select your PDF document to render interactive page cards." },
          { title: "Rotate or Reorder", description: "Click clockwise/counter-clockwise icons or move pages up/down." },
          { title: "Export Lossless PDF", description: "Compile and download your sanitized, rotated PDF file locally." },
        ]}
        faqs={[
          { question: "Does rotating degrade document quality?", answer: "No. Rotation simply alters the page rotation metadata inside the PDF structure, ensuring zero quality loss." },
          { question: "Are my files uploaded to your servers?", answer: "Never. The processing occurs 100% locally in your browser memory using WebAssembly and pdf-lib." },
          { question: "Can I rotate only specific pages?", answer: "Yes! Each page card has its own rotation buttons so you can fix upside-down scans individually." },
        ]}
      />
    </div>
  );
}
