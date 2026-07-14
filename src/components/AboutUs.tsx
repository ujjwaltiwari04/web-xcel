import React from "react";
import { motion } from "motion/react";
import { 
  Heart, 
  Terminal, 
  Code, 
  Briefcase, 
  Compass, 
  Sparkles, 
  ShieldAlert, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Lightbulb, 
  Layers 
} from "lucide-react";

interface AboutUsProps {
  onPageChange: (pageId: string) => void;
}

export default function AboutUs({ onPageChange }: AboutUsProps) {
  const milestones = [
    {
      year: "AGE 15",
      title: "The Tech Obsession Begins",
      desc: "Ujjwal begins deep-diving into cybersecurity, network architecture, and security protocols, building a foundation of digital curiosity outside the classroom.",
      color: "bg-red-400"
    },
    {
      year: "LOCKDOWN",
      title: "Self-Taught Code Catalyst",
      desc: "Isolated but ambitious, Ujjwal turns lockdown into a personal boot camp. Mastering modern web engineering, web systems, and networking with absolute dedication.",
      color: "bg-blue-400"
    },
    {
      year: "CORPORATE",
      title: "Big Tech Experience & Insight",
      desc: "Providing Microsoft technical support, Ujjwal gains first-hand insight into systemic operational problems and corporate tech structures.",
      color: "bg-yellow-400"
    },
    {
      year: "SUCCESS",
      title: "Profiting & Launching WEBXcel",
      desc: "Generating success via custom web assets and ad monetization, Ujjwal partners with his close friend and systems expert Raj Dubey to launch WEBXcel.",
      color: "bg-emerald-400"
    },
    {
      year: "TODAY",
      title: "Lighthouse Standard Elite",
      desc: "Now as software engineers at Accenture and systems specialists, Ujjwal and Raj lead WEBXcel to break down software barriers for small enterprises with raw native custom code.",
      color: "bg-purple-400"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24 text-left">
      
      {/* 1. Header / Intro Banner */}
      <div className="relative overflow-hidden bg-yellow-100 border-4 border-black p-8 sm:p-12 rounded-3xl shadow-brutal-md bg-halftone-yellow">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-black text-yellow-300 px-4 py-1.5 rounded-lg text-xs font-mono font-black uppercase tracking-widest border border-yellow-300 shadow-[2px_2px_0px_#000000]">
            <Compass className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Our Founding Mission</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-black text-slate-950 leading-tight tracking-tight">
            We build the systems <br />
            that unlock your <span className="underline decoration-yellow-400 decoration-8 font-black text-[#3B82F6]">full potential</span>.
          </h1>
          <p className="text-sm sm:text-base text-zinc-700 font-bold leading-relaxed max-w-2xl">
            Too often, small enterprises are locked out of high-tier custom software and smart systems due to bloated agency premiums. WEBXcel was born from a vision to level the playing field—replacing slow, template-driven designs with raw, elite custom code that drives actual business results.
          </p>
        </div>
        
        {/* Dynamic decorative comic bubbles */}
        <div className="absolute right-6 top-6 hidden lg:block transform rotate-6 max-w-xs bg-white border-2 border-black p-4 rounded-2xl shadow-brutal-sm">
          <span className="font-mono text-[10px] uppercase font-black text-[#3B82F6]">Core Directive</span>
          <p className="font-display font-black text-xs mt-1">
            "Zero Wordpress. Zero bloated builders. Pure, raw, blazing-fast native compilation."
          </p>
        </div>
      </div>

      {/* 2. Co-Founder Stories (Bento Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Profile Card - Ujjwal */}
        <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-brutal-blue flex flex-col justify-between space-y-8 relative">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-zinc-400 uppercase font-bold tracking-widest block">Founder & Lead Engineer</span>
                <h3 className="font-display text-3xl font-black text-slate-950">Ujjwal Tiwari</h3>
              </div>
              <div className="bg-yellow-300 border-2 border-black p-2.5 rounded-xl shadow-[2px_2px_0px_#000000] rotate-3 shrink-0">
                <Code className="w-6 h-6 text-black" />
              </div>
            </div>

            <div className="border-l-4 border-[#3B82F6] pl-4 italic text-xs font-semibold text-zinc-500 leading-relaxed">
              "My fascination with technology began in childhood. Traditional academics were never my strong suit, but my passion for tech grew exponentially with my height."
            </div>

            <div className="space-y-4 text-xs font-semibold text-zinc-600 leading-relaxed">
              <p>
                By age 15, I was deeply immersed in cybersecurity and networking protocols. When the global lockdown struck, I completed high school and converted my isolation into a rigorous personal coding bootcamp. Learning entirely from open resources online, I mastered multiple languages and engineered backend projects alongside brilliant friends across the globe.
              </p>
              <p>
                My professional path took me to a global IT corporate powerhouse, serving Microsoft enterprise as a technical support specialist. It was an invaluable experience, but my core was always in direct, active problem-solving and custom engineering. I launched my own optimized web assets, generating strong monetization through ad networks. 
              </p>
              <p>
                Following the success of these products, I partnered with Raj to form WEBXcel. We immediately secured two complex custom projects, including a bespoke CRM that transformed our client's operations. Eversince, it has been a journey of absolute focus. Today, while also serving as a software engineer at Accenture, I pour this enterprise rigor back into WEBXcel to build high-performance custom engines.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase font-black text-zinc-400">Software Developer at Accenture</span>
            <div className="inline-flex items-center space-x-1.5 bg-[#3B82F6] text-white text-[10px] font-mono uppercase font-black px-3 py-1 rounded-md border-2 border-black">
              <span>Frontend Core</span>
            </div>
          </div>
        </div>

        {/* Profile Card - Raj */}
        <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-brutal-yellow flex flex-col justify-between space-y-8 relative">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-zinc-400 uppercase font-bold tracking-widest block">Co-founder & Architect Engineer</span>
                <h3 className="font-display text-3xl font-black text-slate-950">Raj Dubey</h3>
              </div>
              <div className="bg-blue-300 border-2 border-black p-2.5 rounded-xl shadow-[2px_2px_0px_#000000] -rotate-3 shrink-0">
                <Terminal className="w-6 h-6 text-black" />
              </div>
            </div>

            <div className="border-l-4 border-yellow-400 pl-4 italic text-xs font-semibold text-zinc-500 leading-relaxed">
              "Driven by purpose. Powered by code."
            </div>

            <div className="space-y-4 text-xs font-semibold text-zinc-600 leading-relaxed">
              <p>
                I’m Raj Dubey, CEO and Co-Founder of WEBXcel. I’m passionate about building technology that helps businesses grow. For me, web development or other digital services aren't just about creating attractive websites and tools—it’s about designing fast, secure, and scalable digital experiences that deliver real results. Every line of code I write is driven by innovation, precision, and the desire to create lasting value.
              </p>
              <p>
                WEBXcel represents my vision of what a modern web agency should be: transparent, innovative, and committed to quality. Every project is built with attention to detail, clean engineering, and a focus on long-term success rather than quick fixes.
              </p>
              <p>
                I believe every business, regardless of its size, deserves access to world-class technology. That’s why we’re constantly pushing ourselves to improve, learn, and deliver solutions that stand out in both design and performance.
              </p>
              <p>
                My mindset has always been to aim higher than yesterday, embrace every challenge, and never settle for average. I want WEBXcel to become the first name businesses think of when they need exceptional web development and digital solutions.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase font-black text-zinc-400">Architect Engineer</span>
            <div className="inline-flex items-center space-x-1.5 bg-yellow-300 text-black text-[10px] font-mono uppercase font-black px-3 py-1 rounded-md border-2 border-black">
              <span>Backend Core</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. The Timeline / Milestones */}
      <div className="bg-transparent space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-black text-slate-950 uppercase tracking-tight">
            Our Journey Milestones
          </h2>
          <p className="text-xs font-mono font-black text-zinc-500 uppercase">
            A chronological look at how self-taught passion scaled to enterprise standards
          </p>
        </div>

        <div className="relative border-l-4 border-black ml-4 md:ml-12 space-y-12 py-4">
          {milestones.map((step, idx) => (
            <div key={idx} className="relative pl-8 sm:pl-12 group">
              {/* Bullet Node */}
              <div className={`absolute -left-[14px] top-1.5 w-6 h-6 rounded-full border-4 border-black ${step.color} shadow-[2px_2px_0px_#000000] group-hover:scale-110 transition-transform`} />
              
              <div className="bg-white border-2 border-black p-6 rounded-2xl shadow-brutal-sm max-w-3xl transform hover:-translate-y-1 transition-transform">
                <span className="inline-block px-3 py-0.5 text-[9px] font-mono font-black text-white bg-black rounded-md mb-2">
                  {step.year}
                </span>
                <h4 className="font-display text-lg font-black text-slate-950 mb-1.5">
                  {step.title}
                </h4>
                <p className="text-xs font-bold text-zinc-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Core Values & Call to Action */}
      <div className="bg-white border-4 border-black p-8 sm:p-12 rounded-3xl shadow-brutal-md relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="font-display text-3xl font-black text-slate-950 uppercase">
              Our Core Promises
            </h3>
            
            <div className="space-y-4">
              {[
                { title: "No Subscription Lock-In", desc: "You own 100% of the raw source code. No mandatory retainers or monthly platforms." },
                { title: "Lighthouse Score Dominance", desc: "Our sites score near 100% because we compile clean React code instead of using slow templates." },
                { title: "SLA Satisfaction Guarantee", desc: "We deploy after thorough validation. If we don’t meet the agreed targets, we fix it." },
              ].map((val, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-display font-black text-xs text-slate-950 uppercase">{val.title}</h5>
                    <p className="text-[11px] font-semibold text-zinc-500">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-100 border-2 border-black p-8 rounded-2xl shadow-brutal-sm text-center space-y-6">
            <Sparkles className="w-10 h-10 text-[#3B82F6] mx-auto animate-bounce" />
            <h4 className="font-display text-xl font-black text-slate-950">
              Ready to create a difference?
            </h4>
            <p className="text-xs font-bold text-zinc-600">
              Let's bypass the bloated agencies and build your custom website, custom CRM, or intelligent AI client outreach platform today.
            </p>
            <button
              onClick={() => onPageChange("estimator")}
              className="w-full py-3 text-xs font-black uppercase tracking-wider text-white bg-[#3B82F6] hover:bg-[#2563EB] rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-0 transition-all cursor-pointer"
            >
              Start Your Quote Build
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
