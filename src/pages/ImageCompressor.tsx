import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Download, Image as ImageIcon } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(80);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [compressedUrl, setCompressedUrl] = useState<string>("");
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const generationRef = useRef(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setOriginalSize(selected.size);
      const url = URL.createObjectURL(selected);
      setOriginalUrl(url);
      compressImage(url, quality);
    }
  };

  const compressImage = (url: string, q: number) => {
    generationRef.current++;
    const currentGen = generationRef.current;
    const img = new Image();
    img.onload = () => {
      if (currentGen !== generationRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", q / 100);
      setCompressedUrl(dataUrl);
      
      // Calculate approximate size from base64 string
      const base64str = dataUrl.split(',')[1];
      const decoded = atob(base64str);
      setCompressedSize(decoded.length);
    };
    img.onerror = () => console.error("Failed to load image");
    img.src = url;
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = Number(e.target.value);
    setQuality(q);
    if (originalUrl) {
      compressImage(originalUrl, q);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Image Compressor</h1>
        <p className="text-white/50 text-sm">Compress JPEGs directly in your browser.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 flex-1 flex flex-col"
      >
        {!file ? (
          <div className="flex-1 border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center p-12 transition-colors hover:border-white/40">
            <input
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center space-y-4"
            >
              <div className="p-4 bg-[#0A0A0A] rounded-full border border-white/10">
                <Upload className="w-8 h-8 text-white/50" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-white/80">Click to upload an image</p>
                <p className="text-xs text-white/40 mt-1">JPEG, PNG, or WEBP up to 10MB</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
            <div className="bg-white/5 p-6 border border-white/10 flex flex-col space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Settings</h3>
                <button
                  onClick={() => {
                    setFile(null);
                    setOriginalUrl("");
                    setCompressedUrl("");
                  }}
                  className="text-xs font-bold uppercase tracking-widest text-white hover:text-white/80 underline underline-offset-4"
                >
                  Upload Another
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Quality</label>
                  <span className="text-xs font-mono text-white/80">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={handleQualityChange}
                  className="w-full accent-white"
                />
              </div>

              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center p-4 bg-[#0A0A0A] border border-white/10">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/50">Original Size</span>
                  <span className="text-sm font-mono text-white/80">{formatBytes(originalSize)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#0A0A0A] border border-white/10">
                  <span className="text-xs font-bold uppercase tracking-widest text-green-500/80">Compressed Size</span>
                  <span className="text-sm font-mono text-green-400">{formatBytes(compressedSize)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#0A0A0A] border border-white/10">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/50">Saved</span>
                  <span className="text-sm font-mono text-white/80">
                    {originalSize > 0 ? Math.round(((originalSize - compressedSize) / originalSize) * 100) : 0}%
                  </span>
                </div>
              </div>

              {compressedUrl && (
                <a
                  href={compressedUrl}
                  download={`compressed-${file.name.replace(/\.[^/.]+$/, "")}.jpg`}
                  className="block text-center bg-white text-black font-black uppercase tracking-widest text-xs py-4 px-6 mt-auto hover:bg-white/80 transition-colors"
                >
                  Download Compressed Image
                </a>
              )}
            </div>

            <div className="bg-[#0A0A0A] border border-white/10 p-4 flex flex-col justify-center items-center relative overflow-hidden">
              <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest bg-black/50 px-2 py-1 backdrop-blur-md">Preview</span>
              {compressedUrl ? (
                <img src={compressedUrl} alt="Compressed Preview" className="max-w-full max-h-[500px] object-contain" />
              ) : (
                <ImageIcon className="w-12 h-12 text-white/20 animate-pulse" />
              )}
            </div>
          </div>
        )}
      </motion.div>
      <canvas ref={canvasRef} className="hidden" />
    
      <SEOContent 
        title="Image Compressor"
        description="Compress JPEGs, PNGs, and WEBPs online in your browser without uploading files to a server."
        steps={[{"title":"Upload image","description":"Drag and drop or select a JPEG, PNG, or WEBP image from your device."},{"title":"Adjust quality","description":"Use the quality slider to find the perfect balance between file size and visual clarity."},{"title":"Download","description":"Preview the compressed image and click download to save the optimized file."}]}
        faqs={[{"question":"Does the compression happen on my device?","answer":"Yes, the image processing utilizes HTML5 Canvas directly in your browser. Your images are never uploaded to a server."},{"question":"Will I lose image quality?","answer":"Yes, reducing the file size involves lossy compression, which discards some visual data. However, minor reductions in quality are often imperceptible to the human eye."},{"question":"Why compress images?","answer":"Compressed images load faster on websites, consume less bandwidth, and save storage space on your device."}]}
      />
    </div>
  );
}
