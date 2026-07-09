import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Download, Image as ImageIcon } from "lucide-react";
import { SEOContent } from "../components/SEOContent";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

type OutputFormat = "png" | "jpeg";

interface RenderedPage {
  pageNum: number;
  url: string;
  width: number;
  height: number;
}

export default function PDFToImages() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [format, setFormat] = useState<OutputFormat>("png");
  const [scale, setScale] = useState(2);
  const [progress, setProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPages([]);
    await renderPages(selected, format, scale);
  };

  const renderPages = async (pdfFile: File, fmt: OutputFormat, s: number) => {
    setIsRendering(true);
    setPages([]);
    setProgress(0);

    try {
      const bytes = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const count = pdf.numPages;
      setTotalPages(count);
      const rendered: RenderedPage[] = [];

      for (let i = 1; i <= count; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: s });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;

        // @ts-ignore - pdfjs-dist types require canvas but canvasContext works at runtime
        await page.render({ canvasContext: ctx, viewport }).promise;

        const url = canvas.toDataURL(fmt === "jpeg" ? "image/jpeg" : "image/png", 0.92);
        rendered.push({ pageNum: i, url, width: viewport.width, height: viewport.height });
        setProgress(i);
        setPages([...rendered]);
      }
    } catch (err) {
      console.error("Render failed:", err);
    }
    setIsRendering(false);
  };

  const rerender = () => {
    if (file) renderPages(file, format, scale);
  };

  const downloadAll = () => {
    pages.forEach(page => {
      const link = document.createElement("a");
      link.href = page.url;
      link.download = `page-${page.pageNum}.${format === "jpeg" ? "jpg" : "png"}`;
      link.click();
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">PDF to Images</h1>
        <p className="text-white/50 text-sm">Convert PDF pages to high-quality images — entirely in your browser.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 flex-1 flex flex-col">
        {!file ? (
          <div className="flex-1 border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center p-12 transition-colors hover:border-white/40">
            <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" id="pdf-to-img-upload" />
            <label htmlFor="pdf-to-img-upload" className="cursor-pointer flex flex-col items-center space-y-4">
              <div className="p-4 bg-[#0A0A0A] rounded-full border border-white/10">
                <Upload className="w-8 h-8 text-white/50" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-white/80">Upload a PDF</p>
                <p className="text-xs text-white/40 mt-1">Each page will be rendered as an image</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="space-y-6 flex-1 flex flex-col">
            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-end bg-white/5 p-6 border border-white/10">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Format</label>
                <div className="flex gap-2">
                  {(["png", "jpeg"] as OutputFormat[]).map(f => (
                    <button key={f} onClick={() => setFormat(f)} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${format === f ? "bg-white text-black border-white" : "border-white/20 text-white/60"}`}>
                      {f === "jpeg" ? "JPG" : "PNG"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Scale</label>
                <div className="flex gap-2">
                  {[1, 2, 3].map(s => (
                    <button key={s} onClick={() => setScale(s)} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${scale === s ? "bg-white text-black border-white" : "border-white/20 text-white/60"}`}>
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={rerender} disabled={isRendering} className="px-6 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-white/80 transition-colors disabled:opacity-50 h-[38px]">
                {isRendering ? `Rendering ${progress}/${totalPages}...` : "Re-render"}
              </button>
              <button onClick={() => { setFile(null); setPages([]); }} className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white underline underline-offset-4 ml-auto">
                Change File
              </button>
            </div>

            {/* Progress bar */}
            {isRendering && (
              <div className="w-full bg-white/10 h-1">
                <div className="bg-white h-1 transition-all duration-300" style={{ width: `${(progress / totalPages) * 100}%` }} />
              </div>
            )}

            {/* Image grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 flex-1 overflow-y-auto">
              {pages.map(page => (
                <div key={page.pageNum} className="bg-[#0A0A0A] border border-white/10 p-2 flex flex-col">
                  <img src={page.url} alt={`Page ${page.pageNum}`} className="w-full object-contain bg-white" />
                  <div className="flex items-center justify-between mt-2 px-1">
                    <span className="text-[10px] text-white/40 font-mono">Page {page.pageNum}</span>
                    <a href={page.url} download={`page-${page.pageNum}.${format === "jpeg" ? "jpg" : "png"}`} className="text-white/50 hover:text-white">
                      <Download className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
              {pages.length === 0 && !isRendering && (
                <div className="col-span-full flex items-center justify-center py-12">
                  <ImageIcon className="w-12 h-12 text-white/10" />
                </div>
              )}
            </div>

            {/* Download all */}
            {pages.length > 1 && (
              <button onClick={downloadAll} className="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-4 hover:bg-white/80 transition-colors">
                Download All {pages.length} Images
              </button>
            )}
          </div>
        )}
      </motion.div>

      <SEOContent
        title="PDF to Images"
        description="Convert every page of a PDF to high-quality PNG or JPG images directly in your browser."
        steps={[
          { title: "Upload PDF", description: "Select a PDF file from your device." },
          { title: "Choose settings", description: "Pick output format (PNG/JPG) and resolution scale (1x-3x)." },
          { title: "Download images", description: "Download individual page images or all at once." },
        ]}
        faqs={[
          { question: "What resolution are the images?", answer: "At 2x scale, a standard letter-size PDF page renders at ~1224×1584 pixels — perfect for most uses. Use 3x for print quality." },
          { question: "Does this work offline?", answer: "The PDF rendering library needs to load once, but after that all conversion is fully client-side." },
          { question: "Are my files uploaded?", answer: "No. Everything is processed locally in your browser using Mozilla's pdf.js library." },
        ]}
      />
    </div>
  );
}
