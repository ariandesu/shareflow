import { Link } from "react-router-dom";
import { Zap, ShieldCheck, Check, X, ArrowRight, Shield, Globe, ExternalLink, Sparkles } from "lucide-react";
import { VerifyTrustBadge } from "../../components/VerifyDevToolsModal";
import { ContextualPartnerCard } from "../../components/ContextualPartnerCard";

export function VsWeTransfer() {
  const comparisonRows = [
    {
      feature: "Max File Transfer Size",
      shareflow: "Unlimited (Browser RAM / Stream)",
      wetransfer: "Capped at 2 GB (Free)",
      winner: "shareflow",
    },
    {
      feature: "Cloud Disk Storage Retention",
      shareflow: "0 Bytes (Direct Socket to Socket)",
      wetransfer: "Stored on AWS S3 for 7 Days",
      winner: "shareflow",
    },
    {
      feature: "Double-Upload Wait Time",
      shareflow: "Zero wait (Streams in real-time)",
      wetransfer: "Must upload 100% before recipient can start",
      winner: "shareflow",
    },
    {
      feature: "Account or Email Required",
      shareflow: "Never (No signup, no tracking)",
      wetransfer: "Prompts for sender & recipient emails",
      winner: "shareflow",
    },
    {
      feature: "Encryption & Security",
      shareflow: "DTLS 1.2 / SCTP WebRTC Channels",
      wetransfer: "Standard TLS to Cloud Server",
      winner: "shareflow",
    },
    {
      feature: "Cloud Storage Costs / Ads",
      shareflow: "$0.00 / 100% Cookieless",
      wetransfer: "$12/mo subscription or full-page takeover ads",
      winner: "shareflow",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-8 space-y-12 text-[#1d1d1f] dark:text-[#f5f5f7]">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#0071e3]/10 text-[#0071e3] dark:text-[#38bdf8] border border-[#0071e3]/20">
          <Zap className="w-3.5 h-3.5" />
          <span>ARCHITECTURAL COMPARISON</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          ShareFlow WebRTC P2P vs WeTransfer
        </h1>
        <p className="text-sm sm:text-base text-[#6e6e73] dark:text-[#a1a1aa] max-w-2xl mx-auto leading-relaxed">
          Why uploading multi-gigabyte files to a middleman cloud server is obsolete. Stream direct browser-to-browser with zero size limits.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/file-share"
            className="px-6 py-3 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-xs inline-flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <span>Start Free P2P Transfer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <VerifyTrustBadge />
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="rounded-3xl bg-white dark:bg-[#15171c] border border-[#e5e5ea] dark:border-[#27272a] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#e5e5ea] dark:border-[#27272a] bg-[#fbfbfd] dark:bg-[#121316]">
          <h2 className="font-extrabold text-lg">Direct Side-by-Side Comparison</h2>
          <p className="text-xs text-[#6e6e73] dark:text-[#a1a1aa] mt-1">
            Compare privacy posture, throughput limits, and infrastructure architecture.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e5e5ea] dark:border-[#27272a] bg-[#f5f5f7]/50 dark:bg-[#181a20]/50 text-[#86868b] dark:text-[#71717a] uppercase font-bold tracking-wider">
                <th className="py-4 px-6">Capability / Metric</th>
                <th className="py-4 px-6 text-[#0071e3] dark:text-[#38bdf8]">ShareFlow (WebRTC P2P)</th>
                <th className="py-4 px-6">WeTransfer (Cloud Middleman)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5ea] dark:divide-[#27272a]">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#fbfbfd] dark:hover:bg-[#181a20]/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#1d1d1f] dark:text-white">
                    {row.feature}
                  </td>
                  <td className="py-4 px-6 font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{row.shareflow}</span>
                  </td>
                  <td className="py-4 px-6 text-[#6e6e73] dark:text-[#a1a1aa]">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{row.wetransfer}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep-Dive Technical Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#15171c] border border-[#e5e5ea] dark:border-[#27272a] space-y-3">
          <h3 className="font-extrabold text-base text-[#1d1d1f] dark:text-white">
            How Traditional Cloud Transfer Works
          </h3>
          <p className="text-[#6e6e73] dark:text-[#a1a1aa]">
            When you send a file via WeTransfer, you must wait for your device to upload 100% of the payload to an AWS S3 bucket. That file remains parked on their disk for up to 7 days, exposed to subpoena requests, corporate scanning, and third-party cloud outages. Only after the upload finishes can the recipient begin their download.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
          <h3 className="font-extrabold text-base text-emerald-800 dark:text-emerald-300">
            How ShareFlow P2P Eliminates Middlemen
          </h3>
          <p className="text-emerald-950 dark:text-emerald-200">
            ShareFlow establishes a direct peer-to-peer WebRTC SCTP data channel between both browsers. As you stream chunks from your local storage, the recipient receives and reconstructs them simultaneously in real-time. The file never lands on any intermediate server disk, saving time, bandwidth, and zero storage bills.
          </p>
        </div>
      </div>

      {/* Contextual Partner VPN */}
      <ContextualPartnerCard toolId="p2p" />
    </div>
  );
}
