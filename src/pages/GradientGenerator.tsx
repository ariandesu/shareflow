import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, RefreshCw, Plus, X } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

interface ColorStop {
  id: string;
  color: string;
  stop: number;
}

export function GradientGenerator() {
  const [colors, setColors] = useState<ColorStop[]>([
    { id: '1', color: '#4f46e5', stop: 0 },
    { id: '2', color: '#ec4899', stop: 100 }
  ]);
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(90);
  const [radialPosition, setRadialPosition] = useState('center');
  const [addNoise, setAddNoise] = useState(false);
  const [noiseOpacity, setNoiseOpacity] = useState(15);
  const [copied, setCopied] = useState(false);

  const generateCSS = () => {
    const sortedColors = [...colors].sort((a, b) => a.stop - b.stop);
    const colorString = sortedColors.map(c => `${c.color} ${c.stop}%`).join(", ");
    
    let gradient = "";
    if (type === "linear") {
      gradient = `linear-gradient(${angle}deg, ${colorString})`;
    } else {
      gradient = `radial-gradient(circle at ${radialPosition}, ${colorString})`;
    }

    if (addNoise) {
      const svg = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#noise)" opacity="${noiseOpacity / 100}"/></svg>`;
      const encodedSvg = encodeURIComponent(svg);
      return `url("data:image/svg+xml,${encodedSvg}"), ${gradient}`;
    }

    return gradient;
  };

  const cssValue = generateCSS();

  const addColor = () => {
    if (colors.length >= 8) return;
    const lastColor = colors[colors.length - 1];
    const newStop = Math.min(lastColor.stop + 20, 100);
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    
    setColors([...colors, { id: Math.random().toString(), color: randomColor, stop: newStop }]);
  };

  const updateColor = (id: string, field: 'color' | 'stop', value: string | number) => {
    setColors(colors.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeColor = (id: string) => {
    if (colors.length <= 2) return;
    setColors(colors.filter(c => c.id !== id));
  };

  const generateRandomColors = () => {
    const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    
    setColors(colors.map(c => ({
      ...c,
      color: randomColor(),
    })));
    
    setAngle(Math.floor(Math.random() * 360));
    
    const positions = ['center', 'top left', 'top', 'top right', 'right', 'bottom right', 'bottom', 'bottom left', 'left'];
    setRadialPosition(positions[Math.floor(Math.random() * positions.length)]);
    
    setType(Math.random() > 0.5 ? 'linear' : 'radial');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`background: ${cssValue};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-left space-y-2">
        <h1 className="text-[28px] sm:text-[40px] leading-none font-bold tracking-tighter uppercase">Gradient Studio</h1>
        <p className="text-white/50 text-sm">Create beautiful, advanced CSS gradients instantly.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 flex flex-col"
      >
        <div 
          className="w-full h-64 sm:h-96 transition-all duration-300 border-b border-white/10"
          style={{ background: cssValue }}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6 md:p-8 border-b border-white/10">
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/80">Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Type</label>
                <div className="flex space-x-2">
                  <button onClick={() => setType('linear')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest border transition-colors ${type === 'linear' ? 'bg-white text-black border-white' : 'bg-transparent text-white/50 border-white/10 hover:border-white/30'}`}>Linear</button>
                  <button onClick={() => setType('radial')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest border transition-colors ${type === 'radial' ? 'bg-white text-black border-white' : 'bg-transparent text-white/50 border-white/10 hover:border-white/30'}`}>Radial</button>
                </div>
              </div>

              {type === 'linear' ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Angle ({angle}°)</label>
                  <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-white h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Position</label>
                  <select value={radialPosition} onChange={(e) => setRadialPosition(e.target.value)} className="w-full p-3 bg-[#0A0A0A] border border-white/10 focus:border-white/30 outline-none font-mono text-sm text-white/80">
                    <option value="center">Center</option>
                    <option value="top left">Top Left</option>
                    <option value="top">Top</option>
                    <option value="top right">Top Right</option>
                    <option value="right">Right</option>
                    <option value="bottom right">Bottom Right</option>
                    <option value="bottom">Bottom</option>
                    <option value="bottom left">Bottom Left</option>
                    <option value="left">Left</option>
                  </select>
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Add Grain / Noise</label>
                  <button onClick={() => setAddNoise(!addNoise)} className={`w-12 h-6 rounded-full border relative transition-colors ${addNoise ? 'bg-white border-white' : 'bg-[#0A0A0A] border-white/30'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${addNoise ? 'bg-black left-7' : 'bg-white/50 left-1'}`} />
                  </button>
                </div>
                {addNoise && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Noise Opacity ({noiseOpacity}%)</label>
                    <input type="range" min="1" max="100" value={noiseOpacity} onChange={(e) => setNoiseOpacity(Number(e.target.value))} className="w-full accent-white h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/80">Colors ({colors.length}/8)</h3>
              <button 
                onClick={addColor} 
                disabled={colors.length >= 8}
                className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors flex items-center space-x-1 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>
            
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
              {colors.map((color) => (
                <div key={color.id} className="p-4 bg-[#0A0A0A] border border-white/10 space-y-4 relative group">
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={color.color}
                      onChange={(e) => updateColor(color.id, 'color', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-white/10 p-0 bg-transparent flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={color.color.toUpperCase()}
                      onChange={(e) => updateColor(color.id, 'color', e.target.value)}
                      className="w-24 p-2 bg-transparent border-b border-white/10 focus:border-white/30 outline-none font-mono text-sm uppercase text-white/80"
                    />
                    <div className="flex-1" />
                    {colors.length > 2 && (
                      <button 
                        onClick={() => removeColor(color.id)} 
                        className="text-white/20 hover:text-white hover:bg-white/10 rounded p-1 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Stop Position</span>
                      <span className="text-[10px] font-mono text-white/40">{color.stop}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={color.stop}
                      onChange={(e) => updateColor(color.id, 'stop', Number(e.target.value))}
                      className="w-full accent-white h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-black/20">
          <div className="flex-1 bg-[#0A0A0A] p-4 border border-white/10 w-full overflow-x-auto">
            <code className="text-white/80 font-mono text-xs whitespace-nowrap">
              background: {cssValue};
            </code>
          </div>
          <div className="flex space-x-4 w-full sm:w-auto shrink-0">
            <button
              onClick={generateRandomColors}
              className="flex-none flex items-center justify-center p-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
              title="Randomize"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={copyToClipboard}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-white text-black px-6 py-4 border-2 border-white font-black uppercase text-sm tracking-widest hover:bg-transparent hover:text-white transition-colors"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span>{copied ? "Copied" : "Copy CSS"}</span>
            </button>
          </div>
        </div>
      </motion.div>
    
      <SEOContent 
        title="CSS Gradient Generator"
        description="Create stunning CSS gradients visually. Export pure CSS or Tailwind utility classes instantly."
        steps={[{"title":"Pick Colors","description":"Select your start and end colors using the color pickers."},{"title":"Adjust Direction","description":"Change the angle or direction of the gradient blend."},{"title":"Copy Code","description":"Grab the generated CSS or Tailwind code to use in your project."}]}
        faqs={[{"question":"What formats does it support?","answer":"You can generate both standard CSS properties and Tailwind CSS utility classes."},{"question":"Are these web-safe?","answer":"Yes, standard CSS gradients are widely supported in all modern web browsers."},{"question":"Can I do radial gradients?","answer":"Currently, this tool focuses on linear gradients for maximum simplicity and CSS compatibility."}]}
      />
    </div>
  );
}

