import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

export default function ColorPicker() {
  const [color, setColor] = useState("#4f46e5");
  const [rgb, setRgb] = useState("");
  const [hsl, setHsl] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    // Convert hex to rgb
    let r = 0, g = 0, b = 0;
    if (color.length === 7) {
      r = parseInt(color.substring(1, 3), 16);
      g = parseInt(color.substring(3, 5), 16);
      b = parseInt(color.substring(5, 7), 16);
    }
    setRgb(`rgb(${r}, ${g}, ${b})`);

    // Convert rgb to hsl
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    setHsl(`hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`);
  }, [color]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Color Picker</h1>
        <p className="text-white/50 text-sm">Select and convert colors in multiple formats.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 p-6 md:p-8 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-12"
      >
        <div className="space-y-6">
          <label className="block text-xs font-bold uppercase tracking-widest text-white/50">
            Choose Color
          </label>
          <div className="flex items-center space-x-6">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-24 h-24 rounded cursor-pointer bg-transparent border-0 p-0"
            />
            <div
              className="flex-1 h-24 rounded border border-white/10"
              style={{ backgroundColor: color }}
            />
          </div>
        </div>

        <div className="space-y-6">
          {[
            { label: "HEX", value: color.toUpperCase(), type: "hex" },
            { label: "RGB", value: rgb, type: "rgb" },
            { label: "HSL", value: hsl, type: "hsl" },
          ].map((format) => (
            <div key={format.type} className="space-y-2 relative">
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50">
                {format.label}
              </label>
              <div className="relative">
                <input
                  readOnly
                  value={format.value}
                  className="w-full p-4 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-sm text-white/80"
                />
                <button
                  onClick={() => copyToClipboard(format.value, format.type)}
                  className="absolute top-2 right-2 p-2 bg-white text-black hover:bg-white/80 transition-colors"
                  title="Copy"
                >
                  {copied === format.type ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    
      <SEOContent 
        title="Color Picker"
        description="Select and convert colors effortlessly. Get accurate HEX, RGB, and HSL values for your design projects."
        steps={[{"title":"Select a color","description":"Use the interactive color picker to visually choose any color you need."},{"title":"Review formats","description":"The tool automatically generates HEX, RGB, and HSL values for your chosen color."},{"title":"Copy to clipboard","description":"Click the copy icon next to the format you need to instantly use it in your code."}]}
        faqs={[{"question":"What is HEX?","answer":"HEX is a 6-character alphanumeric code representing RGB color values, widely used in web design (HTML/CSS)."},{"question":"What is HSL?","answer":"HSL stands for Hue, Saturation, and Lightness. It's often preferred by designers because it's more intuitive to adjust than RGB."},{"question":"Are the color codes web-safe?","answer":"Yes, the generated codes are standard formats fully supported by all modern web browsers."}]}
      />
    </div>
  );
}
