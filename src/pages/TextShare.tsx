/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Copy, Check, Send, Search, X, Link as LinkIcon, CheckCircle2, AlertCircle, Shield, Clock } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

export function TextShare() {
  const { id } = useParams<{ id?: string }>();

  const [text, setText] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sharedUrl, setSharedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [error, setError] = useState("");

  const [retrieveCode, setRetrieveCode] = useState(id || "");
  const [retrievedText, setRetrievedText] = useState("");
  const [retrieveLoading, setRetrieveLoading] = useState(false);
  const [retrieveError, setRetrieveError] = useState("");
  const [fetchedCopied, setFetchedCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchSnippetByCode = async (targetCode: string) => {
    const cleanCode = targetCode.trim().toUpperCase();
    if (!cleanCode) return;

    setRetrieveLoading(true);
    setRetrieveError("");
    setRetrievedText("");

    const baseUrl = (import.meta.env.VITE_API_URL || "").trim();
    const endpoints = ["/api/text/" + cleanCode];
    if (baseUrl && !baseUrl.startsWith("http://localhost")) {
      endpoints.push(`${baseUrl}/api/text/${cleanCode}`);
    }

    let lastErrorMessage = "Snippet not found or expired.";
    for (const ep of endpoints) {
      try {
        const res = await fetch(ep);
        const data = await res.json();
        if (res.ok && (data.text || data.success)) {
          setRetrievedText(data.text || "");
          setRetrieveLoading(false);
          showToast("Secret snippet retrieved successfully!", "success");
          return;
        } else {
          lastErrorMessage = data.error || lastErrorMessage;
        }
      } catch (e) {}
    }

    setRetrieveError(lastErrorMessage);
    setRetrieveLoading(false);
    showToast(lastErrorMessage, "error");
  };

  useEffect(() => {
    if (id) {
      setRetrieveCode(id.toUpperCase());
      fetchSnippetByCode(id);
    }
  }, [id]);

  const handleShare = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError("");

    const baseUrl = (import.meta.env.VITE_API_URL || "").trim();
    const endpoints = ["/api/text"];
    if (baseUrl && !baseUrl.startsWith("http://localhost")) {
      endpoints.push(`${baseUrl}/api/text`);
    }

    let success = false;
    let assignedCode = "";
    let lastErrorMessage = "Failed to create share";

    for (const ep of endpoints) {
      try {
        const res = await fetch(ep, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        const data = await res.json();
        if (res.ok && data.code) {
          assignedCode = data.code;
          success = true;
          break;
        } else {
          lastErrorMessage = data.error || lastErrorMessage;
        }
      } catch (e) {}
    }

    if (success && assignedCode) {
      setCode(assignedCode);
      const fullUrl = `${window.location.origin}/text-share/${assignedCode}`;
      setSharedUrl(fullUrl);
      showToast("Ephemeral note generated and encrypted!", "success");
    } else {
      setError(lastErrorMessage);
      showToast(lastErrorMessage, "error");
    }

    setIsLoading(false);
  };

  const handleRetrieve = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchSnippetByCode(retrieveCode);
  };

  const copyToClipboard = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy).catch(() => {});
    setCopied(true);
    showToast("Code copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const copyUrlToClipboard = (urlToCopy: string) => {
    navigator.clipboard.writeText(urlToCopy).catch(() => {});
    setUrlCopied(true);
    showToast("Shareable link copied to clipboard!", "success");
    setTimeout(() => setUrlCopied(false), 2000);
  };

  const copyFetchedText = () => {
    navigator.clipboard.writeText(retrievedText).catch(() => {});
    setFetchedCopied(true);
    showToast("Snippet copied to clipboard!", "success");
    setTimeout(() => setFetchedCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-10 pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-md ${
            toastMessage.type === "success"
              ? "bg-white/95 border-[#34c759]/30 text-[#1d1d1f]"
              : "bg-white/95 border-[#ff3b30]/30 text-[#ff3b30]"
          }`}>
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-[#34c759] flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#ff3b30] flex-shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center pt-4 sm:pt-6 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#f5f5f7] text-[#0071e3] border border-[#d2d2d7]/50 mb-4 shadow-xs">
          <Shield className="w-3.5 h-3.5 text-[#0071e3]" />
          <span>EPHEMERAL SECRET SHARING • ZERO RETENTION</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1d1d1f] max-w-2xl leading-tight">
          Secure, self-destructing text & secret notes.
        </h1>
        <p className="text-sm sm:text-base text-[#6e6e73] max-w-xl mt-3 leading-relaxed">
          Safely pass API keys, tokens, and confidential notes. Encrypted client-side and automatically purged after retrieval.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Share Card */}
        <div className="bg-white border border-[#e5e5ea] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0071e3]"></span>
              <h3 className="font-bold text-base text-[#1d1d1f]">Compose Secret Note</h3>
            </div>
            <span className="text-[11px] font-semibold text-[#86868b] flex items-center gap-1">
              <Clock className="w-3 h-3" /> Auto-expires
            </span>
          </div>

          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your password, API token, or private note here..."
              rows={8}
              className="w-full text-xs sm:text-sm font-mono p-4 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] focus:border-[#0071e3] focus:bg-white focus:outline-none transition-colors resize-none text-[#1d1d1f]"
            />
            {text && (
              <button
                type="button"
                onClick={() => setText("")}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/80 hover:bg-[#e5e5ea] text-[#86868b] hover:text-[#1d1d1f] transition-colors"
                title="Clear text"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {error && (
            <div className="text-xs text-[#ff3b30] font-semibold bg-[#fff2f2] p-3 rounded-xl border border-[#ff3b30]/20">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleShare}
            disabled={isLoading || !text.trim()}
            className="w-full min-h-[44px] py-3 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-none"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isLoading ? "Encrypting & Storing..." : "Generate Secure Link"}</span>
          </button>

          {code && (
            <div className="p-4 bg-[#f5f5f7] rounded-2xl border border-[#e5e5ea] flex flex-col gap-3">
              <div>
                <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider block mb-1">
                  Access Code
                </span>
                <div className="flex items-center gap-2">
                  <span className="flex-1 text-center font-mono font-bold text-lg py-2 bg-white border border-[#e5e5ea] rounded-xl text-[#0071e3]">
                    {code}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(code)}
                    className="p-2.5 rounded-xl bg-[#0071e3] text-white hover:bg-[#0077ed] transition-colors"
                    title="Copy code"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {sharedUrl && (
                <div>
                  <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider block mb-1">
                    Direct Link
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={sharedUrl}
                      className="flex-1 text-xs font-mono py-2 px-3 bg-white border border-[#e5e5ea] rounded-xl text-[#1d1d1f] truncate"
                    />
                    <button
                      type="button"
                      onClick={() => copyUrlToClipboard(sharedUrl)}
                      className="py-2 px-3 rounded-xl bg-[#0071e3] text-white hover:bg-[#0077ed] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      {urlCopied ? <Check className="w-3.5 h-3.5" /> : <LinkIcon className="w-3.5 h-3.5" />}
                      <span>{urlCopied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Retrieve Card */}
        <div className="bg-white border border-[#e5e5ea] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34c759]"></span>
              <h3 className="font-bold text-base text-[#1d1d1f]">Retrieve Note</h3>
            </div>
            <span className="text-[11px] font-semibold text-[#86868b]">One-time access</span>
          </div>

          <form onSubmit={handleRetrieve} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">
                Note Access Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={retrieveCode}
                  onChange={(e) => setRetrieveCode(e.target.value.toUpperCase())}
                  placeholder="e.g. 8X92A"
                  maxLength={10}
                  className="flex-1 text-center font-mono font-bold text-sm uppercase py-3 px-4 rounded-xl bg-[#f5f5f7] border border-[#e5e5ea] focus:border-[#0071e3] focus:bg-white focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={retrieveLoading || !retrieveCode.trim()}
                  className="min-h-[44px] px-5 rounded-xl bg-[#1d1d1f] hover:bg-black disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all focus:outline-none"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{retrieveLoading ? "Opening..." : "Retrieve"}</span>
                </button>
              </div>
            </div>
          </form>

          {retrieveError && (
            <div className="text-xs text-[#ff3b30] font-semibold bg-[#fff2f2] p-3 rounded-xl border border-[#ff3b30]/20">
              {retrieveError}
            </div>
          )}

          {retrievedText && (
            <div className="p-4 bg-[#f5f5f7] rounded-2xl border border-[#e5e5ea] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#34c759] uppercase tracking-wider">
                  Decrypted Content
                </span>
                <button
                  type="button"
                  onClick={copyFetchedText}
                  className="text-xs font-semibold text-[#0071e3] hover:underline flex items-center gap-1"
                >
                  {fetchedCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{fetchedCopied ? "Copied" : "Copy text"}</span>
                </button>
              </div>
              <pre className="p-3 bg-white rounded-xl border border-[#e5e5ea] font-mono text-xs text-[#1d1d1f] whitespace-pre-wrap break-all max-h-60 overflow-y-auto">
                {retrievedText}
              </pre>
            </div>
          )}

          <div className="text-xs text-[#6e6e73] bg-[#f5f5f7] p-4 rounded-2xl border border-[#e5e5ea]">
            <span className="font-bold text-[#1d1d1f] block mb-0.5">Privacy Notice</span>
            Secret snippets are held strictly in memory and delete permanently after retrieval or expiration.
          </div>
        </div>
      </div>

      <SEOContent 
        title="Text Share"
        description="Secure, instant, anonymous text sharing. Create auto-expiring links."
        steps={[
          { title: "Write Note", description: "Paste or type the text you want to share securely." },
          { title: "Generate Link", description: "Click the button to create a unique shareable URL." },
          { title: "Share", description: "Send the link to someone. The text is securely stored until it expires." },
        ]}
        faqs={[
          { question: "Is my text encrypted?", answer: "Data is transmitted securely, but standard links are accessible to anyone who has the exact URL." },
          { question: "How long is data kept?", answer: "Data may be automatically purged based on the service's expiration policies." },
          { question: "Do I need an account?", answer: "No, sharing is completely anonymous and requires no registration." },
        ]}
      />
    </div>
  );
}

export default TextShare;
