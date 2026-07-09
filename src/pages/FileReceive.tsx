import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Download, File as FileIcon, X, Loader2, Wifi, Check, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Peer, { DataConnection } from "peerjs";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

type FileMetadata = {
  type: "server" | "p2p";
  name: string;
  size: number;
  mimeType: string;
  createdAt: number;
};

export function FileReceive() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  
  const [code, setCode] = useState(id || "");
  const [status, setStatus] = useState<"idle" | "fetching" | "ready" | "receiving" | "success" | "error">("idle");
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  
  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  const receivedBufferRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if (id) {
      fetchMetadata(id);
    }
    return () => {
      if (peerRef.current) peerRef.current.destroy();
    };
  }, [id]);

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
      const res = await fetch(`${API_BASE_URL}/api/file/${fileCode}`);
      if (!res.ok) {
        throw new Error("File not found or expired");
      }
      const data: FileMetadata = await res.json();
      setMetadata(data);
      setStatus("ready");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to fetch file details");
      setStatus("error");
    }
  };

  const handleDownload = async () => {
    if (!metadata) return;

    if (metadata.type === "server") {
      // Server file: trigger direct download
      window.location.href = `${API_BASE_URL}/api/file/${code}/download`;
    } else {
      // P2P file: initiate WebRTC connection
      startP2PDownload();
    }
  };

  const startP2PDownload = () => {
    if (!metadata) return;
    setStatus("receiving");
    setProgress(0);
    setErrorMsg("");

    try {
      const peer = new Peer({ debug: 2 });
      peerRef.current = peer;

      peer.on('open', (id) => {
        console.log('My peer ID is: ' + id);
        // Connect to sender
        const conn = peer.connect(`shareflow-${code}`);
        connRef.current = conn;

        // Pre-allocate buffer
        receivedBufferRef.current = new Uint8Array(metadata.size);

        conn.on('open', () => {
          console.log("Connected to sender");
        });

        conn.on('data', (data: any) => {
          if (data.type === 'metadata') {
            console.log("Receiving:", data.name);
          } else if (data.type === 'chunk') {
            const chunk = new Uint8Array(data.data as ArrayBuffer);
            if (receivedBufferRef.current) {
               receivedBufferRef.current.set(chunk, data.offset);
               setProgress(Math.min(100, Math.round(((data.offset + chunk.length) / metadata.size) * 100)));
            }
          } else if (data.type === 'done') {
            setStatus("success");
            
            // Trigger browser download
            if (receivedBufferRef.current) {
              const blob = new Blob([receivedBufferRef.current], { type: metadata.mimeType });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = metadata.name;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }
          }
        });

        conn.on('close', () => {
          if (status !== "success") {
            setErrorMsg("Sender disconnected before transfer completed.");
            setStatus("error");
          }
        });
      });

      peer.on('error', (err) => {
        setErrorMsg(`Connection error: ${err.message}`);
        setStatus("error");
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to start P2P transfer");
      setStatus("error");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-140px)] w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white text-black p-8 sm:p-12 shadow-2xl relative overflow-hidden"
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
                <div className="flex">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. A1B2"
                    className="flex-1 px-4 py-4 bg-black/5 font-bold uppercase tracking-widest text-lg outline-none focus:bg-black/10 transition-colors placeholder-black/30"
                    maxLength={10}
                    required
                  />
                  <button 
                    type="submit"
                    className="px-6 bg-black text-white hover:bg-black/80 transition-colors light-theme-invert flex items-center justify-center"
                  >
                    <ArrowRight className="w-6 h-6" />
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
              <h3 className="text-2xl font-black text-center break-all mb-2">{metadata.name}</h3>
              <p className="text-sm font-medium text-black/50 uppercase tracking-widest mb-2">
                {(metadata.size / (1024*1024)).toFixed(2)} MB
              </p>
              
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
                <Download className="w-5 h-5" /> Download File
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
              <div className="w-full flex justify-between font-bold uppercase tracking-widest text-xs mb-4">
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
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Download Complete</h3>
              <p className="text-black/60 font-medium text-center mb-8">
                Your file has been successfully received. Check your browser downloads.
              </p>
              <button 
                onClick={() => { setStatus("idle"); setCode(""); navigate("/f"); }}
                className="font-bold uppercase tracking-widest text-sm border-b-2 border-black pb-1 hover:text-black/50 hover:border-black/50 transition-colors"
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
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Error</h3>
              <p className="text-black/60 font-medium mb-8 max-w-sm">{errorMsg}</p>
              <button 
                onClick={() => setStatus("idle")}
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
