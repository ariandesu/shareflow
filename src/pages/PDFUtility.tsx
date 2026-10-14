import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Scissors,
  RotateCw,
  Stamp,
  PenTool,
  Zap,
  Trash2,
  Image as ImageIcon,
  BookOpen,
  ScanText,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

// Sub-tools
import PDFMerger from "./PDFMerger";
import PDFSplitter from "./PDFSplitter";
import PDFRotator from "./PDFRotator";
import PDFWatermark from "./PDFWatermark";
import PDFSigner from "./PDFSigner";
import PDFCompressor from "./PDFCompressor";
import PDFPageRemover from "./PDFPageRemover";
import PDFToImages from "./PDFToImages";
import ImagesToPDF from "./ImagesToPDF";
import PDFTextExtractor from "./PDFTextExtractor";

type PDFTab =
  | "merge"
  | "split"
  | "rotate"
  | "watermark"
  | "sign"
  | "compress"
  | "remove"
  | "to-images"
  | "from-images"
  | "extract";

export function PDFUtility() {
  const [activeTab, setActiveTab] = useState<PDFTab>("merge");

  const pdfTools = [
    { id: "merge" as PDFTab, label: "Merge PDFs", icon: FileText, color: "text-[#0071e3]" },
    { id: "split" as PDFTab, label: "Split PDF", icon: Scissors, color: "text-amber-500" },
    { id: "rotate" as PDFTab, label: "Rotate & Reorder", icon: RotateCw, color: "text-emerald-500" },
    { id: "watermark" as PDFTab, label: "Watermark & Number", icon: Stamp, color: "text-purple-500" },
    { id: "sign" as PDFTab, label: "Sign Contract", icon: PenTool, color: "text-blue-500" },
    { id: "compress" as PDFTab, label: "Compress PDF", icon: Zap, color: "text-amber-600" },
    { id: "remove" as PDFTab, label: "Remove Pages", icon: Trash2, color: "text-red-500" },
    { id: "to-images" as PDFTab, label: "PDF to Images", icon: ImageIcon, color: "text-cyan-500" },
    { id: "from-images" as PDFTab, label: "Images to PDF", icon: BookOpen, color: "text-indigo-500" },
    { id: "extract" as PDFTab, label: "Extract Text & OCR", icon: ScanText, color: "text-teal-500" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 pb-16 text-[#1d1d1f] dark:text-[#f5f5f7]">
      {/* Studio Header */}
      <div className="text-center pt-4 sm:pt-6 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#0071e3]/10 text-[#0071e3] dark:text-[#38bdf8] border border-[#0071e3]/20 mb-4 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ZERO-KNOWLEDGE PDF UTILITY SUITE • 100% IN-BROWSER</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1d1d1f] dark:text-white max-w-3xl leading-tight">
          Streamline PDF Utility Studio
        </h1>
        <p className="text-sm sm:text-base text-[#6e6e73] dark:text-[#a1a1aa] max-w-2xl mt-3 leading-relaxed">
          Merge, split, rotate, watermark, digitally sign, compress, and extract OCR text from PDF documents in one unified workspace with zero server uploads.
        </p>
      </div>

      {/* Streamlined Tools Ribbon */}
      <div className="flex items-center p-1.5 bg-white dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] rounded-2xl shadow-xs overflow-x-auto gap-1">
        {pdfTools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTab === tool.id;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => setActiveTab(tool.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[#0071e3] text-white shadow-xs"
                  : "text-[#6e6e73] dark:text-[#a1a1aa] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#1a1d24]"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : tool.color}`} />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Active Tool Workspace */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === "merge" && <PDFMerger />}
            {activeTab === "split" && <PDFSplitter />}
            {activeTab === "rotate" && <PDFRotator />}
            {activeTab === "watermark" && <PDFWatermark />}
            {activeTab === "sign" && <PDFSigner />}
            {activeTab === "compress" && <PDFCompressor />}
            {activeTab === "remove" && <PDFPageRemover />}
            {activeTab === "to-images" && <PDFToImages />}
            {activeTab === "from-images" && <ImagesToPDF />}
            {activeTab === "extract" && <PDFTextExtractor />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
