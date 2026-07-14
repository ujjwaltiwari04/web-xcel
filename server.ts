import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";

dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini Client
// We use a lazy initializer to avoid crashing on startup if the API key is not yet set up
let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined. AI Consultant will run in mock mode.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// ------------------- GOOGLE SHEETS UTILITIES & API -------------------

interface SheetsConfig {
  spreadsheetId: string;
  accessToken: string;
}

async function appendLeadToSheet(lead: any, config: SheetsConfig) {
  if (!config.spreadsheetId || !config.accessToken) return false;
  
  // Use a general A:H range to match all columns up to Status
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/A:H:append?valueInputOption=USER_ENTERED`;
  
  // Format Date Submitted cleanly in a human-readable format
  const formattedDate = lead.createdAt 
    ? new Date(lead.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) 
    : new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  // Format Cart ITEMS column & Looking For field dynamically
  let cartItemsText = "";
  let lookingForValue = lead.lookingFor;

  if (lead.cart) {
    const addonsStr = lead.cart.addons && lead.cart.addons.length > 0
      ? lead.cart.addons.map((a: any) => `${a.label} (${a.price})`).join(", ")
      : "None";
    cartItemsText = `Plan: ${lead.cart.plan} (${lead.cart.planPrice})\nAddons: ${addonsStr}\nTotal: ${lead.cart.total}`;
    lookingForValue = lead.cart.plan;
  } else {
    cartItemsText = "No cart items (Initial Popup)";
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      values: [
        [
          formattedDate,
          lead.name,
          lead.location || "Not provided",
          lead.phone,
          lead.email || "Not provided",
          lookingForValue,
          cartItemsText,
          lead.status || "New"
        ]
      ]
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Google Sheets append failed:", errorText);
    throw new Error(`Google Sheets API returned ${response.status}: ${errorText}`);
  }
  return true;
}

// ------------------- API ROUTES -------------------

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// GET active Google Sheets config
app.get("/api/sheets/config", async (req, res) => {
  try {
    const fs = await import("fs/promises");
    const configPath = path.join(process.cwd(), "sheets-config.json");
    let config = { spreadsheetId: "1GqX-eIom-ic0AVDGC6i_rRTLjBqdGMCDEBI4LGjbocw", isConnected: false };
    try {
      const data = await fs.readFile(configPath, "utf8");
      const parsed = JSON.parse(data);
      config.spreadsheetId = parsed.spreadsheetId || "1GqX-eIom-ic0AVDGC6i_rRTLjBqdGMCDEBI4LGjbocw";
      config.isConnected = !!parsed.accessToken;
    } catch (e) {
      // Config does not exist yet
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: "Failed to read sheets config." });
  }
});

// POST update Google Sheets config (saves Access Token & Spreadsheet ID)
app.post("/api/sheets/config", async (req, res) => {
  try {
    const { spreadsheetId, accessToken } = req.body;
    const finalSpreadsheetId = (spreadsheetId || "").trim() || "1GqX-eIom-ic0AVDGC6i_rRTLjBqdGMCDEBI4LGjbocw";
    const fs = await import("fs/promises");
    const configPath = path.join(process.cwd(), "sheets-config.json");
    
    let existingToken = "";
    try {
      const data = await fs.readFile(configPath, "utf8");
      const parsed = JSON.parse(data);
      existingToken = parsed.accessToken || "";
    } catch (e) {}

    const config = {
      spreadsheetId: finalSpreadsheetId,
      accessToken: accessToken || existingToken,
      updatedAt: new Date().toISOString()
    };
    
    await fs.writeFile(configPath, JSON.stringify(config, null, 2), "utf8");
    
    // Create/Format first row headers if newly connected
    const activeToken = accessToken || existingToken;
    if (finalSpreadsheetId && activeToken) {
      try {
        const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/${finalSpreadsheetId}/values/A1:H1?valueInputOption=USER_ENTERED`;
        await fetch(testUrl, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${activeToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            values: [
              ["Timestamp", "Client Name", "Location / Scope", "Contact (Phone/WhatsApp)", "Email Address", "Requested Services / Quote Info", "Cart ITEMS", "Status"]
            ]
          })
        });
      } catch (err) {
        console.warn("Could not write header row, spreadsheet might already contain data:", err);
      }
    }
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to save sheets config.", details: error.message });
  }
});

