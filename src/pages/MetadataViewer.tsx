import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Copy, FileSearch } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

interface MetadataEntry {
  key: string;
  value: string;
  category: string;
}

export default function MetadataViewer() {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<MetadataEntry[]>([]);
  const [preview, setPreview] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    const entries: MetadataEntry[] = [];

    // General metadata
    entries.push({ key: "File Name", value: selected.name, category: "General" });
    entries.push({ key: "File Size", value: formatBytes(selected.size), category: "General" });
    entries.push({ key: "MIME Type", value: selected.type || "unknown", category: "General" });
    entries.push({ key: "Last Modified", value: new Date(selected.lastModified).toLocaleString(), category: "General" });

    // Image-specific
    if (selected.type.startsWith("image/")) {
      if (preview) URL.revokeObjectURL(preview);
      const url = URL.createObjectURL(selected);
      setPreview(url);
      
      try {
        const img = await loadImage(url);
        entries.push({ key: "Width", value: `${img.width}px`, category: "Image" });
        entries.push({ key: "Height", value: `${img.height}px`, category: "Image" });
        entries.push({ key: "Aspect Ratio", value: getAspectRatio(img.width, img.height), category: "Image" });
        entries.push({ key: "Megapixels", value: ((img.width * img.height) / 1_000_000).toFixed(2) + " MP", category: "Image" });
      } catch {}

      // Try to extract EXIF
      try {
        const buffer = await selected.arrayBuffer();
        const exifData = parseExif(new Uint8Array(buffer));
        exifData.forEach(e => entries.push({ ...e, category: "EXIF" }));
      } catch {}
    }

    // PDF-specific
    if (selected.type === "application/pdf") {
      try {
        const { PDFDocument } = await import("pdf-lib");
        const buffer = await selected.arrayBuffer();
        const pdf = await PDFDocument.load(buffer);
        entries.push({ key: "Page Count", value: String(pdf.getPageCount()), category: "PDF" });
        const title = pdf.getTitle();
        if (title) entries.push({ key: "Title", value: title, category: "PDF" });
        const author = pdf.getAuthor();
        if (author) entries.push({ key: "Author", value: author, category: "PDF" });
        const subject = pdf.getSubject();
        if (subject) entries.push({ key: "Subject", value: subject, category: "PDF" });
        const creator = pdf.getCreator();
        if (creator) entries.push({ key: "Creator", value: creator, category: "PDF" });
        const producer = pdf.getProducer();
        if (producer) entries.push({ key: "Producer", value: producer, category: "PDF" });
        const created = pdf.getCreationDate();
        if (created) entries.push({ key: "Creation Date", value: created.toLocaleString(), category: "PDF" });
        const modified = pdf.getModificationDate();
        if (modified) entries.push({ key: "Modification Date", value: modified.toLocaleString(), category: "PDF" });
        
        // Get first page dimensions
        const firstPage = pdf.getPage(0);
        const { width, height } = firstPage.getSize();
        entries.push({ key: "Page Size", value: `${Math.round(width)} × ${Math.round(height)} pts`, category: "PDF" });
      } catch {}
    }

    // Audio/Video
    if (selected.type.startsWith("audio/") || selected.type.startsWith("video/")) {
      try {
        const url = URL.createObjectURL(selected);
        const media = document.createElement(selected.type.startsWith("video/") ? "video" : "audio");
        await new Promise<void>((resolve) => {
          media.onloadedmetadata = () => {
            entries.push({ key: "Duration", value: formatDuration(media.duration), category: "Media" });
            if (media instanceof HTMLVideoElement) {
              entries.push({ key: "Video Width", value: `${media.videoWidth}px`, category: "Media" });
              entries.push({ key: "Video Height", value: `${media.videoHeight}px`, category: "Media" });
            }
            resolve();
          };
          media.src = url;
        });
        if (selected.type.startsWith("video/")) setPreview(url);
      } catch {}
    }

    setMetadata(entries);
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const parseExif = (data: Uint8Array): { key: string; value: string }[] => {
    const results: { key: string; value: string }[] = [];
    // Simple EXIF parser for JPEG
    if (data[0] !== 0xFF || data[1] !== 0xD8) return results;

    let offset = 2;
    while (offset < data.length - 1) {
      if (data[offset] !== 0xFF) break;
      const marker = data[offset + 1];
      if (marker === 0xE1) {
        // APP1 (EXIF)
        const length = (data[offset + 2] << 8) | data[offset + 3];
        const exifStr = String.fromCharCode(data[offset + 4], data[offset + 5], data[offset + 6], data[offset + 7]);
        if (exifStr === "Exif") {
          results.push({ key: "EXIF Data", value: "Present" });
          // Parse TIFF header
          const tiffOffset = offset + 10;
          const isLE = data[tiffOffset] === 0x49;
          const getU16 = (o: number) => isLE ? (data[o] | (data[o+1] << 8)) : ((data[o] << 8) | data[o+1]);
          const getU32 = (o: number) => isLE
            ? (data[o] | (data[o+1] << 8) | (data[o+2] << 16) | (data[o+3] << 24))
            : ((data[o] << 24) | (data[o+1] << 16) | (data[o+2] << 8) | data[o+3]);

          const ifdOffset = tiffOffset + getU32(tiffOffset + 4);
          const entries = getU16(ifdOffset);
          const tagNames: Record<number, string> = {
            0x010F: "Camera Make", 0x0110: "Camera Model", 0x0112: "Orientation",
            0x011A: "X Resolution", 0x011B: "Y Resolution", 0x0128: "Resolution Unit",
            0x0132: "Date/Time", 0x8769: "EXIF IFD", 0x8825: "GPS IFD",
            0xA002: "Pixel X Dimension", 0xA003: "Pixel Y Dimension",
          };
          for (let i = 0; i < entries && i < 50; i++) {
            const entryOffset = ifdOffset + 2 + i * 12;
            if (entryOffset + 12 > data.length) break;
            const tag = getU16(entryOffset);
            const type = getU16(entryOffset + 2);
            const count = getU32(entryOffset + 4);
            const tagName = tagNames[tag];
            if (tagName && tag !== 0x8769 && tag !== 0x8825) {
              let value = "";
              if (type === 2) { // ASCII
                const strOffset = count > 4 ? tiffOffset + getU32(entryOffset + 8) : entryOffset + 8;
                for (let j = 0; j < count - 1 && strOffset + j < data.length; j++) {
                  value += String.fromCharCode(data[strOffset + j]);
                }
              } else if (type === 3) { // SHORT
                value = String(getU16(entryOffset + 8));
              } else if (type === 4) { // LONG
                value = String(getU32(entryOffset + 8));
              }
              if (value) results.push({ key: tagName, value });
            }
          }
        }
        offset += 2 + length;
      } else if (marker === 0xDA) {
        break;
      } else {
        const length = (data[offset + 2] << 8) | data[offset + 3];
        offset += 2 + length;
      }
    }
    return results;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
  };

  const getAspectRatio = (w: number, h: number) => {
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const d = gcd(w, h);
    return `${w / d}:${h / d}`;
  };

  const copyAll = () => {
    const text = metadata.map(m => `${m.key}: ${m.value}`).join("\n");
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = [...new Set(metadata.map(m => m.category))];

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Metadata Viewer</h1>
        <p className="text-white/50 text-sm">Inspect file metadata, EXIF data, and document properties — entirely in your browser.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 flex-1 flex flex-col">
        {!file ? (
          <div className="flex-1 border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center p-12 transition-colors hover:border-white/40">
            <input type="file" onChange={handleFileUpload} className="hidden" id="meta-upload" />
            <label htmlFor="meta-upload" className="cursor-pointer flex flex-col items-center space-y-4">
              <div className="p-4 bg-[#0A0A0A] rounded-full border border-white/10">
                <FileSearch className="w-8 h-8 text-white/50" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-white/80">Upload any file</p>
                <p className="text-xs text-white/40 mt-1">Images, PDFs, audio, video — any file type</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-1">
            {/* Preview */}
            {preview && (
              <div className="bg-[#0A0A0A] border border-white/10 p-4 flex items-center justify-center">
                {file.type.startsWith("video/") ? (
                  <video src={preview} controls className="max-w-full max-h-[400px]" />
                ) : (
                  <img src={preview} alt="Preview" className="max-w-full max-h-[400px] object-contain" />
                )}
              </div>
            )}

            {/* Metadata table */}
            <div className={`bg-white/5 p-6 border border-white/10 flex flex-col space-y-6 ${preview ? "lg:col-span-2" : "lg:col-span-3"}`}>
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">{metadata.length} Properties</h3>
                <div className="flex gap-3">
                  <button onClick={copyAll} className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white flex items-center gap-1">
                    <Copy className="w-3 h-3" />{copied ? "Copied!" : "Copy All"}
                  </button>
                  <button onClick={() => { setFile(null); setMetadata([]); setPreview(""); }} className="text-xs font-bold uppercase tracking-widest text-white hover:text-white/80 underline underline-offset-4">
                    Change File
                  </button>
                </div>
              </div>

              <div className="space-y-6 overflow-y-auto flex-1">
                {categories.map(cat => (
                  <div key={cat} className="space-y-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30 pb-2 border-b border-white/5">{cat}</h4>
                    {metadata.filter(m => m.category === cat).map((entry, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-[#0A0A0A] border border-white/10">
                        <span className="text-xs font-bold text-white/60">{entry.key}</span>
                        <span className="text-xs font-mono text-white/80 text-right max-w-[60%] break-all">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <SEOContent
        title="Metadata Viewer"
        description="View detailed metadata for any file including images, PDFs, audio, and video. Extract EXIF data, document properties, and more."
        steps={[
          { title: "Upload a file", description: "Select any file from your device — images, PDFs, audio, video, or any other file." },
          { title: "View metadata", description: "See all available metadata organized by category (General, EXIF, PDF, Media)." },
          { title: "Copy results", description: "Copy all metadata to your clipboard with one click." },
        ]}
        faqs={[
          { question: "What metadata can be extracted?", answer: "General file info (name, size, type), image dimensions and EXIF data, PDF document properties, and audio/video duration and resolution." },
          { question: "Is my file uploaded?", answer: "No. All analysis happens locally in your browser. Your file never leaves your device." },
          { question: "What is EXIF data?", answer: "EXIF (Exchangeable Image File Format) data is metadata embedded in photos by cameras, including camera model, GPS coordinates, exposure settings, and more." },
        ]}
      />
    </div>
  );
}
