import { useState } from "react";
import { Clock, Copy, Check, Sparkles } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

export default function CronGenerator() {
  const [minute, setMinute] = useState("0");
  const [hour, setHour] = useState("9");
  const [dom, setDom] = useState("*");
  const [month, setMonth] = useState("*");
  const [dow, setDow] = useState("*");
  const [copied, setCopied] = useState(false);

  const cronExpression = `${minute} ${hour} ${dom} ${month} ${dow}`;

  const getHumanReadable = (): string => {
    let desc = "Runs ";
    if (minute === "*" && hour === "*") desc += "every minute";
    else if (minute.startsWith("*/")) desc += `every ${minute.slice(2)} minutes`;
    else if (hour === "*") desc += `at minute ${minute} of every hour`;
    else desc += `daily at ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;

    if (dow !== "*") desc += ` on day-of-week ${dow}`;
    if (month !== "*") desc += ` in month ${month}`;
    return desc;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cronExpression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 gap-8">
      <div className="text-center space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest">
          <Clock className="w-4 h-4" /> Tool #43 • Developer Utilities
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-slate-950 dark:text-white">
          Cron Expression Generator & Humanizer
        </h1>
        <p className="text-sm text-slate-600 dark:text-white/60 font-medium">
          Build visual cron schedules for Linux crontab, Node.js node-cron, and cloud schedulers with human-readable descriptions.
        </p>
      </div>

      <div className="w-full bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Output Banner */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">Generated Cron Expression</span>
            <div className="text-2xl sm:text-4xl font-mono font-black text-white tracking-widest">{cronExpression}</div>
            <p className="text-xs text-slate-400 font-medium">{getHumanReadable()}</p>
          </div>
          <button
            onClick={handleCopy}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-widest rounded-xl flex items-center gap-2 transition-colors shadow-md"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied Cron!" : "Copy Expression"}
          </button>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-white/70">Minute (0-59)</label>
            <input
              type="text"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-xs font-bold font-mono text-slate-950 dark:text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-white/70">Hour (0-23)</label>
            <input
              type="text"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-xs font-bold font-mono text-slate-950 dark:text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-white/70">Day of Month (1-31)</label>
            <input
              type="text"
              value={dom}
              onChange={(e) => setDom(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-xs font-bold font-mono text-slate-950 dark:text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-white/70">Month (1-12)</label>
            <input
              type="text"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-xs font-bold font-mono text-slate-950 dark:text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-white/70">Day of Week (0-6)</label>
            <input
              type="text"
              value={dow}
              onChange={(e) => setDow(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-xs font-bold font-mono text-slate-950 dark:text-white outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      <SEOContent
        title="Free Cron Expression Generator & Builder Online"
        description="Build visual cron schedules for crontab, cloud schedulers, and background workers with human-readable explanations."
        steps={[
          { title: "Configure Schedule Fields", description: "Set minute, hour, day of month, month, and day of week values." },
          { title: "Read Human Description", description: "Verify your schedule in plain English under the generated expression." },
          { title: "Copy Cron Expression", description: "Copy your cron string directly into Linux crontab or cloud task schedulers." }
        ]}
      />
    </div>
  );
}
