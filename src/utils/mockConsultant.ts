import { Message } from "../types";

export function getMockConsultantResponse(userMessage: string, history: Message[] = []): string {
  const msg = userMessage.toLowerCase().trim();

  // 1. Greetings
  if (
    msg === "hi" || 
    msg === "hello" || 
    msg === "hey" || 
    msg === "greetings" || 
    msg.includes("anyone there") || 
    msg.includes("who is this")
  ) {
    return "Hello! I am XcelBot, your dedicated WEBXcel AI Advisor. 🚀\n\nI can help you brainstorm custom software architectures, estimate development timelines, or design high-converting automation workflows for your business.\n\nAre you looking to build a high-performance Website, a custom CRM database, an AI Chatbot, or an Automated Outreach system today?";
  }

  // 2. Founders / Team
  if (
    msg.includes("founder") || 
    msg.includes("who built") || 
    msg.includes("creator") || 
    msg.includes("ujjwal") || 
    msg.includes("raj") || 
    msg.includes("team") || 
    msg.includes("about") || 
    msg.includes("who are you") ||
    msg.includes("company")
  ) {
    return "WEBXcel was co-founded by two passionate systems engineers: Ujjwal Tiwari and Raj Dubey. 💻\n\n• Ujjwal Tiwari (Founder & Lead Engineer) is a Software Developer at Accenture, with a background supporting enterprise Microsoft systems and building high-traffic ad monetization platforms.\n• Raj Dubey (CEO & Architect Engineer) is a seasoned technologist dedicated to scalable system design, secure data integrations, and long-term business growth.\n\nOur mission is to bring elite-grade, hand-coded software (React, Node, Express, Firebase) to growing businesses in India and the US at flat-rate pricing, without bloated corporate premiums. Would you like to consult directly with Ujjwal or Raj on WhatsApp?";
  }

  // 3. Pricing / Cost / Plans
  if (
    msg.includes("pricing") || 
    msg.includes("price") || 
    msg.includes("cost") || 
    msg.includes("how much") || 
    msg.includes("rate") || 
    msg.includes("budget") || 
    msg.includes("fee") || 
    msg.includes("plan") || 
    msg.includes("discount") || 
    msg.includes("negotiable")
  ) {
    return "At WEBXcel, we believe in complete pricing transparency with flat-rate quotes and absolutely zero hidden middleman commissions! 💎\n\nHere are our standard packages (all budgets are fully negotiable to suit your comfort):\n\n1️⃣ Starter Web Presence — ₹6,999 ($99)\n• Single-Page fully responsive design (100% custom React/Vite, no WP bloat)\n• Integrated interactive customer lead form with instant alerts\n• Google Maps setup, custom 3D animations, and free secure domain setup support\n\n2️⃣ Business Growth Pack — ₹14,999 ($185)\n• Up to 5 Pages custom layouts, multiple conversion landing pages\n• Bespoke lightweight Lead Tracking CRM Board with automated client profile panels\n• 14 Days delivery, plus 30 Days of dedicated post-launch SLA revision support\n\n3️⃣ Elite AI & CRM Suite — ₹39,999 ($495)\n• Bespoke multi-page business system + high-end custom CRM tailored to your sales workflows\n• On-site Gemini-powered AI support chatbot & Auto-dialer cold outreach campaign tool\n• WhatsApp Cloud API & Twilio sequences, 2 promotional explainer video edits, 90 Days SLA priority support\n\nWhich tier fits your business goals best? Remember, we can fully customize features and pricing to map directly to your budget!";
  }

  // 4. Website / Web Development
  if (
    msg.includes("website") || 
    msg.includes("web") || 
    msg.includes("site") || 
    msg.includes("landing") || 
    msg.includes("page") || 
    msg.includes("react") || 
    msg.includes("wordpress") || 
    msg.includes("speed") || 
    msg.includes("lighthouse")
  ) {
    return "Our premium websites are 100% hand-coded using React, Vite, and Tailwind CSS. ⚡\n\nUnlike slow, generic WordPress themes that drag down your search rankings, our sites:\n• Achieve 95+ PageSpeed scores for immediate load times\n• Are completely immune to common WordPress plugin hacks and security exploits\n• Include custom 3D interactive animations & fluid transitions\n• Sync custom lead intakes instantly to Google Sheets within 12 hours\n\nOur Starter Web Presence is only ₹6,999 ($99), and our multi-page Business Growth Pack with an integrated CRM is ₹14,999 ($185). Shall we outline a layout proposal for your brand?";
  }

  // 5. CRM / Leads / Google Sheets
  if (
    msg.includes("crm") || 
    msg.includes("lead") || 
    msg.includes("pipeline") || 
    msg.includes("tracking") || 
    msg.includes("customer") || 
    msg.includes("sheets") || 
    msg.includes("database")
  ) {
    return "Custom CRM dashboards are a WEBXcel specialty! We build sales-boards tailored precisely to how your business handles customer inquiries. 📊\n\nOur custom CRM tools start at ₹14,999 ($185) and feature:\n• Interactive deal pipelines (drag-and-drop sales funnels)\n• Automated team history and lead forecast dashboards\n• Multi-user role management (Admins vs. Sales Executives)\n• Instant automatic backup synchronizations to Google Sheets\n• Direct automated notifications via Email and WhatsApp when a new lead enters\n\nThis keeps your follow-up times under 12 hours and prevents deals from falling through the cracks. Would you like a live CRM walk-through?";
  }

  // 6. AI Agents / Chatbot / Voice / Receptionist / Phone
  if (
    msg.includes("agent") || 
    msg.includes("bot") || 
    msg.includes("chat") || 
    msg.includes("voice") || 
    msg.includes("receptionist") || 
    msg.includes("phone") || 
    msg.includes("whatsapp") || 
    msg.includes("telegram")
  ) {
    return "We develop and integrate advanced, customized AI Agents trained directly on your business data! 🤖\n\n• On-site Web Chatbots — Trained on your exact business FAQ directory to answer customer questions 24/7, qualify leads, and direct hot prospects straight to your sales team.\n• AI Phone Receptionists — Intelligent voice assistants that answer incoming calls, manage live appointment bookings, and handle general inquiries in multiple languages.\n• Messaging Automations — Native integrations with WhatsApp Cloud API and Telegram to automate outbound customer alerts, order confirmations, and marketing broadcasts.\n\nOur custom AI Agents start at ₹14,999 ($185). Would you like to see how we train these bots using raw business files?";
  }

  // 7. Outreach / Dialer / Call / Twilio
  if (
    msg.includes("dialer") || 
    msg.includes("outreach") || 
    msg.includes("cold") || 
    msg.includes("call") || 
    msg.includes("sms") || 
    msg.includes("broadcast") || 
    msg.includes("twilio")
  ) {
    return "Boost your lead generation with our custom Call Dialer & Automated Outreach platforms! 📞\n\nStarting at ₹24,999 ($315), we build custom interfaces that integrate:\n• Twilio voice gateways and browser-based single-click outbound dialing\n• Pre-recorded interactive voice broadcasting and voicemail drops\n• Sequential, automated campaign workflows spanning WhatsApp, SMS, and Email\n• Real-time call logs, duration tracking, and disposition tagging\n\nThis system allows a single sales rep to handle 4x more outreach daily! Would you like to review an outreach sequence diagram?";
  }

  // 8. Video / Edit / Reel / Shorts
  if (
    msg.includes("video") || 
    msg.includes("edit") || 
    msg.includes("reel") || 
    msg.includes("short") || 
    msg.includes("clip") || 
    msg.includes("grading") || 
    msg.includes("caption") || 
    msg.includes("typography")
  ) {
    return "Our high-impact Video Editing service starts at just ₹2,999 ($38) per video. 🎬\n\nWe edit engaging vertical Reels/Shorts, professional social media ads, and corporate explainer videos. Our process includes:\n• Advanced color grading, sound design, and custom transitions\n• Kinetic typography and engaging animated subtitles to retain viewer attention\n• Hook-focused editing styles proven to increase CTR and viral potential\n\nOur co-founder Raj Dubey personally oversees post-production to ensure premium brand-aligned visual assets. Do you have raw footage ready for editing?";
  }

  // 9. Mobile App / Cross Platform / Flutter
  if (
    msg.includes("app") || 
    msg.includes("mobile") || 
    msg.includes("android") || 
    msg.includes("ios") || 
    msg.includes("flutter") || 
    msg.includes("native") || 
    msg.includes("software")
  ) {
    return "We develop robust, scalable cross-platform Mobile Apps using React Native or Flutter. 📱\n\nStarting at ₹34,999 ($440), our custom app builds feature:\n• Fluid, responsive user interfaces matching native iOS and Android design guidelines\n• Local-first offline database synchronization (via Firestore, SQLite, or PostgreSQL)\n• Real-time cloud database storage, cloud functions, and secure user authentication\n• Targeted push alerts and native device permissions (camera, location, gallery)\n\nWhat kind of mobile application or custom database utility are you brainstorming?";
  }

  // 10. Fiverr / Upwork vs WEBXcel
  if (
    msg.includes("fiverr") || 
    msg.includes("upwork") || 
    msg.includes("freelance") || 
    msg.includes("commission") || 
    msg.includes("middleman") || 
    msg.includes("direct") || 
    msg.includes("alternative")
  ) {
    return "Skip the middleman and work directly with elite engineers! Here is why WEBXcel beats Fiverr and Upwork freelancers hands down: 🏆\n\n• Zero Platform Markups — Freelance websites levy up to 20% in hidden platform commission fees on both client and developer. We pass those savings directly back to you!\n• 30-Day Revisions SLA — Fiverr automatically closes and archives your order just 3 days after delivery, leaving you stranded if bugs arise. We protect your investment with a 30-day post-launch support and content update window.\n• Seamless Founder Communication — Avoid frustrating timezone gaps and broken language translation barriers. You collaborate directly with Ujjwal and Raj on WhatsApp and Zoom.\n• 100% Code Ownership — We provide a clean GitHub repository and transfer full intellectual property rights so you own your code assets forever.\n\nShall we skip the middleman markups and schedule a brief direct call?";
  }

  // 11. Guarantee / Support / SLA
  if (
    msg.includes("guarantee") || 
    msg.includes("support") || 
    msg.includes("revision") || 
    msg.includes("security") || 
    msg.includes("backup") || 
    msg.includes("maintenance") || 
    msg.includes("sla")
  ) {
    return "Your software investment is fully protected by our comprehensive engineering guarantees: 🛡️\n\n• 30-Day SLA Support — Enjoy peace of mind with 30 days of free bug patching, performance optimization, and content modifications after deployment.\n• Code Asset Ownership — Unlike agencies that keep you dependent on proprietary platforms, we deliver full source code ownership with no monthly lockup licensing fees.\n• Server & Security Audits — All apps include secure HTTPS/SSL setups, daily automated database backup scripts, and cross-site scripting guards.\n\nWe provide the enterprise-level support of Accenture software engineers (which our founder Ujjwal Tiwari is!) but with the speed and flexibility of a dedicated boutique agency. Do you have any specific security questions?";
  }

  // 12. Bundles / Clinics / Real Estate / Industry Packs
  if (
    msg.includes("bundle") || 
    msg.includes("pack") || 
    msg.includes("clinic") || 
    msg.includes("real estate") || 
    msg.includes("restaurant") || 
    msg.includes("school") || 
    msg.includes("gym") || 
    msg.includes("fitness") || 
    msg.includes("law") || 
    msg.includes("attorney") || 
    msg.includes("industrial")
  ) {
    return "We offer tailored, pre-packaged industry suites starting at ₹14,999 to ₹29,999 ($185-$369). These packages integrate our core services into highly efficient, industry-specific workflows: 💼\n\n• Clinic & Doctor Pack: Professional medical website, online calendar bookings scheduler, and automated appointment reminders on WhatsApp.\n• Real Estate Growth Suite: Modern property listing catalog, intake sales board CRM, and lead capture pipelines.\n• Restaurant & Cafe Suite: Tableside self-ordering web apps, POS dashboard, and contactless QR code menus.\n• School & Academy ERP: Student databases, attendance monitors, billing registers, and administrative logs.\n• Gym & Fitness Studio Pack: Membership tracking cards, schedule boards, and automatic subscription alerts.\n\nWhich industry sector is your business in, and how can we streamline your operations today?";
  }

  // 13. Smart Fallback Response (Tries to match keywords, if none, synthesizes a helpful general consultation)
  return "I hear you! That sounds like an excellent operational project. 🚀\n\nAt WEBXcel, we are experts in hand-coding high-speed, scalable web applications (React & Tailwind CSS), custom CRM databases, AI agents/chatbots, Twilio-integrated outbound systems, and professional video editing.\n\nTo give you a precise proposal, could you share a bit more about:\n1️⃣ What is your primary business or industry?\n2️⃣ Which specific automation or feature would bring the most value to your team?\n3️⃣ Do you have a target launch timeline or custom budget in mind?\n\n(Remember, all our prices are 100% negotiable, and you get direct contact with our founders Ujjwal & Raj!)";
}