// POST sync all existing local leads from leads.json to Google Sheet
app.post("/api/sheets/sync-all", async (req, res) => {
  try {
    const fs = await import("fs/promises");
    const configPath = path.join(process.cwd(), "sheets-config.json");
    const leadsFilePath = path.join(process.cwd(), "leads.json");
    
    let config: any = null;
    try {
      const configData = await fs.readFile(configPath, "utf8");
      config = JSON.parse(configData);
    } catch (e) {
      res.status(400).json({ error: "Google Sheets is not configured yet. Sign in and connect first." });
      return;
    }
    
    if (!config || !config.spreadsheetId || !config.accessToken) {
      res.status(400).json({ error: "Google Sheets connection credentials are missing." });
      return;
    }
    
    let leads = [];
    try {
      const leadsData = await fs.readFile(leadsFilePath, "utf8");
      leads = JSON.parse(leadsData);
    } catch (e) {
      // No leads file found
    }
    
    if (leads.length === 0) {
      res.json({ success: true, count: 0, message: "No local leads found to sync." });
      return;
    }
    
    let successCount = 0;
    for (const lead of leads) {
      try {
        await appendLeadToSheet(lead, config);
        successCount++;
      } catch (err) {
        console.error("Failed to sync individual lead to Google Sheets:", lead.id, err);
      }
    }
    
    res.json({ success: true, count: successCount, total: leads.length });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to perform bulk sync.", details: error.message });
  }
});

// Lead collection endpoint
app.post("/api/leads", async (req, res) => {
  try {
    const { name, location, phone, email, lookingFor, cart } = req.body;
    
    if (!name || !phone || !lookingFor) {
      res.status(400).json({ error: "Missing required fields (name, phone, lookingFor)." });
      return;
    }

    const newLead = {
      id: "lead_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      name,
      location: location || "Not provided",
      phone,
      email: email || "Not provided",
      lookingFor,
      cart: cart || null,
      createdAt: new Date().toISOString()
    };

    const fs = await import("fs/promises");
    const leadsFilePath = path.join(process.cwd(), "leads.json");
    
    let leads = [];
    try {
      const data = await fs.readFile(leadsFilePath, "utf8");
      leads = JSON.parse(data);
    } catch (e) {
      // File doesn't exist or is invalid JSON, start with empty list
    }

    leads.push(newLead);
    await fs.writeFile(leadsFilePath, JSON.stringify(leads, null, 2), "utf8");

    // Forward to Google Sheets Webhook (using user's Google Apps Script Web App URL)
    let googleSheetWebhookUrl = (process.env.GOOGLE_SHEETS_WEBHOOK_URL || "").trim();
    
    // Clean potential surrounding quotes
    if (googleSheetWebhookUrl.startsWith('"') && googleSheetWebhookUrl.endsWith('"')) {
      googleSheetWebhookUrl = googleSheetWebhookUrl.slice(1, -1);
    }
    if (googleSheetWebhookUrl.startsWith("'") && googleSheetWebhookUrl.endsWith("'")) {
      googleSheetWebhookUrl = googleSheetWebhookUrl.slice(1, -1);
    }

    const fallbackUrl = "https://script.google.com/macros/s/AKfycbyoHXWwF5zDu6T9hvYmCQk6nDEdBFAVRpyz0ioSM1f-GwHC3WP0SH1s4zjirGM3Cdy7wQ/exec";
    
    if (!googleSheetWebhookUrl || !googleSheetWebhookUrl.startsWith("http")) {
      googleSheetWebhookUrl = fallbackUrl;
    }

    if (googleSheetWebhookUrl) {
      try {
        console.log("Forwarding lead to Google Sheets webhook via URL:", googleSheetWebhookUrl);
        const webhookResponse = await fetch(googleSheetWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newLead),
        });
        if (webhookResponse.ok) {
          console.log("Successfully forwarded lead to Google Sheets!");
        } else {
          console.warn("Google Sheets webhook returned non-2xx status:", webhookResponse.status);
        }
      } catch (webhookErr) {
        console.error("Failed to forward lead to Google Sheets Webhook:", webhookErr);
      }
    }

    // Auto-append to Google Sheets if connected
    try {
      const configPath = path.join(process.cwd(), "sheets-config.json");
      let fileExists = false;
      try {
        await fs.access(configPath);
        fileExists = true;
      } catch (_) {
        // Safe to ignore, config does not exist
      }

      if (fileExists) {
        const configData = await fs.readFile(configPath, "utf8");
        const config = JSON.parse(configData);
        if (config.spreadsheetId && config.accessToken) {
          console.log("Automatically syncing new lead to connected Google Sheet...");
          await appendLeadToSheet(newLead, config);
          console.log("Lead synced to Google Sheets successfully!");
        }
      } else {
        console.log("Google Sheets auto-sync: Not configured via OAuth yet. (Safe skip)");
      }
    } catch (e) {
      console.log("Google Sheets auto-sync skipped or failed:", e);
    }

    console.log("New Lead Saved Successfully:", newLead);
    res.json({ success: true, lead: newLead });
  } catch (error: any) {
    console.error("Error saving lead:", error);
    res.status(500).json({ error: "Failed to submit lead.", details: error.message });
  }
});

