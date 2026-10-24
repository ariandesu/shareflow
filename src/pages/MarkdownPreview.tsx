import React, { useState } from "react";
import { motion } from "motion/react";
import Markdown from "react-markdown";
import { SEOContent } from "../components/SEOContent";

const DEFAULT_MARKDOWN = `# Welcome to ShareFlow Markdown Preview

This is a live editor. Type on the left, and see the results on the right.

## Features

- **Bold** and *italic* text
- Lists (like this one)
- [Links](https://shareflow.app)
- Code blocks:

\`\`\`javascript
function hello() {
  console.log("Hello world!");
}
\`\`\`

> Blockquotes are also supported.

Enjoy writing!
`;

export function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);

  return (
    <div className="max-w-6xl mx-auto space-y-12 flex flex-col h-full">
      <div className="text-left space-y-2">
        <h1 className="text-[40px] leading-none font-bold tracking-tighter uppercase">Markdown Preview</h1>
        <p className="text-white/50 text-sm">Write and preview Markdown in real-time.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-white/10 flex flex-col flex-1"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10 flex-1 min-h-[600px]">
          <div className="flex flex-col bg-[#0A0A0A]">
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/50">Markdown</h2>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="flex-1 w-full p-6 bg-transparent outline-none resize-none font-mono text-sm text-white/80"
              spellCheck={false}
            />
          </div>

          <div className="flex flex-col bg-white text-black">
            <div className="px-6 py-4 border-b border-black/10 flex justify-between items-center">
              <h2 className="text-xs font-bold uppercase tracking-widest text-black/50">Preview</h2>
            </div>
            <div className="flex-1 p-6 overflow-auto max-w-none text-neutral-800 leading-relaxed [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:my-2 [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-blue-600 [&_a]:underline [&_code]:bg-neutral-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm [&_pre]:bg-neutral-900 [&_pre]:text-white [&_pre]:p-4 [&_pre]:rounded-lg [&_blockquote]:border-l-4 [&_blockquote]:border-neutral-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_hr]:my-4">
              <Markdown>{markdown}</Markdown>
            </div>
          </div>
        </div>
      </motion.div>
    
      <SEOContent 
        title="Markdown Preview"
        description="A free online Markdown editor with real-time preview. Write, edit, and visualize your Markdown instantly."
        steps={[{"title":"Write Markdown","description":"Start typing or paste your Markdown content into the left editor panel."},{"title":"Preview changes","description":"Watch the right panel update in real-time with the rendered HTML preview."},{"title":"Export","description":"Once you're satisfied, you can copy the raw markdown or the rendered text."}]}
        faqs={[{"question":"Which Markdown flavor is supported?","answer":"We support standard CommonMark along with GitHub Flavored Markdown (GFM) features like tables and strikethrough."},{"question":"Can I use HTML inside the Markdown?","answer":"Yes, standard HTML tags are supported and will be rendered appropriately in the preview."},{"question":"Is my content saved automatically?","answer":"Currently, the content is kept in memory. If you refresh the page, the content will reset."}]}
      />
    </div>
  );
}
