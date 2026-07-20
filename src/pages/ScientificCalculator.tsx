import React, { useState, useEffect, useRef } from "react";
import * as math from "mathjs";
import { SEOContent } from "../components/SEOContent";

const m = math.create(math.all, {});
m.config({ number: "BigNumber", precision: 14 });

type CalcMode = "COMP" | "CMPLX" | "BASE-N" | "MATRIX" | "VECTOR" | "STAT" | "DIST" | "SPREAD" | "TABLE" | "EQN" | "INEQ" | "RATIO";
type ShiftState = "NONE" | "SHIFT" | "ALPHA";

const MODES: CalcMode[] = ["COMP", "CMPLX", "BASE-N", "MATRIX", "VECTOR", "STAT", "DIST", "SPREAD", "TABLE", "EQN", "INEQ", "RATIO"];
const MODE_LABELS = ["Calculate", "Complex", "Base-N", "Matrix", "Vector", "Statistics", "Distrib.", "Spreadsheet", "Table", "Equation", "Inequal.", "Ratio"];

const Btn = ({
  label,
  onClick,
  shiftL,
  alphaL,
  type = "normal",
  className = "",
  btnClassName = ""
}: {
  label: string | React.ReactNode,
  onClick: () => void,
  shiftL?: string,
  alphaL?: string,
  type?: "normal" | "number" | "blue" | "yellow" | "red",
  className?: string,
  btnClassName?: string
}) => {
  const styles: Record<string, string> = {
    number: "bg-[#FFFFFF] text-[#1E1E1E] hover:bg-[#F0F0F0] text-sm",
    blue: "bg-[#1D6CFF] text-[#FFF] hover:bg-[#1A5FE0] text-sm",
    yellow: "bg-[#FFD54A] text-[#1E1E1E] hover:bg-[#FFC107] text-sm",
    red: "bg-[#E53935] text-[#FFF] hover:bg-[#D32F2F] text-sm",
    normal: "bg-[#2B2B2B] text-[#FFF] hover:bg-[#353535] text-[10px] px-1",
  };

  return (
    <div className={`flex flex-col items-center justify-end h-[44px] relative ${className}`}>
      {shiftL && <span className="absolute top-[-13px] text-[8px] text-[#FFD54A] font-bold tracking-tighter w-full text-center left-0">{shiftL}</span>}
      {alphaL && <span className="absolute top-[-13px] text-[8px] text-[#FF4D88] font-bold tracking-tighter right-0">{alphaL}</span>}

      <button
        onClick={onClick}
        className={`w-full h-[28px] rounded-md shadow-sm border-b-[2px] border-black/25 active:border-b-0 active:translate-y-[2px] transition-all font-bold flex items-center justify-center text-xs ${btnClassName || styles[type]}`}
      >
        {label}
      </button>
    </div>
  );
};

const ExeBtn = ({ onClick }: { onClick: () => void }) => (
  <div className="flex flex-col items-center justify-end h-[44px] relative">
    <button
      onClick={onClick}
      className="w-full h-[28px] rounded-full bg-[#2B2B2B] text-[#FFF] hover:bg-[#353535] shadow-sm border-b-[2px] border-black/25 active:border-b-0 active:translate-y-[2px] transition-all font-bold flex items-center justify-center text-[7px]"
    >
      EXE
    </button>
  </div>
);

