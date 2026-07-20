import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Download, GripVertical, X, Image as ImageIcon } from "lucide-react";
import { SEOContent } from "../components/SEOContent";
import { PDFDocument } from "pdf-lib";

interface ImageFile {
  file: File;
  url: string;
  id: string;
  width: number;
  height: number;
}

type PageSize = "a4" | "letter" | "original";
type FitMode = "fit" | "stretch" | "original";

export default function ImagesToPDF() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [fitMode, setFitMode] = useState<FitMode>("fit");
  const [margin, setMargin] = useState(20);
  const [pdfUrl, setPdfUrl] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const pageDimensions: Record<string, { width: number; height: number }> = {
    a4: { width: 595.28, height: 841.89 },
    letter: { width: 612, height: 792 },
  };

  const loadImage = (file: File): Promise<ImageFile> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ file, url: URL.createObjectURL(file), id: crypto.randomUUID(), width: img.width, height: img.height });
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    const loaded = await Promise.all(files.map(loadImage));
    setImages(prev => [...prev, ...loaded]);
    setPdfUrl("");
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const loaded = await Promise.all(files.map(loadImage));
    setImages(prev => [...prev, ...loaded]);
    setPdfUrl("");
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    setPdfUrl("");
  };

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setImages(prev => {
      const items = [...prev];
      const [dragged] = items.splice(dragIndex, 1);
      items.splice(index, 0, dragged);
      return items;
    });
    setDragIndex(index);
  };
  const handleDragEnd = () => setDragIndex(null);

  const buildPDF = async () => {
    if (images.length === 0) return;
    setIsBuilding(true);
    try {
      const pdf = await PDFDocument.create();
      for (const img of images) {
        const bytes = await img.file.arrayBuffer();
        let embedded;
        if (img.file.type === "image/png") {
          embedded = await pdf.embedPng(bytes);
        } else {
          embedded = await pdf.embedJpg(bytes);
        }

        let pageW: number, pageH: number;
        if (pageSize === "original") {
          pageW = embedded.width + margin * 2;
          pageH = embedded.height + margin * 2;
        } else {
          const dims = pageDimensions[pageSize];
          pageW = dims.width;
          pageH = dims.height;
        }

        const page = pdf.addPage([pageW, pageH]);
        const availW = pageW - margin * 2;
        const availH = pageH - margin * 2;

        let drawW: number, drawH: number, drawX: number, drawY: number;
        if (fitMode === "stretch") {
          drawW = availW;
          drawH = availH;
        } else if (fitMode === "original") {
          drawW = Math.min(embedded.width, availW);
          drawH = Math.min(embedded.height, availH);
        } else {
          const ratio = Math.min(availW / embedded.width, availH / embedded.height);
          drawW = embedded.width * ratio;
          drawH = embedded.height * ratio;
        }
        drawX = margin + (availW - drawW) / 2;
        drawY = margin + (availH - drawH) / 2;

        page.drawImage(embedded, { x: drawX, y: drawY, width: drawW, height: drawH });
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("Build failed:", err);
    }
    setIsBuilding(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Images to PDF</h1>
        <p className="text-white/50 text-sm">Combine images into a PDF document — entirely in your browser.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 flex-1 flex flex-col">
        {images.length === 0 ? (
          <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="flex-1 border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center p-12 transition-colors hover:border-white/40">
            <input type="file" accept="image/png,image/jpeg,image/jpg" multiple onChange={handleFileSelect} className="hidden" id="img-to-pdf-upload" />
            <label htmlFor="img-to-pdf-upload" className="cursor-pointer flex flex-col items-center space-y-4">
              <div className="p-4 bg-[#0A0A0A] rounded-full border border-white/10">
                <Upload className="w-8 h-8 text-white/50" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-white/80">Drop images or click to upload</p>
                <p className="text-xs text-white/40 mt-1">PNG and JPG images supported</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-1">
            {/* Image list */}
            <div className="lg:col-span-2 bg-white/5 p-6 border border-white/10 flex flex-col space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Images ({images.length})</h3>
                <div className="flex gap-3">
                  <input type="file" accept="image/png,image/jpeg,image/jpg" multiple onChange={handleFileSelect} className="hidden" id="img-to-pdf-add" />
                  <label htmlFor="img-to-pdf-add" className="cursor-pointer text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white underline underline-offset-4">+ Add</label>
                  <button onClick={() => { setImages([]); setPdfUrl(""); }} className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white underline underline-offset-4">Clear</button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto flex-1 max-h-[400px]">
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`relative bg-[#0A0A0A] border border-white/10 p-2 cursor-grab active:cursor-grabbing transition-all group ${dragIndex === index ? "opacity-50" : ""}`}
                  >
                    <img src={img.url} alt={img.file.name} className="w-full aspect-square object-cover" />
                    <div className="absolute top-1 left-1 bg-black/70 px-1.5 py-0.5 text-[10px] font-mono text-white/60">{index + 1}</div>
                    <button onClick={() => removeImage(img.id)} className="absolute top-1 right-1 bg-black/70 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                    <p className="text-[10px] text-white/40 truncate mt-1">{img.file.name}</p>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-white/30 text-center">Drag to reorder · One image per page</p>
            </div>

            {/* Settings & output */}
            <div className="bg-white/5 p-6 border border-white/10 flex flex-col space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 pb-4 border-b border-white/10">Settings</h3>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Page Size</label>
                <div className="flex flex-col gap-2">
                  {([["a4", "A4"], ["letter", "Letter"], ["original", "Original"]] as [PageSize, string][]).map(([val, label]) => (
                    <button key={val} onClick={() => { setPageSize(val); setPdfUrl(""); }} className={`py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${pageSize === val ? "bg-white text-black border-white" : "border-white/20 text-white/60"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Fit Mode</label>
                <div className="flex flex-col gap-2">
                  {([["fit", "Fit to Page"], ["stretch", "Stretch"], ["original", "Original Size"]] as [FitMode, string][]).map(([val, label]) => (
                    <button key={val} onClick={() => { setFitMode(val); setPdfUrl(""); }} className={`py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${fitMode === val ? "bg-white text-black border-white" : "border-white/20 text-white/60"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Margin</label>
                  <span className="text-xs font-mono text-white/80">{margin}pt</span>
                </div>
                <input type="range" min="0" max="100" value={margin} onChange={(e) => { setMargin(Number(e.target.value)); setPdfUrl(""); }} className="w-full accent-white" />
              </div>

              <button onClick={buildPDF} disabled={isBuilding} className="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-4 hover:bg-white/80 transition-colors disabled:opacity-50 mt-auto">
                {isBuilding ? "Building..." : "Create PDF"}
              </button>

              {pdfUrl && (
                <a href={pdfUrl} download="images.pdf" className="block text-center bg-green-500 text-black font-black uppercase tracking-widest text-xs py-4 hover:bg-green-400 transition-colors">
                  <Download className="w-4 h-4 inline mr-2" />Download PDF
                </a>
              )}
            </div>
          </div>
        )}
      </motion.div>

      <SEOContent
        title="Images to PDF Converter"
        description="Combine multiple images into a single PDF document. Customize page size, fit mode, and margins."
        steps={[
          { title: "Upload images", description: "Select or drag-and-drop PNG and JPG images." },
          { title: "Configure layout", description: "Choose page size, fit mode, and margins." },
          { title: "Create & download", description: "Build the PDF and download it." },
        ]}
        faqs={[
          { question: "What image formats are supported?", answer: "PNG and JPG images are supported for embedding in PDFs." },
          { question: "Can I reorder images?", answer: "Yes! Drag and drop the image thumbnails to rearrange the page order." },
          { question: "Is there a limit on the number of images?", answer: "No hard limit, but very many large images may slow down your browser since everything runs locally." },
        ]}
      />
    </div>
  );
}