// Interactive AI Consultant Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Invalid request: 'messages' array is required." });
      return;
    }

    const ai = getGeminiClient();

    // If Gemini key is not configured, return a friendly mock consultant message
    if (!ai) {
      const lastMsg = (messages[messages.length - 1]?.content || "").toLowerCase();
      let mockReply = "Hello! I am XcelBot, your WebXcel AI Consultant. I'd love to help you build your custom Business Website, CRM, or AI Chatbot! To unlock my fully dynamic consulting capabilities, please add a valid API key in the Secrets panel.";
      
      if (lastMsg.includes("website") || lastMsg.includes("pricing") || lastMsg.includes("starter") || lastMsg.includes("presence")) {
        mockReply = "Our ultra-premium Business Websites with custom 3D elements start at just ₹6,999 ($99), featuring modern responsive layouts, 100% hand-coded React/Tailwind (95+ PageSpeed score), and free domain setup support. Would you like a customized proposal?";
      } else if (lastMsg.includes("crm") || lastMsg.includes("lead") || lastMsg.includes("pipeline")) {
        mockReply = "Our Tailored CRM & Lead management solutions start at ₹14,999 ($185). They feature custom sales pipelines, visual history/forecast dashboards, role management, and real-time alerts. Shall we schedule a brief demo?";
      } else if (lastMsg.includes("agent") || lastMsg.includes("bot") || lastMsg.includes("chat")) {
        mockReply = "AI Agents & Chatbots are our absolute specialty! Starting at ₹14,999 ($185), we build intelligent agents trained on your business FAQs with bilingual support, WhatsApp Cloud API, and Telegram integrations. Would you like a custom chatbot demo?";
      } else if (lastMsg.includes("dialer") || lastMsg.includes("outreach") || lastMsg.includes("call")) {
        mockReply = "Our Call Dialer & Automated Outreach platform starts at ₹24,999 ($299). It integrates browser auto-dialing, voice broadcasting, Twilio gateways, and sequential email/SMS/WhatsApp campaigns. Shall we review a custom outreach flow?";
      } else if (lastMsg.includes("video") || lastMsg.includes("editing") || lastMsg.includes("reel") || lastMsg.includes("short")) {
        mockReply = "High-Impact Video Editing starts at ₹2,999 ($39) per edit. We craft professional vertical Reels/Shorts, corporate explainer videos, and social ads featuring custom grading, kinetic typography, and sound design. Do you have footage ready?";
      } else if (lastMsg.includes("app") || lastMsg.includes("mobile") || lastMsg.includes("software") || lastMsg.includes("native") || lastMsg.includes("flutter")) {
        mockReply = "Custom Software & Mobile App development starts at ₹34,999 ($429) using React Native or Flutter. We engineer cross-platform packages with cloud database sync (Postgres/Firestore), role control panels, and push alerts. What are your app features?";
      } else if (lastMsg.includes("bundle") || lastMsg.includes("clinic") || lastMsg.includes("real estate") || lastMsg.includes("school") || lastMsg.includes("restaurant") || lastMsg.includes("gym") || lastMsg.includes("law")) {
        mockReply = "We package specialized industry bundles starting at ₹14,999 to ₹29,999 ($185-$369). These combine custom website designs, intake CRM dashboards, calendars, and auto-reminders (e.g. Clinic, Real Estate, Gym, or School suites). Which industry are you in?";
      } else if (lastMsg.includes("fiverr") || lastMsg.includes("upwork") || lastMsg.includes("freelance") || lastMsg.includes("commission") || lastMsg.includes("markup") || lastMsg.includes("middleman") || lastMsg.includes("direct")) {
        mockReply = "By working directly with WEBXcel instead of freelance portals like Fiverr or Upwork, you save 20%+ in middleman commissions! We offer a 30-day post-launch revisions SLA, direct founder contact (WhatsApp/Calls with Ujjwal & Raj), and 100% hand-coded React platforms with full IP ownership handover. Shall we outline a direct proposal?";
      }
      
      res.json({ text: mockReply });
      return;
    }

    const systemInstruction = `You are 'XcelBot', the elite, ultra-efficient Virtual AI Consultant for WEBXcel, an premium software development, video editing, and AI automation agency.
Your goal is to consult businesses, explain why WEBXcel's hand-coded custom React/Tailwind sites beat WordPress templates, recommend services, and offer custom estimates.

WEBXcel Official Services & Data (Trained Context):
- Business Website Development: Starts at ₹5,999 to ₹6,999 ($75-$85). 100% hand-coded React & Tailwind (95+ Google PageSpeed score), stunning 3D animations, SEO-optimized, free hosting support.
- Tailored CRM Creation: Starts at ₹14,999 ($185). Custom sales pipelines, history/forecast dashboard, role management (Admins/Execs), lead databases, automated alerts.
- AI Agents & Chatbots: Starts at ₹14,999 ($185). Advanced virtual LLM agents, custom-trained FAQ knowledge bases, bilingual support, WhatsApp & Telegram Cloud API integration.
- Call Dialer & Automated Outreach: Starts at ₹24,999 ($315). Browser auto-dialer, voice broadcasting, sequential campaigns (WhatsApp/SMS/Email), Twilio gateway integration.
- High-Impact Video Editing: Starts at ₹2,999 ($38). Vertical Reels/Shorts, professional grading, transitions, kinetic subtitles.
- Software & Mobile App Development: Starts at ₹34,999 ($440). Cross-platform React Native or Flutter, offline sync databases (Firestore/PostgreSQL), push notifications.
- Pre-packaged Industry Bundles: Starts at ₹14,999 to ₹29,999 ($185-$369). Clinic & Doctor Pack, Real Estate Growth, Restaurant & Cafe, School & Academy, Gym & Fitness Studio, Law Firm & Attorney, Manufacturing & Supply packages.
- Direct Advantage vs Fiverr/Upwork: 0% platform markup fees (saving 20%+ in commission), 30 days of post-launch revision SLA support, 100% IP codebase ownership handover, and direct WhatsApp communication line to founders (Ujjwal & Raj).

CRITICAL DISCOVERY TERMS:
- *PRICES ARE NEGOTIABLE* - ALWAYS emphasize that all prices are negotiable and custom budget options can be customized for client comfort.
- Instantly syncs leads with our Google Sheets database so team members can contact them within 12 hours.

STRICT CONCISENESS & TOKEN-SAVING RULES:
- Keep answers extremely crisp, clear, and direct. Avoid repeating greetings or outputting generic conversational fluff.
- STICK TO A MAXIMUM of 1-2 short bullet points or sentences (Strictly keep output under 100 tokens).
- Always speak of clear business ROI, automated lead intake, and revenue growth.
- End with exactly ONE clear, action-oriented question to guide the user to a custom quote estimate or booking a WhatsApp call.`;

    // Map frontend messages format to Gemini contents
    // To minimize token consumption and remain cost-efficient, we keep only the last 6 messages as context
    const tokenOptimizedHistory = messages.slice(-6);

    const contents = tokenOptimizedHistory.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    // Ensure the conversation history starts with a 'user' message as strictly required by Gemini API
    while (contents.length > 0 && contents[0].role === "model") {
      contents.shift();
    }

    if (contents.length === 0) {
      res.status(400).json({ error: "Cannot send empty message history to AI." });
      return;
    }

    // Collapse consecutive messages of the same role to prevent "contents must alternate between user and model" API error
    const collapsedContents: { role: string; parts: { text: string }[] }[] = [];
    for (const item of contents) {
      if (collapsedContents.length > 0 && collapsedContents[collapsedContents.length - 1].role === item.role) {
        collapsedContents[collapsedContents.length - 1].parts[0].text += "\n\n" + item.parts[0].text;
      } else {
        collapsedContents.push({
          role: item.role,
          parts: [{ text: item.parts[0].text }]
        });
      }
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: collapsedContents,
      config: {
        systemInstruction,
        temperature: 0.6,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in AI Consultant Chat:", error);
    res.status(500).json({ error: "Failed to generate AI consultant response.", details: error.message });
  }
});

