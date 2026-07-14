import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calculator, Check, Sparkles, Send, FileText, Smartphone,
  Bot, RefreshCw, Layers, CheckCircle, Copy, CheckCircle2, Calendar 
} from "lucide-react";
import { Currency, formatCurrencyValue, basePrices, addonPrices } from "../utils/currency";

interface ContactEstimatorProps {
  initialServiceName?: string;
  initialPlanName?: string;
  initialPrice?: string;
  currency: Currency;
}

export default function ContactEstimator({ 
  initialServiceName = "", 
  initialPlanName = "", 
  initialPrice = "",
  currency
}: ContactEstimatorProps) {
  // Config state
  const [selectedPlan, setSelectedPlan] = useState<string>("growth"); // starter, growth, elite, custom
  const [addons, setAddons] = useState<{ [key: string]: boolean }>({
    crm: false,
    chatbot: false,
    dialer: false,
    video: false,
    app: false,
  });

  // Pre-load from props if clicked from other sections
  useEffect(() => {
    if (initialPlanName) {
      if (initialPlanName.includes("Starter")) setSelectedPlan("starter");
      else if (initialPlanName.includes("Growth")) setSelectedPlan("growth");
      else if (initialPlanName.includes("Elite")) setSelectedPlan("elite");
    }
    
    if (initialServiceName) {
      if (initialServiceName.includes("CRM")) setAddons(p => ({ ...p, crm: true }));
      else if (initialServiceName.includes("Chatbot") || initialServiceName.includes("Agent")) setAddons(p => ({ ...p, chatbot: true }));
      else if (initialServiceName.includes("Dialer")) setAddons(p => ({ ...p, dialer: true }));
      else if (initialServiceName.includes("Video")) setAddons(p => ({ ...p, video: true }));
      else if (initialServiceName.includes("App") || initialServiceName.includes("Software")) setAddons(p => ({ ...p, app: true }));
    }
  }, [initialServiceName, initialPlanName]);

  // Lead inputs
  const [clientName, setClientName] = useState(() => localStorage.getItem("webxcel_client_name") || "");
  const [clientContact, setClientContact] = useState(() => localStorage.getItem("webxcel_client_contact") || "");
  const [clientBusiness, setClientBusiness] = useState(() => localStorage.getItem("webxcel_client_business") || "");
  const [clientNeeds, setClientNeeds] = useState(() => localStorage.getItem("webxcel_client_needs") || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Synchronize inputs with localStorage for immediate fast load and retrieval
  useEffect(() => {
    localStorage.setItem("webxcel_client_name", clientName);
  }, [clientName]);

  useEffect(() => {
    localStorage.setItem("webxcel_client_contact", clientContact);
  }, [clientContact]);

  useEffect(() => {
    localStorage.setItem("webxcel_client_business", clientBusiness);
  }, [clientBusiness]);

  useEffect(() => {
    localStorage.setItem("webxcel_client_needs", clientNeeds);
  }, [clientNeeds]);

  // Calculate live total
  const [totalPriceINR, setTotalPriceINR] = useState(14999);
  const [totalPriceUSD, setTotalPriceUSD] = useState(185);

  useEffect(() => {
    let priceINR = basePrices[selectedPlan]?.INR || 0;
    let priceUSD = basePrices[selectedPlan]?.USD || 0;
    Object.keys(addons).forEach((key) => {
      if (addons[key] && addonPrices[key]) {
        priceINR += addonPrices[key].INR;
        priceUSD += addonPrices[key].USD;
      }
    });
    setTotalPriceINR(priceINR);
    setTotalPriceUSD(priceUSD);
  }, [selectedPlan, addons]);

  const activeFormattedTotal = currency === "USD" ? `$${totalPriceUSD}` : `₹${totalPriceINR.toLocaleString("en-IN")}`;

  const toggleAddon = (key: string) => {
    setAddons((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleBookConsultant = () => {
    const selectedPlanLabel = selectedPlan === "starter" ? "Starter Web Presence" : selectedPlan === "growth" ? "Business Growth Pack" : selectedPlan === "elite" ? "Elite AI & CRM Suite" : "Custom Setup";
    const cartData = {
      plan: selectedPlanLabel,
      planPrice: basePrices[selectedPlan] ? (currency === "USD" ? `$${basePrices[selectedPlan].USD}` : `₹${basePrices[selectedPlan].INR.toLocaleString("en-IN")}`) : "0",
      addons: Object.keys(addons)
        .filter(key => addons[key] && addonPrices[key])
        .map(key => ({
          label: addonPrices[key].label,
          price: currency === "USD" ? `$${addonPrices[key].USD}` : `₹${addonPrices[key].INR.toLocaleString("en-IN")}`
        })),
      total: activeFormattedTotal
    };

    const event = new CustomEvent("open-lead-popup", {
      detail: {
        lookingFor: selectedPlanLabel,
        cart: cartData
      }
    });
    window.dispatchEvent(event);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientContact || !clientBusiness) return;
    
    setIsSubmitting(true);
    try {
      const selectedPlanLabel = selectedPlan === "starter" ? "Starter Web Presence" : selectedPlan === "growth" ? "Business Growth Pack" : selectedPlan === "elite" ? "Elite AI & CRM Suite" : "Custom Setup";
      let chosenAddons = [];
      Object.keys(addons).forEach((key) => {
        if (addons[key]) {
          chosenAddons.push(addonPrices[key].label);
        }
      });
      
      const lookingForDetails = `Quote Calculator: ${selectedPlanLabel} [${activeFormattedTotal}] | Business Sector: ${clientBusiness} | Custom Needs: ${clientNeeds || "None"} | Custom Options chosen: ${chosenAddons.join(", ") || "None"}`;

      const cartData = {
        plan: selectedPlanLabel,
        planPrice: basePrices[selectedPlan] ? (currency === "USD" ? `$${basePrices[selectedPlan].USD}` : `₹${basePrices[selectedPlan].INR.toLocaleString("en-IN")}`) : "0",
        addons: Object.keys(addons)
          .filter(key => addons[key] && addonPrices[key])
          .map(key => ({
            label: addonPrices[key].label,
            price: currency === "USD" ? `$${addonPrices[key].USD}` : `₹${addonPrices[key].INR.toLocaleString("en-IN")}`
          })),
        total: activeFormattedTotal
      };

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: clientName,
          phone: clientContact,
          location: clientBusiness, // Use business sector name as location/business details
          email: clientContact.includes("@") ? clientContact : "Not provided",
          lookingFor: lookingForDetails,
          cart: cartData
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        console.error("Failed to submit lead:", errorData.error);
      }
    } catch (err) {
      console.error("Error submitting lead:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFormattedQuoteText = () => {
    const selectedPlanLabel = selectedPlan === "starter" ? "Starter Web Presence" : selectedPlan === "growth" ? "Business Growth Pack" : selectedPlan === "elite" ? "Elite AI & CRM Suite" : "Custom Blank Setup";
    let text = `WEBXcel - Project Quote Estimate\n`;
    text += `===================================\n`;
    text += `Business: ${clientBusiness}\n`;
    text += `Contact Client: ${clientName} (${clientContact})\n`;
    const planBaseVal = basePrices[selectedPlan] ? (currency === "USD" ? `$${basePrices[selectedPlan].USD}` : `₹${basePrices[selectedPlan].INR.toLocaleString("en-IN")}`) : "0";
    text += `Base Package: ${selectedPlanLabel} (${planBaseVal})\n`;
    text += `Selected Custom Add-ons:\n`;
    Object.keys(addons).forEach((key) => {
      if (addons[key] && addonPrices[key]) {
        const addonCost = currency === "USD" ? `$${addonPrices[key].USD}` : `₹${addonPrices[key].INR.toLocaleString("en-IN")}`;
        text += `- ${addonPrices[key].label} (${addonCost})\n`;
      }
    });
    text += `===================================\n`;
    text += `Estimated Project Total: ${activeFormattedTotal}\n`;
    text += `Delivery SLA: 7-14 Days | 100% money-back guarantee\n`;
    return text;
  };

  const copyQuoteToClipboard = () => {
    navigator.clipboard.writeText(getFormattedQuoteText());
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  const handleWhatsAppRedirect = () => {
    const encodedText = encodeURIComponent(
      `Hi WEBXcel! I generated a custom project quote for my business "${clientBusiness}".\n\n` +
      `Base Package: ${selectedPlan}\n` +
      `Total Calculated Quote: ${activeFormattedTotal}\n` +
      `Looking forward to scheduling a quick discovery call!`
    );
    window.open(`https://wa.me/919102702317?text=${encodedText}`, "_blank");
  };

  return (
    <section id="estimator" className="py-24 bg-transparent relative overflow-hidden border-b-4 border-black">
      {/* Visual background decor element */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#3B82F6]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-yellow-300 border-2 border-black px-4 py-1.5 rounded-lg text-black shadow-[3px_3px_0px_#000000] transform rotate-1">
            <span className="text-xs font-black font-comic tracking-widest uppercase">
              * INTERACTIVE CALCULATOR *
            </span>
          </div>
          <h2 className="font-sfx text-4xl sm:text-5xl font-normal tracking-normal text-slate-950 uppercase leading-none">
            Configure Your Digital Build!
          </h2>
          <p className="text-zinc-700 text-sm font-bold font-sketch leading-relaxed">
            Drag and customize your agency pack. Get a transparent, live price estimate based on market's lowest rates, then lock your slot below.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="calculator-form"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch"
            >
              {/* Left Column: Interactive Settings Calculator */}
              <div className="lg:col-span-7 bg-slate-50 border border-gray-100 p-6 sm:p-8 rounded-3xl flex flex-col justify-between text-left space-y-8">
                
                {/* Step 1: Base Packages */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-yellow-300 border-2 border-black text-black flex items-center justify-center font-mono text-xs font-black shadow-[1.5px_1.5px_0px_#000000]">1</span>
                    <h3 className="text-base font-black text-slate-950 font-display uppercase tracking-tight">Select Core Base Package</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { key: "starter", name: "Starter Web Presence", price: currency === "USD" ? `$${basePrices.starter.USD}` : `₹${basePrices.starter.INR.toLocaleString("en-IN")}`, desc: "Single page 3D-styled" },
                      { key: "growth", name: "Growth CRM Pack", price: currency === "USD" ? `$${basePrices.growth.USD}` : `₹${basePrices.growth.INR.toLocaleString("en-IN")}`, desc: "5 Pages + Sales Lead CRM" },
                      { key: "elite", name: "Elite AI Suite", price: currency === "USD" ? `$${basePrices.elite.USD}` : `₹${basePrices.elite.INR.toLocaleString("en-IN")}`, desc: "Full web, CRM, Chatbot & Dialer" },
                    ].map((plan) => (
                      <button
                        key={plan.key}
                        type="button"
                        onClick={() => setSelectedPlan(plan.key)}
                        className={`p-4 rounded-xl border-2 border-black text-left transition-all flex flex-col justify-between cursor-pointer h-32 ${
                          selectedPlan === plan.key
                            ? "bg-white border-4 shadow-[3px_3px_0px_#000000] translate-x-[-1px] translate-y-[-1px]"
                            : "bg-white border-2 hover:border-black hover:shadow-[1.5px_1.5px_0px_#000000]"
                        }`}
                      >
                        <div>
                          <span className="block text-xs font-black text-slate-950">{plan.name}</span>
                          <span className="block text-[10px] text-zinc-500 font-bold mt-1 leading-tight">{plan.desc}</span>
                        </div>
                        <span className="block text-base font-black text-[#3B82F6] mt-2 font-display">{plan.price}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Custom Add-ons Checkboxes */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-[#3B82F6] border-2 border-black text-white flex items-center justify-center font-mono text-xs font-black shadow-[1.5px_1.5px_0px_#000000]">2</span>
                    <h3 className="text-base font-black text-slate-950 font-display uppercase tracking-tight">Combine Custom Capabilities</h3>
                  </div>

                  <div className="space-y-2.5">
                    {Object.keys(addonPrices).map((key) => {
                      const addon = addonPrices[key];
                      const isChecked = addons[key];
                      return (
                        <div
                          key={key}
                          onClick={() => toggleAddon(key)}
                          className={`p-3.5 rounded-xl border-2 border-black transition-all flex items-center justify-between cursor-pointer ${
                            isChecked
                              ? "bg-white border-4 shadow-[3px_3px_0px_#000000]"
                              : "bg-white/60 border-2 hover:border-black hover:shadow-[1.5px_1.5px_0px_#000000]"
                          }`}
                        >
                          <div className="flex items-start space-x-3 text-left">
                            <div className={`w-5 h-5 rounded border-2 border-black mt-0.5 flex items-center justify-center transition-all ${
                              isChecked
                               ? "bg-yellow-300 text-black font-black"
                                : "bg-white border-zinc-300"
                            }`}>
                              {isChecked && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                            </div>
                            <div>
                              <span className="block text-xs font-black text-slate-950">{addon.label}</span>
                              <span className="block text-[10px] text-zinc-500 font-bold mt-0.5">{addon.desc}</span>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-black text-slate-950 bg-yellow-300 border-2 border-black px-2.5 py-1 rounded-lg shadow-[1.5px_1.5px_0px_#000000]">
                            +{currency === "USD" ? `$${addon.USD}` : `₹${addon.INR.toLocaleString("en-IN")}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Transparent Total Summary panel */}
                <div className="bg-slate-950 text-white p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-4 border-black shadow-[4px_4px_0px_#3B82F6]">
                  <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2.5 text-left">
                    <span className="text-[10px] font-black font-mono text-zinc-400 uppercase tracking-widest leading-none">Estimated Total Cost</span>
                    <span className="text-3xl font-black text-white font-display uppercase tracking-tight leading-none">
                      {activeFormattedTotal}
                    </span>
                    <span className="inline-flex items-center text-[9px] font-mono font-black text-[#10B981] bg-emerald-950/80 px-2 py-1 rounded border border-emerald-500 uppercase tracking-wider leading-none">
                      Zero Hidden Fees
                    </span>
                    <span className="text-[9.5px] font-mono font-extrabold text-amber-400 uppercase tracking-wider animate-pulse leading-none">
                      * Prices Negotiable *
                    </span>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                    <span className="block text-[9px] font-mono font-black text-black bg-yellow-300 px-2.5 py-1 rounded border-2 border-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_#000000] leading-none">
                      Best Rate Verified
                    </span>
                    <button
                      type="button"
                      onClick={handleBookConsultant}
                      className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-mono font-black text-[10px] uppercase tracking-wider rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer leading-none"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Consultant</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column: Submission Leads Form */}
              <div className="lg:col-span-5 bg-white border-4 border-black shadow-[6px_6px_0px_#000000] p-6 sm:p-8 rounded-xl flex flex-col justify-between text-left h-full">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-950 font-display uppercase tracking-tight">Secure Your Launch Slot</h3>
                    <p className="text-xs text-zinc-500 font-bold leading-relaxed">
                      Fill in your business details below. We'll generate a comprehensive execution blueprint and proposal corresponding to your calculated quote.
                    </p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5 font-black">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Ujjwal Tiwari"
                        className="w-full px-4 py-3 bg-zinc-50 border-2 border-black rounded-xl text-sm focus:outline-hidden focus:bg-white text-slate-950 font-bold placeholder-zinc-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5 font-black">Business WhatsApp / Email</label>
                      <input
                        type="text"
                        required
                        value={clientContact}
                        onChange={(e) => setClientContact(e.target.value)}
                        placeholder="e.g. +91 98765-43210"
                        className="w-full px-4 py-3 bg-zinc-50 border-2 border-black rounded-xl text-sm focus:outline-hidden focus:bg-white text-slate-950 font-bold placeholder-zinc-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5 font-black">Your Business Sector / Name</label>
                      <input
                        type="text"
                        required
                        value={clientBusiness}
                        onChange={(e) => setClientBusiness(e.target.value)}
                        placeholder="e.g. Apex Legal Firm / Cloud Kitchen"
                        className="w-full px-4 py-3 bg-zinc-50 border-2 border-black rounded-xl text-sm focus:outline-hidden focus:bg-white text-slate-950 font-bold placeholder-zinc-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5 font-black">Specific Feature Demands (Optional)</label>
                      <textarea
                        rows={3}
                        value={clientNeeds}
                        onChange={(e) => setClientNeeds(e.target.value)}
                        placeholder="Describe any particular integrations, video edits or timelines required..."
                        className="w-full px-4 py-3 bg-zinc-50 border-2 border-black rounded-xl text-sm focus:outline-hidden focus:bg-white text-slate-950 font-bold placeholder-zinc-400 resize-none font-normal"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !clientName || !clientContact || !clientBusiness}
                      className="w-full py-4 bg-yellow-300 hover:bg-black hover:text-white disabled:bg-zinc-200 disabled:text-zinc-400 disabled:border-zinc-300 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer mt-2"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                          <span>Generating Estimate...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4.5 h-4.5" />
                          <span>Book Discovery Call</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <span className="block text-[9px] text-zinc-500 font-mono text-center uppercase tracking-wider mt-5 font-black leading-none">
                  🔒 Secure Data Encryption Policy
                </span>
              </div>
            </motion.div>
          ) : (
            /* Success confirmation screen */
            <motion.div
              key="calculator-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto bg-zinc-50 border-4 border-black p-8 rounded-xl text-center space-y-6 shadow-[6px_6px_0px_#000000]"
            >
              <div className="w-16 h-16 rounded-xl bg-emerald-300 border-2 border-black flex items-center justify-center text-black mx-auto shadow-[3px_3px_0px_#000000]">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div className="space-y-2 text-center">
                <h3 className="text-2xl font-black text-slate-950 font-display uppercase tracking-tight">Quote Locked Successfully!</h3>
                <p className="text-sm text-zinc-600 font-bold leading-relaxed max-w-sm mx-auto">
                  Thank you, <strong>{clientName}</strong>! Your customized estimate of <strong>{activeFormattedTotal}</strong> has been submitted. Our team will contact you on WhatsApp/Email within 12 hours.
                </p>
                <span className="block text-[10px] font-mono font-extrabold text-amber-600 mt-1 uppercase tracking-wider">
                  * Prices Negotiable *
                </span>
              </div>

              {/* Displayed generated quote box */}
              <div className="bg-white border-2 border-black p-5 rounded-xl text-left relative overflow-hidden shadow-[3px_3px_0px_#000000]">
                <span className="absolute top-2 right-2 text-[8px] bg-yellow-300 border border-black text-black font-mono font-black px-2 py-0.5 rounded uppercase">
                  Quote Details
                </span>
                <pre className="text-[11px] font-mono text-slate-800 whitespace-pre-wrap font-bold">
                  {getFormattedQuoteText()}
                </pre>
              </div>

              {/* Copy and WhatsApp direct actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <button
                  onClick={copyQuoteToClipboard}
                  className="px-5 py-3.5 bg-white border-2 border-black hover:bg-zinc-50 rounded-xl text-xs font-black uppercase tracking-wider text-slate-950 transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-[3px_3px_0px_#000000] shrink-0 animate-none"
                >
                  {copiedQuote ? <Check className="w-4 h-4 text-emerald-650 stroke-[3.5]" /> : <Copy className="w-4 h-4 text-[#3B82F6]" />}
                  <span>{copiedQuote ? "Quote Copied!" : "Copy Quotation Specs"}</span>
                </button>

                <button
                  onClick={handleWhatsAppRedirect}
                  className="px-6 py-3.5 bg-emerald-400 hover:bg-black hover:text-white border-2 border-black text-black rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-[3px_3px_0px_#000000]"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Send Quote via WhatsApp</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setClientName("");
                  setClientContact("");
                  setClientBusiness("");
                  setClientNeeds("");
                }}
                className="text-xs text-zinc-500 hover:text-[#3B82F6] font-mono underline block mx-auto cursor-pointer font-bold"
              >
                Estimate Another Project Build
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
