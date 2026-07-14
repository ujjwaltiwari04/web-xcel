import { motion } from "motion/react";
import { Check, HelpCircle, AlertCircle, X, ShieldCheck } from "lucide-react";
import { Currency, formatCurrencyValue } from "../utils/currency";
import WhyUs from "./WhyUs";
import FAQ from "./FAQ";

interface PricingProps {
  onPlanSelect: (planName: string, amount: string) => void;
  currency: Currency;
}

export default function Pricing({ onPlanSelect, currency }: PricingProps) {
  const plans = [
    {
      name: "Starter Web Presence",
      priceInINR: 6999,
      originalPriceInINR: 18000,
      description: "Perfect for local physical shops, clinics, and professionals seeking an online footprint.",
      features: [
        "Single-Page fully responsive 3D design",
        "Hand-coded custom React/Vite (No WP bloat)",
        "Integrated interactive customer lead form",
        "Direct email/WhatsApp lead notifications",
        "Google Maps & business locator placement",
        "Free secure Domain setup support",
        "7 Days Express Delivery timeline",
      ],
      popular: false,
      ctaText: "Choose Starter Plan",
      targetBusiness: "Local Shops & Professionals",
    },
    {
      name: "Business Growth Pack",
      priceInINR: 14999,
      originalPriceInINR: 50000,
      description: "Full professional website paired with a light CRM to capture, track, and close deals.",
      features: [
        "Up to 5 Pages fully custom responsive layouts",
        "Bespoke lightweight Lead Tracking CRM Board",
        "Multiple conversion landing-page sequences",
        "Automated client profiling dashboard panels",
        "Custom fields, tags, and pipeline controls",
        "Automated email marketing intake loops",
        "14 Days Rapid Delivery timeline",
        "30 Days of dedicated post-launch support",
      ],
      popular: true,
      ctaText: "Choose Growth Plan",
      targetBusiness: "Service Agencies & E-commerce",
    },
    {
      name: "Elite AI & CRM Suite",
      priceInINR: 39999,
      originalPriceInINR: 120000,
      description: "Ultimate business setup implementing intelligent AI chatbots and outbound outreach automation.",
      features: [
        "Multi-page bespoke responsive business platform",
        "Bespoke high-end CRM tailored to your processes",
        "Gemini-powered Customer Support Chatbot on-site",
        "Auto-dialer Cold Outreach tool configuration",
        "WhatsApp Cloud API & Twilio sequences",
        "2 Corporate explainer Video edits (Reels/Ads)",
        "21-30 Days Dedicated Engineering build",
        "90 Days of enterprise-grade priority support",
      ],
      popular: false,
      ctaText: "Choose Elite Suite",
      targetBusiness: "Ambitious Scaling Brands",
    }
  ];

  return (
    <>
      <section id="pricing" className="py-24 bg-transparent border-b-4 border-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-[#3B82F6] border-2 border-black px-4 py-1.5 rounded-lg text-white shadow-[3px_3px_0px_#000000] transform rotate-1">
            <span className="text-xs font-black font-comic tracking-widest uppercase">
              * PRICING OPTIONS *
            </span>
          </div>
          <h1 className="font-sfx text-4xl sm:text-5xl font-normal tracking-normal text-slate-950 uppercase leading-none">
            Plain Pricing! Zero Retainers!
          </h1>
          <p className="text-zinc-700 text-sm font-bold font-sketch leading-relaxed">
            No recurring hidden host commissions, no forced license lockdowns. You own the code. Pick a plan below, configure your needs, and secure the absolute best rate from the market.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const formattedPrice = formatCurrencyValue(plan.priceInINR, currency);
            const formattedOriginalPrice = formatCurrencyValue(plan.originalPriceInINR, currency);
            const savePercent = Math.round((1 - plan.priceInINR / plan.originalPriceInINR) * 100);

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`bg-white rounded-xl border-4 border-black p-8 flex flex-col justify-between text-left relative transition-all duration-200 hover:-translate-y-2 h-full ${
                  plan.popular 
                    ? "shadow-[8px_8px_0px_#FDE047] md:-translate-y-4"
                    : "shadow-[4px_4px_0px_#000000]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#3B82F6] text-white font-mono font-black text-[10px] tracking-widest uppercase px-4 py-1.5 rounded-lg border-2 border-black shadow-[2.5px_2.5px_0px_#000000]">
                    Most Popular Pack
                  </div>
                )}

                <div className="space-y-6">
                  {/* Header info */}
                  <div>
                    <span className="block text-[9px] font-mono font-black text-zinc-400 uppercase tracking-widest">
                      {plan.targetBusiness}
                    </span>
                    <h3 className="text-xl font-normal font-comic text-slate-950 uppercase tracking-wide mt-1">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-zinc-500 font-bold leading-relaxed mt-2 h-10">
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing section */}
                  <div className="pt-2 border-t-2 border-zinc-100">
                    <div className="flex items-end space-x-2">
                      <span className="text-4xl font-black text-slate-950 font-display">
                        {formattedPrice}
                      </span>
                      <span className="text-sm text-zinc-400 line-through font-mono font-bold pb-1.5">
                        {formattedOriginalPrice}
                      </span>
                      <span className="text-[9px] font-mono font-black text-emerald-800 bg-emerald-300 px-2 py-0.5 rounded border border-emerald-500 mb-1.5">
                        SAVE {savePercent}%
                      </span>
                    </div>
                    <span className="block text-[10px] font-mono font-extrabold text-amber-600 mt-1 uppercase tracking-wider animate-pulse">
                      * Prices Negotiable *
                    </span>
                  </div>

                  {/* Bullet feature list */}
                  <div className="space-y-3 pt-4 border-t-2 border-zinc-100">
                    <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-black">
                      What's Included:
                    </span>
                    <ul className="space-y-2.5">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start space-x-2.5 text-xs text-slate-850 font-extrabold">
                          <div className="w-4 h-4 rounded-full bg-emerald-300 border border-black flex items-center justify-center text-black shrink-0 mt-0.5 shadow-[1px_1px_0px_#000000]">
                            <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => onPlanSelect(plan.name, formattedPrice)}
                  className={`w-full text-center py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer mt-8 shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 border-2 border-black ${
                    plan.popular
                      ? "bg-yellow-300 hover:bg-black hover:text-white text-black"
                      : "bg-[#3B82F6] hover:bg-black hover:text-white text-white"
                  }`}
                >
                  {plan.ctaText}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Core Guarantee banner */}
        <div className="mt-16 bg-white border-4 border-black rounded-xl p-6 md:p-8 text-left flex flex-col md:flex-row items-center justify-between gap-6 shadow-[6px_6px_0px_#000000]">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-300 text-black border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000000]">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-950 font-display uppercase tracking-tight">
                100% Risk-Free Guarantee Policy
              </h4>
              <p className="text-xs text-zinc-600 font-bold leading-relaxed max-w-xl mt-1">
                We believe in establishing deep client partnerships. If our hand-coded deliverables fail to match the initial project blueprint guidelines defined during consultation, we will issue a full, instant refund. Zero questions asked.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex flex-wrap items-center gap-4 font-mono text-[9px] font-black text-zinc-400 uppercase tracking-wider">
            <span>· No Setup fees</span>
            <span>· Own All Code Rights</span>
            <span>· Cancel anytime</span>
          </div>
        </div>

      </div>
      </section>
      <WhyUs />
      <FAQ />
    </>
  );
}
