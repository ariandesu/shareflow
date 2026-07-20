import React, { useState } from "react";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { SEOContent } from "../components/SEOContent";

export default function JWTDecoder() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState("");

  const decodeToken = (input: string) => {
    setToken(input);
    if (!input) {
      setHeader("");
      setPayload("");
      setError("");
      return;
    }

    try {
      // jwt-decode library only decodes the payload by default
      const decodedPayload = jwtDecode(input);
      setPayload(JSON.stringify(decodedPayload, null, 2));

      // Decode header manually
      const base64urlToBase64 = (s: string) => s.replace(/-/g, "+").replace(/_/g, "/");
      const headerBase64 = input.split('.')[0];
      if (headerBase64) {
        const decodedHeader = JSON.parse(atob(base64urlToBase64(headerBase64)));
        setHeader(JSON.stringify(decodedHeader, null, 2));
      }
      
      setError("");
    } catch (err) {
      setError("Invalid JWT Token");
      setHeader("");
      setPayload("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">JWT Decoder</h1>
        <p className="text-white/50 text-sm">Decode JSON Web Tokens without verification.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1"
      >
        <div className="space-y-4 flex flex-col">
          <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Encoded Token</label>
          <textarea
            value={token}
            onChange={(e) => decodeToken(e.target.value)}
            placeholder="Paste JWT here..."
            className="flex-1 min-h-[400px] w-full p-4 bg-[#0A0A0A] border border-white/10 focus:border-white/30 outline-none resize-none font-mono text-sm text-white/80 placeholder:text-white/20 break-all"
          />
          {error && <p className="text-red-400 font-bold uppercase tracking-widest text-xs">{error}</p>}
        </div>

        <div className="space-y-6 flex flex-col">
          <div className="space-y-4 flex-1 flex flex-col">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Header (Algorithm & Token Type)</label>
            <div className="flex-1 bg-[#0A0A0A] border border-white/10 p-4 overflow-auto min-h-[150px]">
              <pre className="text-purple-400 font-mono text-sm whitespace-pre-wrap">{header}</pre>
            </div>
          </div>
          <div className="space-y-4 flex-1 flex flex-col">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Payload (Data)</label>
            <div className="flex-1 bg-[#0A0A0A] border border-white/10 p-4 overflow-auto min-h-[250px]">
              <pre className="text-blue-400 font-mono text-sm whitespace-pre-wrap">{payload}</pre>
            </div>
          </div>
        </div>
      </motion.div>
    
      <SEOContent 
        title="JWT Decoder"
        description="Decode JSON Web Tokens (JWT) online. View the header and payload of your JWT without sending data to a server."
        steps={[{"title":"Paste JWT","description":"Paste your encoded JSON Web Token into the input field."},{"title":"View Header & Payload","description":"The tool automatically decodes the base64url-encoded parts and formats them as readable JSON."},{"title":"Check for errors","description":"If the token is malformed, an error message will guide you."}]}
        faqs={[{"question":"Does this tool verify the JWT signature?","answer":"No, this tool only decodes the token so you can read its contents. It does not verify the signature to check if the token is valid or tampered with."},{"question":"Is my JWT sent to a server?","answer":"Absolutely not. Decoding is performed entirely on the client-side, ensuring your sensitive token data never leaves your browser."},{"question":"What is a JWT?","answer":"A JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties, commonly used for authentication."}]}
      />
    </div>
  );
}
