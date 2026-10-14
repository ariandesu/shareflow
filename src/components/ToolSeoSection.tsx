import { ShieldCheck, HelpCircle, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { ToolSeoData } from "../data/toolsSeoRegistry";
import { ContextualPartnerCard } from "./ContextualPartnerCard";
import { SITE_URL } from "../config/site";

interface ToolSeoSectionProps {
  data: ToolSeoData;
}

export function ToolSeoSection({ data }: ToolSeoSectionProps) {
  const schemaApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": data.title,
    "operatingSystem": "All modern browsers (Chrome, Firefox, Safari, Edge)",
    "applicationCategory": "DeveloperApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": data.metaDescription,
    "url": `${SITE_URL}/tools/${data.slug}`
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faq.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <section className="mt-16 pt-12 border-t border-[#e5e5ea] dark:border-[#27272a] space-y-12 max-w-5xl mx-auto w-full text-left text-[#1d1d1f] dark:text-[#f5f5f7]">
      {/* Dynamic JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }}
      />

      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#0071e3]/10 text-[#0071e3] dark:text-[#38bdf8] uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          <span>In-Browser Engineering Guide</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          How to Use the {data.title}
        </h2>
        <p className="text-xs sm:text-sm text-[#6e6e73] dark:text-[#a1a1aa] leading-relaxed max-w-3xl">
          {data.metaDescription}
        </p>
      </div>

      {/* 3 Step Workflow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {data.howItWorksSteps.map((step, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-[#15171c] border border-[#e5e5ea] dark:border-[#27272a] shadow-xs space-y-3"
          >
            <div className="w-8 h-8 rounded-xl bg-[#0071e3] text-white flex items-center justify-center font-bold text-xs">
              0{idx + 1}
            </div>
            <h3 className="font-bold text-sm text-[#1d1d1f] dark:text-white">
              {step.title}
            </h3>
            <p className="text-xs text-[#6e6e73] dark:text-[#a1a1aa] leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Privacy Advantage Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 space-y-3">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>Why In-Browser Client-Side Execution Matters</span>
        </div>
        <p className="text-xs text-[#444] dark:text-[#ccc] leading-relaxed">
          {data.privacyAdvantage}
        </p>
      </div>

      {/* Contextual Affiliate Monetization Card */}
      <ContextualPartnerCard toolId={data.slug} />

      {/* High-Intent FAQ */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-extrabold text-[#1d1d1f] dark:text-white">
          <HelpCircle className="w-5 h-5 text-[#0071e3]" />
          <span>Frequently Asked Questions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.faq.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-[#15171c] border border-[#e5e5ea] dark:border-[#27272a] shadow-xs space-y-2"
            >
              <h4 className="font-bold text-xs text-[#1d1d1f] dark:text-white">
                {item.question}
              </h4>
              <p className="text-xs text-[#6e6e73] dark:text-[#a1a1aa] leading-relaxed">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
