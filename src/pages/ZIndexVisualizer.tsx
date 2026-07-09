import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, X, Layers, AlertTriangle } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

interface ZLayer {
  id: string;
  name: string;
  zIndex: number;
  color: string;
}

const COLORS = [
  "rgba(99, 102, 241, 0.6)", // Indigo
  "rgba(236, 72, 153, 0.6)", // Pink
  "rgba(34, 197, 94, 0.6)",  // Green
  "rgba(234, 179, 8, 0.6)",  // Yellow
  "rgba(168, 85, 247, 0.6)", // Purple
  "rgba(59, 130, 246, 0.6)", // Blue
  "rgba(239, 68, 68, 0.6)",  // Red
  "rgba(20, 184, 166, 0.6)", // Teal
  "rgba(249, 115, 22, 0.6)", // Orange
  "rgba(147, 51, 234, 0.6)", // Violet
];

export default function ZIndexVisualizer() {
  const [layers, setLayers] = useState<ZLayer[]>([
    { id: "1", name: "Background", zIndex: 0, color: COLORS[0] },
    { id: "2", name: "Content", zIndex: 1, color: COLORS[1] },
    { id: "3", name: "Sidebar", zIndex: 10, color: COLORS[2] },
    { id: "4", name: "Header", zIndex: 100, color: COLORS[3] },
    { id: "5", name: "Modal Overlay", zIndex: 999, color: COLORS[4] },
    { id: "6", name: "Modal", zIndex: 1000, color: COLORS[5] },
    { id: "7", name: "Tooltip", zIndex: 9999, color: COLORS[6] },
  ]);
  const [cssInput, setCssInput] = useState("");

  const addLayer = () => {
    const maxZ = Math.max(...layers.map(l => l.zIndex), 0);
    setLayers(prev => [...prev, {
      id: crypto.randomUUID(),
      name: `Layer ${prev.length + 1}`,
      zIndex: maxZ + 1,
      color: COLORS[prev.length % COLORS.length],
    }]);
  };

  const removeLayer = (id: string) => {
    setLayers(prev => prev.filter(l => l.id !== id));
  };

  const updateLayer = (id: string, field: keyof ZLayer, value: string | number) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const parseCSSInput = () => {
    const regex = /z-index\s*:\s*(-?\d+)/g;
    const selectorRegex = /([^{]+)\{[^}]*z-index\s*:\s*(-?\d+)[^}]*\}/g;
    const newLayers: ZLayer[] = [];
    let match;
    let index = 0;
    
    while ((match = selectorRegex.exec(cssInput)) !== null) {
      newLayers.push({
        id: crypto.randomUUID(),
        name: match[1].trim().slice(0, 30),
        zIndex: parseInt(match[2]),
        color: COLORS[index % COLORS.length],
      });
      index++;
    }
    
    if (newLayers.length === 0) {
      // Fallback: just find z-index values
      const simpleRegex = /z-index\s*:\s*(-?\d+)/g;
      let simpleMatch;
      while ((simpleMatch = simpleRegex.exec(cssInput)) !== null) {
        newLayers.push({
          id: crypto.randomUUID(),
          name: `Element ${index + 1}`,
          zIndex: parseInt(simpleMatch[1]),
          color: COLORS[index % COLORS.length],
        });
        index++;
      }
    }

    if (newLayers.length > 0) setLayers(newLayers);
  };

  const sortedLayers = useMemo(() => 
    [...layers].sort((a, b) => a.zIndex - b.zIndex),
    [layers]
  );

  // Detect issues
  const issues = useMemo(() => {
    const found: string[] = [];
    const zValues = layers.map(l => l.zIndex);
    
    // Duplicates
    const dupes = zValues.filter((v, i) => zValues.indexOf(v) !== i);
    if (dupes.length > 0) found.push(`Duplicate z-index values: ${[...new Set(dupes)].join(", ")}`);
    
    // Large gaps
    const sorted = [...new Set(zValues)].sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i++) {
      const gap = sorted[i] - sorted[i - 1];
      if (gap > 100) found.push(`Large gap between z-index ${sorted[i-1]} and ${sorted[i]} (${gap})`);
    }
    
    // Unnecessarily high values
    const maxZ = Math.max(...zValues);
    if (maxZ > 10000) found.push(`Very high z-index value: ${maxZ}. Consider using smaller values.`);
    
    // Negative values
    const negatives = zValues.filter(v => v < 0);
    if (negatives.length > 0) found.push(`Negative z-index values found: ${negatives.join(", ")}`);

    return found;
  }, [layers]);

  // Calculate 3D offsets for isometric view
  const maxZ = Math.max(...sortedLayers.map(l => l.zIndex), 1);
  const minZ = Math.min(...sortedLayers.map(l => l.zIndex), 0);
  const range = maxZ - minZ || 1;

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Z-Index Visualizer</h1>
        <p className="text-white/50 text-sm">Visualize z-index stacking order in a 3D isometric view.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-1">
        {/* Layer editor */}
        <div className="bg-white/5 p-6 border border-white/10 flex flex-col space-y-6 overflow-y-auto">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Layers ({layers.length})</h3>
            <button onClick={addLayer} className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white">
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>

          {/* CSS input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Parse from CSS</label>
            <textarea
              value={cssInput}
              onChange={(e) => setCssInput(e.target.value)}
              placeholder={`.header { z-index: 100; }\n.modal { z-index: 1000; }`}
              className="w-full h-24 p-3 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-[11px] text-white/60 resize-none"
              spellCheck={false}
            />
            <button onClick={parseCSSInput} disabled={!cssInput.trim()} className="w-full py-2 bg-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-colors disabled:opacity-30">
              Parse CSS
            </button>
          </div>

          {/* Layer list */}
          <div className="space-y-2 flex-1 overflow-y-auto">
            {sortedLayers.map(layer => (
              <div key={layer.id} className="flex items-center gap-2 bg-[#0A0A0A] border border-white/10 p-3">
                <div className="w-4 h-4 rounded-sm flex-shrink-0" style={{ backgroundColor: layer.color }} />
                <input
                  type="text"
                  value={layer.name}
                  onChange={(e) => updateLayer(layer.id, "name", e.target.value)}
                  className="flex-1 bg-transparent outline-none text-xs text-white/80 min-w-0"
                />
                <input
                  type="number"
                  value={layer.zIndex}
                  onChange={(e) => updateLayer(layer.id, "zIndex", parseInt(e.target.value) || 0)}
                  className="w-20 bg-transparent outline-none text-xs font-mono text-white/60 text-right"
                />
                <button onClick={() => removeLayer(layer.id)} className="text-white/20 hover:text-white/60 flex-shrink-0">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Issues */}
          {issues.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-white/10">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-yellow-500/80 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Issues ({issues.length})
              </h4>
              {issues.map((issue, i) => (
                <p key={i} className="text-[10px] text-yellow-500/60">{issue}</p>
              ))}
            </div>
          )}
        </div>

        {/* 3D Visualization */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/10 p-8 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden">
          <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest text-white/20 flex items-center gap-1">
            <Layers className="w-3 h-3" /> Stacking Order
          </span>

          {/* Isometric 3D stack */}
          <div className="relative" style={{ perspective: "1000px", transformStyle: "preserve-3d" }}>
            <div style={{ transform: "rotateX(55deg) rotateZ(-45deg)", transformStyle: "preserve-3d" }}>
              {sortedLayers.map((layer, index) => {
                const normalizedZ = (layer.zIndex - minZ) / range;
                const yOffset = normalizedZ * -250;
                return (
                  <motion.div
                    key={layer.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="absolute left-1/2 top-1/2 group cursor-pointer"
                    style={{
                      width: "200px",
                      height: "120px",
                      marginLeft: "-100px",
                      marginTop: "-60px",
                      transform: `translateZ(${yOffset}px)`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div
                      className="w-full h-full border-2 flex items-center justify-center transition-all group-hover:scale-105 group-hover:brightness-125"
                      style={{
                        backgroundColor: layer.color,
                        borderColor: layer.color.replace("0.6", "0.9"),
                        boxShadow: `0 4px 20px ${layer.color.replace("0.6", "0.3")}`,
                      }}
                    >
                      <div className="text-center">
                        <p className="text-xs font-bold text-white truncate max-w-[180px] px-2">{layer.name}</p>
                        <p className="text-[10px] font-mono text-white/60">z-index: {layer.zIndex}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 2D stack fallback / side view */}
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm border border-white/10 p-3 max-w-[200px]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Stack Order</p>
            <div className="space-y-1">
              {[...sortedLayers].reverse().map(layer => (
                <div key={layer.id} className="flex items-center gap-2">
                  <div className="w-3 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: layer.color }} />
                  <span className="text-[9px] text-white/50 truncate flex-1">{layer.name}</span>
                  <span className="text-[9px] font-mono text-white/30">{layer.zIndex}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <SEOContent
        title="Z-Index Visualizer"
        description="Visualize CSS z-index stacking order in a 3D isometric view. Detect issues like gaps and collisions."
        steps={[
          { title: "Add layers", description: "Add layers manually or paste CSS code to auto-extract z-index values." },
          { title: "Visualize", description: "See your layers rendered in a 3D isometric view showing stacking order." },
          { title: "Find issues", description: "The tool detects duplicate values, large gaps, and unnecessarily high z-indices." },
        ]}
        faqs={[
          { question: "How does z-index work?", answer: "z-index controls the stacking order of positioned elements. Higher values appear in front of lower values within the same stacking context." },
          { question: "What is a stacking context?", answer: "A stacking context is an element that forms its own layer hierarchy. z-index values only compete within the same stacking context." },
          { question: "Why are large z-index values bad?", answer: "Using values like 99999 makes it hard to manage stacking. Use increments of 10 or 100 for maintainability." },
        ]}
      />
    </div>
  );
}