export default function ScientificCalculator() {
  const [mode, setMode] = useState<CalcMode>("COMP");
  const [shiftState, setShiftState] = useState<ShiftState>("NONE");
  const [displayInput, setDisplayInput] = useState("");
  const [displayResult, setDisplayResult] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuCursor, setMenuCursor] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [ans, setAns] = useState("0");

  const S = useRef({ mode, shiftState, displayInput, displayResult, isMenuOpen, menuCursor, history, historyIndex, ans });
  useEffect(() => {
    S.current = { mode, shiftState, displayInput, displayResult, isMenuOpen, menuCursor, history, historyIndex, ans };
  });

  const evaluate = (expr: string) => {
    try {
      if (!expr.trim()) return "";
      const s = S.current;
      let parsed = expr
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/π/g, "pi")
        .replace(/√\(/g, "sqrt(")
        .replace(/²/g, "^2")
        .replace(/³/g, "^3")
        .replace(/x10\^/g, "*10^")
        .replace(/Ans/g, s.ans);
      const result = m.evaluate(parsed);
      let formatted = m.format(result, { precision: 12, upperExp: 10, lowerExp: -10 });
      formatted = formatted.replace(/\*/g, "×").replace(/\//g, "÷");
      setAns(result.toString());
      return formatted;
    } catch {
      return "Math ERROR";
    }
  };

  const selectMode = (idx: number) => {
    setMode(MODES[idx]);
    setIsMenuOpen(false);
    setDisplayInput("");
    setDisplayResult("");
  };

  const handleEqual = () => {
    const s = S.current;
    if (s.isMenuOpen) {
      selectMode(s.menuCursor);
      return;
    }
    if (!s.displayInput) return;
    const res = evaluate(s.displayInput);
    setDisplayResult(res);
    setHistory(prev => [...prev, s.displayInput]);
    setHistoryIndex(s.history.length);
    setShiftState("NONE");
  };

  const handleNav = (dir: "UP" | "DOWN" | "LEFT" | "RIGHT") => {
    const s = S.current;
    if (s.isMenuOpen) {
      if (dir === "RIGHT") setMenuCursor(c => (c + 1) % 12);
      if (dir === "LEFT") setMenuCursor(c => (c - 1 + 12) % 12);
      if (dir === "DOWN") setMenuCursor(c => (c + 4) % 12);
      if (dir === "UP") setMenuCursor(c => (c - 4 + 12) % 12);
      return;
    }
    if (dir === "UP" && s.historyIndex > 0) {
      const idx = s.historyIndex - 1;
      setHistoryIndex(idx);
      setDisplayInput(s.history[idx]);
      setDisplayResult("");
    }
    if (dir === "DOWN") {
      if (s.historyIndex < s.history.length - 1) {
        const idx = s.historyIndex + 1;
        setHistoryIndex(idx);
        setDisplayInput(s.history[idx]);
        setDisplayResult("");
      } else {
        setHistoryIndex(s.history.length);
        setDisplayInput("");
      }
    }
  };

  const insert = (val: string) => {
    const s = S.current;
    if (s.displayResult && s.displayResult !== "Math ERROR") {
      if (["+", "-", "×", "÷", "^", "²"].includes(val)) {
        setDisplayInput("Ans" + val);
      } else {
        setDisplayInput(val);
      }
      setDisplayResult("");
    } else {
      setDisplayInput(prev => prev + val);
    }
    setShiftState("NONE");
  };

  const del = () => {
    if (S.current.displayResult) {
      setDisplayResult("");
      return;
    }
    setDisplayInput(prev => prev.slice(0, -1));
  };

  const ac = () => {
    setDisplayInput("");
    setDisplayResult("");
    setShiftState("NONE");
    setIsMenuOpen(false);
  };

  const toggleShift = () => setShiftState(s => s === "SHIFT" ? "NONE" : "SHIFT");
  const toggleAlpha = () => setShiftState(s => s === "ALPHA" ? "NONE" : "ALPHA");
  const toggleMenu = () => {
    setIsMenuOpen(o => { if (!o) setMenuCursor(0); return !o; });
    setShiftState("NONE");
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col xl:flex-row gap-12 items-center justify-center p-4">

      <div
        className="relative w-[340px] h-auto min-h-[720px] pb-6 bg-[#1E1E1E] rounded-3xl shadow-2xl p-4 flex flex-col flex-shrink-0"
        style={{
          boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 1px 3px rgba(255,255,255,0.1), inset 0 -5px 15px rgba(0,0,0,0.3)",
        }}
      >
        <div className="flex justify-between items-start px-1 pt-1 pb-2">
          <div className="text-[#FFF] text-xs font-black tracking-widest italic">CASIO</div>
          <div className="text-right">
            <div className="text-[#FFF] text-[10px] font-bold">fx-991EX</div>
            <div className="text-[#888] text-[8px] tracking-widest">CLASSWIZ</div>
          </div>
        </div>

        <div className="w-20 h-3.5 bg-[#0A0A0A] border border-[#333] rounded-sm ml-auto grid grid-cols-4 gap-px p-px">
          <div className="bg-[#1A0800]"></div><div className="bg-[#1A0800]"></div><div className="bg-[#1A0800]"></div><div className="bg-[#1A0800]"></div>
        </div>

        <div className="mt-2.5 w-full h-[120px] bg-[#9EA798] border-[5px] border-[#1A1A1A] rounded-lg p-2 shadow-inner flex flex-col font-mono text-[#111]">
          <div className="flex justify-between items-center text-[10px] h-4 mb-1">
            <div className="flex gap-2">
              <span className={shiftState === "SHIFT" ? "font-black" : "opacity-10"}>S</span>
              <span className={shiftState === "ALPHA" ? "font-black" : "opacity-10"}>A</span>
              <span className="font-bold">{mode}</span>
            </div>
            <div className="flex gap-1 font-bold">
              <span>D</span><span>Math</span><span>▼</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden relative">
            {isMenuOpen ? (
              <div className="grid grid-cols-4 grid-rows-3 gap-1 h-full p-1 bg-[#9EA798] absolute inset-0">
                {MODE_LABELS.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => selectMode(i)}
                    className={`flex items-center justify-center text-[8px] font-bold text-center leading-none border cursor-pointer ${
                      menuCursor === i
                        ? "bg-black text-[#9EA798] border-black"
                        : "border-transparent hover:bg-black/20"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className="flex-1 text-sm leading-tight break-all">
                  {displayInput}
                </div>
                <div className="h-8 text-right text-3xl font-bold tracking-tight">
                  {displayResult}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 mt-4 px-0.5 flex flex-col gap-1.5">

          {/* Row 1: SHIFT, ALPHA, ▲, MENU, SETUP, ON */}
          <div className="grid grid-cols-6 gap-x-1.5">
            <Btn label="SHIFT" onClick={toggleShift} type="yellow" />
            <Btn label="ALPHA" onClick={toggleAlpha} type="red" />
            <Btn label="▲" onClick={() => handleNav("UP")} type="normal" />
            <Btn label="MENU" onClick={toggleMenu} type="normal" />
            <Btn label="SETUP" onClick={() => {}} type="normal" />
            <Btn label="ON" onClick={ac} type="normal" />
          </div>

          {/* Row 2: ◀, EXE, ▶, Σ( */}
          <div className="grid grid-cols-6 gap-x-1.5">
            <Btn label="◀" onClick={() => handleNav("LEFT")} type="normal" shiftL="SOLVE=" />
            <ExeBtn onClick={handleEqual} />
            <Btn label="▶" onClick={() => handleNav("RIGHT")} type="normal" shiftL="d/dx" />
            <Btn label="Σ(" onClick={() => insert("Σ(")} type="normal" />
            <div />
            <div />
          </div>

          {/* Row 3: OPTN, CALC, ▼, ∫dx, Σ, e^x */}
          <div className="grid grid-cols-6 gap-x-1.5">
            <Btn label="OPTN" onClick={() => {}} type="normal" shiftL="x⁻¹" />
            <Btn label="CALC" onClick={() => {}} type="normal" shiftL="³√" />
            <Btn label="▼" onClick={() => handleNav("DOWN")} type="normal" />
            <Btn label="∫dx" onClick={() => insert("integrate(")} type="normal" shiftL="x^□" />
            <Btn label="Σ" onClick={() => insert("Σ")} type="normal" shiftL="10^x" />
            <Btn label="e^x" onClick={() => insert("e^(")} type="normal" />
          </div>

          {/* Row 4: x³√, √□, x², x^■, log□□, ln */}
          <div className="grid grid-cols-6 gap-x-1.5 mt-1">
            <Btn label="x³√" onClick={() => insert("cuberoot(")} type="normal" shiftL="Ans" />
            <Btn label="√□" onClick={() => insert("√(")} type="normal" shiftL="↔" />
            <Btn label="x²" onClick={() => insert("²")} type="normal" shiftL="Abs" />
            <Btn label="x^■" onClick={() => insert("^")} type="normal" shiftL="sin⁻¹" alphaL="D" />
            <Btn label="log□□" onClick={() => insert("log(")} type="normal" shiftL="cos⁻¹" alphaL="E" />
            <Btn label="ln" onClick={() => insert("ln(")} type="normal" shiftL="tan⁻¹" alphaL="F" />
          </div>

          {/* Row 5: (-), ° ' '', x⁻¹, sin, cos, tan */}
          <div className="grid grid-cols-6 gap-x-1.5">
            <Btn label="(-)" onClick={() => insert("-")} type="normal" shiftL="RCL" />
            <Btn label={"° ' ''"} onClick={() => {}} type="normal" shiftL="←" />
            <Btn label="x⁻¹" onClick={() => insert("^-1")} type="normal" />
            <Btn label="sin" onClick={() => insert("sin(")} type="normal" shiftL="x" alphaL="Y" />
            <Btn label="cos" onClick={() => insert("cos(")} type="normal" />
            <Btn label="tan" onClick={() => insert("tan(")} type="normal" shiftL="M-" alphaL="M" />
          </div>

          {/* Row 6: STO, ENG, (, ), S⇔D, M+ */}
          <div className="grid grid-cols-6 gap-x-1.5">
            <Btn label="STO" onClick={() => {}} type="normal" shiftL="CONST" />
            <Btn label="ENG" onClick={() => {}} type="normal" shiftL="CONV" />
            <Btn label="(" onClick={() => insert("(")} type="normal" shiftL="RESET" />
            <Btn label=")" onClick={() => insert(")")} type="normal" />
            <Btn label="S⇔D" onClick={() => {}} type="normal" shiftL="INS" />
            <Btn label="M+" onClick={() => {}} type="normal" shiftL="OFF" />
          </div>

          {/* Numpad */}
          <div className="grid grid-cols-5 gap-1.5 mt-1">
            <Btn label="7" onClick={() => insert("7")} type="number" />
            <Btn label="8" onClick={() => insert("8")} type="number" />
            <Btn label="9" onClick={() => insert("9")} type="number" />
            <Btn label="DEL" onClick={del} type="blue" shiftL="Pol" />
            <Btn label="AC" onClick={ac} type="blue" shiftL="Rec" />

            <Btn label="4" onClick={() => insert("4")} type="number" shiftL="Rnd" />
            <Btn label="5" onClick={() => insert("5")} type="number" shiftL="Ran#" alphaL="RanInt" />
            <Btn label="6" onClick={() => insert("6")} type="number" shiftL="π" alphaL="e" />
            <Btn label="×" onClick={() => insert("×")} type="normal" shiftL="%" />
            <Btn label="÷" onClick={() => insert("÷")} type="normal" />

            <Btn label="1" onClick={() => insert("1")} type="number" />
            <Btn label="2" onClick={() => insert("2")} type="number" />
            <Btn label="3" onClick={() => insert("3")} type="number" />
            <Btn label="+" onClick={() => insert("+")} type="normal" />
            <Btn label="-" onClick={() => insert("-")} type="normal" />

            <Btn label="0" onClick={() => insert("0")} type="number" />
            <Btn label="." onClick={() => insert(".")} type="number" />
            <Btn label="×10ˣ" onClick={() => insert("x10^")} type="number" />
            <Btn label="Ans" onClick={() => insert("Ans")} type="normal" />
            <Btn label="=" onClick={handleEqual} type="blue" />
          </div>

        </div>
      </div>

      <div className="flex-1 max-w-xl space-y-6">
        <SEOContent
          title="Casio fx-991EX ClassWiz Emulator"
          description="A 100% UI replica of the legendary Casio fx-991EX ClassWiz scientific calculator, powered by Math.js for advanced evaluation."
          steps={[
            { title: "Standard Operations", description: "Use the keypad just like the physical hardware for calculations." },
            { title: "Advanced Menus", description: "Click MENU to open the ClassWiz OS grid. Use the D-Pad to navigate and = to select." },
            { title: "Math.js Engine", description: "The backend safely evaluates complex expressions, trigonometry, and logarithms." },
          ]}
          faqs={[
            { question: "Is this a real ROM emulator?", answer: "No, it's a CSS/React UI replica. The math evaluation is handled by Math.js rather than the original Casio firmware." },
            { question: "What modes are functional?", answer: "The UI features the entire 12-app grid. Currently, COMP (General Calculation) maps to the core evaluate engine." },
            { question: "How do I use SHIFT/ALPHA?", answer: "Click SHIFT or ALPHA once to toggle the state (indicated by S/A on the LCD screen), then click your target button." },
          ]}
        />
      </div>
    </div>
  );
}
