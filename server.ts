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
interface FileEntry {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  size: number;
}
interface FileRecord {
  files: FileEntry[];
  createdAt: number;
}
const fileStore = new Map<string, FileRecord>();

interface P2PFileMeta {
  name: string;
  size: number;
  mimeType: string;
}
interface P2PSession {
  name: string;
  size: number;
  mimeType: string;
  files: P2PFileMeta[];
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

  // POST /api/file — upload file(s) to server
  app.post("/api/file", upload.array("files", 20), (req, res) => {
    const uploaded = (req.files as Express.Multer.File[] | undefined) || [];
    if (uploaded.length === 0) {
      return res.status(400).json({ error: "At least one file is required" });
    }
    for (const f of uploaded) {
      if (f.size > 10 * 1024 * 1024) {
        return res.status(400).json({ error: "Each file must be smaller than 10MB" });
      }
    }

    let code = generateBase62Code(4);
    while (isCodeTaken(code)) {
      code = generateBase62Code(4);
    }

    fileStore.set(code, {
      files: uploaded.map((f) => ({
        buffer: f.buffer,
        filename: f.originalname,
        mimeType: f.mimetype,
        size: f.size,
      })),
      createdAt: Date.now(),
    });

    res.json({ code });
  });

  // POST /api/file/p2p — register P2P session
  app.post("/api/file/p2p", (req, res) => {
    const body = req.body;
    const p2pFiles = Array.isArray(body.files) ? body.files : [];
    const name = body.name || (p2pFiles[0] && p2pFiles[0].name);
    const size = body.size !== undefined
      ? body.size
      : p2pFiles.reduce((sum: number, f: any) => sum + (f.size || 0), 0);
    if (!name || size === undefined) {
      return res.status(400).json({ error: "Name and size are required" });
    }

    let code = generateBase62Code(4);
    while (isCodeTaken(code)) {
      code = generateBase62Code(4);
    }

    const sessionFiles: P2PFileMeta[] = p2pFiles.length > 0
      ? p2pFiles.map((f: any) => ({
          name: f.name,
          size: f.size,
          mimeType: f.mimeType || "application/octet-stream",
        }))
      : [{ name, size, mimeType: body.mimeType || "application/octet-stream" }];

    p2pSessions.set(code, {
      name: name.split(",").slice(0, 2).join(", ") || name,
      size,
      mimeType: body.mimeType || "application/octet-stream",
      files: sessionFiles,
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
        name: file.files.length > 1 ? `${file.files.length} files` : file.files[0].filename,
        size: file.files.reduce((sum, f) => sum + f.size, 0),
        mimeType: file.files[0].mimeType,
        createdAt: file.createdAt,
        files: file.files.map((f) => ({
          name: f.filename,
          size: f.size,
          mimeType: f.mimeType,
        })),
        count: file.files.length,
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
        files: session.files,
        count: session.files.length,
      });
    }

    res.status(404).json({ error: "File not found or expired" });
  });

  // GET /api/file/:code/download/:index — download one server-uploaded file (index optional, defaults to 0)
  app.get("/api/file/:code/download/:index?", (req, res) => {
    const { code, index } = req.params;
    const file = fileStore.get(code);

    if (!file) return res.status(404).json({ error: "File not found" });

    const idx = Math.min(Math.max(parseInt(index || "0", 10) || 0, 0), file.files.length - 1);
    const entry = file.files[idx];

    const encodedName = encodeURIComponent(entry.filename);
    res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodedName}`);
    res.setHeader("Content-Type", entry.mimeType);
    res.send(entry.buffer);
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
