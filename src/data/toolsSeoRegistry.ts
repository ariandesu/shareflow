/**
 * Programmatic Technical SEO Registry for ShareFlow 40+ Utilities
 *
 * Provides indexable metadata, JSON-LD structured schemas, how-it-works instructions,
 * client-side privacy superiority claims, and high-intent FAQs.
 */

export interface ToolSeoData {
  slug: string;
  legacyPath?: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  category: "dev" | "pdf" | "media" | "security" | "math";
  keywords: string[];
  howItWorksSteps: { title: string; description: string }[];
  privacyAdvantage: string;
  faq: { question: string; answer: string }[];
}

export const TOOLS_SEO_REGISTRY: Record<string, ToolSeoData> = {
  "json-formatter": {
    slug: "json-formatter",
    legacyPath: "/json-formatter",
    title: "JSON Formatter & Validator",
    metaTitle: "Free In-Browser JSON Formatter & Validator (No Server Upload) | ShareFlow",
    metaDescription: "Format, validate, syntax highlight, and minify JSON entirely in your browser. 100% client-side zero-knowledge execution with zero network payload.",
    h1: "Client-Side JSON Formatter & Validator",
    category: "dev",
    keywords: ["json formatter", "format json online", "json validator offline", "client side json formatter", "json beautifier in browser"],
    howItWorksSteps: [
      { title: "Paste Raw JSON", description: "Paste minified, unformatted, or nested JSON into the editor." },
      { title: "Configure Indentation", description: "Select 2-space or 4-space indentation for clean code alignment." },
      { title: "Copy or Share", description: "Copy the formatted JSON or pipe it into an encrypted self-destructing secret." }
    ],
    privacyAdvantage: "Unlike traditional online JSON formatters that transmit your internal API responses, database dumps, and sensitive secrets to remote web servers, ShareFlow parses JSON strictly in your browser's V8 engine. Zero bytes ever leave your device.",
    faq: [
      { question: "Is my JSON data uploaded to any server?", answer: "No. The formatting is performed 100% locally using standard browser JavaScript APIs. You can verify 0 outbound requests in your browser Network tab." },
      { question: "Can it handle invalid JSON?", answer: "Yes. The validator highlights the exact line and character position where syntax errors or unescaped characters occur." },
      { question: "Can I share formatted JSON securely?", answer: "Yes. Click 'Share as Self-Destructing Secret' to encrypt it client-side with AES-256 and generate an expiring link." }
    ]
  },
  "json-to-typescript": {
    slug: "json-to-typescript",
    legacyPath: "/json-to-typescript",
    title: "JSON to TypeScript Interface Converter",
    metaTitle: "JSON to TypeScript Interface Generator (Instant & Offline) | ShareFlow",
    metaDescription: "Convert nested JSON objects into strongly-typed TypeScript interfaces and types in-browser. Zero server transmission.",
    h1: "Convert JSON to TypeScript Interfaces Online",
    category: "dev",
    keywords: ["json to typescript", "generate ts interfaces from json", "json to ts type generator", "offline json to typescript"],
    howItWorksSteps: [
      { title: "Input JSON Object", description: "Paste any valid JSON data or API payload." },
      { title: "Automatic Type Inference", description: "The generator inspects primitive types, arrays, optionals, and nested child objects." },
      { title: "Export Clean TS Code", description: "Copy production-ready TypeScript definitions with accurate union and nested interface types." }
    ],
    privacyAdvantage: "Your proprietary backend schema and sensitive database model keys remain completely confidential inside your browser memory.",
    faq: [
      { question: "Does it support nested objects?", answer: "Yes, nested JSON objects are automatically broken down into cleanly named separate interfaces." },
      { question: "Can it run offline?", answer: "Yes, once loaded, type inference executes completely offline with zero network connectivity." },
      { question: "Does it handle optional properties?", answer: "Array elements and varying object shapes are inferred and mapped to union or optional properties." }
    ]
  },
  "json-to-zod": {
    slug: "json-to-zod",
    legacyPath: "/json-to-zod",
    title: "JSON to Zod Schema Generator",
    metaTitle: "JSON to Zod Schema Generator (TypeScript Safe) | ShareFlow",
    metaDescription: "Generate runtime Zod validation schemas directly from JSON payloads. 100% client-side schema inference.",
    h1: "JSON to Zod Schema Builder",
    category: "dev",
    keywords: ["json to zod", "zod schema generator", "generate zod from json", "runtime zod validator in browser"],
    howItWorksSteps: [
      { title: "Paste JSON Sample", description: "Insert a sample of your expected request or response body." },
      { title: "Generate Zod Schema", description: "Watch z.object(), z.string(), z.number(), and z.array() generate instantly." },
      { title: "Integrate into Code", description: "Copy and paste into your Next.js, Node, or Remix validation layer." }
    ],
    privacyAdvantage: "Schema architectures and API signatures stay private on your local machine without being tracked by third-party developer sites.",
    faq: [
      { question: "What Zod types are supported?", answer: "Supports string, number, boolean, array, object, null, and optional field detection." },
      { question: "Is the output compatible with Zod v3?", answer: "Yes, all generated syntax follows canonical Zod v3 standards." },
      { question: "Is my payload sent to an AI model?", answer: "No, schema generation is deterministic and runs locally in JavaScript without any AI LLM API calls." }
    ]
  },
  "sql-formatter": {
    slug: "sql-formatter",
    legacyPath: "/sql-formatter",
    title: "SQL Formatter & Beautifier",
    metaTitle: "Free In-Browser SQL Formatter & Query Beautifier | ShareFlow",
    metaDescription: "Beautify and indent complex SQL queries for PostgreSQL, MySQL, SQLite, and BigQuery locally in-browser.",
    h1: "Client-Side SQL Query Formatter",
    category: "dev",
    keywords: ["sql formatter", "beautify sql query", "offline sql formatter", "format postgres mysql sqlite"],
    howItWorksSteps: [
      { title: "Paste SQL Query", description: "Paste raw, unformatted, or single-line SQL queries." },
      { title: "Automatic Keyword Formatting", description: "SQL keywords (SELECT, FROM, JOIN, WHERE, GROUP BY) are uppercase-standardized and indented." },
      { title: "Copy Clean SQL", description: "Copy formatted queries directly into your database GUI or migration scripts." }
    ],
    privacyAdvantage: "Database schemas, table names, and query parameters often contain sensitive corporate business logic. ShareFlow processes queries strictly in memory.",
    faq: [
      { question: "What SQL dialects are supported?", answer: "PostgreSQL, MySQL, SQLite, MariaDB, Oracle, and ANSI SQL standards." },
      { question: "Does this execute queries against a database?", answer: "No, this is purely an offline syntax formatting and beautification tool." },
      { question: "Can I format subqueries and CTEs?", answer: "Yes, WITH clauses and nested subqueries are properly indented." }
    ]
  },
  "regex-tester": {
    slug: "regex-tester",
    legacyPath: "/regex-tester",
    title: "Interactive Regular Expression Tester",
    metaTitle: "Client-Side Regex Tester & Pattern Validator | ShareFlow",
    metaDescription: "Test and debug Regular Expressions in real-time with instant match highlighting. 100% in-browser evaluation.",
    h1: "In-Browser Regular Expression Playground",
    category: "dev",
    keywords: ["regex tester", "regular expression validator", "test regex online offline", "regex match highlighter"],
    howItWorksSteps: [
      { title: "Enter Regex Pattern", description: "Type your regular expression and select flags (g, i, m, s)." },
      { title: "Provide Test String", description: "Paste test data or strings to test pattern behavior." },
      { title: "Inspect Capture Groups", description: "Review visual highlights and matched group extractions in real-time." }
    ],
    privacyAdvantage: "Log files and PII test strings containing customer emails or passwords are never sent over the wire.",
    faq: [
      { question: "Which regex engine is used?", answer: "It runs the browser's native ECMAScript RegExp engine with full lookahead and lookbehind support." },
      { question: "Are regex catastrophic backtracking bugs prevented?", answer: "Client-side evaluation isolates thread execution inside the web worker sandbox." },
      { question: "Can I copy the regex pattern directly?", answer: "Yes, 1-click copy copies the sanitized pattern for JavaScript, Python, or Go." }
    ]
  },
  "jwt-decoder": {
    slug: "jwt-decoder",
    legacyPath: "/jwt-decoder",
    title: "JWT Token Decoder & Inspector",
    metaTitle: "Secure Client-Side JWT Token Decoder (Zero Server Upload) | ShareFlow",
    metaDescription: "Inspect and decode JSON Web Token (JWT) headers and claims in your browser. Never leaks authentication bearer tokens to any server.",
    h1: "Offline JWT Token Decoder & Claim Inspector",
    category: "security",
    keywords: ["jwt decoder", "decode jwt token offline", "jwt token inspector", "client side jwt decode", "json web token reader"],
    howItWorksSteps: [
      { title: "Paste Encoded Token", description: "Paste your base64url-encoded Bearer JWT token." },
      { title: "Instant Claim Breakdown", description: "View Header (alg, typ) and Payload claims (sub, exp, iat, roles) formatted as JSON." },
      { title: "Expiration & Timestamps", description: "Verify token validity, expiration time, and human-readable dates." }
    ],
    privacyAdvantage: "Pasting production JWT authentication tokens into third-party sites like jwt.io can leak active sessions and admin access. ShareFlow parses tokens 100% locally with zero network requests.",
    faq: [
      { question: "Is my JWT sent to a remote server?", answer: "Never. The base64url decoding occurs entirely in your browser sandbox. You can verify this in your DevTools Network tab." },
      { question: "Does this tool verify the signature?", answer: "No, signature verification requires your server's secret or public key. This tool is designed to inspect token contents safely without asking for private keys." },
      { question: "Can I share a decoded token securely?", answer: "Yes, use 'Share as Self-Destructing Secret' to transmit the payload with end-to-end encryption." }
    ]
  },
  "password-generator": {
    slug: "password-generator",
    legacyPath: "/password-generator",
    title: "High-Entropy Password Generator",
    metaTitle: "Cryptographic Offline Password Generator | ShareFlow",
    metaDescription: "Generate cryptographically secure random passwords using window.crypto.getRandomValues. 0 network calls.",
    h1: "Cryptographically Secure Password Generator",
    category: "security",
    keywords: ["password generator", "generate secure password", "offline password generator", "random password generator crypto"],
    howItWorksSteps: [
      { title: "Select Length", description: "Choose length between 8 and 128 characters." },
      { title: "Toggle Character Sets", description: "Include uppercase, lowercase, numbers, and symbols." },
      { title: "Copy or Share Secret", description: "Copy password to clipboard or share as an expiring encrypted secret." }
    ],
    privacyAdvantage: "Passwords are generated using the browser's native CSPRNG (Cryptographically Secure Pseudorandom Number Generator) with zero server contact.",
    faq: [
      { question: "How random are the passwords?", answer: "They use window.crypto.getRandomValues(), the gold standard for cryptographic entropy in browsers." },
      { question: "Are my generated passwords logged?", answer: "No. ShareFlow does not log, track, or retain generated strings." },
      { question: "Where should I store my passwords?", answer: "We recommend storing generated credentials in an end-to-end encrypted password vault such as 1Password or Bitwarden." }
    ]
  },
  "hash-generator": {
    slug: "hash-generator",
    legacyPath: "/hash-generator",
    title: "Cryptographic Hash Generator (SHA-256, MD5, SHA-512)",
    metaTitle: "Client-Side Cryptographic Hash Generator (MD5, SHA-256, SHA-512) | ShareFlow",
    metaDescription: "Generate cryptographic hashes instantly in-browser using Web Crypto APIs. Safe for confidential text and credentials.",
    h1: "In-Browser Hash Generator (MD5, SHA-1, SHA-256, SHA-512)",
    category: "security",
    keywords: ["hash generator", "sha256 generator", "md5 generator offline", "sha512 online in browser", "crypto hash tool"],
    howItWorksSteps: [
      { title: "Type Input Text", description: "Enter strings, keys, or data you want to fingerprint." },
      { title: "Instant Hash Calculation", description: "MD5, SHA-1, SHA-256, and SHA-512 are calculated simultaneously." },
      { title: "1-Click Copy", description: "Copy any computed checksum or share it as an encrypted note." }
    ],
    privacyAdvantage: "Your source text is hashed in browser memory. No plain text is ever transmitted over HTTP.",
    faq: [
      { question: "Which algorithm should I use for security?", answer: "SHA-256 or SHA-512 should always be preferred over MD5 or SHA-1 for cryptographic integrity." },
      { question: "Can hashes be reversed?", answer: "Cryptographic hash functions are one-way mathematical functions and cannot be reversed directly." },
      { question: "Is hashing done offline?", answer: "Yes, it runs 100% client-side via JavaScript." }
    ]
  },
  "uuid": {
    slug: "uuid",
    legacyPath: "/uuid",
    title: "UUID v4 Generator",
    metaTitle: "Bulk UUID v4 Generator (RFC 4122) | ShareFlow",
    metaDescription: "Generate RFC 4122 compliant UUID Version 4 identifiers in bulk in your browser using crypto.randomUUID.",
    h1: "Fast In-Browser UUID v4 Generator",
    category: "dev",
    keywords: ["uuid generator", "uuid v4 online", "guid generator", "crypto random uuid", "bulk uuid generator"],
    howItWorksSteps: [
      { title: "Generate Batch", description: "Generate unique identifiers with a single click." },
      { title: "Format Options", description: "Standard hyphenated canonical UUID format." },
      { title: "Copy to Clipboard", description: "Copy single or multiple UUIDs directly to your development clipboard." }
    ],
    privacyAdvantage: "Utilizes native browser crypto.randomUUID() without sending identifiers to external APIs.",
    faq: [
      { question: "Are these UUIDs collision-free?", answer: "Yes, Version 4 UUIDs have 122 bits of entropy, making duplicate collisions mathematically negligible." },
      { question: "Can I generate UUIDs offline?", answer: "Yes, works seamlessly without internet connectivity." },
      { question: "Are they RFC 4122 compliant?", answer: "Yes, fully compliant with the RFC 4122 standard." }
    ]
  },
  "base64": {
    slug: "base64",
    legacyPath: "/base64",
    title: "Base64 Encoder & Decoder",
    metaTitle: "Client-Side Base64 Encoder & Decoder (Files & Strings) | ShareFlow",
    metaDescription: "Encode and decode raw strings, images, and binary files in Base64 locally. 100% client-side.",
    h1: "In-Browser Base64 Encoder and Decoder",
    category: "dev",
    keywords: ["base64 encoder", "base64 decoder", "base64 file converter", "offline base64 tool"],
    howItWorksSteps: [
      { title: "Input Content", description: "Enter text or select a file to encode/decode." },
      { title: "Toggle Mode", description: "Switch between Encode (plain to base64) or Decode (base64 to plain)." },
      { title: "Copy or Save", description: "Export the transformed output string or download the decoded binary file." }
    ],
    privacyAdvantage: "Sensitive authorization strings, Basic auth headers, and image files are converted locally via Uint8Array and atob/btoa without cloud storage.",
    faq: [
      { question: "Can it encode images to Base64 data URIs?", answer: "Yes, you can drop image files to generate data:image/png;base64 strings." },
      { question: "Does it support UTF-8 non-ASCII characters?", answer: "Yes, UTF-8 strings with emojis and international characters are properly handled." },
      { question: "Is there a file size limit?", answer: "Browser memory typically allows files up to 50MB without issues." }
    ]
  },
  "pdf-merger": {
    slug: "pdf-merger",
    legacyPath: "/pdf-merger",
    title: "Client-Side PDF Merger",
    metaTitle: "Merge PDF Files In-Browser (100% Client-Side, No Upload) | ShareFlow",
    metaDescription: "Merge multiple PDF documents into a single file directly in your browser using pdf-lib. Zero bytes uploaded to any cloud server.",
    h1: "Zero-Knowledge PDF Merger: 100% In-Browser",
    category: "pdf",
    keywords: ["pdf merger", "merge pdf online no upload", "client side pdf merge", "offline pdf joiner", "merge pdf privacy"],
    howItWorksSteps: [
      { title: "Select PDF Files", description: "Drag and drop two or more PDF documents into the browser." },
      { title: "Reorder Pages", description: "Reorder files to your desired document sequence." },
      { title: "Merge & Pipe to Peer", description: "Save the merged document or pipe it directly to a peer via WebRTC P2P." }
    ],
    privacyAdvantage: "Sites like ILovePDF and Smallpdf upload your confidential contracts, medical records, and legal briefs to remote cloud servers. ShareFlow merges documents strictly inside your browser's WebAssembly sandbox. Zero bytes ever leave your device.",
    faq: [
      { question: "Are my confidential PDFs uploaded to your servers?", answer: "No. All PDF page copying and serialization is computed locally using pdf-lib inside your browser. No files are uploaded." },
      { question: "Is there a page or file size limit?", answer: "Since processing happens locally, it is limited only by your computer's RAM. Easily merge 500+ page documents." },
      { question: "Can I send the merged PDF directly to someone without uploading?", answer: "Yes! Click 'Pipe Result Directly to Peer (P2P)' to stream the file socket-to-socket over WebRTC." }
    ]
  },
  "pdf-splitter": {
    slug: "pdf-splitter",
    legacyPath: "/pdf-splitter",
    title: "In-Browser PDF Splitter & Page Extractor",
    metaTitle: "Split PDF Pages Locally (Client-Side & Offline) | ShareFlow",
    metaDescription: "Split PDF files into individual pages or custom page ranges directly in your browser. 100% confidential and offline-capable.",
    h1: "Split PDF Documents In Your Browser",
    category: "pdf",
    keywords: ["pdf splitter", "split pdf client side", "extract pdf pages offline", "split pdf no upload"],
    howItWorksSteps: [
      { title: "Upload PDF", description: "Select the PDF file you want to split." },
      { title: "Choose Page Ranges", description: "Specify split intervals, single pages, or custom ranges." },
      { title: "Download Split PDFs", description: "Download each separated PDF file directly." }
    ],
    privacyAdvantage: "Tax forms, contracts, and financial statements stay on your computer. Zero server upload.",
    faq: [
      { question: "Does this require internet access?", answer: "Once the page is loaded, you can disconnect your Wi-Fi and split PDFs entirely offline." },
      { question: "Does it preserve quality and bookmarks?", answer: "Yes, vector fonts, images, and resolution remain 100% lossless." },
      { question: "Can I pipe split pages to P2P?", answer: "Yes, every split result can be piped directly to peers via WebRTC." }
    ]
  },
  "image-compressor": {
    slug: "image-compressor",
    legacyPath: "/image-compressor",
    title: "Lossless & Lossy Image Compressor",
    metaTitle: "Compress JPEG, PNG, WEBP in Browser (No Server Egress) | ShareFlow",
    metaDescription: "Compress images directly in-browser using HTML5 Canvas. Shrink file sizes up to 90% without uploading to cloud servers.",
    h1: "In-Browser Image Compression Tool",
    category: "media",
    keywords: ["image compressor", "compress image online offline", "client side image compressor", "shrink jpg png webp"],
    howItWorksSteps: [
      { title: "Select Image", description: "Upload a JPEG, PNG, or WEBP file from your device." },
      { title: "Adjust Quality Slider", description: "Choose the target compression ratio and visual fidelity." },
      { title: "Download or P2P Pipe", description: "Download the optimized image or pipe it directly to a peer." }
    ],
    privacyAdvantage: "Photos of personal IDs, product sketches, and private media are compressed locally using Canvas 2D context. Zero third-party server exposure.",
    faq: [
      { question: "Are my photos uploaded to any server?", answer: "No. The compression algorithm renders locally onto an in-memory HTML5 Canvas." },
      { question: "What image formats are supported?", answer: "JPEG, PNG, and WEBP formats." },
      { question: "How much file size can I save?", answer: "Typically 60% to 90% file size reduction with virtually no noticeable visual loss." }
    ]
  },
  "exif-remover": {
    slug: "exif-remover",
    legacyPath: "/exif-remover",
    title: "EXIF Metadata & Geolocation Stripper",
    metaTitle: "Strip EXIF Data & GPS Geolocation from Photos (Client-Side) | ShareFlow",
    metaDescription: "Remove embedded GPS coordinates, camera serial numbers, and device metadata from photos before sharing online. 100% in-browser.",
    h1: "Strip Photo EXIF Metadata & Location Tags",
    category: "media",
    keywords: ["exif remover", "strip exif data", "remove gps from photo", "clean image metadata", "photo privacy tool"],
    howItWorksSteps: [
      { title: "Upload Photo", description: "Select any JPEG or PNG image containing metadata." },
      { title: "Automatic Stripping", description: "Canvas sanitization strips camera models, timestamps, and GPS coordinates." },
      { title: "Download Clean Photo", description: "Download the privacy-sanitized image safely or stream it directly via P2P." }
    ],
    privacyAdvantage: "Uploading photos containing home GPS coordinates to external metadata strippers defeats the purpose of privacy. ShareFlow scrubs photos entirely within your browser.",
    faq: [
      { question: "What metadata is removed?", answer: "GPS latitude/longitude, camera model, exposure settings, timestamps, serial numbers, and thumbnail caches." },
      { question: "Does it degrade image quality?", answer: "No, pixel data is preserved at full resolution." },
      { question: "Can I pipe clean images over P2P?", answer: "Yes, click 'Pipe Result Directly to Peer (P2P)' to transfer the sanitized image directly." }
    ]
  },
  "qr-generator": {
    slug: "qr-generator",
    legacyPath: "/qr-generator",
    title: "Vector QR Code Generator",
    metaTitle: "Free In-Browser Vector QR Code Generator (No Tracking) | ShareFlow",
    metaDescription: "Generate high-resolution PNG & vector SVG QR codes with custom colors entirely in-browser. Zero expiration, zero tracking.",
    h1: "Client-Side QR Code Generator",
    category: "security",
    keywords: ["qr generator", "create qr code online", "offline qr generator", "svg qr code", "free qr code generator no expiration"],
    howItWorksSteps: [
      { title: "Enter Content", description: "Type or paste a URL, Wi-Fi credentials, text, or crypto address." },
      { title: "Customize Colors & Size", description: "Select foreground, background colors, and output pixel dimensions." },
      { title: "Download PNG / SVG", description: "Export high-resolution QR codes ready for print or web." }
    ],
    privacyAdvantage: "Many commercial QR generators redirect your scans through tracking URLs that expire or display ads. ShareFlow generates direct static QR codes locally with zero redirects.",
    faq: [
      { question: "Do these QR codes expire?", answer: "Never. They encode the raw destination text directly without any third-party intermediary." },
      { question: "Can I customize the colors?", answer: "Yes, you can configure both the foreground and background colors with real-time preview." },
      { question: "Is the QR code generated on a server?", answer: "No, it is rendered in real-time in your browser using SVG and Canvas." }
    ]
  }
};

/**
 * Helper to fetch SEO data for a tool by slug or legacy path
 */
export function getToolSeoData(slugOrPath: string): ToolSeoData | undefined {
  const clean = slugOrPath.replace(/^\/(tools\/)?/, "").replace(/\/$/, "");
  if (TOOLS_SEO_REGISTRY[clean]) return TOOLS_SEO_REGISTRY[clean];
  
  return Object.values(TOOLS_SEO_REGISTRY).find(
    (t) => t.slug === clean || t.legacyPath?.replace(/^\//, "") === clean
  );
}
