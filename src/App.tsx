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

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [currency, setCurrency] = useState<Currency>("INR");
  
  // Selection state to pipe configurations from plans or service cards down to the Quote Builder calculator
  const [selectedService, setSelectedService] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

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

  const handlePageChange = (pageId: string) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
