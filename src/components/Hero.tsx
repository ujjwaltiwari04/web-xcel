import { motion } from "motion/react";
import { ArrowRight, Cpu, Bot, Smartphone, Check, Sparkles, MessageSquare } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Currency } from "../utils/currency";

interface HeroProps {
  onCtaclick: (sectionId: string) => void;
  currency: Currency;
}

export default function Hero({ onCtaclick, currency }: HeroProps) {
  const [activeTab, setActiveTab] = useState<'agent' | 'crm' | 'outreach'>('agent');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Auto rotate tabs for dynamic feel
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        if (prev === 'agent') return 'crm';
        if (prev === 'crm') return 'outreach';
        return 'agent';
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - card.left) / card.width - 0.5;
    const y = (e.clientY - card.top) / card.height - 0.5;
    setMousePosition({ x, y });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[75vh] pt-16 sm:pt-18 pb-16 overflow-hidden flex items-center bg-[#FFFDF5] bg-halftone border-b-4 border-black"
    >
      {/* Dynamic bold subtle ambient accents */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-[#3B82F6]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-yellow-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Context & High-end copy */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center space-x-2 bg-yellow-300 border-2 border-black px-4 py-1.5 rounded-lg text-black shadow-[3px_3px_0px_#000000] transform -rotate-1.5">
              <Sparkles className="w-4 h-4 animate-spin text-black stroke-[2.5]" />
              <span className="text-xs font-black font-comic tracking-widest uppercase">
                * GLOBAL DEVELOPERS & AI AGENCY *
              </span>
            </div>

            <h1 className="font-sfx text-5xl sm:text-6xl lg:text-7xl font-normal tracking-wide text-slate-950 leading-[0.9] uppercase">
              FUTURE-PROOF<br/>
              <span className="text-white relative inline-block transform -rotate-1.5 hover:rotate-0 transition-transform bg-[#3B82F6] border-3 border-black px-4.5 py-1.5 mt-2.5 shadow-[5px_5px_0px_#000000]">
                DIGITAL SYSTEMS!
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-700 max-w-xl font-bold font-sketch leading-relaxed">
              Ditch generic, slow-loading templates! We hand-code robust custom software systems: smart custom AI agents, tailored CRM funnels, and automated outbound pipelines. Own 100% of your source code with no platform lockdowns!
            </p>

            {/* Feature Checkmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-lg pt-2">
              {[
                "100% Hand-Coded React/Vite (No WP Bloat)",
                "AI Virtual Agent Integration",
                "Bespoke lightweight Lead Tracking CRM",
                "Automated Outreach Dialer Configurations",
              ].map((feature, i) => (
                <div key={i} className="flex items-start space-x-3 transform hover:scale-[1.02] transition-transform">
                  <div className="w-5 h-5 rounded-md bg-green-400 border-2 border-black flex items-center justify-center text-black shrink-0 mt-0.5 shadow-[1.5px_1.5px_0px_#000000]">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs font-black text-slate-950 uppercase tracking-tight font-mono">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-4">
              <div className="relative inline-block group w-full sm:w-auto">
                <div className="absolute inset-0 bg-black rounded-xl translate-x-2 translate-y-2 transition-transform group-hover:translate-x-1.5 group-hover:translate-y-1.5"></div>
                <button
                  onClick={() => onCtaclick("services")}
                  className="relative w-full sm:w-auto bg-[#3B82F6] text-white px-8 py-4.5 rounded-xl font-black text-xs uppercase tracking-widest border-2 border-black cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center space-x-2"
                >
                  <span className="font-comic text-sm tracking-wide">Digital Services!</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
              
              <div className="relative inline-block group w-full sm:w-auto">
                <div className="absolute inset-0 bg-black rounded-xl translate-x-2 translate-y-2 transition-transform group-hover:translate-x-1.5 group-hover:translate-y-1.5"></div>
                <button
                  onClick={() => onCtaclick("consultant")}
                  className="relative w-full sm:w-auto bg-yellow-300 text-black px-8 py-4.5 rounded-xl font-black text-xs uppercase tracking-widest border-2 border-black cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center space-x-2"
                >
                  <Bot className="w-4.5 h-4.5 stroke-[2.5]" />
                  <span className="font-comic text-sm tracking-wide">Talk with AI Advisor!</span>
                </button>
              </div>
            </div>

            {/* Customer proof tagline */}
            <div className="pt-8 border-t-2 border-black grid grid-cols-3 gap-4">
              <div>
                <span className="block text-3xl font-normal font-comic text-[#3B82F6]">100%</span>
                <span className="text-[10px] font-black text-slate-900 font-mono uppercase tracking-wider block mt-1">SLA Guarantee</span>
              </div>
              <div>
                <span className="block text-3xl font-normal font-comic text-rose-500">7-14</span>
                <span className="text-[10px] font-black text-slate-900 font-mono uppercase tracking-wider block mt-1">Days Delivery</span>
              </div>
              <div>
                <span className="block text-3xl font-normal font-comic text-emerald-600">{currency === "USD" ? "$79" : "₹5.9k"}</span>
                <span className="text-[10px] font-black text-slate-900 font-mono uppercase tracking-wider block mt-1">Bespoke Entry</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Console with mouse hover effect */}
          <div className="lg:col-span-5 h-full flex items-center justify-center pt-8 lg:pt-0">
            <div
              id="interactive-3d-console"
              className="relative w-full max-w-md h-[490px] sm:h-[520px] bg-transparent perspective-1000 select-none cursor-grab"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                setMousePosition({ x: 0, y: 0 });
              }}
              style={{
                transform: `rotateY(${isHovered ? mousePosition.x * 25 : -10}deg) rotateX(${isHovered ? -mousePosition.y * 25 : 8}deg)`,
                transition: isHovered ? "none" : "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              {/* Comic Starburst Action Badge */}
              <div className="absolute -top-5 -right-5 bg-rose-500 text-white font-comic text-xl uppercase tracking-wider px-4 py-2 border-3 border-black shadow-[4px_4px_0px_#000000] rotate-12 z-20 animate-bounce">
                BOOM!
              </div>

              {/* Main Container Shadow Backdrop */}
              <div className="absolute inset-4 -right-1 bg-gradient-to-tr from-[#3B82F6]/20 to-yellow-500/10 rounded-[32px] blur-2xl pointer-events-none" />

              {/* Central Premium 3D Window Frame */}
              <div className="absolute inset-0 bg-white rounded-3xl border-3 border-black shadow-brutal-md overflow-hidden flex flex-col transform-gpu preserve-3d">
                
                {/* Browser Toolbar */}
                <div className="px-5 py-3.5 bg-zinc-50 border-b-2 border-black flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500 block border border-black" />
                    <span className="w-3 h-3 rounded-full bg-amber-400 block border border-black" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400 block border border-black" />
                  </div>
                  <div className="bg-white px-4 py-1.5 rounded-lg border-2 border-black text-[9px] font-mono font-bold text-zinc-500 w-44 truncate text-center">
                    webxcel.com/sandbox
                  </div>
                  <div className="w-12 h-2" />
                </div>

                {/* Sub-Tabs Selector inside the container */}
                <div className="px-4 pt-3 pb-2 bg-zinc-50 border-b-2 border-black flex items-center space-x-2 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('agent')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black font-mono uppercase tracking-wider transition-all flex items-center space-x-1 border-2 shrink-0 cursor-pointer ${
                      activeTab === 'agent'
                        ? "bg-[#3B82F6] text-white border-black shadow-[2px_2px_0px_#000000]"
                        : "text-zinc-600 border-transparent hover:text-black hover:bg-zinc-100"
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5 stroke-[2]" />
                    <span>AI Agent</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('crm')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black font-mono uppercase tracking-wider transition-all flex items-center space-x-1 border-2 shrink-0 cursor-pointer ${
                      activeTab === 'crm'
                        ? "bg-[#3B82F6] text-white border-black shadow-[2px_2px_0px_#000000]"
                        : "text-zinc-600 border-transparent hover:text-black hover:bg-zinc-100"
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5 stroke-[2]" />
                    <span>CRM Board</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('outreach')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black font-mono uppercase tracking-wider transition-all flex items-center space-x-1 border-2 shrink-0 cursor-pointer ${
                      activeTab === 'outreach'
                        ? "bg-[#3B82F6] text-white border-black shadow-[2px_2px_0px_#000000]"
                        : "text-zinc-600 border-transparent hover:text-black hover:bg-zinc-100"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 stroke-[2]" />
                    <span>Outreach</span>
                  </button>
                </div>

                {/* Terminal and Interactive Content Panels */}
                <div className="flex-1 p-5 overflow-y-auto flex flex-col relative bg-white">
                  
                  {activeTab === 'agent' && (
                    <div className="h-full flex flex-col justify-between">
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between border-b-2 border-zinc-100 pb-2">
                          <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase">CONSOLE: AI_AGENT_DAEMON</span>
                          <span className="text-[9px] bg-emerald-400 text-black font-black font-mono px-2 py-0.5 rounded border-2 border-black shadow-[1.5px_1.5px_0px_#000000]">ONLINE</span>
                        </div>
                        
                        {/* Simulation Chat Bubbles */}
                        <div className="space-y-3">
                          <div className="flex space-x-2 text-left">
                            <div className="w-6 h-6 rounded bg-zinc-100 flex items-center justify-center text-black shrink-0 border border-black mt-0.5">
                              <Bot className="w-3.5 h-3.5" />
                            </div>
                            <div className="bg-zinc-50 border-2 border-black p-2 rounded-xl text-[11px] font-semibold text-zinc-800 max-w-[85%] shadow-[2px_2px_0px_#000000]">
                              Hello! Are you looking to schedule a consultation with Apex Dental today?
                            </div>
                          </div>

                          <div className="flex space-x-2 text-left justify-end">
                            <div className="bg-[#3B82F6] text-white p-2 border-2 border-black rounded-xl text-[11px] font-semibold max-w-[85%] shadow-[2px_2px_0px_#000000]">
                              Yes, I need to book a tooth cleaning.
                            </div>
                          </div>

                          <div className="flex space-x-2 text-left">
                            <div className="w-6 h-6 rounded bg-zinc-100 flex items-center justify-center text-black shrink-0 border border-black mt-0.5">
                              <Bot className="w-3.5 h-3.5 animate-bounce" />
                            </div>
                            <div className="bg-zinc-50 border-2 border-black p-2 rounded-xl text-[11px] font-semibold text-zinc-800 max-w-[85%] shadow-[2px_2px_0px_#000000]">
                              Perfect! We have 11:30 AM available tomorrow. Can I reserve this slot?
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Lead Qualified Stat Box */}
                      <div className="bg-yellow-100 rounded-xl p-3 border-2 border-black flex items-center justify-between mt-2 shadow-[2px_2px_0px_#000000]">
                        <span className="text-xs font-black text-slate-900 uppercase">Intelligent Pipeline:</span>
                        <span className="text-[9px] font-mono font-black text-black bg-emerald-400 border border-black px-2 py-1 rounded">
                          LEAD QUALIFIED 🎯
                        </span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'crm' && (
                    <div className="h-full flex flex-col justify-between">
                      <div className="space-y-3.5 text-left">
                        <div className="flex items-center justify-between border-b-2 border-zinc-100 pb-2">
                          <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase">CRM: LIVE_FUNNEL_METRICS</span>
                          <span className="text-[9px] bg-[#3B82F6] text-white font-black font-mono px-2 py-0.5 rounded border border-black shadow-[1.5px_1.5px_0px_#000000]">ACTIVE</span>
                        </div>
                        
                        {/* Pipelines List */}
                        <div className="space-y-2.5">
                          <div>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1 uppercase tracking-tight">
                              <span>Conversion Rate</span>
                              <span className="font-mono text-[#3B82F6] font-black">68%</span>
                            </div>
                            <div className="w-full bg-zinc-100 h-3 rounded-full border-2 border-black overflow-hidden">
                              <div className="bg-[#3B82F6] h-full rounded-full" style={{ width: "68%" }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1 uppercase tracking-tight">
                              <span>Pipeline Setup</span>
                              <span className="font-mono text-yellow-500 font-black">92%</span>
                            </div>
                            <div className="w-full bg-zinc-100 h-3 rounded-full border-2 border-black overflow-hidden">
                              <div className="bg-yellow-400 h-full rounded-full" style={{ width: "92%" }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1 uppercase tracking-tight">
                              <span>WhatsApp API Response</span>
                              <span className="font-mono text-green-600 font-black">99.4%</span>
                            </div>
                            <div className="w-full bg-zinc-100 h-3 rounded-full border-2 border-black overflow-hidden">
                              <div className="bg-green-400 h-full rounded-full" style={{ width: "99.4%" }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Visual Pipeline cards list */}
                      <div className="grid grid-cols-3 gap-2 mt-4 text-[9px] font-mono font-bold uppercase">
                        <div className="border-2 border-black bg-zinc-50 p-2 rounded-lg text-center shadow-[1.5px_1.5px_0px_#000000]">
                          <span className="block text-zinc-500 font-black">New Leads</span>
                          <span className="block text-[#3B82F6] font-black text-xs mt-1">42</span>
                        </div>
                        <div className="border-2 border-black bg-yellow-100 p-2 rounded-lg text-center shadow-[1.5px_1.5px_0px_#000000]">
                          <span className="block text-zinc-800 font-black">In Touch</span>
                          <span className="block text-black font-black text-xs mt-1">19</span>
                        </div>
                        <div className="border-2 border-black bg-emerald-100 p-2 rounded-lg text-center shadow-[1.5px_1.5px_0px_#000000]">
                          <span className="block text-emerald-900 font-black">Won Deals</span>
                          <span className="block text-emerald-600 font-black text-xs mt-1">14</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'outreach' && (
                    <div className="h-full flex flex-col justify-between">
                      <div className="space-y-4 text-left">
                        <div className="flex items-center justify-between border-b-2 border-zinc-100 pb-2">
                          <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase">DIALER: AGENT_VOICE_OUTBOUND</span>
                          <span className="text-[9px] bg-red-400 text-black font-black font-mono px-2 py-0.5 rounded border-2 border-black shadow-[1.5px_1.5px_0px_#000000]">DIALING</span>
                        </div>

                        {/* Dialing Mockup */}
                        <div className="flex items-center justify-between border-2 border-black rounded-xl p-3 bg-zinc-50 shadow-[3px_3px_0px_#000000]">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-full bg-zinc-200 border border-black flex items-center justify-center text-black">
                              <Smartphone className="w-4 h-4 stroke-[2]" />
                            </div>
                            <div>
                              <span className="block text-[11px] font-black text-slate-900">Auto-Dialer Active</span>
                              <span className="block text-[9px] font-mono text-zinc-500 font-bold">CONTACT: +91 98765-XXXXX</span>
                            </div>
                          </div>
                          <div className="w-16 h-5 bg-red-100 border border-black rounded flex items-center justify-center shrink-0">
                            <span className="text-[8px] font-mono font-black text-red-600 animate-pulse">CONNECTING</span>
                          </div>
                        </div>

                        {/* Audio Waveform Animation */}
                        <div className="space-y-1 bg-zinc-950 rounded-xl p-3 text-center border-2 border-black">
                          <span className="text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-widest block mb-2">Realtime Audio Streaming</span>
                          <div className="flex items-end justify-center space-x-1 h-8">
                            <div className="bg-[#3B82F6] w-1 rounded-t h-3 animate-pulse" />
                            <div className="bg-[#3B82F6] w-1 rounded-t h-6 animate-pulse" style={{ animationDelay: "0.2s" }} />
                            <div className="bg-yellow-400 w-1 rounded-t h-4 animate-pulse" style={{ animationDelay: "0.1s" }} />
                            <div className="bg-[#3B82F6] w-1 rounded-t h-7 animate-pulse" style={{ animationDelay: "0.4s" }} />
                            <div className="bg-yellow-400 w-1 rounded-t h-2 animate-pulse" style={{ animationDelay: "0.3s" }} />
                            <div className="bg-white w-1 rounded-t h-5 animate-pulse" style={{ animationDelay: "0.5s" }} />
                            <div className="bg-[#3B82F6] w-1 rounded-t h-3 animate-pulse" style={{ animationDelay: "0.25s" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
