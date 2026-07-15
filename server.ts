import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";
import cors from "cors";
import compression from "compression";

dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Enable high-speed Gzip compression for all text-based assets (JS, CSS, HTML, JSON)
app.use(compression());

app.use(cors({
  origin: (origin, callback) => {
    // Reflect origin back to support credentials & dynamic Vercel previews
    callback(null, true);
  },
  credentials: true
}));

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

async function saveAndForwardLead(leadData: {
  name: string;
  phone: string;
  email?: string;
  location?: string;
  lookingFor: string;
  cart?: any;
}) {
  const newLead = {
    id: "lead_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    name: leadData.name,
    location: leadData.location || "Not provided",
    phone: leadData.phone || "Not provided",
    email: leadData.email || "Not provided",
    lookingFor: leadData.lookingFor,
    cart: leadData.cart || null,
    createdAt: new Date().toISOString()
  };

  const fs = await import("fs/promises");
  const leadsFilePath = path.join(process.cwd(), "leads.json");
  
  let leads = [];
  try {
    const data = await fs.readFile(leadsFilePath, "utf8");
    leads = JSON.parse(data);
  } catch (e) {
    // start with empty
  }

  leads.push(newLead);
  await fs.writeFile(leadsFilePath, JSON.stringify(leads, null, 2), "utf8");

  // Forward to Google Sheets Webhook
  let googleSheetWebhookUrl = (process.env.GOOGLE_SHEETS_WEBHOOK_URL || "").trim();
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
        console.log("Successfully forwarded lead to Google Sheets webhook!");
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
    } catch (_) {}

    if (fileExists) {
      const configData = await fs.readFile(configPath, "utf8");
      const config = JSON.parse(configData);
      if (config.spreadsheetId && config.accessToken) {
        console.log("Automatically syncing new lead to connected Google Sheet...");
        await appendLeadToSheet(newLead, config);
        console.log("Lead synced to Google Sheets successfully!");
      }
    }
  } catch (e) {
    console.log("Google Sheets auto-sync failed:", e);
  }

  return newLead;
}

async function isDuplicateLead(phone: string, email: string) {
  if (!phone && !email) return true;
  try {
    const fs = await import("fs/promises");
    const leadsFilePath = path.join(process.cwd(), "leads.json");
    const data = await fs.readFile(leadsFilePath, "utf8");
    const leads = JSON.parse(data);
    
    // Check if any lead in the last 15 items has the same phone or email
    const recentLeads = leads.slice(-15);
    for (const lead of recentLeads) {
      if (phone && phone !== "Not provided" && lead.phone === phone) return true;
      if (email && email !== "Not provided" && lead.email === email) return true;
    }
  } catch (e) {
    // leads file does not exist
  }
  return false;
}

