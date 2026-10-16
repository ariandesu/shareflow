#!/usr/bin/env python3
"""
Generate 110 Comprehensive AI Website & UI Design Prompts with Real Live HTML Previews
For ShareFlow (shareflow.mhr3d.online) - SupportKori ৳49 Store.
"""

import os
import json
import zipfile
import shutil
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT_DIR / "data"
PUBLIC_DIR = ROOT_DIR / "public"
PREVIEWS_DIR = PUBLIC_DIR / "previews"
DIST_DIR = ROOT_DIR / "dist"

PREVIEWS_DIR.mkdir(parents=True, exist_ok=True)
DIST_DIR.mkdir(parents=True, exist_ok=True)

# 110 Prompt Specifications
ITEMS = [
    # -------------------------------------------------------------
    # 1. LANDING PAGE (22 items)
    # -------------------------------------------------------------
    {
        "id": "bento-dark-ai-saas-landing",
        "title": "Bento Dark AI SaaS Landing Page",
        "category": "Landing Page",
        "targetTool": "v0",
        "description": "High-conversion dark mode SaaS landing page featuring Apple-style bento grids, glowing linear gradients, and interactive feature cards.",
        "tags": ["Bento Grid", "Dark Mode", "SaaS", "Next.js", "Tailwind v4"],
        "features": ["Cupertino glassmorphic header", "Multi-column interactive bento grid", "Live telemetry metric counter", "High-contrast CTA badge"],
        "accent": "#0071e3",
        "sub": "Next-Gen Intelligence Layer"
    },
    {
        "id": "minimalist-editorial-agency-landing",
        "title": "Minimalist Editorial Studio & Agency",
        "category": "Landing Page",
        "targetTool": "Bolt.new",
        "description": "Swiss typographic agency landing page with stark monochrome contrast, large serif headers, and horizontal scroll gallery.",
        "tags": ["Editorial", "Swiss Style", "Agency", "Minimalist"],
        "features": ["Custom serif typographic scale", "Micro-spaced grid system", "Interactive case study accordion", "Minimalist inquiry drawer"],
        "accent": "#18181b",
        "sub": "Design Systems & Digital Architecture"
    },
    {
        "id": "developer-api-platform-landing",
        "title": "Developer API & SDK Platform Landing",
        "category": "Landing Page",
        "targetTool": "Lovable",
        "description": "Stripe-quality developer landing page with live interactive syntax-highlighted code playground, latency benchmarks, and terminal copy widgets.",
        "tags": ["Developer Tool", "API", "Syntax Highlighting", "Stripe Style"],
        "features": ["Tabbed multi-language SDK switcher", "Live response payload inspector", "Interactive curl copy widget", "Zero-latency edge badge"],
        "accent": "#6366f1",
        "sub": "Sub-millisecond Global Edge Compute"
    },
    {
        "id": "autonomous-agent-workforce-hero",
        "title": "Autonomous AI Agent Swarm Landing",
        "category": "Landing Page",
        "targetTool": "v0",
        "description": "Futuristic command-line-meets-luxury landing page for autonomous AI agent orchestration platforms with real-time swarm visualizer.",
        "tags": ["AI Agents", "Autonomous", "Swarm", "Cyberpunk", "Tailwind"],
        "features": ["Simulated live agent terminal feed", "Interactive task delegation graph", "Model routing latency pills", "Floating glass trigger dock"],
        "accent": "#10b981",
        "sub": "Coordinate 100+ Autonomous Workers"
    },
    {
        "id": "high-conversion-b2b-saas-landing",
        "title": "High-Conversion B2B SaaS with ROI Calculator",
        "category": "Landing Page",
        "targetTool": "Cursor",
        "description": "Conversion-engineered B2B enterprise software landing page with live dynamic ROI slider, customer proof logos, and comparison matrix.",
        "tags": ["B2B", "Enterprise", "ROI Calculator", "Conversion"],
        "features": ["Interactive seat-based pricing slider", "Security SOC2 / HIPAA compliance badges", "Enterprise SLA comparison table", "One-click calendar booking"],
        "accent": "#2563eb",
        "sub": "Automate 40 Hours of Manual Operations Weekly"
    },
    {
        "id": "cyberpunk-web3-security-protocol",
        "title": "Zero-Trust Web3 & Security Protocol",
        "category": "Landing Page",
        "targetTool": "v0",
        "description": "Deep obsidian and neon emerald security protocol landing page with live vulnerability scanner simulation and cryptography badges.",
        "tags": ["Security", "Zero-Trust", "Web3", "Cyberpunk", "Dark Mode"],
        "features": ["Live smart-contract audit simulator", "Animated cryptographic key visualizer", "Real-time threat feed pill", "Hardware enclave verification badge"],
        "accent": "#059669",
        "sub": "Mathematical Invariance for Smart Systems"
    },
    {
        "id": "cupertino-clean-cloud-infrastructure",
        "title": "Cupertino Cloud Infrastructure Landing",
        "category": "Landing Page",
        "targetTool": "Claude",
        "description": "Ultra-clean Apple-inspired infrastructure page with frosted glass navigation, smooth typography, and subtle border highlights.",
        "tags": ["Apple Style", "Cupertino", "Infrastructure", "Clean Light/Dark"],
        "features": ["Frosted glass sticky navigation", "Single-point-of-truth status chip", "Multi-region latency map", "Fluid typography scale"],
        "accent": "#0284c7",
        "sub": "Zero-Config Bare Metal Compute"
    },
    {
        "id": "neo-brutalist-creative-tech-studio",
        "title": "Neo-Brutalist Creative Tech Studio",
        "category": "Landing Page",
        "targetTool": "Bolt.new",
        "description": "High-impact neo-brutalist landing page featuring heavy black outlines, stark drop shadows, quirky typography, and high-energy CTAs.",
        "tags": ["Neo-Brutalism", "High Contrast", "Creative Studio", "Bold"],
        "features": ["Hard 4px drop-shadow boxes", "Uppercase monospace headlines", "Marquee ticker tape with live updates", "High-contrast sticker buttons"],
        "accent": "#f59e0b",
        "sub": "We Break Boring Interfaces"
    },
    {
        "id": "ai-video-generative-media-engine",
        "title": "AI Video & Generative Media Engine",
        "category": "Landing Page",
        "targetTool": "v0",
        "description": "Cinematic dark landing page for text-to-video diffusion models with video canvas player preview, frame rate specs, and timeline editor preview.",
        "tags": ["Generative AI", "Video AI", "Cinematic", "Diffusion"],
        "features": ["Cinematic aspect-ratio video frame preview", "Timeline track visualizer", "Prompt-to-render slider comparison", "Resolution & FPS badges"],
        "accent": "#ec4899",
        "sub": "Hollywood Grade 4K Video in Real-Time"
    },
    {
        "id": "enterprise-auth-identity-mesh",
        "title": "Enterprise Auth & Passkey Identity Mesh",
        "category": "Landing Page",
        "targetTool": "Lovable",
        "description": "Modern identity platform landing page featuring interactive biometric FaceID/Passkey simulator, SAML SSO flow, and session manager.",
        "tags": ["Auth", "Passkeys", "Identity", "Enterprise", "OAuth"],
        "features": ["Simulated WebAuthn biometric prompt", "Multi-factor authentication timeline", "Enterprise directory sync badges", "Zero-knowledge encryption spec"],
        "accent": "#8b5cf6",
        "sub": "Passwordless Auth for 10M+ Concurrent Sessions"
    },
    {
        "id": "healthtech-ai-diagnostics-platform",
        "title": "HealthTech AI Diagnostics & Clinical Co-Pilot",
        "category": "Landing Page",
        "targetTool": "Universal",
        "description": "Serene, clinical-grade digital health landing page with reassuring emerald accents, patient telemetry graph, and HIPAA security compliance.",
        "tags": ["HealthTech", "Medical AI", "Clinical", "Accessibility"],
        "features": ["Medical vitals telemetry waveform", "FDA/HIPAA regulatory trust seals", "Clinical trial outcome metrics", "Secure provider portal gateway"],
        "accent": "#0d9488",
        "sub": "Augmenting Clinicians with 99.4% Diagnostic Precision"
    },
    {
        "id": "global-edge-compute-network",
        "title": "Global Edge Compute & CDN Mesh",
        "category": "Landing Page",
        "targetTool": "v0",
        "description": "Data-heavy edge network landing page with interactive 3D globe coordinates, 280+ city point-of-presence list, and ping response test.",
        "tags": ["Edge Compute", "CDN", "Networking", "DevOps"],
        "features": ["Live ping latency tester by city", "Global edge POP node counter", "Sub-10ms packet travel diagram", "BGP Anycast routing infographic"],
        "accent": "#f97316",
        "sub": "Execute Code 5ms from Any Human on Earth"
    },
    {
        "id": "modern-fintech-neobank-landing",
        "title": "Modern Fintech Neo-Bank & Global Debit",
        "category": "Landing Page",
        "targetTool": "Bolt.new",
        "description": "Luxury fintech consumer landing page showcasing frosted metallic debit cards, instant FX conversion rate calculator, and virtual card generator.",
        "tags": ["Fintech", "Banking", "Neobank", "Cards", "FX"],
        "features": ["Interactive 3D-tilt debit card mockup", "Instant multi-currency exchange calculator", "Real-time push transaction simulation", "No-hidden-fee comparison ticker"],
        "accent": "#14b8a6",
        "sub": "Spend in 45 Currencies with Zero FX Markup"
    },
    {
        "id": "ai-code-reviewer-ci-pipeline",
        "title": "AI Code Reviewer & PR Sentinel",
        "category": "Landing Page",
        "targetTool": "Cursor",
        "description": "Developer landing page with GitHub PR diff visualizer, inline security annotation bubbles, and CI pipeline blocker checks.",
        "tags": ["Code Review", "GitHub", "CI/CD", "DevTools"],
        "features": ["Interactive git diff side-by-side view", "Inline AI suggestion accept/reject buttons", "Automated test coverage radar", "Pre-commit hook terminal install"],
        "accent": "#a855f7",
        "sub": "Catch Architecture Flaws Before Merge"
    },
    {
        "id": "serverless-vector-database-landing",
        "title": "Serverless Vector Database & RAG Engine",
        "category": "Landing Page",
        "targetTool": "Lovable",
        "description": "Technical database landing page with vector embedding similarity search visualizer, HNSW indexing benchmarks, and query simulator.",
        "tags": ["Vector DB", "RAG", "Embeddings", "Database", "AI Infra"],
        "features": ["Interactive cosine similarity match tester", "Benchmark comparison vs Pinecone/Milvus", "Python/TypeScript snippet toggle", "One-click cluster provision button"],
        "accent": "#06b6d4",
        "sub": "Search 1 Billion Vectors in Under 12ms"
    },
    {
        "id": "spatial-computing-ar-vision-landing",
        "title": "Spatial Computing & VisionOS Studio",
        "category": "Landing Page",
        "targetTool": "v0",
        "description": "Ethereal translucent landing page inspired by VisionOS with deep glass refraction, floating 3D canvas cards, and depth-sensing controls.",
        "tags": ["Spatial Computing", "VisionOS", "Glassmorphism", "3D"],
        "features": ["Refractive glass floating interface panels", "Eye-tracking gesture indicator", "Spatial audio field visualizer", "Universal USDZ export banner"],
        "accent": "#38bdf8",
        "sub": "Author Immersive Spatial Experiences in React"
    },
    {
        "id": "open-source-community-docs-hero",
        "title": "Open Source Community & Documentation Hero",
        "category": "Landing Page",
        "targetTool": "Claude",
        "description": "Clean, welcoming open-source landing page with live GitHub star counter, contributor avatar wall, and interactive quickstart.",
        "tags": ["Open Source", "Documentation", "Community", "GitHub"],
        "features": ["Live GitHub star & release badge", "Top contributor avatar ring", "One-line npm install command box with copy", "Discord community live member counter"],
        "accent": "#3b82f6",
        "sub": "Trusted by 140,000+ Engineers Worldwide"
    },
    {
        "id": "high-frequency-trading-terminal-landing",
        "title": "High-Frequency Algorithmic Trading Landing",
        "category": "Landing Page",
        "targetTool": "Universal",
        "description": "Ultra-low-latency financial engineering landing page featuring dark trading matrices, nanosecond execution stats, and market depth tape.",
        "tags": ["Trading", "Fintech", "Finance", "Quantitative", "High-Frequency"],
        "features": ["Nanosecond latency benchmark counter", "Live order flow volume chart", "Dark obsidian trading aesthetics", "Direct FPGA co-location indicator"],
        "accent": "#10b981",
        "sub": "Colocated Nanosecond Execution Engines"
    },
    {
        "id": "collaborative-design-tool-landing",
        "title": "Real-Time Multiplayer Design Canvas",
        "category": "Landing Page",
        "targetTool": "Bolt.new",
        "description": "Playful yet precise Figma-like landing page with simulated multiplayer cursors flying across the canvas, layer panels, and commenting widgets.",
        "tags": ["Multiplayer", "Design Tool", "Collaboration", "Canvas"],
        "features": ["Animated multi-user live cursor trails", "Interactive vector pen tool preview", "Nested design token variable viewer", "Instant link-sharing permission pill"],
        "accent": "#f43f5e",
        "sub": "Design, Prototype, and Ship Together in Sync"
    },
    {
        "id": "ai-search-engine-knowledge-graph",
        "title": "AI Search Engine & Semantic Knowledge Graph",
        "category": "Landing Page",
        "targetTool": "v0",
        "description": "Perplexity-style minimalist search landing page with proactive query suggestions, citation card pills, and source tree explorer.",
        "tags": ["AI Search", "Knowledge Graph", "Citations", "Clean UI"],
        "features": ["Centered proactive semantic search bar", "Verified source citation preview badges", "Markdown synthesis answer card", "Knowledge entity node cluster"],
        "accent": "#0284c7",
        "sub": "Answers Grounded in Verifiable Evidence"
    },
    {
        "id": "climate-tech-carbon-offset-saas",
        "title": "ClimateTech Carbon Accounting & ESG Ledger",
        "category": "Landing Page",
        "targetTool": "Lovable",
        "description": "Modern botanical-tech landing page with carbon removal metric tracker, satellite verification proof, and corporate ESG report builder.",
        "tags": ["ClimateTech", "ESG", "Carbon Accounting", "Green"],
        "features": ["Tonnes of CO2 removed ticker", "Satellite verified project photos", "Scope 1-3 audit certification badges", "Automated compliance export drawer"],
        "accent": "#15803d",
        "sub": "Real-Time Enterprise Carbon Accounting"
    },
    {
        "id": "autonomous-robot-fleet-telemetry-landing",
        "title": "Autonomous Fleet Telemetry & Robotics",
        "category": "Landing Page",
        "targetTool": "Universal",
        "description": "Industrial cyber-clean landing page for autonomous drone and robot fleet operations with live battery status, waypoints, and LiDAR mapping.",
        "tags": ["Robotics", "Drones", "Telemetry", "Industrial", "IoT"],
        "features": ["Live LiDAR point cloud preview frame", "Fleet uptime & mission completion rings", "Emergency manual override protocol badge", "Edge ROS2 communication status"],
        "accent": "#eab308",
        "sub": "Mission Control for Terrestrial & Aerial Autonomous Fleets"
    },

    # -------------------------------------------------------------
    # 2. DASHBOARD (22 items)
    # -------------------------------------------------------------
    {
        "id": "dark-glassmorphic-saas-telemetry",
        "title": "Dark Glassmorphic SaaS Telemetry Dashboard",
        "category": "Dashboard",
        "targetTool": "v0",
        "description": "Executive dark-mode analytics console with frosted glass metric cards, live revenue sparklines, and interactive date-range picker.",
        "tags": ["Dashboard", "Analytics", "Telemetry", "Glassmorphism"],
        "features": ["4-stat executive KPI grid", "Gradient fill area revenue chart", "Live customer transaction stream", "Quick export CSV/PDF bar"],
        "accent": "#0071e3",
        "sub": "Executive Revenue & Churn Center"
    },
    {
        "id": "ai-model-finetuning-gpu-cluster",
        "title": "AI Model Training & GPU Cluster Monitor",
        "category": "Dashboard",
        "targetTool": "Cursor",
        "description": "MLOps cluster dashboard monitoring 64x H100 GPU temperatures, memory utilization, training loss curves, and checkpoint saves.",
        "tags": ["MLOps", "GPU", "AI Training", "Cluster", "PyTorch"],
        "features": ["Per-node GPU thermal & VRAM meters", "Real-time validation loss epoch chart", "Checkpoint save trigger button", "Spot instance cost ticker"],
        "accent": "#7c3aed",
        "sub": "Cluster Health: 64/64 Nodes Synchronized"
    },
    {
        "id": "global-payment-fraud-detection",
        "title": "Global Payment Operations & Fraud Sentinel",
        "category": "Dashboard",
        "targetTool": "Bolt.new",
        "description": "High-security financial risk dashboard with live transaction map, risk score radar, automated chargeback disputes, and rule manager.",
        "tags": ["Fintech", "Fraud", "Payments", "Risk", "Security"],
        "features": ["Real-time transaction risk scoring pill", "Geographic fraud cluster map", "One-click card freeze action", "False-positive audit breakdown"],
        "accent": "#dc2626",
        "sub": "34.2k Transactions Analyzed in Last 60s"
    },
    {
        "id": "devops-k8s-pod-latency-monitor",
        "title": "Kubernetes Pod & P99 Latency Monitor",
        "category": "Dashboard",
        "targetTool": "Lovable",
        "description": "Site reliability engineering dashboard featuring Kubernetes namespace selector, P95/P99 latency histograms, and crash-loop alert log.",
        "tags": ["DevOps", "Kubernetes", "SRE", "Observability"],
        "features": ["Pod memory & CPU pressure gauges", "P99 latency histogram vs SLA", "CrashLoopBackOff incident alert list", "Instant pod restart command modal"],
        "accent": "#0284c7",
        "sub": "SLA Compliant: 99.982% Healthy"
    },
    {
        "id": "customer-success-churn-radar",
        "title": "Customer Success & Churn Prediction Radar",
        "category": "Dashboard",
        "targetTool": "v0",
        "description": "B2B customer success dashboard ranking accounts by AI health score, seat expansion probability, and inactive user warnings.",
        "tags": ["Customer Success", "CRM", "SaaS", "Churn"],
        "features": ["Account health score distribution", "Expansion opportunity leader table", "At-risk account warning badges", "Direct Slack nudge integration trigger"],
        "accent": "#10b981",
        "sub": "12 Accounts Flagged for Expansion"
    },
    {
        "id": "realtime-crypto-orderbook-depth",
        "title": "Real-Time Crypto Orderbook & Market Depth",
        "category": "Dashboard",
        "targetTool": "Universal",
        "description": "Professional cryptocurrency trading interface featuring live bid/ask ladder, depth chart visualizer, and recent fill trade ticker.",
        "tags": ["Crypto", "Orderbook", "Trading", "Exchange"],
        "features": ["Bids vs Asks live ladder with cumulative volume", "Interactive depth visualizer", "Spread & 24h high/low metrics", "Fast order entry toggle"],
        "accent": "#f59e0b",
        "sub": "BTC/USDT Spread: 0.01% - Deep Liquidity"
    },
    {
        "id": "autonomous-agent-swarm-activity",
        "title": "Autonomous Agent Swarm Activity Hub",
        "category": "Dashboard",
        "targetTool": "Claude",
        "description": "Interactive command center showing 12 autonomous subagents executing tasks, token consumption rates, and inter-agent message logs.",
        "tags": ["AI Agents", "Swarm", "Automation", "Tokens"],
        "features": ["Live agent status matrix (Idle, Executing, Blocked)", "Token burn rate per subagent", "Live transcript waterfall panel", "Global halt switch"],
        "accent": "#0071e3",
        "sub": "Active Workforce: 12 Agents Deploying Tasks"
    },
    {
        "id": "creator-analytics-revenue-matrix",
        "title": "Creator Multi-Platform Revenue Matrix",
        "category": "Dashboard",
        "targetTool": "Bolt.new",
        "description": "All-in-one creator dashboard tracking earnings across YouTube, SupportKori, Gumroad, and Brand sponsorships with monthly payouts.",
        "tags": ["Creator", "Analytics", "Revenue", "SupportKori"],
        "features": ["Consolidated earnings bar chart", "Platform revenue contribution pie", "Pending payout invoice list", "Top-performing content engagement radar"],
        "accent": "#ec4899",
        "sub": "Total March Earnings: ৳148,250 BDT"
    },
    {
        "id": "healthcare-patient-monitoring-vitals",
        "title": "Clinical ICU Patient Monitoring & Telemetry",
        "category": "Dashboard",
        "targetTool": "Lovable",
        "description": "Medical hospital ward dashboard with continuous ECG waveform simulation, SpO2, heart rate, blood pressure alerts, and nurse call system.",
        "tags": ["Medical", "Healthcare", "Telemetry", "ECG"],
        "features": ["Multi-patient bed status overview grid", "Live simulated rhythm ECG wave", "Abnormal vitals visual alarm banner", "Shift nurse handoff note drawer"],
        "accent": "#059669",
        "sub": "Ward 4B: 18 Beds Active, 0 Critical Alarms"
    },
    {
        "id": "cyber-defense-threat-sentinel",
        "title": "SOC Cyber Defense & Threat Sentinel",
        "category": "Dashboard",
        "targetTool": "v0",
        "description": "Security Operations Center dashboard with interactive attack vector map, SIEM event logs, MITRE ATT&CK coverage, and quarantine actions.",
        "tags": ["Cybersecurity", "SOC", "SIEM", "Threat Intel"],
        "features": ["Real-time brute force & DDoS vector map", "Severity classification log table", "Host quarantine action buttons", "Zero-trust firewall posture summary"],
        "accent": "#ef4444",
        "sub": "Threat Posture: Defcon 3 - Active Ingress Filtering"
    },
    {
        "id": "cloud-cost-finops-ledger",
        "title": "Enterprise Cloud FinOps & AWS Cost Ledger",
        "category": "Dashboard",
        "targetTool": "Cursor",
        "description": "Infrastructure finance dashboard breaking down multi-cloud spend across AWS, GCP, and Cloudflare with idle resource recommendations.",
        "tags": ["FinOps", "AWS", "Cloud Cost", "Enterprise"],
        "features": ["Service-by-service cost trend chart", "Unattached EBS & idle instance waste finder", "Monthly forecasted vs budget gauge", "Cost allocation tag audit table"],
        "accent": "#8b5cf6",
        "sub": "Monthly Savings Identified: $4,820 / mo"
    },
    {
        "id": "multi-channel-logistics-supply-chain",
        "title": "Global Logistics & Freight Fleet Ops",
        "category": "Dashboard",
        "targetTool": "Universal",
        "description": "Supply chain dashboard tracking container vessels, customs clearance delays, port congestion indices, and fuel efficiency rates.",
        "tags": ["Logistics", "Supply Chain", "Maritime", "Fleet"],
        "features": ["Vessel status & ETA tracker", "Port dwell time heat indicators", "Customs clearance milestone checklist", "Container carbon footprint estimator"],
        "accent": "#0284c7",
        "sub": "Fleet Status: 84 Cargo En Route, 2 Delayed"
    },
    {
        "id": "database-performance-slow-query-profiler",
        "title": "PostgreSQL Performance & Slow Query Profiler",
        "category": "Dashboard",
        "targetTool": "v0",
        "description": "Database administrator dashboard with connection pool saturation gauges, cache hit ratio, dead tuple vacuum status, and slow query analyzer.",
        "tags": ["Database", "PostgreSQL", "DBA", "Performance"],
        "features": ["Slow query execution time ranking table", "Connection pooler (PgBouncer) saturation gauge", "Buffer cache hit ratio gauge", "Auto-vacuum progress timeline"],
        "accent": "#3b82f6",
        "sub": "Cache Hit Ratio: 99.4% | Connection Pool: 42/100"
    },
    {
        "id": "hr-global-talent-payroll-hub",
        "title": "Global Remote Team & Payroll Hub",
        "category": "Dashboard",
        "targetTool": "Bolt.new",
        "description": "International remote HR dashboard managing contractor invoices, compliance documents across 30 countries, and automated payroll runs.",
        "tags": ["HR", "Payroll", "Remote Work", "Compliance"],
        "features": ["Global payroll cutoff countdown clock", "Contractor tax document audit checklist", "Time-off approval workflow row", "Country-wise currency breakdown"],
        "accent": "#14b8a6",
        "sub": "Next Payroll Run: In 3 Days (28 Contractors)"
    },
    {
        "id": "api-gateway-traffic-rate-limiter",
        "title": "API Gateway Traffic & Token Bucket Limiter",
        "category": "Dashboard",
        "targetTool": "Lovable",
        "description": "API Gateway control panel tracking incoming requests/sec, 429 rate-limited tenants, token bucket capacity, and route error rates.",
        "tags": ["API Gateway", "Rate Limiting", "Backend", "Traffic"],
        "features": ["Live RPS gauge with burst threshold", "Top rate-limited client API key table", "Endpoint response status distribution (2xx, 4xx, 5xx)", "Token bucket refill speed adjuster"],
        "accent": "#f97316",
        "sub": "Current Traffic: 8,420 Req/Sec | 429 Ratio: 0.12%"
    },
    {
        "id": "incident-response-oncall-matrix",
        "title": "PagerDuty-Style Incident Response Matrix",
        "category": "Dashboard",
        "targetTool": "Universal",
        "description": "High-urgency DevOps incident response console showing active P1/P2 outages, on-call escalation schedules, and war-room bridge links.",
        "tags": ["Incident Response", "On-Call", "DevOps", "War Room"],
        "features": ["Active incident severity cards with timers", "Current on-call engineer badge with phone contact", "Incident status timeline builder", "One-click Slack war room invite button"],
        "accent": "#ef4444",
        "sub": "1 Major Outage Resolved in 14m MTTR"
    },
    {
        "id": "smart-battery-grid-storage-telemetry",
        "title": "Industrial Clean Energy & Grid Battery Storage",
        "category": "Dashboard",
        "targetTool": "v0",
        "description": "Renewable energy microgrid dashboard displaying megawatt solar generation, battery state of charge (SoC), and grid arbitrage margins.",
        "tags": ["Clean Energy", "Battery", "Microgrid", "IoT"],
        "features": ["Battery capacity percentage circular progress", "Solar vs wind vs grid draw wattage chart", "Energy buy/sell price arbitrage indicator", "Inverter thermal efficiency dials"],
        "accent": "#84cc16",
        "sub": "Battery Bank: 88% Charged (4.2 MWh Stored)"
    },
    {
        "id": "music-streaming-royalty-allocation",
        "title": "Independent Record Label & Royalty Hub",
        "category": "Dashboard",
        "targetTool": "Bolt.new",
        "description": "Modern music distribution console analyzing streams across Spotify, Apple Music, and TikTok with split-sheet royalty payouts for artists.",
        "tags": ["Music", "Streaming", "Royalty", "Distribution"],
        "features": ["Monthly stream milestone meter", "Artist split-sheet contract calculator", "Territory streaming heat list", "Direct payout ledger with export"],
        "accent": "#d946ef",
        "sub": "4.2M Streams Distributed Across 24 Artists"
    },
    {
        "id": "autonomous-vehicle-route-battery-ops",
        "title": "Autonomous Taxi Fleet Ops & Tele-operation",
        "category": "Dashboard",
        "targetTool": "Cursor",
        "description": "Waymo-inspired fleet dispatch dashboard monitoring autonomous vehicle locations, passenger wait times, and tele-operation takeovers.",
        "tags": ["Autonomous Vehicles", "Fleet", "Tele-operation", "Mobility"],
        "features": ["Live vehicle status card (Cruising, En Route, Idle)", "Remote operator assist queue", "Passenger satisfaction score meter", "Depot charging schedule timeline"],
        "accent": "#0071e3",
        "sub": "Fleet: 120 AVs Active | 0 Interventions Needed"
    },
    {
        "id": "llm-token-cost-attribution-matrix",
        "title": "Enterprise LLM Token Attribution & Cache Ratio",
        "category": "Dashboard",
        "targetTool": "Claude",
        "description": "AI infrastructure cost console tracking prompt caching efficiency, token consumption across Claude/OpenAI/Gemini, and user ROI.",
        "tags": ["LLM", "Prompt Caching", "Cost Optimization", "AI Infra"],
        "features": ["Cache read vs cache write savings graph", "Model cost breakdown (Sonnet vs Flash vs GPT)", "Per-feature token burn ranking", "Rate limit headroom meter"],
        "accent": "#10b981",
        "sub": "Prompt Cache Hit Rate: 84.2% ($1,240 Saved)"
    },
    {
        "id": "warehouse-drone-inventory-tracker",
        "title": "Automated Warehouse & Drone Inventory Audit",
        "category": "Dashboard",
        "targetTool": "Lovable",
        "description": "Smart logistics warehouse dashboard visualizing automated barcode scanner drones, SKU discrepancy alerts, and shelf utilization.",
        "tags": ["Warehouse", "Robotics", "Inventory", "Automation"],
        "features": ["3D aisle capacity visualization indicator", "Cycle count discrepancy reconciliation list", "Drone battery & flight patrol scheduler", "Fast-moving SKU velocity ranking"],
        "accent": "#f59e0b",
        "sub": "99.94% Inventory Accuracy Across 48,000 SKUs"
    },
    {
        "id": "email-deliverability-spam-sentinel",
        "title": "Transactional Email & SPF/DKIM Deliverability",
        "category": "Dashboard",
        "targetTool": "Universal",
        "description": "Mail server infrastructure dashboard monitoring inbox placement rates, bounce classification, DMARC alignment, and blacklist status.",
        "tags": ["Email", "Deliverability", "DNS", "Infrastructure"],
        "features": ["Inbox vs spam folder placement dial", "SPF, DKIM, and DMARC passing badge indicators", "Spam complaint rate graph vs ISP threshold", "IP warm-up progression gauge"],
        "accent": "#6366f1",
        "sub": "Inbox Placement: 99.2% | DMARC: Strict Enforced"
    },

    # -------------------------------------------------------------
    # 3. MICRO-SAAS (20 items)
    # -------------------------------------------------------------
    {
        "id": "notion-style-ai-knowledge-doc",
        "title": "Notion-Style AI Document & Knowledge Assistant",
        "category": "Micro-SaaS",
        "targetTool": "v0",
        "description": "Block-based modular workspace with slash commands (`/ai`), rich markdown editing, collapsible toggles, and floating toolbar.",
        "tags": ["Micro-SaaS", "Notion Clone", "Editor", "Productivity"],
        "features": ["Slash command trigger modal (`/h1`, `/bullet`, `/ai`)", "Floating text-selection formatting bar", "Collapsible toggle block", "Instant markdown export button"],
        "accent": "#18181b",
        "sub": "Minimalist Canvas for Thinkers"
    },
    {
        "id": "headless-cms-instant-schema-builder",
        "title": "Headless CMS Instant Schema & API Builder",
        "category": "Micro-SaaS",
        "targetTool": "Bolt.new",
        "description": "Visual data modeling tool allowing creators to drag-and-drop fields (text, slug, media) to generate instant REST and GraphQL endpoints.",
        "tags": ["CMS", "Headless", "Schema", "API", "Developer Tool"],
        "features": ["Drag-and-drop schema field designer", "Instant auto-generated curl query snippet", "Field validation rule configurator", "Live mock JSON payload viewer"],
        "accent": "#0071e3",
        "sub": "Define Schema & Get REST Endpoints in 30 Seconds"
    },
    {
        "id": "ai-meeting-notes-action-synthesizer",
        "title": "AI Meeting Notes & Action-Item Synthesizer",
        "category": "Micro-SaaS",
        "targetTool": "Cursor",
        "description": "Automated meeting intelligence tool extracting key decisions, timestamped speaker quotes, and exportable Jira/Linear tasks.",
        "tags": ["Productivity", "Meeting Notes", "Linear", "AI Assistant"],
        "features": ["Executive 3-bullet meeting summary card", "Owner-assigned action items with checkboxes", "Timestamped audio transcript seeker", "One-click push to Linear ticket"],
        "accent": "#8b5cf6",
        "sub": "Turn 45m Audio into 3 Verified Action Items"
    },
    {
        "id": "pdf-ai-chat-legal-clause-scanner",
        "title": "PDF Document Chat & Legal Clause Scanner",
        "category": "Micro-SaaS",
        "targetTool": "Lovable",
        "description": "Document analysis workspace with split-screen PDF preview, conversational search, and automated high-risk clause highlight flags.",
        "tags": ["LegalTech", "PDF Chat", "RAG", "Document AI"],
        "features": ["Split-screen PDF reader and chat panel", "Yellow highlight citation link directly to page", "Risk indicator flag for indemnity clauses", "Plain-English clause summarizer"],
        "accent": "#0d9488",
        "sub": "Scan 80-Page Contracts for Hidden Liabilities"
    },
    {
        "id": "tweet-thread-scheduler-virality-predictor",
        "title": "Social Thread Composer & Virality Predictor",
        "category": "Micro-SaaS",
        "targetTool": "v0",
        "description": "Clean social media publishing studio with thread counter, hook score evaluator, media drag-and-drop, and scheduled time optimizer.",
        "tags": ["Social Media", "Twitter", "Composer", "Analytics"],
        "features": ["Multi-tweet connected thread builder", "AI hook rating meter (1-100)", "Best-time-to-post recommendation pill", "Direct character limit warning indicator"],
        "accent": "#0284c7",
        "sub": "Craft High-Engagement Threads in 3 Minutes"
    },
    {
        "id": "feedback-board-public-roadmap-portal",
        "title": "Customer Feedback Board & Feature Roadmap",
        "category": "Micro-SaaS",
        "targetTool": "Claude",
        "description": "Customer feedback tool with upvoting, categorization (Planned, In Progress, Shipped), and public changelog linkage.",
        "tags": ["Product Management", "Feedback", "Roadmap", "Community"],
        "features": ["Interactive upvote button with counter", "Kanban-style roadmap columns", "Filter by tag (UX, Mobile, Integration)", "Submit idea dialog with character limit"],
        "accent": "#10b981",
        "sub": "Build What Your Users Actually Beg For"
    },
    {
        "id": "changelog-release-feed-generator",
        "title": "Beautiful Product Changelog & Release Feed",
        "category": "Micro-SaaS",
        "targetTool": "Bolt.new",
        "description": "Public-facing changelog feed with version tags, badge pills (New, Improved, Fixed), image embeds, and RSS subscription box.",
        "tags": ["Changelog", "Product", "Updates", "Release Notes"],
        "features": ["Chronological release timeline with dots", "Color-coded changelog badge pills", "Embedded GIF/screenshot preview wrapper", "Subscribe to updates email input box"],
        "accent": "#f43f5e",
        "sub": "Keep Customers Excited About Every Update"
    },
    {
        "id": "uptime-monitor-status-page-broadcaster",
        "title": "Public Status Page & Incident Broadcaster",
        "category": "Micro-SaaS",
        "targetTool": "Lovable",
        "description": "Clean Apple-style status page showing 90-day uptime bars per service, active incident alerts, and subscriber notifications.",
        "tags": ["Status Page", "Uptime", "SRE", "Monitoring"],
        "features": ["All Systems Operational green badge", "90-day interactive hoverable uptime bar", "Component-level breakdown (API, Web, Auth)", "Incident update timeline card"],
        "accent": "#22c55e",
        "sub": "100.0% Uptime Recorded Over Last 90 Days"
    },
    {
        "id": "dynamic-og-image-generator-studio",
        "title": "Dynamic Social OG Image Generator",
        "category": "Micro-SaaS",
        "targetTool": "Universal",
        "description": "Visual tool to create template-based Open Graph social card images via URL parameters with live canvas preview and code snippet.",
        "tags": ["OG Image", "Social Cards", "Developer Tool", "Design"],
        "features": ["Live 1200x630 canvas preview frame", "Editable template variables (Title, Author, Logo)", "Auto-generated `<meta>` tag code block", "One-click copy URL to clipboard"],
        "accent": "#a855f7",
        "sub": "Instant Automated Social Share Cards"
    },
    {
        "id": "screenshot-to-code-instant-playground",
        "title": "Screenshot-to-Code Instant Playground",
        "category": "Micro-SaaS",
        "targetTool": "v0",
        "description": "AI utility web app where developers drop an image or UI wireframe and get clean, responsive Tailwind + React code with live preview.",
        "tags": ["Screenshot to Code", "AI Tool", "Tailwind", "React"],
        "features": ["Drag-and-drop image upload dropzone", "Side-by-side original image vs generated code", "Interactive rendered preview tab", "One-click copy component button"],
        "accent": "#0071e3",
        "sub": "From Image to Production Tailwind in 15s"
    },
    {
        "id": "markdown-docs-api-reference-hub",
        "title": "Minimalist Markdown Documentation Hub",
        "category": "Micro-SaaS",
        "targetTool": "Cursor",
        "description": "Developer documentation site featuring sticky nested sidebar navigation, fast search (Cmd+K), and tabbed code blocks.",
        "tags": ["Documentation", "Docs", "Developer Experience", "Markdown"],
        "features": ["Cmd+K interactive search trigger", "Sticky multi-level table of contents", "Interactive copyable code blocks with language tag", "Previous / Next navigation cards"],
        "accent": "#0284c7",
        "sub": "Documentation That Developers Love to Read"
    },
    {
        "id": "user-onboarding-checklist-tour-modal",
        "title": "Interactive User Onboarding & Progress Checklist",
        "category": "Micro-SaaS",
        "targetTool": "Lovable",
        "description": "In-app onboarding checklist widget tracking user activation milestones, progress bar, reward unlocks, and video walkthroughs.",
        "tags": ["Onboarding", "Growth", "Product Led", "Activation"],
        "features": ["Circular or linear onboarding percentage bar", "Interactive step checklist with completion sound", "Expandable video hint drawer", "Claim onboarding reward badge"],
        "accent": "#eab308",
        "sub": "3 of 5 Steps Complete - Unlock Pro Trial"
    },
    {
        "id": "smart-form-builder-conditional-logic",
        "title": "Typeform-Style Conversational Form Builder",
        "category": "Micro-SaaS",
        "targetTool": "Bolt.new",
        "description": "Single-question-at-a-time conversational form experience with smooth keyboard navigation (Press Enter), progress pill, and conditional jumps.",
        "tags": ["Form Builder", "Conversational", "UX", "Surveys"],
        "features": ["Keyboard-driven question transitions (Enter, Tab)", "Smooth progress bar across question steps", "Multiple-choice select with letter badges (A, B, C)", "Completion thank-you card with confetti"],
        "accent": "#6366f1",
        "sub": "3.5x Higher Completion Rates than Static Forms"
    },
    {
        "id": "digital-invoice-receipt-generator",
        "title": "Clean PDF Invoice & Receipt Generator",
        "category": "Micro-SaaS",
        "targetTool": "v0",
        "description": "Browser-based invoice maker with live paper preview, automatic VAT/tax calculation, currency switcher, and print/PDF export.",
        "tags": ["Invoicing", "Fintech", "Freelancer", "PDF"],
        "features": ["Live A4 printable sheet preview layout", "Dynamic line-item adder with auto-math", "Subtotal, tax percentage, and total ledger", "Download PDF & print direct trigger"],
        "accent": "#0f766e",
        "sub": "Professional Invoices in Under 60 Seconds"
    },
    {
        "id": "prompt-engineering-sandbox-eval",
        "title": "LLM Prompt Engineering Sandbox & Eval Matrix",
        "category": "Micro-SaaS",
        "targetTool": "Universal",
        "description": "Developer utility comparing LLM outputs across models side-by-side with latency, cost, and token metrics for test datasets.",
        "tags": ["Prompt Engineering", "Eval", "LLM", "DevTools"],
        "features": ["Side-by-side dual model comparison panels", "Variable insertion chips (`{{customer_name}}`)", "Token count, latency, and estimated cost tags", "Run evaluation suite across 10 sample inputs"],
        "accent": "#7c3aed",
        "sub": "A/B Test System Instructions with Real Metrics"
    },
    {
        "id": "url-shortener-deep-analytics-qr",
        "title": "Branded Link Shortener & Custom QR Styler",
        "category": "Micro-SaaS",
        "targetTool": "Claude",
        "description": "Modern URL management app with custom domain aliases, password protection, expiry dates, and customizable SVG QR codes.",
        "tags": ["Link Shortener", "QR Code", "Marketing", "Analytics"],
        "features": ["Instant short URL input with domain picker", "Custom branded QR code with logo slot", "Click analytics chart by country and referrer", "UTM parameter builder accordion"],
        "accent": "#2563eb",
        "sub": "Track Every Click with Precision Geo-Analytics"
    },
    {
        "id": "lead-magnet-email-newsletter-gate",
        "title": "High-Converting Lead Magnet & Content Gate",
        "category": "Micro-SaaS",
        "targetTool": "Bolt.new",
        "description": "Interactive content unlock gate requiring email entry before revealing research reports, templates, or download links.",
        "tags": ["Lead Generation", "Email Gate", "Conversion", "Marketing"],
        "features": ["Blurred teaser content behind frosted glass", "Instant single-field email submit box", "Instant download link unlock transition", "No-spam privacy guarantee badge"],
        "accent": "#ea580c",
        "sub": "Unlock the 2026 Developer Salary Report"
    },
    {
        "id": "feature-flag-remote-config-center",
        "title": "Feature Flag & Remote Config Toggle Center",
        "category": "Micro-SaaS",
        "targetTool": "Cursor",
        "description": "Engineering control board to safely rollout beta features by user percentage, environment (Dev, Staging, Prod), and user email lists.",
        "tags": ["Feature Flags", "DevOps", "Config", "CI/CD"],
        "features": ["Instant toggle switch with confirmation modal", "Percentage-based rollout slider (0% to 100%)", "Environment badge selector (Prod, Staging)", "Audit log showing who flipped the flag"],
        "accent": "#16a34a",
        "sub": "Gradual Percentage Rollouts with Zero Downtime"
    },
    {
        "id": "code-snippet-vault-syntax-highlighter",
        "title": "Developer Code Snippet Vault & Gist Storer",
        "category": "Micro-SaaS",
        "targetTool": "Lovable",
        "description": "Personal code vault with tags, language filters, instant search, copy button, and private link sharing for reusable functions.",
        "tags": ["Code Vault", "Snippets", "Developer", "Gist"],
        "features": ["Language syntax highlighting badge", "One-click copy snippet button with animation", "Search by snippet title or tag", "Secret vs public visibility toggle"],
        "accent": "#0071e3",
        "sub": "Your Personal Library of Reusable Utilities"
    },
    {
        "id": "customer-testimonial-wall-embed",
        "title": "Social Proof Testimonial Wall & Widget Embed",
        "category": "Micro-SaaS",
        "targetTool": "v0",
        "description": "Masonry grid of glowing customer tweets, video reviews, and ratings with an embeddable copy-paste script tag.",
        "tags": ["Testimonials", "Social Proof", "Widgets", "Conversion"],
        "features": ["Masonry card grid of real tweets & quotes", "5-star visual rating pills", "Verified customer badge indicators", "Embed script snippet box with 1-click copy"],
        "accent": "#e11d48",
        "sub": "Display 50+ Verified Reviews on Any Website"
    },

    # -------------------------------------------------------------
    # 4. E-COMMERCE (16 items)
    # -------------------------------------------------------------
    {
        "id": "luxury-dark-fashion-watch-showcase",
        "title": "Luxury Dark Horology & Timepiece Showcase",
        "category": "E-Commerce",
        "targetTool": "v0",
        "description": "Ultra-luxury dark ecommerce product page for high-end mechanical watches with sapphire glass specs, 360 viewer, and concierge checkout.",
        "tags": ["Luxury", "E-Commerce", "Watches", "High-End"],
        "features": ["High-contrast dark photography hero", "Technical movement specification grid", "Interactive strap color selector", "White-glove concierge checkout trigger"],
        "accent": "#d4af37",
        "sub": "Swiss Chronometer Movement - Hand-Finished Titanium"
    },
    {
        "id": "cyberpunk-digital-cyber-asset-store",
        "title": "Cyberpunk 3D Assets & Shader Marketplace",
        "category": "E-Commerce",
        "targetTool": "Bolt.new",
        "description": "Dark neon digital asset store selling 3D models, Blender shaders, and sound effects with instant interactive preview and audio audition.",
        "tags": ["Digital Goods", "Marketplace", "Cyberpunk", "3D Models"],
        "features": ["Instant audio waveform audition player", "Polygon count & texture resolution specs", "Interactive software compatibility badges (Blender, Unreal)", "Instant zip bundle purchase checkout"],
        "accent": "#06b6d4",
        "sub": "4K PBR Shaders & Sci-Fi Hard-Surface Assets"
    },
    {
        "id": "artisan-minimalist-coffee-goods",
        "title": "Artisan Single-Origin Coffee & Roastery",
        "category": "E-Commerce",
        "targetTool": "Universal",
        "description": "Earthy, minimalist specialty coffee store with tasting notes sensory radar, altitude & process details, and grind-size selector.",
        "tags": ["Coffee", "Artisan", "Minimalist", "Subscription"],
        "features": ["Sensory tasting notes flavor pills (Jasmine, Bergamot, Honey)", "Grind size selector (Whole Bean, Espresso, Pour Over)", "Bi-weekly subscription cadence toggle", "Farmer direct-trade transparency badge"],
        "accent": "#78350f",
        "sub": "Ethiopian Yirgacheffe - Altitude 2,100m"
    },
    {
        "id": "ergonomic-mechanical-keyboard-customizer",
        "title": "Custom Mechanical Keyboard Configurator",
        "category": "E-Commerce",
        "targetTool": "Lovable",
        "description": "Interactive hardware store page where enthusiasts customize switch type (Linear, Tactile, Clicky), keycap profiles, and listen to typing sound tests.",
        "tags": ["Mechanical Keyboards", "Hardware", "Configurator", "Audio"],
        "features": ["Switch sound audition audio player", "Interactive keycap color previewer", "CNC aluminum case finish selector", "Real-time total price accumulator"],
        "accent": "#6366f1",
        "sub": "Machined Brass Weight & Lubed Switches"
    },
    {
        "id": "digital-audio-sample-pack-vault",
        "title": "Producer Sound Pack & VST Preset Vault",
        "category": "E-Commerce",
        "targetTool": "Claude",
        "description": "Music producer marketplace with in-browser beat audition player, BPM/Key filters, and instant license agreement downloads.",
        "tags": ["Music Production", "Sample Pack", "Audio", "Beats"],
        "features": ["In-browser audio waveform preview player", "BPM and Musical Key badge filters", "Royalty-free commercial license certificate", "Instant multi-format zip download"],
        "accent": "#ec4899",
        "sub": "Analog Synth Loops & 24-Bit Drum Kits"
    },
    {
        "id": "nextgen-sneaker-drop-bid-matrix",
        "title": "Hype Sneaker Release & Live Bid Matrix",
        "category": "E-Commerce",
        "targetTool": "v0",
        "description": "Streetwear sneaker drop page with countdown timer to release, live market price ticker across sizes, and verified authenticity check.",
        "tags": ["Streetwear", "Sneakers", "Drop", "Bidding"],
        "features": ["Live countdown clock to drop", "Size-by-size lowest ask price selector", "100% Verified Authentic guarantee shield", "Instant Buy vs Place Bid action buttons"],
        "accent": "#ef4444",
        "sub": "Limited Run: 500 Pairs Worldwide"
    },
    {
        "id": "sustainable-botanical-plant-shop",
        "title": "Botanical Rare Plant & Terrarium Shop",
        "category": "E-Commerce",
        "targetTool": "Cursor",
        "description": "Lush botanical storefront with sunlight and watering difficulty meters, pet-friendly filters, and ceramic planter color pickers.",
        "tags": ["Plants", "Botanical", "Green", "Sustainable"],
        "features": ["Light requirement & water schedule badges", "Pet-safe certified badge", "Artisan ceramic pot selection chips", "Healthy arrival live plant guarantee"],
        "accent": "#15803d",
        "sub": "Nursery-Grown Rare Variegated Aroids"
    },
    {
        "id": "modern-book-editorial-zine-shelf",
        "title": "Independent Architecture Book & Zine Press",
        "category": "E-Commerce",
        "targetTool": "Bolt.new",
        "description": "Refined typographic bookstore with clothbound hardcover specifications, excerpt reader preview, and limited edition print badges.",
        "tags": ["Books", "Publishing", "Editorial", "Typography"],
        "features": ["Look inside excerpt page flipper preview", "Paper stock & binding specification notes", "Numbered limited edition run indicator", "Hardcover vs Digital PDF selector"],
        "accent": "#1c1917",
        "sub": "Essays on Brutalism and Modern Urbanity"
    },
    {
        "id": "3d-printable-model-stl-marketplace",
        "title": "3D Printable STL & Prop Marketplace",
        "category": "E-Commerce",
        "targetTool": "Lovable",
        "description": "Makers marketplace for 3D printing enthusiasts with slicer print time estimates, material recommendations (PLA/Resin), and community make photos.",
        "tags": ["3D Printing", "Makers", "STL", "Hardware"],
        "features": ["Print time & filament weight estimate cards", "Pre-supported resin & FDM recommendations", "Community test-print photo gallery", "Instant digital file download"],
        "accent": "#f97316",
        "sub": "Pre-Supported & Tested on Bambu Lab / Elegoo"
    },
    {
        "id": "specialty-fragrance-olfactory-notes",
        "title": "Niche Perfumery & Olfactory Notes Showcase",
        "category": "E-Commerce",
        "targetTool": "v0",
        "description": "Sensory fragrance product page featuring Top, Heart, and Base note pyramids, sillage and longevity indicators, and sample discovery set orders.",
        "tags": ["Perfumery", "Luxury", "Fragrance", "Editorial"],
        "features": ["Top, Heart, and Base note pyramid breakdown", "Longevity and Sillage visual meters", "Order 2ml discovery vial option", "Cruelty-free vegan botanical seal"],
        "accent": "#9333ea",
        "sub": "Smoky Oud, Vetiver & Bergamot Extract"
    },
    {
        "id": "gaming-rig-pc-hardware-configurator",
        "title": "Custom Watercooled PC Configurator",
        "category": "E-Commerce",
        "targetTool": "Universal",
        "description": "High-octane PC building configurator checking component compatibility, power supply wattage headroom, and target gaming FPS benchmarks.",
        "tags": ["PC Gaming", "Hardware", "Configurator", "Tech"],
        "features": ["Estimated FPS counters for Cyberpunk & CS2", "Dynamic power supply wattage calculation", "Component clearance & compatibility check badge", "RGB fluid color preview selector"],
        "accent": "#0071e3",
        "sub": "Intel i9 / RTX 4090 Custom Hard-Tubing"
    },
    {
        "id": "vinyl-records-hifi-audio-lounge",
        "title": "Audiophile Vinyl Records & Turntable Vault",
        "category": "E-Commerce",
        "targetTool": "Claude",
        "description": "Warm retro-modern record store with vinyl weight specs (180g virgin vinyl), analog pressing details, and playable vinyl needle drop previews.",
        "tags": ["Vinyl", "Music", "Audiophile", "Vintage"],
        "features": ["Interactive spinning vinyl record animation", "180g Virgin Vinyl master pressing badge", "Complete tracklist with durations", "Curator liner notes accordion"],
        "accent": "#b45309",
        "sub": "Mastered Direct from Original Analog Tapes"
    },
    {
        "id": "gourmet-tea-ceramic-teaware-store",
        "title": "Kyoto Ceremonial Matcha & Teaware",
        "category": "E-Commerce",
        "targetTool": "Bolt.new",
        "description": "Zen Japanese tea merchant featuring ceremonial grade harvest dates, water temperature brewing guide, and hand-thrown ceramic bowls.",
        "tags": ["Tea", "Zen", "Japanese", "Ceramics"],
        "features": ["Optimal brew temperature & whisking guide", "First-harvest single estate origin certificate", "Ceramic glaze pattern selector", "Matcha bamboo whisk starter kit bundle"],
        "accent": "#4d7c0f",
        "sub": "Single-Cultivar Ceremonial Uji Matcha"
    },
    {
        "id": "organic-skincare-serum-matrix",
        "title": "Clinical Botanical Skincare & Active Serums",
        "category": "E-Commerce",
        "targetTool": "Lovable",
        "description": "Clean dermatological skincare showcase with active ingredient percentages (2% Salicylic, 10% Niacinamide), skin type filters, and routine steps.",
        "tags": ["Skincare", "Beauty", "Clinical", "Minimalist"],
        "features": ["Active clinical ingredient percentage pills", "AM / PM routine placement step indicator", "Dermatologist tested & fragrance-free seals", "Before-and-after clinical trial statistics"],
        "accent": "#0284c7",
        "sub": "10% Niacinamide + Zinc Daily Barrier Restorer"
    },
    {
        "id": "vintage-film-camera-lens-emporium",
        "title": "Refurbished Vintage 35mm Film Cameras",
        "category": "E-Commerce",
        "targetTool": "v0",
        "description": "Classic camera shop with shutter mechanism condition grade (Mint, Excellent+), sample film photos shot on the exact body, and lens mounts.",
        "tags": ["Photography", "Vintage", "Film Cameras", "Analog"],
        "features": ["Condition grading badge (Mint - CLA Refurbished)", "Sample photos shot on Kodak Portra 400", "Mechanical shutter speed spec table", "Included leather strap & fresh battery bundle"],
        "accent": "#475569",
        "sub": "1978 Canon AE-1 with 50mm f/1.4 Lens"
    },
    {
        "id": "designer-eyewear-virtual-mirror-tryon",
        "title": "Handcrafted Titanium Eyewear & Specs",
        "category": "E-Commerce",
        "targetTool": "Universal",
        "description": "Modern minimalist glasses storefront with frame millimeter measurements, acetate color swatches, and prescription lens options.",
        "tags": ["Eyewear", "Fashion", "Minimalist", "Accessories"],
        "features": ["Exact bridge, lens, and temple mm specs", "Acetate color finish chips (Tokyo Tortoise, Slate)", "Blue-light vs Prescription lens selector", "Home try-on 3-frame order button"],
        "accent": "#0071e3",
        "sub": "Japanese Beta-Titanium - 14 Grams Total Weight"
    },

    # -------------------------------------------------------------
    # 5. PORTFOLIO (15 items)
    # -------------------------------------------------------------
    {
        "id": "minimalist-swiss-design-engineer-folio",
        "title": "Swiss Typographic Design Engineer Folio",
        "category": "Portfolio",
        "targetTool": "Bolt.new",
        "description": "Clean black-and-white portfolio for engineers who bridge design and code, featuring stark typography, grid coordinates, and case studies.",
        "tags": ["Portfolio", "Design Engineer", "Swiss Style", "Minimalist"],
        "features": ["Grid coordinate overlay labels", "Detailed case study impact metrics", "Live tech stack pill list (React, Three.js)", "Direct email copy button with status indicator"],
        "accent": "#18181b",
        "sub": "Crafting Interfaces with Mechanical Rigor"
    },
    {
        "id": "interactive-3d-creative-director-showcase",
        "title": "Creative Director WebGL Project Vault",
        "category": "Portfolio",
        "targetTool": "v0",
        "description": "Dark experiential portfolio for creative directors with award badges (Awwwards, FWA), project video loops, and client rosters.",
        "tags": ["Portfolio", "Creative Director", "3D", "Awwwards"],
        "features": ["Awwwards Site of the Day ribbons", "Full-bleed project thumbnail hover zoom", "Client logo ticker (Nike, Apple, Spotify)", "Interactive project inquiry button"],
        "accent": "#ec4899",
        "sub": "Directing Digital Experiences for Global Brands"
    },
    {
        "id": "high-end-product-designer-case-study",
        "title": "Principal Product Designer Case Study Hub",
        "category": "Portfolio",
        "targetTool": "Lovable",
        "description": "UX portfolio emphasizing deep problem statements, user journey flowcharts, design system component libraries, and shipped business results.",
        "tags": ["Product Design", "UX/UI", "Case Study", "Design Systems"],
        "features": ["Before-and-after business metrics (+42% conversion)", "High-resolution Figma design token preview", "User research insight quote cards", "Download PDF portfolio resume button"],
        "accent": "#0071e3",
        "sub": "Scaling Enterprise Products from 0 to 10M Users"
    },
    {
        "id": "ml-researcher-paper-index",
        "title": "AI & Deep Learning Researcher Index",
        "category": "Portfolio",
        "targetTool": "Claude",
        "description": "Academic portfolio for machine learning scientists showcasing arXiv papers, citation counts, open-weights GitHub repos, and BibTeX citations.",
        "tags": ["AI Research", "Academic", "Machine Learning", "Papers"],
        "features": ["Total Google Scholar citation counter", "Filter papers by venue (NeurIPS, ICML, CVPR)", "One-click copy BibTeX citation modal", "Direct link to HuggingFace model weights"],
        "accent": "#6366f1",
        "sub": "Publications in Generative Modeling & Alignment"
    },
    {
        "id": "fullstack-polyglot-developer-terminal",
        "title": "Full-Stack Developer Interactive Terminal Folio",
        "category": "Portfolio",
        "targetTool": "Cursor",
        "description": "Developer portfolio disguised as an interactive Unix zsh terminal where visitors type commands (`cat skills`, `open projects`) or click pills.",
        "tags": ["Terminal", "Developer", "CLI", "Interactive"],
        "features": ["Functional interactive terminal command prompt", "Quick-click command pills for mobile visitors", "ASCII art header banner", "Live system uptime and kernel info"],
        "accent": "#22c55e",
        "sub": "Type 'help' or Click Shortcuts to Explore"
    },
    {
        "id": "creative-technologist-webgl-experiments",
        "title": "Creative Technologist Shader & Art Vault",
        "category": "Portfolio",
        "targetTool": "v0",
        "description": "Playful playground portfolio showing real-time canvas simulations, generative algorithms, TouchDesigner experiments, and physics toys.",
        "tags": ["Creative Tech", "Shaders", "WebGL", "Generative Art"],
        "features": ["Interactive interactive canvas simulation card", "FPS and polygon counter widget", "Shader code inspector snippet", "Commission an installation CTA"],
        "accent": "#f59e0b",
        "sub": "Experiments at the Intersection of Math & Light"
    },
    {
        "id": "architectural-spatial-photographer-folio",
        "title": "Architectural & Brutalist Photographer Folio",
        "category": "Portfolio",
        "targetTool": "Universal",
        "description": "Gallery-first photography folio with dual-column layout, image EXIF data (Camera, Focal length, Aperture), and exhibition list.",
        "tags": ["Photography", "Architecture", "Gallery", "Minimalist"],
        "features": ["Clean full-bleed photographic cards", "Subtle EXIF metadata overlay (Leica M11, 35mm)", "Upcoming gallery exhibitions list", "Inquire about limited edition prints drawer"],
        "accent": "#27272a",
        "sub": "Documenting Raw Concrete & Shadow"
    },
    {
        "id": "sound-designer-game-audio-reel",
        "title": "Game Audio & Sound Designer Reel",
        "category": "Portfolio",
        "targetTool": "Bolt.new",
        "description": "Immersive dark audio portfolio with interactive soundboard, game trailer video sync, DAW plugins used, and client credit list.",
        "tags": ["Game Audio", "Sound Design", "Interactive", "Music"],
        "features": ["Interactive SFX soundboard triggers with waveforms", "FMOD / Wwise middleware experience badges", "Game credit list with playable audio teasers", "Request custom game audio quote link"],
        "accent": "#14b8a6",
        "sub": "Original Score & Foley for Unreal Engine 5 Games"
    },
    {
        "id": "brand-identity-visual-system-archive",
        "title": "Brand Identity & Visual System Archive",
        "category": "Portfolio",
        "targetTool": "Lovable",
        "description": "Graphic designer showcase breaking down complete brand identities: logo marks, color theory, typography pairings, and packaging.",
        "tags": ["Brand Identity", "Graphic Design", "Typography", "Packaging"],
        "features": ["Color swatch palette cards with CMYK/Pantone values", "Logomark construction grid breakdown", "Packaging mockup presentation frames", "Book a discovery call calendar modal"],
        "accent": "#e11d48",
        "sub": "Crafting Distinctive Identities for Forward-Thinking Brands"
    },
    {
        "id": "independent-mobile-app-solo-founder",
        "title": "Indie Solo-Founder Apps & Revenue Folio",
        "category": "Portfolio",
        "targetTool": "v0",
        "description": "Transparent indie hacker portfolio showcasing bootstrapped iOS/macOS apps, active monthly recurring revenue (MRR), and user count.",
        "tags": ["Indie Hacker", "Solo Founder", "iOS Apps", "MRR"],
        "features": ["Live MRR total counter ($18,400 / mo)", "App Store download link badges with ratings", "Tech stack breakdown per product", "Open-source tools built for founders"],
        "accent": "#0071e3",
        "sub": "Bootstrapping Micro-SaaS to Financial Freedom"
    },
    {
        "id": "typeface-designer-font-specimen-gallery",
        "title": "Type Foundry & Font Specimen Gallery",
        "category": "Portfolio",
        "targetTool": "Claude",
        "description": "Interactive typography portfolio where users can type live custom text, adjust font weights, variable axes (Slant, Weight), and buy licenses.",
        "tags": ["Typography", "Type Foundry", "Variable Fonts", "Specimen"],
        "features": ["Live editable text specimen input field", "Interactive font weight slider (100 to 900)", "Complete glyph set table inspection", "Commercial vs desktop font license picker"],
        "accent": "#3f3f46",
        "sub": "Contemporary Variable Typefaces Crafted for Screens"
    },
    {
        "id": "editorial-illustrator-storyboard-canvas",
        "title": "Editorial Illustrator & Storyboard Canvas",
        "category": "Portfolio",
        "targetTool": "Universal",
        "description": "Colorful, high-personality portfolio for editorial artists featuring magazine commission covers, rough pencil sketches vs final vector art.",
        "tags": ["Illustration", "Art", "Editorial", "Storyboarding"],
        "features": ["Interactive slider comparing sketch vs final art", "Editorial client badges (New York Times, Wired)", "Character design sheet carousel", "Commission availability status pill"],
        "accent": "#f97316",
        "sub": "Illustrations That Tell Stories with Heart & Wit"
    },
    {
        "id": "motion-graphics-3d-reel-breakdown",
        "title": "3D Motion Designer & Cinema 4D Breakdown",
        "category": "Portfolio",
        "targetTool": "Bolt.new",
        "description": "High-framerate motion graphics portfolio showcasing commercial animation reels, Octane/Redshift lighting breakdowns, and brand loops.",
        "tags": ["Motion Graphics", "3D", "Cinema 4D", "Animation"],
        "features": ["Embedded looping video reel player", "Octane render passes breakdown tab", "Brand animation project case cards", "Book motion project schedule link"],
        "accent": "#a855f7",
        "sub": "Dynamic Kinetic Motion for Tech & Fashion"
    },
    {
        "id": "opensource-maintainer-contribution-radar",
        "title": "Open Source Maintainer & Library Hub",
        "category": "Portfolio",
        "targetTool": "Cursor",
        "description": "Developer portfolio spotlighting open-source npm packages, monthly download counts, GitHub issues closed, and sponsor links.",
        "tags": ["Open Source", "npm", "Maintainer", "Developer"],
        "features": ["Combined 2.4M monthly npm download badge", "GitHub Sponsor button with tiers", "Popular repos sorted by star count", "Recent commits live activity stream"],
        "accent": "#10b981",
        "sub": "Building Developer Tools Downloaded 2M+ Times a Month"
    },
    {
        "id": "fintech-product-leader-impact-folio",
        "title": "Fintech VP of Product Impact Portfolio",
        "category": "Portfolio",
        "targetTool": "Lovable",
        "description": "Executive portfolio focusing on strategic product leadership, regulatory compliance achievements, team scaling, and revenue milestones.",
        "tags": ["Product Leader", "Fintech", "Executive", "Strategy"],
        "features": ["Key executive achievements metric counter", "Product strategy white paper downloads", "Speaking engagements & podcast appearances", "Board advisory inquiry gateway"],
        "accent": "#0071e3",
        "sub": "Scaling Payments Products Across Emerging Markets"
    },

    # -------------------------------------------------------------
    # 6. MOBILE UI (15 items)
    # -------------------------------------------------------------
    {
        "id": "cupertino-minimalist-wealth-budget-app",
        "title": "Cupertino Wealth & Expense Manager Mobile UI",
        "category": "Mobile UI",
        "targetTool": "v0",
        "description": "Apple-style iOS personal finance app interface featuring smooth monthly spend circular progress, categorized expense feed, and card swipe.",
        "tags": ["Mobile UI", "iOS", "Fintech", "Cupertino"],
        "features": ["Circular budget breakdown ring", "Recent expense transaction list with brand icons", "Quick add transaction floating action button", "Account balance toggle visibility eye"],
        "accent": "#0071e3",
        "sub": "Designed with iOS 18 Design Guidelines"
    },
    {
        "id": "darkmode-ai-chatbot-voice-orb",
        "title": "Dark Mode AI Conversational Voice Mobile UI",
        "category": "Mobile UI",
        "targetTool": "Bolt.new",
        "description": "Voice-first mobile AI assistant interface featuring an interactive glowing ambient fluid voice orb, streaming transcript bubbles, and haptic feedback.",
        "tags": ["Mobile UI", "AI Chatbot", "Voice AI", "Dark Mode"],
        "features": ["Pulsing fluid voice reactive orb", "Real-time streaming speech bubbles", "One-tap voice mute / speaker toggle", "Quick suggested follow-up query chips"],
        "accent": "#8b5cf6",
        "sub": "Low-Latency Natural Voice Dialogue"
    },
    {
        "id": "sleep-cycle-circadian-tracker-app",
        "title": "Sleep Cycle & Circadian Rhythm Tracker",
        "category": "Mobile UI",
        "targetTool": "Lovable",
        "description": "Deep midnight blue sleep tracker displaying REM, Deep, and Light sleep stages, optimal wake window alarm, and sleep score.",
        "tags": ["Health", "Sleep Tracker", "Mobile UI", "Wearable"],
        "features": ["Sleep hypnogram stage timeline (Deep, REM, Light)", "Overall sleep quality score ring (92%)", "Smart gentle vibration alarm setup", "Heart rate variability (HRV) average graph"],
        "accent": "#6366f1",
        "sub": "Optimal Sleep Architecture & Recovery"
    },
    {
        "id": "calorie-macro-ai-food-scanner-app",
        "title": "AI Meal Camera & Macro Nutrient Scanner",
        "category": "Mobile UI",
        "targetTool": "Universal",
        "description": "Nutrition app interface featuring viewfinder camera scanning food items, instant protein/carb breakdown, and daily calorie target rings.",
        "tags": ["Nutrition", "Fitness", "Computer Vision", "Mobile UI"],
        "features": ["Simulated food camera scanner target reticle", "Instant Protein, Carb, and Fat macro bars", "Daily calorie allowance remaining indicator", "One-tap log meal to diary button"],
        "accent": "#10b981",
        "sub": "Point Camera to Log 450 Calories (32g Protein)"
    },
    {
        "id": "habit-streak-gamified-focus-timer",
        "title": "Minimalist Habit Streak & Pomodoro Focus Timer",
        "category": "Mobile UI",
        "targetTool": "Claude",
        "description": "Daily habit builder with unbroken streak counters, satisfying completion check gestures, and a 25-minute countdown focus timer.",
        "tags": ["Habits", "Pomodoro", "Productivity", "Mobile UI"],
        "features": ["Circular 25:00 countdown timer with start/pause", "Daily habit checklist with streak flame counter", "Ambient rain / white noise toggle", "Weekly consistency calendar dots"],
        "accent": "#f59e0b",
        "sub": "21-Day Unbroken Deep Work Streak"
    },
    {
        "id": "crypto-cold-wallet-biometric-signer",
        "title": "Biometric Crypto Vault & Transaction Signer",
        "category": "Mobile UI",
        "targetTool": "v0",
        "description": "Ultra-secure mobile crypto wallet interface with simulated FaceID biometric confirmation, gas fee estimator, and balance obscurity.",
        "tags": ["Web3", "Crypto Wallet", "Mobile UI", "Security"],
        "features": ["Hold to Send sliding confirmation bar", "EIP-1559 gas fee priority selector (Fast, Normal)", "Network switcher pill (Ethereum, Solana, Polygon)", "Mask balance privacy switch"],
        "accent": "#0071e3",
        "sub": "Secure Enclave Hardware Key Signing"
    },
    {
        "id": "audio-meditation-soundscape-player",
        "title": "Serene Breathwork & Soundscape Mobile Player",
        "category": "Mobile UI",
        "targetTool": "Cursor",
        "description": "Calming wellness interface with guided breathwork pacing circle (Inhale, Hold, Exhale), ambient binaural beat soundscapes, and session logs.",
        "tags": ["Meditation", "Wellness", "Audio Player", "Mobile UI"],
        "features": ["Animated expanding breathwork pacer circle", "Ambient mixer sliders (Rain, Forest, Waves)", "Session duration picker (5m, 10m, 20m)", "Daily mindfulness minutes counter"],
        "accent": "#0d9488",
        "sub": "Box Breathing: 4s Inhale, 4s Hold, 4s Exhale"
    },
    {
        "id": "rideshare-autonomous-taxi-dispatcher",
        "title": "Autonomous Taxi Dispatch & Live Map UI",
        "category": "Mobile UI",
        "targetTool": "Bolt.new",
        "description": "Clean ride-hailing app screen showing real-time autonomous vehicle approach route, ETA badge, vehicle unlock code, and climate control.",
        "tags": ["Ride Share", "Mobility", "Maps", "Mobile UI"],
        "features": ["Map route overview card with 4 min ETA", "Vehicle model, license plate, and PIN code", "In-car temperature and music preference setter", "Contact safety dispatch emergency button"],
        "accent": "#0284c7",
        "sub": "Your Autonomous Sedan is 3 Minutes Away"
    },
    {
        "id": "smart-home-iot-room-climate-master",
        "title": "Smart Home IoT Room & Climate Master UI",
        "category": "Mobile UI",
        "targetTool": "Lovable",
        "description": "Home automation controller with temperature dial, lighting brightness sliders, room presence sensors, and quick scene triggers (Movie, Sleep).",
        "tags": ["Smart Home", "IoT", "HomeKit", "Mobile UI"],
        "features": ["Interactive AC temperature dial (21.5°C)", "Individual light brightness and color temperature sliders", "Quick scene action pills (Morning, Cinema, Away)", "Active power wattage consumption ticker"],
        "accent": "#ea580c",
        "sub": "Living Room: 3 Lights Active, 22°C Comfort"
    },
    {
        "id": "flight-boarding-airport-navigation-pass",
        "title": "Airport Smart Boarding Pass & Terminal Pass",
        "category": "Mobile UI",
        "targetTool": "Universal",
        "description": "Dynamic digital boarding pass showing live flight departure countdown, gate changes, baggage claim carousel, and scannable Aztec barcode.",
        "tags": ["Travel", "Aviation", "Boarding Pass", "Mobile UI"],
        "features": ["Live boarding countdown timer with gate alert", "High-contrast scannable boarding barcode", "Seat, Group, and Terminal pills", "Baggage claim carousel number update"],
        "accent": "#0071e3",
        "sub": "Flight EK582 to Dubai - Gate B24 (Boarding Now)"
    },
    {
        "id": "language-learning-sprint-flashcards",
        "title": "Language Learning Daily Sprint & Flashcards",
        "category": "Mobile UI",
        "targetTool": "v0",
        "description": "Engaging language learning app interface with interactive vocabulary flashcards, native pronunciation speaker audio button, and daily XP bar.",
        "tags": ["Education", "Language", "Gamification", "Mobile UI"],
        "features": ["Tap-to-flip vocabulary flashcard card", "Native speaker audio pronunciation trigger", "Daily XP streak and level progress bar", "Multiple choice meaning verification quiz"],
        "accent": "#84cc16",
        "sub": "Daily Goal: 15 / 20 Words Mastered"
    },
    {
        "id": "running-gps-cadence-pacer-app",
        "title": "Running GPS Tracker & Cadence Pacer UI",
        "category": "Mobile UI",
        "targetTool": "Claude",
        "description": "High-contrast athletic running interface with real-time pace (min/km), heart rate zone bar, elevation graph, and split interval milestones.",
        "tags": ["Running", "Fitness", "GPS", "Mobile UI"],
        "features": ["Real-time pace display (4:42 min/km)", "Aerobic heart rate zone indicator (Zone 3)", "Kilometer split notification banner", "Pause / Finish workout tactile button"],
        "accent": "#ef4444",
        "sub": "Distance: 6.42 km | Avg Pace: 4:48 min/km"
    },
    {
        "id": "minimalist-note-quick-memo-scratchpad",
        "title": "Minimalist Quick Memo & Voice Scratchpad",
        "category": "Mobile UI",
        "targetTool": "Bolt.new",
        "description": "Distraction-free fast note capture app for fleeting thoughts with automatic tagging, voice-to-text transcription, and pin to lockscreen.",
        "tags": ["Notes", "Scratchpad", "Productivity", "Mobile UI"],
        "features": ["Zero-friction full-screen typing area", "One-tap voice audio dictation button", "Automatic smart tag classification (#ideas, #todo)", "Pin note to notification shade action"],
        "accent": "#18181b",
        "sub": "Capture Fleeting Ideas with Zero Friction"
    },
    {
        "id": "parcel-package-tracker-live-timeline",
        "title": "Universal Package Tracker & Live Delivery UI",
        "category": "Mobile UI",
        "targetTool": "Lovable",
        "description": "Shipment tracking app aggregating FedEx, DHL, and local couriers into a unified milestone timeline with delivery window estimates.",
        "tags": ["Delivery", "Logistics", "Tracking", "Mobile UI"],
        "features": ["Chronological milestone progress stepper", "Courier carrier badge with tracking number copy", "Estimated delivery time window badge", "Notify delivery driver special instructions box"],
        "accent": "#f97316",
        "sub": "Out for Delivery - Arriving Today by 4:30 PM"
    },
    {
        "id": "concert-ticket-dynamic-barcode-pass",
        "title": "Live Event Ticket & Anti-Fraud Barcode Pass",
        "category": "Mobile UI",
        "targetTool": "Universal",
        "description": "Concert and festival mobile ticket screen featuring a dynamic animated anti-screenshot security wave, venue gate directions, and Apple Wallet link.",
        "tags": ["Concert", "Events", "Tickets", "Mobile UI"],
        "features": ["Animated anti-screenshot security scan bar", "Seat, Section, and Row badges", "Venue entrance gate map shortcut", "Add to Apple Wallet / Google Pay button"],
        "accent": "#a855f7",
        "sub": "Section VIP-A | Row 4 | Seat 12"
    }
]

