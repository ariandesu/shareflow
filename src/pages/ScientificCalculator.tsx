import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Delete, RotateCcw } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

type AngleMode = "deg" | "rad";

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [angleMode, setAngleMode] = useState<AngleMode>("deg");
  const [memory, setMemory] = useState(0);
  const [hasResult, setHasResult] = useState(false);

  const toRad = (val: number) => angleMode === "deg" ? (val * Math.PI) / 180 : val;
  const fromRad = (val: number) => angleMode === "deg" ? (val * 180) / Math.PI : val;

  const inputDigit = useCallback((digit: string) => {
    if (hasResult) {
      setDisplay(digit);
      setExpression(digit);
      setHasResult(false);
    } else {
      setDisplay(prev => prev === "0" ? digit : prev + digit);
      setExpression(prev => prev + digit);
    }
  }, [hasResult]);

  const inputDecimal = useCallback(() => {
    const parts = display.split(/[+\-×÷]/);
    const last = parts[parts.length - 1];
    if (!last.includes(".")) {
      setDisplay(prev => prev + ".");
      setExpression(prev => prev + ".");
    }
  }, [display]);

  const inputOperator = useCallback((op: string) => {
    setHasResult(false);
    setDisplay(prev => prev + ` ${op} `);
    const exprOp = op === "×" ? "*" : op === "÷" ? "/" : op;
    setExpression(prev => prev + exprOp);
  }, []);

  const clear = () => { setDisplay("0"); setExpression(""); setHasResult(false); };
  const backspace = () => {
    if (hasResult) { clear(); return; }
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : "0");
    setExpression(prev => prev.slice(0, -1));
  };

  const evaluate = useCallback(() => {
    try {
      let expr = expression
        .replace(/π/g, String(Math.PI))
        .replace(/e(?![x])/g, String(Math.E));
      // eslint-disable-next-line no-new-func
      const result = new Function(`"use strict"; return (${expr})`)();
      if (typeof result === "number" && isFinite(result)) {
        const formatted = Number(result.toPrecision(12)).toString();
        setHistory(prev => [`${display} = ${formatted}`, ...prev.slice(0, 19)]);
        setDisplay(formatted);
        setExpression(formatted);
        setHasResult(true);
      } else {
        setDisplay("Error");
        setHasResult(true);
      }
    } catch {
      setDisplay("Error");
      setHasResult(true);
    }
  }, [expression, display]);

  const applyFunction = useCallback((fn: string) => {
    try {
      const current = parseFloat(expression || display);
      if (isNaN(current)) return;
      let result: number;
      switch (fn) {
        case "sin": result = Math.sin(toRad(current)); break;
        case "cos": result = Math.cos(toRad(current)); break;
        case "tan": result = Math.tan(toRad(current)); break;
        case "asin": result = fromRad(Math.asin(current)); break;
        case "acos": result = fromRad(Math.acos(current)); break;
        case "atan": result = fromRad(Math.atan(current)); break;
        case "log": result = Math.log10(current); break;
        case "ln": result = Math.log(current); break;
        case "sqrt": result = Math.sqrt(current); break;
        case "cbrt": result = Math.cbrt(current); break;
        case "x²": result = current * current; break;
        case "x³": result = current * current * current; break;
        case "1/x": result = 1 / current; break;
        case "n!": result = factorial(Math.round(current)); break;
        case "abs": result = Math.abs(current); break;
        case "%": result = current / 100; break;
        case "±": result = -current; break;
        default: return;
      }
      if (typeof result === "number" && isFinite(result)) {
        const formatted = Number(result.toPrecision(12)).toString();
        setHistory(prev => [`${fn}(${current}) = ${formatted}`, ...prev.slice(0, 19)]);
        setDisplay(formatted);
        setExpression(formatted);
        setHasResult(true);
      } else {
        setDisplay("Error");
        setHasResult(true);
      }
    } catch {
      setDisplay("Error");
      setHasResult(true);
    }
  }, [expression, display, angleMode]);

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n <= 1) return 1;
    if (n > 170) return Infinity;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  const insertConstant = (val: string) => {
    if (hasResult) {
      setDisplay(val);
      setExpression(val === "π" ? String(Math.PI) : String(Math.E));
      setHasResult(false);
    } else {
      setDisplay(prev => prev === "0" ? val : prev + val);
      setExpression(prev => prev + (val === "π" ? String(Math.PI) : String(Math.E)));
    }
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key >= "0" && e.key <= "9") inputDigit(e.key);
    else if (e.key === ".") inputDecimal();
    else if (e.key === "+") inputOperator("+");
    else if (e.key === "-") inputOperator("-");
    else if (e.key === "*") inputOperator("×");
    else if (e.key === "/") { e.preventDefault(); inputOperator("÷"); }
    else if (e.key === "Enter" || e.key === "=") evaluate();
    else if (e.key === "Backspace") backspace();
    else if (e.key === "Escape") clear();
  }, [inputDigit, inputDecimal, inputOperator, evaluate]);

  const Button = ({ label, onClick, className = "", span = 1 }: { label: string; onClick: () => void; className?: string; span?: number }) => (
    <button
      onClick={onClick}
      className={`py-4 text-sm font-bold uppercase tracking-wider border border-white/10 transition-all active:scale-95 hover:bg-white/10 ${span > 1 ? `col-span-${span}` : ""} ${className}`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-12 h-full flex flex-col" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Scientific Calculator</h1>
        <p className="text-white/50 text-sm">Full scientific calculator — trig, log, factorial, and more.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 flex-1 flex flex-col">
        {/* Display */}
        <div className="bg-white/5 border border-white/10 p-6">
          <div className="text-right space-y-1">
            <p className="text-xs text-white/30 font-mono h-5 overflow-hidden">{expression || "\u00A0"}</p>
            <p className="text-4xl font-mono font-bold tracking-tight truncate">{display}</p>
          </div>
        </div>

        {/* Mode toggles */}
        <div className="flex gap-2">
          <button onClick={() => setAngleMode(angleMode === "deg" ? "rad" : "deg")}
            className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            {angleMode === "deg" ? "DEG" : "RAD"}
          </button>
          <div className="flex-1" />
          <span className="text-[10px] text-white/20 font-mono self-center">M={memory}</span>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-5 gap-1">
          {/* Row 1: Scientific functions */}
          <Button label="sin" onClick={() => applyFunction("sin")} className="text-white/60 text-[11px]" />
          <Button label="cos" onClick={() => applyFunction("cos")} className="text-white/60 text-[11px]" />
          <Button label="tan" onClick={() => applyFunction("tan")} className="text-white/60 text-[11px]" />
          <Button label="log" onClick={() => applyFunction("log")} className="text-white/60 text-[11px]" />
          <Button label="ln" onClick={() => applyFunction("ln")} className="text-white/60 text-[11px]" />

          {/* Row 2 */}
          <Button label="x²" onClick={() => applyFunction("x²")} className="text-white/60 text-[11px]" />
          <Button label="√" onClick={() => applyFunction("sqrt")} className="text-white/60 text-[11px]" />
          <Button label="n!" onClick={() => applyFunction("n!")} className="text-white/60 text-[11px]" />
          <Button label="π" onClick={() => insertConstant("π")} className="text-white/60 text-[11px]" />
          <Button label="e" onClick={() => insertConstant("e")} className="text-white/60 text-[11px]" />

          {/* Row 3 */}
          <Button label="MC" onClick={() => setMemory(0)} className="text-white/40 text-[11px]" />
          <Button label="MR" onClick={() => { setDisplay(String(memory)); setExpression(String(memory)); setHasResult(true); }} className="text-white/40 text-[11px]" />
          <Button label="M+" onClick={() => setMemory(m => m + (parseFloat(display) || 0))} className="text-white/40 text-[11px]" />
          <Button label="M-" onClick={() => setMemory(m => m - (parseFloat(display) || 0))} className="text-white/40 text-[11px]" />
          <Button label="±" onClick={() => applyFunction("±")} className="text-white/60 text-[11px]" />

          {/* Row 4: AC, DEL, %, ÷ */}
          <Button label="AC" onClick={clear} className="bg-white/10 text-white/80" />
          <button onClick={backspace} className="py-4 border border-white/10 bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all active:scale-95">
            <Delete className="w-4 h-4 text-white/80" />
          </button>
          <Button label="%" onClick={() => applyFunction("%")} className="text-white/60" />
          <Button label="÷" onClick={() => inputOperator("÷")} className="bg-white/10 text-white" />
          <Button label="(" onClick={() => { setDisplay(prev => prev === "0" ? "(" : prev + "("); setExpression(prev => prev + "("); }} className="text-white/60" />

          {/* Number rows */}
          <Button label="7" onClick={() => inputDigit("7")} />
          <Button label="8" onClick={() => inputDigit("8")} />
          <Button label="9" onClick={() => inputDigit("9")} />
          <Button label="×" onClick={() => inputOperator("×")} className="bg-white/10 text-white" />
          <Button label=")" onClick={() => { setDisplay(prev => prev + ")"); setExpression(prev => prev + ")"); }} className="text-white/60" />

          <Button label="4" onClick={() => inputDigit("4")} />
          <Button label="5" onClick={() => inputDigit("5")} />
          <Button label="6" onClick={() => inputDigit("6")} />
          <Button label="-" onClick={() => inputOperator("-")} className="bg-white/10 text-white" />
          <Button label="1/x" onClick={() => applyFunction("1/x")} className="text-white/60 text-[11px]" />

          <Button label="1" onClick={() => inputDigit("1")} />
          <Button label="2" onClick={() => inputDigit("2")} />
          <Button label="3" onClick={() => inputDigit("3")} />
          <Button label="+" onClick={() => inputOperator("+")} className="bg-white/10 text-white" />
          <button onClick={evaluate} className="py-4 bg-white text-black font-black text-sm border border-white row-span-2 hover:bg-white/80 transition-all active:scale-95">=</button>

          <Button label="0" onClick={() => inputDigit("0")} span={2} />
          <Button label="." onClick={inputDecimal} />
          <Button label="abs" onClick={() => applyFunction("abs")} className="text-white/60 text-[11px]" />
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="bg-white/5 border border-white/10 p-4 space-y-2 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/30">History</h3>
              <button onClick={() => setHistory([])} className="text-white/30 hover:text-white"><RotateCcw className="w-3 h-3" /></button>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {history.map((entry, i) => (
                <p key={i} className="text-xs font-mono text-white/50">{entry}</p>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <SEOContent
        title="Scientific Calculator"
        description="A full-featured scientific calculator with trigonometric, logarithmic, and advanced math functions."
        steps={[
          { title: "Enter values", description: "Click buttons or use your keyboard to enter numbers and operations." },
          { title: "Use functions", description: "Apply scientific functions like sin, cos, log, square root, factorial, and more." },
          { title: "View history", description: "Your calculation history is displayed below the calculator for reference." },
        ]}
        faqs={[
          { question: "Does it support keyboard input?", answer: "Yes! Use number keys, +, -, *, /, Enter, Backspace, and Escape for full keyboard control." },
          { question: "What is DEG/RAD mode?", answer: "DEG mode uses degrees for trig functions (0-360°). RAD mode uses radians (0-2π). Toggle between them with the DEG/RAD button." },
          { question: "How does memory work?", answer: "M+ adds the current value to memory, M- subtracts it, MR recalls the memory value, and MC clears it." },
        ]}
      />
    </div>
  );
}
