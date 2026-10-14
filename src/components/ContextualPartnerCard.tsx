import { Shield, Lock, Server, Key, FileCheck, ExternalLink } from "lucide-react";
import { MONETIZATION_CONFIG } from "../config/monetization";

export type PartnerCategory = "vpn" | "passwordVault" | "secretSync" | "cloudHosting" | "pdfEnterprise";

interface ContextualPartnerCardProps {
  category?: PartnerCategory;
  toolId?: string;
  className?: string;
}

export function ContextualPartnerCard({ category, toolId, className = "" }: ContextualPartnerCardProps) {
  // Determine category from toolId if not explicitly provided
  let resolvedCategory: PartnerCategory = category || "cloudHosting";

  if (toolId) {
    const id = toolId.toLowerCase();
    if (id.includes("p2p") || id.includes("file-share") || id.includes("exif")) {
      resolvedCategory = "vpn";
    } else if (id.includes("password") || id.includes("hash") || id.includes("uuid") || id.includes("jwt")) {
      resolvedCategory = "passwordVault";
    } else if (id.includes("secret") || id.includes("text-share")) {
      resolvedCategory = "secretSync";
    } else if (id.includes("pdf")) {
      resolvedCategory = "pdfEnterprise";
    } else {
      resolvedCategory = "cloudHosting";
    }
  }

  const renderContent = () => {
    switch (resolvedCategory) {
      case "vpn":
        return {
          icon: <Shield className="w-4 h-4 text-emerald-500 shrink-0" />,
          title: "WebRTC Security Note",
          copy: "Direct P2P connections establish a socket between peers, which makes your IP address visible to the recipient. Hide your IP during P2P transfers with a zero-log VPN.",
          ctaText: `Protect IP with ${MONETIZATION_CONFIG.vpnPartnerName} →`,
          url: MONETIZATION_CONFIG.vpnAffiliateUrl,
          badge: "Zero-Log Privacy",
          badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        };
      case "passwordVault":
        return {
          icon: <Lock className="w-4 h-4 text-blue-500 shrink-0" />,
          title: "Zero-Knowledge Vault",
          copy: "Generated a production secret? Store team credentials, SSH keys, and API tokens in an end-to-end encrypted vault instead of plain text.",
          ctaText: `Try ${MONETIZATION_CONFIG.passwordManagerPartnerName} Teams →`,
          url: MONETIZATION_CONFIG.passwordManagerAffiliateUrl,
          badge: "E2E Encryption",
          badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        };
      case "secretSync":
        return {
          icon: <Key className="w-4 h-4 text-amber-500 shrink-0" />,
          title: "Stop Pasting .env Files in Slack",
          copy: "Automate and sync environment variables securely across your engineering team, Docker containers, and CI/CD pipelines.",
          ctaText: `Sync Secrets with ${MONETIZATION_CONFIG.secretManagerPartnerName} →`,
          url: MONETIZATION_CONFIG.secretManagerAffiliateUrl,
          badge: "DevOps Secrets",
          badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        };
      case "pdfEnterprise":
        return {
          icon: <FileCheck className="w-4 h-4 text-indigo-500 shrink-0" />,
          title: "Enterprise PDF & E-Signatures",
          copy: "Need legally binding digital signatures, OCR document extraction, or automated contract generation for your team?",
          ctaText: `Try ${MONETIZATION_CONFIG.pdfPartnerName} →`,
          url: MONETIZATION_CONFIG.pdfPartnerUrl,
          badge: "Enterprise Workflow",
          badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
        };
      case "cloudHosting":
      default:
        return {
          icon: <Server className="w-4 h-4 text-purple-500 shrink-0" />,
          title: "Deploy in 30 Seconds",
          copy: "Claim $200 in free cloud compute credits to deploy your next FastAPI, Docker, or Node.js workload with high-speed SSDs.",
          ctaText: "Claim $200 Cloud Credit →",
          url: MONETIZATION_CONFIG.cloudHostingAffiliateUrl,
          badge: "$200 Developer Credit",
          badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        };
    }
  };

  const card = renderContent();

  return (
    <aside
      aria-label="Developer partner sponsorship"
      className={`my-6 p-4 rounded-2xl bg-white/70 dark:bg-[#15171c]/80 backdrop-blur-md border border-[#e5e5ea] dark:border-[#27272a] shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs ${className}`}
    >
      <div className="flex items-start gap-3 flex-1">
        <div className="p-2 rounded-xl bg-[#f5f5f7] dark:bg-[#1f222a] border border-[#e5e5ea] dark:border-[#2b2d35] shrink-0">
          {card.icon}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">{card.title}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${card.badgeColor}`}>
              {card.badge}
            </span>
          </div>
          <p className="text-[#6e6e73] dark:text-[#a1a1aa] leading-relaxed max-w-2xl">{card.copy}</p>
        </div>
      </div>

      <a
        href={card.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-xs transition-all duration-200 shadow-xs hover:shadow-sm active:scale-95"
      >
        <span>{card.ctaText}</span>
        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
      </a>
    </aside>
  );
}
