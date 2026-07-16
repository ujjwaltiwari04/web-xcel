import { Cpu, Mail, Phone, MapPin, ShieldAlert } from "lucide-react";
import WebXcelLogo from "./WebXcelLogo";
import { Currency, formatCurrencyValue } from "../utils/currency";

interface FooterProps {
  onPageChange: (pageId: string) => void;
  currency: Currency;
}

export default function Footer({ onPageChange, currency }: FooterProps) {
  return (
    <footer className="bg-yellow-100/80 bg-halftone-yellow text-slate-900 pt-20 pb-8 border-t-4 border-black text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b-2 border-yellow-300">
          
          {/* Logo Brand info column */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center">
              <WebXcelLogo variant="full" className="h-[64px] w-[172px]" />
            </div>
            
            <p className="text-zinc-600 text-xs leading-relaxed max-w-sm font-bold">
              Elite developers specializing in custom websites, custom CRMs, intelligent chatbots, and automated outreach. We bypass expensive Wordpress templates and deliver raw custom code starting at just {formatCurrencyValue(6999, currency)}.
            </p>

            <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 text-amber-800 font-mono text-[9px] font-black uppercase tracking-wider">
              <span>· NO RETAINERS</span>
              <span>· NO PLATFORM LOCKDOWN</span>
              <span>· OWN ALL RIGHTS</span>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-mono font-black text-amber-900 uppercase tracking-widest">
              Browse Services
            </h4>
            <div className="flex flex-col space-y-2.5 text-xs text-zinc-600 font-bold">
              {[
                { id: "services", label: "Business Websites" },
                { id: "services", label: "Bespoke CRMs" },
                { id: "consultant", label: "AI Conversational Agents" },
                { id: "services", label: "Auto-Dialer outreach" },
                { id: "services", label: "Creative Video Edits" },
                { id: "fiverr-alternative", label: "Fiverr vs WEBXcel" },
                { id: "blog", label: "Insights & Blog" },
              ].map((link, i) => (
                <button
                  key={i}
                  onClick={() => onPageChange(link.id)}
                  className="hover:text-[#3B82F6] transition-colors text-left font-black cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Direct Address & Contacts */}
          <div className="md:col-span-4 space-y-5">
            <h4 className="text-xs font-mono font-black text-amber-900 uppercase tracking-widest">
              Direct Contact & Our Story
            </h4>
            
            {/* High Impact Journey Card */}
            <div 
              onClick={() => onPageChange("about")}
              className="bg-white border-2 border-black p-4 rounded-xl shadow-brutal-sm hover:-translate-y-0.5 hover:shadow-brutal-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[9px] uppercase font-black text-[#3B82F6]">Meet The Co-Founders</span>
                <span className="text-[10px] bg-yellow-300 border border-black px-1.5 py-0.5 rounded font-mono font-black">STORY</span>
              </div>
              <h5 className="font-display font-black text-xs text-slate-900 group-hover:text-[#3B82F6] transition-colors">
                Ujjwal Tiwari & Raj Dubey
              </h5>
              <p className="text-[10px] text-zinc-500 font-bold mt-1.5 leading-relaxed">
                From a childhood tech obsession & self-taught lockdown engineering to building enterprise systems. Read our professional journey.
              </p>
              <span className="inline-block mt-2 font-mono text-[9px] uppercase font-black text-slate-950 group-hover:underline">
                Read Our Story & Vision →
              </span>
            </div>

            <div className="space-y-3.5 text-xs text-zinc-600 font-bold pt-2 border-t border-yellow-300/60">
              <div className="flex items-start space-x-2.5">
                <Mail className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-zinc-400 font-mono text-[9px] uppercase font-black">Direct Email</span>
                  <a href="mailto:query@webxcel.co.in" className="hover:text-[#3B82F6] font-black text-slate-950">
                    query@webxcel.co.in
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Phone className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-zinc-400 font-mono text-[9px] uppercase font-black">WhatsApp Consulting Support</span>
                  <span className="font-black text-slate-950">+91 91027-02317</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-zinc-400 font-mono text-[9px] uppercase font-black">Operational Base</span>
                  <span className="font-black text-slate-950">Gurugram, India</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Base bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] text-zinc-500 font-mono gap-4 font-bold">
          <div>
            &copy; {new Date().getFullYear()} WEBXcel Tech Solutions. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 hover:text-slate-950 transition-colors cursor-pointer">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Satisfaction SLA</span>
            </span>
            <span>·</span>
            <span className="hover:text-slate-950 transition-colors cursor-pointer">Privacy Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