// ----------------- SEO & SEARCH ENGINES OPTIMIZATION -----------------

// Helper to serve index.html with dynamically injected SEO meta-tags & JSON-LD schema
async function serveIndexWithSEO(req: express.Request, res: express.Response, templatePath: string) {
  try {
    let html = await fs.readFile(templatePath, "utf8");
    const pathname = req.path;
    const host = req.get("host") || "webxcel.in";
    const protocol = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
    const baseUrl = `${protocol}://${host}`;

    // Default values (Home page)
    let title = "WEBXcel | Custom Website Development, Tailored CRM & High-Impact Video Editing";
    let description = "WEBXcel engineers high-performance, hand-coded business websites, tailored CRM dashboards, and professional video edits designed to unlock small enterprise potential. Zero templates, raw speed, maximum growth.";
    let keywords = "Website Development, CRM Development, Video Editing, Software Developer, Web Design Agency, custom software, business automation, React developer, Accenture developer, CRM database, video post-production, SEO optimization, high-speed website, custom leads management, fiverr alternative, upwork alternative, hire developers USA, software agency India";
    let schemaJson = "";

    if (pathname === "/services") {
      title = "Services | High-Performance Hand-Coded Web Systems | WEBXcel";
      description = "Explore our custom software engineering services starting at 6999 INR / 79 USD. We develop custom React sites, tailored CRM pipelines, conversational AI agents, and dynamic WhatsApp/outreach dialers.";
      schemaJson = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Custom Software Development",
        "provider": {
          "@type": "LocalBusiness",
          "name": "WEBXcel"
        },
        "areaServed": [
          { "@type": "Country", "name": "India" },
          { "@type": "Country", "name": "United States" }
        ],
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "USD",
          "lowPrice": "79",
          "offers": [
            {
              "@type": "Offer",
              "name": "Business Website Development",
              "price": "6999",
              "priceCurrency": "INR"
            },
            {
              "@type": "Offer",
              "name": "Tailored CRM Creation",
              "price": "14999",
              "priceCurrency": "INR"
            },
            {
              "@type": "Offer",
              "name": "AI Agents & Chatbots",
              "price": "14999",
              "priceCurrency": "INR"
            }
          ]
        }
      });
    } else if (pathname === "/fiverr-alternative") {
      title = "Fiverr Alternative: Elite Direct React Web Developers | WEBXcel";
      description = "Skip the Fiverr platform fees and middleman markups. Hire direct software engineers for custom React web design and database CRM development in the USA and India.";
      keywords += ", fiverr alternative, freelance developer alternative, upwork alternative, hire react developer direct";
      schemaJson = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Direct React Engineering vs Fiverr Freelance Marketplaces",
        "description": "A comprehensive comparison between hiring custom developers directly vs using generic freelance platforms like Fiverr and Upwork.",
        "publisher": {
          "@type": "Organization",
          "name": "WEBXcel",
          "url": "https://webxcel.in"
        }
      });
    } else if (pathname === "/portfolio") {
      title = "Our Portfolio | Production-Ready Projects | WEBXcel";
      description = "Browse real production implementations, tailored enterprise dashboard screens, and customer platforms crafted with speed and clean code by WEBXcel.";
    } else if (pathname === "/pricing") {
      title = "Pricing | Flat Rates, Zero Hidden Commissions | WEBXcel";
      description = "Fair, flat-rate pricing. Build your custom system starting at 6999 INR / 79 USD with complete IP ownership and zero platform markups.";
    } else if (pathname === "/about") {
      title = "About Us | Founding Story & Engineering Journey | WEBXcel";
      description = "Meet Ujjwal Tiwari & Raj Dubey, founders of WEBXcel. Discover our self-taught coding background and our mission to provide high-quality engineering directly.";
      schemaJson = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "mainEntity": [
          {
            "@type": "Person",
            "name": "Ujjwal Tiwari",
            "jobTitle": "Co-founder & Lead Engineer",
            "worksFor": {
              "@type": "Organization",
              "name": "WEBXcel"
            }
          },
          {
            "@type": "Person",
            "name": "Raj Dubey",
            "jobTitle": "Co-founder & Architect Engineer",
            "worksFor": {
              "@type": "Organization",
              "name": "WEBXcel"
            }
          }
        ]
      });
    } else if (pathname === "/estimator") {
      title = "Quote Estimator | Calculate Custom Project Scope | WEBXcel";
      description = "Use our instant cost estimator to build your spec online and secure direct developer pricing for React portals, CRM setups, and custom apps.";
    } else if (pathname === "/consultant") {
      title = "AI Consultant | Brainstorm Your Product Build | WEBXcel";
      description = "Talk directly with our conversational AI advisor to draft user flows, budget breakdowns, and technology suggestions for your custom project.";
    } else {
      // Home page JSON-LD
      schemaJson = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "WEBXcel",
        "url": "https://webxcel.in",
        "image": "https://webxcel.in/assets/webxcel_banner.png",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Bengaluru",
          "addressRegion": "Karnataka",
          "addressCountry": "IN"
        },
        "description": "High-performance website development, custom CRM systems, database automation, and professional video editing. Crafted by Ujjwal Tiwari & Raj Dubey.",
        "areaServed": ["IN", "US"]
      });
    }

    // Perform replacements
    // 1. Replace Title
    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
    
    // 2. Replace Description
    html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${description}" />`);
    
    // 3. Replace Keywords
    html = html.replace(/<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/i, `<meta name="keywords" content="${keywords}" />`);
    
    // 4. Replace Canonical Link
    html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${baseUrl}${pathname === '/' ? '' : pathname}" />`);
    
    // 5. Replace Open Graph Tags
    html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${title}" />`);
    html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${description}" />`);
    html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${baseUrl}${pathname === '/' ? '' : pathname}" />`);
    
    // 6. Replace Twitter Tags
    html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${title}" />`);
    html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${description}" />`);
    html = html.replace(/<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:url" content="${baseUrl}${pathname === '/' ? '' : pathname}" />`);

    // 7. Inject JSON-LD Schema (Replace first JSON-LD script block if it exists)
    if (schemaJson) {
      html = html.replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i, `<script type="application/ld+json">${schemaJson}</script>`);
    }

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (error) {
    console.error("SEO Metadata dynamic injection failed:", error);
    res.sendFile(templatePath);
  }
}

