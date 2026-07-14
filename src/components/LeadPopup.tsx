import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, ShieldCheck, Sparkles, Check, AlertCircle, RefreshCw } from "lucide-react";
import { Currency, formatCurrencyValue } from "../utils/currency";

interface CartItem {
  label: string;
  price: string;
}

interface CartData {
  plan: string;
  planPrice: string;
  addons: CartItem[];
  total: string;
}

interface LeadPopupProps {
  currency: Currency;
}

export default function LeadPopup({ currency }: LeadPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lookingFor, setLookingFor] = useState("Business Website Development");
  const [cart, setCart] = useState<CartData | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const services = [
    "Business Website Development",
    "Bespoke CRM Solutions",
    "AI Chatbots & Intelligent Agents",
    "Call Dialer & Automated Outreach",
    "High-Impact Video Reel Editing",
    "Mobile App Development",
    "Custom Software & Web Apps"
  ];

  useEffect(() => {
    const handleOpenPopup = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        if (customEvent.detail.lookingFor) {
          setLookingFor(customEvent.detail.lookingFor);
        }
        if (customEvent.detail.cart) {
          setCart(customEvent.detail.cart);
        } else {
          setCart(null);
        }
      } else {
        setCart(null);
      }
      setIsOpen(true);
    };
    window.addEventListener("open-lead-popup", handleOpenPopup);
    return () => window.removeEventListener("open-lead-popup", handleOpenPopup);
  }, []);

  useEffect(() => {
    // Check if user has already dismissed or completed the form in this browser
    const isDismissed = localStorage.getItem("lead_popup_dismissed");
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000); // 5 seconds delay

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Persist dismissal so it doesn't pop up again immediately
    localStorage.setItem("lead_popup_dismissed", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!phone.trim()) {
      setErrorMessage("Please enter your phone number.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const finalLookingFor = cart 
        ? `Cart Booking: ${cart.plan} [Total: ${cart.total}] | Addons: ${cart.addons.map(a => `${a.label} (${a.price})`).join(", ") || "None"}`
        : lookingFor;

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          location,
          phone,
          email,
          lookingFor: finalLookingFor,
          cart: cart || null,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        localStorage.setItem("lead_popup_dismissed", "true");
        // Auto close after 3 seconds on success
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      } else {
        const errData = await response.json();
        setErrorMessage(errData.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Failed to submit lead", err);
      setErrorMessage("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          {/* Backdrop closer */}
          <div className="absolute inset-0" onClick={handleClose} />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden z-10 font-sans"
          >
            {/* Top Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg border-2 border-black bg-zinc-100 hover:bg-yellow-300 transition-colors text-black cursor-pointer z-30 shadow-[2px_2px_0px_#000000]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="overflow-y-auto flex-1 scrollbar-thin">
              {!isSubmitted ? (
                <div className="p-6 sm:p-8">
                  {/* Header Section */}
                  <div className="text-left pr-8 mb-5">
                    <div className="inline-flex items-center space-x-1.5 bg-blue-100 border-2 border-black px-2.5 py-1 rounded-md text-xs font-mono font-black uppercase text-blue-800 mb-2.5 shadow-[2px_2px_0px_#000000]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Special Consulting Invitation</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-display font-black text-slate-950 tracking-tight leading-none mb-1">
                      Welcome! Let us help you
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 font-medium">
                      Share your details and our consultancy team will contact you with suitable offers and ideas.
                    </p>
                  </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  {errorMessage && (
                    <div className="flex items-center space-x-2 bg-red-50 border-2 border-black p-3 rounded-xl text-xs text-red-700 font-bold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Cart Option Panel (Only if cart state is present) */}
                  {cart && (
                    <div className="bg-zinc-50 border-2 border-black p-3.5 rounded-xl text-left shadow-[2px_2px_0px_rgba(0,0,0,1)] text-xs">
                      <div className="flex items-center justify-between border-b border-zinc-200 pb-1.5 mb-2">
                        <span className="text-[10px] font-mono font-black uppercase text-blue-600 flex items-center gap-1.5">
                          🛒 Your Estimate Cart
                        </span>
                        <span className="text-[9px] font-mono font-bold text-zinc-500 bg-zinc-200 px-1.5 py-0.5 rounded uppercase">
                          Pre-selected Options
                        </span>
                      </div>
                      
                      <div className="space-y-1.5">
                        {/* Plan Row */}
                        <div className="flex items-center justify-between font-black text-slate-950">
                          <span className="flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 stroke-[2.5]" />
                            {cart.plan}
                          </span>
                          <span className="font-mono text-zinc-600 text-[11px]">{cart.planPrice}</span>
                        </div>

                        {/* Addon Rows */}
                        {cart.addons.map((addon, idx) => (
                          <div key={idx} className="flex items-center justify-between text-zinc-600 font-bold pl-4.5">
                            <span className="flex items-center gap-1 text-[11px]">
                              <span className="text-blue-500 font-mono text-[9px] font-black">+</span>
                              {addon.label}
                            </span>
                            <span className="font-mono text-[10px] text-zinc-500">{addon.price}</span>
                          </div>
                        ))}

                        {/* Total Row */}
                        <div className="flex items-center justify-between border-t border-dashed border-zinc-300 pt-2 mt-2 font-black text-slate-950 text-sm">
                          <span className="uppercase text-[10px] font-mono tracking-wider text-zinc-500">Negotiable Total:</span>
                          <span className="font-display text-blue-600 font-black text-base">{cart.total}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono font-black uppercase text-slate-700 mb-1 ml-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ujjwal Tiwari"
                        className="w-full px-3 py-2 bg-zinc-50 border-2 border-black rounded-xl text-xs focus:outline-none focus:bg-white text-slate-950 font-bold placeholder-zinc-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-black uppercase text-slate-700 mb-1 ml-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Gurugram, IN"
                        className="w-full px-3 py-2 bg-zinc-50 border-2 border-black rounded-xl text-xs focus:outline-none focus:bg-white text-slate-950 font-bold placeholder-zinc-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono font-black uppercase text-slate-700 mb-1 ml-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765-43210"
                        className="w-full px-3 py-2 bg-zinc-50 border-2 border-black rounded-xl text-xs focus:outline-none focus:bg-white text-slate-950 font-bold placeholder-zinc-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-black uppercase text-slate-700 mb-1 ml-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full px-3 py-2 bg-zinc-50 border-2 border-black rounded-xl text-xs focus:outline-none focus:bg-white text-slate-950 font-bold placeholder-zinc-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-black uppercase text-slate-700 mb-1 ml-1">
                      Looking For
                    </label>
                    <select
                      value={lookingFor}
                      onChange={(e) => setLookingFor(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 border-2 border-black rounded-xl text-xs focus:outline-none focus:bg-white text-slate-950 font-bold cursor-pointer"
                    >
                      {services.map((svc) => (
                        <option key={svc} value={svc}>
                          {svc}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Encryption Policy Badge */}
                  <div className="flex items-center space-x-2 bg-emerald-50 border-2 border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs text-emerald-800 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-mono text-[9px] uppercase tracking-wider font-black">
                      🔒 Secure Data Encryption Policy Active
                    </span>
                  </div>

                  {/* Note block */}
                  <div className="bg-yellow-100 border-2 border-black p-4 rounded-xl text-xs text-slate-950 shadow-[3px_3px_0px_#000000] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-200/50 rounded-full translate-x-6 -translate-y-6 pointer-events-none" />
                    <span className="font-mono font-black text-[#3B82F6] uppercase tracking-wider block mb-1">
                      Important Note:
                    </span>
                    <p className="font-bold leading-relaxed">
                      We only charge after we've created a demo of your project. If you're satisfied with the demo, you can proceed with the payment, and we'll complete the full project. The demo is available for a nominal fee of {formatCurrencyValue(500, currency)}, which allows you to evaluate our work before making a commitment.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 mt-2 bg-yellow-300 hover:bg-black hover:text-white disabled:bg-zinc-200 disabled:text-zinc-400 disabled:border-zinc-300 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending details...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Details</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              // Success Screen
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-black flex items-center justify-center text-emerald-600 shadow-[3px_3px_0px_rgba(0,0,0,1)] animate-bounce mb-2">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-2xl font-display font-black text-slate-950 tracking-tight">
                  Details Received!
                </h3>
                <p className="text-xs text-zinc-600 max-w-xs mx-auto font-bold">
                  Thank you for sharing your details. Our consulting team is reviewing your requirements and will reach out with customized offers shortly.
                </p>
                <div className="bg-yellow-50 border border-zinc-200 p-3 rounded-xl text-[11px] text-zinc-700 font-bold max-w-sm">
                  We will get back to you within 2-4 business hours!
                </div>
              </div>
            )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
