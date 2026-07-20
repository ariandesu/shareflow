import React, { useState, useEffect, useRef } from "react";
import * as math from "mathjs";
import { SEOContent } from "../components/SEOContent";

const m = math.create(math.all, {});
m.config({ number: "BigNumber", precision: 14, angle: "deg" });

type CalcMode = "COMP" | "CMPLX" | "BASE-N" | "MATRIX" | "VECTOR" | "STAT" | "DIST" | "SPREAD" | "TABLE" | "EQN" | "INEQ" | "RATIO";
type ShiftState = "NONE" | "SHIFT" | "ALPHA";
type CalcBase = "DEC" | "HEX" | "BIN" | "OCT";

const MODES: CalcMode[] = ["COMP", "CMPLX", "BASE-N", "MATRIX", "VECTOR", "STAT", "DIST", "SPREAD", "TABLE", "EQN", "INEQ", "RATIO"];
const MODE_LABELS = ["Calculate", "Complex", "Base-N", "Matrix", "Vector", "Statistics", "Distrib.", "Spreadsheet", "Table", "Equation", "Inequal.", "Ratio"];

const MARKING_COLORS: Record<string, string> = {
  SHIFT: "#E8B339",
  ALPHA: "#E0506A",
  BASEN: "#3A86C8",
  CMPLX: "#8A5CF0",
};

const gridAreas = [
  `shift shift shift shift shift alpha alpha alpha alpha alpha replay replay replay replay replay replay replay replay replay replay menu menu menu menu menu on on on on on`,
  `optn optn optn optn optn calc calc calc calc calc replay replay replay replay replay replay replay replay replay replay integ integ integ integ integ sigma sigma sigma sigma sigma`,
  `frac frac frac frac frac sqrt sqrt sqrt sqrt sqrt sq sq sq sq sq pow pow pow pow pow log log log log log ln ln ln ln ln`,
  `neg neg neg neg neg dms dms dms dms dms rec rec rec rec rec sin sin sin sin sin cos cos cos cos cos tan tan tan tan tan`,
  `sto sto sto sto sto eng eng eng eng eng lp lp lp lp lp rp rp rp rp rp sd sd sd sd sd mplus mplus mplus mplus mplus`,
  `n7 n7 n7 n7 n7 n7 n8 n8 n8 n8 n8 n8 n9 n9 n9 n9 n9 n9 del del del del del del ac ac ac ac ac ac`,
  `n4 n4 n4 n4 n4 n4 n5 n5 n5 n5 n5 n5 n6 n6 n6 n6 n6 n6 mul mul mul mul mul mul div div div div div div`,
  `n1 n1 n1 n1 n1 n1 n2 n2 n2 n2 n2 n2 n3 n3 n3 n3 n3 n3 add add add add add add sub sub sub sub sub sub`,
  `n0 n0 n0 n0 n0 n0 dot dot dot dot dot dot exp exp exp exp exp exp ans ans ans ans ans ans eq eq eq eq eq eq`
];

interface Marking { t: string; c: string; }

const Btn = ({ cfg, gridName }: { cfg: { label: string; onClick: () => void; bg: string; fg: string; markings: Marking[] }; gridName: string }) => (
  <div className="flex flex-col items-center justify-end h-[44px] relative" style={{ gridArea: gridName }}>
    {cfg.markings.length > 0 && (
      <div className="flex gap-1 text-[7px] font-bold leading-none mb-px flex-wrap justify-center">
        {cfg.markings.map((m, i) => (
          <span key={i} style={{ color: MARKING_COLORS[m.c] || "#FFF" }}>{m.t}</span>
        ))}
      </div>
    )}
    <button
      onClick={cfg.onClick}
      className="w-full h-[28px] rounded-md shadow-sm border-b-[2px] border-black/25 active:border-b-0 active:translate-y-[2px] transition-all font-bold flex items-center justify-center text-[10px]"
      style={{ backgroundColor: cfg.bg, color: cfg.fg }}
    >
      {cfg.label}
    </button>
  </div>
);

