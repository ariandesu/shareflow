import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  Bot,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Shield,
  Maximize2,
  Minimize2,
  Send,
  Code2,
  Copy,
  Check,
  Key,
  Trash2,
  Globe,
  MessageSquare,
  Play,
  Cpu,
  Layers,
  Plus
} from "lucide-react";
import Markdown from "react-markdown";
import { SEOContent } from "../components/SEOContent";
import {
  getSavedApiKeys,
  saveApiKey,
  deleteApiKey,
  getKeysCountByProvider,
  fetchLiveModelsForApiKey,
  SavedApiKey,
  PROVIDER_FALLBACK_MODELS,
  detectProvider
} from "../utils/aiKeyStorage";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export function CodeHelper() {
  const [activeTab, setActiveTab] = useState<"native" | "iframe">("native");
  const [savedKeys, setSavedKeys] = useState<SavedApiKey[]>(() => getSavedApiKeys());
  const [activeKeyObj, setActiveKeyObj] = useState<SavedApiKey | null>(() => {
    const keys = getSavedApiKeys();
    return keys.length > 0 ? keys[0] : null;
  });

  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("deepseek-ai/deepseek-v4-pro");
  const [loadingModels, setLoadingModels] = useState(false);

  // New key input drawer state
  const [newKeyInput, setNewKeyInput] = useState("");
  const [newKeyName, setNewKeyName] = useState("");
  const [newCustomBaseUrl, setNewCustomBaseUrl] = useState("");
  const [showKeyDrawer, setShowKeyDrawer] = useState(false);
  const [keyNotice, setKeyNotice] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I am **Code Helper** workspace. Ask me any programming question, request code snippets, or get help debugging errors directly inside ShareFlow.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Dynamic model loader when activeKeyObj changes
  useEffect(() => {
    loadModelsForActiveKey(activeKeyObj);
  }, [activeKeyObj]);

  const loadModelsForActiveKey = async (keyObj: SavedApiKey | null) => {
    if (!keyObj) {
      setAvailableModels(PROVIDER_FALLBACK_MODELS["NVIDIA NIM"]);
      setSelectedModel("deepseek-ai/deepseek-v4-pro");
      return;
    }

    setLoadingModels(true);
    const liveModels = await fetchLiveModelsForApiKey(keyObj.key, keyObj.baseUrl, keyObj.provider);

    if (liveModels && liveModels.length > 0) {
      setAvailableModels(liveModels);
      setSelectedModel(liveModels[0]);
    } else {
      const fallback = PROVIDER_FALLBACK_MODELS[keyObj.provider] || PROVIDER_FALLBACK_MODELS["Custom"];
      setAvailableModels(fallback);
      setSelectedModel(fallback[0]);
    }
    setLoadingModels(false);
  };

  const handleSelectKey = (keyId: string) => {
    const found = savedKeys.find((k) => k.id === keyId);
    if (found) {
      setActiveKeyObj(found);
      localStorage.setItem("sf_code_helper_api_key", found.key);
    }
  };

  const handleSaveNewKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyInput.trim()) return;

    const saved = saveApiKey(newKeyInput, newKeyName, undefined, newCustomBaseUrl);
    const updatedKeys = getSavedApiKeys();
    setSavedKeys(updatedKeys);
    setActiveKeyObj(saved);
    setNewKeyInput("");
    setNewKeyName("");
    setNewCustomBaseUrl("");
    setKeyNotice(`Saved ${saved.provider} Key!`);
    setTimeout(() => setKeyNotice(null), 3000);
  };

  const handleDeleteActiveKey = (id: string) => {
    const updated = deleteApiKey(id);
    setSavedKeys(updated);
    if (updated.length > 0) {
      setActiveKeyObj(updated[0]);
    } else {
      setActiveKeyObj(null);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const activeKey = activeKeyObj?.key || undefined;
      const activeBaseUrl = activeKeyObj?.baseUrl || undefined;

      const res = await fetch("/api/qwen/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          apiKey: activeKey,
          model: selectedModel,
          baseUrl: activeBaseUrl
        })
      });

      const data = await res.json();

      // Safely extract error — providers may return error as string or object
      let errorText = "";
      if (data.error) {
        if (typeof data.error === "string") {
          errorText = data.error;
        } else if (typeof data.error === "object") {
          errorText = data.error.message || JSON.stringify(data.error);
        } else {
          errorText = String(data.error);
        }
      }

      const assistantContent =
        data.choices?.[0]?.message?.content ||
        errorText ||
        "Sorry, I encountered an issue retrieving a response from the AI provider.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Failed to connect to AI Provider endpoint. Please verify your network or API key settings.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: "assistant",
        content: "Chat cleared. What coding task would you like to work on now?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleLaunchPopout = () => {
    window.open("https://chat.qwen.ai/", "QwenCodeHelper", "width=1200,height=850,resizable=yes,scrollbars=yes");
  };

  const providerBreakdown = getKeysCountByProvider();

  return (
    <div className={`max-w-6xl mx-auto space-y-8 flex flex-col h-full ${isExpanded ? "w-full" : ""}`}>
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 text-white px-2 py-0.5 border border-white/20 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              Code Assistant
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-2 py-0.5 border border-emerald-500/20 flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              {activeKeyObj ? activeKeyObj.provider : "Default NVIDIA NIM"}
            </span>
          </div>
          <h1 className="text-[40px] leading-none font-black tracking-tighter uppercase flex items-center gap-3">
            <Bot className="w-9 h-9 text-white" />
            Code Helper
          </h1>
          <p className="text-white/50 text-sm max-w-xl">
            Universal multi-provider AI coding workspace powered by your saved API keys.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowKeyDrawer(!showKeyDrawer)}
            className={`flex items-center gap-2 px-3 py-2 border text-xs font-bold uppercase tracking-wider transition-colors ${
              savedKeys.length > 0
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30"
                : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            Keys ({savedKeys.length} Saved)
          </button>

          <button
            onClick={handleLaunchPopout}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600/30 border border-indigo-500/40 text-xs font-bold uppercase tracking-wider text-indigo-200 hover:bg-indigo-600/50 hover:text-white transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            Popout Window
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            {isExpanded ? "Collapse" : "Expand"}
          </button>

          <a
            href="https://chat.qwen.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-black uppercase tracking-wider hover:bg-white/80 transition-colors"
          >
            Open Qwen Web
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* PROVIDER KEYS BREAKDOWN BAR */}
      <div className="bg-[#111] border border-white/10 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-yellow-400" /> Saved Keys Breakdown:
          </span>
          {Object.entries(providerBreakdown.counts).length === 0 ? (
            <span className="text-xs font-mono text-white/40 italic">Using default system NVIDIA NIM key</span>
          ) : (
            Object.entries(providerBreakdown.counts).map(([prov, count]) => (
              <span
                key={prov}
                className="px-2.5 py-1 bg-white/5 border border-white/10 font-mono text-xs text-white/80"
              >
                <strong className="text-emerald-400">{prov}</strong>: {count} {count === 1 ? "key" : "keys"}
              </span>
            ))
          )}
        </div>

        {/* ACTIVE KEY SELECTOR DROPDOWN */}
        {savedKeys.length > 0 && (
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-mono text-white/40 uppercase whitespace-nowrap">Active Key:</span>
            <select
              value={activeKeyObj?.id || ""}
              onChange={(e) => handleSelectKey(e.target.value)}
              className="flex-1 md:flex-none bg-black text-emerald-300 font-mono text-xs border border-emerald-500/40 px-3 py-1.5 outline-none"
            >
              {savedKeys.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name} ({k.provider})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* API KEY MANAGEMENT DRAWER */}
      {showKeyDrawer && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-[#111] border border-white/10 p-5 space-y-4 shadow-xl"
        >
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-yellow-400" />
              Manage Provider API Keys ({savedKeys.length} Saved)
            </h4>
            <button
              onClick={() => setShowKeyDrawer(false)}
              className="text-xs text-white/40 hover:text-white"
            >
              Close
            </button>
          </div>

          {/* ADD KEY FORM */}
          <form onSubmit={handleSaveNewKey} className="bg-black/50 border border-white/10 p-4 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-white/70 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-emerald-400" /> Add API Key from Any Provider
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Key Label (e.g. Work NVIDIA NIM, Personal OpenAI)"
                className="bg-white/5 border border-white/10 px-3 py-2 text-xs font-mono text-white placeholder-white/30 outline-none"
              />
              <input
                type="password"
                value={newKeyInput}
                onChange={(e) => setNewKeyInput(e.target.value)}
                placeholder="Paste API Key (nvapi-..., gsk_..., sk-...)"
                className="bg-white/5 border border-white/10 px-3 py-2 text-xs font-mono text-white placeholder-white/30 outline-none"
                required
              />
            </div>

            <div className="flex justify-between items-center pt-1">
              {keyNotice ? (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {keyNotice}
                </span>
              ) : (
                <span className="text-[11px] text-white/40 font-mono">
                  Supports NVIDIA NIM, OpenAI, OpenRouter, Groq, Alibaba Qwen & Custom URLs.
                </span>
              )}

              <button
                type="submit"
                className="px-5 py-2 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-white/80 transition-colors"
              >
                Save Key & Fetch Models
              </button>
            </div>
          </form>

          {/* LIST OF SAVED KEYS */}
          {savedKeys.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-widest text-white/40">
                Saved Provider Keys List
              </h5>
              <div className="divide-y divide-white/10 border border-white/10 max-h-56 overflow-y-auto bg-black/40">
                {savedKeys.map((k) => (
                  <div
                    key={k.id}
                    className={`p-3 flex items-center justify-between gap-3 text-xs ${
                      activeKeyObj?.id === k.id ? "bg-white/10" : ""
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white uppercase truncate">{k.name}</span>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-mono text-[10px] uppercase border border-emerald-500/30">
                          {k.provider}
                        </span>
                        {activeKeyObj?.id === k.id && (
                          <span className="text-[10px] text-yellow-400 font-mono font-bold uppercase">[Active]</span>
                        )}
                      </div>
                      <p className="font-mono text-white/40 text-[11px]">
                        Key: {k.key.slice(0, 10)}•••••••• | Base: {k.baseUrl}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSelectKey(k.id)}
                        className="px-3 py-1 bg-white/10 text-white font-bold text-xs uppercase hover:bg-white/20"
                      >
                        Use Key
                      </button>
                      <button
                        onClick={() => handleDeleteActiveKey(k.id)}
                        className="text-white/40 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Mode Switcher Tabs */}
      <div className="flex border-b border-white/10 gap-2">
        <button
          onClick={() => setActiveTab("native")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === "native"
              ? "border-white text-white bg-white/5"
              : "border-transparent text-white/40 hover:text-white"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Native Code Workspace
        </button>
        <button
          onClick={() => setActiveTab("iframe")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === "iframe"
              ? "border-white text-white bg-white/5"
              : "border-transparent text-white/40 hover:text-white"
          }`}
        >
          <Globe className="w-4 h-4" />
          Web Frame (qwen.ai)
        </button>
      </div>

      {/* TABS CONTENT */}
      {activeTab === "native" ? (
        /* NATIVE INTERACTIVE CHAT CLIENT */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-white/10 bg-[#0D0D0D] flex flex-col h-[700px] shadow-2xl relative"
        >
          {/* Top Chat Bar */}
          <div className="px-4 py-3 bg-[#141414] border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-white/80">
                {activeKeyObj ? activeKeyObj.provider : "NVIDIA NIM"} Workspace
              </span>

              {/* DYNAMIC MODEL SELECTOR FOR ACTIVE KEY */}
              <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
                <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-black text-emerald-300 text-xs font-mono border border-white/20 px-2 py-1 outline-none max-w-[280px] truncate"
                  disabled={loadingModels}
                >
                  {loadingModels ? (
                    <option>Loading live models...</option>
                  ) : availableModels.length === 0 ? (
                    <option value="deepseek-ai/deepseek-v4-pro">deepseek-ai/deepseek-v4-pro</option>
                  ) : (
                    availableModels.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <button
              onClick={handleClearChat}
              className="text-white/40 hover:text-red-400 transition-colors p-1.5 self-end sm:self-auto"
              title="Clear chat session"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                    {msg.role === "user" ? "You" : (activeKeyObj ? activeKeyObj.provider : "DeepSeek V4 Pro")}
                  </span>
                  <span className="text-[10px] font-mono text-white/20">
                    {msg.timestamp}
                  </span>
                </div>

                <div
                  className={`max-w-[85%] p-4 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-white text-black font-medium"
                      : "bg-[#161616] text-white/90 border border-white/10"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-invert max-w-none text-sm prose-pre:bg-black prose-pre:border prose-pre:border-white/10 prose-code:font-mono prose-code:text-emerald-400">
                      <Markdown>{msg.content}</Markdown>
                      <div className="mt-3 pt-2 border-t border-white/10 flex justify-end">
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="flex items-center gap-1.5 text-[11px] font-mono text-white/40 hover:text-white transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy Text
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="bg-[#161616] border border-white/10 p-4 text-xs font-mono text-white/50 flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Generating completion via {selectedModel}...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-[#141414] border-t border-white/10 flex gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${selectedModel} to write, debug, or explain code...`}
              className="flex-1 bg-black border border-white/20 px-4 py-3 text-sm text-white outline-none focus:border-white/50 font-mono"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-white/80 transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      ) : (
        /* WEB IFRAME TAB */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-white/10 bg-[#0D0D0D] flex flex-col relative overflow-hidden shadow-2xl"
        >
          <div className="px-4 py-2.5 bg-[#141414] border-b border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-mono text-white/40">
              https://chat.qwen.ai/
            </span>
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
              Direct Web Frame
            </span>
          </div>

          <div className="w-full h-[700px] relative bg-[#050505]">
            <iframe
              src="https://chat.qwen.ai/"
              title="Code Helper - Qwen Code Web"
              className="w-full h-full border-none"
              allow="clipboard-read; clipboard-write; microphone; camera; autoplay; encrypted-media"
            />
          </div>
        </motion.div>
      )}

      {/* SEO & Architectural Documentation */}
      <SEOContent
        title="Code Helper Integration Guide"
        description="Learn how to integrate AI models from NVIDIA NIM, OpenAI, OpenRouter, Groq, or Alibaba Qwen directly inside your web application."
        steps={[
          {
            title: "Multi-Provider Key Support",
            description: "Save API keys from any provider (NVIDIA NIM, OpenAI, OpenRouter, Groq, Alibaba Qwen). Your keys are stored locally and mapped by provider."
          },
          {
            title: "Dynamic Model Listing",
            description: "When an active API key is selected, Code Helper queries the provider endpoint to automatically fetch all available models for that key."
          },
          {
            title: "Seamless Workspace Integration",
            description: "Easily switch active keys and models on the fly to test code snippets, debug logic, or generate functions."
          }
        ]}
        faqs={[
          {
            question: "Which AI providers are supported?",
            description: "",
            answer: "Code Helper supports NVIDIA NIM, OpenAI, OpenRouter, Groq, Alibaba Qwen, and custom OpenAI-compatible endpoints."
          },
          {
            question: "How are models fetched?",
            description: "",
            answer: "When a key is selected, Code Helper calls the provider's /v1/models endpoint to populate the model list dynamically."
          }
        ]}
      />
    </div>
  );
}
