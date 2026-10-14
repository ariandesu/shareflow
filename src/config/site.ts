/**
 * ShareFlow Site Configuration
 * Centralized domain, brand identity, and official developer links.
 */

export const SITE_URL = "https://shareflow.mhr3d.online";
export const SITE_DOMAIN = "shareflow.mhr3d.online";
export const SITE_NAME = "ShareFlow";
export const SITE_TAGLINE = "Zero-Knowledge WebRTC P2P Transfer & 40+ Client-Side Developer Utilities";

export const SUPPORT_EMAIL = "support@shareflow.mhr3d.online";
export const GITHUB_REPO_URL = "https://github.com/ariandesu/shareflow";
export const TWITTER_URL = "https://x.com/ariandesu";

export const CANONICAL_URL = (path: string = "") => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
};
