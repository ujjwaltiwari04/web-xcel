import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Zap, Shield, Sparkles, Terminal, ArrowRight, Layers, Smartphone, RefreshCw, Send, Check } from "lucide-react";

export default function HomeExtendedContent({ onAction }: { onAction: (pageId: string) => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "Initializing WebXcel Core Engine...",
    "Server established at 0.0.0.0:3000.",
    "Gemini LLM model: 'gemini-2.5-flash' fully integrated.",
    "Database connection status: active.",
  ]);

  const pipelineSteps = [
    {
      title: "Step 1: Rapid Conceptual Spec",
      desc: "Our interactive cost tool creates a custom blueprint mapping your requirements directly to budget tiers. No vague estimates.",
      badge: "DAY 1",
      icon: Layers,
    },
    {
      title: "Step 2: Clean Native Compilation",
      desc: "We skip Wordpress and build entirely in React/Vite with Tailwind CSS. Lightweight, secure, and ready to score 100% on lighthouse audits.",
      badge: "DAYS 2 - 5",
      icon: Zap,
    },
    {
      title: "Step 3: Intelligent AI Systems",
      desc: "We build server-side proxy routes matching your custom LLM configurations. Complete database integrations and Google Sheets linking.",
      badge: "DAYS 6 - 8",
      icon: Sparkles,
    },
    {
      title: "Step 4: Hot Production Deployment",
      desc: "100% satisfying delivery with clean documentation, complete source code handover, and official hosting transfer.",
      badge: "DAY 10",
      icon: Shield,
    },
  ];

  // Dynamic simulation of activity for the live terminal look with variable gaps and multiple entries
  useEffect(() => {
    const events = [
      "New custom CRM lead synced with Google Sheets successfully.",
      "XcelBot AI prompt payload optimized. Latency reduced to 0.85s.",
      "Webhook fired to WhatsApp Client Outpost pipeline.",
      "Database schema migrated. Ready for bulk records sync.",
      "Outbound AI agent dialer queue prioritized.",
      "Incoming client inquiry parsed automatically via AI Pipeline.",
      "Google Sheets database backup generated.",
      "SSL handshakes secured on custom client subdomain.",
      "Active chat routing assigned to agent #14.",
      "Automated outreach feedback reporting dispatched to owner.",
      "Client pricing package dynamically estimated via calculator.",
      "Nginx reverse proxy container routing optimized.",
      "Live consultation slot reserved and auto-notified.",
    ];

    let timeoutId: NodeJS.Timeout;

    const runSimulation = () => {
      // Determine random batch size to output multiple items (1 to 2 entries)
      const batchSize = Math.random() > 0.65 ? 2 : 1;
      const newLines: string[] = [];

      for (let i = 0; i < batchSize; i++) {
        const randEvent = events[Math.floor(Math.random() * events.length)];
        const timestamp = new Date().toLocaleTimeString();
        newLines.push(`[${timestamp}] ${randEvent}`);
      }

      setTerminalLines((prev) => {
        const next = [...prev, ...newLines];
        // Display more items to show multiple outputs clearly
        while (next.length > 8) {
          next.shift();
        }
        return next;
      });

      // Variable timing gaps: random delay between 1200ms and 7000ms
      const nextDelay = Math.floor(Math.random() * 5800) + 1200;
      timeoutId = setTimeout(runSimulation, nextDelay);
    };

    // Initial delay before starting simulation
    timeoutId = setTimeout(runSimulation, 1500);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="py-20 bg-transparent border-b-4 border-black text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Section 1: Neo-Brutalist Process Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-yellow-300 border-2 border-black px-4 py-1.5 rounded-lg text-black shadow-[3px_3px_0px_#000000] transform -rotate-1">
              <Layers className="w-4 h-4 text-black" />
              <span className="text-xs font-black font-comic tracking-widest uppercase">
                * SPEED & DELIVERY PIPELINE *
              </span>
            </div>
            
            <h2 className="font-sfx text-4xl sm:text-5xl font-normal text-slate-950 uppercase tracking-normal leading-tight">
              How We Deliver Custom Systems In 10 Days!
            </h2>
            
            <p className="text-zinc-700 text-sm font-bold leading-relaxed font-sketch">
              Most agencies drag simple websites for 3 months using slow bloated page builders. We code from scratch to ensure peak security, high customizability, and ultra-fast page speeds.
            </p>

            <div className="pt-4">
              <button
                onClick={() => onAction("estimator")}
                className="px-6 py-3 text-xs font-black uppercase tracking-wider text-white bg-[#3B82F6] hover:bg-black rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>Calculate Your Project Scope</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {pipelineSteps.map((step, idx) => {
              const StepIcon = step.icon;
              const isSelected = activeStep === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`border-4 border-black p-5 rounded-2xl cursor-pointer transition-all duration-200 text-left flex items-start space-x-4 ${
                    isSelected 
                      ? "bg-yellow-300 shadow-[6px_6px_0px_#000000] -translate-y-1" 
                      : "bg-zinc-50 hover:bg-zinc-100 shadow-[2px_2px_0px_#000000]"
                  }`}
                >
                  <div className={`p-3 rounded-xl border-2 border-black shrink-0 ${isSelected ? "bg-white" : "bg-white"}`}>
                    <StepIcon className="w-5 h-5 text-black stroke-[2.5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-display font-black text-xs uppercase tracking-tight text-slate-950 truncate">
                        {step.title}
                      </h4>
                      <span className="px-2.5 py-0.5 bg-black text-white font-mono text-[9px] font-black uppercase rounded-sm shrink-0">
                        {step.badge}
                      </span>
                    </div>
                    <p className={`text-xs font-bold leading-relaxed ${isSelected ? "text-zinc-900" : "text-zinc-500"}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Live Activity Terminal Container */}
        <div className="bg-slate-950 border-4 border-black text-white p-6 rounded-2xl shadow-[10px_10px_0px_#000000] relative overflow-hidden">
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-zinc-800 pb-4 mb-6">
            <div className="flex items-center space-x-3 text-left">
              <div className="p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-[#3B82F6]">
                <Terminal className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="block text-[10px] font-mono font-black uppercase tracking-wider text-zinc-500">
                  REAL-TIME AGENCY TELEMETRY
                </span>
                <h3 className="font-display font-black text-base uppercase tracking-tight text-white">
                  Developer Live Feed Terminal
                </h3>
              </div>
            </div>
            <div className="mt-3 sm:mt-0 flex items-center space-x-2 font-mono text-[10px] bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <span className="text-zinc-400 uppercase font-black">STREAM ONLINE</span>
            </div>
          </div>

          <div className="font-mono text-xs space-y-2.5 bg-black/40 p-4 rounded-xl border border-zinc-800 text-left min-h-[170px]">
            {terminalLines.map((line, i) => (
              <div key={i} className="flex items-start space-x-2">
                <span className="text-zinc-600 shrink-0 select-none">&gt;</span>
                <span className={i === terminalLines.length - 1 ? "text-yellow-300 font-extrabold animate-pulse" : "text-zinc-300"}>
                  {line}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left border-t border-zinc-800 mt-6">
            <div className="p-4 bg-zinc-900/50 border border-zinc-800/60 rounded-xl space-y-1">
              <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Lighthouse Audit Rating</span>
              <span className="block font-display text-xl font-black text-green-400">99 / 100</span>
            </div>
            <div className="p-4 bg-zinc-900/50 border border-zinc-800/60 rounded-xl space-y-1">
              <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Client Satisfaction SLA</span>
              <span className="block font-display text-xl font-black text-[#3B82F6]">100% Standard</span>
            </div>
            <div className="p-4 bg-zinc-900/50 border border-zinc-800/60 rounded-xl space-y-1">
              <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Typical Lead Latency</span>
              <span className="block font-display text-xl font-black text-yellow-300">&lt; 1 Second Sync</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