print(f"Total prompt specs defined: {len(ITEMS)}")

# Generate previews and prompts
PROMPTS_DATA = []
ZIP_FOLDER = DIST_DIR / "shareflow-110-ai-design-prompts"
if ZIP_FOLDER.exists():
    shutil.rmtree(ZIP_FOLDER)
ZIP_FOLDER.mkdir(parents=True, exist_ok=True)

# Generate HTML Preview Template function
def build_preview_html(item):
    accent = item.get("accent", "#0071e3")
    title = item["title"]
    category = item["category"]
    tool = item["targetTool"]
    sub = item.get("sub", "Production-Ready Component")
    features_html = "".join([f'<li class="flex items-center gap-2 text-sm text-slate-300"><span class="w-1.5 h-1.5 rounded-full" style="background-color: {accent}"></span>{feat}</li>' for feat in item["features"]])
    tags_html = "".join([f'<span class="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">{tag}</span>' for tag in item["tags"]])
    
    html = f"""<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} - Live Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body {{
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      background-color: #0b0c0e;
      color: #f5f5f7;
    }}
    .mono {{ font-family: 'JetBrains Mono', monospace; }}
    .glass {{
      background: rgba(18, 20, 26, 0.75);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }}
    .glow-border {{
      box-shadow: 0 0 30px -10px {accent}40;
    }}
  </style>
</head>
<body class="min-h-screen flex flex-col justify-between selection:bg-blue-600 selection:text-white">

  <!-- Top Preview Bar -->
  <header class="sticky top-0 z-50 glass border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-3 h-3 rounded-full" style="background-color: {accent}"></div>
      <span class="text-xs sm:text-sm font-bold tracking-tight text-white">{title}</span>
      <span class="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-medium">{category}</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-400">
        Engine: <strong class="text-white">{tool}</strong>
      </span>
      <span class="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
        Live Responsive
      </span>
    </div>
  </header>

  <!-- Interactive Component Showcase Stage -->
  <main class="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-10 flex flex-col justify-center">
    
    <!-- Hero / Headline Box -->
    <div class="glass glow-border rounded-3xl p-6 sm:p-10 relative overflow-hidden mb-8">
      <div class="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none" style="background-color: {accent}"></div>
      
      <div class="flex flex-wrap items-center gap-2 mb-4">
        {tags_html}
      </div>

      <h1 class="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
        {title}
      </h1>
      <p class="text-base sm:text-lg text-slate-400 max-w-2xl mb-6">
        {item["description"]}
      </p>

      <!-- Key Architectural Features Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
        {features_html}
      </div>

      <!-- Action Simulation Row -->
      <div class="flex flex-wrap items-center gap-4">
        <button class="px-6 py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-transform active:scale-95 flex items-center gap-2" style="background-color: {accent}">
          <span>Interactive Component Trigger</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
        <button class="px-5 py-3 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/15 text-white transition-all border border-white/10">
          Inspect Architecture
        </button>
        <div class="ml-auto text-xs text-slate-500 mono">
          Status: Operational 99.9%
        </div>
      </div>
    </div>

    <!-- Mini Telemetry / Mock Interface Preview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="glass p-5 rounded-2xl">
        <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Target Engine</div>
        <div class="text-xl font-bold text-white flex items-center gap-2">
          <span>{tool}</span>
          <span class="text-xs font-normal text-emerald-400">100% Tested</span>
        </div>
        <div class="text-xs text-slate-500 mt-2">Zero hallucinations. Strict TypeScript & Tailwind v4 token output.</div>
      </div>

      <div class="glass p-5 rounded-2xl">
        <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Price on SupportKori</div>
        <div class="text-xl font-bold text-emerald-400 flex items-center gap-1">
          <span>৳49 BDT</span>
          <span class="text-xs text-slate-400 font-normal">/ Single Prompt</span>
        </div>
        <div class="text-xs text-slate-500 mt-2">Instant digital delivery with copy-ready markdown & system instructions.</div>
      </div>

      <div class="glass p-5 rounded-2xl">
        <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">License & Commercial Rights</div>
        <div class="text-xl font-bold text-white">Full Commercial</div>
        <div class="text-xs text-slate-500 mt-2">Use freely across client projects, SaaS products, and freelance work.</div>
      </div>
    </div>

  </main>

  <!-- Bottom Bar -->
  <footer class="glass border-t border-white/10 py-4 px-6 text-center text-xs text-slate-500">
    ShareFlow Premium AI Design Architecture • Verified for SupportKori ৳49 Store • Built for Developers
  </footer>

</body>
</html>"""
    return html

