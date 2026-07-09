import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Upload, X, Copy, Check, File as FileIcon, ArrowRight, Zap, Cloud, Download, Server, Wifi, HelpCircle, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export function FileShare() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"server" | "p2p">("server");
  const [status, setStatus] = useState<"idle" | "uploading" | "waiting_peer" | "transferring" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [shareCode, setShareCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const pollIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      cleanupWebRTC();
    };
  }, []);

  const cleanupWebRTC = () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      if (selected.size > 10 * 1024 * 1024) {
        setMode("p2p");
      } else {
        setMode("server");
      }
      setStatus("idle");
      setShareCode("");
      setErrorMsg("");
      setProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      setFile(dropped);
      if (dropped.size > 10 * 1024 * 1024) setMode("p2p");
      else setMode("server");
      setStatus("idle");
      setShareCode("");
    }
  };

  const startShare = async () => {
    if (!file) return;
    setStatus(mode === "server" ? "uploading" : "waiting_peer");
    setErrorMsg("");
    setProgress(0);

    if (mode === "server") {
      // Cloud sync upload (R2)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg("Cloud Sync is limited to 10MB. Use Direct P2P for larger files.");
        setStatus("error");
        return;
      }
      
      const formData = new FormData();
      formData.append("file", file);

      try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API_BASE_URL}/api/file`, true);
        
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            setShareCode(data.code);
            setStatus("success");
          } else {
            const err = JSON.parse(xhr.responseText || '{"error":"Upload failed"}');
            setErrorMsg(err.error || "Upload failed");
            setStatus("error");
          }
        };

        xhr.onerror = () => {
          setErrorMsg("Network error during upload. Please verify API endpoints.");
          setStatus("error");
        };

        xhr.send(formData);
      } catch (err: any) {
        setErrorMsg(err.message || "Upload failed");
        setStatus("error");
      }
    } else {
      // Direct WebRTC P2P
      try {
        cleanupWebRTC();

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });
        pcRef.current = pc;

        // Create data channel
        const channel = pc.createDataChannel("fileTransfer", { ordered: true });
        channel.binaryType = "arraybuffer";

        // Wait for ICE gathering to complete before creating/sending offer
        pc.onicegatheringstatechange = async () => {
          if (pc.iceGatheringState === "complete") {
            const localDesc = pc.localDescription;
            if (localDesc) {
              // Post offer to custom signaling backend
              try {
                const res = await fetch(`${API_BASE_URL}/api/file/p2p`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: file.name,
                    size: file.size,
                    mimeType: file.type,
                    offer: localDesc
                  })
                });
                
                if (!res.ok) {
                  const errData = await res.json();
                  throw new Error(errData.error || "Failed to register connection offer");
                }

                const data = await res.json();
                setShareCode(data.code);

                // Start polling for SDP answer from receiver
                startPollingAnswer(data.code, pc, channel);
              } catch (e: any) {
                setErrorMsg(e.message || "Failed to register signaling offer");
                setStatus("error");
              }
            }
          }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

      } catch (err: any) {
        setErrorMsg(err.message || "Failed to initialize WebRTC connection");
        setStatus("error");
      }
    }
  };

  const startPollingAnswer = (code: string, pc: RTCPeerConnection, channel: RTCDataChannel) => {
    let attempts = 0;
    const maxAttempts = 150; // 5 minutes (150 * 2s)

    pollIntervalRef.current = window.setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        cleanupWebRTC();
        setErrorMsg("Session timed out. No receiver connected within 5 minutes.");
        setStatus("error");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/file/p2p/${code}/answer`);
        if (!res.ok) return;

        const data = await res.json();
        if (data.status === "ready" && data.answer) {
          // Received answer! Clear polling.
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }

          // Apply remote answer
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer));

          // Set up connection flow on channel open
          channel.onopen = async () => {
            setStatus("transferring");
            
            // Read and send the file in chunks
            const buffer = await file.arrayBuffer();
            let offset = 0;
            const chunkLength = 16384; // 16KB

            const sendNextChunk = () => {
              while (offset < buffer.byteLength) {
                // If WebRTC internal buffer is loaded, wait for low buffer to resume
                if (channel.bufferedAmount > 8 * 1024 * 1024) { // 8MB threshold
                  channel.onbufferedamountlow = () => {
                    channel.onbufferedamountlow = null;
                    sendNextChunk();
                  };
                  return;
                }

                const chunk = buffer.slice(offset, offset + chunkLength);
                channel.send(chunk);
                offset += chunkLength;
                setProgress(Math.min(100, Math.round((offset / buffer.byteLength) * 100)));
              }

              // EOF transmission
              channel.send("__EOF__");
              setStatus("success");
              cleanupWebRTC();
            };

            sendNextChunk();
          };

          channel.onclose = () => {
            if (status !== "success") {
              setErrorMsg("Direct link connection terminated by receiver.");
              setStatus("error");
            }
          };

          channel.onerror = (e) => {
            setErrorMsg("WebRTC channel error occurred during direct transfer.");
            setStatus("error");
          };
        }
      } catch (e) {
        console.error("Polling error:", e);
      }
    }, 2000);
  };

  const copyLink = () => {
    const url = `${window.location.origin}/f/${shareCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setShareCode("");
    setErrorMsg("");
    setProgress(0);
    cleanupWebRTC();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-[calc(100vh-140px)] w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 gap-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white border border-black/10 dark:border-white/10 text-black p-8 sm:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-bl-full -z-0"></div>
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <h2 className="text-4xl font-black uppercase tracking-tighter">Share<span className="text-black/30">File</span></h2>
          <div className="text-xs font-bold bg-black text-white px-3 py-1 uppercase tracking-widest light-theme-invert">
            Zero cost
          </div>
        </div>

        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col gap-6 relative z-10"
            >
              {/* File Dropzone */}
              <div 
                className={`border-4 border-dashed p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                  file ? 'border-black bg-black/5' : 'border-black/20 hover:border-black/50 hover:bg-black/5'
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                
                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <FileIcon className="w-12 h-12 text-black" />
                    <div>
                      <p className="font-bold text-lg text-black">{file.name}</p>
                      <p className="text-sm font-medium text-black/50">{(file.size / (1024*1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-black/50">
                    <Upload className="w-12 h-12 text-black" />
                    <div>
                      <p className="font-bold text-lg text-black">Drag & Drop file here</p>
                      <p className="text-sm">or click to browse</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Transfer Mode Selection */}
              {file && (
                <div className="flex flex-col gap-4 mt-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-black/50">Transfer Strategy</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div 
                      onClick={() => setMode("server")}
                      className={`p-4 border-2 flex flex-col gap-2 cursor-pointer transition-all ${
                        mode === "server" ? "border-black bg-black text-white" : "border-black/10 hover:border-black/30"
                      } ${file.size > 10 * 1024 * 1024 ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      <div className="flex items-center gap-2 font-bold">
                        <Cloud className="w-5 h-5" /> Cloud Sync
                      </div>
                      <p className={`text-xs ${mode === "server" ? "text-white/70" : "text-black/50"}`}>
                        Upload to secure edge servers. Generates a 24-hour link. Max 10MB.
                      </p>
                    </div>

                    <div 
                      onClick={() => setMode("p2p")}
                      className={`p-4 border-2 flex flex-col gap-2 cursor-pointer transition-all ${
                        mode === "p2p" ? "border-black bg-black text-white" : "border-black/10 hover:border-black/30"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold">
                        <Wifi className="w-5 h-5" /> Direct P2P
                      </div>
                      <p className={`text-xs ${mode === "p2p" ? "text-white/70" : "text-black/50"}`}>
                        Stream directly via WebRTC. Unlimited size. Keep browser open.
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={startShare}
                    className="mt-4 w-full py-4 bg-black text-white font-black uppercase tracking-widest hover:bg-black/80 transition-colors light-theme-invert"
                  >
                    Generate Secure Link
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {(status === "uploading" || status === "transferring") && (
            <motion.div 
              key="progress"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 relative z-10"
            >
              <div className="w-full flex justify-between font-bold uppercase tracking-widest text-xs mb-4 text-black">
                <span>{status === "uploading" ? "Uploading to Cloud..." : "Streaming to Peer..."}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-black/10 overflow-hidden">
                <motion.div 
                  className="h-full bg-black light-theme-invert" 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
              {status === "transferring" && (
                <p className="mt-6 text-sm font-bold text-red-500 animate-pulse text-center">
                  Do not close this tab until transfer is complete!
                </p>
              )}
            </motion.div>
          )}

          {status === "waiting_peer" && (
            <motion.div 
              key="waiting"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 relative z-10 text-center"
            >
              <Wifi className="w-16 h-16 mb-6 text-black animate-pulse" />
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 text-black">Awaiting Receiver</h3>
              <p className="text-black/60 font-medium max-w-sm mx-auto mb-8">
                Send this secure code or link to the receiver. The file will stream directly from your browser once they connect.
              </p>

              <div className="bg-black/5 px-8 py-6 flex items-center justify-center mb-6 w-full max-w-sm">
                <span className="text-5xl font-black tracking-widest text-black">{shareCode}</span>
              </div>

              <div className="flex gap-4 w-full max-w-sm">
                <button
                  onClick={copyLink}
                  className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 font-bold uppercase tracking-widest text-sm hover:bg-black/80 transition-colors light-theme-invert"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied" : "Copy Link"}
                </button>
              </div>
              <button onClick={reset} className="mt-8 text-xs font-bold text-black/50 hover:text-black uppercase tracking-widest">
                Cancel Transfer
              </button>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-8 relative z-10"
            >
              <div className="w-20 h-20 bg-black text-white flex items-center justify-center rounded-full mb-6 light-theme-invert">
                <Check className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 text-black">
                {mode === "server" ? "Upload Complete" : "Transfer Complete"}
              </h3>
              
              {mode === "server" && (
                <>
                  <p className="text-black/60 font-medium text-center max-w-md mx-auto mb-8">
                    Your file is now securely stored at the edge. The link will automatically expire in 24 hours.
                  </p>
                  
                  <div className="bg-black/5 px-8 py-6 flex items-center justify-center mb-6 w-full max-w-sm">
                    <span className="text-5xl font-black tracking-widest text-black">{shareCode}</span>
                  </div>

                  <div className="flex gap-4 w-full max-w-sm">
                    <button
                      onClick={copyLink}
                      className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 font-bold uppercase tracking-widest text-sm hover:bg-black/80 transition-colors light-theme-invert"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied" : "Copy Link"}
                    </button>
                  </div>
                </>
              )}
              
              <button 
                onClick={reset}
                className="mt-10 font-bold uppercase tracking-widest text-sm border-b-2 border-black pb-1 hover:text-black/50 hover:border-black/50 transition-colors text-black"
              >
                Share Another File
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
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 text-black">Transfer Failed</h3>
              <p className="text-black/60 font-medium mb-8 max-w-sm">{errorMsg}</p>
              <button 
                onClick={reset}
                className="font-bold uppercase tracking-widest text-sm border-b-2 border-black pb-1 hover:text-black/50 transition-colors text-black"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* User Guide & FAQ Section */}
      <div className="w-full max-w-2xl flex flex-col gap-8 bg-white/5 border border-white/10 p-8 sm:p-12 text-white">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2 mb-6">
            <BookOpen className="w-6 h-6 text-white" /> User Guide
          </h3>
          <ul className="list-decimal pl-5 space-y-3 text-sm text-white/70">
            <li>Select a file using the drag-and-drop region or click to browse.</li>
            <li>Choose a sharing strategy:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Cloud Sync:</strong> Best for fast sharing of files up to 10MB. File is uploaded to secure Cloudflare edge nodes and deletes automatically after 24 hours.</li>
                <li><strong>Direct P2P:</strong> Ideal for files of any size (unlimited). Initiates a direct connection from your browser to the receiver. Senders must keep the browser tab open during transfer.</li>
              </ul>
            </li>
            <li>Copy the generated 4-character code or full link, and share it with the receiver.</li>
          </ul>
        </div>

        <div className="h-px bg-white/10"></div>

        <div>
          <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2 mb-6">
            <HelpCircle className="w-6 h-6 text-white" /> Frequently Asked Questions
          </h3>
          <div className="space-y-6 text-sm">
            <div>
              <h4 className="font-bold text-white mb-2">Is there any file size limit for Direct P2P transfer?</h4>
              <p className="text-white/70">No! Direct P2P connects your browser directly to the recipient using WebRTC. Because it doesn't upload the file to any server, there are no file size limits.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">How secure are my files?</h4>
              <p className="text-white/70">Very secure. For Cloud Sync, files are encrypted during upload and download, and deleted automatically from storage. For Direct P2P, the transfer is fully end-to-end encrypted (E2EE) directly between the two browsers.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">Can the receiver download if I close the tab during P2P transfer?</h4>
              <p className="text-white/70">No. During a Direct P2P session, the recipient reads the file blocks directly from your memory. You must keep the tab open until they confirm download completion.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
