import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Upload, X, Copy, Check, File as FileIcon, ArrowRight, Zap, Cloud, Download, Server, Wifi } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Peer, { DataConnection } from "peerjs";

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
  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  
  const CHUNK_SIZE = 16384; // 16KB per WebRTC chunk

  useEffect(() => {
    return () => {
      // Cleanup peer on unmount
      if (peerRef.current) peerRef.current.destroy();
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      // Auto-select mode based on size
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

    if (mode === "server") {
      // Server Mode Upload
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg("Server mode is limited to 10MB. Use Direct mode for large files.");
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
            const err = JSON.parse(xhr.responseText);
            setErrorMsg(err.error || "Upload failed");
            setStatus("error");
          }
        };

        xhr.onerror = () => {
          setErrorMsg("Network error during upload");
          setStatus("error");
        };

        xhr.send(formData);
      } catch (err: any) {
        setErrorMsg(err.message || "Upload failed");
        setStatus("error");
      }
    } else {
      // P2P Mode Setup
      try {
        // Register session with API to get a nice 4-char code
        const res = await fetch(`${API_BASE_URL}/api/file/p2p`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: file.name, size: file.size, mimeType: file.type })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        const code = data.code;
        setShareCode(code);
        
        // Setup PeerJS using the exact ID "shareflow-[code]"
        const peerId = `shareflow-${code}`;
        const peer = new Peer(peerId, {
          // Public PeerJS cloud server
          debug: 2
        });
        peerRef.current = peer;

        peer.on('open', () => {
          console.log("PeerJS listening on", peerId);
        });

        peer.on('connection', (conn) => {
          console.log("Peer connected:", conn.peer);
          connRef.current = conn;
          setStatus("transferring");
          
          conn.on('open', async () => {
            // Send file details first
            conn.send({ type: 'metadata', name: file.name, size: file.size, mimeType: file.type });
            
            // Read file and send in chunks to not overwhelm DataChannel
            const buffer = await file.arrayBuffer();
            let offset = 0;
            
            const sendChunk = () => {
              if (offset < buffer.byteLength) {
                const chunk = buffer.slice(offset, offset + CHUNK_SIZE);
                conn.send({ type: 'chunk', data: chunk, offset, total: buffer.byteLength });
                offset += CHUNK_SIZE;
                setProgress(Math.min(100, Math.round((offset / buffer.byteLength) * 100)));
                
                // Throttle sending slightly to avoid queue overflow
                setTimeout(sendChunk, 5); 
              } else {
                conn.send({ type: 'done' });
                setStatus("success");
                // Note: Sender stays on page until success, but connection stays open in case receiver wants it again?
                // Best practice is to wait for acknowledgment from receiver.
              }
            };
            
            // Wait slightly for receiver to process metadata
            setTimeout(sendChunk, 500);
          });
          
          conn.on('close', () => {
            if (status !== "success") {
               setErrorMsg("Connection closed by receiver");
               setStatus("error");
            }
          });
        });

        peer.on('error', (err) => {
          setErrorMsg(`P2P Error: ${err.message}`);
          setStatus("error");
        });

      } catch (err: any) {
        setErrorMsg(err.message || "Failed to initialize P2P transfer");
        setStatus("error");
      }
    }
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
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-140px)] w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white text-black p-8 sm:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-bl-full -z-0"></div>
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <h2 className="text-4xl font-black uppercase tracking-tighter">Share<span className="text-black/30">File</span></h2>
          <div className="text-xs font-bold bg-black text-white px-3 py-1 uppercase tracking-widest light-theme-invert">
            Zero limits
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
                      <p className="font-bold text-lg">{file.name}</p>
                      <p className="text-sm font-medium text-black/50">{(file.size / (1024*1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-black/50">
                    <Upload className="w-12 h-12" />
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
              <div className="w-full flex justify-between font-bold uppercase tracking-widest text-xs mb-4">
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
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Awaiting Receiver</h3>
              <p className="text-black/60 font-medium max-w-sm mx-auto mb-8">
                Send this secure code or link to the receiver. The file will stream directly from your browser once they connect.
              </p>

              <div className="bg-black/5 px-8 py-6 flex items-center justify-center mb-6 w-full max-w-sm">
                <span className="text-5xl font-black tracking-widest">{shareCode}</span>
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
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">
                {mode === "server" ? "Upload Complete" : "Transfer Complete"}
              </h3>
              
              {mode === "server" && (
                <>
                  <p className="text-black/60 font-medium text-center max-w-md mx-auto mb-8">
                    Your file is now securely stored at the edge. The link will automatically expire in 24 hours.
                  </p>
                  
                  <div className="bg-black/5 px-8 py-6 flex items-center justify-center mb-6 w-full max-w-sm">
                    <span className="text-5xl font-black tracking-widest">{shareCode}</span>
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
                className="mt-10 font-bold uppercase tracking-widest text-sm border-b-2 border-black pb-1 hover:text-black/50 hover:border-black/50 transition-colors"
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
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Transfer Failed</h3>
              <p className="text-black/60 font-medium mb-8 max-w-sm">{errorMsg}</p>
              <button 
                onClick={reset}
                className="font-bold uppercase tracking-widest text-sm border-b-2 border-black pb-1 hover:text-black/50 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
