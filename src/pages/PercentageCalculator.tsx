import React, { useState } from "react";
import { motion } from "framer-motion";
import { Percent } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

type Section = "increase" | "percent-of" | "discount" | "margin";

const SECTIONS: { id: Section; label: string }[] = [
  { id: "increase", label: "% Increase / Decrease" },
  { id: "percent-of", label: "% of Total" },
  { id: "discount", label: "Discount / Sale" },
  { id: "margin", label: "Profit Margin" },
];

function n(s: string): number {
  const v = parseFloat(s);
  return Number.isNaN(v) ? 0 : v;
}

export default function PercentageCalculator() {
  const [section, setSection] = useState<Section>("increase");

  const [oldVal, setOldVal] = useState("100");
  const [newVal, setNewVal] = useState("125");
  const [part, setPart] = useState("20");
  const [whole, setWhole] = useState("100");
  const [price, setPrice] = useState("80");
  const [discount, setDiscount] = useState("20");
  const [cost, setCost] = useState("50");
  const [revenue, setRevenue] = useState("80");

  const inputCls =
    "w-full p-3 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-sm text-white";

  const renderBoard = () => {
    if (section === "increase") {
      const o = n(oldVal);
      const iv = n(newVal);
      const pct = o !== 0 ? (((iv - o) / o) * 100).toFixed(2) : "-";
      return (
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-white/50">Original value → new value</p>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Old</span>
              <input type="number" value={oldVal} onChange={e => setOldVal(e.target.value)} className={inputCls} />
            </label>
            <label className="block">
              <span className="text-[10px] text-white/40 uppercase tracking-widest">New</span>
              <input type="number" value={newVal} onChange={e => setNewVal(e.target.value)} className={inputCls} />
            </label>
          </div>
          <ResultRow label="Change" value={`${pct}%`} sub={o !== 0 ? `${(iv - o) >= 0 ? "+" : ""}${(iv - o).toFixed(2)} absolute` : "-"} />
        </div>
      );
    }
    if (section === "percent-of") {
      const w = n(whole);
      const p = w !== 0 ? ((n(part) / w) * 100).toFixed(2) : "-";
      return (
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-white/50">Part → whole</p>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Part</span>
              <input type="number" value={part} onChange={e => setPart(e.target.value)} className={inputCls} />
            </label>
            <label className="block">
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Whole</span>
              <input type="number" value={whole} onChange={e => setWhole(e.target.value)} className={inputCls} />
            </label>
          </div>
          <ResultRow label="Percentage" value={`${p}%`} />
        </div>
      );
    }
    if (section === "discount") {
      const p = n(price);
      const d = n(discount);
      const final = p - (p * d) / 100;
      const saved = (p * d) / 100;
      return (
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-white/50">Price minus discount</p>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Original price</span>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} className={inputCls} />
            </label>
            <label className="block">
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Discount %</span>
              <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} className={inputCls} />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ResultRow label="Final price" value={final.toFixed(2)} />
            <ResultRow label="You save" value={saved.toFixed(2)} />
          </div>
        </div>
      );
    }
    const r = n(revenue);
    const c = n(cost);
    const marginPct = r !== 0 ? (((r - c) / r) * 100).toFixed(2) : "-";
    const markupPct = c !== 0 ? (((r - c) / c) * 100).toFixed(2) : "-";
    return (
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-white/50">Revenue vs cost</p>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Cost</span>
            <input type="number" value={cost} onChange={e => setCost(e.target.value)} className={inputCls} />
          </label>
          <label className="block">
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Revenue</span>
            <input type="number" value={revenue} onChange={e => setRevenue(e.target.value)} className={inputCls} />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ResultRow label="Profit margin" value={`${marginPct}%`} />
          <ResultRow label="Markup" value={`${markupPct}%`} />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Percentage Calculator</h1>
        <p className="text-white/50 text-sm">Work out percentage increase, decrease, discounts, margins and more.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${section === s.id ? "bg-white text-black border-white" : "border-white/20 text-white/60"}`}>
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex-1 bg-white/5 border border-white/10 p-6">
          {renderBoard()}
        </div>
      </motion.div>

      <SEOContent
        title="Percentage Calculator"
        description="Free percentage calculator — compute percentage increase and decrease, percent of total, discounts and profit margins instantly."
        steps={[
          { title: "Pick a mode", description: "Increase/decrease, % of total, discount or margin." },
          { title: "Enter values", description: "Type your numbers and results update instantly." },
          { title: "Read results", description: "See the percentage, absolute change and totals." },
        ]}
        faqs={[
          { question: "How is percentage change calculated?", answer: "(new − old) ÷ old × 100. Negative results mean a decrease." },
          { question: "How is profit margin calculated?", answer: "(revenue − cost) ÷ revenue × 100. Markup is (revenue − cost) ÷ cost × 100." },
          { question: "Does anything get uploaded?", answer: "No. All calculations run locally in your browser." },
        ]}
      />
    </div>
  );
}

function ResultRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-[#0A0A0A] border border-white/10 px-4 py-3">
      <p className="text-[10px] text-white/40 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black mt-1">{value}</p>
      {sub && <p className="text-[10px] text-white/40 mt-1">{sub}</p>}
    </div>
  );
}