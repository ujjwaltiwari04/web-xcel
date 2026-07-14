export type Currency = "INR" | "USD";

// Clean matched pricing so that the website displays professional numbers rather than odd conversion numbers
export const basePrices: { [key: string]: { INR: number; USD: number } } = {
  starter: { INR: 6999, USD: 99 },
  growth: { INR: 14999, USD: 185 },
  elite: { INR: 39999, USD: 499 },
  custom: { INR: 0, USD: 0 },
};

export const addonPrices: { [key: string]: { label: string; INR: number; USD: number; desc: string } } = {
  crm: { label: "Bespoke CRM Pipeline Sync", INR: 9999, USD: 129, desc: "Lead intake boards & visual client filters" },
  chatbot: { label: "Gemini Virtual Agent Chatbot", INR: 7999, USD: 99, desc: "A custom LLM chatbot trained on your business data" },
  dialer: { label: "Automated Outbound Dialer Config", INR: 12999, USD: 159, desc: "Web-based power dialing for cold lists" },
  video: { label: "High-Impact Video Reel Editing", INR: 2499, USD: 35, desc: "One custom social media reels edit" },
  app: { label: "Mobile App Development Add-on", INR: 24999, USD: 299, desc: "Cross-platform Android & iOS deploy packages" },
};

export const servicePrices: { [key: string]: { INR: number; USD: number } } = {
  // Bento Grid Services
  "Business Website Development": { INR: 6999, USD: 99 },
  "Tailored CRM Creation": { INR: 14999, USD: 185 },
  "AI Agents & Chatbots": { INR: 14999, USD: 185 },
  "Call Dialer & Automated Outreach": { INR: 24999, USD: 299 },
  "High-Impact Video Editing": { INR: 2999, USD: 39 },
  "Software & Mobile App Development": { INR: 34999, USD: 429 },

  // Catalog Tabs
  "Custom Software Development": { INR: 29999, USD: 369 },
  "AI, CRM & Booking Engines": { INR: 19999, USD: 249 },
  "E-Commerce & Launch Operations": { INR: 14999, USD: 185 },
  "Creative & Growth Marketing": { INR: 9999, USD: 119 },

  // Industry Bundles
  "Bundle Pack: Clinic & Doctor Pack": { INR: 19999, USD: 249 },
  "Bundle Pack: Real Estate Growth Pack": { INR: 24999, USD: 299 },
  "Bundle Pack: Restaurant & Cafe Pack": { INR: 19999, USD: 249 },
  "Bundle Pack: School & Academy Suite": { INR: 29999, USD: 369 },
  "Bundle Pack: Gym & Fitness Studio Pack": { INR: 14999, USD: 185 },
  "Bundle Pack: Law Firm & Attorney Suite": { INR: 19999, USD: 249 },
  "Bundle Pack: Manufacturing & Supply Pack": { INR: 24999, USD: 299 },
};

export function getServiceBasePrice(serviceName: string): { INR: number; USD: number } {
  if (!serviceName) return { INR: 14999, USD: 185 };
  
  // Direct match
  if (servicePrices[serviceName]) {
    return servicePrices[serviceName];
  }
  
  // Partial match checks
  const lower = serviceName.toLowerCase();
  for (const key of Object.keys(servicePrices)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return servicePrices[key];
    }
  }
  
  // Parse sub-items
  if (lower.includes("erp")) return { INR: 29999, USD: 369 };
  if (lower.includes("hrms")) return { INR: 24999, USD: 299 };
  if (lower.includes("payroll")) return { INR: 19999, USD: 249 };
  if (lower.includes("inventory")) return { INR: 19999, USD: 249 };
  if (lower.includes("hospital") || lower.includes("hotel") || lower.includes("school")) return { INR: 34999, USD: 429 };
  if (lower.includes("pos") || lower.includes("ordering")) return { INR: 19999, USD: 249 };
  if (lower.includes("telephone") || lower.includes("receptionist")) return { INR: 19999, USD: 249 };
  if (lower.includes("chatbot") || lower.includes("agent")) return { INR: 14999, USD: 185 };
  if (lower.includes("booking") || lower.includes("calendar")) return { INR: 9999, USD: 119 };
  if (lower.includes("crm")) return { INR: 14999, USD: 185 };
  if (lower.includes("domain") || lower.includes("dns")) return { INR: 2999, USD: 35 };
  if (lower.includes("hosting")) return { INR: 4999, USD: 59 };
  if (lower.includes("ssl")) return { INR: 1999, USD: 25 };
  if (lower.includes("server")) return { INR: 9999, USD: 119 };
  if (lower.includes("backup")) return { INR: 4999, USD: 59 };
  if (lower.includes("e-commerce")) return { INR: 14999, USD: 185 };
  if (lower.includes("graphic") || lower.includes("design")) return { INR: 4999, USD: 59 };
  if (lower.includes("ad") || lower.includes("video") || lower.includes("reel")) return { INR: 2999, USD: 39 };
  if (lower.includes("funnel")) return { INR: 9999, USD: 119 };

  return { INR: 14999, USD: 185 };
}

// General helper for static strings or fallback numbers
export function formatCurrencyValue(amountInINR: number, currency: Currency): string {
  if (currency === "USD") {
    // Elegant hardcoded map lookups or conversion rate fallback
    if (amountInINR === 6999) return "$99";
    if (amountInINR === 18000) return "$250";
    if (amountInINR === 19999) return "$249";
    if (amountInINR === 50000) return "$650";
    if (amountInINR === 39999) return "$499";
    if (amountInINR === 120000) return "$1,500";
    if (amountInINR === 14999) return "$185";
    if (amountInINR === 45000) return "$550";
    if (amountInINR === 24999) return "$299";
    if (amountInINR === 75000) return "$899";
    if (amountInINR === 2999) return "$39";
    if (amountInINR === 8000) return "$99";
    if (amountInINR === 5900) return "$79";
    if (amountInINR === 20000) return "$250";
    if (amountInINR === 34999) return "$429";
    if (amountInINR === 500) return "$9";
    if (amountInINR === 59999) return "$749";
    if (amountInINR === 29999) return "$369";
    if (amountInINR === 9999) return "$119";

    const converted = Math.round(amountInINR / 83);
    return `$${converted.toLocaleString("en-US")}`;
  }
  return `₹${amountInINR.toLocaleString("en-IN")}`;
}
