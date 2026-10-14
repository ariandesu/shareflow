import { Link } from "react-router-dom";
import { FileCheck, ShieldCheck, Check, X, ArrowRight, Shield, Lock, FileText } from "lucide-react";
import { VerifyTrustBadge } from "../../components/VerifyDevToolsModal";
import { ContextualPartnerCard } from "../../components/ContextualPartnerCard";

export function VsILovePDF() {
  const comparisonRows = [
    {
      feature: "Processing Location",
      shareflow: "100% In-Browser (Local WebAssembly)",
      ilovepdf: "Uploaded to Remote Cloud Servers",
      winner: "shareflow",
    },
    {
      feature: "Network Data Egress",
      shareflow: "0 Bytes Uploaded (Verify in DevTools)",
      ilovepdf: "Entire PDF Uploaded over the Internet",
      winner: "shareflow",
    },
    {
      feature: "Offline & Airplane Mode Support",
      shareflow: "Full offline functionality once cached",
      ilovepdf: "Fails without active internet",
      winner: "shareflow",
    },
    {
      feature: "HIPAA / GDPR Compliance Risk",
      shareflow: "Zero risk (Data never touches a 3rd party)",
      ilovepdf: "Subject to third-party data processor terms",
      winner: "shareflow",
    },
    {
      feature: "Page & File Size Limits",
      shareflow: "Unlimited (Bounded only by client RAM)",
      ilovepdf: "Paywalled caps on free tier",
      winner: "shareflow",
    },
    {
      feature: "Direct P2P Distribution",
      shareflow: "Pipe merged/split PDF directly to peer",
      ilovepdf: "Download only or paid cloud integrations",
      winner: "shareflow",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-8 space-y-12 text-[#1d1d1f] dark:text-[#f5f5f7]">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#0071e3]/10 text-[#0071e3] dark:text-[#38bdf8] border border-[#0071e3]/20">
          <FileCheck className="w-3.5 h-3.5" />
          <span>SECURITY & PRIVACY BENCHMARK</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          ShareFlow Client-Side PDF Suite vs ILovePDF
        </h1>
        <p className="text-sm sm:text-base text-[#6e6e73] dark:text-[#a1a1aa] max-w-2xl mx-auto leading-relaxed">
          Why uploading sensitive corporate contracts, tax returns, and medical records to cloud PDF converters is a massive security vulnerability.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/pdf-merger"
            className="px-6 py-3 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-xs inline-flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <span>Open In-Browser PDF Merger</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <VerifyTrustBadge />
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-3xl bg-white dark:bg-[#15171c] border border-[#e5e5ea] dark:border-[#27272a] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#e5e5ea] dark:border-[#27272a] bg-[#fbfbfd] dark:bg-[#121316]">
          <h2 className="font-extrabold text-lg">Architectural Architecture Comparison</h2>
          <p className="text-xs text-[#6e6e73] dark:text-[#a1a1aa] mt-1">
            Why client-side compilation in WebAssembly outperforms server-side rendering.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e5e5ea] dark:border-[#27272a] bg-[#f5f5f7]/50 dark:bg-[#181a20]/50 text-[#86868b] dark:text-[#71717a] uppercase font-bold tracking-wider">
                <th className="py-4 px-6">Capability / Metric</th>
                <th className="py-4 px-6 text-[#0071e3] dark:text-[#38bdf8]">ShareFlow (Local WebAssembly)</th>
                <th className="py-4 px-6">ILovePDF / Smallpdf (Cloud Upload)</th>
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
                      <span>{row.ilovepdf}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enterprise Security Breakdown */}
      <div className="p-6 rounded-2xl bg-[#f5f5f7] dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] space-y-4 text-xs leading-relaxed">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1d1d1f] dark:text-white">
          <Lock className="w-4 h-4 text-[#0071e3]" />
          <span>The Regulatory Problem with Cloud PDF Converters</span>
        </div>
        <p className="text-[#6e6e73] dark:text-[#a1a1aa]">
          Under GDPR Article 28 and HIPAA Security Rules, transmitting patient records or European citizen personal identifiable information (PII) to an online PDF converter requires an executed Business Associate Agreement (BAA) or Data Processing Addendum (DPA). Using conventional upload sites breaches enterprise data governance.
        </p>
        <p className="text-[#6e6e73] dark:text-[#a1a1aa]">
          Because ShareFlow processes documents locally in the browser memory using <code>pdf-lib</code> and WebAssembly, no data processor boundary is crossed. Your documents never touch our signaling servers or databases.
        </p>
      </div>

      {/* Contextual Enterprise Card */}
      <ContextualPartnerCard category="pdfEnterprise" />
    </div>
  );
}
