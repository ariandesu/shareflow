import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Download, Stamp, Hash, Check, RefreshCw, FileText, Sliders, Eye } from "lucide-react";
import { SEOContent } from "../components/SEOContent";
import { PDFDocument, degrees, rgb, StandardFonts } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

type WatermarkMode = "watermark" | "numbering";

export default function PDFWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<WatermarkMode>("watermark");

  // Watermark state
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.3);
  const [angle, setAngle] = useState(45);
  const [colorPreset, setColorPreset] = useState<"red" | "gray" | "blue" | "black">("gray");

  // Numbering state
  const [numberFormat, setNumberFormat] = useState<"page_x_of_y" | "page_x" | "num_only">("page_x_of_y");
  const [position, setPosition] = useState<"bottom_center" | "bottom_right" | "top_right" | "bottom_left">("bottom_center");
  const [numberFontSize, setNumberFontSize] = useState(12);

  // Page Scope
  const [pageScope, setPageScope] = useState<"all" | "custom">("all");
  const [customRange, setCustomRange] = useState("1-");

  // Previews & Outputs
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl(null);
    setOutputSize(null);
    setFile(selected);

    try {
      const buffer = await selected.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      setPageCount(pdf.numPages);

      // Render page 1 preview
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.5 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;
      await (page.render as any)({ canvasContext: ctx, viewport }).promise;

      setPreviewUrl(canvas.toDataURL("image/jpeg", 0.8));
    } catch (err) {
      console.error("Failed to load PDF:", err);
      alert("Invalid or encrypted PDF file.");
    }
  };

  const getColorRgb = () => {
    switch (colorPreset) {
      case "red":
        return rgb(0.85, 0.1, 0.1);
      case "blue":
        return rgb(0.0, 0.44, 0.89);
      case "black":
        return rgb(0.1, 0.1, 0.1);
      case "gray":
      default:
        return rgb(0.5, 0.5, 0.5);
    }
  };

  const applyWatermarkOrNumbers = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const regularFont = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const total = pages.length;

      const textColor = getColorRgb();

      for (let i = 0; i < total; i++) {
        const page = pages[i];
        const pageNum = i + 1;
        const { width, height } = page.getSize();

        // Check scope
        if (pageScope === "custom" && customRange.trim()) {
          // simple range check
          const [startStr, endStr] = customRange.split("-");
          const start = parseInt(startStr, 10) || 1;
          const end = parseInt(endStr, 10) || total;
          if (pageNum < start || pageNum > end) continue;
        }

        if (mode === "watermark") {
          // Measure text width for centering
          const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
          const textHeight = font.heightAtSize(fontSize);

          // Center coordinate
          const centerX = width / 2;
          const centerY = height / 2;

          page.drawText(watermarkText, {
            x: centerX - (textWidth / 2) * Math.cos((angle * Math.PI) / 180),
            y: centerY - (textWidth / 2) * Math.sin((angle * Math.PI) / 180),
            size: fontSize,
            font,
            color: textColor,
            opacity: opacity,
            rotate: degrees(angle),
          });
        } else {
          // Page Numbering
          let pageText = "";
          if (numberFormat === "page_x_of_y") {
            pageText = `Page ${pageNum} of ${total}`;
          } else if (numberFormat === "page_x") {
            pageText = `Page ${pageNum}`;
          } else {
            pageText = `${pageNum}`;
          }

          const textWidth = regularFont.widthOfTextAtSize(pageText, numberFontSize);
          let posX = width / 2 - textWidth / 2;
          let posY = 25;

          if (position === "bottom_right") {
            posX = width - textWidth - 30;
            posY = 25;
          } else if (position === "bottom_left") {
            posX = 30;
            posY = 25;
          } else if (position === "top_right") {
            posX = width - textWidth - 30;
            posY = height - 30;
          }

          page.drawText(pageText, {
            x: posX,
            y: posY,
            size: numberFontSize,
            font: regularFont,
            color: rgb(0.2, 0.2, 0.2),
            opacity: 0.85,
          });
        }
      }

      const outBytes = await doc.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });

      if (outputUrl) URL.revokeObjectURL(outputUrl);
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
      setOutputSize(blob.size);
    } catch (err) {
      console.error("Failed to apply watermark:", err);
      alert("Failed to process watermark. Please try another file.");
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
          PDF Watermark &amp; Page Numbers
        </h1>
        <p className="text-[#6e6e73] dark:text-white/50 text-sm">
          Stamp diagonal security watermarks or automated pagination across PDF pages 100% in-browser.
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
              id="watermark-pdf-upload"
            />
            <label htmlFor="watermark-pdf-upload" className="cursor-pointer flex flex-col items-center space-y-4">
              <div className="p-4 bg-[#f5f5f7] dark:bg-[#0A0A0A] rounded-2xl border border-[#e5e5ea] dark:border-white/10 text-[#0071e3]">
                <Stamp className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-[#1d1d1f] dark:text-white/80">
                  Select a PDF Document to Stamp
                </p>
                <p className="text-xs text-[#6e6e73] dark:text-white/40 mt-1">
                  100% Client-Side • Secure AES &amp; PDF-Lib Sandbox
                </p>
              </div>
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Settings Configuration */}
            <div className="lg:col-span-7 space-y-6 bg-white dark:bg-[#12141a] p-6 sm:p-8 rounded-3xl border border-[#e5e5ea] dark:border-[#27272a] shadow-xs">
              {/* Tool Mode Tabs */}
              <div className="flex items-center p-1 bg-[#f5f5f7] dark:bg-[#1a1d24] rounded-2xl border border-[#e5e5ea] dark:border-[#27272a] text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setMode("watermark")}
                  className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
                    mode === "watermark"
                      ? "bg-white dark:bg-[#27272a] text-[#0071e3] dark:text-white shadow-xs"
                      : "text-[#6e6e73] dark:text-[#a1a1aa] hover:text-[#1d1d1f]"
                  }`}
                >
                  <Stamp className="w-4 h-4" />
                  <span>Text Watermark</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode("numbering")}
                  className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
                    mode === "numbering"
                      ? "bg-white dark:bg-[#27272a] text-[#0071e3] dark:text-white shadow-xs"
                      : "text-[#6e6e73] dark:text-[#a1a1aa] hover:text-[#1d1d1f]"
                  }`}
                >
                  <Hash className="w-4 h-4" />
                  <span>Page Numbers (Bates)</span>
                </button>
              </div>

              {/* Watermark Configuration Form */}
              {mode === "watermark" ? (
                <div className="space-y-5 text-xs">
                  <div>
                    <label className="font-bold uppercase tracking-wider text-[#86868b] block mb-2">
                      Watermark Text
                    </label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#f5f5f7] dark:bg-[#1a1d24] border border-[#e5e5ea] dark:border-[#27272a] font-bold text-sm outline-none focus:border-[#0071e3]"
                      placeholder="e.g. CONFIDENTIAL, DRAFT"
                    />
                    {/* Preset quick pills */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["CONFIDENTIAL", "DRAFT", "DO NOT COPY", "INTERNAL ONLY", "SAMPLE"].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setWatermarkText(preset)}
                          className="px-2.5 py-1 rounded-lg bg-[#f5f5f7] dark:bg-[#1f222a] hover:bg-[#e5e5ea] text-[10px] font-semibold text-[#6e6e73] dark:text-[#a1a1aa] transition-colors"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between font-bold uppercase tracking-wider text-[#86868b] mb-1">
                        <span>Font Size</span>
                        <span>{fontSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="16"
                        max="96"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full accent-[#0071e3]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between font-bold uppercase tracking-wider text-[#86868b] mb-1">
                        <span>Opacity</span>
                        <span>{Math.round(opacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="90"
                        value={Math.round(opacity * 100)}
                        onChange={(e) => setOpacity(Number(e.target.value) / 100)}
                        className="w-full accent-[#0071e3]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold uppercase tracking-wider text-[#86868b] block mb-2">
                        Angle Rotation
                      </label>
                      <div className="flex gap-2">
                        {[-45, 0, 45].map((ang) => (
                          <button
                            key={ang}
                            type="button"
                            onClick={() => setAngle(ang)}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                              angle === ang
                                ? "bg-[#0071e3] text-white border-[#0071e3]"
                                : "bg-[#f5f5f7] dark:bg-[#1a1d24] border-[#e5e5ea] dark:border-[#27272a] text-[#6e6e73]"
                            }`}
                          >
                            {ang}°
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="font-bold uppercase tracking-wider text-[#86868b] block mb-2">
                        Color Theme
                      </label>
                      <div className="flex gap-2">
                        {(["gray", "red", "blue", "black"] as const).map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setColorPreset(color)}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase border transition-colors ${
                              colorPreset === color
                                ? "border-[#0071e3] bg-[#0071e3]/10 text-[#0071e3] dark:text-[#38bdf8]"
                                : "bg-[#f5f5f7] dark:bg-[#1a1d24] border-[#e5e5ea] dark:border-[#27272a] text-[#6e6e73]"
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Page Numbering Form */
                <div className="space-y-5 text-xs">
                  <div>
                    <label className="font-bold uppercase tracking-wider text-[#86868b] block mb-2">
                      Numbering Format
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setNumberFormat("page_x_of_y")}
                        className={`py-2.5 px-2 rounded-xl text-center font-bold border transition-colors ${
                          numberFormat === "page_x_of_y"
                            ? "bg-[#0071e3] text-white border-[#0071e3]"
                            : "bg-[#f5f5f7] dark:bg-[#1a1d24] border-[#e5e5ea] dark:border-[#27272a]"
                        }`}
                      >
                        Page 1 of {pageCount}
                      </button>
                      <button
                        type="button"
                        onClick={() => setNumberFormat("page_x")}
                        className={`py-2.5 px-2 rounded-xl text-center font-bold border transition-colors ${
                          numberFormat === "page_x"
                            ? "bg-[#0071e3] text-white border-[#0071e3]"
                            : "bg-[#f5f5f7] dark:bg-[#1a1d24] border-[#e5e5ea] dark:border-[#27272a]"
                        }`}
                      >
                        Page 1
                      </button>
                      <button
                        type="button"
                        onClick={() => setNumberFormat("num_only")}
                        className={`py-2.5 px-2 rounded-xl text-center font-bold border transition-colors ${
                          numberFormat === "num_only"
                            ? "bg-[#0071e3] text-white border-[#0071e3]"
                            : "bg-[#f5f5f7] dark:bg-[#1a1d24] border-[#e5e5ea] dark:border-[#27272a]"
                        }`}
                      >
                        1
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold uppercase tracking-wider text-[#86868b] block mb-2">
                        Position
                      </label>
                      <select
                        value={position}
                        onChange={(e) => setPosition(e.target.value as any)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#f5f5f7] dark:bg-[#1a1d24] border border-[#e5e5ea] dark:border-[#27272a] font-bold outline-none"
                      >
                        <option value="bottom_center">Bottom Center</option>
                        <option value="bottom_right">Bottom Right</option>
                        <option value="bottom_left">Bottom Left</option>
                        <option value="top_right">Top Right</option>
                      </select>
                    </div>
                    <div>
                      <div className="flex justify-between font-bold uppercase tracking-wider text-[#86868b] mb-1">
                        <span>Font Size</span>
                        <span>{numberFontSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="9"
                        max="24"
                        value={numberFontSize}
                        onChange={(e) => setNumberFontSize(Number(e.target.value))}
                        className="w-full accent-[#0071e3] mt-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#e5e5ea] dark:border-[#27272a] flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={applyWatermarkOrNumbers}
                  disabled={isProcessing}
                  className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing Document...</span>
                    </>
                  ) : (
                    <>
                      <Stamp className="w-4 h-4" />
                      <span>Apply {mode === "watermark" ? "Watermark" : "Pagination"}</span>
                    </>
                  )}
                </button>

                {outputUrl && (
                  <a
                    href={outputUrl}
                    download={`stamped-${file.name}`}
                    className="w-full sm:w-auto py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download ({outputSize ? formatBytes(outputSize) : "PDF"})</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Live Document Preview */}
            <div className="lg:col-span-5 bg-white dark:bg-[#12141a] p-6 rounded-3xl border border-[#e5e5ea] dark:border-[#27272a] shadow-xs flex flex-col items-center space-y-4">
              <div className="w-full flex items-center justify-between text-xs font-bold text-[#86868b]">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#0071e3]" />
                  <span>Page 1 Simulation</span>
                </span>
                <span>{pageCount} Total Pages</span>
              </div>

              {previewUrl && (
                <div className="w-full aspect-[3/4] bg-[#f5f5f7] dark:bg-[#0A0A0A] rounded-2xl overflow-hidden border border-[#e5e5ea] dark:border-white/10 relative flex items-center justify-center p-2 shadow-inner">
                  <img
                    src={previewUrl}
                    alt="Document preview"
                    className="max-w-full max-h-full object-contain pointer-events-none"
                  />

                  {/* HTML/CSS Simulated Watermark Overlay */}
                  {mode === "watermark" && (
                    <div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none"
                      style={{
                        transform: `rotate(${angle}deg)`,
                        opacity: opacity,
                        color:
                          colorPreset === "red"
                            ? "#ef4444"
                            : colorPreset === "blue"
                            ? "#0071e3"
                            : colorPreset === "black"
                            ? "#000000"
                            : "#6b7280",
                      }}
                    >
                      <span
                        className="font-black uppercase tracking-widest text-center truncate max-w-full px-4"
                        style={{ fontSize: `${fontSize * 0.45}px` }}
                      >
                        {watermarkText}
                      </span>
                    </div>
                  )}

                  {/* Simulated Page Numbering */}
                  {mode === "numbering" && (
                    <div
                      className={`absolute pointer-events-none font-sans font-semibold text-gray-800 dark:text-gray-200 ${
                        position === "bottom_center"
                          ? "bottom-3 left-0 right-0 text-center"
                          : position === "bottom_right"
                          ? "bottom-3 right-4 text-right"
                          : position === "bottom_left"
                          ? "bottom-3 left-4 text-left"
                          : "top-3 right-4 text-right"
                      }`}
                      style={{ fontSize: `${numberFontSize * 0.75}px` }}
                    >
                      {numberFormat === "page_x_of_y"
                        ? `Page 1 of ${pageCount}`
                        : numberFormat === "page_x"
                        ? "Page 1"
                        : "1"}
                    </div>
                  )}
                </div>
              )}

              <p className="text-[11px] text-[#86868b] dark:text-[#71717a] text-center leading-relaxed">
                Preview dynamically updates based on your opacity and rotation settings.
              </p>
            </div>
          </div>
        )}
      </motion.div>

      <SEOContent
        title="PDF Watermark & Page Numbers"
        description="Add diagonal security watermarks or automated pagination across PDF pages 100% in-browser."
        steps={[
          { title: "Select PDF Document", description: "Drop your PDF file into the local WebAssembly renderer." },
          { title: "Customize Text & Style", description: "Configure custom watermark copy, angle, opacity, or page numbers." },
          { title: "Render & Download", description: "Compile changes locally with pdf-lib and download immediately." },
        ]}
        faqs={[
          { question: "Is my document uploaded to a remote server?", answer: "Never. All text rendering and PDF serialization happen locally inside your browser." },
          { question: "Can the watermark be easily removed?", answer: "The watermark text is permanently burned into the PDF vector layer, making casual removal impossible." },
          { question: "Can I number hundreds of pages?", answer: "Yes! The tool automatically iterates through all pages and formats 'Page X of Y' in seconds." },
        ]}
      />
    </div>
  );
}
