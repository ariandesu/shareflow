import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

export default function BoxShadowGenerator() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(10);
  const [blur, setBlur] = useState(15);
  const [spread, setSpread] = useState(-3);
  const [color, setColor] = useState("#000000");
  const [opacity, setOpacity] = useState(50);
  const [inset, setInset] = useState(false);
  const [copied, setCopied] = useState(false);

  // Convert hex + opacity to rgba
  const getRgba = () => {
    let r = 0, g = 0, b = 0;
    if (color.length === 7) {
      r = parseInt(color.substring(1, 3), 16);
      g = parseInt(color.substring(3, 5), 16);
      b = parseInt(color.substring(5, 7), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  const boxShadow = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${getRgba()}`;
  const cssCode = `box-shadow: ${boxShadow};\n-webkit-box-shadow: ${boxShadow};\n-moz-box-shadow: ${boxShadow};`;

  const copyCode = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Box Shadow Generator</h1>
        <p className="text-white/50 text-sm">Create and copy CSS box shadow properties.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <div className="bg-white/5 p-6 border border-white/10 space-y-6">
          {[
            { label: "Horizontal Offset (x)", value: x, setter: setX, min: -100, max: 100 },
            { label: "Vertical Offset (y)", value: y, setter: setY, min: -100, max: 100 },
            { label: "Blur Radius", value: blur, setter: setBlur, min: 0, max: 100 },
            { label: "Spread Radius", value: spread, setter: setSpread, min: -50, max: 50 },
            { label: "Opacity", value: opacity, setter: setOpacity, min: 0, max: 100 },
          ].map((control) => (
            <div key={control.label} className="space-y-2">
              <div className="flex justify-between">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/50">
                  {control.label}
                </label>
                <span className="text-xs font-mono text-white/80">{control.value}{control.label === "Opacity" ? "%" : "px"}</span>
              </div>
              <input
                type="range"
                min={control.min}
                max={control.max}
                value={control.value}
                onChange={(e) => control.setter(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>
          ))}

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Shadow Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 cursor-pointer bg-transparent border-0 p-0"
            />
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <input
              type="checkbox"
              id="inset"
              checked={inset}
              onChange={(e) => setInset(e.target.checked)}
              className="w-4 h-4 accent-white"
            />
            <label htmlFor="inset" className="text-xs font-bold uppercase tracking-widest text-white/80 cursor-pointer">
              Inset Shadow
            </label>
          </div>
        </div>

        <div className="space-y-8 flex flex-col">
          <div className="bg-white/5 p-6 border border-white/10 flex-1 flex items-center justify-center min-h-[300px]">
            <div 
              className="w-48 h-48 bg-[#0A0A0A] border border-white/10 transition-shadow duration-200"
              style={{ boxShadow }}
            />
          </div>
          
          <div className="relative">
            <div className="bg-[#0A0A0A] p-4 border border-white/10">
              <pre className="text-sm font-mono text-white/80 whitespace-pre-wrap">
                {cssCode}
              </pre>
            </div>
            <button
              onClick={copyCode}
              className="absolute top-2 right-2 p-2 bg-white text-black hover:bg-white/80 transition-colors"
              title="Copy CSS"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.div>
    
      <SEOContent 
        title="CSS Box Shadow Generator"
        description="Visually create beautiful CSS box shadows. Generate the exact CSS code you need for your web elements."
        steps={[{"title":"Adjust offsets","description":"Use the sliders to change the horizontal (x) and vertical (y) offsets of the shadow."},{"title":"Fine-tune blur & spread","description":"Modify the blur radius for softness and the spread radius for shadow size."},{"title":"Copy CSS","description":"Grab the auto-generated CSS code snippet and paste it directly into your stylesheet."}]}
        faqs={[{"question":"What does 'inset' mean?","answer":"The inset property changes the shadow from an outer box shadow to an inner shadow, making the element look pressed in."},{"question":"Why does the code include vendor prefixes?","answer":"While modern browsers don't need them, some generators include prefixes for maximum compatibility with older browser versions."},{"question":"Can I add multiple shadows?","answer":"Currently, this tool generates single shadow declarations, but CSS allows you to chain multiple shadows using commas."}]}
      />
    </div>
  );
}
