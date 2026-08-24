import { useState } from "react";
import { Download, Gift, Lock, Sparkles, CheckCircle, ShieldCheck } from "lucide-react";
import { SEOContent } from "../components/SEOContent";

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  downloadUrl: string;
  features: string[];
}

const PRODUCTS: Product[] = [
  {
    id: "fastapi-sqlite-starter-kit",
    title: "Production FastAPI + SQLite Starter Kit",
    description: "High-concurrency async FastAPI boilerplate with SQLite WAL mode, Pydantic v2 schemas, JWT authentication, and Docker setup.",
    category: "Developer Starter Kits",
    price: "$4.99",
    downloadUrl: "/products/fastapi-sqlite-starter-kit.zip",
    features: [
      "FastAPI 0.110+ & Async SQLite WAL adapter",
      "Pydantic v2 validation & JWT Auth",
      "Built-in Rate Limiter & Security Headers",
      "Dockerfile & docker-compose included"
    ]
  },
  {
    id: "async-web-scraper-engine",
    title: "Multi-Threaded Async Web Scraper Engine",
    description: "Production Python web scraping framework using httpx, BeautifulSoup4, and Playwright for bypassing anti-bot walls.",
    category: "Developer Starter Kits",
    price: "$3.99",
    downloadUrl: "/products/fastapi-sqlite-starter-kit.zip",
    features: [
      "Async HTTPX request pool & proxy rotation",
      "Headless Playwright browser integration",
      "Automatic retries & exponential backoff",
      "CSV & JSON pipeline exporters"
    ]
  },
  {
    id: "docker-k8s-cheatsheet",
    title: "Docker & Kubernetes Mastery PDF Cheatsheet",
    description: "Comprehensive CLI reference guide for Docker, Docker Compose, and Kubernetes cluster management in production.",
    category: "DevOps Guides",
    price: "$2.99",
    downloadUrl: "/products/fastapi-sqlite-starter-kit.zip",
    features: [
      "50+ essential Docker & kubectl CLI snippets",
      "Container optimization & multi-stage builds",
      "Kubernetes Deployment, Service, and Ingress specs",
      "Print-ready PDF cheat sheet"
    ]
  }
];

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adStep, setAdStep] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleStartUnlock = (product: Product) => {
    setSelectedProduct(product);
    setAdStep(1);
    setIsUnlocked(false);
  };

  const handleNextAdStep = () => {
    if (adStep < 5) {
      setAdStep((prev) => prev + 1);
    } else {
      setIsUnlocked(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HERO SECTION */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Gift className="w-4 h-4" /> 100% Free Developer Products
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Developer Starter Kits & Toolkits
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base">
            Download production-ready code templates, DevOps guides, and datasets. Choose to pay or unlock 100% FREE by watching quick ad steps!
          </p>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-6 hover:border-emerald-500/40 transition-all shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                    {prod.category}
                  </span>
                  <span className="text-sm font-semibold text-white/40">{prod.price}</span>
                </div>
                <h3 className="text-xl font-bold text-white">{prod.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{prod.description}</p>
                
                <ul className="space-y-2 pt-2">
                  {prod.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-white/80">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-white/10 flex gap-2">
                <button
                  onClick={() => handleStartUnlock(prod)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg"
                >
                  <Sparkles className="w-4 h-4" /> Unlock FREE
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* REWARDED AD UNLOCK MODAL */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#131926] border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Gift className="w-5 h-5 text-emerald-400" /> Unlock Free Product
                </h3>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-white/40 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-emerald-300">{selectedProduct.title}</h4>
                <p className="text-xs text-white/60">
                  Watch 5 quick ad steps to claim your 100% free direct download link!
                </p>
              </div>

              {/* STEP PROGRESS BAR */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Ad Progress</span>
                  <span className="text-emerald-400">Step {adStep} of 5</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-300"
                    style={{ width: `${(adStep / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* UNLOCK CONTENT / AD STEP */}
              {!isUnlocked ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center space-y-4">
                  <div className="text-xs text-white/70">
                    Step {adStep}: Support ShareFlow by viewing our developer sponsor banner below.
                  </div>
                  
                  {/* AD BANNER CONTAINER */}
                  <div className="p-3 bg-slate-900 rounded-lg border border-white/5 flex items-center justify-center min-h-[90px]">
                    <span className="text-xs text-emerald-400/80 font-mono">
                      [Adsterra / Developer Sponsor Banner #{adStep}]
                    </span>
                  </div>

                  <button
                    onClick={handleNextAdStep}
                    className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    {adStep === 5 ? "Complete Final Step" : `Proceed to Step ${adStep + 1} →`}
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center space-y-4">
                  <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-base">Product Unlocked!</h4>
                    <p className="text-xs text-white/60">Thank you for supporting ShareFlow. Your download is ready.</p>
                  </div>
                  <a
                    href={selectedProduct.downloadUrl}
                    download
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg"
                  >
                    <Download className="w-5 h-5" /> Download Product Zip
                  </a>
                </div>
              )}

            </div>
          </div>
        )}

        <SEOContent
          title="Free Developer Starter Kits & Digital Products"
          description="Download production-ready FastAPI, Web Scraper, and DevOps starter kits for free on ShareFlow."
          steps={[
            { title: "Browse Products", description: "Select from production code templates and DevOps guides." },
            { title: "Watch 5 Quick Steps", description: "Support free tools by viewing developer sponsor banners." },
            { title: "Instant Download", description: "Get your 100% free product zip file instantly." }
          ]}
        />
      </div>
    </div>
  );
}
