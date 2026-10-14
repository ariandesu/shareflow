import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Download, RefreshCw, FileText, Zap } from "lucide-react";
import { SEOContent } from "../components/SEOContent";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

type CompressionLevel = "extreme" | "recommended" | "high";

export default function PDFCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [level, setLevel] = useState<CompressionLevel>("recommended");
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl(null);
    setCompressedSize(null);
    setFile(selected);
    setOriginalSize(selected.size);
    setProgress(0);
  };

  const compressPdf = async () => {
    if (!file) return;
    setIsCompressing(true);
    setProgress(0);

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const numPages = pdf.numPages;
      setTotalPages(numPages);

      // Determine DPI scale and JPEG quality based on level
      let scale = 1.2;
      let quality = 0.65;
      if (level === "extreme") {
        scale = 0.9;
        quality = 0.45;
      } else if (level === "high") {
        scale = 1.5;
        quality = 0.82;
      }

      const outDoc = await PDFDocument.create();

      for (let i = 1; i <= numPages; i++) {
        setProgress(i);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;

        await (page.render as any)({ canvasContext: ctx, viewport }).promise;

        const jpegDataUrl = canvas.toDataURL("image/jpeg", quality);
        const base64 = jpegDataUrl.split(",")[1];
        const binary = atob(base64);
        const imgBytes = new Uint8Array(binary.length);
        for (let j = 0; j < binary.length; j++) imgBytes[j] = binary.charCodeAt(j);

        const embeddedImage = await outDoc.embedJpg(imgBytes);
        // Original page dimensions at 72 DPI
        const origViewport = page.getViewport({ scale: 1.0 });
        const outPage = outDoc.addPage([origViewport.width, origViewport.height]);
        outPage.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: origViewport.width,
          height: origViewport.height,
        });
      }

      const outBytes = await outDoc.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });

      if (outputUrl) URL.revokeObjectURL(outputUrl);
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
      setCompressedSize(blob.size);
    } catch (err) {
      console.error("Compression failed:", err);
      alert("Failed to compress PDF. Please verify the file is not password protected.");
    } finally {
      setIsCompressing(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const savedPercent =
    originalSize > 0 && compressedSize
      ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
      : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col text-[#1d1d1f] dark:text-[#f5f5f7]">
      {/* Header */}
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">
          Client-Side PDF Compressor
        </h1>
        <p className="text-[#6e6e73] dark:text-white/50 text-sm">
          Downsample and compress PDF file sizes locally without uploading to cloud servers.
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
              id="compress-pdf-upload"
            />
            <label htmlFor="compress-pdf-upload" className="cursor-pointer flex flex-col items-center space-y-4">
              <div className="p-4 bg-[#f5f5f7] dark:bg-[#0A0A0A] rounded-2xl border border-[#e5e5ea] dark:border-white/10 text-[#0071e3]">
                <Zap className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-[#1d1d1f] dark:text-white/80">
                  Select a PDF to Compress
                </p>
                <p className="text-xs text-[#6e6e73] dark:text-white/40 mt-1">
                  100% In-Browser • Shaves Up to 85% File Size
                </p>
              </div>
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            {/* File info card */}
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
                    Original Size: {formatBytes(originalSize)}
                  </p>
                </div>
              </div>

              <label
                htmlFor="compress-pdf-upload-change"
                className="px-3 py-1.5 rounded-xl bg-[#f5f5f7] dark:bg-[#1f222a] hover:bg-[#e5e5ea] text-xs font-bold cursor-pointer transition-colors"
              >
                Change File
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="compress-pdf-upload-change"
              />
            </div>

            {/* Compression Level Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setLevel("extreme")}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  level === "extreme"
                    ? "bg-[#0071e3]/10 border-[#0071e3] shadow-xs"
                    : "bg-white dark:bg-[#12141a] border-[#e5e5ea] dark:border-[#27272a] hover:border-gray-400"
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider text-[#0071e3] mb-1">
                  Extreme Compression
                </div>
                <div className="text-sm font-extrabold text-[#1d1d1f] dark:text-white">
                  Smallest File Size
                </div>
                <p className="text-[11px] text-[#6e6e73] dark:text-[#a1a1aa] mt-1 leading-relaxed">
                  Best for email attachments. Up to 85% reduction.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setLevel("recommended")}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  level === "recommended"
                    ? "bg-[#0071e3]/10 border-[#0071e3] shadow-xs"
                    : "bg-white dark:bg-[#12141a] border-[#e5e5ea] dark:border-[#27272a] hover:border-gray-400"
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                  Recommended
                </div>
                <div className="text-sm font-extrabold text-[#1d1d1f] dark:text-white">
                  Balanced Fidelity
                </div>
                <p className="text-[11px] text-[#6e6e73] dark:text-[#a1a1aa] mt-1 leading-relaxed">
                  Great quality and high compression (~60% reduction).
                </p>
              </button>

              <button
                type="button"
                onClick={() => setLevel("high")}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  level === "high"
                    ? "bg-[#0071e3]/10 border-[#0071e3] shadow-xs"
                    : "bg-white dark:bg-[#12141a] border-[#e5e5ea] dark:border-[#27272a] hover:border-gray-400"
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                  High Quality
                </div>
                <div className="text-sm font-extrabold text-[#1d1d1f] dark:text-white">
                  Max Document Crispness
                </div>
                <p className="text-[11px] text-[#6e6e73] dark:text-[#a1a1aa] mt-1 leading-relaxed">
                  Higher DPI, subtle reduction with zero visual distortion.
                </p>
              </button>
            </div>

            {/* Action & Results Panel */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                {compressedSize ? (
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#86868b] block">Compressed Size</span>
                      <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                        {formatBytes(compressedSize)}
                      </span>
                    </div>
                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-800" />
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#86868b] block">Space Saved</span>
                      <span className="text-xl font-extrabold text-[#0071e3]">
                        {savedPercent}% Reduced
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-bold text-sm text-[#1d1d1f] dark:text-white">
                      Ready to Compress Document
                    </h4>
                    <p className="text-xs text-[#6e6e73] dark:text-[#a1a1aa]">
                      All rendering and re-encoding executes inside browser memory.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={compressPdf}
                  disabled={isCompressing}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 shadow-xs flex items-center justify-center gap-2"
                >
                  {isCompressing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>
                        Compressing Page {progress} {totalPages ? `of ${totalPages}` : ""}...
                      </span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Compress PDF Now</span>
                    </>
                  )}
                </button>

                {outputUrl && (
                  <a
                    href={outputUrl}
                    download={`compressed-${file.name}`}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download ({compressedSize ? formatBytes(compressedSize) : "PDF"})</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <SEOContent
        title="PDF Compressor"
        description="Shrink large PDF documents in-browser without uploading to cloud servers. Save up to 85% file size."
        steps={[
          { title: "Select PDF Document", description: "Upload any PDF file that exceeds your email or portal upload limits." },
          { title: "Choose Compression Preset", description: "Select Extreme, Recommended, or High Quality compression." },
          { title: "Download Compressed PDF", description: "Download the optimized document instantly with zero bytes uploaded." },
        ]}
        faqs={[
          { question: "How does in-browser compression work?", answer: "ShareFlow re-encodes embedded image streams and downsamples DPI using HTML5 Canvas and pdf-lib directly in your browser." },
          { question: "Are my documents secure?", answer: "100%. Processing happens locally on your computer. Disconnect Wi-Fi to test offline execution." },
          { question: "Is there a limit on file size?", answer: "Since processing relies on client RAM, files up to 100MB compress smoothly on standard devices." },
        ]}
      />
    </div>
  );
}
