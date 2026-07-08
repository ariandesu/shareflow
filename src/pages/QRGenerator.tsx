import React, { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";
import { motion } from "motion/react";
import { SEOContent } from "../components/SEOContent";

export function QRGenerator() {
  const [text, setText] = useState("https://shareflow.app");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = "qrcode.png";
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">QR Generator</h1>
        <p className="text-white/50 text-sm">Create custom QR codes instantly in your browser.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 border border-white/10 p-6 flex flex-col justify-between space-y-6"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Content (URL or Text)</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-4 bg-[#0A0A0A] border border-white/10 focus:border-white/30 outline-none resize-none text-white/80 font-mono text-sm"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Size ({size}px)</label>
            <input
              type="range"
              min="128"
              max="512"
              step="32"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Foreground</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-white/10 p-0 bg-transparent"
                />
                <span className="font-mono text-sm text-white/80 uppercase tracking-widest">{fgColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Background</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-white/10 p-0 bg-transparent"
                />
                <span className="font-mono text-sm text-white/80 uppercase tracking-widest">{bgColor}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 border border-white/10 p-6 flex flex-col items-center justify-center min-h-[400px]"
        >
          <div 
            ref={qrRef} 
            className="p-4 bg-white border border-white/20"
            style={{ backgroundColor: bgColor }}
          >
            <QRCodeSVG
              value={text || " "}
              size={size}
              fgColor={fgColor}
              bgColor={bgColor}
              level="H"
              includeMargin={false}
            />
          </div>
          
          <button
            onClick={downloadQR}
            className="mt-8 flex items-center justify-center space-x-2 bg-white text-black py-4 px-8 border-2 border-white font-black uppercase tracking-widest text-sm hover:bg-[#0A0A0A] hover:text-white transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Download PNG</span>
          </button>
        </motion.div>
      </div>
    
      <SEOContent 
        title="QR Code Generator"
        description="Create custom QR codes instantly. Fast, free, and vector-ready."
        steps={[{"title":"Enter Text or URL","description":"Type the content you want embedded inside the QR code."},{"title":"Customize","description":"Adjust the error correction level to ensure scanning reliability."},{"title":"Download","description":"Download the generated code to use in your printed materials or websites."}]}
        faqs={[{"question":"Do QR codes expire?","answer":"No, standard static QR codes never expire as they encode the data directly into the image."},{"question":"What is error correction?","answer":"Error correction allows a QR code to remain scannable even if part of the image is damaged or obscured."},{"question":"Can I track scans?","answer":"This tool generates static QR codes, which cannot be tracked. You would need a dynamic QR service to track scan analytics."}]}
      />
    </div>
  );
}
