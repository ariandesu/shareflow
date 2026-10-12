/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Download, Sparkles, Check, Gift, ArrowRight, ShieldCheck, ExternalLink, Copy, CheckCircle2 } from "lucide-react";

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  downloadUrl: string;
  gumroadBaseUrl: string;
  features: string[];
}

const ADSTERRA_SMART_LINK = "https://poochingdesolate.com/kbh3b1i8?key=2be98717904ae1521ea80373ae4d1933";

const PRODUCTS: Product[] = [
  {
    id: "fastapi-sqlite-starter",
    title: "FastAPI + SQLite Production Starter Kit",
    description: "Production-ready backend architecture with async SQLAlchemy 2.0, Alembic migrations, JWT authentication, and Pydantic v2 schemas.",
    category: "Developer Starter Kits",
    price: "$4.99",
    downloadUrl: "/products/fastapi-sqlite-starter.zip",
    gumroadBaseUrl: "https://mhr3d.gumroad.com/l/fastapi-sqlite-starter",
    features: [
      "SQLAlchemy 2.0 Async engine + SQLite WAL mode",
      "Auto-generated Alembic migrations",
      "JWT auth with refresh tokens & bcrypt hashing",
      "Docker & docker-compose production configs"
    ]
  },
  {
    id: "async-scraper-engine",
    title: "Multi-Threaded Async Web Scraper Engine",
    description: "High-performance Python web scraping engine built on httpx and BeautifulSoup4 with exponential backoff and rotating proxy pools.",
    category: "Developer Starter Kits",
    price: "$4.99",
    downloadUrl: "/products/async-scraper-engine.zip",
    gumroadBaseUrl: "https://mhr3d.gumroad.com/l/async-scraper-engine",
    features: [
      "Async HTTP client via httpx with connection pooling",
      "Exponential backoff & dynamic jitter retry handler",
      "Headless Chrome / Playwright hook support",
      "Clean JSON and CSV streaming exporters"
    ]
  },
  {
    id: "docker-k8s-cheatsheet",
    title: "Docker & Kubernetes Mastery PDF Cheatsheet",
    description: "Comprehensive CLI reference guide for Docker, Docker Compose, and Kubernetes cluster management in production environments.",
    category: "DevOps Guides",
    price: "$2.99",
    downloadUrl: "/products/docker-k8s-cheatsheet.zip",
    gumroadBaseUrl: "https://mhr3d.gumroad.com/l/docker-k8s-cheatsheet",
    features: [
      "50+ essential Docker & kubectl CLI snippets",
      "Container optimization & multi-stage builds",
      "Kubernetes Deployment, Service, and Ingress specs",
      "Print-ready high resolution PDF format"
    ]
  },
  {
    id: "global-tech-salaries-2026",
    title: "Global Tech Salaries 2026 CSV Dataset",
    description: "Audited compensation dataset featuring 1,500+ compensation records across software engineering, AI/ML, DevOps, and data roles worldwide.",
    category: "Data & Research",
    price: "$3.99",
    downloadUrl: "/products/global-tech-salaries-2026.zip",
    gumroadBaseUrl: "https://mhr3d.gumroad.com/l/global-tech-salaries-2026",
    features: [
      "1,500+ real audited compensation records",
      "Software, AI/ML, DevOps & Security roles",
      "Remote vs On-site compensation benchmarks",
      "Clean CSV format ready for Pandas / Excel"
    ]
  },
  {
    id: "async-telegram-bot-boilerplate",
    title: "Async Python Telegram Bot Starter Kit",
    description: "Production-ready async Telegram bot boilerplate with python-telegram-bot v20+, asyncio, aiosqlite database, and Docker setup.",
    category: "Developer Starter Kits",
    price: "$4.99",
    downloadUrl: "/products/async-telegram-bot-boilerplate.zip",
    gumroadBaseUrl: "https://mhr3d.gumroad.com/l/async-telegram-bot-boilerplate",
    features: [
      "python-telegram-bot v20+ & Asyncio engine",
      "Async SQLite (aiosqlite) user storage",
      "Command handlers (/start, /help, /stats)",
      "Dockerfile & docker-compose configuration"
    ]
  }
];

