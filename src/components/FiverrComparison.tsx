import { motion } from "motion/react";
import { 
  ArrowRight, ShieldCheck, DollarSign, Clock, MessageSquare, 
  AlertTriangle, Check, X, Sparkles, HelpCircle, Trophy, Globe, Code
} from "lucide-react";
import { Currency, formatCurrencyValue } from "../utils/currency";

interface FiverrComparisonProps {
  onPageChange: (pageId: string) => void;
  currency: Currency;
}

export default function FiverrComparison({ onPageChange, currency }: FiverrComparisonProps) {
  const comparisonCards = [
    {
      icon: DollarSign,
      title: "Zero Platform Markup",
      desc: "Fiverr charges up to a 20% commission on both the buyer and seller ends. By working directly with us, you pay raw flat-rate engineering costs starting at just " + formatCurrencyValue(6999, currency) + ", with absolutely zero hidden middleman markup.",
      metric: "Save 20%+ In Fees",
      color: "bg-emerald-100 text-emerald-800 border-emerald-400"
    },
    {
      icon: Code,
      title: "Clean React vs Bloated Templates",
      desc: "Many freelance developers on gig portals import slow, vulnerable WordPress themes or copy-paste buggy scripts to hit volume. We write 100% hand-coded React, Tailwind, and Express code designed to load in under a second.",
      metric: "95+ PageSpeed Score",
      color: "bg-blue-100 text-blue-800 border-blue-400"
    },
    {
      icon: Clock,
      title: "30-Day Revisions Guarantee",
      desc: "Fiverr auto-completes orders 3 days after delivery, leaving you stranded if bugs arise. WEBXcel provides a 1-month SLA post-launch window for free revisions, support, content modifications, and complete peace of mind.",
      metric: "30 Days SLA Support",
      color: "bg-rose-100 text-rose-800 border-rose-400"
    },
    {
      icon: MessageSquare,
      title: "Direct Founder Access",
      desc: "Ditch the broken translation barriers, timezone gaps, and agency accounts disguised as freelancers. You collaborate directly with Ujjwal and Raj—the lead developers who actually write and ship your software assets.",
      metric: "Direct WhatsApp Line",
      color: "bg-amber-100 text-amber-800 border-amber-400"
    }
  ];

  return (
    <section className="py-24 bg-transparent relative overflow-hidden border-b-4 border-black text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
          <div className="inline-flex items-center space-x-2 bg-yellow-300 border-2 border-black px-4 py-1.5 rounded-lg text-black shadow-[3px_3px_0px_#000000] transform -rotate-1.5">
            <Trophy className="w-4 h-4 animate-bounce text-black stroke-[2.5]" />
            <span className="text-xs font-black font-comic tracking-widest uppercase">
              * THE DIRECT ADVANTAGE *
            </span>
          </div>
          <h1 className="font-sfx text-4xl sm:text-5xl lg:text-6xl font-normal tracking-normal text-slate-950 uppercase leading-none">
            Direct Engineering vs. Fiverr Gigs!
          </h1>
          <p className="text-zinc-700 text-sm sm:text-base font-bold font-sketch leading-relaxed">
            Hiring random freelancers on Fiverr or Upwork often leads to poor communication, generic templates, and high platform fees. WEBXcel offers direct, professional software engineering tailored for US and Indian small businesses.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {comparisonCards.map((card, idx) => {
            const IconComp = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white border-3 border-black p-6 sm:p-8 rounded-2xl shadow-[5px_5px_0px_#000000] hover:shadow-[8px_8px_0px_#3B82F6] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-zinc-50 border-2 border-black text-[#3B82F6] flex items-center justify-center shadow-[2px_2px_0px_#000000]">
                      <IconComp className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <span className={`px-2.5 py-0.5 text-[9px] font-mono font-black border rounded-md uppercase tracking-wider ${card.color}`}>
                      {card.metric}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-zinc-600 text-xs sm:text-sm font-semibold leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Head-to-Head Neo-Brutalist Comparison Matrix */}
        <div className="mb-20 border-3 border-black rounded-2xl bg-white overflow-hidden shadow-[6px_6px_0px_#000000] max-w-4xl mx-auto">
          <div className="bg-yellow-300 border-b-3 border-black p-5 text-center">
            <h3 className="text-xl font-black uppercase text-slate-950 flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5 text-black stroke-[3]" />
              <span>Head-to-Head Comparison Matrix</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-zinc-50 border-b-2 border-black">
                  <th className="p-4 text-xs font-mono font-black uppercase tracking-wider text-slate-900 border-r-2 border-black">Feature / Metric</th>
                  <th className="p-4 text-xs font-mono font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border-r-2 border-black">WEBXcel (Direct)</th>
                  <th className="p-4 text-xs font-mono font-black uppercase tracking-wider text-rose-700 bg-rose-50">Freelance Portals (Fiverr)</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black text-xs font-bold text-slate-900">
                <tr className="border-b-2 border-black">
                  <td className="p-4 border-r-2 border-black font-mono uppercase bg-zinc-50/50">Markup Platform Fees</td>
                  <td className="p-4 border-r-2 border-black bg-emerald-50/30 text-emerald-600 flex items-center space-x-1.5">
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>0% (Direct pricing)</span>
                  </td>
                  <td className="p-4 text-rose-600">
                    <div className="flex items-center space-x-1.5">
                      <X className="w-4 h-4 stroke-[3]" />
                      <span>20%+ (Charged on buyers & sellers)</span>
                    </div>
                  </td>
                </tr>
                <tr className="border-b-2 border-black">
                  <td className="p-4 border-r-2 border-black font-mono uppercase bg-zinc-50/50">Codebase Ownership</td>
                  <td className="p-4 border-r-2 border-black bg-emerald-50/30 text-emerald-600 flex items-center space-x-1.5">
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>100% IP rights + Raw Repo handover</span>
                  </td>
                  <td className="p-4 text-rose-600 flex items-center space-x-1.5">
                    <X className="w-4 h-4 stroke-[3]" />
                    <span>Proprietary locked templates often reused</span>
                  </td>
                </tr>
                <tr className="border-b-2 border-black">
                  <td className="p-4 border-r-2 border-black font-mono uppercase bg-zinc-50/50">Post-Launch Revisions</td>
                  <td className="p-4 border-r-2 border-black bg-emerald-50/30 text-emerald-600 flex items-center space-x-1.5">
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>30 days free support SLA</span>
                  </td>
                  <td className="p-4 text-rose-600 flex items-center space-x-1.5">
                    <X className="w-4 h-4 stroke-[3]" />
                    <span>Auto-closed after 72 hours</span>
                  </td>
                </tr>
                <tr className="border-b-2 border-black">
                  <td className="p-4 border-r-2 border-black font-mono uppercase bg-zinc-50/50">Communication</td>
                  <td className="p-4 border-r-2 border-black bg-emerald-50/30 text-emerald-600 flex items-center space-x-1.5">
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Direct engineering line (WhatsApp/Calls)</span>
                  </td>
                  <td className="p-4 text-rose-600 flex items-center space-x-1.5">
                    <X className="w-4 h-4 stroke-[3]" />
                    <span>Only via dashboard (Middlemen barrier)</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-r-2 border-black font-mono uppercase bg-zinc-50/50">Uptime Optimization</td>
                  <td className="p-4 border-r-2 border-black bg-emerald-50/30 text-emerald-600 flex items-center space-x-1.5">
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Included (AWS, Vercel, VPS configs)</span>
                  </td>
                  <td className="p-4 text-rose-600 flex items-center space-x-1.5">
                    <X className="w-4 h-4 stroke-[3]" />
                    <span>Usually extra addon charge ($$$)</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Geographic targeted outreach box */}
        <div className="border-3 border-black bg-blue-100 p-8 rounded-2xl shadow-[5px_5px_0px_#000000] flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
          <div className="space-y-2 max-w-xl">
            <h4 className="text-lg font-black text-slate-950 uppercase tracking-tight flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600 stroke-[2.5]" />
              <span>Tailored for USA & India Collaborations</span>
            </h4>
            <p className="text-zinc-700 text-xs sm:text-sm font-semibold leading-relaxed">
              We manage development cycles across timezone crossovers seamlessly. Whether you require contract-backed SLA pipelines in the United States or localized UPI-ready dynamic operations in India, we deliver high-performance code mapped to your country's specifications.
            </p>
          </div>
          <div className="shrink-0 flex gap-3 text-xs font-black uppercase tracking-wider font-mono">
            <span className="bg-white border-2 border-black px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_#000000]">🇺🇸 USD Setup</span>
            <span className="bg-white border-2 border-black px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_#000000]">🇮🇳 INR Setup</span>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-yellow-100 border-4 border-black p-8 sm:p-12 rounded-3xl shadow-[6px_6px_0px_#000000] space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-950 uppercase tracking-tight">
            Stop Paying Platform Markups!
          </h2>
          <p className="text-zinc-800 text-xs sm:text-sm font-bold leading-relaxed max-w-2xl mx-auto">
            Why spend more on Upwork/Fiverr markup fees to get slow template-based setups? Work directly with a dedicated software engineering team that hand-codes React platforms for speed, conversions, and growth.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <button
              onClick={() => onPageChange("estimator")}
              className="px-8 py-4 bg-[#3B82F6] hover:bg-black hover:text-white text-white rounded-xl font-black text-xs uppercase tracking-widest border-2 border-black transition-all flex items-center space-x-2 cursor-pointer shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
            >
              <span>Build Custom Estimate</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
            <button
              onClick={() => onPageChange("services")}
              className="px-8 py-4 bg-white hover:bg-zinc-100 text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest border-2 border-black transition-all flex items-center space-x-2 cursor-pointer shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
            >
              <span>Explore Services</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
