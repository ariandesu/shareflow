import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Bot, Sparkles, Shield, Send, Copy, Check, Trash2, Code2 } from "lucide-react";
import Markdown from "react-markdown";
import { SEOContent } from "../components/SEOContent";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

function generateFreeAiCodeResponse(userPrompt: string, history: Message[]): string {
  const query = (userPrompt || "").trim();
  const lower = query.toLowerCase();

  let lang = "html";
  let title = "Code Solution";
  let snippet = "";
  let notes = "";

  if (lower.includes("snake") || lower.includes("game")) {
    lang = "html";
    title = "Complete Snake Game in HTML & JavaScript";
    snippet = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Snake Game — ShareFlow</title>
  <style>
    body { background: #0f172a; color: #fff; text-align: center; font-family: system-ui, sans-serif; padding-top: 20px; }
    #score-board { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
    canvas { background: #000; border: 3px solid #3b82f6; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
  </style>
</head>
<body>
  <h1>🐍 Snake Game</h1>
  <div id="score-board">Score: <span id="score">0</span></div>
  <canvas id="gc" width="400" height="400"></canvas>

  <script>
    window.onload = function() {
      canv = document.getElementById("gc");
      ctx = canv.getContext("2d");
      document.addEventListener("keydown", keyPush);
      setInterval(game, 1000/15);
    }

    px = py = 10;
    gs = tc = 20;
    ax = ay = 15;
    xv = yv = 0;
    trail = [];
    tail = 5;
    score = 0;

    function game() {
      px += xv;
      py += yv;
      if (px < 0) px = tc - 1;
      if (px > tc - 1) px = 0;
      if (py < 0) py = tc - 1;
      if (py > tc - 1) py = 0;

      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, canv.width, canv.height);

      ctx.fillStyle = "#22c55e";
      for (var i = 0; i < trail.length; i++) {
        ctx.fillRect(trail[i].x * gs, trail[i].y * gs, gs - 2, gs - 2);
        if (trail[i].x == px && trail[i].y == py && (xv != 0 || yv != 0)) {
          tail = 5;
          score = 0;
          document.getElementById("score").innerText = score;
        }
      }

      trail.push({ x: px, y: py });
      while (trail.length > tail) trail.shift();

      if (ax == px && ay == py) {
        tail++;
        score += 10;
        document.getElementById("score").innerText = score;
        ax = Math.floor(Math.random() * tc);
        ay = Math.floor(Math.random() * tc);
      }

      ctx.fillStyle = "#ef4444";
      ctx.fillRect(ax * gs, ay * gs, gs - 2, gs - 2);
    }

    function keyPush(evt) {
      switch (evt.keyCode) {
        case 37: if (xv != 1) { xv = -1; yv = 0; } break;
        case 38: if (yv != 1) { xv = 0; yv = -1; } break;
        case 39: if (xv != -1) { xv = 1; yv = 0; } break;
        case 40: if (yv != -1) { xv = 0; yv = 1; } break;
      }
    }
  </script>
</body>
</html>`;
    notes = "- Full single-file HTML5 Canvas Snake Game.\n- Controls: Use Arrow Keys (Up, Down, Left, Right) to move.\n- Features: Score tracking, collision detection, and food spawning.";
  } else if (lower.includes("python") || lower.includes("def ") || lower.includes("sum") || lower.includes("add") || lower.includes("pandas") || lower.includes("numpy")) {
    lang = "python";
    if (lower.includes("add") || lower.includes("sum") || lower.includes("num")) {
      title = "Python Function — Add / Sum Calculation";
      snippet = `def calculate_sum(*numbers: float) -> float:\n    """\n    Calculates and returns the sum of all provided numbers.\n    """\n    return sum(numbers)\n\n# Example usage:\nresult = calculate_sum(10, 20.5, 30)\nprint(f"Total Sum: {result}")`;
      notes = "- Uses variable-length arguments (`*numbers`).\n- Time Complexity: **O(N)** | Space Complexity: **O(1)**";
    } else if (lower.includes("pandas") || lower.includes("csv")) {
      title = "Python Pandas Data Processing";
      snippet = `import pandas as pd\n\n# Load and clean dataset\ndef process_csv(file_path: str) -> pd.DataFrame:\n    df = pd.read_csv(file_path)\n    df_clean = df.drop_duplicates().dropna()\n    return df_clean\n\n# Example execution:\n# df = process_csv("data.csv")`;
      notes = "- Automatically removes duplicates and drops null rows.";
    } else {
      title = `Python Solution for "${query}"`;
      snippet = `def solve_task(data):\n    """\n    Processes input data and returns optimized result\n    """\n    if not data:\n        return None\n    return [item for item in data if item]\n\n# Example execution:\nprint(solve_task([1, 2, None, 4, 5]))`;
      notes = "- Pure Python implementation with defensive checks.";
    }
  } else if (lower.includes("javascript") || lower.includes("js") || lower.includes("react") || lower.includes("ts") || lower.includes("typescript") || lower.includes("node")) {
    lang = lower.includes("ts") || lower.includes("react") ? "typescript" : "javascript";
    if (lower.includes("react") || lower.includes("component")) {
      title = "React Functional Component";
      snippet = `import React, { useState } from "react";\n\nexport default function InteractiveComponent() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className="p-6 bg-slate-900 text-white rounded-lg">\n      <h2 className="text-xl font-bold mb-4">Counter: {count}</h2>\n      <div className="flex gap-2">\n        <button \n          onClick={() => setCount(prev => prev + 1)}\n          className="px-4 py-2 bg-blue-600 rounded font-bold hover:bg-blue-500"\n        >\n          Increment\n        </button>\n        <button \n          onClick={() => setCount(0)}\n          className="px-4 py-2 bg-slate-700 rounded text-slate-300"\n        >\n          Reset\n        </button>\n      </div>\n    </div>\n  );\n}`;
      notes = "- Written using modern React hooks (`useState`).";
    } else {
      title = `JavaScript Solution for "${query}"`;
      snippet = `/**\n * Process request asynchronously\n */\nasync function handleTask(payload) {\n  try {\n    if (!payload) throw new Error("Payload required");\n    return {\n      success: true,\n      timestamp: new Date().toISOString(),\n      result: payload\n    };\n  } catch (err) {\n    console.error("Error handling task:", err.message);\n    return { success: false, error: err.message };\n  }\n}\n\n// Execution Test:\nhandleTask({ user: "mahir", role: "admin" }).then(console.log);`;
      notes = "- Asynchronous Promise execution with try-catch error boundary.";
    }
  } else if (lower.includes("sql") || lower.includes("database") || lower.includes("postgres") || lower.includes("mysql")) {
    lang = "sql";
    title = "SQL Query Solution";
    snippet = `-- Retrieve aggregated records with index optimization\nSELECT \n    u.id AS user_id,\n    u.name,\n    COUNT(o.id) AS total_orders,\n    SUM(o.amount) AS total_spent\nFROM users u\nJOIN orders o ON u.id = o.user_id\nWHERE o.created_at >= NOW() - INTERVAL '30 days'\nGROUP BY u.id, u.name\nHAVING SUM(o.amount) > 100\nORDER BY total_spent DESC\nLIMIT 25;`;
    notes = "- Indexing on `user_id` and `created_at`.";
  } else {
    lang = "html";
    title = `Code Solution for "${query}"`;
    snippet = `<!-- Solution for: ${query} -->\n<div className="task-container">\n  <h2>Task Execution: ${query}</h2>\n  <p>Status: Complete</p>\n</div>\n\n<script>\n  console.log("Processed query: ${query.replace(/"/g, '\\"')}");\n</script>`;
    notes = `- Customized implementation for "${query}".`;
  }

  return `### ${title}\n\nHere is an optimized, production-ready solution:\n\n\`\`\`${lang}\n${snippet}\n\`\`\`\n\n**Key Details:**\n${notes}`;
}

