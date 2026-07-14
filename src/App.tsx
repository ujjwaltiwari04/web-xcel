import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import AIConsultant from "./components/AIConsultant";
import Portfolio from "./components/Portfolio";
import Pricing from "./components/Pricing";
import ContactEstimator from "./components/ContactEstimator";
import SheetsAdmin from "./components/SheetsAdmin";
import HomeExtendedContent from "./components/HomeExtendedContent";
import AboutUs from "./components/AboutUs";
import Footer from "./components/Footer";
import LeadPopup from "./components/LeadPopup";
import { Currency } from "./utils/currency";
import WhyUs from "./components/WhyUs";
import FiverrComparison from "./components/FiverrComparison";

export default function App() {
  const getPageFromPath = () => {
    if (typeof window === "undefined") return "home";
    const path = window.location.pathname.replace(/^\/+|\/+$/g, "");
    const hash = window.location.hash.replace("#", "");
    const validPages = ["services", "consultant", "portfolio", "pricing", "estimator", "about", "fiverr-alternative"];
    if (validPages.includes(hash)) return hash;
    return validPages.includes(path) ? path : "home";
  };

  const [currentPage, setCurrentPage] = useState(getPageFromPath);
  const [currency, setCurrency] = useState<Currency>("INR");
  
  // Selection state to pipe configurations from plans or service cards down to the Quote Builder calculator
  const [selectedService, setSelectedService] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Sync state with dynamic browser URL history changes (Back/Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getPageFromPath());
    };
    window.addEventListener("popstate", handlePopState);
    
    // Clean up hashes if they are present by redirecting to the proper path
    if (window.location.hash) {
      const pageId = window.location.hash.replace("#", "");
      const validPages = ["services", "consultant", "portfolio", "pricing", "estimator", "about", "fiverr-alternative"];
      if (validPages.includes(pageId)) {
        window.history.replaceState(null, "", `/${pageId}`);
      } else if (pageId === "home") {
        window.history.replaceState(null, "", "/");
      }
    }
    
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    // 1. Check local storage for manual selection override
    const saved = localStorage.getItem("webxcel_currency");
    if (saved === "INR" || saved === "USD") {
      setCurrency(saved as Currency);
      return;
    }

    // 2. Fast instant timezone-based location prediction
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) {
        if (tz.includes("Kolkata") || tz.includes("Calcutta") || tz.includes("Asia/Kolkata") || tz.includes("Asia/Calcutta")) {
          setCurrency("INR");
          return;
        }
      }
    } catch (e) {}

    // 3. Fast browser locale-based fallback
    try {
      const locale = navigator.language || "";
      if (locale.includes("in") || locale.includes("IN")) {
        setCurrency("INR");
        return;
      }
    } catch (e) {}

    // 4. Default to USD if outside India, then do a background check
    setCurrency("USD");

    // Non-blocking background IP geolocation check
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.country_code) {
          const detectedCurrency = data.country_code === "IN" ? "INR" : "USD";
          setCurrency(detectedCurrency);
          localStorage.setItem("webxcel_currency", detectedCurrency);
        }
      })
      .catch(() => {
        // Safe fallback in case of CORS or connectivity blocks
        console.log("Using browser localized settings.");
      });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("admin") === "true") {
        setIsAdmin(true);
      }
    }
  }, []);

  // SEO Metadata dynamic updater
  useEffect(() => {
    const titles: { [key: string]: string } = {
      home: "WEBXcel | Custom Website Development, CRM & AI Chatbots",
      services: "Services | High-Performance Hand-Coded Web Systems",
      consultant: "AI Consultant | Brainstorm Your Product Build",
      portfolio: "Our Portfolio | Production-Ready Projects",
      pricing: "Pricing | Flat Rates, Zero Hidden Commissions",
      estimator: "Quote Estimator | Calculate Custom Project Scope",
      about: "About Us | Founding Story & Engineering Journey",
      "fiverr-alternative": "Fiverr Alternative: Elite Direct React Web Developers | WEBXcel",
    };

    const descriptions: { [key: string]: string } = {
      home: "WEBXcel engineers high-performance, hand-coded business websites, tailored CRM dashboards, and professional video edits designed to unlock small enterprise potential.",
      services: "Explore our range of custom software services including React web presence, CRM pipelines, Gemini AI agents, auto-dialers, and promotional editing.",
      consultant: "Chat with XcelBot, our dedicated AI consultant, to get instant pricing estimates and architecture suggestions for your software needs.",
      portfolio: "Browse our hand-coded software implementations, CRM admin dashboard setups, and digital platforms built for real-world business growth.",
      pricing: "Simple, honest, transparent prices with no host lockups. Calculate your build cost online and own your code assets forever.",
      estimator: "Use our interactive cost estimator to outline your custom website spec and secure the best direct rates.",
      about: "Meet Ujjwal Tiwari & Raj Dubey, the team behind WEBXcel. Learn about our philosophy of custom, high-speed, performance-oriented coding.",
      "fiverr-alternative": "Looking to hire a React developer on Fiverr or Upwork? Learn why businesses choose WEBXcel. Zero platform markups, direct founder communication, 100% custom code.",
    };

    if (titles[currentPage]) {
      document.title = titles[currentPage];
    }
    
    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc && descriptions[currentPage]) {
      metaDesc.setAttribute("content", descriptions[currentPage]);
    }
  }, [currentPage]);

  const handlePageChange = (pageId: string) => {
    setCurrentPage(pageId);
    if (typeof window !== "undefined") {
      const targetPath = pageId === "home" ? "/" : `/${pageId}`;
      window.history.pushState(null, "", targetPath);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Pipeline from Service Cards to Estimator
  const handleServiceSelect = (serviceName: string) => {
    setSelectedService(serviceName);
    setSelectedPlan(""); // reset plan state
    handlePageChange("estimator");
  };

  // Pipeline from Pricing Tiers to Estimator
  const handlePlanSelect = (planName: string, amount: string) => {
    setSelectedPlan(planName);
    setSelectedPrice(amount);
    setSelectedService(""); // reset service state
    handlePageChange("estimator");
  };

  return (
    <div className="relative min-h-screen bg-[#FFFDF6] bg-halftone flex flex-col justify-between">
      <div>
        {/* Floating Header */}
        <Navbar currentPage={currentPage} onPageChange={handlePageChange} currency={currency} onCurrencyChange={setCurrency} />

        {/* Dynamic Route Content with elegant Framer Motion transition animation */}
        <div className="pt-24 min-h-[60vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {currentPage === "home" && (
                <>
                  {/* Hero Presentation Page */}
                  <Hero onCtaclick={handlePageChange} currency={currency} />
                  {/* Newly extended dynamic content for Homepage */}
                  <HomeExtendedContent onAction={handlePageChange} />
                  {/* Refined Why Us Value Proposition Section */}
                  <WhyUs />
                </>
              )}

              {currentPage === "services" && (
                <Services onServiceSelect={handleServiceSelect} currency={currency} />
              )}

              {currentPage === "consultant" && (
                <AIConsultant currency={currency} />
              )}

              {currentPage === "portfolio" && (
                <Portfolio currency={currency} />
              )}

              {currentPage === "pricing" && (
                <Pricing onPlanSelect={handlePlanSelect} currency={currency} />
              )}

              {currentPage === "estimator" && (
                <ContactEstimator 
                  initialServiceName={selectedService} 
                  initialPlanName={selectedPlan}
                  initialPrice={selectedPrice}
                  currency={currency}
                />
              )}

              {currentPage === "about" && (
                <AboutUs onPageChange={handlePageChange} />
              )}

              {currentPage === "fiverr-alternative" && (
                <FiverrComparison onPageChange={handlePageChange} currency={currency} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div>
        {/* Google Sheets Owner Integration Console */}
        {isAdmin && <SheetsAdmin />}

        {/* Footer Branding Signature details */}
        <Footer onPageChange={handlePageChange} currency={currency} />
      </div>

      {/* Pop-up form that loads after 5 seconds for consulting leads */}
      <LeadPopup currency={currency} />
    </div>
  );
}