# Generate comprehensive markdown prompt for each item
def build_prompt_markdown(item):
    return f"""# {item['title']}
**Category:** {item['category']}
**Target Tool:** {item['targetTool']}
**Price:** ৳49 BDT (SupportKori)
**Commercial License:** Yes, unlimited client and commercial use.

---

## 1. System Persona & Behavioral Constraints
When generating this interface, adopt the following strict rules:
- **Role:** You are a World-Class Principal Design Engineer specialized in modern Apple-inspired and Stripe-grade web interfaces.
- **Frameworks:** React 18+, TypeScript, Tailwind CSS v4, Lucide React icons, and Framer Motion.
- **Aesthetic Principles:**
  - High typographic hierarchy using clean sans-serif (Inter, Plus Jakarta Sans, SF Pro).
  - Dark mode first: slate black background (`#0b0c0e`), frosted glass cards (`rgba(18, 20, 26, 0.75)` with `backdrop-blur-xl`), and crisp 1px borders (`border-white/10`).
  - Accent Color: Primary highlight is `{item.get('accent', '#0071e3')}`.
  - Zero placeholder text: Write authentic, production-grade micro-copy that directly matches the product's value proposition.
  - Mobile Responsiveness: 100% responsive down to 360px mobile viewports.

---

## 2. Architectural Blueprint & Component Structure
Build the complete, self-contained component according to these specifications:
- **Container:** Full viewport height container (`min-h-screen w-full flex flex-col justify-between`) with subtle background glow.
- **Header:** Sticky frosted glass header with brand mark, category tag `{item['category']}`, and action status pill.
- **Hero / Core Viewport:**
  - Headline: "{item['title']}"
  - Subheadline: "{item.get('sub', item['description'])}"
  - Key Features to Render:
{chr(10).join([f"    - {feat}" for feat in item['features']])}
- **Interactive States:**
  - Hover states on interactive cards (`hover:border-white/20 transition-all duration-300`).
  - Active button states with subtle scaling (`active:scale-95`).
  - Clear visual contrast for primary CTA versus secondary ghost buttons.
- **Footer / Meta Ribbon:** Minimalist status bar displaying operational telemetry and copyright.

---

## 3. Ready-to-Paste Prompt for {item['targetTool']}
```markdown
Create a production-grade, highly polished React component for a "{item['title']}".
The design must follow modern Cupertino glassmorphic standards:
- Dark slate background (#0b0c0e) with frosted glass cards (backdrop-blur-xl bg-white/[0.04] border border-white/10).
- Accent highlights in {item.get('accent', '#0071e3')}.
- Include realistic copy and live data for: {item['description']}.
- Implement key features: {', '.join(item['features'])}.
- Ensure full responsiveness with Lucide React icons and smooth hover animations.
Output clean, modular TypeScript with Tailwind CSS classes.
```
"""

