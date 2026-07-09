import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Dices } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

type DiceType = "d4" | "d6" | "d8" | "d10" | "d12" | "d20" | "d100";

interface DieConfig {
  type: DiceType;
  max: number;
  label: string;
}

interface RollResult {
  dice: DiceType;
  values: number[];
  total: number;
  timestamp: number;
}

const DICE: DieConfig[] = [
  { type: "d4", max: 4, label: "D4" },
  { type: "d6", max: 6, label: "D6" },
  { type: "d8", max: 8, label: "D8" },
  { type: "d10", max: 10, label: "D10" },
  { type: "d12", max: 12, label: "D12" },
  { type: "d20", max: 20, label: "D20" },
  { type: "d100", max: 100, label: "D100" },
];

export default function DiceRoller() {
  const [selectedDice, setSelectedDice] = useState<DiceType>("d6");
  const [count, setCount] = useState(2);
  const [currentValues, setCurrentValues] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<RollResult[]>([]);

  const getDiceConfig = (type: DiceType) => DICE.find(d => d.type === type)!;

  const rollDice = useCallback(() => {
    const config = getDiceConfig(selectedDice);
    setIsRolling(true);

    // Animate through random values
    let animCount = 0;
    const animInterval = setInterval(() => {
      const randomValues = Array.from({ length: count }, () => {
        const arr = new Uint32Array(1);
        crypto.getRandomValues(arr);
        return (arr[0] % config.max) + 1;
      });
      setCurrentValues(randomValues);
      animCount++;
      if (animCount >= 10) {
        clearInterval(animInterval);
        // Final roll with crypto random
        const finalValues = Array.from({ length: count }, () => {
          const arr = new Uint32Array(1);
          crypto.getRandomValues(arr);
          return (arr[0] % config.max) + 1;
        });
        setCurrentValues(finalValues);
        setHistory(prev => [{
          dice: selectedDice,
          values: finalValues,
          total: finalValues.reduce((s, v) => s + v, 0),
          timestamp: Date.now(),
        }, ...prev.slice(0, 49)]);
        setIsRolling(false);
      }
    }, 50);
  }, [selectedDice, count]);

  const total = currentValues.reduce((sum, v) => sum + v, 0);

  // Dice face SVG for d6
  const D6Face = ({ value }: { value: number }) => {
    const dotPositions: Record<number, [number, number][]> = {
      1: [[50, 50]],
      2: [[25, 25], [75, 75]],
      3: [[25, 25], [50, 50], [75, 75]],
      4: [[25, 25], [75, 25], [25, 75], [75, 75]],
      5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
      6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
    };
    const dots = dotPositions[value] || dotPositions[1];
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="2" y="2" width="96" height="96" rx="12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        {dots.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="8" fill="white" />
        ))}
      </svg>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Dice Roller</h1>
        <p className="text-white/50 text-sm">Roll virtual dice with cryptographic randomness.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 flex-1 flex flex-col">
        {/* Dice type selector */}
        <div className="flex flex-wrap gap-2">
          {DICE.map(d => (
            <button
              key={d.type}
              onClick={() => { setSelectedDice(d.type); setCurrentValues([]); }}
              className={`px-5 py-3 text-sm font-bold uppercase tracking-widest border transition-colors ${selectedDice === d.type ? "bg-white text-black border-white" : "border-white/20 text-white/60 hover:border-white/40"}`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Count selector */}
        <div className="flex items-center gap-4">
          <label className="text-xs font-bold uppercase tracking-widest text-white/50">Count:</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
              <button
                key={n}
                onClick={() => { setCount(n); setCurrentValues([]); }}
                className={`w-10 h-10 text-xs font-bold border transition-colors ${count === n ? "bg-white text-black border-white" : "border-white/20 text-white/60 hover:border-white/40"}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Dice display */}
        <div className="bg-white/5 border border-white/10 p-8 flex flex-col items-center space-y-8">
          <div className="flex flex-wrap justify-center gap-4">
            {currentValues.length > 0 ? currentValues.map((val, i) => (
              <motion.div
                key={i}
                initial={{ rotateZ: 0 }}
                animate={isRolling ? { rotateZ: [0, 360] } : { rotateZ: 0 }}
                transition={{ duration: 0.3, repeat: isRolling ? Infinity : 0 }}
                className="w-20 h-20 flex items-center justify-center"
              >
                {selectedDice === "d6" ? (
                  <D6Face value={val} />
                ) : (
                  <div className="w-full h-full border-2 border-white/20 rounded-lg flex items-center justify-center bg-white/5">
                    <span className="text-2xl font-black">{val}</span>
                  </div>
                )}
              </motion.div>
            )) : (
              <div className="py-8">
                <Dices className="w-16 h-16 text-white/10" />
              </div>
            )}
          </div>

          {currentValues.length > 0 && (
            <div className="text-center space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Total</p>
              <p className="text-5xl font-black tracking-tight">{total}</p>
              {currentValues.length > 1 && (
                <p className="text-xs text-white/40 font-mono">{currentValues.join(" + ")}</p>
              )}
            </div>
          )}

          <button
            onClick={rollDice}
            disabled={isRolling}
            className="px-12 py-4 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-white/80 transition-all disabled:opacity-50 active:scale-95"
          >
            {isRolling ? "Rolling..." : `Roll ${count}${getDiceConfig(selectedDice).label}`}
          </button>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="bg-white/5 border border-white/10 p-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Roll History</h3>
              <button onClick={() => setHistory([])} className="text-white/30 hover:text-white"><RotateCcw className="w-3 h-3" /></button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {history.map((roll, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#0A0A0A] border border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{roll.dice}</span>
                    <span className="text-xs font-mono text-white/50">[{roll.values.join(", ")}]</span>
                  </div>
                  <span className="text-sm font-bold">{roll.total}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <SEOContent
        title="Dice Roller"
        description="Roll virtual dice from D4 to D100 with cryptographic randomness. Animated rolls with history tracking."
        steps={[
          { title: "Choose dice type", description: "Select from D4, D6, D8, D10, D12, D20, or D100." },
          { title: "Set count", description: "Choose how many dice to roll simultaneously." },
          { title: "Roll & track", description: "Roll the dice and view your history with totals." },
        ]}
        faqs={[
          { question: "Is the randomness fair?", answer: "Yes. We use crypto.getRandomValues() which provides cryptographically secure pseudo-random numbers." },
          { question: "What are the dice types?", answer: "D4 (4 sides), D6 (standard), D8, D10, D12, D20 (commonly used in RPGs), and D100 (percentile)." },
          { question: "Can I roll multiple dice?", answer: "Yes! Roll up to 10 dice at once and see individual results plus the total sum." },
        ]}
      />
    </div>
  );
}