const ReplayPad = ({ onNav }: { onNav: (dir: "UP" | "DOWN" | "LEFT" | "RIGHT") => void }) => (
  <div className="relative w-full h-full flex items-center justify-center" style={{ gridArea: "replay" }}>
    <div className="w-[100px] h-[90px] bg-[#1A1A1A] rounded-[18px] border-[3px] border-[#2A2A2A] relative shadow-inner">
      <button onClick={() => onNav("UP")} className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-7 flex items-center justify-center text-[#666] text-[10px] font-bold hover:text-[#999] cursor-pointer z-10">▲</button>
      <button onClick={() => onNav("DOWN")} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-7 flex items-center justify-center text-[#666] text-[10px] font-bold hover:text-[#999] cursor-pointer z-10">▼</button>
      <button onClick={() => onNav("LEFT")} className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-7 flex items-center justify-center text-[#666] text-[10px] font-bold hover:text-[#999] cursor-pointer z-10">◀</button>
      <button onClick={() => onNav("RIGHT")} className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-7 flex items-center justify-center text-[#666] text-[10px] font-bold hover:text-[#999] cursor-pointer z-10">▶</button>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22px] h-[22px] bg-[#1E1E1E] rounded-full border border-[#333] shadow-inner" />
    </div>
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
  const [calcBase, setCalcBase] = useState<CalcBase>("DEC");

  const S = useRef({ mode, shiftState, displayInput, displayResult, isMenuOpen, menuCursor, history, historyIndex, ans, calcBase });
  useEffect(() => { S.current = { mode, shiftState, displayInput, displayResult, isMenuOpen, menuCursor, history, historyIndex, ans, calcBase }; });

  const memRef = useRef(0);
  const ansRef = useRef("0");

  const knownFns = new Set(["abs","acos","asin","atan","cbrt","combinations","cos","csc","cot","sec",
    "derivative","exp","integrate","ln","log","nthRoot","permutations","random","randomInt","round",
    "sin","sqrt","tan","pi","e","i","true","false","Infinity","NaN"]);

  const evaluate = (expr: string) => {
    try {
      if (!expr.trim()) return "";
      let parsed = expr
        .replace(/×/g, "*").replace(/÷/g, "/").replace(/π/g, "pi")
        .replace(/√\(/g, "sqrt(").replace(/²/g, "^2").replace(/³/g, "^3")
        .replace(/x10\^/g, "*10^").replace(/e\^\(/g, "exp(").replace(/%/g, "/100")
        .replace(/Ans/g, ansRef.current);

      const curMode = S.current.mode;
      const curBase = S.current.calcBase;

      if (curMode === "BASE-N") {
        const radix = curBase === "DEC" ? 10 : curBase === "HEX" ? 16 : curBase === "BIN" ? 2 : 8;
        if (curBase === "HEX") {
          parsed = parsed.replace(/\b([0-9A-Fa-f]+)\b/g, m =>
            knownFns.has(m.toLowerCase()) ? m : parseInt(m, 16).toString()
          );
        } else if (curBase === "BIN") {
          parsed = parsed.replace(/\b([01]+)\b/g, m => parseInt(m, 2).toString());
        } else if (curBase === "OCT") {
          parsed = parsed.replace(/\b([0-7]+)\b/g, m => parseInt(m, 8).toString());
        }
      }

      const raw = m.evaluate(parsed);

      if (curMode === "BASE-N") {
        const radix = curBase === "DEC" ? 10 : curBase === "HEX" ? 16 : curBase === "BIN" ? 2 : 8;
        const num = Math.round(Number(raw));
        return num.toString(radix).toUpperCase();
      }

      let formatted = m.format(raw, { precision: 12, upperExp: 10, lowerExp: -10 });
      formatted = formatted.replace(/\*/g, "×").replace(/\//g, "÷");
      const str = raw.toString();
      setAns(str);
      ansRef.current = str;
      return formatted;
    } catch { return "Math ERROR"; }
  };

  const selectMode = (idx: number) => {
    const m = MODES[idx];
    setMode(m);
    setIsMenuOpen(false);
    setDisplayInput("");
    setDisplayResult("");
    if (m !== "BASE-N") setCalcBase("DEC");
  };

  const handleEqual = () => {
    const s = S.current;
    if (s.isMenuOpen) { selectMode(s.menuCursor); return; }
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
      } else { setHistoryIndex(s.history.length); setDisplayInput(""); }
    }
  };

  const insert = (val: string) => {
    const s = S.current;
    if (s.displayResult && s.displayResult !== "Math ERROR") {
      if (["+", "-", "×", "÷", "^"].includes(val)) {
        setDisplayInput("Ans" + val);
      } else if (["²", "³", "!", "%"].includes(val)) {
        setDisplayInput(s.displayResult + val);
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
    if (S.current.displayResult) { setDisplayResult(""); return; }
    setDisplayInput(prev => prev.slice(0, -1));
  };

  const ac = () => { setDisplayInput(""); setDisplayResult(""); setShiftState("NONE"); setIsMenuOpen(false); };
  const toggleShift = () => setShiftState(s => s === "SHIFT" ? "NONE" : "SHIFT");
  const toggleAlpha = () => setShiftState(s => s === "ALPHA" ? "NONE" : "ALPHA");
  const toggleMenu = () => { setIsMenuOpen(o => { if (!o) setMenuCursor(0); return !o; }); setShiftState("NONE"); };

  const storeMem = () => { const s = S.current; const v = parseFloat(s.displayResult || s.displayInput); if (!isNaN(v)) memRef.current = v; };
  const recallMem = () => insert(memRef.current.toString());
  const memPlus = () => { const s = S.current; const v = parseFloat(s.displayResult || s.displayInput); if (!isNaN(v)) memRef.current += v; };
  const memMinus = () => { const s = S.current; const v = parseFloat(s.displayResult || s.displayInput); if (!isNaN(v)) memRef.current -= v; };

  const switchBase = (b: CalcBase) => {
    if (S.current.mode === "BASE-N") {
      setCalcBase(b);
      setDisplayInput("");
      setDisplayResult("");
    }
  };

  const action = (primary: () => void, shift?: () => void, alpha?: () => void, baseNFn?: () => void) => () => {
    const st = S.current.shiftState;
    const curMode = S.current.mode;
    if (curMode === "BASE-N" && baseNFn) { baseNFn(); setShiftState("NONE"); return; }
    if (curMode === "CMPLX" && baseNFn) { baseNFn(); setShiftState("NONE"); return; }
    if (st === "SHIFT" && shift) { shift(); setShiftState("NONE"); return; }
    if (st === "ALPHA" && alpha) { alpha(); setShiftState("NONE"); return; }
    primary();
  };

  const btns: Record<string, { label: string; onClick: () => void; bg: string; fg: string; markings: Marking[] }> = {
    shift: { label: "SHIFT", onClick: toggleShift, bg: "#F2D06B", fg: "#1a1a1a", markings: [] },
    alpha: { label: "ALPHA", onClick: toggleAlpha, bg: "#D9534F", fg: "#ffffff", markings: [] },
    menu: { label: "MENU", onClick: toggleMenu, bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "SETUP", c: "SHIFT" }] },
    on: { label: "ON", onClick: ac, bg: "#2b2b2b", fg: "#ffffff", markings: [] },
    optn: { label: "OPTN", onClick: () => {}, bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "OR", c: "SHIFT" }] },
    calc: { label: "CALC", onClick: action(() => {}, () => {}, () => insert("=")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "SOLVE", c: "SHIFT" }, { t: "=", c: "ALPHA" }] },
    integ: { label: "∫dx", onClick: action(() => insert("integrate("), () => insert("derivative("), () => insert(":")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "d/dx", c: "SHIFT" }, { t: ":", c: "ALPHA" }] },
    sigma: { label: "x", onClick: action(() => insert("x"), () => insert("Σ(")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "Σ", c: "SHIFT" }, { t: "=", c: "ALPHA" }] },
    frac: { label: "□/□", onClick: () => insert("("), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "a⌐b/c", c: "SHIFT" }] },
    sqrt: { label: "√□", onClick: action(() => insert("√("), () => insert("cbrt(")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "³√", c: "SHIFT" }] },
    sq: { label: "x²", onClick: action(() => insert("²"), () => insert("³"), undefined, () => switchBase("DEC")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "x³", c: "SHIFT" }, { t: "DEC", c: "BASEN" }] },
    pow: { label: "x^■", onClick: action(() => insert("^"), () => insert("nthRoot("), undefined, () => switchBase("HEX")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "ˣ√", c: "SHIFT" }, { t: "HEX", c: "BASEN" }] },
    log: { label: "log□□", onClick: action(() => insert("log("), () => insert("10^("), undefined, () => switchBase("BIN")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "10ˣ", c: "SHIFT" }, { t: "BIN", c: "BASEN" }] },
    ln: { label: "ln", onClick: action(() => insert("ln("), () => insert("e^("), undefined, () => switchBase("OCT")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "eˣ", c: "SHIFT" }, { t: "OCT", c: "BASEN" }] },
    neg: { label: "(-)", onClick: action(() => insert("-"), () => insert("log("), () => insert("A")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "log", c: "SHIFT" }, { t: "A", c: "ALPHA" }] },
    dms: { label: "° ' ''", onClick: action(() => {}, () => insert("!"), () => insert("B")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "FACT", c: "SHIFT" }, { t: "B", c: "ALPHA" }] },
    rec: { label: "x⁻¹", onClick: action(() => insert("^-1"), () => insert("!"), () => insert("C")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "x!", c: "SHIFT" }, { t: "C", c: "ALPHA" }] },
    sin: { label: "sin", onClick: action(() => insert("sin("), () => insert("asin("), () => insert("D")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "sin⁻¹", c: "SHIFT" }, { t: "D", c: "ALPHA" }] },
    cos: { label: "cos", onClick: action(() => insert("cos("), () => insert("acos("), () => insert("E")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "cos⁻¹", c: "SHIFT" }, { t: "E", c: "ALPHA" }] },
    tan: { label: "tan", onClick: action(() => insert("tan("), () => insert("atan("), () => insert("F")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "tan⁻¹", c: "SHIFT" }, { t: "F", c: "ALPHA" }] },
    sto: { label: "STO", onClick: action(storeMem, recallMem), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "RECALL", c: "SHIFT" }] },
    eng: { label: "ENG", onClick: action(() => {}, () => {}, undefined, () => insert("∠")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "∠", c: "CMPLX" }, { t: "←", c: "CMPLX" }] },
    lp: { label: "(", onClick: action(() => insert("("), () => insert("abs(")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "Abs", c: "SHIFT" }] },
    rp: { label: ")", onClick: action(() => insert(")"), () => insert(","), () => insert("x")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: ",", c: "SHIFT" }, { t: "x", c: "ALPHA" }] },
    sd: { label: "S⇔D", onClick: action(() => {}, () => {}, () => insert("Y")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "a⌐b/c⇔d/c", c: "SHIFT" }, { t: "Y", c: "ALPHA" }] },
    mplus: { label: "M+", onClick: action(memPlus, memMinus, () => insert("M")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "M-", c: "SHIFT" }, { t: "M", c: "ALPHA" }] },
    n7: { label: "7", onClick: action(() => insert("7")), bg: "#f2f2f2", fg: "#1a1a1a", markings: [{ t: "CONST", c: "SHIFT" }] },
    n8: { label: "8", onClick: action(() => insert("8")), bg: "#f2f2f2", fg: "#1a1a1a", markings: [{ t: "CONV", c: "SHIFT" }] },
    n9: { label: "9", onClick: action(() => insert("9")), bg: "#f2f2f2", fg: "#1a1a1a", markings: [{ t: "RESET", c: "SHIFT" }] },
    del: { label: "DEL", onClick: action(del), bg: "#2f6fed", fg: "#ffffff", markings: [{ t: "INS", c: "SHIFT" }, { t: "UNDO", c: "ALPHA" }] },
    ac: { label: "AC", onClick: action(ac), bg: "#2f6fed", fg: "#ffffff", markings: [{ t: "OFF", c: "SHIFT" }] },
    n4: { label: "4", onClick: () => insert("4"), bg: "#f2f2f2", fg: "#1a1a1a", markings: [] },
    n5: { label: "5", onClick: () => insert("5"), bg: "#f2f2f2", fg: "#1a1a1a", markings: [] },
    n6: { label: "6", onClick: () => insert("6"), bg: "#f2f2f2", fg: "#1a1a1a", markings: [] },
    mul: { label: "×", onClick: action(() => insert("×"), () => insert("permutations(")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "nPr", c: "SHIFT" }] },
    div: { label: "÷", onClick: action(() => insert("÷"), () => insert("combinations(")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "nCr", c: "SHIFT" }] },
    n1: { label: "1", onClick: () => insert("1"), bg: "#f2f2f2", fg: "#1a1a1a", markings: [] },
    n2: { label: "2", onClick: () => insert("2"), bg: "#f2f2f2", fg: "#1a1a1a", markings: [] },
    n3: { label: "3", onClick: () => insert("3"), bg: "#f2f2f2", fg: "#1a1a1a", markings: [] },
    add: { label: "+", onClick: action(() => insert("+")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "Pol", c: "SHIFT" }] },
    sub: { label: "−", onClick: action(() => insert("-")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "Rec", c: "SHIFT" }] },
    n0: { label: "0", onClick: action(() => insert("0")), bg: "#f2f2f2", fg: "#1a1a1a", markings: [{ t: "Rnd", c: "SHIFT" }] },
    dot: { label: ".", onClick: action(() => insert("."), () => insert("random()"), () => insert("randomInt(")), bg: "#f2f2f2", fg: "#1a1a1a", markings: [{ t: "Ran#", c: "SHIFT" }, { t: "RanInt", c: "ALPHA" }] },
    exp: { label: "×10ˣ", onClick: action(() => insert("x10^"), () => insert("π"), () => insert("e")), bg: "#f2f2f2", fg: "#1a1a1a", markings: [{ t: "π", c: "SHIFT" }, { t: "e", c: "ALPHA" }] },
    ans: { label: "Ans", onClick: action(() => insert("Ans")), bg: "#2b2b2b", fg: "#ffffff", markings: [{ t: "%", c: "SHIFT" }] },
    eq: { label: "=", onClick: action(handleEqual), bg: "#2f6fed", fg: "#ffffff", markings: [{ t: "≈", c: "SHIFT" }] },
  };

  const gridKeys = ["shift", "alpha", "menu", "on", "optn", "calc", "integ", "sigma", "frac", "sqrt", "sq", "pow", "log", "ln", "neg", "dms", "rec", "sin", "cos", "tan", "sto", "eng", "lp", "rp", "sd", "mplus", "n7", "n8", "n9", "del", "ac", "n4", "n5", "n6", "mul", "div", "n1", "n2", "n3", "add", "sub", "n0", "dot", "exp", "ans", "eq"];

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col xl:flex-row gap-12 items-center justify-center p-4">

      <div className="relative w-[340px] h-auto min-h-[720px] pb-6 bg-[#1E1E1E] rounded-3xl shadow-2xl p-4 flex flex-col flex-shrink-0"
        style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 1px 3px rgba(255,255,255,0.1), inset 0 -5px 15px rgba(0,0,0,0.3)" }}
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

        <div className="flex justify-center mt-1.5">
          <span className="text-[7px] text-[#666] tracking-[2px] font-mono">UNDER DEVELOPMENT</span>
        </div>
        <div className="mt-1 w-full h-[120px] bg-[#9EA798] border-[5px] border-[#1A1A1A] rounded-lg p-2 shadow-inner flex flex-col font-mono text-[#111]">
          <div className="flex justify-between items-center text-[10px] h-4 mb-1">
            <div className="flex gap-2">
              <span className={shiftState === "SHIFT" ? "font-black" : "opacity-10"}>S</span>
              <span className={shiftState === "ALPHA" ? "font-black" : "opacity-10"}>A</span>
              <span className="font-bold">{mode === "BASE-N" ? calcBase : mode}</span>
            </div>
            <div className="flex gap-1 font-bold">
              <span>{mode === "CMPLX" ? "CMPLX" : mode === "BASE-N" ? "BASE" : "D"}</span>
              <span>Math</span><span>▼</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {isMenuOpen ? (
              <div className="grid grid-cols-4 grid-rows-3 gap-1 h-full p-1 bg-[#9EA798] absolute inset-0">
                {MODE_LABELS.map((m, i) => (
                  <button key={i} onClick={() => selectMode(i)}
                    className={`flex items-center justify-center text-[8px] font-bold text-center leading-none border cursor-pointer ${menuCursor === i ? "bg-black text-[#9EA798] border-black" : "border-transparent hover:bg-black/20"}`}
                  >{m}</button>
                ))}
              </div>
            ) : (
              <>
                <div className="flex-1 text-sm leading-tight break-all">{displayInput}</div>
                <div className="h-8 text-right text-3xl font-bold tracking-tight">{displayResult}</div>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 mt-3 px-0.5"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(30, 1fr)",
            gridTemplateRows: "auto auto auto auto auto auto auto auto auto",
            gridTemplateAreas: gridAreas.map(r => `"${r}"`).join(" "),
            gap: "5px 3px",
          }}
        >
          {gridKeys.map(name => name === "replay" ? null : <Btn key={name} cfg={btns[name]} gridName={name} />)}
          <ReplayPad onNav={handleNav} />
        </div>
      </div>

      <div className="flex-1 max-w-xl space-y-6">
        <SEOContent title="Casio fx-991EX ClassWiz Emulator"
          description="A 100% UI replica of the legendary Casio fx-991EX ClassWiz scientific calculator, powered by Math.js for advanced evaluation."
          steps={[
            { title: "Standard Operations", description: "Use the keypad just like the physical hardware for calculations." },
            { title: "Advanced Menus", description: "Click MENU to open the ClassWiz OS grid. Use the D-Pad to navigate and = to select." },
            { title: "Math.js Engine", description: "The backend safely evaluates complex expressions, trigonometry, and logarithms." },
          ]}
          faqs={[
            { question: "Is this a real ROM emulator?", answer: "No, it's a CSS/React UI replica. The math evaluation is handled by Math.js rather than the original Casio firmware." },
            { question: "Which modes work?", answer: "COMP (general calculation) is fully functional with trig, logs, powers, factorials, nPr/nCr, random numbers, and memory. BASE-N converts between DEC/HEX/BIN/OCT. CMPLX supports complex arithmetic. The remaining 9 modes (MATRIX, VECTOR, STAT, etc.) are under development." },
            { question: "How do I use SHIFT/ALPHA?", answer: "Click SHIFT or ALPHA once to toggle the state (indicated by S/A on the LCD screen), then click your target button." },
          ]}
        />
      </div>
    </div>
  );
}
