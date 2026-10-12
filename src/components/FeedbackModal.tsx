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
        className="fixed bottom-6 right-6 z-40 bg-[#1d1d1f] hover:bg-[#0071e3] text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group focus:outline-none"
        title="Send Feedback"
        aria-label="Send Feedback"
      >
        <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e5e5ea] relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-[#86868b] hover:text-[#1d1d1f] transition-colors p-1 rounded-full hover:bg-[#f5f5f7]"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-[#34c759] mx-auto mb-3" />
                <h3 className="text-lg font-bold text-[#1d1d1f]">Feedback Received</h3>
                <p className="text-xs text-[#6e6e73] mt-1">Thank you for helping us refine ShareFlow.</p>
              </div>
            ) : (
              <>
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-[#1d1d1f]">Share Your Thoughts</h3>
                  <p className="text-xs text-[#6e6e73] mt-0.5">
                    Found an issue or have an architectural recommendation?
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Category</label>
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
                          className={`text-xs py-2 px-3 rounded-xl font-medium border transition-colors ${
                            category === item.id
                              ? "bg-[#0071e3] text-white border-[#0071e3]"
                              : "bg-[#f5f5f7] text-[#6e6e73] border-[#e5e5ea] hover:bg-[#e5e5ea]"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Your Feedback</label>
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what you experienced or would like to see..."
                      rows={3}
                      className="w-full text-xs p-3 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] focus:border-[#0071e3] focus:bg-white focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Email (Optional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full text-xs p-2.5 rounded-xl bg-[#f5f5f7] border border-[#e5e5ea] focus:border-[#0071e3] focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !message.trim()}
                    className="w-full py-3 rounded-2xl bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
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
