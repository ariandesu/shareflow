import { PromptItem } from "../types/prompt";

export interface PromptMediaInfo {
  gifUrl: string | null;
  videoUrl: string | null;
  imageUrl: string;
  hasAnimation: boolean;
  isSquarePreview: boolean;
}

// Slugs known to have verified local square preview.gif
const LOCAL_GIF_SLUGS = new Set<string>([
  "bento",
  "interactive-card-stack",
  "interactive-multi-step-onboarding-flow",
  "multi-step-form-flow",
  "shader-god-rays",
  "tilted-card",
  "tubes-interactive-background",
]);

const isVideo = (url: string | null): boolean => {
  if (!url) return false;
  return /\.(mp4|webm|mov)(\?.*)?$/i.test(url);
};

const isGif = (url: string | null): boolean => {
  if (!url) return false;
  return /\.gif(\?.*)?$/i.test(url);
};

/**
 * Extracts normalized media URLs (GIF, Video, Fallback Image) for a PromptItem.
 * Handles both string and object shapes for thumbnail / previewImage.
 */
export function getPromptMedia(item: PromptItem): PromptMediaInfo {
  const slug = item.slug || item.id;

  // Extract raw string values from thumbnail and previewImage
  const extractUrl = (val: unknown): string | null => {
    if (!val) return null;
    if (typeof val === "string") return val.trim() || null;
    if (typeof val === "object" && val !== null && "url" in val) {
      const u = (val as { url?: unknown }).url;
      if (typeof u === "string") return u.trim() || null;
    }
    return null;
  };

  const rawThumb = extractUrl(item.thumbnail);
  const rawPreview = extractUrl(item.previewImage);
  const rawScreenshot = extractUrl(item.screenshotUrl);

  // 1. Resolve GIF preview (priority: local verified GIF -> explicit remote GIF)
  let gifUrl: string | null = null;
  if (slug && LOCAL_GIF_SLUGS.has(slug)) {
    gifUrl = `/products/prompts_bundle/${slug}/preview.gif`;
  } else if (isGif(rawThumb)) {
    gifUrl = rawThumb;
  } else if (isGif(rawPreview)) {
    gifUrl = rawPreview;
  }

  // 2. Resolve Video preview (priority: explicit remote video -> local preview.mp4)
  let videoUrl: string | null = null;
  if (isVideo(rawThumb)) {
    videoUrl = rawThumb;
  } else if (isVideo(rawPreview)) {
    videoUrl = rawPreview;
  } else if (slug) {
    videoUrl = `/products/prompts_bundle/${slug}/preview.mp4`;
  }

  // 3. Fallback Image URL (exclude any video formats like mp4, webm, mov)
  let imageUrl: string = "/placeholder-preview.png";
  if (rawThumb && !isVideo(rawThumb)) {
    imageUrl = rawThumb;
  } else if (rawPreview && !isVideo(rawPreview)) {
    imageUrl = rawPreview;
  } else if (rawScreenshot && !isVideo(rawScreenshot)) {
    imageUrl = rawScreenshot;
  } else if (slug) {
    imageUrl = `/products/prompts_bundle/${slug}/screenshot.png`;
  }

  const hasAnimation = Boolean(gifUrl || videoUrl);

  return {
    gifUrl,
    videoUrl,
    imageUrl,
    hasAnimation,
    isSquarePreview: true,
  };
}