# Iterate over all 110 items
for idx, item in enumerate(ITEMS, 1):
    pid = item["id"]
    
    # 1. Save HTML Live Preview into public/previews/{pid}.html
    preview_html = build_preview_html(item)
    preview_file = PREVIEWS_DIR / f"{pid}.html"
    with open(preview_file, "w", encoding="utf-8") as f:
        f.write(preview_html)
    
    # 2. Save Prompt Markdown into ZIP folder
    prompt_md = build_prompt_markdown(item)
    item_folder = ZIP_FOLDER / f"{idx:03d}-{pid}"
    item_folder.mkdir(parents=True, exist_ok=True)
    with open(item_folder / "PROMPT.md", "w", encoding="utf-8") as f:
        f.write(prompt_md)
    # Also include the preview HTML inside the bundle
    with open(item_folder / "preview.html", "w", encoding="utf-8") as f:
        f.write(preview_html)
        
    # 3. Create JSON catalog entry for ShareFlow
    catalog_entry = {
        "id": pid,
        "title": item["title"],
        "description": item["description"],
        "category": item["category"],
        "targetTool": item["targetTool"],
        "isFree": False, # Premium prompt
        "priceBdt": 49, # ৳49 BDT as requested
        "supportKoriUrl": "https://www.supportkori.com/mhr3d", # Mahir's SupportKori profile
        "previewImage": f"/previews/{pid}.html", # Using the live preview
        "livePreviewUrl": f"/previews/{pid}.html",
        "systemInstruction": f"You are a Senior Design Engineer. Generate a production-grade {item['category']} component in React, Tailwind CSS v4, and Lucide icons following Cupertino dark glassmorphism standards with {item.get('accent', '#0071e3')} accents.",
        "promptContent": f"Generate a high-conversion, production-ready React component for: '{item['title']}'. Description: {item['description']}. Mandatory features: {', '.join(item['features'])}. Use dark obsidian styling, frosted glass cards, and crisp typography.",
        "tags": item["tags"],
        "features": item["features"],
        "copyCount": 120 + (idx * 7) % 85,
        "active": True,
        "createdAt": "2026-10-16"
    }
    PROMPTS_DATA.append(catalog_entry)

