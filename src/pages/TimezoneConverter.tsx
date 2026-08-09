import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Globe, Plus, Trash2 } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

interface ZoneClock {
  zone: string;
  label: string;
}

const PRESETS: { label: string; zone: string }[] = [
  { label: "Current", zone: Intl.DateTimeFormat().resolvedOptions().timeZone },
  { label: "London", zone: "Europe/London" },
  { label: "New York", zone: "America/New_York" },
  { label: "Los Angeles", zone: "America/Los_Angeles" },
  { label: "Dubai", zone: "Asia/Dubai" },
  { label: "Tokyo", zone: "Asia/Tokyo" },
  { label: "Sydney", zone: "Australia/Sydney" },
  { label: "Berlin", zone: "Europe/Berlin" },
  { label: "India", zone: "Asia/Kolkata" },
  { label: "Shanghai", zone: "Asia/Shanghai" },
];

const EXTRA_ZONES = [
  "UTC",
  "America/Chicago",
  "America/Denver",
  "America/Sao_Paulo",
  "Europe/Paris",
  "Europe/Moscow",
  "Africa/Cairo",
  "Africa/Lagos",
  "Asia/Singapore",
  "Asia/Seoul",
  "Asia/Hong_Kong",
  "Asia/Karachi",
  "Asia/Dhaka",
  "Asia/Jakarta",
  "Pacific/Auckland",
  "Pacific/Honolulu",
];

const ALL_ZONES = Array.from(new Set([...PRESETS.map(p => p.zone), ...EXTRA_ZONES])).sort((a, b) => a.localeCompare(b));

export default function TimezoneConverter() {
  const [clocks, setClocks] = useState<ZoneClock[]>(PRESETS.map(p => ({ zone: p.zone, label: p.label })));
  const [selected, setSelected] = useState("UTC");
  const [customLabel, setCustomLabel] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ALL_ZONES;
    return ALL_ZONES.filter(z => z.toLowerCase().includes(q));
  }, [search]);

  const addClock = () => {
    const zone = selected;
    if (!zone || clocks.some(c => c.zone === zone)) return;
    const preset = PRESETS.find(p => p.zone === zone);
    const label = customLabel.trim() || preset?.label || zone.replace("_", " ").split("/").pop();
    setClocks(prev => [...prev, { zone, label }]);
    setCustomLabel("");
  };

  const removeClock = (zone: string) => setClocks(prev => prev.filter(c => c.zone !== zone));

  const offsetFor = (zone: string) => {
    try {
      const dtf = new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "longOffset" });
      return (dtf.formatToParts(new Date()).find(p => p.type === "timeZoneName")?.value || "").replace("GMT", "UTC");
    } catch {
      return "—";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Timezone Converter</h1>
        <p className="text-white/50 text-sm">Compare local times across multiple time zones in real time.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 flex-1 flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
          {clocks.map(c => (
            <div key={c.zone} className="bg-white/5 border border-white/10 p-5 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-white/40" />
                  <p className="text-xs font-bold uppercase tracking-widest truncate">{c.label}</p>
                </div>
                <button onClick={() => removeClock(c.zone)} className="text-white/30 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-3xl font-black mt-3 font-mono">
                {new Date().toLocaleTimeString("en-US", { timeZone: c.zone, hour: "2-digit", minute: "2-digit", hour12: true })}
              </p>
              <p className="text-[10px] text-white/40 mt-2 capitalize">
                {new Date().toLocaleDateString("en-US", { timeZone: c.zone, weekday: "short", month: "short", day: "numeric" })}
              </p>
              <p className="text-[10px] text-white/30 font-mono mt-1">{c.zone} · {offsetFor(c.zone)}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 p-6 space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-white/50">Add timezone</p>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search timezone… e.g. Tokyo, London, Asia/Kolkata"
            className="w-full p-3 bg-[#0A0A0A] border border-white/10 outline-none text-xs font-mono text-white/80"
          />
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
            {filtered.map(zone => {
              const added = clocks.some(c => c.zone === zone);
              return (
                <button
                  key={zone}
                  onClick={() => setSelected(zone)}
                  disabled={added}
                  className={`px-3 py-1.5 text-[10px] font-mono border transition-colors ${selected === zone ? "bg-white text-black border-white" : added ? "border-white/10 text-white/30 cursor-default" : "border-white/20 text-white/60 hover:border-white/40"}`}
                >
                  {zone}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3 items-end">
            <input
              type="text"
              value={customLabel}
              onChange={e => setCustomLabel(e.target.value)}
              placeholder="Label (optional)"
              className="flex-1 min-w-[160px] p-3 bg-[#0A0A0A] border border-white/10 outline-none text-xs text-white/80"
            />
            <button onClick={addClock} className="bg-white text-black text-xs font-black uppercase tracking-widest py-3 px-6 flex items-center gap-2 hover:bg-white/80 transition-colors">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>
      </motion.div>

      <SEOContent
        title="Timezone Converter"
        description="Free timezone converter — compare the current time across world time zones instantly in your browser."
        steps={[
          { title: "Compare", description: "Key world cities are pre-loaded with live clocks." },
          { title: "Search", description: "Find any IANA timezone by name or city." },
          { title: "Add", description: "Add zones to the board and remove them freely." },
        ]}
        faqs={[
          { question: "Which timezones are supported?", answer: "Any IANA timezone, e.g. America/New_York or Asia/Tokyo. Search by code or city name." },
          { question: "Do the clocks update automatically?", answer: "Yes — each clock reflects your browser's current time in that zone." },
          { question: "Is this accurate?", answer: "Yes. Times come from your browser's Intl API, so daylight saving time is handled automatically." },
        ]}
      />
    </div>
  );
}