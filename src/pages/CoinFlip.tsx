import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

export default function CoinFlip() {
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [stats, setStats] = useState({ heads: 0, tails: 0, total: 0, streak: 0, streakType: "" as string });
  const [history, setHistory] = useState<("H" | "T")[]>([]);
  const [multiCount, setMultiCount] = useState(10);
  const [multiResults, setMultiResults] = useState<{ heads: number; tails: number } | null>(null);
  const [flipKey, setFlipKey] = useState(0);

  const flipCoin = useCallback(() => {
    if (isFlipping) return;
    setIsFlipping(true);
    setMultiResults(null);
    setFlipKey(k => k + 1);

    setTimeout(() => {
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      const isHeads = arr[0] % 2 === 0;
      const newResult = isHeads ? "heads" : "tails";
      setResult(newResult);

      setStats(prev => {
        const newStreak = prev.streakType === newResult ? prev.streak + 1 : 1;
        return {
          heads: prev.heads + (isHeads ? 1 : 0),
          tails: prev.tails + (isHeads ? 0 : 1),
          total: prev.total + 1,
          streak: newStreak,
          streakType: newResult,
        };
      });

      setHistory(prev => [isHeads ? "H" : "T", ...prev.slice(0, 99)]);
      setIsFlipping(false);
    }, 800);
  }, [isFlipping]);

  const multiFlip = useCallback(() => {
    let heads = 0;
    let tails = 0;
    for (let i = 0; i < multiCount; i++) {
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      if (arr[0] % 2 === 0) heads++;
      else tails++;
    }
    setMultiResults({ heads, tails });
    setStats(prev => ({
      heads: prev.heads + heads,
      tails: prev.tails + tails,
      total: prev.total + multiCount,
      streak: 0,
      streakType: "",
    }));
  }, [multiCount]);

  const reset = () => {
    setResult(null);
    setStats({ heads: 0, tails: 0, total: 0, streak: 0, streakType: "" });
    setHistory([]);
    setMultiResults(null);
  };

  const headsPercent = stats.total > 0 ? ((stats.heads / stats.total) * 100).toFixed(1) : "0";
  const tailsPercent = stats.total > 0 ? ((stats.tails / stats.total) * 100).toFixed(1) : "0";

  return (
    <div className="max-w-4xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Coin Flip</h1>
        <p className="text-white/50 text-sm">Flip a virtual coin with cryptographic randomness and stats tracking.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 flex-1 flex flex-col">
        {/* Coin display */}
        <div className="bg-white/5 border border-white/10 p-12 flex flex-col items-center space-y-8">
          <div className="relative" style={{ perspective: "600px" }}>
            <motion.div
              key={flipKey}
              initial={isFlipping ? { rotateX: 0 } : false}
              animate={isFlipping ? { rotateX: [0, 1800] } : { rotateX: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-40 h-40 relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className={`w-40 h-40 rounded-full border-4 flex items-center justify-center transition-colors duration-200 ${
                result === "heads" ? "bg-gradient-to-br from-amber-400 to-amber-600 border-amber-300" : 
                result === "tails" ? "bg-gradient-to-br from-slate-400 to-slate-600 border-slate-300" : 
                "bg-white/10 border-white/20"
              }`}>
                <span className={`text-3xl font-black uppercase ${result ? "text-black/80" : "text-white/20"}`}>
                  {result ? (result === "heads" ? "H" : "T") : "?"}
                </span>
              </div>
            </motion.div>
          </div>

          {result && !isFlipping && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-black uppercase tracking-widest"
            >
              {result}
            </motion.p>
          )}

          <button
            onClick={flipCoin}
            disabled={isFlipping}
            className="px-16 py-4 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-white/80 transition-all disabled:opacity-50 active:scale-95"
          >
            {isFlipping ? "Flipping..." : "Flip Coin"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 p-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Total Flips</p>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400/60">Heads</p>
            <p className="text-2xl font-bold mt-1">{stats.heads} <span className="text-sm text-white/40">({headsPercent}%)</span></p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400/60">Tails</p>
            <p className="text-2xl font-bold mt-1">{stats.tails} <span className="text-sm text-white/40">({tailsPercent}%)</span></p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Streak</p>
            <p className="text-2xl font-bold mt-1">{stats.streak} <span className="text-sm text-white/40">{stats.streakType && stats.streakType[0].toUpperCase()}</span></p>
          </div>
        </div>

        {/* Distribution bar */}
        {stats.total > 0 && (
          <div className="h-4 flex overflow-hidden border border-white/10">
            <div className="bg-amber-500 transition-all duration-500" style={{ width: `${headsPercent}%` }} />
            <div className="bg-slate-500 transition-all duration-500" style={{ width: `${tailsPercent}%` }} />
          </div>
        )}

        {/* Multi-flip */}
        <div className="bg-white/5 border border-white/10 p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Multi-Flip</h3>
          <div className="flex gap-3 items-center">
            <span className="text-xs text-white/50">Flip</span>
            <div className="flex gap-2">
              {[10, 100, 1000].map(n => (
                <button key={n} onClick={() => setMultiCount(n)} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${multiCount === n ? "bg-white text-black border-white" : "border-white/20 text-white/60"}`}>
                  {n}
                </button>
              ))}
            </div>
            <span className="text-xs text-white/50">coins</span>
            <button onClick={multiFlip} className="px-6 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-white/80 transition-colors ml-auto">
              Flip {multiCount}
            </button>
          </div>
          {multiResults && (
            <div className="flex gap-4 mt-4">
              <div className="flex-1 p-3 bg-[#0A0A0A] border border-white/10 text-center">
                <p className="text-[10px] text-amber-400/60 uppercase tracking-widest font-bold">Heads</p>
                <p className="text-lg font-bold">{multiResults.heads} <span className="text-xs text-white/40">({((multiResults.heads / multiCount) * 100).toFixed(1)}%)</span></p>
              </div>
              <div className="flex-1 p-3 bg-[#0A0A0A] border border-white/10 text-center">
                <p className="text-[10px] text-slate-400/60 uppercase tracking-widest font-bold">Tails</p>
                <p className="text-lg font-bold">{multiResults.tails} <span className="text-xs text-white/40">({((multiResults.tails / multiCount) * 100).toFixed(1)}%)</span></p>
              </div>
            </div>
          )}
        </div>

        {/* History & Reset */}
        {history.length > 0 && (
          <div className="bg-white/5 border border-white/10 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">History</h3>
              <button onClick={reset} className="text-white/30 hover:text-white"><RotateCcw className="w-3 h-3" /></button>
            </div>
            <div className="flex flex-wrap gap-1">
              {history.map((flip, i) => (
                <span key={i} className={`w-6 h-6 text-[10px] font-bold flex items-center justify-center border ${flip === "H" ? "bg-amber-500/20 border-amber-500/40 text-amber-400" : "bg-slate-500/20 border-slate-500/40 text-slate-400"}`}>
                  {flip}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <SEOContent
        title="Coin Flip"
        description="Flip a virtual coin with cryptographic randomness. Track statistics, streaks, and flip in bulk."
        steps={[
          { title: "Flip the coin", description: "Click the flip button or use multi-flip for bulk results." },
          { title: "Track stats", description: "View heads/tails counts, percentages, and your current streak." },
          { title: "Multi-flip", description: "Flip 10, 100, or 1000 coins at once to see statistical distributions." },
        ]}
        faqs={[
          { question: "Is it truly random?", answer: "Yes. Each flip uses crypto.getRandomValues() for cryptographically secure randomness — far better than Math.random()." },
          { question: "Why isn't it exactly 50/50?", answer: "True randomness includes variance. With more flips, the distribution converges towards 50/50 (law of large numbers)." },
          { question: "Can I use this for decisions?", answer: "Absolutely. The cryptographic randomness makes this suitable for fair, unbiased decisions." },
        ]}
      />
    </div>
  );
}
