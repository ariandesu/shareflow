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
  type?: "normal" | "number" | "operator" | "nav",
  className?: string,
  btnClassName?: string
}) => {
  const isNum = type === "number";
  const isOp = type === "operator";

  return (
    <div className={`flex flex-col items-center justify-end h-[50px] relative ${className}`}>
      {shiftL && <span className="absolute top-[-14px] text-[9px] text-[#C0A040] font-bold tracking-tighter w-full text-center left-0">{shiftL}</span>}
      {alphaL && <span className="absolute top-[-14px] text-[9px] text-[#E03050] font-bold tracking-tighter right-0">{alphaL}</span>}

      <button
        onClick={onClick}
        className={`
          w-full h-[32px] rounded-lg shadow-sm border-b-[3px] border-black/20 active:border-b-0 active:translate-y-[3px] transition-all font-bold flex items-center justify-center
          ${btnClassName ? btnClassName : isNum ? "bg-[#EAEAEA] text-black hover:bg-[#FFF] text-lg" :
            isOp ? "bg-[#333] text-[#FFF] hover:bg-[#444] text-lg" :
            "bg-[#252525] text-[#FFF] hover:bg-[#353535] text-[11px] px-1"}
        `}
      >
        {label}
      </button>
    </div>
  );
};

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
        className="relative w-[340px] h-auto min-h-[720px] pb-6 bg-[#EAEAEA] rounded-3xl shadow-2xl p-4 flex flex-col flex-shrink-0"
        style={{
          boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 2px 5px rgba(255,255,255,0.8), inset 0 -5px 15px rgba(0,0,0,0.2)",
          backgroundImage: "linear-gradient(to bottom, #F5F5F5 0%, #D5D5D5 100%)"
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-[260px] bg-[#1A1A1A] rounded-t-3xl rounded-b-[40px] z-0 overflow-hidden"
          style={{
            backgroundImage: "radial-gradient(#333 1px, transparent 1px), radial-gradient(#333 1px, transparent 1px)",
            backgroundSize: "8px 8px",
            backgroundPosition: "0 0, 4px 4px",
            boxShadow: "inset 0 -10px 20px rgba(0,0,0,0.5)"
          }}
        />

        <div className="relative z-10 flex justify-between items-start px-2 pt-2">
          <div className="text-[#FFF] text-xs font-black tracking-widest italic">CASIO</div>
          <div className="text-right">
            <div className="text-[#FFF] text-[10px] font-bold">fx-991EX</div>
            <div className="text-[#A0A0A0] text-[8px] tracking-widest">CLASSWIZ</div>
          </div>
        </div>

        <div className="relative z-10 w-24 h-4 bg-[#111] border border-[#444] rounded-sm mx-auto mt-2 grid grid-cols-4 gap-px p-px">
          <div className="bg-[#1A0A00]"></div><div className="bg-[#1A0A00]"></div><div className="bg-[#1A0A00]"></div><div className="bg-[#1A0A00]"></div>
        </div>

        <div className="relative z-10 mt-3 w-full h-[120px] bg-[#9EA798] border-[6px] border-[#2A2A2A] rounded-lg p-2 shadow-inner flex flex-col font-mono text-[#111]">
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

        <div className="relative z-10 flex-1 mt-6 px-1 flex flex-col gap-5">

          <div className="grid grid-cols-6 gap-x-2 gap-y-6">
            <Btn label="SHIFT" onClick={toggleShift} shiftL="" className="col-span-1" />
            <Btn label="ALPHA" onClick={toggleAlpha} shiftL="" className="col-span-1" />

            <div className="col-span-2 relative flex items-center justify-center -mt-4">
              <div className="w-[80px] h-[60px] bg-[#111] rounded-[30px] border-[3px] border-[#333] shadow-lg relative flex items-center justify-center overflow-hidden active:scale-95 transition-transform">
                <div className="w-[50px] h-[30px] bg-[#222] rounded-[15px] absolute shadow-inner" />
                <button onClick={() => handleNav("UP")} className="absolute top-0 w-full h-[20px]" />
                <button onClick={() => handleNav("DOWN")} className="absolute bottom-0 w-full h-[20px]" />
                <button onClick={() => handleNav("LEFT")} className="absolute left-0 w-[20px] h-full" />
                <button onClick={() => handleNav("RIGHT")} className="absolute right-0 w-[20px] h-full" />
                <div className="absolute text-[#444] text-[8px] font-bold top-1">▲</div>
                <div className="absolute text-[#444] text-[8px] font-bold bottom-1">▼</div>
                <div className="absolute text-[#444] text-[8px] font-bold left-2">◀</div>
                <div className="absolute text-[#444] text-[8px] font-bold right-2">▶</div>
              </div>
            </div>

            <Btn label="MENU" onClick={toggleMenu} shiftL="SETUP" className="col-span-1" />
            <Btn label="ON" onClick={ac} className="col-span-1" />

            <Btn label="OPTN" onClick={() => {}} className="col-span-1" />
            <Btn label="CALC" onClick={() => {}} shiftL="=" className="col-span-1" />
            <Btn label="∫dx" onClick={() => insert("integrate(")} shiftL="d/dx" className="col-span-1" />
            <Btn label="x" onClick={() => insert("x")} className="col-span-1" />
            <Btn label="■/□" onClick={() => insert("(")} shiftL="a■/□" className="col-span-1" />
            <Btn label="√■" onClick={() => insert("√(")} shiftL="³√■" className="col-span-1" />

            <Btn label="x²" onClick={() => insert("²")} shiftL="x³" className="col-span-1" />
            <Btn label="x^■" onClick={() => insert("^")} shiftL="x√■" className="col-span-1" />
            <Btn label="log" onClick={() => insert("log(")} shiftL="10^■" className="col-span-1" />
            <Btn label="ln" onClick={() => insert("ln(")} shiftL="e^■" className="col-span-1" />
            <Btn label="(-)" onClick={() => insert("-")} className="col-span-1" />
            <Btn label={'°\'"'} onClick={() => {}} shiftL="←" className="col-span-1" />

            <Btn label="x⁻¹" onClick={() => insert("^-1")} shiftL="x!" className="col-span-1" />
            <Btn label="sin" onClick={() => insert("sin(")} shiftL="sin⁻¹" className="col-span-1" />
            <Btn label="cos" onClick={() => insert("cos(")} shiftL="cos⁻¹" className="col-span-1" />
            <Btn label="tan" onClick={() => insert("tan(")} shiftL="tan⁻¹" className="col-span-1" />
            <Btn label="STO" onClick={() => {}} shiftL="RECALL" className="col-span-1" />
            <Btn label="ENG" onClick={() => {}} shiftL="i" className="col-span-1" />

            <Btn label="(" onClick={() => insert("(")} className="col-span-1" />
            <Btn label=")" onClick={() => insert(")")} shiftL="x" alphaL="Y" className="col-span-1" />
            <Btn label="S⇔D" onClick={() => {}} className="col-span-1" />
            <Btn label="M+" onClick={() => {}} shiftL="M-" alphaL="M" className="col-span-1" />
          </div>

          <div className="grid grid-cols-5 gap-3 mt-4">
            <Btn label="7" onClick={() => insert("7")} type="number" shiftL="CONST" />
            <Btn label="8" onClick={() => insert("8")} type="number" shiftL="CONV" />
            <Btn label="9" onClick={() => insert("9")} type="number" shiftL="RESET" />
            <Btn label="DEL" onClick={del} type="operator" shiftL="INS" />
            <Btn label="AC" onClick={ac} type="operator" shiftL="OFF" />

            <Btn label="4" onClick={() => insert("4")} type="number" shiftL="MATRIX" />
            <Btn label="5" onClick={() => insert("5")} type="number" shiftL="VECTOR" />
            <Btn label="6" onClick={() => insert("6")} type="number" />
            <Btn label="×" onClick={() => insert("×")} type="normal" btnClassName="bg-[#D3D3D3] text-black hover:bg-[#EAEAEA]" />
            <Btn label="÷" onClick={() => insert("÷")} type="normal" btnClassName="bg-[#D3D3D3] text-black hover:bg-[#EAEAEA]" />

            <Btn label="1" onClick={() => insert("1")} type="number" shiftL="STAT" />
            <Btn label="2" onClick={() => insert("2")} type="number" shiftL="CMPLX" />
            <Btn label="3" onClick={() => insert("3")} type="number" shiftL="BASE" />
            <Btn label="+" onClick={() => insert("+")} type="normal" btnClassName="bg-[#D3D3D3] text-black hover:bg-[#EAEAEA]" />
            <Btn label="-" onClick={() => insert("-")} type="normal" btnClassName="bg-[#D3D3D3] text-black hover:bg-[#EAEAEA]" />

            <Btn label="0" onClick={() => insert("0")} type="number" />
            <Btn label="." onClick={() => insert(".")} type="number" />
            <Btn label="×10ˣ" onClick={() => insert("x10^")} type="number" shiftL="π" alphaL="e" />
            <Btn label="Ans" onClick={() => insert("Ans")} type="normal" btnClassName="bg-[#D3D3D3] text-black hover:bg-[#EAEAEA]" />
            <Btn label="=" onClick={handleEqual} type="operator" btnClassName="bg-[#333] text-[#FFF] hover:bg-[#444]" />
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
