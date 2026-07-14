import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Laptop, Cpu, Bot, Smartphone, Video, Code, CheckCircle, 
  ArrowRight, X, Sparkles, TrendingUp, HelpCircle 
} from "lucide-react";
import { Currency, formatCurrencyValue } from "../utils/currency";
import WhyUs from "./WhyUs";

interface ServicesProps {
  onServiceSelect: (serviceName: string) => void;
  currency: Currency;
}

export default function Services({ onServiceSelect, currency }: ServicesProps) {
  const [selectedService, setSelectedService] = useState<any | null>(null);

  const services = [
    {
      id: "web-dev",
      icon: Laptop,
      title: "Business Website Development",
      shortDesc: "High-speed, custom-coded modern websites designed to convert visitors.",
      basePriceInINR: 6999,
      marketPriceInINR: 18000,
      conversionBoost: "+180% Lead Capture",
      details: [
        "100% Hand-Coded React & Tailwind (No slow WordPress themes)",
        "Stunning modern 3D perspective animations & micro-interactions",
        "Fully SEO-optimized for Google search indexing",
        "Ultra-fast loading times (95+ score on PageSpeed Insights)",
        "Built-in newsletter integrations & lead intake forms",
        "Free secure domain hosting & SSL setup support",
      ],
      timeframe: "7 Days Delivery",
      color: "blue",
    },
    {
      id: "crm",
      icon: Cpu,
      title: "Tailored CRM Creation",
      shortDesc: "Bespoke, light sales pipelines & lead management systems tailored for you.",
      basePriceInINR: 14999,
      marketPriceInINR: 50000,
      conversionBoost: "-40% Sales Admin Time",
      details: [
        "Custom pipelines matching your specific sales process",
        "Interactive dashboard displaying sales history & forecasts",
        "User roles (Admins, Sales executives, agents)",
        "Automated leads distribution & client profiling databases",
        "Custom fields, tags, filters, and records search capabilities",
        "Automated alerts for follow-ups so you never lose a client",
      ],
      timeframe: "10-14 Days Delivery",
      color: "indigo",
    },
    {
      id: "ai-agents",
      icon: Bot,
      title: "AI Agents & Chatbots",
      shortDesc: "Intelligent virtual agents trained on your business data to capture leads 24/7.",
      basePriceInINR: 14999,
      marketPriceInINR: 45000,
      conversionBoost: "24/7 Customer Coverage",
      details: [
        "Advanced LLM Chatbots for website embedding",
        "Custom-trained knowledge base containing your FAQs & catalog",
        "Automated lead screening & scheduling triggers",
        "WhatsApp Cloud API & Telegram integration options",
        "Clean transcripts viewer inside your administration panel",
        "Bilingual support (e.g. English + Hindi or regional)",
      ],
      timeframe: "7-10 Days Delivery",
      color: "purple",
    },
    {
      id: "outreach",
      icon: Smartphone,
      title: "Call Dialer & Automated Outreach",
      shortDesc: "Power dialers and automated marketing flows to multiply sales reach.",
      basePriceInINR: 24999,
      marketPriceInINR: 75000,
      conversionBoost: "+300% Outbound Reach",
      details: [
        "Bespoke browser-based auto-dialer for outbound cold leads",
        "Automated sequential campaign builders (WhatsApp + Email + SMS)",
        "Voice broadcasting with custom recorded messages",
        "Conversion triggers: follow-up immediately upon web form submit",
        "Call metrics log, tracking duration and outcomes",
        "Integration with Twilio or standard telecom gateways",
      ],
      timeframe: "14 Days Delivery",
      color: "emerald",
    },
    {
      id: "video-edit",
      icon: Video,
      title: "High-Impact Video Editing",
      shortDesc: "Stunning promotional reels, corporate edits, and YouTube assets.",
      basePriceInINR: 2999,
      marketPriceInINR: 8000,
      conversionBoost: "+240% Audience Engagement",
      details: [
        "Custom vertical video edits (Instagram Reels, YouTube Shorts, TikTok)",
        "Stunning kinetic text typography, transitions, and sound designs",
        "Product explainer videos & professional promotional clips",
        "Color grading, audio enhancement, and visual rhythm pacing",
        "Subtitles editing & voiceover sync integration",
        "Delivered in professional 4K / 1080p outputs",
      ],
      timeframe: "3-5 Days Delivery",
      color: "rose",
    },
    {
      id: "custom-software",
      icon: Code,
      title: "Software & Mobile App Development",
      shortDesc: "Fully custom cross-platform mobile apps and enterprise software solutions.",
      basePriceInINR: 34999,
      marketPriceInINR: 120000,
      conversionBoost: "Full Brand Control",
      details: [
        "Cross-platform mobile apps built with React Native or Flutter",
        "Bespoke admin control dashboards & backend system architectures",
        "Cloud database sync (Firestore or PostgreSQL) with offline support",
        "In-app push notifications & user account systems",
        "Stunning, fluid fluid animations powered by motion",
        "Full support submitting to Google Play Store & Apple App Store",
      ],
      timeframe: "21-30 Days Delivery",
      color: "violet",
    },
  ];

  return (
    <section id="services" className="py-24 bg-white relative overflow-hidden border-b-4 border-black">
      {/* Decorative vector background dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px] opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
          <div className="inline-flex items-center space-x-2 bg-yellow-300 border-2 border-black px-4 py-1.5 rounded-lg text-black shadow-[3px_3px_0px_#000000] transform -rotate-1.5">
            <span className="text-xs font-black font-comic tracking-widest uppercase">
              * OUR CAPABILITIES *
            </span>
          </div>
          <h2 className="font-sfx text-4xl sm:text-5xl lg:text-6xl font-normal tracking-normal text-slate-950 uppercase leading-none">
            Premium Services! Market-Best Rates!
          </h2>
          <p className="text-zinc-700 text-sm sm:text-base font-bold font-sketch leading-relaxed">
            We operate on thin margins to help local and international small businesses. We deliver elite, bespoke custom systems for a fraction of agency rates, beginning at {formatCurrencyValue(6999, currency)}.
          </p>
        </div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                onClick={() => setSelectedService(service)}
                className="group bg-white rounded-2xl border-3 border-black p-7 transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 shadow-[5px_5px_0px_#000000] hover:shadow-[8px_8px_0px_#3B82F6] flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-6">
                  {/* Icon & Metrics */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center border-2 border-black bg-zinc-50 text-[#3B82F6] shadow-[2.5px_2.5px_0px_#000000]">
                      <IconComponent className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <span className="text-[9px] font-mono font-black text-black bg-emerald-300 border-2 border-black px-2.5 py-1 rounded-md shadow-[1.5px_1.5px_0px_#000000] flex items-center space-x-1">
                      <TrendingUp className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{service.conversionBoost}</span>
                    </span>
                  </div>

                  {/* Copy */}
                  <div className="space-y-2.5 text-left">
                    <h3 className="text-xl font-normal font-comic text-slate-950 group-hover:text-[#3B82F6] transition-colors uppercase tracking-wide">
                      {service.title}
                    </h3>
                    <p className="text-xs font-semibold text-zinc-500 font-sans leading-relaxed">
                      {service.shortDesc}
                    </p>
                  </div>

                  {/* Bullet points previews */}
                  <ul className="space-y-2.5 pt-2 text-left">
                    {service.details.slice(0, 3).map((detail, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-zinc-700 font-bold">
                        <div className="w-4 h-4 rounded-full bg-green-400 border border-black flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-black stroke-[3]" />
                        </div>
                        <span className="truncate">{detail}</span>
                      </li>
                    ))}
                    <li className="text-[10px] text-[#3B82F6] font-black uppercase tracking-wider group-hover:underline flex items-center space-x-1.5 pt-1 cursor-pointer">
                      <span>View all features ({service.details.length})</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </li>
                  </ul>
                </div>

                {/* Bottom Pricing Row */}
                <div className="pt-6 mt-6 border-t-2 border-zinc-100 flex items-center justify-between">
                  <div>
                    <span className="block text-[8px] text-zinc-400 font-mono font-black uppercase tracking-widest leading-none">Starting from</span>
                    <span className="block text-2xl font-black text-slate-950 mt-1 font-display">
                      {formatCurrencyValue(service.basePriceInINR, currency)}
                    </span>
                    <span className="block text-[8.5px] font-mono font-extrabold text-amber-600 mt-1 uppercase tracking-wider animate-pulse">
                      * Prices Negotiable *
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onServiceSelect(service.title);
                    }}
                    className="px-4 py-2.5 text-xs font-black text-white bg-[#3B82F6] border-2 border-black rounded-xl transition-all duration-200 flex items-center space-x-1 cursor-pointer shadow-[2.5px_2.5px_0px_#000000] hover:bg-black hover:text-white"
                  >
                    <span>Build Now</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Why Us / Comparison Panel */}
        <div className="mt-20 border-2 border-black rounded-2xl bg-yellow-100 p-8 md:p-10 text-left grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-[6px_6px_0px_#000000]">
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-2xl font-black font-display text-slate-950 flex items-center space-x-2 uppercase tracking-tight">
              <Sparkles className="w-6 h-6 text-black animate-pulse stroke-[2.5]" />
              <span>Double-Difference Pricing Policy</span>
            </h3>
            <p className="text-zinc-800 text-xs sm:text-sm font-bold leading-relaxed max-w-xl">
              We hand-code elite, responsive digital platforms from scratch with no lazy templates. If you discover a certified software agency offering high-performing bespoke React pipelines for less than {formatCurrencyValue(6999, currency)}, we will double the differences. No locks, no retainers.
            </p>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-white border-2 border-black p-5 rounded-xl shadow-[4px_4px_0px_#000000]">
              <span className="block text-2xl font-black text-slate-950 font-display">{formatCurrencyValue(6999, currency)}</span>
              <span className="block text-[9px] font-mono font-black text-zinc-500 uppercase tracking-widest mt-1">Our Base Cost</span>
              <span className="block text-[8.5px] font-mono font-extrabold text-amber-600 mt-1 uppercase tracking-wider">
                * Prices Negotiable *
              </span>
            </div>
            <div className="bg-white border-2 border-black p-5 rounded-xl shadow-[4px_4px_0px_#000000]">
              <span className="block text-2xl font-black text-red-500 font-display line-through">{formatCurrencyValue(18000, currency)}+</span>
              <span className="block text-[9px] font-mono font-black text-zinc-500 uppercase tracking-widest mt-1">Market Average</span>
            </div>
          </div>
        </div>

      </div>

      {/* Detail Slide-Over Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-xl bg-white rounded-2xl border-4 border-black shadow-[12px_12px_0px_#000000] p-6 md:p-8 overflow-hidden z-10 text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-5 right-5 p-2 text-black hover:bg-zinc-100 rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_#000000] transition-all cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Header */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-zinc-50 border-2 border-black text-[#3B82F6] shadow-[2px_2px_0px_#000000] flex items-center justify-center shrink-0">
                  <selectedService.icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-2xl font-black font-display text-slate-950 uppercase tracking-tight">
                    {selectedService.title}
                  </h3>
                  <span className="inline-flex items-center space-x-1.5 text-[10px] font-mono font-black text-black bg-emerald-300 border-2 border-black px-2.5 py-0.5 rounded-md mt-1 shadow-[1.5px_1.5px_0px_#000000]">
                    <TrendingUp className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{selectedService.conversionBoost}</span>
                  </span>
                </div>
              </div>

              {/* Short Description */}
              <p className="text-zinc-600 text-sm font-bold leading-relaxed mb-6">
                {selectedService.shortDesc}
              </p>

              {/* Specs & Features List */}
              <div className="space-y-4 mb-6">
                <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-black">
                  What is Included in the Plan
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {selectedService.details.map((detail: string, idx: number) => (
                    <div key={idx} className="flex items-start space-x-2.5 text-xs text-zinc-800 font-bold">
                      <div className="w-4.5 h-4.5 rounded bg-green-400 border border-black flex items-center justify-center shrink-0 mt-0.5 shadow-[1px_1px_0px_#000000]">
                        <CheckCircle className="w-3.5 h-3.5 text-black stroke-[3]" />
                      </div>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Stats & CTA Footer */}
              <div className="pt-6 border-t-2 border-zinc-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="block text-[8px] text-zinc-400 font-mono font-black uppercase tracking-widest leading-none">Starting Rate</span>
                    <span className="block text-2xl font-black text-[#3B82F6] font-display mt-1">
                      {formatCurrencyValue(selectedService.basePriceInINR, currency)}
                    </span>
                    <span className="block text-[8.5px] font-mono font-extrabold text-amber-600 mt-1 uppercase tracking-wider animate-pulse">
                      * Prices Negotiable *
                    </span>
                  </div>
                  <div className="w-0.5 h-8 bg-zinc-200" />
                  <div>
                    <span className="block text-[8px] text-zinc-400 font-mono font-black uppercase tracking-widest leading-none">Estimated Delivery</span>
                    <span className="block text-sm font-black text-slate-950 mt-1 uppercase tracking-wider font-mono">
                      {selectedService.timeframe}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onServiceSelect(selectedService.title);
                    setSelectedService(null);
                  }}
                  className="px-6 py-3 bg-[#3B82F6] hover:bg-black hover:text-white text-white rounded-xl font-black text-xs uppercase tracking-widest border-2 border-black transition-all text-center cursor-pointer shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
                >
                  Configure Custom Estimate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Why Us section integrated at the bottom of Services */}
      <WhyUs />

    </section>
  );
}
