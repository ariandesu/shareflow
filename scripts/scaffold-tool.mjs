#!/usr/bin/env node
/**
 * Hermes Tool Scaffolder — creates a new ShareFlow tool and registers it.
 * Usage: node scripts/scaffold-tool.mjs MyTool --category=Developer --description="Does X" --icon=Code2
 * Categories: Developer | Image | PDF | Utilities
 */

import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node scripts/scaffold-tool.mjs <ToolName> [--category=Developer] [--description=\"...\"] [--icon=Code2]");
  process.exit(1);
}

const rawName = args[0].replace(/\.tsx$/, "");
const ToolName = rawName[0].toUpperCase() + rawName.slice(1);
const kebab = ToolName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const fileName = `${ToolName}.tsx`;
const filePath = path.join("src/pages", fileName);

// parse opts
const opts = { category: "Developer", description: `Powerful ${ToolName} utility.`, icon: "Code2" };
for (const a of args.slice(1)) {
  if (a.startsWith("--category=")) opts.category = a.split("=")[1];
  if (a.startsWith("--description=")) opts.description = a.split("=")[1].replace(/^["']|["']$/g, "");
  if (a.startsWith("--icon=")) opts.icon = a.split("=")[1];
}

if (fs.existsSync(filePath)) {
  console.error(`File already exists: ${filePath}`);
  process.exit(1);
}

const template = `import { ${opts.icon} } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

export default function ${ToolName}() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <${opts.icon} className="w-7 h-7 text-white" />
          <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 text-white px-2 py-0.5 border border-white/20">${opts.category}</span>
        </div>
        <h1 className="text-[36px] font-black tracking-tighter uppercase">${ToolName}</h1>
        <p className="text-white/50 text-sm mt-2">${opts.description}</p>
      </div>

      <div className="bg-white/5 border border-white/10 p-6 min-h-[300px] flex flex-col items-center justify-center">
        <p className="text-white/40 text-sm">TODO: Implement ${ToolName} logic here.</p>
        <p className="text-white/20 text-xs mt-2">Scaffolded by Hermes — edit src/pages/${fileName}</p>
      </div>

      <SEOContent
        title="${ToolName} — ShareFlow"
        description="${opts.description}"
        steps={[
          { title: "Paste input", description: "Enter your data into the ${ToolName}." },
          { title: "Process", description: "Hermes-powered transformation runs locally in your browser." },
          { title: "Copy result", description: "One-click copy, no server upload." }
        ]}
        faqs={[
          { question: "Is ${ToolName} free?", answer: "Yes — 100% free, no login, runs at the edge." , description: ""},
          { question: "Is data private?", answer: "Yes — processing is client-side.", description: "" }
        ]}
      />
    </div>
  );
}
`;

fs.writeFileSync(filePath, template);
console.log(`✓ Created ${filePath}`);

// Register in App.tsx
const appPath = "src/App.tsx";
let app = fs.readFileSync(appPath, "utf8");
if (!app.includes(`from "./pages/${ToolName}"`)) {
  app = app.replace(
    /import AdminDashboard from ".\/pages\/AdminDashboard";/,
    `import AdminDashboard from "./pages/AdminDashboard";\nimport ${ToolName} from "./pages/${ToolName}";`
  );
  // insert route before dev gateway
  app = app.replace(
    /(\s+){\/\* Developer Gateway \*\/}/,
    `$1<Route path="${kebab}" element={<${ToolName} />} />\n$1{/* Developer Gateway */}`
  );
  fs.writeFileSync(appPath, app);
  console.log(`✓ Registered route /${kebab} in src/App.tsx`);
} else {
  console.log(`→ Route already in App.tsx`);
}

// Register in Home.tsx
const homePath = "src/pages/Home.tsx";
let home = fs.readFileSync(homePath, "utf8");
if (!home.includes(`href: "/${kebab}"`)) {
  // find tools array and inject before Time Now entry (last utils)
  const entry = `  {\n    name: "${ToolName}",\n    category: "${opts.category}",\n    description: "${opts.description}",\n    icon: <${opts.icon} className="w-5 h-5 text-white" />,\n    href: "/${kebab}",\n  },`;
  // inject before the Time Now object
  home = home.replace(
    /(\s+){\s+name: "Time Now"/,
    `${entry}\n$1{\n    name: "Time Now"`
  );
  // ensure icon import
  if (!home.includes(`, ${opts.icon}`) && !home.includes(`${opts.icon} }`)) {
    home = home.replace('} from "lucide-react";', `, ${opts.icon} } from "lucide-react";`);
  }
  fs.writeFileSync(homePath, home);
  console.log(`✓ Registered tile in src/pages/Home.tsx`);
} else {
  console.log(`→ Tile already in Home.tsx`);
}

// Register in Layout.tsx (optional - goes to More Tools overflow)
// We add only if not already present
const layoutPath = "src/components/Layout.tsx";
let layout = fs.readFileSync(layoutPath, "utf8");
if (!layout.includes(`href: "/${kebab}"`)) {
  layout = layout.replace(
    /(\s+){\s+name: "Developer Portal", href: "\/dev" \},/,
    `$1{ name: "${ToolName}", href: "/${kebab}" },\n$1{ name: "Developer Portal", href: "/dev" },`
  );
  fs.writeFileSync(layoutPath, layout);
  console.log(`✓ Registered nav in src/components/Layout.tsx (More Tools)`);
}

console.log(`\nDone. Next: npm run build && git commit & push via Hermes SSH.`);
