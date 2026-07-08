import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SEOContent } from "../components/SEOContent";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!pattern) {
      setMatches([]);
      setError("");
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const newMatches = [...testString.matchAll(regex)];
      setMatches(newMatches);
      setError("");
    } catch (err: any) {
      setError(err.message);
      setMatches([]);
    }
  }, [pattern, flags, testString]);

  const highlightMatches = () => {
    if (!pattern || error || matches.length === 0) return <>{testString}</>;

    let lastIndex = 0;
    const elements = [];
    
    matches.forEach((match, i) => {
      const startIndex = match.index!;
      const endIndex = startIndex + match[0].length;
      
      if (startIndex > lastIndex) {
        elements.push(<span key={`text-${i}`}>{testString.slice(lastIndex, startIndex)}</span>);
      }
      
      elements.push(
        <span key={`match-${i}`} className="bg-white/20 text-white px-0.5 rounded">
          {match[0]}
        </span>
      );
      
      lastIndex = endIndex;
    });

    if (lastIndex < testString.length) {
      elements.push(<span key="text-end">{testString.slice(lastIndex)}</span>);
    }

    return <>{elements}</>;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Regex Tester</h1>
        <p className="text-white/50 text-sm">Test and debug regular expressions.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 flex-1 flex flex-col"
      >
        <div className="bg-white/5 p-6 border border-white/10 space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Regular Expression</label>
            <div className="flex items-center space-x-4 bg-[#0A0A0A] border border-white/10 p-2 focus-within:border-white/30 transition-colors">
              <span className="text-white/50 text-xl">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="pattern"
                className="flex-1 bg-transparent outline-none font-mono text-sm text-white/80"
              />
              <span className="text-white/50 text-xl">/</span>
              <input
                type="text"
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                placeholder="flags (e.g. gm)"
                className="w-24 bg-transparent outline-none font-mono text-sm text-white/80"
              />
            </div>
            {error && <p className="text-red-400 font-bold uppercase tracking-widest text-xs mt-2">{error}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
          <div className="space-y-4 flex flex-col">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Test String</label>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter text to test against..."
              className="flex-1 w-full min-h-[300px] p-4 bg-[#0A0A0A] border border-white/10 focus:border-white/30 outline-none resize-none font-mono text-sm text-white/80 placeholder:text-white/20"
            />
          </div>

          <div className="space-y-4 flex flex-col">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Match Result</label>
              <span className="text-xs font-mono text-white/50">{matches.length} matches</span>
            </div>
            <div className="flex-1 w-full min-h-[300px] p-4 bg-[#0A0A0A] border border-white/10 overflow-auto font-mono text-sm text-white/80 whitespace-pre-wrap break-all">
              {highlightMatches()}
            </div>
          </div>
        </div>
      </motion.div>
    
      <SEOContent 
        title="Regex Tester"
        description="Test and debug JavaScript regular expressions online. See matches highlighted in real-time."
        steps={[{"title":"Write pattern","description":"Enter your regular expression pattern and specify any flags (like 'g' or 'm')."},{"title":"Provide test string","description":"Paste the text you want to evaluate against your regex pattern."},{"title":"Analyze matches","description":"The tool will highlight all matching substrings in real-time, helping you debug your regex."}]}
        faqs={[{"question":"Which regex engine does this use?","answer":"This tool uses the JavaScript (ECMAScript) regular expression engine built into your web browser."},{"question":"What are regex flags?","answer":"Flags modify how a regular expression searches. For example, 'g' makes the search global (finding all matches), and 'i' makes it case-insensitive."},{"question":"Can I test multi-line strings?","answer":"Yes, just make sure to use the 'm' (multiline) flag if you want anchors like ^ and $ to match the start and end of each line instead of the whole string."}]}
      />
    </div>
  );
}
