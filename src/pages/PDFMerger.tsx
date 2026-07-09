import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Download, GripVertical, X, FileText } from "lucide-react";
import { SEOContent } from "../components/SEOContent";
import { PDFDocument } from "pdf-lib";

interface PDFFile {
  file: File;
  name: string;
  pageCount: number;
  id: string;
}

export default function PDFMerger() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [mergedUrl, setMergedUrl] = useState<string>("");
  const [mergedSize, setMergedSize] = useState(0);
  const [isMerging, setIsMerging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === "application/pdf");
    await addFiles(files);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await addFiles(files);
  };

  const addFiles = async (files: File[]) => {
    const newPdfs: PDFFile[] = [];
    for (const file of files) {
      try {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        newPdfs.push({
          file,
          name: file.name,
          pageCount: pdf.getPageCount(),
          id: crypto.randomUUID(),
        });
      } catch {
        console.error("Failed to load PDF:", file.name);
      }
    }
    setPdfFiles(prev => [...prev, ...newPdfs]);
    setMergedUrl("");
  };

  const removeFile = (id: string) => {
    setPdfFiles(prev => prev.filter(f => f.id !== id));
    setMergedUrl("");
  };

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setPdfFiles(prev => {
      const items = [...prev];
      const [dragged] = items.splice(dragIndex, 1);
      items.splice(index, 0, dragged);
      return items;
    });
    setDragIndex(index);
  };
  const handleDragEnd = () => setDragIndex(null);

  const mergePDFs = async () => {
    if (pdfFiles.length < 2) return;
    setIsMerging(true);
    try {
      const merged = await PDFDocument.create();
      for (const pdfFile of pdfFiles) {
        const bytes = await pdfFile.file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach(page => merged.addPage(page));
      }
      const mergedBytes = await merged.save();
      const blob = new Blob([mergedBytes], { type: "application/pdf" });
      setMergedUrl(URL.createObjectURL(blob));
      setMergedSize(blob.size);
    } catch (err) {
      console.error("Merge failed:", err);
    }
    setIsMerging(false);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const totalPages = pdfFiles.reduce((sum, f) => sum + f.pageCount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">PDF Merger</h1>
        <p className="text-white/50 text-sm">Combine multiple PDFs into one document — entirely in your browser.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 flex-1 flex flex-col">
        {pdfFiles.length === 0 ? (
          <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="flex-1 border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center p-12 transition-colors hover:border-white/40">
            <input type="file" accept="application/pdf" multiple onChange={handleFileSelect} className="hidden" id="pdf-merge-upload" />
            <label htmlFor="pdf-merge-upload" className="cursor-pointer flex flex-col items-center space-y-4">
              <div className="p-4 bg-[#0A0A0A] rounded-full border border-white/10">
                <Upload className="w-8 h-8 text-white/50" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-white/80">Drop PDFs or click to upload</p>
                <p className="text-xs text-white/40 mt-1">Select two or more PDF files to merge</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
            <div className="lg:col-span-2 bg-white/5 p-6 border border-white/10 flex flex-col space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Documents ({pdfFiles.length}) · {totalPages} pages</h3>
                <div className="flex gap-3">
                  <input type="file" accept="application/pdf" multiple onChange={handleFileSelect} className="hidden" id="pdf-merge-add" />
                  <label htmlFor="pdf-merge-add" className="cursor-pointer text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white underline underline-offset-4">+ Add</label>
                  <button onClick={() => { setPdfFiles([]); setMergedUrl(""); }} className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white underline underline-offset-4">Clear</button>
                </div>
              </div>

              <div className="space-y-2 flex-1 overflow-y-auto">
                {pdfFiles.map((pdf, index) => (
                  <div
                    key={pdf.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-4 bg-[#0A0A0A] border border-white/10 p-4 cursor-grab active:cursor-grabbing transition-all ${dragIndex === index ? "opacity-50 scale-95" : ""}`}
                  >
                    <GripVertical className="w-4 h-4 text-white/30 flex-shrink-0" />
                    <div className="w-8 h-8 bg-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white/60">{index + 1}</span>
                    </div>
                    <FileText className="w-5 h-5 text-white/40 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{pdf.name}</p>
                      <p className="text-[10px] text-white/40 font-mono">{pdf.pageCount} page{pdf.pageCount !== 1 ? "s" : ""} · {formatBytes(pdf.file.size)}</p>
                    </div>
                    <button onClick={() => removeFile(pdf.id)} className="text-white/30 hover:text-white/70 flex-shrink-0"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-white/30 text-center">Drag to reorder · Documents merge top to bottom</p>
            </div>

            <div className="bg-white/5 p-6 border border-white/10 flex flex-col space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 pb-4 border-b border-white/10">Output</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-[#0A0A0A] border border-white/10">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/50">Total Files</span>
                  <span className="text-sm font-mono text-white/80">{pdfFiles.length}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#0A0A0A] border border-white/10">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/50">Total Pages</span>
                  <span className="text-sm font-mono text-white/80">{totalPages}</span>
                </div>
                {mergedSize > 0 && (
                  <div className="flex justify-between items-center p-4 bg-[#0A0A0A] border border-white/10">
                    <span className="text-xs font-bold uppercase tracking-widest text-green-500/80">Merged Size</span>
                    <span className="text-sm font-mono text-green-400">{formatBytes(mergedSize)}</span>
                  </div>
                )}
              </div>

              <button
                onClick={mergePDFs}
                disabled={pdfFiles.length < 2 || isMerging}
                className="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-4 hover:bg-white/80 transition-colors disabled:opacity-50 mt-auto"
              >
                {isMerging ? "Merging..." : "Merge PDFs"}
              </button>

              {mergedUrl && (
                <a href={mergedUrl} download="merged.pdf" className="block text-center bg-green-500 text-black font-black uppercase tracking-widest text-xs py-4 hover:bg-green-400 transition-colors">
                  <Download className="w-4 h-4 inline mr-2" />Download Merged PDF
                </a>
              )}
            </div>
          </div>
        )}
      </motion.div>

      <SEOContent
        title="PDF Merger"
        description="Merge multiple PDF documents into a single file directly in your browser. Drag to reorder, no uploads needed."
        steps={[
          { title: "Upload PDFs", description: "Select two or more PDF files from your device." },
          { title: "Arrange order", description: "Drag and drop to reorder the documents as needed." },
          { title: "Merge & Download", description: "Click merge and download the combined PDF file." },
        ]}
        faqs={[
          { question: "Is there a file size limit?", answer: "There's no hard limit, but very large PDFs may be slow since processing happens in your browser." },
          { question: "Are my files secure?", answer: "Yes. All merging happens locally in your browser using pdf-lib. Your files never leave your device." },
          { question: "Can I reorder pages?", answer: "You can reorder entire documents by dragging. For page-level control, use the PDF Splitter tool." },
        ]}
      />
    </div>
  );
}
