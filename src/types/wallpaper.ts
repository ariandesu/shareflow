export type WallpaperCategory = 
  | "Desktop 8K" 
  | "Mobile OLED" 
  | "Dual Monitor" 
  | "3D Sci-Fi" 
  | "Minimalist Dark";

export interface WallpaperBundle {
  id: string;
  title: string;
  description: string;
  category: WallpaperCategory;
  resolution: string;
  aspectRatio: string;
  itemCount: number;
  format: string; // e.g., "Lossless PNG (HDR10)"
  previewUrl: string;
  sampleImages: string[];
  price: string; // retail display price e.g., "$4.99"
  gumroadSlug?: string;
  gumroadBaseUrl: string;
  features: string[];
  tags: string[];
  featured?: boolean;
  active: boolean;
  createdAt: string;
}
