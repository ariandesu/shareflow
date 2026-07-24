export interface SavedApiKey {
  id: string;
  name: string;
  provider: "NVIDIA NIM" | "OpenAI" | "OpenRouter" | "Groq" | "Alibaba Qwen" | "Custom";
  key: string;
  baseUrl: string;
  createdAt: string;
}

export const PROVIDER_DEFAULT_URLS: Record<SavedApiKey["provider"], string> = {
  "NVIDIA NIM": "https://integrate.api.nvidia.com/v1",
  "OpenAI": "https://api.openai.com/v1",
  "OpenRouter": "https://openrouter.ai/api/v1",
  "Groq": "https://api.groq.com/openai/v1",
  "Alibaba Qwen": "https://dashscope.aliyuncs.com/compatible-mode/v1",
  "Custom": "https://integrate.api.nvidia.com/v1"
};

export const PROVIDER_FALLBACK_MODELS: Record<SavedApiKey["provider"], string[]> = {
  "NVIDIA NIM": [
    "deepseek-ai/deepseek-v4-pro",
    "deepseek-ai/deepseek-r1",
    "meta/llama-3.3-70b-instruct",
    "nvidia/llama-3.1-nemotron-70b-instruct"
  ],
  "OpenAI": [
    "gpt-4o",
    "gpt-4o-mini",
    "o1-preview",
    "gpt-4-turbo"
  ],
  "OpenRouter": [
    "deepseek/deepseek-r1:free",
    "google/gemini-2.0-flash-lite-preview-02-05:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "qwen/qwen-2.5-coder-32b-instruct:free",
    "mistralai/mistral-small-24b-instruct-2501:free",
    "deepseek/deepseek-chat:free",
    "nvidia/llama-3.1-nemotron-70b-instruct:free"
  ],
  "Groq": [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768",
    "deepseek-r1-distill-llama-70b"
  ],
  "Alibaba Qwen": [
    "qwen-plus",
    "qwen-coder-turbo",
    "qwen-max",
    "qwen-turbo"
  ],
  "Custom": [
    "deepseek-ai/deepseek-v4-pro",
    "gpt-4o",
    "qwen-plus"
  ]
};

export function detectProvider(key: string, customBaseUrl?: string): { provider: SavedApiKey["provider"]; baseUrl: string } {
  const k = key.trim();
  if (customBaseUrl && customBaseUrl.trim()) {
    return { provider: "Custom", baseUrl: customBaseUrl.trim() };
  }
  if (k.startsWith("nvapi-")) {
    return { provider: "NVIDIA NIM", baseUrl: PROVIDER_DEFAULT_URLS["NVIDIA NIM"] };
  }
  if (k.startsWith("sk-or-v1-")) {
    return { provider: "OpenRouter", baseUrl: PROVIDER_DEFAULT_URLS["OpenRouter"] };
  }
  if (k.startsWith("gsk_")) {
    return { provider: "Groq", baseUrl: PROVIDER_DEFAULT_URLS["Groq"] };
  }
  if (k.startsWith("sk-proj-")) {
    return { provider: "OpenAI", baseUrl: PROVIDER_DEFAULT_URLS["OpenAI"] };
  }
  if (k.startsWith("sk-")) {
    return { provider: "Alibaba Qwen", baseUrl: PROVIDER_DEFAULT_URLS["Alibaba Qwen"] };
  }
  return { provider: "Custom", baseUrl: PROVIDER_DEFAULT_URLS["Custom"] };
}

const STORAGE_KEY = "sf_saved_ai_keys";

export function getSavedApiKeys(): SavedApiKey[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacyKey = localStorage.getItem("sf_code_helper_api_key");
      if (legacyKey) {
        const detected = detectProvider(legacyKey);
        const legacyObj: SavedApiKey = {
          id: "legacy-1",
          name: `${detected.provider} Key`,
          provider: detected.provider,
          key: legacyKey,
          baseUrl: detected.baseUrl,
          createdAt: new Date().toISOString()
        };
        return [legacyObj];
      }
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveApiKey(key: string, name?: string, customProvider?: SavedApiKey["provider"], customBaseUrl?: string): SavedApiKey {
  const cleanKey = key.trim();
  const keys = getSavedApiKeys();
  const detected = detectProvider(cleanKey, customBaseUrl);
  const provider = customProvider || detected.provider;
  const baseUrl = customBaseUrl || detected.baseUrl;
  const keyName = name && name.trim() ? name.trim() : `${provider} Key (${cleanKey.slice(0, 8)}...)`;

  const existing = keys.find(k => k.key === cleanKey);
  if (existing) {
    existing.name = keyName;
    existing.provider = provider;
    existing.baseUrl = baseUrl;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    localStorage.setItem("sf_code_helper_api_key", cleanKey);
    return existing;
  }

  const newKeyObj: SavedApiKey = {
    id: `key-${Date.now()}`,
    name: keyName,
    provider,
    key: cleanKey,
    baseUrl,
    createdAt: new Date().toISOString()
  };

  const updated = [newKeyObj, ...keys];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  localStorage.setItem("sf_code_helper_api_key", cleanKey);
  return newKeyObj;
}

export function deleteApiKey(id: string): SavedApiKey[] {
  const keys = getSavedApiKeys();
  const updated = keys.filter(k => k.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  if (updated.length > 0) {
    localStorage.setItem("sf_code_helper_api_key", updated[0].key);
  } else {
    localStorage.removeItem("sf_code_helper_api_key");
  }
  return updated;
}

export function getKeysCountByProvider(): { total: number; counts: Record<string, number> } {
  const keys = getSavedApiKeys();
  const counts: Record<string, number> = {};
  keys.forEach(k => {
    counts[k.provider] = (counts[k.provider] || 0) + 1;
  });
  return { total: keys.length, counts };
}

export async function fetchLiveModelsForApiKey(apiKey: string, baseUrl: string, provider?: SavedApiKey["provider"]): Promise<string[]> {
  const isOpenRouter = provider === "OpenRouter" || baseUrl.includes("openrouter.ai");

  try {
    const res = await fetch("/api/ai/models", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey, baseUrl })
    });

    if (!res.ok) {
      if (isOpenRouter) return PROVIDER_FALLBACK_MODELS["OpenRouter"];
      return [];
    }

    const data = await res.json();
    let rawList: any[] = [];
    if (data.data && Array.isArray(data.data)) {
      rawList = data.data;
    } else if (Array.isArray(data)) {
      rawList = data;
    }

    if (isOpenRouter) {
      // Filter ONLY free models for OpenRouter (ending with :free or prompt pricing is "0")
      const freeModels = rawList.filter((m: any) => {
        const id = typeof m === "string" ? m : m.id || "";
        const promptCost = m.pricing?.prompt;
        const completionCost = m.pricing?.completion;
        const isFreePrice = promptCost === "0" && completionCost === "0";
        return id.endsWith(":free") || id.includes(":free") || isFreePrice;
      }).map((m: any) => (typeof m === "string" ? m : m.id)).filter(Boolean);

      if (freeModels.length > 0) {
        return freeModels;
      }
      return PROVIDER_FALLBACK_MODELS["OpenRouter"];
    }

    const allModels = rawList.map((m: any) => (typeof m === "string" ? m : m.id)).filter(Boolean);
    return allModels;
  } catch {
    if (isOpenRouter) return PROVIDER_FALLBACK_MODELS["OpenRouter"];
    return [];
  }
}
