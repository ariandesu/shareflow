import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Plus, X, Bell } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

interface Timer {
  id: string;
  label: string;
  targetTime: number; // ms timestamp
  totalDuration: number; // ms
  isRunning: boolean;
  isFinished: boolean;
}

export default function CountdownTimer() {
  const [timers, setTimers] = useState<Timer[]>(() => {
    try {
      const saved = localStorage.getItem("sf-timers");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((t: Timer) => ({ ...t, isFinished: "isFinished" in t ? t.isFinished : (t.targetTime <= Date.now() && t.isRunning) }));
      }
    } catch {}
    return [];
  });
  const [showAdd, setShowAdd] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [label, setLabel] = useState("");
  const [, setTick] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("sf-timers", JSON.stringify(timers));
  }, [timers]);

  // Tick every 100ms
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
      // Check for finished timers
      setTimers(prev => prev.map(timer => {
        if (timer.isRunning && !timer.isFinished && timer.targetTime <= Date.now()) {
          playAlarm();
          return { ...timer, isFinished: true, isRunning: false };
        }
        return timer;
      }));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const playAlarm = useCallback(() => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      const notes = [800, 1000, 800, 1000, 800];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        gain.gain.value = 0.1;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2 + i * 0.25);
        osc.start(ctx.currentTime + i * 0.25);
        osc.stop(ctx.currentTime + 0.2 + i * 0.25);
      });
    } catch {}
  }, []);

  const addTimer = () => {
    const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
    if (totalMs <= 0) return;
    const newTimer: Timer = {
      id: crypto.randomUUID(),
      label: label || `Timer ${timers.length + 1}`,
      targetTime: Date.now() + totalMs,
      totalDuration: totalMs,
      isRunning: true,
      isFinished: false,
    };
    setTimers(prev => [...prev, newTimer]);
    setShowAdd(false);
    setLabel("");
  };

  const toggleTimer = (id: string) => {
    setTimers(prev => prev.map(t => {
      if (t.id !== id) return t;
      if (t.isFinished) return t;
      if (t.isRunning) {
        // Pause: store remaining time
        const remaining = Math.max(0, t.targetTime - Date.now());
        return { ...t, isRunning: false, targetTime: remaining };
      } else {
        // Resume: set new target based on stored remaining
        return { ...t, isRunning: true, targetTime: Date.now() + t.targetTime };
      }
    }));
  };

  const resetTimer = (id: string) => {
    setTimers(prev => prev.map(t => {
      if (t.id !== id) return t;
      return { ...t, targetTime: Date.now() + t.totalDuration, isRunning: false, isFinished: false };
    }));
  };

  const removeTimer = (id: string) => {
    setTimers(prev => prev.filter(t => t.id !== id));
  };

  const getRemaining = (timer: Timer) => {
    if (timer.isFinished) return { days: 0, hours: 0, minutes: 0, seconds: 0, ms: 0, progress: 1 };
    const remaining = timer.isRunning ? Math.max(0, timer.targetTime - Date.now()) : timer.targetTime;
    const totalSec = Math.ceil(remaining / 1000);
    const days = Math.floor(totalSec / 86400);
    const hrs = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const progress = 1 - remaining / timer.totalDuration;
    return { days, hours: hrs, minutes: mins, seconds: secs, ms: remaining, progress };
  };

  const CircularProgress = ({ progress, size = 200 }: { progress: number; size?: number }) => {
    const r = (size - 8) / 2;
    const circumference = 2 * Math.PI * r;
    const offset = circumference * (1 - progress);
    return (
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="white" strokeWidth="4"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-200" />
      </svg>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Countdown Timer</h1>
        <p className="text-white/50 text-sm">Multiple simultaneous timers with alarm — persists across page refreshes.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 flex-1">
        {/* Add timer */}
        {showAdd ? (
          <div className="bg-white/5 p-6 border border-white/10 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">New Timer</h3>
              <button onClick={() => setShowAdd(false)} className="text-white/50 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <input
              type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Timer label (optional)"
              className="w-full p-3 bg-[#0A0A0A] border border-white/10 outline-none text-sm text-white/80"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Hours</label>
                <input type="number" min={0} max={99} value={hours} onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full p-4 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-2xl text-center text-white/80" />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Minutes</label>
                <input type="number" min={0} max={59} value={minutes} onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-full p-4 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-2xl text-center text-white/80" />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Seconds</label>
                <input type="number" min={0} max={59} value={seconds} onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-full p-4 bg-[#0A0A0A] border border-white/10 outline-none font-mono text-2xl text-center text-white/80" />
              </div>
            </div>
            <button onClick={addTimer} className="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-4 hover:bg-white/80 transition-colors">
              Start Timer
            </button>
          </div>
        ) : (
          <button onClick={() => setShowAdd(true)} className="w-full bg-white/5 border border-dashed border-white/20 p-6 flex items-center justify-center gap-2 hover:border-white/40 transition-colors">
            <Plus className="w-5 h-5 text-white/50" />
            <span className="text-sm font-bold uppercase tracking-widest text-white/50">Add Timer</span>
          </button>
        )}

        {/* Timer list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {timers.map(timer => {
            const rem = getRemaining(timer);
            return (
              <div key={timer.id} className={`bg-white/5 border p-8 flex flex-col items-center space-y-6 relative ${timer.isFinished ? "border-green-500/40" : "border-white/10"}`}>
                <button onClick={() => removeTimer(timer.id)} className="absolute top-4 right-4 text-white/30 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold uppercase tracking-widest text-white/50">{timer.label}</span>

                {/* Circular progress */}
                <div className="relative">
                  <CircularProgress progress={rem.progress} size={180} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {timer.isFinished ? (
                      <div className="text-center">
                        <Bell className="w-8 h-8 text-green-400 mx-auto mb-2 animate-bounce" />
                        <span className="text-xs font-bold uppercase tracking-widest text-green-400">Done!</span>
                      </div>
                    ) : (
                      <div className="font-mono text-3xl font-bold tracking-tight">
                        {rem.days > 0 && <span>{rem.days}<span className="text-white/30 text-sm">d </span></span>}
                        {String(rem.hours).padStart(2, "0")}
                        <span className="text-white/30">:</span>
                        {String(rem.minutes).padStart(2, "0")}
                        <span className="text-white/30">:</span>
                        {String(rem.seconds).padStart(2, "0")}
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex gap-3">
                  <button
                    onClick={() => toggleTimer(timer.id)}
                    disabled={timer.isFinished}
                    className="p-3 bg-white text-black hover:bg-white/80 transition-colors disabled:opacity-30"
                  >
                    {timer.isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button onClick={() => resetTimer(timer.id)} className="p-3 bg-white/10 hover:bg-white/20 transition-colors">
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {timers.length === 0 && !showAdd && (
          <div className="flex-1 flex items-center justify-center py-20">
            <p className="text-white/20 text-sm">No timers yet. Click "Add Timer" to create one.</p>
          </div>
        )}
      </motion.div>

      <SEOContent
        title="Countdown Timer"
        description="Set multiple countdown timers with alarm notifications. Timers persist across page refreshes."
        steps={[
          { title: "Set duration", description: "Enter hours, minutes, and seconds for your countdown." },
          { title: "Start timer", description: "Click start and watch the circular progress animation countdown." },
          { title: "Get notified", description: "An alarm sound plays when the timer reaches zero." },
        ]}
        faqs={[
          { question: "Do timers survive page refresh?", answer: "Yes! Timers are saved to localStorage and continue counting even if you close and reopen the page." },
          { question: "Can I run multiple timers?", answer: "Yes. Add as many timers as you need — they all run simultaneously and independently." },
          { question: "How does the alarm work?", answer: "The alarm uses the Web Audio API to play a tone sequence — no audio files are needed." },
        ]}
      />
    </div>
  );
}
