import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Download, Image as ImageIcon } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [resizedUrl, setResizedUrl] = useState<string>("");
  
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setOriginalUrl(url);
      
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setAspectRatio(img.width / img.height);
        generateResized(img, img.width, img.height);
      };
      img.src = url;
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number(e.target.value);
    setWidth(newWidth);
    if (maintainRatio) {
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number(e.target.value);
    setHeight(newHeight);
    if (maintainRatio) {
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const generateResized = (imgElement?: HTMLImageElement, w?: number, h?: number) => {
    const targetW = w || width;
    const targetH = h || height;
    
    if (targetW <= 0 || targetH <= 0) return;

    const img = imgElement || new Image();
    const draw = (image: HTMLImageElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.drawImage(image, 0, 0, targetW, targetH);
      setResizedUrl(canvas.toDataURL("image/png"));
    };

    if (imgElement) {
      draw(imgElement);
    } else {
      img.onload = () => draw(img);
      img.src = originalUrl;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Image Resizer</h1>
        <p className="text-white/50 text-sm">Resize images precisely in your browser.</p>
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
              accept="image/*"
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
                <p className="text-xs text-white/40 mt-1">Any image format supported by your browser</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
            <div className="bg-white/5 p-6 border border-white/10 flex flex-col space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Dimensions</h3>
                <button
                  onClick={() => {
                    setFile(null);
                    setOriginalUrl("");
                    setResizedUrl("");
                  }}
                  className="text-xs font-bold uppercase tracking-widest text-white hover:text-white/80 underline underline-offset-4"
                >
                  Upload Another
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Width (px)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={handleWidthChange}
                    className="w-full p-4 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-sm text-white/80"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Height (px)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={handleHeightChange}
                    className="w-full p-4 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-sm text-white/80"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <input
                    type="checkbox"
                    id="ratio"
                    checked={maintainRatio}
                    onChange={(e) => setMaintainRatio(e.target.checked)}
                    className="w-4 h-4 accent-white"
                  />
                  <label htmlFor="ratio" className="text-xs font-bold uppercase tracking-widest text-white/80 cursor-pointer">
                    Maintain Aspect Ratio
                  </label>
                </div>

                <button
                  onClick={() => generateResized()}
                  className="w-full border border-white/30 text-white font-black uppercase tracking-widest text-xs py-4 px-6 hover:bg-white/10 transition-colors"
                >
                  Apply Resize
                </button>
              </div>

              {resizedUrl && (
                <a
                  href={resizedUrl}
                  download={`resized-${file.name}`}
                  className="block text-center bg-white text-black font-black uppercase tracking-widest text-xs py-4 px-6 mt-auto hover:bg-white/80 transition-colors"
                >
                  Download Resized Image
                </a>
              )}
            </div>

            <div className="bg-[#0A0A0A] border border-white/10 p-4 flex flex-col justify-center items-center relative overflow-hidden bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADFJREFUOE9jZGBgEGHAA86sWbOMUFVQgPGY8cEAgwE0A+gmoBpFw6hgwIBwKqjGAADvjggE5aHnTAAAAABJRU5ErkJggg==')]">
              <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest bg-black/90 px-2 py-1">Preview</span>
              {resizedUrl ? (
                <img src={resizedUrl} alt="Resized Preview" className="max-w-full max-h-[500px] object-contain shadow-2xl" />
              ) : (
                <ImageIcon className="w-12 h-12 text-white/20 animate-pulse" />
              )}
            </div>
          </div>
        )}
      </motion.div>
      <canvas ref={canvasRef} className="hidden" />
    
      <SEOContent 
        title="Image Resizer"
        description="Resize images to exact pixel dimensions online. Scale your photos quickly and privately in your browser."
        steps={[{"title":"Select an image","description":"Upload the photo you wish to resize from your local device."},{"title":"Set dimensions","description":"Enter the new width and height in pixels. Keep 'Maintain Aspect Ratio' checked to prevent distortion."},{"title":"Export","description":"Apply the resize and click download to save the newly scaled image."}]}
        faqs={[{"question":"Does this stretch my images?","answer":"If 'Maintain Aspect Ratio' is enabled, the image will scale proportionally without stretching. If unchecked, forcing specific dimensions may distort the image."},{"question":"Can I upscale images?","answer":"Yes, you can enter dimensions larger than the original, though this may result in a blurry or pixelated image."},{"question":"Is my image uploaded to the cloud?","answer":"No, all resizing is done locally within your web browser using HTML5 Canvas APIs, ensuring total privacy."}]}
      />
    </div>
  );
}
