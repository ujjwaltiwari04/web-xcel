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
    if (amountInINR === 14999) return "$189";
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

    const converted = Math.round(amountInINR / 83);
    return `$${converted.toLocaleString("en-US")}`;
  }
  return `₹${amountInINR.toLocaleString("en-IN")}`;
}
