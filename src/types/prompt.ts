export type PromptCategory = 
  | "Landing Page" 
  | "Dashboard" 
  | "E-Commerce" 
  | "Portfolio" 
  | "Micro-SaaS" 
  | "Mobile UI";

export type TargetTool = 
  | "v0" 
  | "Bolt.new" 
  | "Lovable" 
  | "Cursor" 
  | "Claude" 
  | "Universal";

export interface PromptItem {
  id: string;
  title: string;
  description: string;
  category: PromptCategory;
  targetTool: TargetTool;
  isFree: boolean;
  priceBdt?: number; // SupportKori micro-payment price in BDT (e.g. 49)
  priceUsd?: number; // Gumroad price in USD (e.g. 0.99)
  promptContent: string; // The ready-to-use prompt text
  systemInstruction?: string; // Optional recommended system persona/prompt
  previewImage: string; // Preview mockup URL
  livePreviewUrl?: string; // Optional demo or inspiration URL
  supportKoriUrl?: string; // SupportKori payment link (e.g., https://www.supportkori.com/mhr3d)
  gumroadUrl?: string; // International Gumroad checkout link
  tags: string[];
  features: string[];
  copyCount: number;
  active: boolean;
  createdAt: string;
}