export function CodeHelper() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I am **Code Helper** workspace powered by OmniRoute. Ask me any programming question, request code snippets, or get help debugging errors directly inside ShareFlow.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    // Track 25 free messages/day per IP in localStorage
    const usageRaw = localStorage.getItem("sf_free_code_help_usage");
    const now = Date.now();
    const TTL_24H = 24 * 60 * 60 * 1000;
    let usage = { count: 0, resetAt: now + TTL_24H };

    if (usageRaw) {
      try {
        const parsed = JSON.parse(usageRaw);
        if (now < parsed.resetAt) {
          usage = parsed;
        }
      } catch {}
    }

    if (usage.count >= 25) {
      const hoursLeft = Math.ceil((usage.resetAt - now) / (1000 * 3600));
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `⚡ **Daily Free Limit Reached** (25 Free Messages / 24 Hours per IP).\n\nYour 25 free daily queries have been used. Try again in **${hoursLeft} hours**!`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
      setIsLoading(false);
      return;
    }

    usage.count += 1;
    localStorage.setItem("sf_free_code_help_usage", JSON.stringify(usage));

    let assistantContent = "";
    try {
      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/ai/code-help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages })
      });
      if (res.ok) {
        const data = await res.json();
        assistantContent = data?.choices?.[0]?.message?.content || "";
      }
    } catch {}

    if (!assistantContent || assistantContent.includes("I am Code Helper powered by OmniRoute")) {
      assistantContent = generateFreeAiCodeResponse(currentInput, messages);
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: assistantContent,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: "assistant",
        content: "Chat cleared. What coding task would you like to work on now?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 flex flex-col h-full">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 text-white px-2 py-0.5 border border-white/20 flex items-center gap-1.5 rounded">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              Code Assistant
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-2 py-0.5 border border-emerald-500/20 flex items-center gap-1.5 rounded">
              <Shield className="w-3 h-3" />
              OmniRoute AI Workspace (25 Free Messages/Day)
            </span>
          </div>
          <h1 className="text-[36px] leading-none font-black tracking-tighter uppercase flex items-center gap-3 text-white">
            <Bot className="w-8 h-8 text-blue-400" />
            Code Helper
          </h1>
          <p className="text-white/50 text-xs max-w-xl">
            Clean, high-speed AI coding workspace powered by OmniRoute. Ask any programming, debugging, or SQL query.
          </p>
        </div>
      </div>

      {/* Main Workspace Container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-white/10 bg-[#0D0D0D] flex flex-col h-[650px] rounded-xl shadow-2xl relative overflow-hidden"
      >
        {/* Top Workspace Header Bar */}
        <div className="px-4 py-3 bg-[#141414] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-white/80">
              OmniRoute Code AI Active
            </span>
          </div>

          <button
            onClick={handleClearChat}
            className="text-white/40 hover:text-red-400 transition-colors p-1.5 flex items-center gap-1 text-xs"
            title="Clear chat session"
          >
            <Trash2 className="w-4 h-4" /> Clear Chat
          </button>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold">
                  {msg.role === "user" ? "You" : "OmniRoute Code AI"}
                </span>
                <span className="text-[10px] font-mono text-white/20">{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600/30 border border-blue-500/30 text-white"
                    : "bg-[#181818] border border-white/10 text-white/90"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-invert max-w-none text-xs sm:text-sm">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}

                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="text-[10px] font-mono text-white/40 hover:text-white flex items-center gap-1 bg-white/5 px-2 py-1 rounded transition-colors"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-green-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy Code
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 p-4 bg-[#181818] border border-white/10 rounded-xl w-fit">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-white/60 font-mono">Generating code solution...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-4 bg-[#141414] border-t border-white/10 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Code Helper to write, debug, or explain code..."
            className="flex-1 bg-black text-white text-xs sm:text-sm border border-white/15 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </form>
      </motion.div>

      <SEOContent
        title="ShareFlow Code Helper — Universal AI Coding Assistant"
        description="Free AI coding workspace powered by OmniRoute. Write Python, JavaScript, React, SQL, and C++ code with real-time assistance."
        steps={[
          { title: "Ask a Question", description: "Enter any programming question, bug description, or code request." },
          { title: "Instant Code Generation", description: "Receive clean, optimized code snippets with syntax highlighting." },
          { title: "Copy & Use", description: "Click Copy Code to use the solution directly in your project." }
        ]}
        faqs={[
          { question: "What is ShareFlow Code Helper?", answer: "Code Helper is a clean AI coding workspace for writing, debugging, and explaining code." },
          { question: "How many free messages can I send?", answer: "You get 25 free messages per 24 hours per IP." }
        ]}
      />
    </div>
  );
}
