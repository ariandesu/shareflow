import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import crypto from "crypto";
import multer from "multer";
import https from "https";

// Simple in-memory store for text snippets
// In production, this would be Supabase or Redis
interface TextSnippet {
  id: string;
  text: string;
  createdAt: number;
  views: number;
}
const textStore = new Map<string, TextSnippet>();

// In-memory stores for file sharing
interface FileRecord {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: number;
}
const fileStore = new Map<string, FileRecord>();

interface P2PSession {
  name: string;
  size: number;
  mimeType: string;
  offer: any;
  answer: any;
  createdAt: number;
}
const p2pSessions = new Map<string, P2PSession>();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Base62 character set
const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function generateBase62Code(length: number): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, BASE62.length);
    code += BASE62[randomIndex];
  }
  return code;
}

function isCodeTaken(code: string): boolean {
  return textStore.has(code) || fileStore.has(code) || p2pSessions.has(code);
}

// Periodic cleanup of expired entries (every 5 minutes)
const TTL = {
  TEXT: 24 * 60 * 60 * 1000,
  FILE: 24 * 60 * 60 * 1000,
  P2P: 10 * 60 * 1000,
};
function evictExpired() {
  const now = Date.now();
  for (const [key, val] of textStore) {
    if (now - val.createdAt > TTL.TEXT) textStore.delete(key);
  }
  for (const [key, val] of fileStore) {
    if (now - val.createdAt > TTL.FILE) fileStore.delete(key);
  }
  for (const [key, val] of p2pSessions) {
    if (now - val.createdAt > TTL.P2P) p2pSessions.delete(key);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  setInterval(evictExpired, 5 * 60 * 1000);

  // Text API Routes
  app.post("/api/text", (req, res) => {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required" });
    }

    let code = generateBase62Code(4);
    while (isCodeTaken(code)) {
      code = generateBase62Code(4);
    }

    const snippet: TextSnippet = {
      id: code,
      text,
      createdAt: Date.now(),
      views: 0,
    };

    textStore.set(code, snippet);

    const host = req.get("host") || "localhost:3000";
    res.json({ code, url: `${req.protocol}://${host}/t/${code}` });
  });

  app.get("/api/text/:code", (req, res) => {
    const { code } = req.params;
    const snippet = textStore.get(code);

    if (!snippet) {
      return res.status(404).json({ error: "Text snippet not found" });
    }

    snippet.views += 1;
    textStore.set(code, snippet);

    res.json(snippet);
  });

  // File API Routes (for local dev — mirrors shareflow-api/src/index.ts)

  // POST /api/file — upload file to server
  app.post("/api/file", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }
    if (req.file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ error: "File must be smaller than 10MB" });
    }

    let code = generateBase62Code(4);
    while (isCodeTaken(code)) {
      code = generateBase62Code(4);
    }

    fileStore.set(code, {
      buffer: req.file.buffer,
      filename: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      createdAt: Date.now(),
    });

    res.json({ code });
  });

  // POST /api/file/p2p — register P2P session
  app.post("/api/file/p2p", (req, res) => {
    const { name, size, mimeType } = req.body;
    if (!name || size === undefined) {
      return res.status(400).json({ error: "Name and size are required" });
    }

    let code = generateBase62Code(4);
    while (isCodeTaken(code)) {
      code = generateBase62Code(4);
    }

    p2pSessions.set(code, {
      name,
      size,
      mimeType: mimeType || "application/octet-stream",
      offer: null,
      answer: null,
      createdAt: Date.now(),
    });

    res.json({ code });
  });

  // POST /api/file/p2p/:code/offer — store SDP offer
  app.post("/api/file/p2p/:code/offer", (req, res) => {
    const { code } = req.params;
    const { offer } = req.body;
    if (!offer) return res.status(400).json({ error: "WebRTC offer is required" });

    const session = p2pSessions.get(code);
    if (!session) return res.status(404).json({ error: "P2P session not found" });

    session.offer = offer;
    res.json({ success: true });
  });

  // POST /api/file/p2p/:code/answer — store SDP answer
  app.post("/api/file/p2p/:code/answer", (req, res) => {
    const { code } = req.params;
    const { answer } = req.body;
    if (!answer) return res.status(400).json({ error: "Answer is required" });

    const session = p2pSessions.get(code);
    if (!session) return res.status(404).json({ error: "P2P session not found" });

    session.answer = answer;
    res.json({ success: true });
  });

  // GET /api/file/p2p/:code/answer — poll for SDP answer
  app.get("/api/file/p2p/:code/answer", (req, res) => {
    const { code } = req.params;
    const session = p2pSessions.get(code);

    if (!session || !session.answer) {
      return res.json({ status: "waiting" });
    }

    res.json({ status: "ready", answer: session.answer });
  });

  // GET /api/file/:code — get file or P2P metadata
  app.get("/api/file/:code", (req, res) => {
    const { code } = req.params;
    const codeStr = String(code);

    const file = fileStore.get(codeStr);
    if (file) {
      return res.json({
        type: "server",
        name: file.filename,
        size: file.size,
        mimeType: file.mimeType,
        createdAt: file.createdAt,
      });
    }

    const session = p2pSessions.get(codeStr);
    if (session) {
      return res.json({
        type: "p2p",
        name: session.name,
        size: session.size,
        mimeType: session.mimeType,
        createdAt: session.createdAt,
        offer: session.offer,
      });
    }

    res.status(404).json({ error: "File not found or expired" });
  });

  // GET /api/file/:code/download — download server-uploaded file
  app.get("/api/file/:code/download", (req, res) => {
    const { code } = req.params;
    const file = fileStore.get(code);

    if (!file) return res.status(404).json({ error: "File not found" });

    const encodedName = encodeURIComponent(file.filename);
    res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodedName}`);
    res.setHeader("Content-Type", file.mimeType);
    res.send(file.buffer);
  });

  // POST /api/ai/models - Fetch available models dynamically for any provider API key
  app.post("/api/ai/models", async (req, res) => {
    const { apiKey, baseUrl } = req.body;
    if (!apiKey) {
      return res.status(400).json({ error: "API key is required to fetch models" });
    }

    try {
      const targetBase = baseUrl || "https://integrate.api.nvidia.com/v1";
      const parsedUrl = new URL(targetBase.endsWith("/models") ? targetBase : `${targetBase.replace(/\/+$/, "")}/models`);

      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: parsedUrl.pathname + parsedUrl.search,
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "User-Agent": "ShareFlow/1.0"
        },
        rejectUnauthorized: false
      };

      const modelReq = https.request(options, (modelRes) => {
        let body = "";
        modelRes.on("data", (chunk) => (body += chunk));
        modelRes.on("end", () => {
          try {
            const parsed = JSON.parse(body);
            res.json(parsed);
          } catch (e) {
            res.status(500).json({ error: "Invalid JSON response from provider models endpoint: " + body });
          }
        });
      });

      modelReq.setTimeout(15000, () => {
        modelReq.destroy();
        res.status(504).json({ error: "Models request timed out after 15 seconds." });
      });

      modelReq.on("error", (err) => {
        if (!res.headersSent) {
          res.status(500).json({ error: err.message || "Failed to fetch models from provider" });
        }
      });

      modelReq.end();
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Invalid provider base URL" });
    }
  });

  // POST /api/qwen/chat - Universal multi-provider AI chat endpoint
  app.post("/api/qwen/chat", async (req, res) => {
    const { messages, apiKey, model, baseUrl } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    try {
      const targetApiKey = apiKey || process.env.NVIDIA_API_KEY || "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";
      const targetModel = model || "deepseek-ai/deepseek-v4-pro";
      const rawBase = baseUrl || "https://integrate.api.nvidia.com/v1";
      const targetUrl = new URL(rawBase.endsWith("/chat/completions") ? rawBase : `${rawBase.replace(/\/+$/, "")}/chat/completions`);

      const payload = JSON.stringify({
        model: targetModel,
        messages,
        temperature: 1,
        top_p: 0.95,
        max_tokens: 8192,
        ...(targetUrl.hostname.includes("nvidia.com") ? { chat_template_kwargs: { thinking: false } } : {})
      });

      const options = {
        hostname: targetUrl.hostname,
        port: targetUrl.port || 443,
        path: targetUrl.pathname + targetUrl.search,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
          "Authorization": `Bearer ${targetApiKey}`,
          "User-Agent": "ShareFlow/1.0"
        },
        rejectUnauthorized: false
      };

      const aiReq = https.request(options, (aiRes) => {
        let body = "";
        aiRes.on("data", (chunk) => (body += chunk));
        aiRes.on("end", () => {
          try {
            const parsed = JSON.parse(body);
            res.json(parsed);
          } catch (e) {
            res.status(500).json({ error: "Invalid JSON response from AI Provider: " + body });
          }
        });
      });

      aiReq.setTimeout(30000, () => {
        aiReq.destroy();
        res.status(504).json({ error: "AI Provider request timed out after 30 seconds. The upstream API may be down or the API key may be expired." });
      });

      aiReq.on("error", (err) => {
        if (!res.headersSent) {
          res.status(500).json({ error: err.message || "Network error connecting to AI Provider" });
        }
      });

      aiReq.write(payload);
      aiReq.end();
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to process chat request" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
