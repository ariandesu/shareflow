import { Link } from "react-router-dom";
import { Lock, ShieldCheck, Check, X, ArrowRight, Shield, Key, Flame } from "lucide-react";
import { VerifyTrustBadge } from "../../components/VerifyDevToolsModal";
import { ContextualPartnerCard } from "../../components/ContextualPartnerCard";

export function VsPrivnote() {
  const comparisonRows = [
    {
      feature: "Encryption Key Location",
      shareflow: "Client URL Fragment (#hash) — Server NEVER sees the key",
      privnote: "Historically handled server-side / unverified",
      winner: "shareflow",
    },
    {
      feature: "Cryptographic Algorithm",
      shareflow: "AES-GCM-256 (Web Crypto API)",
      privnote: "Proprietary server encryption",
      winner: "shareflow",
    },
    {
      feature: "Eavesdropping / Subpoena Resistance",
      shareflow: "Mathematically impossible for host to decrypt",
      privnote: "Vulnerable to server memory inspection or MITM",
      winner: "shareflow",
    },
    {
      feature: "Zero-Knowledge Guarantee",
      shareflow: "Open-source client code auditable in DevTools",
      privnote: "Closed-source proprietary infrastructure",
      winner: "shareflow",
    },
    {
      feature: "Ad-Free & Tracker-Free",
      shareflow: "100% Cookieless, zero third-party scripts",
      privnote: "Displays third-party programmatic display ads",
      winner: "shareflow",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-8 space-y-12 text-[#1d1d1f] dark:text-[#f5f5f7]">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          <Flame className="w-3.5 h-3.5" />
          <span>CRYPTOGRAPHIC ARCHITECTURE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          ShareFlow Ephemeral Secrets vs Privnote
        </h1>
        <p className="text-sm sm:text-base text-[#6e6e73] dark:text-[#a1a1aa] max-w-2xl mx-auto leading-relaxed">
          Why traditional burn notes that store unencrypted text on a server fail zero-knowledge audits. Client-side URL fragment key isolation explained.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/text-share"
            className="px-6 py-3 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-xs inline-flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <span>Create Self-Destructing Note</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <VerifyTrustBadge />
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-3xl bg-white dark:bg-[#15171c] border border-[#e5e5ea] dark:border-[#27272a] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#e5e5ea] dark:border-[#27272a] bg-[#fbfbfd] dark:bg-[#121316]">
          <h2 className="font-extrabold text-lg">Cryptographic Security Comparison</h2>
          <p className="text-xs text-[#6e6e73] dark:text-[#a1a1aa] mt-1">
            How ShareFlow implements zero-knowledge URL hash cryptography.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e5e5ea] dark:border-[#27272a] bg-[#f5f5f7]/50 dark:bg-[#181a20]/50 text-[#86868b] dark:text-[#71717a] uppercase font-bold tracking-wider">
                <th className="py-4 px-6">Capability / Metric</th>
                <th className="py-4 px-6 text-purple-600 dark:text-purple-400">ShareFlow (Client AES-GCM)</th>
                <th className="py-4 px-6">Privnote (Legacy Server Storage)</th>
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
                      <span>{row.privnote}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technical Deep Dive: The URL Hash Guarantee */}
      <div className="p-6 rounded-2xl bg-[#f5f5f7] dark:bg-[#12141a] border border-[#e5e5ea] dark:border-[#27272a] space-y-4 text-xs leading-relaxed">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1d1d1f] dark:text-white">
          <Key className="w-4 h-4 text-purple-500" />
          <span>The URL Hash Guarantee (RFC 3986)</span>
        </div>
        <p className="text-[#6e6e73] dark:text-[#a1a1aa]">
          Per RFC 3986 section 3.5, browser user-agents never transmit the fragment identifier (the portion of a URL following the <code>#</code> symbol) in HTTP request lines.
        </p>
        <p className="text-[#6e6e73] dark:text-[#a1a1aa]">
          When ShareFlow encrypts a secret note, the 256-bit AES decryption key is appended exclusively inside the URL fragment: <code>https://shareflow.mhr3d.online/t/8x92a#SECRET_KEY</code>. Even under rogue law enforcement subpoenas or ISP TLS interception, our backend only sees the encrypted ciphertext payload <code>8x92a</code>. We physically cannot decrypt your secret note even if compelled to do so.
        </p>
      </div>

      {/* Contextual Secret Manager Card */}
      <ContextualPartnerCard category="secretSync" />
    </div>
  );
}
