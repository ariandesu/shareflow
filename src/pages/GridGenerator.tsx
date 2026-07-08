import React, { useState } from "react";
import { motion } from "framer-motion";
import { SEOContent } from "../components/SEOContent";

export default function GridGenerator() {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [gap, setGap] = useState(16);

  const cssProps = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gap: `${gap}px`,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Grid Generator</h1>
        <p className="text-white/50 text-sm">Visualize and generate CSS Grid layouts.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8 flex-1"
      >
        <div className="bg-white/5 p-6 border border-white/10 space-y-8 h-fit">
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Columns</label>
              <span className="text-xs font-mono text-white/80">{columns}</span>
            </div>
            <input
              type="range"
              min={1}
              max={12}
              value={columns}
              onChange={(e) => setColumns(Number(e.target.value))}
              className="w-full accent-white"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Rows</label>
              <span className="text-xs font-mono text-white/80">{rows}</span>
            </div>
            <input
              type="range"
              min={1}
              max={12}
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              className="w-full accent-white"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Gap (px)</label>
              <span className="text-xs font-mono text-white/80">{gap}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={64}
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              className="w-full accent-white"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="bg-white/5 border border-white/10 flex-1 min-h-[400px] p-4 transition-all duration-300" style={cssProps as any}>
            {Array.from({ length: columns * rows }).map((_, i) => (
              <div
                key={i}
                className="bg-white text-black font-bold flex items-center justify-center p-4 min-h-[60px]"
              >
                {i + 1}
              </div>
            ))}
          </div>

          <div className="bg-[#0A0A0A] p-4 border border-white/10 font-mono text-sm text-white/80 whitespace-pre">
{`.container {
  display: grid;
  grid-template-columns: repeat(${columns}, 1fr);
  grid-template-rows: repeat(${rows}, 1fr);
  gap: ${gap}px;
}`}
          </div>
        </div>
      </motion.div>
    
      <SEOContent 
        title="CSS Grid Generator"
        description="Create and visualize CSS Grid layouts. Automatically generate the CSS code for your website layouts."
        steps={[{"title":"Define grid size","description":"Use the sliders to set the desired number of columns and rows for your layout."},{"title":"Adjust gaps","description":"Change the gap value to control the spacing between individual grid items."},{"title":"Copy CSS snippet","description":"Extract the generated CSS properties and apply them to your parent container."}]}
        faqs={[{"question":"What is CSS Grid?","answer":"CSS Grid is a powerful two-dimensional layout system for the web, allowing you to create complex grid-based designs effortlessly."},{"question":"What does '1fr' mean?","answer":"The 'fr' unit represents a fraction of the available space in the grid container. Using '1fr' distributes the space equally among tracks."},{"question":"Can I create complex asymmetrical layouts with this tool?","answer":"This tool focuses on generating uniform basic grids. For complex asymmetrical grids, you can expand upon the generated base code."}]}
      />
    </div>
  );
}
