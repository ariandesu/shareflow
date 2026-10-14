import React from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Flame } from "lucide-react";
import { pipeFileToP2P, pipeTextToSecret } from "../utils/p2pPiping";

interface PipeFileToP2PButtonProps {
  file: File | Blob | null | undefined;
  filename?: string;
  className?: string;
  label?: string;
}

export function PipeFileToP2PButton({
  file,
  filename = "shareflow-result.bin",
  className = "",
  label = "⚡ Pipe Result Directly to Peer (P2P)",
}: PipeFileToP2PButtonProps) {
  const navigate = useNavigate();

  if (!file) return null;

  return (
    <button
      type="button"
      onClick={() => pipeFileToP2P(file, filename, navigate)}
      className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs bg-[#0071e3]/10 hover:bg-[#0071e3]/20 text-[#0071e3] dark:text-[#38bdf8] border border-[#0071e3]/25 transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${className}`}
      title="Send this file directly browser-to-browser via WebRTC with zero cloud upload"
    >
      <Zap className="w-4 h-4 shrink-0 text-[#0071e3] dark:text-[#38bdf8]" />
      <span>{label}</span>
    </button>
  );
}

interface ShareSecretButtonProps {
  text: string;
  className?: string;
  label?: string;
}

export function ShareSecretButton({
  text,
  className = "",
  label = "🔥 Share as Self-Destructing Secret",
}: ShareSecretButtonProps) {
  const navigate = useNavigate();

  if (!text || text.trim().length === 0) return null;

  return (
    <button
      type="button"
      onClick={() => pipeTextToSecret(text, navigate)}
      className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/25 transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${className}`}
      title="Store this secret as an ephemeral, self-destructing zero-knowledge note"
    >
      <Flame className="w-4 h-4 shrink-0 text-amber-500" />
      <span>{label}</span>
    </button>
  );
}
