import React from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, Sparkles, Handshake, ShieldAlert, 
  Clock, HeartHandshake, HelpCircle 
} from "lucide-react";

export default function WhyUs() {
  const pillars = [
    {
      icon: TrendingUp,
      title: "Built for Growth, Not Just Show",
      desc: "Unlike cheap, generic firms selling static templates, our sites are active revenue engines. We optimize from day one to generate high-quality leads, rank on Google SEO, and drive customer action.",
      bgColor: "bg-[#D1FAE5]", // soft green
      borderColor: "border-emerald-500",
      accentColor: "text-emerald-700",
    },
    {
      icon: Sparkles,
      title: "Bespoke UI/UX & Brand Matching",
      desc: "Your business is unique, and your site should show it. We code from scratch to match your exact theme and workflow. Enjoy fluid animations and premium, smooth layouts that hook visitors instantly.",
      bgColor: "bg-[#DBEAFE]", // soft blue
      borderColor: "border-blue-500",
      accentColor: "text-blue-700",
    },
    {
      icon: Handshake,
      title: "Collaborative Co-Creation",
      desc: "We build with you, not for you in isolation. We stay in close touch to capture your inputs and adapt to your workflows rather than enforcing whatever shortcut is easiest for our developers.",
      bgColor: "bg-[#FEF3C7]", // soft yellow/amber
      borderColor: "border-amber-500",
      accentColor: "text-amber-700",
    },
    {
      icon: ShieldAlert,
      title: "1-Month Free Post-Launch Revisions",
      desc: "Change your mind about a layout, copy, or images? No problem. We provide 100% free layout and content changes for the first 30 days post-launch. Complete peace of mind, guaranteed.",
      bgColor: "bg-[#FCE7F3]", // soft pink
      borderColor: "border-pink-500",
      accentColor: "text-pink-700",
    },
    {
      icon: HeartHandshake,
      title: "End-to-End Relations & 24/7 Help",
      desc: "We don't believe in transactional client handoffs. We build lifelong partnerships with reliable end-to-end assistance, priority hosting guidance, and round-the-clock developer availability.",
      bgColor: "bg-[#EDE9FE]", // soft purple
      borderColor: "border-purple-500",
      accentColor: "text-purple-700",
    },
    {
      icon: Clock,
      title: "Guaranteed Timelines & Fair Cost",
      desc: "Have a strict launch date? We stick to it—whether decided by us or custom-requested by you. Enjoy high-end boutique agency quality at a fraction of the cost, with zero hidden platform markups.",
      bgColor: "bg-[#F3F4F6]", // soft gray
      borderColor: "border-zinc-500",
      accentColor: "text-zinc-700",
    },
  ];

  return (
    <section className="py-20 bg-transparent border-b-4 border-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-yellow-300 border-2 border-black px-4 py-1.5 rounded-lg text-black shadow-[3px_3px_0px_#000000] transform -rotate-1">
            <HelpCircle className="w-4 h-4 text-black stroke-[2.5]" />
            <span className="text-xs font-black font-comic tracking-widest uppercase">
              * THE WEBXCEL DIFFERENCE *
            </span>
          </div>
          
          <h2 className="font-sfx text-4xl sm:text-5xl font-normal text-slate-950 uppercase tracking-tight leading-none">
            Why Work With Us?
          </h2>
          
          <p className="text-zinc-700 text-sm font-bold font-sketch leading-relaxed">
            Most generic firms hand over bloated templates and walk away. We engineer custom-coded, ultra-fast web systems that build relationships and scale businesses.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`group border-4 border-black p-6 rounded-2xl bg-white shadow-[4px_4px_0px_#000000] hover:shadow-[8px_8px_0px_#000000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 text-left flex flex-col justify-between`}
              >
                <div>
                  {/* Icon Block */}
                  <div className={`w-12 h-12 rounded-xl border-2 border-black ${pillar.bgColor} flex items-center justify-center shadow-[2px_2px_0px_#000000] group-hover:scale-110 transition-transform mb-6`}>
                    <IconComponent className={`w-6 h-6 stroke-[2.5] ${pillar.accentColor}`} />
                  </div>

                  {/* Text Details */}
                  <h3 className="font-display font-black text-lg uppercase tracking-tight text-slate-950 mb-3">
                    {pillar.title}
                  </h3>
                  
                  <p className="text-zinc-600 text-xs font-bold leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                {/* Subtag decorator */}
                <div className="mt-6 pt-4 border-t-2 border-dashed border-zinc-200 flex items-center justify-between">
                  <span className="text-[9px] font-mono font-black uppercase text-zinc-400">
                    // Premium Guarantee
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-black" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
