import { useState } from "react";
import { ShieldCheck, X, Terminal, ExternalLink, ArrowRight, CheckCircle, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VerifyDevToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VerifyDevToolsModal({ isOpen, onClose }: VerifyDevToolsModalProps) {
  const [activeTab, setActiveTab] = useState<"network" | "source" | "p2p">("network");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#181a20] rounded-2xl border border-[#e5e5ea] dark:border-[#27272a] shadow-2xl overflow-hidden flex flex-col text-[#1d1d1f] dark:text-[#f5f5f7]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5ea] dark:border-[#27272a] bg-[#fbfbfd] dark:bg-[#121316]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">Don't Trust Us — Verify in DevTools</h3>
                <p className="text-xs text-[#6e6e73] dark:text-[#a1a1aa]">
                  100% In-Browser Computation • Zero Bytes Uploaded to Any Server
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#e5e5ea] dark:hover:bg-[#27272a] text-[#86868b] transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-[#e5e5ea] dark:border-[#27272a] bg-[#f5f5f7] dark:bg-[#15161a] px-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("network")}
              className={`py-3 px-4 border-b-2 transition-all ${
                activeTab === "network"
                  ? "border-[#0071e3] text-[#0071e3] dark:text-[#38bdf8]"
                  : "border-transparent text-[#6e6e73] dark:text-[#a1a1aa] hover:text-[#1d1d1f] dark:hover:text-white"
              }`}
            >
              1. Network Tab (0 Bytes Out)
            </button>
            <button
              onClick={() => setActiveTab("source")}
              className={`py-3 px-4 border-b-2 transition-all ${
                activeTab === "source"
                  ? "border-[#0071e3] text-[#0071e3] dark:text-[#38bdf8]"
                  : "border-transparent text-[#6e6e73] dark:text-[#a1a1aa] hover:text-[#1d1d1f] dark:hover:text-white"
              }`}
            >
              2. Offline / Airplane Mode
            </button>
            <button
              onClick={() => setActiveTab("p2p")}
              className={`py-3 px-4 border-b-2 transition-all ${
                activeTab === "p2p"
                  ? "border-[#0071e3] text-[#0071e3] dark:text-[#38bdf8]"
                  : "border-transparent text-[#6e6e73] dark:text-[#a1a1aa] hover:text-[#1d1d1f] dark:hover:text-white"
              }`}
            >
              3. WebRTC Peer Inspection
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs leading-relaxed">
            {activeTab === "network" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#f5f5f7] dark:bg-[#101114] border border-[#e5e5ea] dark:border-[#27272a] space-y-3 font-mono">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                    <Terminal className="w-4 h-4" />
                    <span>How to verify with Chrome / Firefox / Safari DevTools:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-[#444] dark:text-[#bbb]">
                    <li>Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-black/40 border border-[#ccc] dark:border-[#444]">F12</kbd> (or <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-black/40 border border-[#ccc] dark:border-[#444]">Ctrl+Shift+I</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-black/40 border border-[#ccc] dark:border-[#444]">Cmd+Option+I</kbd>) to open DevTools.</li>
                    <li>Click on the <strong>Network</strong> tab.</li>
                    <li>Filter by <strong>Fetch/XHR</strong> and check the <em>Preserve log</em> checkbox.</li>
                    <li>Perform any operation (e.g. merge 500-page PDF, compress an image, strip EXIF metadata, decode a private JWT, or format JSON).</li>
                    <li>Inspect the Network log: <strong>Zero outbound POST requests</strong> are sent. The payload never leaves your device's RAM.</li>
                  </ol>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <span className="font-bold">Cryptographic Proof: </span>
                    Unlike server-based converter sites (e.g. ILovePDF, Smallpdf) that upload confidential PDFs to remote cloud disks, ShareFlow compiles `pdf-lib`, `tesseract.js`, and Web Crypto APIs directly into client-side WebAssembly and JavaScript.
                  </div>
                </div>
              </div>
            )}

            {activeTab === "source" && (
              <div className="space-y-4">
                <p>
                  You don't even have to stay connected to the internet to run our 40+ utilities once the page is loaded:
                </p>
                <div className="p-4 rounded-xl bg-[#f5f5f7] dark:bg-[#101114] border border-[#e5e5ea] dark:border-[#27272a] space-y-3 font-mono">
                  <div className="flex items-center gap-2 text-[#0071e3] dark:text-[#38bdf8] font-bold">
                    <WifiOff className="w-4 h-4" />
                    <span>The Airplane Mode Test:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-[#444] dark:text-[#bbb]">
                    <li>Open any tool page (e.g. <code>/pdf-merger</code>, <code>/image-compressor</code>, <code>/exif-remover</code>, or <code>/jwt-decoder</code>).</li>
                    <li>Disconnect Wi-Fi or turn on Airplane Mode on your operating system.</li>
                    <li>Drag and drop your confidential files into the tool and click process.</li>
                    <li>The output file is generated instantly offline inside your browser sandbox.</li>
                  </ol>
                </div>
              </div>
            )}

            {activeTab === "p2p" && (
              <div className="space-y-4">
                <p>
                  For P2P File Transfer, data streams browser-to-browser via an encrypted WebRTC DataChannel (SCTP over DTLS):
                </p>
                <div className="p-4 rounded-xl bg-[#f5f5f7] dark:bg-[#101114] border border-[#e5e5ea] dark:border-[#27272a] space-y-2 font-mono">
                  <div className="text-xs text-[#86868b]">
                    Signaling Server Responsibility:
                  </div>
                  <p className="text-[#444] dark:text-[#bbb]">
                    Our signaling server solely exchanges lightweight SDP session offers/answers (session handshakes ~2KB). Once peers establish the direct WebRTC peer connection, the signaling socket goes silent and raw file chunks stream socket-to-socket between your IP and the recipient's IP.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#e5e5ea] dark:border-[#27272a] bg-[#fbfbfd] dark:bg-[#121316] flex items-center justify-between">
            <span className="text-[11px] text-[#86868b] dark:text-[#71717a]">
              Client-side execution verified by open architecture.
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs transition-colors"
            >
              Got It
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/**
 * Clickable Trust Badge component to be placed in headers, hero sections, and footers.
 */
export function VerifyTrustBadge({ className = "" }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all duration-200 cursor-pointer ${
          className ||
          "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:border-emerald-500/30"
        }`}
        title="Click to see how to verify 0 bytes uploaded via DevTools"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>100% Client-Side: How to Verify</span>
      </button>

      <VerifyDevToolsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