async function extractLeadFromConversation(messages: any[]) {
  const ai = getGeminiClient();
  if (!ai) return null;

  try {
    const transcript = messages.map(m => `${m.role === "assistant" ? "XcelBot" : "User"}: ${m.content}`).join("\n");
    
    const extractionPrompt = `Read the following chat transcript between XcelBot and a User.
Extract the user's contact lead details if they have provided them.
To be considered a complete lead, they MUST have provided:
1. A Name (or reasonable name like "John" or "Ujjwal")
2. A Contact Number (Phone/WhatsApp) OR an Email Address.

If both are present, extract them. If they only provided a phone and name, or email and name, extract whatever is available.
If they have NOT provided both a name and a contact method (phone/email), return exactly: {}

Otherwise, return a JSON object with the following fields:
{
  "name": "extracted name",
  "phone": "extracted phone or 'Not provided'",
  "email": "extracted email or 'Not provided'",
  "location": "extracted location/scope of project or 'Not provided'",
  "lookingFor": "short description of what services they are looking for based on context"
}

Respond ONLY with valid JSON. Do not include markdown code block syntax. Just the JSON object.

Transcript:
${transcript}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: extractionPrompt }] }],
      config: {
        temperature: 0.1,
        responseMimeType: "application/json"
      }
    });

    const text = response.text?.trim() || "{}";
    const parsed = JSON.parse(text);
    if (parsed && parsed.name && (parsed.phone !== "Not provided" || parsed.email !== "Not provided")) {
      return {
        name: parsed.name,
        phone: parsed.phone === "Not provided" ? "" : parsed.phone,
        email: parsed.email === "Not provided" ? "" : parsed.email,
        location: parsed.location === "Not provided" ? "" : parsed.location,
        lookingFor: parsed.lookingFor || "AI Consultant Lead"
      };
    }
  } catch (err) {
    console.warn("Failed to extract lead via Gemini structured analysis:", err);
  }
  return null;
}

function extractLeadViaRegex(messages: any[]) {
  let foundPhone = "";
  let foundEmail = "";
  let foundName = "";

  const phoneRegex = /(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/g;
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const nameIntroRegex = /(?:my name is|i am|this is|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i;

  for (const msg of messages) {
    if (msg.role === "user") {
      const text = msg.content;
      
      const phoneMatch = text.match(phoneRegex);
      if (phoneMatch && phoneMatch.length > 0) {
        foundPhone = phoneMatch[0];
      }

      const emailMatch = text.match(emailRegex);
      if (emailMatch && emailMatch.length > 0) {
        foundEmail = emailMatch[0];
      }

      const nameMatch = text.match(nameIntroRegex);
      if (nameMatch && nameMatch.length > 1) {
        foundName = nameMatch[1];
      }
    }
  }

  if ((foundPhone || foundEmail) && foundName) {
    return {
      name: foundName,
      phone: foundPhone || "Not provided",
      email: foundEmail || "Not provided",
      location: "Extracted via chat",
      lookingFor: "AI Consultant Consultation"
    };
  }
  return null;
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

    const lead = await saveAndForwardLead({ name, location, phone, email, lookingFor, cart });
    console.log("New Lead Saved Successfully:", lead);
    res.json({ success: true, lead });
  } catch (error: any) {
    console.error("Error saving lead:", error);
    res.status(500).json({ error: "Failed to submit lead.", details: error.message });
  }
});

// Diagnostic endpoint to list available models for the configured API key
app.get("/api/models", async (req, res) => {
  try {
    const rawKey = process.env.GEMINI_API_KEY || "";
    const keyInfo = rawKey 
      ? {
          exists: true,
          length: rawKey.length,
          masked: `${rawKey.substring(0, 8)}...${rawKey.substring(rawKey.length - 8)}`
        }
      : { exists: false };

    const ai = getGeminiClient();
    if (!ai) {
      res.json({ error: "Gemini client not initialized. GEMINI_API_KEY might be missing.", keyInfo });
      return;
    }
    const response = await ai.models.list();
    res.json({ keyInfo, models: response });
  } catch (error: any) {
    console.error("Error listing models:", error);
    const rawKey = process.env.GEMINI_API_KEY || "";
    const keyInfo = rawKey 
      ? {
          exists: true,
          length: rawKey.length,
          masked: `${rawKey.substring(0, 8)}...${rawKey.substring(rawKey.length - 8)}`
        }
      : { exists: false };
    res.status(500).json({ error: "Failed to list models.", details: error.message, keyInfo });
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
      const lastMsg = (messages[messages.length - 1]?.content || "").toLowerCase().trim();
      let mockReply = "";

      if (
        lastMsg === "hi" || lastMsg === "hello" || lastMsg === "hey" || lastMsg === "greetings" || 
        lastMsg.includes("anyone there") || lastMsg.includes("who is this")
      ) {
        mockReply = "Hello! I am XcelBot, your dedicated WEBXcel AI Advisor. 🚀\n\nI can help you brainstorm custom software architectures, estimate development timelines, or design high-converting automation workflows for your business.\n\nAre you looking to build a high-performance Website, a custom CRM database, an AI Chatbot, or an Automated Outreach system today?";
      } else if (
        lastMsg.includes("founder") || lastMsg.includes("who built") || lastMsg.includes("creator") || 
        lastMsg.includes("ujjwal") || lastMsg.includes("raj") || lastMsg.includes("team") || 
        lastMsg.includes("about") || lastMsg.includes("who are you") || lastMsg.includes("company")
      ) {
        mockReply = "WEBXcel was co-founded by two passionate systems engineers: Ujjwal Tiwari and Raj Dubey. 💻\n\n• Ujjwal Tiwari (Founder & Lead Engineer) is a Software Developer at Accenture, with a background supporting enterprise Microsoft systems and building ad monetization platforms.\n• Raj Dubey (CEO & Architect Engineer) is a seasoned technologist dedicated to scalable system design, secure data integrations, and long-term business growth.\n\nOur mission is to bring elite-grade, hand-coded software (React, Node, Express, Firebase) to growing businesses in India and the US at flat-rate pricing, without bloated corporate premiums. Would you like to consult directly with Ujjwal or Raj on WhatsApp?";
      } else if (
        lastMsg.includes("pricing") || lastMsg.includes("price") || lastMsg.includes("cost") || 
        lastMsg.includes("how much") || lastMsg.includes("rate") || lastMsg.includes("budget") || 
        lastMsg.includes("fee") || lastMsg.includes("plan") || lastMsg.includes("discount") || 
        lastMsg.includes("negotiable")
      ) {
        mockReply = "At WEBXcel, we believe in complete pricing transparency with flat-rate quotes and absolutely zero hidden middleman commissions! 💎\n\nHere are our standard packages (all budgets are fully negotiable to suit your comfort):\n\n1️⃣ Starter Web Presence — ₹6,999 ($99)\n• Single-Page fully responsive design (100% custom React/Vite, no WP bloat)\n• Integrated interactive customer lead form with instant alerts\n• Google Maps setup, custom 3D animations, and free secure domain setup support\n\n2️⃣ Business Growth Pack — ₹14,999 ($185)\n• Up to 5 Pages custom layouts, multiple conversion landing pages\n• Bespoke lightweight Lead Tracking CRM Board with automated client profile panels\n• 14 Days delivery, plus 30 Days of dedicated post-launch SLA revision support\n\n3️⃣ Elite AI & CRM Suite — ₹39,999 ($495)\n• Bespoke multi-page business system + high-end custom CRM tailored to your sales workflows\n• On-site Gemini-powered AI support chatbot & Auto-dialer cold outreach campaign tool\n• WhatsApp Cloud API & Twilio sequences, 2 promotional explainer video edits, 90 Days SLA priority support\n\nWhich tier fits your business goals best? Remember, we can fully customize features and pricing to map directly to your budget!";
      } else if (
        lastMsg.includes("website") || lastMsg.includes("web") || lastMsg.includes("site") || 
        lastMsg.includes("landing") || lastMsg.includes("page") || lastMsg.includes("react") || 
        lastMsg.includes("wordpress") || lastMsg.includes("speed") || lastMsg.includes("lighthouse")
      ) {
        mockReply = "Our premium websites are 100% hand-coded using React, Vite, and Tailwind CSS. ⚡\n\nUnlike slow, generic WordPress themes that drag down your search rankings, our sites:\n• Achieve 95+ PageSpeed scores for immediate load times\n• Are completely immune to common WordPress plugin hacks and security exploits\n• Include custom 3D interactive animations & fluid transitions\n• Sync custom lead intakes instantly to Google Sheets within 12 hours\n\nOur Starter Web Presence is only ₹6,999 ($99), and our multi-page Business Growth Pack with an integrated CRM is ₹14,999 ($185). Shall we outline a layout proposal for your brand?";
      } else if (
        lastMsg.includes("crm") || lastMsg.includes("lead") || lastMsg.includes("pipeline") || 
        lastMsg.includes("tracking") || lastMsg.includes("customer") || lastMsg.includes("sheets") || 
        lastMsg.includes("database")
      ) {
        mockReply = "Custom CRM dashboards are a WEBXcel specialty! We build sales-boards tailored precisely to how your business handles customer inquiries. 📊\n\nOur custom CRM tools start at ₹14,999 ($185) and feature:\n• Interactive deal pipelines (drag-and-drop sales funnels)\n• Automated team history and lead forecast dashboards\n• Multi-user role management (Admins vs. Sales Executives)\n• Instant automatic backup synchronizations to Google Sheets\n• Direct automated notifications via Email and WhatsApp when a new lead enters\n\nThis keeps your follow-up times under 12 hours and prevents deals from falling through the cracks. Would you like a live CRM walk-through?";
      } else if (
        lastMsg.includes("agent") || lastMsg.includes("bot") || lastMsg.includes("chat") || 
        lastMsg.includes("voice") || lastMsg.includes("receptionist") || lastMsg.includes("phone") || 
        lastMsg.includes("whatsapp") || lastMsg.includes("telegram")
      ) {
        mockReply = "We develop and integrate advanced, customized AI Agents trained directly on your business data! 🤖\n\n• On-site Web Chatbots — Trained on your exact business FAQ directory to answer customer questions 24/7, qualify leads, and direct hot prospects straight to your sales team.\n• AI Phone Receptionists — Intelligent voice assistants that answer incoming calls, manage live appointment bookings, and handle general inquiries in multiple languages.\n• Messaging Automations — Native integrations with WhatsApp Cloud API and Telegram to automate outbound customer alerts, order confirmations, and marketing broadcasts.\n\nOur custom AI Agents start at ₹14,999 ($185). Would you like to see how we train these bots using raw business files?";
      } else if (
        lastMsg.includes("dialer") || lastMsg.includes("outreach") || lastMsg.includes("cold") || 
        lastMsg.includes("call") || lastMsg.includes("sms") || lastMsg.includes("broadcast") || 
        lastMsg.includes("twilio")
      ) {
        mockReply = "Boost your lead generation with our custom Call Dialer & Automated Outreach platforms! 📞\n\nStarting at ₹24,999 ($315), we build custom interfaces that integrate:\n• Twilio voice gateways and browser-based single-click outbound dialing\n• Pre-recorded interactive voice broadcasting and voicemail drops\n• Sequential, automated campaign workflows spanning WhatsApp, SMS, and Email\n• Real-time call logs, duration tracking, and disposition tagging\n\nThis system allows a single sales rep to handle 4x more outreach daily! Would you like to review an outreach sequence diagram?";
      } else if (
        lastMsg.includes("video") || lastMsg.includes("edit") || lastMsg.includes("reel") || 
        lastMsg.includes("short") || lastMsg.includes("clip") || lastMsg.includes("grading") || 
        lastMsg.includes("caption") || lastMsg.includes("typography")
      ) {
        mockReply = "Our high-impact Video Editing service starts at just ₹2,999 ($38) per video. 🎬\n\nWe edit engaging vertical Reels/Shorts, professional social media ads, and corporate explainer videos. Our process includes:\n• Advanced color grading, sound design, and custom transitions\n• Kinetic typography and engaging animated subtitles to retain viewer attention\n• Hook-focused editing styles proven to increase CTR and viral potential\n\nOur co-founder Raj Dubey personally oversees post-production to ensure premium brand-aligned visual assets. Do you have raw footage ready for editing?";
      } else if (
        lastMsg.includes("app") || lastMsg.includes("mobile") || lastMsg.includes("android") || 
        lastMsg.includes("ios") || lastMsg.includes("flutter") || lastMsg.includes("native") || 
        lastMsg.includes("software")
      ) {
        mockReply = "We develop robust, scalable cross-platform Mobile Apps using React Native or Flutter. 📱\n\nStarting at ₹34,999 ($440), our custom app builds feature:\n• Fluid, responsive user interfaces matching native iOS and Android design guidelines\n• Local-first offline database synchronization (via Firestore, SQLite, or PostgreSQL)\n• Real-time cloud database storage, cloud functions, and secure user authentication\n• Targeted push alerts and native device permissions (camera, location, gallery)\n\nWhat kind of mobile application or custom database utility are you brainstorming?";
      } else if (
        lastMsg.includes("fiverr") || lastMsg.includes("upwork") || lastMsg.includes("freelance") || 
        lastMsg.includes("commission") || lastMsg.includes("middleman") || lastMsg.includes("direct") || 
        lastMsg.includes("alternative")
      ) {
        mockReply = "Skip the middleman and work directly with elite engineers! Here is why WEBXcel beats Fiverr and Upwork freelancers hands down: 🏆\n\n• Zero Platform Markups — Freelance websites levy up to 20% in hidden platform commission fees on both client and developer. We pass those savings directly back to you!\n• 30-Day Revisions SLA — Fiverr automatically closes and archives your order just 3 days after delivery, leaving you stranded if bugs arise. We protect your investment with a 30-day post-launch support and content update window.\n• Seamless Founder Communication — Avoid frustrating timezone gaps and broken language translation barriers. You collaborate directly with Ujjwal and Raj on WhatsApp and Zoom.\n• 100% Code Ownership — We provide a clean GitHub repository and transfer full intellectual property rights so you own your code assets forever.\n\nShall we skip the middleman markups and schedule a brief direct call?";
      } else if (
        lastMsg.includes("guarantee") || lastMsg.includes("support") || lastMsg.includes("revision") || 
        lastMsg.includes("security") || lastMsg.includes("backup") || lastMsg.includes("maintenance") || 
        lastMsg.includes("sla")
      ) {
        mockReply = "Your software investment is fully protected by our comprehensive engineering guarantees: 🛡️\n\n• 30-Day SLA Support — Enjoy peace of mind with 30 days of free bug patching, performance optimization, and content modifications after deployment.\n• Code Asset Ownership — Unlike agencies that keep you dependent on proprietary platforms, we deliver full source code ownership with no monthly lockup licensing fees.\n• Server & Security Audits — All apps include secure HTTPS/SSL setups, daily automated database backup scripts, and cross-site scripting guards.\n\nWe provide the enterprise-level support of Accenture software engineers (which our founder Ujjwal Tiwari is!) but with the speed and flexibility of a dedicated boutique agency. Do you have any specific security questions?";
      } else if (
        lastMsg.includes("bundle") || lastMsg.includes("pack") || lastMsg.includes("clinic") || 
        lastMsg.includes("real estate") || lastMsg.includes("restaurant") || lastMsg.includes("school") || 
        lastMsg.includes("gym") || lastMsg.includes("fitness") || lastMsg.includes("law") || 
        lastMsg.includes("attorney") || lastMsg.includes("industrial")
      ) {
        mockReply = "We offer tailored, pre-packaged industry suites starting at ₹14,999 to ₹29,999 ($185-$369). These packages integrate our core services into highly efficient, industry-specific workflows: 💼\n\n• Clinic & Doctor Pack: Professional medical website, online calendar bookings scheduler, and automated appointment reminders on WhatsApp.\n• Real Estate Growth Suite: Modern property listing catalog, intake sales board CRM, and lead capture pipelines.\n• Restaurant & Cafe Suite: Tableside self-ordering web apps, POS dashboard, and contactless QR code menus.\n• School & Academy ERP: Student databases, attendance monitors, billing registers, and administrative logs.\n• Gym & Fitness Studio Pack: Membership tracking cards, schedule boards, and automatic subscription alerts.\n\nWhich industry sector is your business in, and how can we streamline your operations today?";
      } else {
        mockReply = "Hello! I am XcelBot, your WebXcel AI Consultant. I'd love to help you build your custom Business Website, CRM, or AI Chatbot! 🚀\n\nTo give you a precise proposal, could you share a bit more about:\n1️⃣ What is your primary business or industry?\n2️⃣ Which specific automation or feature would bring the most value to your team?\n3️⃣ Do you have a target launch timeline or custom budget in mind?\n\n(Remember, all our prices are 100% negotiable, and you get direct contact with our founders Ujjwal & Raj!)";
      }

      // Extract lead from conversation in the background (non-blocking)
      setTimeout(async () => {
        try {
          const extractedLead = extractLeadViaRegex(messages);
          if (extractedLead) {
            const { name, phone, email, location, lookingFor } = extractedLead;
            const isDup = await isDuplicateLead(phone, email);
            if (!isDup) {
              console.log("XcelBot collected new lead dynamically from mock chat, saving...");
              await saveAndForwardLead({
                name,
                phone: phone || "Not provided",
                email: email || "Not provided",
                location: location || "Collected via XcelBot Mock Chat",
                lookingFor: lookingFor || "AI Consultant Mock Lead"
              });
              console.log("XcelBot dynamic mock lead saved and synced!");
            }
          }
        } catch (e) {
          console.error("Background mock lead extraction failed:", e);
        }
      }, 0);

      res.json({ text: mockReply });
      return;
    }

    const systemInstruction = `You are 'XcelBot', the elite, ultra-efficient Virtual AI Consultant for WEBXcel, a premium software development, video editing, and AI automation agency.
Your goal is to consult businesses, explain why WEBXcel's hand-coded custom React/Tailwind sites beat WordPress templates, recommend our services, and offer custom estimates.

CO-FOUNDERS & TEAM PROFILE:
- Ujjwal Tiwari: Founder & Lead Engineer. Software Developer at Accenture, with a background supporting enterprise Microsoft systems and building high-traffic ad monetization platforms. Expert in custom high-speed frontend and secure backend architecture.
- Raj Dubey: Co-founder, CEO, & Architect Engineer. Scalable digital experiences developer focused on custom innovation, secure integrations, and long-term business performance.

WEBXcel OFFICIAL PLANS & PRICING (Trained Context):
1. Starter Web Presence — ₹6,999 ($99)
   - Single-Page fully responsive design (100% custom React/Vite, no WP bloat/plugins, loads in < 1s)
   - Integrated interactive customer lead form with direct email/WhatsApp alerts
   - Google Maps placement, custom 3D animations, free secure domain setup support, 7 days delivery timeline.
2. Business Growth Pack — ₹14,999 ($185)
   - Up to 5 Pages custom layouts, multiple conversion landing pages
   - Bespoke lightweight Lead Tracking CRM Board with automated client profile panels
   - 14 Days rapid delivery, plus 30 Days of dedicated post-launch SLA revision support.
3. Elite AI & CRM Suite — ₹39,999 ($495)
   - Bespoke multi-page business system + high-end custom CRM tailored to sales workflows
   - On-site Gemini-powered AI support chatbot & Auto-dialer cold outreach campaign tool
   - WhatsApp Cloud API & Twilio sequences, 2 corporate explainer video edits, 90 Days SLA priority support.

CUSTOM SERVICES CATALOG:
- Website Development: Hand-coded React + Vite + Tailwind CSS (95+ Google PageSpeed score, zero WP security exploits).
- Custom CRM Boards: Drag-and-drop sales funnels, role-based controls (Admins vs. Sales Executives), instant automatic backups to Google Sheets.
- AI Agents & Chatbots: Trained on custom business FAQ, AI voice phone receptionists (manage bookings, 24/7 call answering), WhatsApp/Telegram API integrations.
- Call Dialer & Automated Outreach: Twilio gateways, browser-based click-to-dial, voice broadcasting, sequential SMS/WhatsApp/Email campaign loops.
- High-Impact Video Editing: Vertical Reels/Shorts, corporate explainers, color grading, kinetic typography, hook-focused editing. Starts at ₹2,999 ($38) per edit.
- Cross-Platform Mobile Apps: React Native or Flutter, local-first offline sync (Firestore/Postgres), push alerts. Starts at ₹34,999 ($440).

THE DIRECT ADVANTAGE vs FREELANCE PORTALS (Fiverr / Upwork):
- Save 20%+ in Middleman Fees: We charge raw engineering fees with 0% platform markups.
- 30-Day Revisions Guarantee: Fiverr auto-closes and archives orders after 3 days. We guarantee 30 days of active post-launch SLA support, modifications, and bug patching.
- Direct Founder Access: Avoid communication gaps. Clients collaborate directly with founders Ujjwal & Raj on WhatsApp and Zoom.
- 100% Code Asset Ownership: We hand over the entire clean GitHub repository with full IP rights.

PRE-PACKAGED INDUSTRY BUNDLES (₹14,999 - ₹29,999 / $185 - $369):
- Clinic & Doctor Pack: Medical web portal + scheduling calendar + WhatsApp automated alerts.
- Real Estate Growth Pack: Listing catalog + sales CRM board + client profiles directory.
- Restaurant & Cafe Pack: Tableside ordering web app + QR menus + cashier POS dashboard.
- School & Academy Suite: ERP records + student directories + parent app sync + fee collections.
- Gym & Fitness Studio Pack: Membership tracker + scheduling boards + automated alerts.

CRITICAL DISCOVERY TERMS:
- *PRICES ARE NEGOTIABLE*: Emphasize that all packages are negotiable and we can fully customize features and pricing to map directly to the client's budget.
- Automatic Sync: All client lead intakes sync instantly with our secure Google Sheets database so team members follow up within 12 hours.

STRICT CONCISENESS & CONVERSATIONAL RULES:
- Keep answers extremely crisp, helpful, and highly direct.
- Never output dry code or generic conversational fluff.
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

    let response;
    let lastError: any = null;
    const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];

    for (const modelName of modelsToTry) {
      let attempts = 0;
      while (attempts < 2) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: collapsedContents,
            config: {
              systemInstruction,
              temperature: 0.6,
            }
          });
          break; // Succeeded! Break out of the retry loop
        } catch (err: any) {
          lastError = err;
          attempts++;
          // If it's a 503, 429, or general unavailable error, wait and retry
          const isTransient = err.status === 503 || err.status === 429 || 
                            (err.message && (err.message.includes("503") || err.message.includes("UNAVAILABLE") || err.message.includes("high demand")));
          if (isTransient) {
            console.warn(`Gemini API returned transient error for ${modelName} (attempt ${attempts}): ${err.message}. Retrying in 1s...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            // For non-transient errors (like invalid key, invalid arg), throw immediately to the caller
            throw err;
          }
        }
      }
      if (response) {
        break; // Got a response, don't try the fallback model
      }
    }

    if (!response) {
      throw lastError || new Error("Failed to generate response after trying multiple models.");
    }

    // Extract lead from conversation in the background (non-blocking)
    setTimeout(async () => {
      try {
        const extractedLead = await extractLeadFromConversation(messages);
        if (extractedLead) {
          const { name, phone, email, location, lookingFor } = extractedLead;
          const isDup = await isDuplicateLead(phone, email);
          if (!isDup) {
            console.log("XcelBot collected new lead dynamically from Gemini chat, saving...");
            await saveAndForwardLead({
              name,
              phone: phone || "Not provided",
              email: email || "Not provided",
              location: location || "Collected via XcelBot Gemini Chat",
              lookingFor: lookingFor || "AI Consultant Gemini Lead"
            });
            console.log("XcelBot dynamic Gemini lead saved and synced!");
          }
        }
      } catch (e) {
        console.error("Background Gemini lead extraction failed:", e);
      }
    }, 0);

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
    const host = req.get("host") || "webxcel.co.in";
    const protocol = host.includes("webxcel.co.in") || req.protocol === "https" || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
    const baseUrl = `${protocol}://${host}`;
    const pageUrl = `${baseUrl}${pathname === "/" ? "" : pathname}`;
    const imageUrl = `${baseUrl}/logo.webp`;

    // Default values (Home page)
    let title = "WEBXcel | Custom Websites, CRM, AI Agents & Business Automation";
    let description = "WEBXcel builds hand-coded React websites, custom CRM dashboards, AI chatbots, booking systems, outreach automation, mobile apps, and high-impact video edits for growing businesses in India, the USA, and worldwide.";
    let keywords = "custom website development India, React website agency, CRM development company, AI chatbot development, AI phone receptionist, business automation services, appointment booking system, WhatsApp automation, lead management CRM, custom software development, mobile app development, video editing agency, real estate website developer, clinic website development, restaurant POS software, school ERP development, Fiverr alternative developer, direct web developer";
    let schemaJson = "";

    if (pathname === "/services") {
      title = "Website, CRM, AI Agent & Automation Services | WEBXcel";
      description = "Explore WEBXcel services: React business websites, tailored CRM systems, AI chatbots, AI phone receptionists, appointment booking, WhatsApp outreach, e-commerce, mobile apps, industry software, and video editing.";
      keywords += ", website development services, custom CRM services, AI agent services, booking engine development, auto dialer software, e-commerce website development, clinic management software, real estate CRM, restaurant ordering system, law firm website, gym membership software";
      schemaJson = JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Custom Website, CRM, AI Agent and Automation Services",
          "serviceType": "Custom Software Development",
          "url": pageUrl,
          "provider": {
            "@type": "ProfessionalService",
            "name": "WEBXcel",
            "url": baseUrl,
            "logo": imageUrl
          },
          "areaServed": [
            { "@type": "Country", "name": "India" },
            { "@type": "Country", "name": "United States" }
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "WEBXcel Service Catalog",
            "itemListElement": [
              { "@type": "Offer", "name": "Business Website Development", "price": "6999", "priceCurrency": "INR" },
              { "@type": "Offer", "name": "Tailored CRM Creation", "price": "14999", "priceCurrency": "INR" },
              { "@type": "Offer", "name": "AI Agents and Chatbots", "price": "14999", "priceCurrency": "INR" },
              { "@type": "Offer", "name": "Call Dialer and Automated Outreach", "price": "24999", "priceCurrency": "INR" },
              { "@type": "Offer", "name": "High-Impact Video Editing", "price": "2999", "priceCurrency": "INR" },
              { "@type": "Offer", "name": "Software and Mobile App Development", "price": "34999", "priceCurrency": "INR" }
            ]
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What services does WEBXcel offer?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "WEBXcel offers hand-coded business websites, custom CRM dashboards, AI chatbots, AI phone receptionists, booking systems, WhatsApp and email automation, auto-dialer workflows, mobile apps, e-commerce integrations, industry software bundles, and video editing."
              }
            },
            {
              "@type": "Question",
              "name": "Does WEBXcel build custom software without templates?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. WEBXcel builds custom React, Vite, and Tailwind systems with source-code ownership instead of locking clients into slow website builders or generic templates."
              }
            }
          ]
        }
      ]);
    } else if (pathname === "/services/ai-agents-chatbots" || pathname === "/services/ai-agents") {
      title = "Custom AI Agents & Intelligent Chatbots Development | WEBXcel";
      description = "Supercharge your business efficiency and customer support. WEBXcel builds custom AI chatbots, dynamic voice receptionists, and lead qualification flows that run 24/7.";
      keywords += ", AI chatbot development, custom AI agents, automated voice receptionists, WhatsApp AI bots, lead qualification AI, custom LLM solutions, business automation";
      schemaJson = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Custom AI Agents & Intelligent Chatbots Development",
        "serviceType": "AI Automation and Agentic Systems",
        "url": pageUrl,
        "provider": {
          "@type": "ProfessionalService",
          "name": "WEBXcel",
          "url": baseUrl,
          "logo": imageUrl
        },
        "description": "Bespoke artificial intelligence solutions, virtual customer service chatbots, conversational agents, and automated pipeline integration tailored to small and medium enterprises."
      });
    } else if (pathname === "/services/web-development") {
      title = "High-Speed Custom React & Tailwind Web Development | WEBXcel";
      description = "Get a lightning-fast, premium hand-coded website with zero platform lock-in. WEBXcel designs and engineers fully optimized React portals and custom business websites.";
      keywords += ", custom website development, React website agency India, hand-coded business websites, fast loading sites, Tailwind CSS web design, high converting landing pages";
      schemaJson = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "High-Speed Custom React & Tailwind Web Development",
        "serviceType": "Web Development Services",
        "url": pageUrl,
        "provider": {
          "@type": "ProfessionalService",
          "name": "WEBXcel",
          "url": baseUrl,
          "logo": imageUrl
        },
        "description": "High-performance business websites built with hand-coded React, Vite, and Tailwind CSS. Clean, fully responsive interfaces with zero platform fees or page builder delays."
      });
    } else if (pathname === "/services/crm") {
      title = "Tailored CRM & Sales Pipeline Dashboard Development | WEBXcel";
      description = "Stop fighting Excel spreadsheets. Get a customized, secure CRM database panel built specifically for your sales workflows and lead pipeline tracking.";
      keywords += ", custom CRM development, sales pipeline dashboard, client tracking database, lead management CRM, custom sales board, business workflow automation";
      schemaJson = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Tailored CRM & Sales Pipeline Dashboard Development",
        "serviceType": "Customer Relationship Management Systems",
        "url": pageUrl,
        "provider": {
          "@type": "ProfessionalService",
          "name": "WEBXcel",
          "url": baseUrl,
          "logo": imageUrl
        },
        "description": "Custom customer relationship management dashboards, pipeline trackers, user logs, and automated notification setups built direct to your team requirements."
      });
    } else if (pathname === "/services/software-development") {
      title = "Bespoke Custom Software & Enterprise ERP Development | WEBXcel";
      description = "Automate manual operations with powerful, lightweight custom software. WEBXcel engineers custom ERP systems, HR portals, payroll engines, and inventory management suites.";
      keywords += ", custom software development company, bespoke ERP systems, school ERP Gurugram, clinic management software, inventory management database, restaurant POS software";
      schemaJson = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Bespoke Custom Software & Enterprise ERP Development",
        "serviceType": "Bespoke Software Engineering",
        "url": pageUrl,
        "provider": {
          "@type": "ProfessionalService",
          "name": "WEBXcel",
          "url": baseUrl,
          "logo": imageUrl
        },
        "description": "Bespoke application systems, secure inventory checkers, school ERP software, clinic directories, and customized workflow automation panels."
      });
    } else if (pathname === "/services/mobile-app-development") {
      title = "Cross-Platform iOS & Android Mobile App Development | WEBXcel";
      description = "Turn your product concept into a premium, responsive cross-platform mobile app. WEBXcel builds fast, native-quality iOS and Android applications using React Native and Flutter.";
      keywords += ", mobile app development India, React Native app agency, custom Android iOS apps, hybrid mobile development, cross platform app builders";
      schemaJson = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Cross-Platform iOS & Android Mobile App Development",
        "serviceType": "Mobile Application Engineering",
        "url": pageUrl,
        "provider": {
          "@type": "ProfessionalService",
          "name": "WEBXcel",
          "url": baseUrl,
          "logo": imageUrl
        },
        "description": "High-fidelity, responsive hybrid mobile apps designed and launched on Google Play Store and Apple App Store, featuring smooth offline support and real-time database integrations."
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
          "url": "https://webxcel.co.in"
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
    } else if (pathname === "/blog") {
      title = "WEBXcel Blog | Insights on AI, Custom CRM & Web Development";
      description = "Read WEBXcel's latest articles and deep-dive comparisons on web speeds, custom database CRMs, Gemini AI agents, and direct software ROI.";
      schemaJson = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "WEBXcel Insights & Blog",
        "description": "Read WEBXcel's latest articles and deep-dive comparisons on web speeds, custom database CRMs, Gemini AI agents, and direct software ROI.",
        "publisher": {
          "@type": "Organization",
          "name": "WEBXcel",
          "url": "https://webxcel.co.in"
        }
      });
    } else if (pathname.startsWith("/blog/")) {
      const slug = pathname.substring(6);
      const blogTitles: { [key: string]: string } = {
        "how-ai-agents-save-time": "How AI Agents Can Save Businesses 100 Hours Every Month | WEBXcel",
        "crm-vs-excel-growing-businesses": "CRM vs Excel: Which Should Growing Businesses Use? | WEBXcel",
        "best-ai-chatbots-small-business": "Best AI Chatbots for Small Businesses (Self-Hosted vs SaaS) | WEBXcel",
        "website-development-cost-india-2026": "Website Development Cost in India (2026): WordPress vs React | WEBXcel",
        "top-10-ai-automation-tools": "Top 10 AI Automation Tools for Business Growth in 2026 | WEBXcel",
      };
      const blogDescs: { [key: string]: string } = {
        "how-ai-agents-save-time": "Discover how custom AI agents can automate repetitive workflows, customer service, and lead triage to save your business over 100 hours every single month.",
        "crm-vs-excel-growing-businesses": "Comparing CRM systems vs Excel spreadsheets for business growth. Learn about data security, lead automation, limits of sheets, and client pipelines.",
        "best-ai-chatbots-small-business": "Reviewing the best AI chatbots for small businesses in 2026. Explore custom self-hosted LLM setups vs subscription-based bot builders.",
        "website-development-cost-india-2026": "A comprehensive breakdown of website development cost in India for 2026. Contrast cheap template agencies vs premium hand-coded systems.",
        "top-10-ai-automation-tools": "An expert curation of the top 10 AI automation tools for business operations in 2026, featuring integrations, CRM databases, and outreach.",
      };
      const blogAuthors: { [key: string]: string } = {
        "how-ai-agents-save-time": "Ujjwal Tiwari",
        "crm-vs-excel-growing-businesses": "Raj Dubey",
        "best-ai-chatbots-small-business": "Ujjwal Tiwari",
        "website-development-cost-india-2026": "Ujjwal Tiwari",
        "top-10-ai-automation-tools": "Raj Dubey",
      };
      const blogDates: { [key: string]: string } = {
        "how-ai-agents-save-time": "2026-07-12T00:00:00Z",
        "crm-vs-excel-growing-businesses": "2026-07-08T00:00:00Z",
        "best-ai-chatbots-small-business": "2026-06-28T00:00:00Z",
        "website-development-cost-india-2026": "2026-05-15T00:00:00Z",
        "top-10-ai-automation-tools": "2026-04-20T00:00:00Z",
      };

      if (blogTitles[slug]) {
        title = blogTitles[slug];
        description = blogDescs[slug];
        schemaJson = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": blogTitles[slug],
          "description": blogDescs[slug],
          "datePublished": blogDates[slug],
          "author": {
            "@type": "Person",
            "name": blogAuthors[slug]
          },
          "publisher": {
            "@type": "Organization",
            "name": "WEBXcel",
            "logo": {
              "@type": "ImageObject",
              "url": imageUrl
            }
          },
          "mainEntityOfPage": pageUrl
        });
      } else {
        title = "WEBXcel Blog | Insights on AI, Custom CRM & Web Development";
        description = "Read WEBXcel's latest articles and deep-dive comparisons on web speeds, custom database CRMs, Gemini AI agents, and direct software ROI.";
      }
    } else {
      // Home page JSON-LD
      schemaJson = JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "WEBXcel",
          "url": baseUrl,
          "image": imageUrl,
          "logo": imageUrl,
          "telephone": "+919102702317",
          "email": "rajdubeyyyy0.44@gmail.com",
          "priceRange": "$$",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Gurugram",
            "addressRegion": "Haryana",
            "addressCountry": "IN"
          },
          "description": "High-performance website development, custom CRM systems, AI agents, booking engines, outreach automation, mobile apps, and professional video editing. Crafted by Ujjwal Tiwari and Raj Dubey.",
          "areaServed": [
            { "@type": "Country", "name": "India" },
            { "@type": "Country", "name": "United States" }
          ],
          "knowsAbout": [
            "React website development",
            "custom CRM development",
            "AI chatbot development",
            "AI phone receptionist systems",
            "appointment booking software",
            "WhatsApp automation",
            "mobile app development",
            "video editing"
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "WEBXcel",
          "url": baseUrl,
          "potentialAction": {
            "@type": "ContactAction",
            "target": `${baseUrl}/estimator`
          }
        }
      ]);
    }

    // Perform replacements
    // 1. Replace Title
    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
    
    // 2. Replace Description
    html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${description}" />`);
    
    // 3. Replace Keywords
    html = html.replace(/<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/i, `<meta name="keywords" content="${keywords}" />`);
    
    // 4. Replace Canonical Link
    html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${pageUrl}" />`);
    
    // 5. Replace Open Graph Tags
    html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${title}" />`);
    html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${description}" />`);
    html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${pageUrl}" />`);
    html = html.replace(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${imageUrl}" />`);
    
    // 6. Replace Twitter Tags
    html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${title}" />`);
    html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${description}" />`);
    html = html.replace(/<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:url" content="${pageUrl}" />`);
    html = html.replace(/<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:image" content="${imageUrl}" />`);

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
  const host = req.get("host") || "webxcel.co.in";
  const protocol = host.includes("webxcel.co.in") || req.protocol === "https" || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
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
  <!-- Service Sub-Pages (High SEO Rank targets) -->
  <url>
    <loc>${baseUrl}/services/ai-agents-chatbots</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>${baseUrl}/services/web-development</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>${baseUrl}/services/crm</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>${baseUrl}/services/software-development</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>${baseUrl}/services/mobile-app-development</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
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
  <!-- AI Consultant Quote Assistant -->
  <url>
    <loc>${baseUrl}/consultant</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <!-- About Founders Profile Journey -->
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Blog Listing Page -->
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <!-- Blog Posts -->
  <url>
    <loc>${baseUrl}/blog/how-ai-agents-save-time</loc>
    <lastmod>2026-07-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog/crm-vs-excel-growing-businesses</loc>
    <lastmod>2026-07-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog/best-ai-chatbots-small-business</loc>
    <lastmod>2026-06-28</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog/website-development-cost-india-2026</loc>
    <lastmod>2026-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog/top-10-ai-automation-tools</loc>
    <lastmod>2026-04-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;


  res.header("Content-Type", "application/xml");
  res.send(xml);
});

// Search Engine Bot Guidelines
app.get("/robots.txt", (req, res) => {
  const host = req.get("host") || "webxcel.co.in";
  const protocol = host.includes("webxcel.co.in") || req.protocol === "https" || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
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
