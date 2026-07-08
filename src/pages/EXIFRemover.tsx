import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, ShieldCheck, ShieldAlert } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

export default function EXIFRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [cleanedUrl, setCleanedUrl] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      removeExif(url);
    }
  };

  const removeExif = (url: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // Drawing to canvas and exporting strips EXIF metadata automatically
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
      setCleanedUrl(dataUrl);
    };
    img.src = url;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">EXIF Remover</h1>
        <p className="text-white/50 text-sm">Strip metadata and location data from images.</p>
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
                <p className="text-xs text-white/40 mt-1">JPEG, PNG, or WEBP. All processing happens locally.</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="bg-white/5 p-8 border border-white/10 flex flex-col space-y-12 items-center text-center max-w-2xl mx-auto w-full">
            <div className="space-y-6 flex flex-col items-center">
              {cleanedUrl ? (
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30">
                  <ShieldCheck className="w-12 h-12 text-green-400" />
                </div>
              ) : (
                <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/30">
                  <ShieldAlert className="w-12 h-12 text-yellow-400 animate-pulse" />
                </div>
              )}
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold uppercase tracking-widest text-white">
                  {cleanedUrl ? "Metadata Stripped" : "Processing..."}
                </h3>
                <p className="text-white/50 text-sm max-w-md">
                  {cleanedUrl 
                    ? "All EXIF data, including location, camera details, and timestamps, has been removed from this image."
                    : "Reading image and removing metadata..."}
                </p>
              </div>
            </div>

            <div className="w-full space-y-4 pt-8 border-t border-white/10">
              {cleanedUrl && (
                <a
                  href={cleanedUrl}
                  download={`cleaned-${file.name.replace(/\.[^/.]+$/, "")}.jpg`}
                  className="block w-full bg-white text-black font-black uppercase tracking-widest text-xs py-4 px-6 hover:bg-white/80 transition-colors"
                >
                  Download Clean Image
                </a>
              )}
              <button
                onClick={() => {
                  setFile(null);
                  setCleanedUrl("");
                }}
                className="block w-full text-white font-bold uppercase tracking-widest text-xs py-4 px-6 hover:text-white/70 transition-colors"
              >
                Clean Another Image
              </button>
            </div>
          </div>
        )}
      </motion.div>
      <canvas ref={canvasRef} className="hidden" />
    
      <SEOContent 
        title="EXIF Metadata Remover"
        description="Remove EXIF metadata and location data from your photos online to protect your privacy."
        steps={[{"title":"Choose file","description":"Upload a photograph containing EXIF metadata that you want to clean."},{"title":"Automatic stripping","description":"The tool will instantly process the image and strip away all embedded metadata and location tags."},{"title":"Save clean image","description":"Download the new, metadata-free image to safely share online."}]}
        faqs={[{"question":"What is EXIF data?","answer":"Exchangeable Image File Format (EXIF) data is metadata embedded in photos by cameras and smartphones, which can include the date, time, camera settings, and precise GPS location coordinates."},{"question":"Why should I remove EXIF data?","answer":"Removing EXIF data protects your privacy, preventing others from finding out exactly where and when a picture was taken when you share it online."},{"question":"Does removing EXIF degrade image quality?","answer":"No, the EXIF remover strips out the hidden text-based metadata without significantly altering the visual pixel data of the image."}]}
      />
    </div>
  );
}