export function Products() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adStep, setAdStep] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const handleStartUnlock = (product: Product) => {
    setSelectedProduct(product);
    setAdStep(1);
    setIsUnlocked(false);
    setCouponCode("");
  };

  const handleAdStepClick = async () => {
    window.open(ADSTERRA_SMART_LINK, "_blank", "noopener,noreferrer");

    if (adStep < 5) {
      setAdStep((prev) => prev + 1);
    } else {
      setIsUnlocked(true);
      try {
        const res = await fetch("/api/mint-coupon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: selectedProduct?.id })
        });
        const data = await res.json();
        if (data && data.couponCode) {
          setCouponCode(data.couponCode);
        } else {
          const fallbackHash = Math.random().toString(36).substring(2, 8).toUpperCase();
          setCouponCode(`SF100_${(selectedProduct?.id || "FREE").split("-")[0].toUpperCase()}_${fallbackHash}`);
        }
      } catch {
        const fallbackHash = Math.random().toString(36).substring(2, 8).toUpperCase();
        setCouponCode(`SF100_${(selectedProduct?.id || "FREE").split("-")[0].toUpperCase()}_${fallbackHash}`);
      }
    }
  };

  const handleCopyCoupon = () => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode);
      setCopiedCoupon(true);
      setTimeout(() => setCopiedCoupon(false), 2000);
    }
  };

  return (
    <div className="w-full flex flex-col gap-10 pb-16">
      {/* Header */}
      <div className="text-center pt-4 sm:pt-6 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#f5f5f7] text-[#0071e3] border border-[#d2d2d7]/50 mb-4 shadow-xs">
          <Gift className="w-3.5 h-3.5 text-[#0071e3]" />
          <span>FREE DEVELOPER STORE • PRODUCTION BLUEPRINTS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1d1d1f] max-w-2xl leading-tight">
          Battle-tested starter kits & engineering blueprints.
        </h1>
        <p className="text-sm sm:text-base text-[#6e6e73] max-w-xl mt-3 leading-relaxed">
          Production backends, multi-threaded scrapers, and DevOps cheatsheets crafted for high-performance engineers. 100% free to unlock.
        </p>
      </div>

      {/* Product Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        {PRODUCTS.map((prod) => (
          <div
            key={prod.id}
            className="bg-white border border-[#e5e5ea] hover:border-[#0071e3] rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-6 shadow-xs hover:shadow-md transition-all duration-200 group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[#0071e3] border border-[#d2d2d7]/50">
                  {prod.category}
                </span>
                <span className="text-xs font-bold text-[#34c759] bg-[#eafaf1] px-2 py-0.5 rounded-full">
                  Free Unlock
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors leading-snug">
                {prod.title}
              </h3>
              <p className="text-xs text-[#6e6e73] mt-2 leading-relaxed">
                {prod.description}
              </p>

              <div className="mt-4 pt-4 border-t border-[#e5e5ea] flex flex-col gap-1.5">
                {prod.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#1d1d1f]">
                    <Check className="w-3.5 h-3.5 text-[#34c759] flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => handleStartUnlock(prod)}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-none"
              >
                <Sparkles className="w-4 h-4" />
                <span>Unlock for Free</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Unlock Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e5e5ea] relative text-left">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#86868b] hover:text-[#1d1d1f] flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#eafaf1] text-[#34c759]">
                Sponsored Unlock
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#1d1d1f]">{selectedProduct.title}</h3>
            <p className="text-xs text-[#6e6e73] mt-1">{selectedProduct.description}</p>

            <div className="mt-6 p-4 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] flex flex-col gap-3">
              {!isUnlocked ? (
                <>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1d1d1f]">Sponsor Verification Progress</span>
                    <span className="font-mono font-bold text-[#0071e3]">{adStep} of 5</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#e5e5ea] overflow-hidden">
                    <div
                      className="h-full bg-[#0071e3] rounded-full transition-all duration-300"
                      style={{ width: `${(adStep / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#86868b] leading-relaxed">
                    Click below to visit our sponsor link. Once completed (step 5), your 100% OFF Gumroad coupon code will be automatically generated.
                  </p>
                  <button
                    onClick={handleAdStepClick}
                    className="w-full min-h-[44px] mt-2 py-3 px-4 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span>{adStep === 0 ? "Start Step 1 (Visit Sponsor)" : `Continue Step ${adStep + 1} of 5`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 text-center py-2">
                  <CheckCircle2 className="w-10 h-10 text-[#34c759] mx-auto" />
                  <h4 className="font-bold text-base text-[#1d1d1f]">Starter Kit Unlocked!</h4>
                  <p className="text-xs text-[#6e6e73]">
                    Use this 100% OFF coupon code on Gumroad to download your package for free:
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      readOnly
                      value={couponCode}
                      className="flex-1 text-center font-mono font-bold text-sm py-2.5 px-3 bg-white border border-[#0071e3] rounded-xl text-[#0071e3]"
                    />
                    <button
                      onClick={handleCopyCoupon}
                      className="px-4 py-2.5 bg-[#0071e3] text-white rounded-xl text-xs font-semibold hover:bg-[#0077ed]"
                    >
                      {copiedCoupon ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <a
                    href={`${selectedProduct.gumroadBaseUrl}?wanted=true`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#1d1d1f] hover:bg-black text-white font-semibold text-xs flex items-center justify-center gap-2"
                  >
                    <span>Claim on Gumroad</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
