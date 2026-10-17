export type PromptCategory = 
  | "All"
  | "Landing Page" 
  | "Style"
  | "Animation"
  | "UI Component"
  | "Mobile App"
  | "Dashboard"
  | string;

export type TargetTool = 
  | "v0" 
  | "Bolt.new" 
  | "Lovable" 
  | "Cursor" 
  | "Claude" 
  | "Universal"
  | string;

export interface PromptItem {
  id: string;
  slug?: string;
  title: string;
  description: string;
  category: PromptCategory;
  targetTool?: TargetTool;
  isFree?: boolean;
  priceBdt?: number; // SupportKori micro-payment price in BDT (49)
  priceUsd?: number;
  price?: number;
  currency?: string;
  promptContent?: string;
  prompt?: string;
  systemInstruction?: string;
  previewImage?: string | { url?: string; type?: string; storagePath?: string };
  thumbnail?: string | { url?: string; type?: string; storagePath?: string };
  previewUrl?: string;
  localPreviewUrl?: string;
  screenshotUrl?: string;
  livePreviewUrl?: string;
  buyUrl?: string;
  previewDevice?: "desktop" | "tablet" | "mobile" | string;
  supportKoriUrl?: string;
  gumroadUrl?: string;
  tags?: string[];
  features?: string[];
  copyCount?: number;
  active?: boolean;
  createdAt?: string;
}