// Dynamic Sitemap generator mapping all client-side pages and hashes
app.get("/sitemap.xml", (req, res) => {
  const host = req.get("host") || "webxcel.in";
  const protocol = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;
  const currentDate = new Date().toISOString().split("T")[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Landing Home Page -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Services and Competence Areas -->
  <url>
    <loc>${baseUrl}/services</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <!-- Fiverr Comparison Page -->
  <url>
    <loc>${baseUrl}/fiverr-alternative</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <!-- Portfolio / Done Projects -->
  <url>
    <loc>${baseUrl}/portfolio</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Pricing Strategy Plans -->
  <url>
    <loc>${baseUrl}/pricing</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Dynamic Lead Quote Calculator -->
  <url>
    <loc>${baseUrl}/estimator</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <!-- About Founders Profile Journey -->
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(xml);
});

// Search Engine Bot Guidelines
app.get("/robots.txt", (req, res) => {
  const host = req.get("host") || "webxcel.in";
  const protocol = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;

  const txt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /sheets-config.json

Sitemap: ${baseUrl}/sitemap.xml`;

  res.header("Content-Type", "text/plain");
  res.send(txt);
});

// ----------------- VITE INTEGRATION -----------------

async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode with Vite Middleware
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Server running in DEVELOPMENT mode with Vite Middleware.");
  } else {
    // Production Mode with High-Speed Static File Serving & Browser Cache Optimization
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, {
      maxAge: "1d",
      setHeaders: (res, filepath) => {
        // Built assets under /assets/ are fingerprinted/hashed by Vite and can be safely cached for 1 year
        if (filepath.includes("/assets/") || filepath.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|otf)$/)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else if (filepath.endsWith("index.html") || filepath.endsWith("sitemap.xml") || filepath.endsWith("robots.txt")) {
          // Always revalidate entry files to pick up new versions immediately
          res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
        }
      }
    }));
    app.get("*", (req, res) => {
      res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      serveIndexWithSEO(req, res, path.join(distPath, "index.html"));
    });
    console.log("Server running in PRODUCTION mode with aggressive Cache-Control headers.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server is listening on http://localhost:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to start server:", err);
});
