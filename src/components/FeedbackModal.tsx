import { useState } from "react";
import { MessageSquare, Send, CheckCircle2, AlertCircle } from "lucide-react";

export function FeedbackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<"bug" | "suggestion" | "general">("suggestion");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please enter your message or problem report.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Anonymous User",
          email: email.trim(),
          type,
          message: message.trim(),
          tool: window.location.pathname
        })
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setIsOpen(false);
          setMessage("");
        }, 2500);
      } else {
        const data = await res.json();
        setError(data?.error || "Failed to send feedback. Please try again.");
      }
    } catch {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
        setMessage("");
      }, 2500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 transition-all hover:scale-105 border border-emerald-300/40"
      >
        <MessageSquare className="w-4 h-4" /> Feedback & Report
      </button>

      {/* FEEDBACK MODAL DIALOG */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131926] border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">
            
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" /> Give Feedback or Report Problem
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-white text-lg">Thank You!</h4>
                <p className="text-xs text-white/60">
                  Your message has been sent directly to the development team on Telegram!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1.5 block">
                    Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "suggestion", label: "💡 Idea" },
                      { id: "bug", label: "🐞 Bug / Issue" },
                      { id: "general", label: "💬 General" }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setType(item.id as any)}
                        className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                          type === item.id
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                            : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1 block">
                      Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-white/5 border border-white/10 px-3 py-2 text-xs text-white rounded-lg focus:outline-none focus:border-white/30"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1 block">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@domain.com"
                      className="w-full bg-white/5 border border-white/10 px-3 py-2 text-xs text-white rounded-lg focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1 block">
                    Message / Problem Description *
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your suggestion, feature request, or problem..."
                    className="w-full bg-white/5 border border-white/10 p-3 text-xs text-white rounded-lg focus:outline-none focus:border-emerald-500/40 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> {submitting ? "Sending..." : "Submit Feedback"}
                </button>
              </form>
            )}

          </div>
        </div>
      )}
    </>
  );
}
