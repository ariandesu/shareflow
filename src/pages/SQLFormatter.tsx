import { useState } from "react";
import { Database, Copy, Download, Check, Sparkles } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

export default function SQLFormatter() {
  const [sqlInput, setSqlInput] = useState(`SELECT u.id, u.username, u.email, COUNT(o.id) as total_orders, SUM(o.amount) as total_spent FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.status = 'ACTIVE' GROUP BY u.id, u.username, u.email HAVING COUNT(o.id) > 5 ORDER BY total_spent DESC LIMIT 50;`);
  const [uppercaseKeywords, setUppercaseKeywords] = useState(true);
  const [copied, setCopied] = useState(false);

  const formatSQL = (sql: string): string => {
    if (!sql.trim()) return "";
    let formatted = sql.replace(/\s+/g, " ").trim();
    
    const keywords = [
      "SELECT", "FROM", "WHERE", "GROUP BY", "HAVING", "ORDER BY", 
      "LIMIT", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "JOIN", 
      "ON", "AND", "OR", "SET", "UPDATE", "DELETE", "INSERT INTO", "VALUES"
    ];

    keywords.forEach((kw) => {
      const reg = new RegExp(`\\b${kw}\\b`, "gi");
      formatted = formatted.replace(reg, (match) => {
        const replacement = uppercaseKeywords ? match.toUpperCase() : match.toLowerCase();
        return `\n${replacement}`;
      });
    });

    return formatted.trim();
  };

  const formattedOutput = formatSQL(sqlInput);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([formattedOutput], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "query.sql";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 gap-8">
      <div className="text-center space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest">
          <Database className="w-4 h-4" /> Tool #42 • Developer Utilities
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-slate-950 dark:text-white">
          SQL Query Formatter & Beautifier
        </h1>
        <p className="text-sm text-slate-600 dark:text-white/60 font-medium">
          Format, beautify, and standardize raw SQL queries across PostgreSQL, MySQL, SQLite, and T-SQL.
        </p>
      </div>

      <div className="w-full bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/70">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={uppercaseKeywords}
                onChange={(e) => setUppercaseKeywords(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
              UPPERCASE Keywords (SELECT, FROM, WHERE)
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/70">
              Raw SQL Input
            </div>
            <textarea
              value={sqlInput}
              onChange={(e) => setSqlInput(e.target.value)}
              rows={16}
              placeholder="Paste unformatted SQL query here..."
              className="w-full p-4 font-mono text-xs bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-2xl text-slate-950 dark:text-white outline-none focus:border-emerald-500 transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/70">
              <span>Formatted SQL Output</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1 bg-slate-950 text-white dark:bg-white/10 hover:bg-emerald-600 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> .sql
                </button>
              </div>
            </div>
            <textarea
              readOnly
              value={formattedOutput}
              rows={16}
              className="w-full p-4 font-mono text-xs bg-slate-900 text-emerald-400 border border-slate-800 rounded-2xl outline-none resize-none"
            />
          </div>
        </div>
      </div>

      <SEOContent
        title="Free SQL Query Formatter & Beautifier Online"
        description="Format, indent, and standardize SQL queries online. Supports PostgreSQL, MySQL, SQLite, and T-SQL."
        steps={[
          { title: "Paste SQL Query", description: "Paste any raw or minified SQL query into the input box." },
          { title: "Configure Formatting", description: "Toggle uppercase keywords and auto-indentation options." },
          { title: "Copy or Download SQL File", description: "Copy your formatted SQL or download it as a .sql file." }
        ]}
      />
    </div>
  );
}
