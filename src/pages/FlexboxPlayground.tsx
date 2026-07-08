import React, { useState } from "react";
import { motion } from "framer-motion";
import { SEOContent } from "../components/SEOContent";

export default function FlexboxPlayground() {
  const [flexDirection, setFlexDirection] = useState("row");
  const [justifyContent, setJustifyContent] = useState("flex-start");
  const [alignItems, setAlignItems] = useState("flex-start");
  const [flexWrap, setFlexWrap] = useState("nowrap");
  const [itemCount, setItemCount] = useState(5);

  const cssProps = {
    display: "flex",
    flexDirection,
    justifyContent,
    alignItems,
    flexWrap,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Flexbox Playground</h1>
        <p className="text-white/50 text-sm">Visualize and generate Flexbox CSS layouts.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8 flex-1"
      >
        <div className="bg-white/5 p-6 border border-white/10 space-y-8 h-fit">
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50">flex-direction</label>
            <select
              value={flexDirection}
              onChange={(e) => setFlexDirection(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 p-2 text-white/80 font-mono text-sm outline-none"
            >
              <option value="row">row</option>
              <option value="row-reverse">row-reverse</option>
              <option value="column">column</option>
              <option value="column-reverse">column-reverse</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50">justify-content</label>
            <select
              value={justifyContent}
              onChange={(e) => setJustifyContent(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 p-2 text-white/80 font-mono text-sm outline-none"
            >
              <option value="flex-start">flex-start</option>
              <option value="flex-end">flex-end</option>
              <option value="center">center</option>
              <option value="space-between">space-between</option>
              <option value="space-around">space-around</option>
              <option value="space-evenly">space-evenly</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50">align-items</label>
            <select
              value={alignItems}
              onChange={(e) => setAlignItems(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 p-2 text-white/80 font-mono text-sm outline-none"
            >
              <option value="flex-start">flex-start</option>
              <option value="flex-end">flex-end</option>
              <option value="center">center</option>
              <option value="stretch">stretch</option>
              <option value="baseline">baseline</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50">flex-wrap</label>
            <select
              value={flexWrap}
              onChange={(e) => setFlexWrap(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 p-2 text-white/80 font-mono text-sm outline-none"
            >
              <option value="nowrap">nowrap</option>
              <option value="wrap">wrap</option>
              <option value="wrap-reverse">wrap-reverse</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Number of Items: {itemCount}</label>
            <input
              type="range"
              min={1}
              max={20}
              value={itemCount}
              onChange={(e) => setItemCount(Number(e.target.value))}
              className="w-full accent-white"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="bg-white/5 border border-white/10 flex-1 min-h-[400px] p-4 flex gap-2 transition-all duration-300" style={cssProps as any}>
            {Array.from({ length: itemCount }).map((_, i) => (
              <div
                key={i}
                className="bg-white text-black font-bold flex items-center justify-center p-4 min-w-[60px] min-h-[60px]"
              >
                {i + 1}
              </div>
            ))}
          </div>

          <div className="bg-[#0A0A0A] p-4 border border-white/10 font-mono text-sm text-white/80 whitespace-pre">
{`.container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
}`}
          </div>
        </div>
      </motion.div>
    
      <SEOContent 
        title="Flexbox Playground"
        description="Learn and test CSS Flexbox layouts visually. Generate clean CSS code for your responsive designs."
        steps={[{"title":"Set flex direction","description":"Choose how items are placed in the flex container (row or column)."},{"title":"Align items","description":"Experiment with justify-content and align-items to position elements perfectly."},{"title":"Export CSS","description":"Copy the generated CSS snippet to apply the exact same layout to your project."}]}
        faqs={[{"question":"What is CSS Flexbox?","answer":"Flexbox is a one-dimensional layout model in CSS that allows flexible responsive layout structures without relying on floats or positioning."},{"question":"When should I use Flexbox over Grid?","answer":"Flexbox is ideal for laying out items in a single direction (either row or column), while CSS Grid is better for complex two-dimensional layouts."},{"question":"Does Flexbox work on older browsers?","answer":"Flexbox has excellent support across all modern browsers, making it a standard choice for modern web development."}]}
      />
    </div>
  );
}
