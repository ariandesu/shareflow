import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import crypto from "crypto";

// Simple in-memory store for text snippets
// In production, this would be Supabase or Redis
interface TextSnippet {
  id: string;
  text: string;
  createdAt: number;
  views: number;
}
const textStore = new Map<string, TextSnippet>();

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/text", (req, res) => {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required" });
    }

    // Generate a unique 4-character Base62 code
    let code = generateBase62Code(4);
    while (textStore.has(code)) {
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

    // Increment views
    snippet.views += 1;
    textStore.set(code, snippet);

    res.json(snippet);
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
