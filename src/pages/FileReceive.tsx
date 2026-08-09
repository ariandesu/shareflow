import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Download, File as FileIcon, X, Loader2, Wifi, Check, ArrowRight, HelpCircle, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AdBanner } from "../components/AdBanner";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

type FileMeta = {
  name: string;
  size: number;
  mimeType: string;
};

type FileMetadata = {
  type: "server" | "p2p";
  name: string;
  size: number;
  mimeType: string;
  createdAt: number;
  offer?: any;
  files?: FileMeta[];
  count?: number;
};

export function FileReceive() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  
  const [code, setCode] = useState(id || "");
  const [status, setStatus] = useState<"idle" | "fetching" | "ready" | "receiving" | "success" | "error">("idle");
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const receivedChunksRef = useRef<ArrayBuffer[]>([]);
  const receivedSizeRef = useRef<number>(0);
  const manifestRef = useRef<FileMeta[] | null>(null);
  const currentFileNamesRef = useRef<string[]>([]);

  const statusRef = useRef(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (id) {
      fetchMetadata(id);
    }
    return () => {
      cleanupWebRTC();
    };
  }, [id]);

  const cleanupWebRTC = () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length > 0) {
      navigate(`/f/${code.trim()}`);
    }
  };

  const fetchMetadata = async (fileCode: string) => {
    setStatus("fetching");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/file/${fileCode}?t=${Date.now()}`);
      if (!res.ok) {
        throw new Error("File link has expired or code is incorrect.");
      }
      const data: FileMetadata = await res.json();
      setMetadata(data);
      setStatus("ready");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to fetch file details");
      setStatus("error");
    }
  };

  const fileList = (meta: FileMetadata): FileMeta[] =>
    meta.files && meta.files.length > 0
      ? meta.files
      : [{ name: meta.name, size: meta.size, mimeType: meta.mimeType }];

  const handleDownload = async () => {
    if (!metadata) return;

    if (metadata.type === "server") {
      // Server-side download (R2) — download each file
      const safeCode = code.replace(/[^a-zA-Z0-9]/g, "");
      const files = fileList(metadata);
      if (files.length <= 1) {
        window.location.href = `${API_BASE_URL}/api/file/${safeCode}/download/0`;
      } else {
        // Trigger sequential downloads via hidden links to avoid replacing page
        for (let i = 0; i < files.length; i++) {
          const a = document.createElement("a");
          a.href = `${API_BASE_URL}/api/file/${safeCode}/download/${i}`;
          a.download = files[i].name || `file-${i + 1}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          await new Promise((r) => setTimeout(r, 120));
        }
      }
    } else {
      // Direct WebRTC P2P download
      // If offer isn't present, try re-fetching the updated session data from the server
      if (!metadata.offer) {
        setStatus("fetching");
        try {
          const res = await fetch(`${API_BASE_URL}/api/file/${code}?t=${Date.now()}`);
          if (!res.ok) throw new Error("P2P session has expired.");
          const data: FileMetadata = await res.json();
          if (data.offer) {
            const updatedMetadata = { ...metadata, offer: data.offer };
            setMetadata(updatedMetadata);
            startP2PDownload(updatedMetadata);
          } else {
            throw new Error("P2P connection details not fully established yet. Try again in 2 seconds.");
          }
        } catch (err: any) {
          setErrorMsg(err.message || "Failed to establish direct P2P link.");
          setStatus("error");
        }
      } else {
        startP2PDownload(metadata);
      }
    }
  };

  const startP2PDownload = async (meta?: FileMetadata) => {
    const target = meta || metadata;
    if (!target || !target.offer) {
      setErrorMsg("P2P connection details not found. Sender might be offline.");
      setStatus("error");
      return;
    }

    setStatus("receiving");
    setProgress(0);
    setErrorMsg("");
    receivedChunksRef.current = [];
    receivedSizeRef.current = 0;
    manifestRef.current = fileList(target);
    currentFileNamesRef.current = fileList(target).map((f) => f.name);

    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          {
            urls: [
              "stun:openrelay.metered.ca:80",
              "turn:openrelay.metered.ca:80?transport=udp",
              "turn:openrelay.metered.ca:80?transport=tcp",
              "turn:openrelay.metered.ca:443?transport=tcp"
            ],
            username: "openrelay",
            credential: "openrelay"
          }
        ]
      });
      pcRef.current = pc;

      // Handle data channel from sender
      pc.ondatachannel = (event) => {
        const channel = event.channel;
        channel.binaryType = "arraybuffer";

        channel.onmessage = (e) => {
          if (typeof e.data === "string" && e.data.startsWith("__MANIFEST__")) {
            try {
              const parsed = JSON.parse(e.data.replace("__MANIFEST__", ""));
              if (Array.isArray(parsed) && parsed.length > 0) {
                manifestRef.current = parsed;
                currentFileNamesRef.current = parsed.map((f: any) => f.name);
              }
            } catch (_) {}
            return;
          }

          if (e.data === "__EOF__") {
            // Completed! Create file downloads.
            setStatus("success");
            statusRef.current = "success";

            const manifest = manifestRef.current || fileList(target);
            const totalSize = manifest.reduce((sum, f) => sum + f.size, 0);
            const allParts = receivedChunksRef.current;
            const concatenated = new Uint8Array(totalSize);
            let offset = 0;
            for (const part of allParts) {
              concatenated.set(new Uint8Array(part), offset);
              offset += part.byteLength;
            }

            let blobOffset = 0;
            manifest.forEach((file, i) => {
              const fileBytes = concatenated.slice(blobOffset, blobOffset + file.size);
              blobOffset += file.size;
              const blob = new Blob([fileBytes], { type: file.mimeType || "application/octet-stream" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = currentFileNamesRef.current[i] || file.name || `file-${i + 1}`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            });

            // Send ACK back to sender to allow them to close connection cleanly
            try { channel.send("ACK"); } catch (_) {}

            // Delay closing slightly so ACK has time to deliver
            setTimeout(cleanupWebRTC, 1000);
          } else if (e.data === "__EOF__LEGACY") {
            setStatus("success");
            statusRef.current = "success";
            const blob = new Blob(receivedChunksRef.current, { type: target.mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = target.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            try { channel.send("ACK"); } catch (_) {}
            setTimeout(cleanupWebRTC, 1000);
          } else {
            // Buffer chunk
            const chunk = e.data as ArrayBuffer;
            receivedChunksRef.current.push(chunk);
            receivedSizeRef.current += chunk.byteLength;
            const manifest = manifestRef.current || [{ name: target.name, size: target.size, mimeType: target.mimeType }];
            const totalSize = manifest.reduce((sum, f) => sum + f.size, 0);
            setProgress(Math.min(100, Math.round((receivedSizeRef.current / totalSize) * 100)));
          }
        };

        channel.onclose = () => {
          if (statusRef.current !== "success") {
            setErrorMsg("Direct P2P link terminated before file could be fully transferred.");
            setStatus("error");
          }
        };

        channel.onerror = () => {
          setErrorMsg("Data channel error occurred during transmission.");
          setStatus("error");
        };
      };

      // Set remote SDP offer
      await pc.setRemoteDescription(new RTCSessionDescription(target.offer));

      // Signaling helper: post answer to backend when ICE is complete
      let answerSent = false;
      let iceTimeout: number;

      const handleIceComplete = async () => {
        if (answerSent) return;
        const localDesc = pc.localDescription;
        if (localDesc) {
          answerSent = true;
          window.clearTimeout(iceTimeout);
          try {
            const res = await fetch(`${API_BASE_URL}/api/file/p2p/${code}/answer`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ answer: localDesc })
            });

            if (!res.ok) {
              answerSent = false; // Reset on failure to allow retry
              throw new Error("Failed to post connection answer to sender.");
            }
          } catch (e: any) {
            answerSent = false; // Reset on failure to allow retry
            setErrorMsg(e.message || "Failed to post answer");
            setStatus("error");
          }
        }
      };

      // Dual check for ICE gathering completion (browser compatibility)
      pc.onicecandidate = (event) => {
        if (event.candidate === null) {
          handleIceComplete();
        }
      };

      pc.onicegatheringstatechange = () => {
        if (pc.iceGatheringState === "complete") {
          handleIceComplete();
        }
      };

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Fallback: If ICE gathering hangs, send what we have after 2.5 seconds
      iceTimeout = window.setTimeout(() => {
        handleIceComplete();
      }, 2500);

    } catch (err: any) {
      setErrorMsg(err.message || "Failed to initiate WebRTC P2P download.");
      setStatus("error");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-[calc(100vh-140px)] w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 gap-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white border border-black/10 dark:border-white/10 text-black p-8 sm:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-bl-full -z-0"></div>
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <h2 className="text-3xl font-black uppercase tracking-tighter">Receive<span className="text-black/30">File</span></h2>
        </div>

        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col gap-6 relative z-10"
            >
              <form onSubmit={handleCodeSubmit} className="flex flex-col gap-4">
                <label className="text-xs font-bold uppercase tracking-widest text-black/50">Enter Secure Code</label>
                <div className="flex flex-col sm:flex-row border border-black/10 dark:border-white/10">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. a1B2"
                    className="flex-1 px-4 py-4 bg-black/5 font-bold tracking-widest text-lg outline-none focus:bg-black/10 transition-colors placeholder-black/30 text-black border-b border-black/10 sm:border-b-0 sm:border-r dark:border-white/10"
                    maxLength={10}
                    required
                  />
                  <button 
                    type="submit"
                    className="py-4 px-6 bg-black text-white hover:bg-black/80 transition-colors light-theme-invert flex items-center justify-center w-full sm:w-20"
                  >
                    <ArrowRight className="w-6 h-6 text-white" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {status === "fetching" && (
            <motion.div 
              key="fetching"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 relative z-10"
            >
              <Loader2 className="w-12 h-12 animate-spin text-black/50 mb-4" />
              <p className="font-bold uppercase tracking-widest text-sm text-black/50">Locating File...</p>
            </motion.div>
          )}

          {status === "ready" && metadata && (
            <motion.div 
              key="ready"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-6 relative z-10"
            >
              <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mb-6">
                <FileIcon className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-2xl font-black text-center break-all mb-2 text-black">
                {(metadata.count && metadata.count > 1) ? `${metadata.count} Files` : metadata.name}
              </h3>
              <p className="text-sm font-medium text-black/50 uppercase tracking-widest mb-4">
                {(metadata.size / (1024*1024)).toFixed(2)} MB total
              </p>
              
              {metadata.count && metadata.count > 1 && (
                <div className="w-full max-h-40 overflow-y-auto mb-6 bg-black/5 border border-black/10 divide-y divide-black/10">
                  {fileList(metadata).map((f, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 px-4 py-2">
                      <span className="text-xs font-bold text-black truncate">{f.name}</span>
                      <span className="text-[10px] font-medium text-black/50 shrink-0">{(f.size / (1024*1024)).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 mb-8 bg-black/5 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-black/60">
                {metadata.type === "server" ? (
                  <>Edge Cloud <span className="w-2 h-2 rounded-full bg-green-500"></span></>
                ) : (
                  <>Direct P2P <Wifi className="w-3 h-3 text-blue-500" /></>
                )}
              </div>

              <button
                onClick={handleDownload}
                className="w-full bg-black text-white py-4 font-black uppercase tracking-widest hover:bg-black/80 transition-colors light-theme-invert flex justify-center items-center gap-2"
              >
                <Download className="w-5 h-5" /> {metadata.count && metadata.count > 1 ? `Download All (${metadata.count})` : "Download File"}
              </button>
            </motion.div>
          )}

          {status === "receiving" && metadata && (
            <motion.div 
              key="receiving"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 relative z-10"
            >
              <Wifi className="w-12 h-12 text-black animate-pulse mb-6" />
              <div className="w-full flex justify-between font-bold uppercase tracking-widest text-xs mb-4 text-black">
                <span>Receiving from Peer...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-black/10 overflow-hidden mb-6">
                <motion.div 
                  className="h-full bg-black light-theme-invert" 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
              <p className="text-xs font-bold text-red-500 animate-pulse text-center">
                Do not close this tab or lock your device.
              </p>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 relative z-10"
            >
              <div className="w-20 h-20 bg-black text-white flex items-center justify-center rounded-full mb-6 light-theme-invert">
                <Check className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-black">Download Complete</h3>
              <p className="text-black/60 font-medium text-center mb-8">
                Your file has been successfully received. Check your browser downloads.
              </p>
              <button 
                onClick={() => { setStatus("idle"); setCode(""); navigate("/f"); }}
                className="font-bold uppercase tracking-widest text-sm border-b-2 border-black pb-1 hover:text-black/50 hover:border-black/50 transition-colors text-black"
              >
                Receive Another File
              </button>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 relative z-10 text-center"
            >
              <div className="w-16 h-16 bg-red-500 text-white flex items-center justify-center mb-6">
                <X className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 text-black">Error</h3>
              <p className="text-black/60 font-medium mb-8 max-w-sm">{errorMsg}</p>
              <button 
                onClick={() => setStatus("idle")}
                className="font-bold uppercase tracking-widest text-sm border-b-2 border-black pb-1 hover:text-black/50 transition-colors text-black"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AdBanner />

      {/* User Guide & FAQ Section */}
      <div className="w-full max-w-xl flex flex-col gap-8 bg-white/5 border border-white/10 p-8 sm:p-12 text-white">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2 mb-6">
            <BookOpen className="w-6 h-6 text-white" /> How to Receive Files
          </h3>
          <ul className="list-decimal pl-5 space-y-3 text-sm text-white/70">
            <li>Enter the secure 4-character code provided by the sender.</li>
            <li>Click the checkmark/arrow button to retrieve the file details.</li>
            <li>Review the file name, size, and source type (Edge Cloud or Direct P2P).</li>
            <li>Click <strong>Download File</strong> to begin the transfer:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Cloud downloads will start instantly.</li>
                <li>Direct P2P downloads will connect to the sender's browser and stream the file. Make sure both pages remain open.</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
