import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Download, RefreshCw, Image as ImageIcon, X } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

type OutputFormat = "png" | "jpeg" | "webp" | "avif";

interface ConvertedImage {
  name: string;
  originalSize: number;
  convertedSize: number;
  convertedUrl: string;
  originalUrl: string;
}

export default function ImageConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<OutputFormat>("webp");
  const [quality, setQuality] = useState(85);
  const [converted, setConverted] = useState<ConvertedImage[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatLabels: Record<OutputFormat, string> = {
    png: "PNG",
    jpeg: "JPG",
    webp: "WebP",
    avif: "AVIF",
  };

  const mimeTypes: Record<OutputFormat, string> = {
    png: "image/png",
    jpeg: "image/jpeg",
    webp: "image/webp",
    avif: "image/avif",
  };

  const isLossy = format === "jpeg" || format === "webp" || format === "avif";

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    if (droppedFiles.length) {
      setFiles(prev => [...prev, ...droppedFiles]);
      setConverted([]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length) {
      setFiles(prev => [...prev, ...selected]);
      setConverted([]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setConverted([]);
  };

  const convertImage = (file: File, fmt: OutputFormat, q: number): Promise<ConvertedImage> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return reject("No canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("No context");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject("Conversion failed");
            const url = URL.createObjectURL(blob);
            const baseName = file.name.replace(/\.[^/.]+$/, "");
            resolve({
              name: `${baseName}.${fmt === "jpeg" ? "jpg" : fmt}`,
              originalSize: file.size,
              convertedSize: blob.size,
              convertedUrl: url,
              originalUrl: URL.createObjectURL(file),
            });
          },
          mimeTypes[fmt],
          isLossy ? q / 100 : undefined
        );
      };
      img.onerror = () => reject("Failed to load image");
      img.src = URL.createObjectURL(file);
    });
  };

  const convertAll = async () => {
    setIsConverting(true);
    const results: ConvertedImage[] = [];
    for (const file of files) {
      try {
        const result = await convertImage(file, format, quality);
        results.push(result);
      } catch (err) {
        console.error("Conversion error:", err);
      }
    }
    setConverted(results);
    setIsConverting(false);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const reset = () => {
    setFiles([]);
    setConverted([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Image Converter</h1>
        <p className="text-white/50 text-sm">Convert images between PNG, JPG, WebP, and AVIF — entirely in your browser.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 flex-1 flex flex-col">
        {files.length === 0 ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="flex-1 border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center p-12 transition-colors hover:border-white/40"
          >
            <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" id="img-convert-upload" />
            <label htmlFor="img-convert-upload" className="cursor-pointer flex flex-col items-center space-y-4">
              <div className="p-4 bg-[#0A0A0A] rounded-full border border-white/10">
                <Upload className="w-8 h-8 text-white/50" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-white/80">Drop images or click to upload</p>
                <p className="text-xs text-white/40 mt-1">PNG, JPG, WebP, AVIF, GIF, BMP — any image format</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
            {/* Settings Panel */}
            <div className="bg-white/5 p-6 border border-white/10 flex flex-col space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Settings</h3>
                <button onClick={reset} className="text-xs font-bold uppercase tracking-widest text-white hover:text-white/80 underline underline-offset-4">
                  Reset
                </button>
              </div>

              {/* File list */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Files ({files.length})</label>
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#0A0A0A] border border-white/10 px-3 py-2">
                    <span className="text-xs text-white/70 truncate flex-1 mr-2">{f.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/40 font-mono">{formatBytes(f.size)}</span>
                      <button onClick={() => removeFile(i)} className="text-white/30 hover:text-white/70"><X className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add more files */}
              <div>
                <input type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" id="img-convert-add" />
                <label htmlFor="img-convert-add" className="cursor-pointer text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white/80 underline underline-offset-4">
                  + Add More Files
                </label>
              </div>

              {/* Format selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Output Format</label>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(formatLabels) as OutputFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => { setFormat(fmt); setConverted([]); }}
                      className={`py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${format === fmt ? "bg-white text-black border-white" : "border-white/20 text-white/60 hover:border-white/40"}`}
                    >
                      {formatLabels[fmt]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality slider */}
              {isLossy && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Quality</label>
                    <span className="text-xs font-mono text-white/80">{quality}%</span>
                  </div>
                  <input type="range" min="1" max="100" value={quality} onChange={(e) => { setQuality(Number(e.target.value)); setConverted([]); }} className="w-full accent-white" />
                </div>
              )}

              {/* Convert button */}
              <button
                onClick={convertAll}
                disabled={isConverting}
                className="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-4 hover:bg-white/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-auto"
              >
                {isConverting ? <><RefreshCw className="w-4 h-4 animate-spin" /> Converting...</> : `Convert to ${formatLabels[format]}`}
              </button>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/10 p-6 flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Results</span>
              {converted.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <ImageIcon className="w-12 h-12 text-white/10 mx-auto" />
                    <p className="text-xs text-white/30">{isConverting ? "Converting..." : "Click convert to see results"}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto flex-1">
                  {converted.map((img, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/10 p-4">
                      <img src={img.convertedUrl} alt={img.name} className="w-16 h-16 object-cover border border-white/10" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{img.name}</p>
                        <p className="text-[10px] text-white/40 font-mono">
                          {formatBytes(img.originalSize)} → {formatBytes(img.convertedSize)}
                          {" "}
                          <span className={img.convertedSize < img.originalSize ? "text-green-400" : "text-yellow-400"}>
                            ({img.convertedSize < img.originalSize ? "-" : "+"}{Math.abs(Math.round(((img.convertedSize - img.originalSize) / img.originalSize) * 100))}%)
                          </span>
                        </p>
                      </div>
                      <a href={img.convertedUrl} download={img.name} className="p-2 bg-white/10 hover:bg-white/20 transition-colors">
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      <canvas ref={canvasRef} className="hidden" />

      <SEOContent
        title="Image Converter"
        description="Convert images between PNG, JPG, WebP, and AVIF formats directly in your browser. No uploads, no server processing."
        steps={[
          { title: "Upload images", description: "Drag and drop or click to select one or more images in any format." },
          { title: "Choose format", description: "Select your desired output format: PNG, JPG, WebP, or AVIF. Adjust quality for lossy formats." },
          { title: "Download", description: "Click convert and download your converted images individually or in bulk." },
        ]}
        faqs={[
          { question: "Which format should I choose?", answer: "WebP offers the best balance of quality and file size. AVIF is newer and even smaller but has less browser support. PNG is lossless, and JPG is universal." },
          { question: "Is my data safe?", answer: "Yes. All conversion happens locally in your browser using the Canvas API. Your images never leave your device." },
          { question: "Does it support batch conversion?", answer: "Yes! Upload multiple images at once and convert them all to the same format with one click." },
        ]}
      />
    </div>
  );
}
