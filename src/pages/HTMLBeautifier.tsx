import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Minimize2, Maximize2 } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

export default function HTMLBeautifier() {
  const [input, setInput] = useState(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Example</title><style>body{margin:0;padding:0;font-family:sans-serif}</style></head><body><div class="container"><h1>Hello World</h1><p>This is a <strong>paragraph</strong> with <a href="#">a link</a>.</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul></div><script>console.log("test");</script></body></html>`);
  const [indentSize, setIndentSize] = useState(2);
  const [useTabs, setUseTabs] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<"beautify" | "minify">("beautify");

  const beautifyHTML = (html: string, indent: number, tabs: boolean): string => {
    const indentChar = tabs ? "\t" : " ".repeat(indent);
    
    // Remove existing whitespace between tags
    let formatted = html.replace(/>\s+</g, "><").trim();
    
    // Self-closing and inline tags that shouldn't create new lines
    const inlineTags = new Set(["a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn", "em", "i", "kbd", "mark", "q", "rp", "rt", "ruby", "s", "samp", "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "img", "input"]);
    const selfClosing = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
    const preserveContent = new Set(["script", "style", "pre", "code", "textarea"]);
    
    let result = "";
    let level = 0;
    let i = 0;
    let inPreserve = false;
    let preserveTag = "";

    while (i < formatted.length) {
      if (formatted[i] === "<") {
        // Find end of tag
        const tagEnd = formatted.indexOf(">", i);
        if (tagEnd === -1) break;
        
        const tag = formatted.substring(i, tagEnd + 1);
        const tagName = tag.match(/<\/?([a-zA-Z][a-zA-Z0-9]*)/)?.[1]?.toLowerCase() || "";
        const isClosing = tag.startsWith("</");
        const isSelfClose = selfClosing.has(tagName) || tag.endsWith("/>");
        const isComment = tag.startsWith("<!--");
        const isDoctype = tag.startsWith("<!");

        if (inPreserve) {
          result += tag;
          if (isClosing && tagName === preserveTag) {
            inPreserve = false;
            result += "\n";
          }
          i = tagEnd + 1;
          continue;
        }

        if (preserveContent.has(tagName) && !isClosing) {
          result += indentChar.repeat(level) + tag;
          inPreserve = true;
          preserveTag = tagName;
          i = tagEnd + 1;
          // Get content until closing tag
          const closeTagStart = formatted.indexOf(`</${tagName}>`, i);
          if (closeTagStart !== -1) {
            const content = formatted.substring(i, closeTagStart);
            result += content;
            i = closeTagStart;
          }
          continue;
        }

        if (isClosing) {
          level = Math.max(0, level - 1);
          result += indentChar.repeat(level) + tag + "\n";
        } else if (isSelfClose || isComment || isDoctype) {
          result += indentChar.repeat(level) + tag + "\n";
        } else if (inlineTags.has(tagName)) {
          // Check if there's a closing tag soon with only text content
          const closingTag = `</${tagName}>`;
          const closeIdx = formatted.indexOf(closingTag, tagEnd + 1);
          const nextOpenTag = formatted.indexOf("<", tagEnd + 1);
          
          if (closeIdx !== -1 && (nextOpenTag === -1 || nextOpenTag >= closeIdx)) {
            // Inline element with text content only
            const content = formatted.substring(tagEnd + 1, closeIdx);
            result += indentChar.repeat(level) + tag + content + closingTag + "\n";
            i = closeIdx + closingTag.length;
            continue;
          } else {
            result += indentChar.repeat(level) + tag + "\n";
            level++;
          }
        } else {
          result += indentChar.repeat(level) + tag + "\n";
          level++;
        }
        
        i = tagEnd + 1;
      } else {
        // Text content
        let textEnd = formatted.indexOf("<", i);
        if (textEnd === -1) textEnd = formatted.length;
        const text = formatted.substring(i, textEnd).trim();
        if (text) {
          result += indentChar.repeat(level) + text + "\n";
        }
        i = textEnd;
      }
    }

    return result.trimEnd();
  };

  const minifyHTML = (html: string): string => {
    return html
      .replace(/\n/g, "")
      .replace(/\s{2,}/g, " ")
      .replace(/>\s+</g, "><")
      .replace(/\s+>/g, ">")
      .trim();
  };

  const output = useMemo(() => {
    try {
      return mode === "beautify" ? beautifyHTML(input, indentSize, useTabs) : minifyHTML(input);
    } catch {
      return "Error formatting HTML";
    }
  }, [input, indentSize, useTabs, mode]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = output.split("\n").length;
  const charCount = output.length;

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">HTML Beautifier</h1>
        <p className="text-white/50 text-sm">Format and beautify HTML code with custom indentation.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 flex-1 flex flex-col">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center bg-white/5 p-4 border border-white/10">
          <div className="flex gap-2">
            <button onClick={() => setMode("beautify")} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors flex items-center gap-1 ${mode === "beautify" ? "bg-white text-black border-white" : "border-white/20 text-white/60"}`}>
              <Maximize2 className="w-3 h-3" /> Beautify
            </button>
            <button onClick={() => setMode("minify")} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors flex items-center gap-1 ${mode === "minify" ? "bg-white text-black border-white" : "border-white/20 text-white/60"}`}>
              <Minimize2 className="w-3 h-3" /> Minify
            </button>
          </div>

          {mode === "beautify" && (
            <>
              <div className="flex gap-2 items-center">
                <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Indent:</span>
                {[2, 4].map(n => (
                  <button key={n} onClick={() => { setIndentSize(n); setUseTabs(false); }} className={`px-3 py-1 text-xs font-bold border transition-colors ${!useTabs && indentSize === n ? "bg-white text-black border-white" : "border-white/20 text-white/60"}`}>
                    {n} spaces
                  </button>
                ))}
                <button onClick={() => setUseTabs(true)} className={`px-3 py-1 text-xs font-bold border transition-colors ${useTabs ? "bg-white text-black border-white" : "border-white/20 text-white/60"}`}>
                  Tabs
                </button>
              </div>
            </>
          )}

          <span className="text-[10px] text-white/30 font-mono ml-auto">{lineCount} lines · {charCount} chars</span>
        </div>

        {/* Editor panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
          {/* Input */}
          <div className="flex flex-col bg-white/5 border border-white/10">
            <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Input</span>
              <span className="text-[10px] text-white/20 font-mono">{input.length} chars</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste HTML code here..."
              className="flex-1 min-h-[300px] p-4 bg-transparent outline-none font-mono text-xs text-white/80 resize-none leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div className="flex flex-col bg-white/5 border border-white/10">
            <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Output</span>
              <button onClick={copyOutput} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                {copied ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
              </button>
            </div>
            <pre className="flex-1 min-h-[300px] p-4 overflow-auto font-mono text-xs text-green-400/80 leading-relaxed whitespace-pre">{output}</pre>
          </div>
        </div>
      </motion.div>

      <SEOContent
        title="HTML Beautifier"
        description="Format, beautify, or minify HTML code with customizable indentation. No server processing."
        steps={[
          { title: "Paste HTML", description: "Paste your HTML code in the input panel on the left." },
          { title: "Choose mode", description: "Select Beautify to format with indentation, or Minify to compress." },
          { title: "Copy output", description: "Copy the formatted HTML from the output panel." },
        ]}
        faqs={[
          { question: "Does it preserve scripts?", answer: "Yes. Content inside <script>, <style>, <pre>, and <textarea> tags is preserved as-is without reformatting." },
          { question: "Can I use tabs?", answer: "Yes. Choose between 2 spaces, 4 spaces, or tab indentation." },
          { question: "Is my code uploaded?", answer: "No. All formatting happens locally in your browser. Your code never leaves your device." },
        ]}
      />
    </div>
  );
}
