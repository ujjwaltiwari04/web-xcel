import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Laptop, Cpu, Sparkles, FolderGit, Check, ArrowRight,
  TrendingUp, LayoutGrid, Award, PlayCircle, Layers, CheckCircle2 
} from "lucide-react";
import { Currency, formatCurrencyValue } from "../utils/currency";

interface LeadItem {
  id: string;
  name: string;
  business: string;
  value: number;
}

interface PortfolioProps {
  currency: Currency;
}

export default function Portfolio({ currency }: PortfolioProps) {
  const [activeTab, setActiveTab] = useState<'crm-board' | 'web-portfolio' | 'video-work'>('crm-board');
  
  // Interactive States for individual website mockups to replace empty AI boxes
  const [ecoQty, setEcoQty] = useState(1);
  const [ecoSuccess, setEcoSuccess] = useState(false);

  const [selectedApexId, setSelectedApexId] = useState("prop-1");
  const [apexSubmitted, setApexSubmitted] = useState(false);

  const [vedicSelected, setVedicSelected] = useState("Kesar Serum");
  const [vedicSuccess, setVedicSuccess] = useState(false);

  // Interactive CRM Demo State
  const [crmStages, setCrmStages] = useState<{ [key: string]: LeadItem[] }>({
    newLeads: [
      { id: "lead-1", name: "Dr. Aditya Sen", business: "Dental Clinic Setup", value: 24999 },
      { id: "lead-2", name: "Ananya Mehta", business: "Organic Skincare E-comm", value: 34999 },
    ],
    inDiscussion: [
      { id: "lead-3", name: "Rajat Verma", business: "Property Brokerages", value: 19999 },
    ],
    wonDeals: [
      { id: "lead-4", name: "Suresh Gupta", business: "Cloud Kitchen Network", value: 59999 },
    ]
  });

  const [lastAction, setLastAction] = useState<string | null>(null);

  // Simple interactive step logic to simulate dragging/moving leads
  const moveLead = (leadId: string, sourceStage: string, targetStage: string) => {
    const sourceLeads = [...crmStages[sourceStage]];
    const targetLeads = [...crmStages[targetStage]];
    
    const leadIndex = sourceLeads.findIndex(l => l.id === leadId);
    if (leadIndex === -1) return;
    
    const [movedLead] = sourceLeads.splice(leadIndex, 1);
    targetLeads.push(movedLead);
    
    setCrmStages({
      ...crmStages,
      [sourceStage]: sourceLeads,
      [targetStage]: targetLeads
    });

    setLastAction(`Moved "${movedLead.name}" to ${targetStage === 'wonDeals' ? 'Won Deals 🎉' : 'In Discussion 💬'}`);
    setTimeout(() => setLastAction(null), 3000);
  };

  const resetCRM = () => {
    setCrmStages({
      newLeads: [
        { id: "lead-1", name: "Dr. Aditya Sen", business: "Dental Clinic Setup", value: 24999 },
        { id: "lead-2", name: "Ananya Mehta", business: "Organic Skincare E-comm", value: 34999 },
      ],
      inDiscussion: [
        { id: "lead-3", name: "Rajat Verma", business: "Property Brokerages", value: 19999 },
      ],
      wonDeals: [
        { id: "lead-4", name: "Suresh Gupta", business: "Cloud Kitchen Network", value: 59999 },
      ]
    });
  };

  const webProjects = [
    {
      title: "EcoGlow Skincare",
      desc: "Full-stack headless e-commerce build for a high-end clean B2C skincare line.",
      stats: "+240% Checkout Conversion",
      loadTime: "0.4s (PageSpeed Score: 98)",
      techStack: ["React", "Vite", "Tailwind", "Stripe API"],
      previewMockup: "bg-radial from-indigo-50 to-white",
    },
    {
      title: "Apex Real Estate Network",
      desc: "High-performance landing platform with integrated instant automated lead forms and client maps.",
      stats: "+180% Form Submissions",
      loadTime: "0.5s (PageSpeed Score: 96)",
      techStack: ["React", "Google Maps Platform", "Lead CRM"],
      previewMockup: "bg-radial from-emerald-50 to-white",
    },
    {
      title: "Vedic Roots Boutique",
      desc: "Luxury ayurvedic products showcase with customized WhatsApp ordering workflows.",
      stats: "3x Direct Sales Inquiries",
      loadTime: "0.3s (PageSpeed Score: 99)",
      techStack: ["React", "Tailwind", "WhatsApp API"],
      previewMockup: "bg-radial from-rose-50 to-white",
    }
  ];

  const videoEdits = [
    {
      client: "Aura AI SaaS Startup",
      category: "SaaS Explainer Reel",
      impact: "1.2 Million Views across Reels",
      techniques: ["Kinetic Typography", "Visual Pacing", "3D Hologram overlays"],
      delivery: "36 Hours"
    },
    {
      client: "Capital Wealth Advisors",
      category: "Corporate Brand Promo",
      impact: "+350% Ad Engagement",
      techniques: ["Dynamic Color Grading", "Audio Rhythm Synchronization", "Custom Lower Thirds"],
      delivery: "48 Hours"
    }
  ];

  return (
    <section id="portfolio" className="py-24 bg-transparent relative overflow-hidden border-b-4 border-black">
      {/* Decorative vector background dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-left space-y-8 mb-16">
          <div className="space-y-4 max-w-4xl">
            <div className="inline-flex items-center space-x-2 bg-yellow-300 border-2 border-black px-4 py-1.5 rounded-lg text-black shadow-[3px_3px_0px_#000000] transform -rotate-1">
              <span className="text-xs font-black font-comic tracking-widest uppercase">
                * INTERACTIVE SHOWCASE *
              </span>
            </div>
            <h2 className="font-sfx text-4xl sm:text-5xl font-normal tracking-normal text-slate-950 uppercase leading-none">
              Real Execution! Try it Live!
            </h2>
            <p className="text-zinc-700 text-sm font-bold font-sketch">
              We don't just talk about software competence; we showcase it. Toggle the tabs below to explore our real interactive CRM mockup or review our high-converting design systems.
            </p>
          </div>

          {/* Tab Selector - Positioned beautifully below the description paragraph, spanning full horizontal line */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 w-full bg-zinc-100 p-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000]">
            <button
              onClick={() => setActiveTab('crm-board')}
              className={`w-full py-3 px-4 text-xs sm:text-sm font-black font-mono tracking-wider uppercase rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'crm-board'
                  ? "bg-[#3B82F6] text-white border-2 border-black shadow-[2.5px_2.5px_0px_#000000]"
                  : "text-zinc-600 hover:text-black hover:bg-white bg-white/60 border-2 border-transparent"
              }`}
            >
              <Cpu className="w-4 h-4 shrink-0 stroke-[2.5]" />
              <span>CRM Board Demo</span>
            </button>

            <button
              onClick={() => setActiveTab('web-portfolio')}
              className={`w-full py-3 px-4 text-xs sm:text-sm font-black font-mono tracking-wider uppercase rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'web-portfolio'
                  ? "bg-[#3B82F6] text-white border-2 border-black shadow-[2.5px_2.5px_0px_#000000]"
                  : "text-zinc-600 hover:text-black hover:bg-white bg-white/60 border-2 border-transparent"
              }`}
            >
              <Laptop className="w-4 h-4 shrink-0 stroke-[2.5]" />
              <span>Websites & Apps</span>
            </button>

            <button
              onClick={() => setActiveTab('video-work')}
              className={`w-full py-3 px-4 text-xs sm:text-sm font-black font-mono tracking-wider uppercase rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'video-work'
                  ? "bg-[#3B82F6] text-white border-2 border-black shadow-[2.5px_2.5px_0px_#000000]"
                  : "text-zinc-600 hover:text-black hover:bg-white bg-white/60 border-2 border-transparent"
              }`}
            >
              <PlayCircle className="w-4 h-4 shrink-0 stroke-[2.5]" />
              <span>Video Edits</span>
            </button>
          </div>
        </div>

        {/* Tab Content Panels */}
        <div className="min-h-[450px]">
          <AnimatePresence mode="wait">
            
            {/* Interactive CRM Board Panel */}
            {activeTab === 'crm-board' && (
              <motion.div
                key="crm-board"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* Left explanation side */}
                <div className="lg:col-span-4 text-left space-y-6">
                  <div className="flex items-center space-x-2 text-[#3B82F6] font-black text-xs font-mono uppercase tracking-widest">
                    <Sparkles className="w-4 h-4 stroke-[2.5]" />
                    <span>Active CRM Prototype</span>
                  </div>
                  <h3 className="text-2xl font-black font-display text-slate-950 uppercase tracking-tight">
                    Pipelines tailored for your sales flow.
                  </h3>
                  <p className="text-zinc-600 text-xs font-bold leading-relaxed">
                    Small businesses lose up to 62% of incoming web inquiries because they are recorded in cluttered WhatsApp logs or Excel sheets. Our customized CRMs keep leads secure.
                  </p>
                  <p className="text-zinc-600 text-xs font-bold leading-relaxed">
                    <strong>Click the action buttons on the leads card to simulate moving prospects</strong> through stages in real-time. This is exactly how we automate pipeline updates for our client installations.
                  </p>

                  <div className="pt-2 flex flex-col space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold border-b-2 border-zinc-100 pb-2">
                      <span className="text-zinc-400">Avg. Market Price:</span>
                      <span className="text-red-400 line-through font-mono">{formatCurrencyValue(50000, currency)}+</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-900">Our Tailored Price:</span>
                      <span className="text-[#3B82F6] font-black font-mono">{formatCurrencyValue(19999, currency)}</span>
                    </div>
                    <button
                      onClick={resetCRM}
                      className="mt-2 text-xs text-[#3B82F6] hover:underline font-black uppercase tracking-wider block cursor-pointer self-start"
                    >
                      Reset CRM Demo State
                    </button>
                  </div>
                </div>

                {/* Interactive Kanban Board on the right */}
                <div className="lg:col-span-8 bg-zinc-50 border-4 border-black rounded-2xl p-6 relative shadow-[6px_6px_0px_#000000]">
                  
                  {/* Visual Status Alerts */}
                  <AnimatePresence>
                    {lastAction && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-2 left-6 right-6 z-10 bg-emerald-400 text-black text-xs font-mono font-black py-2 rounded-xl text-center border-2 border-black shadow-[3px_3px_0px_#000000]"
                      >
                        {lastAction}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                    
                    {/* Stage 1: New Inquiries */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-2">
                        <span className="text-[10px] font-mono font-black text-zinc-500 uppercase">1. New Leads ({crmStages.newLeads.length})</span>
                      </div>
                      <div className="space-y-3.5 min-h-[250px]">
                        {crmStages.newLeads.map((lead) => (
                          <div key={lead.id} className="bg-white border-2 border-black p-4 rounded-xl shadow-[3px_3px_0px_#000000] relative">
                            <span className="block text-xs font-black text-slate-900">{lead.name}</span>
                            <span className="block text-[10px] font-bold text-zinc-500 mt-0.5">{lead.business}</span>
                            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-zinc-100">
                              <span className="text-xs font-mono font-black text-[#3B82F6]">{formatCurrencyValue(lead.value, currency)}</span>
                              <button
                                onClick={() => moveLead(lead.id, 'newLeads', 'inDiscussion')}
                                className="text-[9px] bg-[#3B82F6] hover:bg-black hover:text-white text-white border-2 border-black px-2.5 py-1 rounded-md font-mono font-black transition-all cursor-pointer flex items-center space-x-1 shadow-[1.5px_1.5px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
                              >
                                <span>Discuss</span>
                                <ArrowRight className="w-2.5 h-2.5 stroke-[2.5]" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stage 2: In Discussion */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-2">
                        <span className="text-[10px] font-mono font-black text-[#3B82F6] uppercase">2. In Touch ({crmStages.inDiscussion.length})</span>
                      </div>
                      <div className="space-y-3.5 min-h-[250px]">
                        {crmStages.inDiscussion.length === 0 ? (
                          <div className="border-2 border-dashed border-zinc-300 rounded-xl h-36 flex items-center justify-center text-xs font-bold text-zinc-400">
                            Move cards here
                          </div>
                        ) : (
                          crmStages.inDiscussion.map((lead) => (
                            <div key={lead.id} className="bg-white border-2 border-black p-4 rounded-xl shadow-[3px_3px_0px_#000000] relative">
                              <span className="block text-xs font-black text-slate-900">{lead.name}</span>
                              <span className="block text-[10px] font-bold text-zinc-500 mt-0.5">{lead.business}</span>
                              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-zinc-100">
                                <span className="text-xs font-mono font-black text-[#3B82F6]">{formatCurrencyValue(lead.value, currency)}</span>
                                <button
                                  onClick={() => moveLead(lead.id, 'inDiscussion', 'wonDeals')}
                                  className="text-[9px] bg-emerald-400 hover:bg-black hover:text-white text-black border-2 border-black px-2.5 py-1 rounded-md font-mono font-black transition-all cursor-pointer flex items-center space-x-0.5 shadow-[1.5px_1.5px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
                                >
                                  <span>Win Deal</span>
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Stage 3: Closed Won */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-2">
                        <span className="text-[10px] font-mono font-black text-emerald-600 uppercase">3. Won Deals ({crmStages.wonDeals.length})</span>
                      </div>
                      <div className="space-y-3.5 min-h-[250px]">
                        {crmStages.wonDeals.length === 0 ? (
                          <div className="border-2 border-dashed border-zinc-300 rounded-xl h-36 flex items-center justify-center text-xs font-bold text-zinc-400">
                            No won deals yet
                          </div>
                        ) : (
                          crmStages.wonDeals.map((lead) => (
                            <div key={lead.id} className="bg-emerald-50 border-2 border-black p-4 rounded-xl shadow-[3px_3px_0px_#000000] relative">
                              <div className="absolute top-2.5 right-2.5 text-black bg-emerald-300 border border-black p-1 rounded-md">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                              <span className="block text-xs font-black text-slate-900">{lead.name}</span>
                              <span className="block text-[10px] font-bold text-zinc-500 mt-0.5">{lead.business}</span>
                              <div className="mt-3 pt-2.5 border-t border-black flex items-center justify-between">
                                <span className="text-xs font-mono font-black text-emerald-600">{formatCurrencyValue(lead.value, currency)}</span>
                                <span className="text-[8px] font-mono font-black text-black bg-emerald-300 px-1.5 py-0.5 rounded border border-black">PAID & LAUNCHED</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>
                </div>

              </motion.div>
            )}

            {/* Websites & Apps Portfolio Panel */}
            {activeTab === 'web-portfolio' && (
              <motion.div
                key="web-portfolio"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left"
              >
                {webProjects.map((project, idx) => (
                  <div 
                    key={idx}
                    className="group bg-white border-2 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_#000000] hover:shadow-[8px_8px_0px_#3B82F6] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
                  >
                    {/* Simulated Laptop Frame Area */}
                    <div className="p-6 aspect-video bg-zinc-50 flex flex-col justify-between relative overflow-hidden border-b-2 border-black">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-black text-white bg-[#3B82F6] border-2 border-black px-2.5 py-0.5 rounded-md shadow-[1.5px_1.5px_0px_#000000]">
                          {project.loadTime}
                        </span>
                        <span className="text-[9px] font-mono text-black font-black bg-emerald-300 border-2 border-black px-2.5 py-0.5 rounded-md shadow-[1.5px_1.5px_0px_#000000]">
                          {project.stats}
                        </span>
                      </div>
                      
                      {/* Highly Tactile, Interactive Live Mockup Custom Previews */}
                      <div className="w-full bg-white rounded-lg border-2 border-black p-3.5 mt-3 relative z-10 translate-y-1 shadow-[2px_2px_0px_#000000]">
                        {/* Browser Top Tab styling */}
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-1.5 mb-2">
                          <div className="flex items-center space-x-1">
                            <span className="w-2 h-2 rounded-full bg-rose-400 border border-black" />
                            <span className="w-2 h-2 rounded-full bg-yellow-400 border border-black" />
                            <span className="w-2 h-2 rounded-full bg-emerald-400 border border-black" />
                          </div>
                          <span className="text-[7px] font-mono font-black text-zinc-400 uppercase tracking-wider">https://client-staging.io</span>
                        </div>

                        {idx === 0 && (
                          <div id="ecoglow-interactive-demo" className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1.5">
                                <span className="text-base select-none">🧴</span>
                                <div className="text-left">
                                  <span className="block text-[8px] font-black text-slate-900 leading-none">GLOW ESSENCE</span>
                                  <span className="text-[7px] font-mono font-black text-[#3B82F6]">{formatCurrencyValue(1499, currency)}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-1 bg-zinc-50 border border-black p-0.5 rounded">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); if (ecoQty > 1) setEcoQty(ecoQty - 1); }}
                                  className="w-4 h-4 bg-white hover:bg-zinc-100 border border-zinc-300 rounded flex items-center justify-center font-black text-[9px] cursor-pointer select-none"
                                >
                                  -
                                </button>
                                <span className="text-[8px] font-mono font-black w-3 text-center">{ecoQty}</span>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setEcoQty(ecoQty + 1); }}
                                  className="w-4 h-4 bg-white hover:bg-zinc-100 border border-zinc-300 rounded flex items-center justify-center font-black text-[9px] cursor-pointer select-none"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEcoSuccess(true);
                                setTimeout(() => setEcoSuccess(false), 2200);
                              }}
                              className="w-full bg-[#3B82F6] hover:bg-black text-white border border-black py-1 rounded text-[8px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer shadow-[1.5px_1.5px_0px_#000000] active:translate-y-0.5"
                            >
                              {ecoSuccess ? "✓ Stripe Checkout Success! 💳" : `Pay Now • ${formatCurrencyValue(1499 * ecoQty, currency)}`}
                            </button>
                          </div>
                        )}

                        {idx === 1 && (
                          <div id="apex-interactive-demo" className="grid grid-cols-2 gap-2">
                            {/* Properties toggle selection */}
                            <div className="space-y-1">
                              <div 
                                onClick={(e) => { e.stopPropagation(); setSelectedApexId("prop-1"); }}
                                className={`p-1 rounded text-left cursor-pointer transition-all border ${
                                  selectedApexId === "prop-1"
                                    ? "border-black bg-yellow-100 shadow-[1px_1px_0px_#000000]"
                                    : "border-zinc-200 bg-white hover:border-zinc-300"
                                }`}
                              >
                                <span className="block text-[7px] font-black leading-none text-slate-950">Seaface Villa</span>
                                <span className="text-[6px] font-mono text-zinc-500">{formatCurrencyValue(8500000, currency)}</span>
                              </div>
                              <div 
                                onClick={(e) => { e.stopPropagation(); setSelectedApexId("prop-2"); }}
                                className={`p-1 rounded text-left cursor-pointer transition-all border ${
                                  selectedApexId === "prop-2"
                                    ? "border-black bg-yellow-100 shadow-[1px_1px_0px_#000000]"
                                    : "border-zinc-200 bg-white hover:border-zinc-300"
                                }`}
                              >
                                <span className="block text-[7px] font-black leading-none text-slate-950">Forest Cabin</span>
                                <span className="text-[6px] font-mono text-zinc-500">{formatCurrencyValue(4200000, currency)}</span>
                              </div>
                            </div>

                            {/* Simulated interactive live tracker map */}
                            <div className="bg-sky-50 border border-black rounded relative overflow-hidden flex flex-col justify-between p-1">
                              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:8px_8px]" />
                              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-sky-200/50" />
                              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-sky-200/50" />

                              {selectedApexId === "prop-1" ? (
                                <div className="absolute top-1/4 left-1/4 flex flex-col items-center animate-bounce">
                                  <span className="text-[10px]">📍</span>
                                  <span className="bg-black text-white text-[5px] font-mono px-0.5 rounded leading-none">Beach</span>
                                </div>
                              ) : (
                                <div className="absolute bottom-1/4 right-1/4 flex flex-col items-center animate-bounce">
                                  <span className="text-[10px]">📍</span>
                                  <span className="bg-black text-white text-[5px] font-mono px-0.5 rounded leading-none">Hill</span>
                                </div>
                              )}

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setApexSubmitted(true);
                                  setTimeout(() => setApexSubmitted(false), 2200);
                                }}
                                className="mt-auto w-full bg-emerald-400 hover:bg-black text-black hover:text-white border border-black py-0.5 rounded text-[6px] font-black font-mono uppercase tracking-wider relative z-10 cursor-pointer text-center"
                              >
                                {apexSubmitted ? "✓ LEAD SYNCED" : "SUBMIT LEAD"}
                              </button>
                            </div>
                          </div>
                        )}

                        {idx === 2 && (
                          <div id="vedic-interactive-demo" className="space-y-1.5">
                            {/* Product Select Pills */}
                            <div className="flex gap-1">
                              {["Kesar Serum", "Turmeric Balm"].map((prod) => (
                                <button
                                  key={prod}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setVedicSelected(prod);
                                  }}
                                  className={`text-[6px] font-black px-1.5 py-0.5 rounded border transition-all cursor-pointer ${
                                    vedicSelected === prod
                                      ? "bg-rose-100 border-black text-slate-900 shadow-[0.5px_0.5px_0px_#000000]"
                                      : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"
                                  }`}
                                >
                                  {prod}
                                </button>
                              ))}
                            </div>

                            {/* Simulated WhatsApp Chat Bubble layout */}
                            <div className="bg-emerald-50 border border-emerald-200 rounded p-1 text-left relative">
                              <span className="block text-[5px] font-mono font-black text-emerald-800 uppercase tracking-widest leading-none mb-0.5">WhatsApp API Hook</span>
                              <p className="text-[7px] font-bold text-slate-800 leading-tight">
                                "Hi Vedic! Order {vedicSelected} for me."
                              </p>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setVedicSuccess(true);
                                setTimeout(() => setVedicSuccess(false), 2200);
                              }}
                              className="w-full bg-[#25D366] hover:bg-black text-white hover:text-white border border-black py-0.5 rounded text-[7px] font-black font-mono uppercase tracking-wider cursor-pointer shadow-[1px_1px_0px_#000000] active:translate-y-0.5 text-center"
                            >
                              {vedicSuccess ? "✓ API Message Formatted" : "Test WhatsApp Pipeline"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Copy details */}
                    <div className="p-6 space-y-4">
                      <div className="space-y-1.5">
                        <h4 className="text-lg font-black text-slate-950 font-display uppercase tracking-tight">
                          {project.title}
                        </h4>
                        <p className="text-xs text-zinc-500 font-bold leading-relaxed">
                          {project.desc}
                        </p>
                      </div>

                      {/* Tech stack badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.techStack.map((tech, i) => (
                          <span key={i} className="text-[9px] font-mono font-black text-zinc-600 bg-zinc-100 border border-zinc-300 px-2.5 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Creative Video Edits Panel */}
            {activeTab === 'video-work' && (
              <motion.div
                key="video-work"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
              >
                {videoEdits.map((item, idx) => (
                  <div 
                    key={idx}
                    className="border-2 border-black bg-zinc-50 p-6 rounded-xl flex flex-col justify-between shadow-[4px_4px_0px_#000000]"
                  >
                    <div className="space-y-4">
                      {/* Category Header */}
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-black text-white bg-[#3B82F6] border-2 border-black px-2.5 py-1 rounded-md shadow-[1.5px_1.5px_0px_#000000]">
                          {item.category}
                        </span>
                        <span className="text-[9px] font-mono font-black text-black bg-emerald-300 border-2 border-black px-2.5 py-1 rounded-md shadow-[1.5px_1.5px_0px_#000000]">
                          {item.impact}
                        </span>
                      </div>

                      {/* Content Body */}
                      <h4 className="text-lg font-black text-slate-950 font-display uppercase tracking-tight">
                        Client: {item.client}
                      </h4>

                      {/* Timeline graphic visualizer */}
                      <div className="bg-slate-900 rounded-xl p-4.5 space-y-2 relative overflow-hidden border-2 border-black">
                        <span className="block text-[8px] font-mono text-zinc-400 font-bold uppercase tracking-widest">Dynamic Timeline & SFX track</span>
                        <div className="flex items-center space-x-1.5">
                          <div className="h-5 bg-[#3B82F6] border border-black shadow-[1px_1px_0px_#000000] rounded-md w-[45%] text-[9px] text-white flex items-center justify-center font-mono font-black uppercase">
                            Kinetic typo
                          </div>
                          <div className="h-5 bg-yellow-300 border border-black shadow-[1px_1px_0px_#000000] rounded-md w-[25%] text-[9px] text-black flex items-center justify-center font-mono font-black uppercase">
                            Cuts
                          </div>
                          <div className="h-5 bg-emerald-400 border border-black shadow-[1px_1px_0px_#000000] rounded-md w-[30%] text-[9px] text-black flex items-center justify-center font-mono font-black uppercase">
                            Outro
                          </div>
                        </div>
                      </div>

                      {/* Techniques bullets */}
                      <div className="space-y-2 pt-1">
                        <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-black">Editing Highlights</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-bold">
                          {item.techniques.map((tech, i) => (
                            <div key={i} className="flex items-center space-x-1.5">
                              <Check className="w-3.5 h-3.5 text-green-500 stroke-[3.5]" />
                              <span>{tech}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-5 mt-5 border-t-2 border-zinc-200 flex items-center justify-between text-xs text-zinc-500 font-mono font-black uppercase">
                      <span>Express turnaround:</span>
                      <span className="font-bold text-slate-950">{item.delivery}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
