/**
 * ShareFlow Centralized Monetization & Affiliate Configuration
 *
 * All partner referral links, UTM parameters, and sponsor slots are defined here.
 * To update your affiliate IDs, replace the query parameter values below.
 * No third-party tracking cookies or external scripts are injected.
 */

export interface MonetizationConfig {
  // VPN Partners (for P2P and Network Security)
  vpnAffiliateUrl: string;
  vpnPartnerName: string;

  // Password / Secret Vault Partners (for Password Generator, Hash, UUID, JWT)
  passwordManagerAffiliateUrl: string;
  passwordManagerPartnerName: string;

  // Environment Variable & Secret Sync (for Ephemeral Secrets / Burn Notes)
  secretManagerAffiliateUrl: string;
  secretManagerPartnerName: string;

  // Cloud VPS & Server Hosting (for Developer Tools, Boilerplates, Kits)
  cloudHostingAffiliateUrl: string;
  digitalOceanUrl: string;
  railwayDeployUrl: string;
  hetznerUrl: string;

  // Enterprise PDF & Document Workflow (for PDF Toolkit)
  pdfPartnerUrl: string;
  pdfPartnerName: string;

  // Residential Proxy & Web Scraping (for Async Scraper Engine)
  proxyPartnerUrl: string;
  proxyPartnerName: string;

  // Voluntary Community Support / Signaling Server Donations ($3)
  supportSignalingUrl: string;

  // Ethical Direct Sponsorship Contact
  sponsorInquiryMailto: string;
}

export const MONETIZATION_CONFIG: MonetizationConfig = {
  // 🔒 Replace '?ref=shareflow' with your ProtonVPN or Mullvad affiliate link
  vpnAffiliateUrl: "https://protonvpn.com/?ref=shareflow",
  vpnPartnerName: "ProtonVPN",

  // 🛡️ Replace with your 1Password / Bitwarden partner link
  passwordManagerAffiliateUrl: "https://1password.com/?ref=shareflow",
  passwordManagerPartnerName: "1Password",

  // ⚡ Replace with your Doppler or Infisical partner link
  secretManagerAffiliateUrl: "https://infisical.com/?ref=shareflow",
  secretManagerPartnerName: "Infisical",

  // 🚀 Replace with your DigitalOcean referral link ($200 60-day credit)
  cloudHostingAffiliateUrl: "https://m.do.co/c/shareflow",
  digitalOceanUrl: "https://m.do.co/c/shareflow",
  // 🚂 Replace with your Railway referral link
  railwayDeployUrl: "https://railway.com?referralCode=shareflow",
  // 🇩🇪 Replace with your Hetzner referral link
  hetznerUrl: "https://hetzner.cloud/?ref=shareflow",

  // ✍️ Replace with your PandaDoc or Adobe Sign affiliate link
  pdfPartnerUrl: "https://www.pandadoc.com/?ref=shareflow",
  pdfPartnerName: "PandaDoc",

  // 🕷️ Replace with your BrightData / ScraperAPI referral link
  proxyPartnerUrl: "https://brightdata.com/?ref=shareflow",
  proxyPartnerName: "BrightData",

  // ☕ Voluntary developer donation to support signaling servers ($3)
  supportSignalingUrl: "https://buymeacoffee.com/mhr3d",

  // Direct Cookieless Sponsorship Inquiry
  sponsorInquiryMailto: "mailto:sponsor@shareflow.mhr3d.online?subject=ShareFlow%20Direct%20Sponsorship",
};