# Write Master prompts.json
prompts_json_path = DATA_DIR / "prompts.json"
with open(prompts_json_path, "w", encoding="utf-8") as f:
    json.dump(PROMPTS_DATA, f, indent=2, ensure_ascii=False)

print(f"Successfully saved {len(PROMPTS_DATA)} prompts to {prompts_json_path}")

# Write catalog index into ZIP folder
with open(ZIP_FOLDER / "CATALOG_INDEX.md", "w", encoding="utf-8") as f:
    f.write("# ShareFlow - 110 High-Conversion AI Website & UI Design Prompts\n")
    f.write("**Price:** ৳49 BDT each on SupportKori (https://www.supportkori.com/mhr3d)\n\n")
    f.write("| # | Title | Category | Target Engine | Folder |\n")
    f.write("|---|---|---|---|---|\n")
    for idx, item in enumerate(ITEMS, 1):
        f.write(f"| {idx} | {item['title']} | {item['category']} | {item['targetTool']} | `{idx:03d}-{item['id']}/` |\n")

# Create the final zip archive
ZIP_OUTPUT = DIST_DIR / "shareflow-110-ai-design-prompts-and-previews.zip"
print(f"Creating zip archive at {ZIP_OUTPUT}...")
with zipfile.ZipFile(ZIP_OUTPUT, "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(ZIP_FOLDER):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, ZIP_FOLDER.parent)
            zipf.write(file_path, arcname)

print(f"✅ Zip bundle successfully created: {ZIP_OUTPUT} ({os.path.getsize(ZIP_OUTPUT) / (1024*1024):.2f} MB)")
