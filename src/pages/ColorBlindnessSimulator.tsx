import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Eye } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

type SimType = "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia" | "protanomaly" | "deuteranomaly" | "tritanomaly";

const SIM_LABELS: Record<SimType, string> = {
  protanopia: "Protanopia (No Red)",
  deuteranopia: "Deuteranopia (No Green)",
  tritanopia: "Tritanopia (No Blue)",
  achromatopsia: "Achromatopsia (No Color)",
  protanomaly: "Protanomaly (Weak Red)",
  deuteranomaly: "Deuteranomaly (Weak Green)",
  tritanomaly: "Tritanomaly (Weak Blue)",
};

// Color transformation matrices (Brettel/Viénot algorithms)
const MATRICES: Record<SimType, number[]> = {
  protanopia: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
  deuteranopia: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
  tritanopia: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
  achromatopsia: [0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114],
  protanomaly: [0.817, 0.183, 0, 0.333, 0.667, 0, 0, 0.125, 0.875],
  deuteranomaly: [0.8, 0.2, 0, 0.258, 0.742, 0, 0, 0.142, 0.858],
  tritanomaly: [0.967, 0.033, 0, 0, 0.733, 0.267, 0, 0.183, 0.817],
};

export default function ColorBlindnessSimulator() {
  const [imageUrl, setImageUrl] = useState("");
  const [simTypes, setSimTypes] = useState<SimType[]>(["deuteranopia"]);
  const [view, setView] = useState<"side" | "grid">("side");
  const [results, setResults] = useState<Record<string, string>>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setResults({});
  };

  useEffect(() => {
    if (!imageUrl) return;
    processImage();
  }, [imageUrl, simTypes]);

  const processImage = async () => {
    if (!imageUrl) return;
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;

      const newResults: Record<string, string> = {};
      for (const simType of simTypes) {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const matrix = MATRICES[simType];

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Apply linear transform to sRGB (simplified)
          const lr = r / 255, lg = g / 255, lb = b / 255;
          data[i] = Math.round(Math.min(255, Math.max(0, (matrix[0] * lr + matrix[1] * lg + matrix[2] * lb) * 255)));
          data[i + 1] = Math.round(Math.min(255, Math.max(0, (matrix[3] * lr + matrix[4] * lg + matrix[5] * lb) * 255)));
          data[i + 2] = Math.round(Math.min(255, Math.max(0, (matrix[6] * lr + matrix[7] * lg + matrix[8] * lb) * 255)));
        }
        ctx.putImageData(imageData, 0, 0);
        newResults[simType] = canvas.toDataURL("image/png");
      }
      setResults(newResults);
      setIsProcessing(false);
    };
    img.src = imageUrl;
  };

  const toggleSimType = (type: SimType) => {
    setSimTypes(prev => {
      if (prev.includes(type)) {
        if (prev.length === 1) return prev;
        return prev.filter(t => t !== type);
      }
      return [...prev, type];
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Color Blindness</h1>
        <p className="text-white/50 text-sm">Simulate how your images appear to people with color vision deficiencies.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 flex-1 flex flex-col">
        {!imageUrl ? (
          <div className="flex-1 border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center p-12 transition-colors hover:border-white/40">
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="cb-upload" />
            <label htmlFor="cb-upload" className="cursor-pointer flex flex-col items-center space-y-4">
              <div className="p-4 bg-[#0A0A0A] rounded-full border border-white/10">
                <Eye className="w-8 h-8 text-white/50" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-white/80">Upload an image</p>
                <p className="text-xs text-white/40 mt-1">See how it looks with different color vision conditions</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="space-y-6 flex-1 flex flex-col">
            {/* Controls */}
            <div className="bg-white/5 p-6 border border-white/10 space-y-4">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2">
                  <button onClick={() => setView("side")} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${view === "side" ? "bg-white text-black border-white" : "border-white/20 text-white/60"}`}>Side by Side</button>
                  <button onClick={() => setView("grid")} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${view === "grid" ? "bg-white text-black border-white" : "border-white/20 text-white/60"}`}>Grid</button>
                </div>
                <div className="flex gap-2">
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="cb-change" />
                  <label htmlFor="cb-change" className="cursor-pointer text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white underline underline-offset-4">Change Image</label>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {(Object.keys(SIM_LABELS) as SimType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => toggleSimType(type)}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-colors ${simTypes.includes(type) ? "bg-white text-black border-white" : "border-white/20 text-white/50 hover:border-white/40"}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className={`flex-1 ${view === "grid" ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 lg:grid-cols-2 gap-4"}`}>
              {/* Original */}
              <div className="bg-[#0A0A0A] border border-white/10 p-4 flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Original</span>
                <img src={imageUrl} alt="Original" className="w-full object-contain flex-1 max-h-[400px]" />
              </div>

              {/* Simulated */}
              {simTypes.map(type => (
                <div key={type} className="bg-[#0A0A0A] border border-white/10 p-4 flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">{SIM_LABELS[type]}</span>
                  {results[type] ? (
                    <img src={results[type]} alt={SIM_LABELS[type]} className="w-full object-contain flex-1 max-h-[400px]" />
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-xs text-white/20">{isProcessing ? "Processing..." : "No result"}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <canvas ref={canvasRef} className="hidden" />

      <SEOContent
        title="Color Blindness Simulator"
        description="Upload an image to see how it appears to people with different types of color vision deficiency."
        steps={[
          { title: "Upload image", description: "Select an image to test for color accessibility." },
          { title: "Choose simulation", description: "Select one or more color blindness types to simulate." },
          { title: "Compare results", description: "View side-by-side or grid comparisons of original vs. simulated images." },
        ]}
        faqs={[
          { question: "How accurate is this?", answer: "This simulator uses established color transformation matrices (Brettel/Viénot algorithms) used in scientific research. Results are approximate but useful for accessibility testing." },
          { question: "What is deuteranopia?", answer: "Deuteranopia is the most common form of color blindness, affecting ~6% of males. It causes difficulty distinguishing red and green colors." },
          { question: "Is my image uploaded?", answer: "No. All processing uses the Canvas API directly in your browser. Your images never leave your device." },
        ]}
      />
    </div>
  );
}
