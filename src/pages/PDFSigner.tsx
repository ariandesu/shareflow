import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Download, PenTool, Check, RotateCcw, FileText, Stamp, ShieldCheck, RefreshCw, Eye } from "lucide-react";
import { SEOContent } from "../components/SEOContent";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export default function PDFSigner() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [targetPage, setTargetPage] = useState(1);
  const [signatureMode, setSignatureMode] = useState<"draw" | "type">("draw");

  // Typed signature state
  const [typedName, setTypedName] = useState("");
  const [penColor, setPenColor] = useState<"#002d72" | "#000000">("#002d72"); // Blue ink or Black ink

  // Placement Position
  const [placement, setPlacement] = useState<"bottom_right" | "bottom_left" | "bottom_center">("bottom_right");
  const [signatureScale, setSignatureScale] = useState(120); // width in points

  // Canvas ref for drawing
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Preview & output
  const [pagePreviewUrl, setPagePreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  // Handle PDF file upload
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
      setTargetPage(pdf.numPages); // Default to last page for signing contracts

      await renderPagePreview(pdf, pdf.numPages);
    } catch (err) {
      console.error("Failed to load PDF:", err);
      alert("Invalid or encrypted PDF file.");
    }
  };

  const renderPagePreview = async (pdfDoc: any, pageNum: number) => {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 0.5 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    await (page.render as any)({ canvasContext: ctx, viewport }).promise;
    setPagePreviewUrl(canvas.toDataURL("image/jpeg", 0.8));
  };

  // Drawing Canvas setup
  useEffect(() => {
    if (signatureMode === "draw" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = penColor;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }
  }, [signatureMode, penColor]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
    }
  };

  // Helper to get PNG data of signature
  const getSignaturePngBytes = async (): Promise<Uint8Array | null> => {
    if (signatureMode === "draw") {
      const canvas = canvasRef.current;
      if (!canvas || !hasSignature) return null;
      const dataUrl = canvas.toDataURL("image/png");
      const base64 = dataUrl.split(",")[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return bytes;
    } else {
      // Create typed cursive canvas
      if (!typedName.trim()) return null;
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 150;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.font = "italic 44px 'Brush Script MT', 'Dancing Script', 'Caveat', cursive, sans-serif";
      ctx.fillStyle = penColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(typedName, canvas.width / 2, canvas.height / 2);

      const dataUrl = canvas.toDataURL("image/png");
      const base64 = dataUrl.split(",")[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return bytes;
    }
  };

  const signPdf = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const sigBytes = await getSignaturePngBytes();
      if (!sigBytes) {
        alert("Please draw or type your signature before applying.");
        setIsProcessing(false);
        return;
      }

      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      const pngImage = await doc.embedPng(sigBytes);

      const pages = doc.getPages();
      const targetIndex = Math.min(Math.max(1, targetPage), pages.length) - 1;
      const page = pages[targetIndex];
      const { width, height } = page.getSize();

      // Signature dimensions
      const sigWidth = signatureScale;
      const sigHeight = (sigWidth / pngImage.width) * pngImage.height;

      let posX = width - sigWidth - 40;
      let posY = 50;

      if (placement === "bottom_left") {
        posX = 40;
        posY = 50;
      } else if (placement === "bottom_center") {
        posX = width / 2 - sigWidth / 2;
        posY = 50;
      }

      page.drawImage(pngImage, {
        x: posX,
        y: posY,
        width: sigWidth,
        height: sigHeight,
      });

      const outBytes = await doc.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });

      if (outputUrl) URL.revokeObjectURL(outputUrl);
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
      setOutputSize(blob.size);
    } catch (err) {
      console.error("Signing failed:", err);
      alert("Failed to apply digital signature.");
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
          Client-Side PDF Signer
        </h1>
        <p className="text-[#6e6e73] dark:text-white/50 text-sm">
          Draw or type your signature and burn it directly into contracts locally. Zero fees, zero cloud storage.
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
              id="signer-pdf-upload"
            />
            <label htmlFor="signer-pdf-upload" className="cursor-pointer flex flex-col items-center space-y-4">
              <div className="p-4 bg-[#f5f5f7] dark:bg-[#0A0A0A] rounded-2xl border border-[#e5e5ea] dark:border-white/10 text-[#0071e3]">
                <PenTool className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-[#1d1d1f] dark:text-white/80">
                  Select a PDF Contract or Document to Sign
                </p>
                <p className="text-xs text-[#6e6e73] dark:text-white/40 mt-1">
                  Private &amp; Confidential • No Documents Stored
                </p>
              </div>
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Signature Creator Panel */}
            <div className="lg:col-span-7 space-y-6 bg-white dark:bg-[#12141a] p-6 sm:p-8 rounded-3xl border border-[#e5e5ea] dark:border-[#27272a] shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#1d1d1f] dark:text-white flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-[#0071e3]" />
                  <span>Create Your Signature</span>
                </h3>

                {/* Ink Color Selector */}
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setPenColor("#002d72")}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      penColor === "#002d72" ? "border-[#0071e3] scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: "#002d72" }}
                    title="Blue Ink"
                  />
                  <button
                    type="button"
                    onClick={() => setPenColor("#000000")}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      penColor === "#000000" ? "border-[#0071e3] scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: "#000000" }}
                    title="Black Ink"
                  />
                </div>
              </div>

              {/* Mode Switcher */}
              <div className="flex p-1 bg-[#f5f5f7] dark:bg-[#1a1d24] rounded-2xl border border-[#e5e5ea] dark:border-[#27272a] text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSignatureMode("draw")}
                  className={`flex-1 py-2 rounded-xl transition-all ${
                    signatureMode === "draw"
                      ? "bg-white dark:bg-[#27272a] text-[#0071e3] dark:text-white shadow-xs"
                      : "text-[#6e6e73] dark:text-[#a1a1aa]"
                  }`}
                >
                  Draw Signature
                </button>
                <button
                  type="button"
                  onClick={() => setSignatureMode("type")}
                  className={`flex-1 py-2 rounded-xl transition-all ${
                    signatureMode === "type"
                      ? "bg-white dark:bg-[#27272a] text-[#0071e3] dark:text-white shadow-xs"
                      : "text-[#6e6e73] dark:text-[#a1a1aa]"
                  }`}
                >
                  Type Name
                </button>
              </div>

              {/* Draw or Type Area */}
              {signatureMode === "draw" ? (
                <div className="space-y-2">
                  <div className="w-full h-44 rounded-2xl bg-[#fbfbfd] dark:bg-[#0A0A0A] border-2 border-dashed border-[#d2d2d7] dark:border-white/20 relative overflow-hidden flex items-center justify-center shadow-inner">
                    <canvas
                      ref={canvasRef}
                      width={500}
                      height={180}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full h-full cursor-crosshair touch-none"
                    />
                    {!hasSignature && (
                      <span className="absolute pointer-events-none text-xs text-[#86868b] uppercase tracking-wider font-semibold">
                        Sign Here with Mouse or Touch
                      </span>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="text-xs text-[#6e6e73] hover:text-red-500 font-bold flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Clear Canvas</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    placeholder="Type your legal full name..."
                    className="w-full px-4 py-3 rounded-xl bg-[#f5f5f7] dark:bg-[#1a1d24] border border-[#e5e5ea] dark:border-[#27272a] font-bold text-sm outline-none focus:border-[#0071e3]"
                  />
                  {typedName && (
                    <div className="p-4 rounded-xl bg-[#fbfbfd] dark:bg-[#0A0A0A] border border-[#e5e5ea] dark:border-white/10 text-center">
                      <span
                        className="text-3xl italic"
                        style={{
                          color: penColor,
                          fontFamily: "'Brush Script MT', 'Dancing Script', cursive, sans-serif",
                        }}
                      >
                        {typedName}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Placement Settings */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold uppercase tracking-wider text-[#86868b] block mb-2">
                    Target Page (Total: {pageCount})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={pageCount}
                    value={targetPage}
                    onChange={(e) => setTargetPage(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f5f5f7] dark:bg-[#1a1d24] border border-[#e5e5ea] dark:border-[#27272a] font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold uppercase tracking-wider text-[#86868b] block mb-2">
                    Stamp Position
                  </label>
                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f5f5f7] dark:bg-[#1a1d24] border border-[#e5e5ea] dark:border-[#27272a] font-bold outline-none"
                  >
                    <option value="bottom_right">Bottom Right</option>
                    <option value="bottom_left">Bottom Left</option>
                    <option value="bottom_center">Bottom Center</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#e5e5ea] dark:border-[#27272a] flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={signPdf}
                  disabled={isProcessing}
                  className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Burning Signature to PDF...</span>
                    </>
                  ) : (
                    <>
                      <Stamp className="w-4 h-4" />
                      <span>Sign &amp; Burn PDF</span>
                    </>
                  )}
                </button>

                {outputUrl && (
                  <a
                    href={outputUrl}
                    download={`signed-${file.name}`}
                    className="w-full sm:w-auto py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Signed PDF ({outputSize ? formatBytes(outputSize) : ""})</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Page Preview with Signature Stamp Simulation */}
            <div className="lg:col-span-5 bg-white dark:bg-[#12141a] p-6 rounded-3xl border border-[#e5e5ea] dark:border-[#27272a] shadow-xs flex flex-col items-center space-y-4">
              <div className="w-full flex items-center justify-between text-xs font-bold text-[#86868b]">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#0071e3]" />
                  <span>Page {targetPage} Stamp Simulation</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>0 Cloud Egress</span>
                </span>
              </div>

              {pagePreviewUrl && (
                <div className="w-full aspect-[3/4] bg-[#f5f5f7] dark:bg-[#0A0A0A] rounded-2xl overflow-hidden border border-[#e5e5ea] dark:border-white/10 relative flex items-center justify-center p-2 shadow-inner">
                  <img
                    src={pagePreviewUrl}
                    alt="Page Preview"
                    className="max-w-full max-h-full object-contain pointer-events-none"
                  />

                  {/* Simulated Signature Stamp on Document */}
                  <div
                    className={`absolute pointer-events-none p-1.5 border border-dashed border-[#0071e3]/40 rounded-lg ${
                      placement === "bottom_right"
                        ? "bottom-6 right-6"
                        : placement === "bottom_left"
                        ? "bottom-6 left-6"
                        : "bottom-6 left-1/2 -translate-x-1/2"
                    }`}
                  >
                    {signatureMode === "draw" && hasSignature ? (
                      <span className="text-[10px] font-bold text-[#0071e3] uppercase">
                        ✓ Handwritten Signature
                      </span>
                    ) : typedName ? (
                      <span
                        className="text-lg italic"
                        style={{
                          color: penColor,
                          fontFamily: "'Brush Script MT', 'Dancing Script', cursive, sans-serif",
                        }}
                      >
                        {typedName}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#86868b] uppercase tracking-wider">
                        Signature Box
                      </span>
                    )}
                  </div>
                </div>
              )}

              <p className="text-[11px] text-[#86868b] dark:text-[#71717a] text-center leading-relaxed">
                Signature is permanently rasterized and embedded into the PDF content stream using <code>pdf-lib</code>.
              </p>
            </div>
          </div>
        )}
      </motion.div>

      <SEOContent
        title="Client-Side PDF Signer"
        description="Sign contracts, NDAs, and PDF agreements directly in your browser with zero document uploads."
        steps={[
          { title: "Select PDF Contract", description: "Upload the document you need to sign." },
          { title: "Draw or Type Signature", description: "Use our smooth canvas pen or type your legal full name." },
          { title: "Sign & Download", description: "Burn the signature into the vector stream and download instantly." },
        ]}
        faqs={[
          { question: "Is this signature legally binding?", answer: "In many jurisdictions, electronic signatures created with intent are legally recognized under ESIGN and eIDAS regulations." },
          { question: "Do you store a copy of my signature or contract?", answer: "No. Everything runs strictly in your browser memory. We never receive or store your documents." },
          { question: "Can I choose which page to sign?", answer: "Yes, you can target any page number in multi-page contracts." },
        ]}
      />
    </div>
  );
}
