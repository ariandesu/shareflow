/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { MessageSquare, X, Send, CheckCircle2 } from "lucide-react";

export function FeedbackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("feature");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    // Simulate swift submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
        setMessage("");
      }, 2000);
    }, 400);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#1d1d1f] hover:bg-[#0071e3] text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 active:scale-90 flex items-center justify-center group focus:outline-none"
        title="Send Feedback"
        aria-label="Send Feedback"
      >
        <MessageSquare className="w-5 h-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#12141a] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e5e5ea] dark:border-[#27272a] relative animate-spring-pop">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 active:scale-90 p-1 rounded-full hover:bg-[#f5f5f7] dark:hover:bg-[#1f222a]"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-[#34c759] mx-auto mb-3" />
                <h3 className="text-lg font-bold text-[#1d1d1f] dark:text-white">Feedback Received</h3>
                <p className="text-xs text-[#6e6e73] dark:text-[#a1a1aa] mt-1">Thank you for helping us refine ShareFlow.</p>
              </div>
            ) : (
              <>
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-[#1d1d1f] dark:text-white">Share Your Thoughts</h3>
                  <p className="text-xs text-[#6e6e73] dark:text-[#a1a1aa] mt-0.5">
                    Found an issue or have an architectural recommendation?
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1d1d1f] dark:text-white mb-1.5">Category</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "feature", label: "Feature" },
                        { id: "bug", label: "Bug Report" },
                        { id: "p2p", label: "P2P Speed" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setCategory(item.id)}
                          className={`text-xs py-2 px-3 rounded-xl font-medium border transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-95 hover:scale-105 ${
                            category === item.id
                              ? "bg-[#0071e3] text-white border-[#0071e3]"
                              : "bg-[#f5f5f7] dark:bg-[#181a20] text-[#6e6e73] dark:text-[#a1a1aa] border-[#e5e5ea] dark:border-[#27272a] hover:bg-[#e5e5ea] dark:hover:bg-[#27272a]"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1d1d1f] dark:text-white mb-1.5">Your Feedback</label>
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what you experienced or would like to see..."
                      rows={3}
                      className="w-full text-xs p-3 rounded-2xl bg-[#f5f5f7] dark:bg-[#181a20] text-[#1d1d1f] dark:text-white border border-[#e5e5ea] dark:border-[#27272a] focus:border-[#0071e3] focus:bg-white dark:focus:bg-[#12141a] focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1d1d1f] dark:text-white mb-1.5">Email (Optional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full text-xs p-2.5 rounded-xl bg-[#f5f5f7] dark:bg-[#181a20] text-[#1d1d1f] dark:text-white border border-[#e5e5ea] dark:border-[#27272a] focus:border-[#0071e3] focus:bg-white dark:focus:bg-[#12141a] focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !message.trim()}
                    className="w-full py-3 rounded-2xl bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02] active:scale-[0.97]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? "Sending..." : "Submit Feedback"}</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
