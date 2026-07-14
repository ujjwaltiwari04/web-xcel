import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Cpu, Menu, X, CheckCircle, Globe } from "lucide-react";
import WebXcelLogo from "./WebXcelLogo";
import { Currency } from "../utils/currency";

interface NavbarProps {
  currentPage: string;
  onPageChange: (pageId: string) => void;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export default function Navbar({ onPageChange, currentPage, currency, onCurrencyChange }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.remove("dark");
      localStorage.removeItem("webxcel_theme");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "consultant", label: "AI Consultant" },
    { id: "portfolio", label: "Portfolio" },
    { id: "pricing", label: "Pricing" },
    { id: "estimator", label: "Quote Builder" },
  ];

  return (
    <header
      id="navbar-header"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 pt-4"
    >
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 border-2 ${
          isScrolled
            ? "bg-white border-black shadow-brutal-sm py-3"
            : "bg-white/90 border-zinc-200 shadow-xs py-4"
        }`}
      >
        <div className="px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <div
            id="nav-logo"
            onClick={() => onPageChange("home")}
            className="flex items-center cursor-pointer group"
          >
            <WebXcelLogo 
              variant="full" 
              className="h-[60px] w-[162px] group-hover:scale-105 transition-transform duration-300" 
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 bg-zinc-50 p-1.5 rounded-xl border-2 border-black">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
                  currentPage === item.id
                    ? "bg-[#3B82F6] text-white border-2 border-black shadow-[2px_2px_0px_#000000]"
                    : "text-zinc-600 hover:text-black hover:bg-zinc-200/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Currency Selector */}
            <div className="flex items-center bg-zinc-100 border-2 border-black rounded-xl p-0.5 shadow-[1.5px_1.5px_0px_#000000]">
              <button
                type="button"
                onClick={() => {
                  onCurrencyChange("INR");
                  localStorage.setItem("webxcel_currency", "INR");
                }}
                className={`px-2.5 py-1 text-[9px] font-black tracking-wider uppercase rounded-lg transition-all cursor-pointer ${
                  currency === "INR" 
                    ? "bg-yellow-300 text-black border border-black shadow-[1px_1px_0px_#000000]" 
                    : "text-zinc-500 hover:text-black"
                }`}
              >
                ₹ INR
              </button>
              <button
                type="button"
                onClick={() => {
                  onCurrencyChange("USD");
                  localStorage.setItem("webxcel_currency", "USD");
                }}
                className={`px-2.5 py-1 text-[9px] font-black tracking-wider uppercase rounded-lg transition-all cursor-pointer ${
                  currency === "USD" 
                    ? "bg-[#3B82F6] text-white border border-black shadow-[1px_1px_0px_#000000]" 
                    : "text-zinc-500 hover:text-black"
                }`}
              >
                $ USD
              </button>
            </div>


            <button
              onClick={() => onPageChange("estimator")}
              className="px-4.5 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-[#3B82F6] hover:bg-[#2563EB] rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000000] transition-all duration-200 flex items-center space-x-1.5 group cursor-pointer"
            >
              <span>Build Custom Website</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-zinc-950 hover:bg-zinc-100 border-2 border-black rounded-lg bg-white shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000000] transition-all"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-24 left-4 right-4 bg-white rounded-2xl border-2 border-black shadow-brutal-sm p-5 z-40"
        >
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider border-2 transition-all ${
                  currentPage === item.id
                    ? "bg-[#3B82F6] text-white border-black shadow-[2px_2px_0px_#000000]"
                    : "text-zinc-700 border-transparent hover:bg-zinc-50 hover:text-black"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-3 border-t-2 border-zinc-100 flex flex-col space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] text-zinc-500 font-mono uppercase font-bold">Region Currency</span>
                <div className="flex items-center bg-zinc-100 border border-black rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      onCurrencyChange("INR");
                      localStorage.setItem("webxcel_currency", "INR");
                    }}
                    className={`px-2 py-0.5 text-[9px] font-black rounded-md transition-all ${
                      currency === "INR" ? "bg-yellow-300 text-black border border-black" : "text-zinc-500"
                    }`}
                  >
                    INR
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onCurrencyChange("USD");
                      localStorage.setItem("webxcel_currency", "USD");
                    }}
                    className={`px-2 py-0.5 text-[9px] font-black rounded-md transition-all ${
                      currency === "USD" ? "bg-[#3B82F6] text-white border border-black" : "text-zinc-500"
                    }`}
                  >
                    USD
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] text-zinc-500 font-mono uppercase font-bold">Starting price</span>
                <span className="text-sm font-black text-[#3B82F6] font-mono">{currency === "USD" ? "$99 Flat" : "₹6,999 Flat"}</span>
              </div>
              <button
                onClick={() => {
                  onPageChange("estimator");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-center py-3 text-xs font-black uppercase tracking-wider text-white bg-[#3B82F6] rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000]"
              >
                <span>Build Project Custom</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
