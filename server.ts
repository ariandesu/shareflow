import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import crypto from "crypto";
import multer from "multer";

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

const upload = multer({ storage: multer.memoryStorage() });

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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

    res.json({ code, url: `${req.protocol}://${req.get("host")}/t/${code}` });
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
