import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Copy, Download, Check, FileText, ScanText } from "lucide-react";
import { SEOContent } from "../components/SEOContent";
import * as pdfjsLib from "pdfjs-dist";
import { createWorker } from "tesseract.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export default function PDFTextExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [pages, setPages] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isOcr, setIsOcr] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrTotal, setOcrTotal] = useState(0);
  const [hasOcr, setHasOcr] = useState(false);
  const [ocrError, setOcrError] = useState("");

  const resetState = () => {
    setText("");
    setPages(0);
    setIsExtracting(false);
    setProgress(0);
    setIsOcr(false);
    setOcrProgress(0);
    setOcrTotal(0);
    setHasOcr(false);
    setOcrError("");
  };

  const loadPdf = async (selected: File) => {
    const bytes = await selected.arrayBuffer();
    return pdfjsLib.getDocument({ data: bytes }).promise;
  };

  const renderPageToCanvas = async (pdf: any, pageNum: number, scale: number) => {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    await page.render({ canvasContext: ctx, viewport }).promise;
    return canvas;
  };

  const runOcr = async (pdf: any) => {
    const total = pdf.numPages;
    setOcrTotal(total);
    setIsOcr(true);
    setOcrError("");
    let worker: Awaited<ReturnType<typeof createWorker>> | null = null;
    let all = "";
    try {
      worker = await createWorker("eng");
      for (let i = 1; i <= total; i++) {
        const canvas = await renderPageToCanvas(pdf, i, 2);
        const { data } = await worker.recognize(canvas);
        const pageText = data.text.trim();
        all += `--- Page ${i} (OCR) ---\n${pageText}\n\n`;
        setOcrProgress(i);
        if (i % 3 === 0) await new Promise(r => setTimeout(r, 0));
      }
      setHasOcr(true);
      setText(prev => (prev ? `${prev}\n\n${all.trim()}` : all.trim()));
    } catch (err) {
      console.error("OCR failed:", err);
      setOcrError("OCR failed. This runs on your CPU — for large PDFs it can take a while.");
    } finally {
      if (worker) {
        try {
          await worker.terminate();
        } catch {
          /* noop */
        }
      }
      setIsOcr(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    resetState();
    setIsExtracting(true);
    setProgress(0);

    try {
      const pdf = await loadPdf(selected);
      setPages(pdf.numPages);
      let all = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: any) => ("str" in item ? item.str : ""))
          .join(" ");
        all += `--- Page ${i} ---\n${pageText.replace(/\s{2,}/g, " ").trim()}\n\n`;
        setProgress(i);
      }
      setText(all.trim());
    } catch (err) {
      console.error("Extract failed:", err);
    }
    setIsExtracting(false);
  };

  const handleOcrClick = async () => {
    if (!file) return;
    try {
      const pdf = await loadPdf(file);
      await runOcr(pdf);
    } catch (err) {
      console.error("Load failed:", err);
      setOcrError("Could not load the PDF.");
    }
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadTxt = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(file?.name || "document").replace(/\.pdf$/i, "")}-extracted.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">PDF Text Extractor</h1>
        <p className="text-white/50 text-sm">Extract all text from a PDF — entirely in your browser. No uploads.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 flex-1 flex flex-col">
        {!file ? (
          <div className="flex-1 border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center p-12 transition-colors hover:border-white/40">
            <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" id="pdf-text-extract-upload" />
            <label htmlFor="pdf-text-extract-upload" className="cursor-pointer flex flex-col items-center space-y-4">
              <div className="p-4 bg-[#0A0A0A] rounded-full border border-white/10">
                <Upload className="w-8 h-8 text-white/50" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-white/80">Upload a PDF</p>
                <p className="text-xs text-white/40 mt-1">All text will be extracted locally</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="space-y-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between bg-white/5 p-6 border border-white/10">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 truncate">{file.name}</h3>
                <p className="text-[10px] text-white/30 mt-1">{pages} pages</p>
              </div>
              <button onClick={() => { setFile(null); resetState(); }} className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white underline underline-offset-4">
                Change File
              </button>
            </div>

            {isExtracting && (
              <div className="w-full bg-white/10 h-1">
                <div className="bg-white h-1 transition-all duration-300" style={{ width: `${(progress / pages) * 100}%` }} />
              </div>
            )}

            {isOcr && (
              <div className="bg-white/5 border border-white/10 p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <p className="text-xs font-bold text-white/70">Running OCR locally on your CPU — page {ocrProgress || 1} of {ocrTotal}</p>
                </div>
                <div className="w-full bg-white/10 h-1">
                  <div className="bg-white h-1 transition-all duration-300" style={{ width: `${((ocrProgress || 0) / Math.max(ocrTotal, 1)) * 100}%` }} />
                </div>
                <p className="text-[10px] text-white/40">Tesseract.js runs entirely in your browser using your device's CPU and memory. Nothing is uploaded. Larger pages take longer.</p>
              </div>
            )}

            {!isOcr && !isExtracting && !hasOcr && (
              <button onClick={handleOcrClick} className="bg-white/10 text-xs font-black uppercase tracking-widest px-4 py-3 hover:bg-white/20 transition-colors flex items-center gap-2">
                <ScanText className="w-4 h-4" /> OCR Scanned PDF (local)
              </button>
            )}

            {ocrError && (
              <p className="text-xs text-red-400 font-bold">{ocrError}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-2xl font-black">{pages}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Pages</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-2xl font-black">{text.split(/\s+/).filter(Boolean).length}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Words</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-2xl font-black">{text.length}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Characters</p>
              </div>
            </div>

            <div className="flex-1 bg-white/5 border border-white/10 flex flex-col">
              <div className="flex items-center justify-between gap-2 p-3 border-b border-white/10">
                <span className="text-[10px] text-white/40 uppercase tracking-widest">Extracted Text</span>
                <div className="flex gap-2">
                  <button onClick={copyAll} className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white flex items-center gap-1">
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button onClick={downloadTxt} className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white flex items-center gap-1">
                    <Download className="w-3 h-3" /> .txt
                  </button>
                </div>
              </div>
              {text ? (
                <textarea readOnly value={text} className="flex-1 min-h-[300px] bg-transparent outline-none p-4 font-mono text-xs text-white/80 resize-none" />
              ) : (
                <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center text-white/20 gap-3">
                  <FileText className="w-12 h-12" />
                  <p className="text-xs text-center px-6">No selectable text found — this is likely a scanned/image PDF.</p>
                  {!isOcr && (
                    <button onClick={handleOcrClick} className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-4 py-2.5 hover:bg-white/80 transition-colors flex items-center gap-2">
                      <ScanText className="w-3 h-3" /> Run OCR now
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      <SEOContent
        title="PDF Text Extractor & OCR"
        description="Extract text from any PDF — including scanned image PDFs with built-in OCR. Runs 100% in your browser using your CPU. No uploads, no sign-up."
        steps={[
          { title: "Upload PDF", description: "Select the PDF file you want to extract text from." },
          { title: "Extract or OCR", description: "Selectable text is pulled instantly with pdf.js. For scanned PDFs, run local OCR with Tesseract.js." },
          { title: "Copy or download", description: "Copy the extracted text or download it as a .txt file." },
        ]}
        faqs={[
          { question: "Is my PDF uploaded to a server?", answer: "No. All extraction and OCR happens locally in your browser. Your file never leaves your device." },
          { question: "Why is the text empty?", answer: "Scanned image PDFs contain no selectable text. Click the 'OCR' button and Tesseract.js will read the pages locally on your CPU." },
          { question: "How heavy is the OCR?", answer: "The OCR engine (Tesseract.js WASM) and English language model load once from a CDN, then everything runs on your device's CPU and memory." },
          { question: "Is this free?", answer: "Yes, completely free with no limits on file size or page count." },
        ]}
      />
    </div>
  );
}