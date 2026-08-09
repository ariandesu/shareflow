import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, RefreshCw } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export default function TimeNow() {
  const [now, setNow] = useState(() => new Date());
  const [showUtc, setShowUtc] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const tz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

  const offsetMin = -now.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offsetMin) / 60);
  const offsetMins = Math.abs(offsetMin) % 60;
  const offsetLabel = `UTC${offsetMin >= 0 ? "+" : "-"}${pad(offsetHours)}${offsetMins ? ":" + pad(offsetMins) : ""}`;

  const t24 = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const h12 = now.getHours() % 12 || 12;
  const ampm = now.getHours() >= 12 ? "PM" : "AM";
  const t12 = `${h12}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${ampm}`;

  const dateLong = now.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const tzShort = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", timeZoneName: "short" }).split(" ").pop()?.replace(/[()]/g, "") || "";

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const utcNow = new Date(now.getTime() + offsetMin * 60000);
  const utcPieces = {
    days: weekdays[utcNow.getUTCDay()],
    date: utcNow.getUTCDate(),
    month: months[utcNow.getUTCMonth()],
    year: utcNow.getUTCFullYear(),
    hours: pad(utcNow.getUTCHours()),
    minutes: pad(utcNow.getUTCMinutes()),
    seconds: pad(utcNow.getUTCSeconds()),
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Your Time</h1>
        <p className="text-white/50 text-sm">The current time right now, in your timezone — live and always in sync.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 flex-1 flex flex-col">
        <div className="bg-white/5 border border-white/10 p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15),transparent_70%)]" />
          <div className="flex items-center justify-center gap-2 text-[10px] text-white/40 uppercase tracking-widest mb-8">
            <MapPin className="w-3 h-3" /> {tz} · {offsetLabel} · {tzShort}
          </div>
          <p className="text-6xl sm:text-8xl md:text-9xl font-black tabular-nums tracking-tighter leading-none">
            {pad(now.getHours())}:{pad(now.getMinutes())}
            <span className="text-2xl sm:text-4xl md:text-5xl text-white/50 align-top ml-2 tabular-nums">{pad(now.getSeconds())}</span>
          </p>
          <p className="text-white/60 font-mono text-sm mt-6">{dateLong}</p>
          <p className="text-white/30 text-xs mt-2">{t12}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Hours", value: pad(now.getHours()) },
            { label: "Minutes", value: pad(now.getMinutes()) },
            { label: "Seconds", value: pad(now.getSeconds()) },
            { label: "Day", value: `${weekdays[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}` },
          ].map(item => (
            <div key={item.label} className="bg-white/5 border border-white/10 p-4 text-center">
              <p className="text-4xl font-black tabular-nums">{item.value}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-2">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-white/40" />
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Timezone</p>
              <p className="text-sm font-bold">{tz}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] text-white/40 uppercase tracking-widest">UTC Offset</p>
              <p className="text-sm font-bold">{offsetLabel}</p>
            </div>
            <button onClick={() => setShowUtc(s => !s)} className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white underline underline-offset-4 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> {showUtc ? "Hide" : "UTC"}
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] text-white/40 uppercase tracking-widest">24h</p>
              <p className="font-mono text-sm">{t24}</p>
            </div>
          </div>
        </div>

        {showUtc && (
          <div className="bg-white/5 border border-white/10 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">Same instant in UTC</p>
            <div className="grid grid-cols-6 gap-2 text-center">
              {[{ k: "day", v: utcPieces.days }, { k: "date", v: utcPieces.date }, { k: "month", v: utcPieces.month }, { k: "hour", v: utcPieces.hours }, { k: "min", v: utcPieces.minutes }, { k: "sec", v: utcPieces.seconds }].map(c => (
                <div key={c.k} className="bg-[#0A0A0A] border border-white/10 py-2">
                  <p className="text-lg font-black tabular-nums">{c.v}</p>
                  <p className="text-[9px] text-white/40 uppercase tracking-widest">{c.k}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-white/30 mt-3 font-mono">{utcPieces.month} {utcPieces.date}, {utcPieces.year} · {utcPieces.hours}:{utcPieces.minutes}:{utcPieces.seconds} UTC</p>
          </div>
        )}
      </motion.div>

      <SEOContent
        title="Current Time – Live Clock in Your Timezone"
        description="See the exact current time right now in your timezone — a live digital clock with date and UTC offset, right in your browser."
        steps={[
          { title: "Open the clock", description: "Your local time is shown automatically — no configuration needed." },
          { title: "Read the time", description: "A large live clock with seconds, date and timezone offset." },
          { title: "Check UTC", description: "Swap the UTC toggle to see the same instant in Coordinated Universal Time." },
        ]}
        faqs={[
          { question: "Which timezone is shown?", answer: "Your browser's current timezone, detected automatically via the Intl API." },
          { question: "Does it update live?", answer: "Yes — the clock ticks every second and always stays in sync." },
          { question: "Does it respect daylight saving?", answer: "Yes. The offset comes from your system time, so DST is handled automatically." },
        ]}
      />
    </div>
  );
}