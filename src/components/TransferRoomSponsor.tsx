import { Server, Shield, ExternalLink, Sparkles } from "lucide-react";
import { MONETIZATION_CONFIG } from "../config/monetization";

interface TransferRoomSponsorProps {
  className?: string;
}

export function TransferRoomSponsor({ className = "" }: TransferRoomSponsorProps) {
  return (
    <div className={`w-full max-w-md mx-auto my-6 flex flex-col items-center gap-2 ${className}`}>
      <div className="w-full p-4 rounded-2xl bg-gradient-to-br from-[#12141a] to-[#1c1f26] text-white border border-white/10 shadow-lg relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#0071e3]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3 text-[11px] text-white/50 uppercase tracking-widest font-bold">
          <span className="flex items-center gap-1.5 text-[#38bdf8]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sponsored Infrastructure</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-white/70">
            Cookieless
          </span>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0071e3]/20 border border-[#0071e3]/40 flex items-center justify-center shrink-0 text-[#38bdf8]">
            <Server className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <span>High-Bandwidth VPS from $4/mo</span>
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Run your own WebRTC signaling, high-concurrency Node/Python bots, or Docker containers with dedicated IPv4.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>$200 Free Cloud Credit Included</span>
          </div>
          <a
            href={MONETIZATION_CONFIG.cloudHostingAffiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-xs transition-colors"
          >
            <span>Claim $200 Credit</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Direct Sponsor inquiry link */}
      <a
        href={MONETIZATION_CONFIG.sponsorInquiryMailto}
        className="text-[11px] text-[#86868b] dark:text-[#a1a1aa] hover:text-[#0071e3] dark:hover:text-[#38bdf8] transition-colors inline-flex items-center gap-1"
      >
        <span>Sponsor ShareFlow (100% Cookieless Developer Audience) →</span>
      </a>
    </div>
  );
}
