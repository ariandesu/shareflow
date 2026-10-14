import React, { useState } from "react";
import { motion } from "motion/react";
import { Copy, Check, FileJson } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

export function JSONFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);

  const formatJSON = (text: string, spaces: number) => {
    if (!text.trim()) {
      setOutput("");
      setError("");
      return;
    }
    try {
      const parsed = JSON.parse(text);
      setOutput(JSON.stringify(parsed, null, spaces));
      setError("");
    } catch (e: any) {
      setError(e.message || "Invalid JSON");
      setOutput("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    formatJSON(e.target.value, indent);
  };

  const handleIndentChange = (spaces: number) => {
    setIndent(spaces);
    formatJSON(input, spaces);
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">JSON Formatter</h1>
        <p className="text-white/50 text-sm">Format, validate, and beautify your JSON data.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 flex flex-col flex-1"
      >
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <div className="flex items-center space-x-6">
            <span className="text-xs font-bold uppercase tracking-widest text-white/50">Indent:</span>
            <div className="flex space-x-4">
              {[2, 4].map((spaces) => (
                <button
                  key={spaces}
                  onClick={() => handleIndentChange(spaces)}
                  className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                    indent === spaces ? "text-white underline underline-offset-4" : "text-white/30 hover:text-white"
                  }`}
                >
                  {spaces} spaces
                </button>
              ))}
            </div>
          </div>
          {output && (
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 text-white hover:text-white/80 font-black uppercase tracking-widest text-[10px] transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied" : "Copy Formatted"}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10 flex-1 min-h-[500px]">
          <div className="flex flex-col bg-[#0A0A0A]">
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder='{"paste": "your JSON here"}'
              className="flex-1 w-full p-6 bg-transparent outline-none resize-none font-mono text-sm text-white/80 placeholder:text-white/20"
              spellCheck={false}
            />
          </div>

          <div className="flex flex-col bg-[#111]">
            <div className="flex-1 p-6 overflow-auto">
              {error ? (
                <p className="text-red-400 font-mono text-sm uppercase tracking-widest">{error}</p>
              ) : output ? (
                <pre className="text-white/80 font-mono text-sm m-0">
                  {output}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/20 space-y-4">
                  <FileJson className="w-12 h-12" />
                  <p className="text-xs font-bold uppercase tracking-widest">Formatted JSON will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    
      <SEOContent 
        title="JSON Formatter"
        description="Format, validate, and beautify your JSON data online. A free developer tool to make JSON readable."
        steps={[{"title":"Paste JSON","description":"Paste your minified or unformatted JSON string into the input area."},{"title":"Set Indentation","description":"Choose between 2 or 4 spaces for your preferred indentation level."},{"title":"Copy Output","description":"Review the formatted and syntax-highlighted JSON, then click copy to save it."}]}
        faqs={[{"question":"How does the JSON Formatter work?","answer":"It parses your raw JSON string and stringifies it back with proper indentation and line breaks, making it easily readable by humans."},{"question":"Does it validate JSON?","answer":"Yes, if your JSON is invalid, the tool will display an error message indicating where the syntax issue lies."},{"question":"Is my JSON data sent anywhere?","answer":"No, all formatting and validation are done entirely on the client side inside your browser."}]}
      />
    </div>
  );
}
