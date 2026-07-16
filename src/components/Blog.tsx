import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  ChevronRight, 
  ArrowUpRight, 
  Bot, 
  TrendingUp, 
  Database, 
  DollarSign, 
  Cpu, 
  BookOpen, 
  Layers, 
  PhoneCall,
  Search,
  MessageSquare
} from "lucide-react";
import { Currency, formatCurrencyValue } from "../utils/currency";

export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  content: React.ReactNode;
  date: string;
  readTime: string;
  author: string;
  tags: string[];
  category: "automation" | "crm" | "ai" | "web" | "tech";
  seoDescription: string;
}

interface BlogProps {
  currency: Currency;
  onPageChange: (pageId: string) => void;
}

export default function Blog({ currency, onPageChange }: BlogProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const blogPosts: BlogPost[] = [
    {
      slug: "how-ai-agents-save-time",
      title: "How AI Agents Can Save Businesses 100 Hours Every Month",
      date: "July 12, 2026",
      readTime: "6 min read",
      author: "Ujjwal Tiwari",
      tags: ["AI Agents", "Automation", "Efficiency"],
      category: "automation",
      seoDescription: "Discover how custom AI agents can automate repetitive workflows, customer service, and lead triage to save your business over 100 hours every single month.",
      summary: "Routine operations are the silent killer of business momentum. In this detailed analysis, we break down exactly how modern LLM-driven AI agents automate manual workflows, client follow-ups, and lead qualifying to reclaim 100+ productive hours.",
      content: (
        <div className="space-y-6 text-slate-800 leading-relaxed font-medium">
          <p>
            For small and medium enterprises, time isn't just money—it is the direct constraint on growth. Yet, founders and key team members spend a staggering percentage of their days on repetitive tasks: copying client info, triaging emails, qualifying cold leads, and sending follow-up text messages.
          </p>
          <p>
            With the advent of advanced LLM architectures (like Gemini 2.0 and GPT-4o), <strong>AI Agents</strong> are transitioning from simple chat widgets to autonomous workspace operators. An AI Agent doesn’t just answer questions; it connects to your database, makes API decisions, triggers actions, and executes complex processes.
          </p>

          <div className="bg-blue-50 border-2 border-black p-5 rounded-2xl my-6">
            <h4 className="font-display font-black text-lg text-slate-900 mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#3B82F6]" /> The 100-Hour Monthly Time-Drain Breakdown
            </h4>
            <p className="text-xs text-zinc-600 mb-4">
              Here is how a typical 5-to-15 person service business leaks hours, and how a custom agent reclaims them:
            </p>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                <span>1. Customer Support & FAQ Triage</span>
                <span className="font-bold text-[#3B82F6]">30 Hours / Month</span>
              </div>
              <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                <span>2. Multi-Channel Lead Qualifying (WhatsApp/Web)</span>
                <span className="font-bold text-[#3B82F6]">25 Hours / Month</span>
              </div>
              <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                <span>3. Manual CRM Syncing & Pipeline Updates</span>
                <span className="font-bold text-[#3B82F6]">20 Hours / Month</span>
              </div>
              <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                <span>4. Outbound Appointment Scheduling & Follow-Ups</span>
                <span className="font-bold text-[#3B82F6]">25 Hours / Month</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-black text-slate-950">
                <span>TOTAL LEAKED TIME ELIMINATED</span>
                <span className="bg-yellow-300 border border-black px-1.5 rounded">100 Hours Saved</span>
              </div>
            </div>
          </div>

          <h3 className="font-display font-black text-xl text-slate-950 mt-8">1. Automated Lead Qualification (Instant Pipeline Intake)</h3>
          <p>
            When a lead submits a query on a weekend, their intent decays rapidly. In fact, responding within 5 minutes versus 30 minutes increases conversion rates by up to 391%. A custom AI conversational agent acts as an instant-response gateway, prompting leads on WhatsApp or Web for their budget, timeline, and exact scope. The agent immediately determines if the lead meets your criteria, updates your CRM, and alerts your sales team.
          </p>

          <h3 className="font-display font-black text-xl text-slate-950 mt-6">2. Zero-Click CRM Syncing</h3>
          <p>
            Every time a salesperson finishes a call, they are supposed to write summary notes and update contact statuses. In reality, this is rarely done consistently. By linking a custom AI agent to call recording tools (or web contact forms), the agent automatically listens, summarizes key action items, tags sentiment, and updates the contact database directly. No copy-paste, no forgotten follow-ups.
          </p>

          <h3 className="font-display font-black text-xl text-slate-950 mt-6">3. Handling the 80% FAQ Repetition</h3>
          <p>
            \"What are your prices?\", \"Do you support custom integrations?\", \"Can I see your previous work?\"—your team answers these exact questions dozens of times daily. AI agents utilize Retrieval-Augmented Generation (RAG) to instantly search your internal wiki, previous estimates, and onboarding PDFs to reply accurately, maintaining your brand's voice.
          </p>

          <div className="bg-yellow-50 border-4 border-black p-6 rounded-3xl shadow-brutal-sm my-8 text-left">
            <span className="font-mono text-[10px] uppercase font-black text-[#3B82F6] block mb-1">Key Takeaway</span>
            <p className="text-sm font-bold text-slate-900">
              Businesses don't need larger teams; they need smarter leverage. By outsourcing repetitive conversational and data-entry logistics to custom AI agents, small teams can punch above their weight, responding instantly to clients and focusing 100% of their energy on execution and delivery.
            </p>
          </div>
        </div>
      )
    },
    {
      slug: "crm-vs-excel-growing-businesses",
      title: "CRM vs Excel: Which Should Growing Businesses Use?",
      date: "July 08, 2026",
      readTime: "5 min read",
      author: "Raj Dubey",
      tags: ["CRM", "Excel", "Data Systems"],
      category: "crm",
      seoDescription: "Comparing CRM systems vs Excel spreadsheets for business growth. Learn about data security, lead automation, limits of sheets, and client pipelines.",
      summary: "Spreadsheets are the gateway drug of business tracking. But as you hire, scale, and capture more leads, those color-coded cells turn into operational chaos. We contrast spreadsheets with custom database CRMs.",
      content: (
        <div className="space-y-6 text-slate-800 leading-relaxed font-medium">
          <p>
            It is a story played out in almost every startup: you launch with a simple Excel sheet or Google Sheet to log client names, phone numbers, and notes. It's free, intuitive, and highly flexible. But as your team grows to 3, 5, or 10 people, what was once a handy ledger quickly devolves into a liability.
          </p>
          <p>
            Let's dissect why Excel is the wrong home for a growing business's client data, and how a tailored CRM keeps your pipeline from leaking.
          </p>

          <h3 className="font-display font-black text-xl text-slate-950 mt-8">The Hard Limits of Spreadsheets</h3>
          <ul className="list-disc pl-5 space-y-2.5">
            <li>
              <strong>Lack of Concurrency Control:</strong> When multiple team members are editing a sheet simultaneously, changes overwrite each other, data gets deleted, and formula errors creep in unnoticed.
            </li>
            <li>
              <strong>No Client Interaction Logs:</strong> Sheets cannot easily tell you *who* emailed a client, *what* was discussed on the last WhatsApp call, or *when* the next follow-up is scheduled. You lose all client history context.
            </li>
            <li>
              <strong>Zero Automation:</strong> When a lead status changes from \"Negotiating\" to \"Deal Won\" in Excel, it won't automatically trigger a welcome email, draft a contract PDF, or notify the developer to start building. In a CRM, this is done with a single click.
            </li>
            <li>
              <strong>Security & Permission Issues:</strong> Excel is all-or-nothing. You cannot hide specific columns (like commission rates or supplier prices) from junior team members while giving them access to names and phone numbers.
            </li>
          </ul>

          <div className="bg-red-50 border-2 border-black p-5 rounded-2xl my-6">
            <h4 className="font-display font-black text-lg text-slate-900 mb-2 flex items-center gap-2">
              <Database className="w-5 h-5 text-red-500" /> Quick Comparison Table
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="pb-2 font-black">Feature</th>
                    <th className="pb-2 font-black text-red-600">Excel / Google Sheets</th>
                    <th className="pb-2 font-black text-emerald-600">Custom Database CRM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  <tr>
                    <td className="py-2.5 font-bold">Data Security</td>
                    <td className="py-2.5 text-zinc-500">Low (Easily downloaded/deleted)</td>
                    <td className="py-2.5 text-slate-900 font-bold">High (Role-based access controls)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Workflow Automations</td>
                    <td className="py-2.5 text-zinc-500">None (Manual scripts required)</td>
                    <td className="py-2.5 text-slate-900 font-bold">Native (Auto-alerts, WhatsApp sync)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Concurrency</td>
                    <td className="py-2.5 text-zinc-500">Laggy / Prone to conflicts</td>
                    <td className="py-2.5 text-slate-900 font-bold">Instant (Multi-user optimized)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Analytics</td>
                    <td className="py-2.5 text-zinc-500">Manual charts / Easy to break</td>
                    <td className="py-2.5 text-slate-900 font-bold">Real-time Pipeline dashboards</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h3 className="font-display font-black text-xl text-slate-950 mt-6">Why Big Off-the-Shelf CRMs Fall Short</h3>
          <p>
            If sheets are too limited, why not just sign up for Salesforce or HubSpot?
            For growing small businesses, these tools present a different challenge: **extreme complexity and bloat**. Salesforce requires expensive implementation consultants, and HubSpot’s pricing aggressively escalates from $20/month to $800/month as you add features and contacts.
          </p>
          <p>
            <strong>The Solution:</strong> A custom-designed CRM pipeline built on high-performance frameworks. At WEBXcel Tech Solutions, we create bespoke CRM panels starting at a one-time fee of just {formatCurrencyValue(14999, currency)}. You own 100% of the codebase, pay 0 monthly user license fees, and only have the exact fields, buttons, and notifications your business actually uses.
          </p>

          <div className="bg-yellow-50 border-4 border-black p-6 rounded-3xl shadow-brutal-sm my-8 text-left">
            <span className="font-mono text-[10px] uppercase font-black text-[#3B82F6] block mb-1">Recommendation</span>
            <p className="text-sm font-bold text-slate-900">
              If your database has exceeded 100 client records or your team consists of 3+ people handling outbound sales, you must migrate to a database CRM. Keeping client data in sheets is an invitation for missed follow-ups, lost client context, and leaky sales conversions.
            </p>
          </div>
        </div>
      )
    },
    {
      slug: "best-ai-chatbots-small-business",
      title: "Best AI Chatbots for Small Businesses (Self-Hosted vs SaaS)",
      date: "June 28, 2026",
      readTime: "5 min read",
      author: "Ujjwal Tiwari",
      tags: ["AI Chatbots", "Small Business", "RAG"],
      category: "ai",
      seoDescription: "Reviewing the best AI chatbots for small businesses in 2026. Explore custom self-hosted LLM setups vs subscription-based bot builders.",
      summary: "AI Chatbots are everywhere, but not all bots are created equal. We compare the best chatbot architectures for small businesses, breaking down self-hosted native models versus monthly SaaS subscriptions.",
      content: (
        <div className="space-y-6 text-slate-800 leading-relaxed font-medium">
          <p>
            Customer expectations have fundamentally changed. Today, if a customer visits a service website, they expect to ask a question and get a precise, immediate answer—whether it's 2:00 PM or 2:00 AM.
          </p>
          <p>
            However, most businesses are stuck between two extremes: old rule-based chatbots that fail to understand simple synonyms, and expensive SaaS chatbots that drain their budget with high recurring monthly fees. Let's look at the landscape and evaluate the best options.
          </p>

          <h3 className="font-display font-black text-xl text-slate-950 mt-8">1. Custom RAG (Retrieval-Augmented Generation) Chatbots (Best Overall)</h3>
          <p>
            Instead of paying a SaaS platform to hold your FAQ data, custom RAG chatbots load your business docs, price sheets, and operational guidelines directly. When a user asks a question, the backend retrieves the exact relevant paragraph and prompts a model (like Gemini 2.0 Flash) to compile a natural, context-aware response.
          </p>
          <p>
            <strong>Cost:</strong> Pay-as-you-go API consumption. Gemini's API charges fractions of a cent per prompt, meaning you can handle thousands of customer chats for less than $2 a month in direct resource costs.
          </p>

          <h3 className="font-display font-black text-xl text-slate-950 mt-6">2. SaaS Chatbot Platforms (ManyChat, Chatbase, Voiceflow)</h3>
          <p>
            These platforms are quick to configure and offer nice drag-and-drop flow builders. They are excellent for marketing teams that need to spin up temporary flows.
          </p>
          <p>
            <strong>The Catch:</strong> High subscription overhead. Once you cross a few hundred chat sessions, prices jump to $99 - $299 every month. Additionally, you are locked into their platform; you cannot export the code or run it locally if they change their pricing.
          </p>

          <div className="bg-emerald-50 border-2 border-black p-5 rounded-2xl my-6">
            <h4 className="font-display font-black text-lg text-slate-900 mb-2 flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-600" /> SaaS Chatbot vs. Hand-Coded WEBXcel Tech Solutions Bot
            </h4>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                <span>Monthly Platform Subscription</span>
                <span className="text-red-600 font-bold">$49 - $299/mo</span>
                <span className="text-emerald-600 font-bold">$0/mo (API direct)</span>
              </div>
              <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                <span>Data Ownership & Control</span>
                <span className="text-red-600 font-bold">Hosted on third-party servers</span>
                <span className="text-emerald-600 font-bold">100% Owned by You</span>
              </div>
              <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                <span>Integration Complexity</span>
                <span className="text-red-600 font-bold">Limited to native plugins</span>
                <span className="text-emerald-600 font-bold">Unlimited system/CRM API hooks</span>
              </div>
            </div>
          </div>

          <h3 className="font-display font-black text-xl text-slate-950 mt-6">How to Choose the Right Chatbot</h3>
          <p>
            If you only receive 5 inquiries a week, a basic WhatsApp business account with automated quick-replies is all you need.
          </p>
          <p>
            But if you are running paid ads, handling booking requests, or qualifying leads, you should run a custom chatbot. At WEBXcel Tech Solutions, we deploy tailored Gemini AI agents directly into your React client or WhatsApp Cloud API. We handle the data ingestion, fine-tuning, and system prompts, then deliver a completed asset with zero recurring platform markups.
          </p>

          <div className="bg-yellow-50 border-4 border-black p-6 rounded-3xl shadow-brutal-sm my-8 text-left">
            <span className="font-mono text-[10px] uppercase font-black text-[#3B82F6] block mb-1">Pro Tip</span>
            <p className="text-sm font-bold text-slate-900">
              When launching an AI chatbot, always include an \"escalate to human\" fallback. If the agent detects high frustration or is asked a question outside its knowledge base, it should immediately alert a human team member via WhatsApp or SMS.
            </p>
          </div>
        </div>
      )
    },
    {
      slug: "website-development-cost-india-2026",
      title: "Website Development Cost in India (2026): WordPress vs Hand-Coded React",
      date: "May 15, 2026",
      readTime: "7 min read",
      author: "Ujjwal Tiwari",
      tags: ["Web Dev Cost", "React", "WordPress"],
      category: "web",
      seoDescription: "A comprehensive breakdown of website development cost in India for 2026. Contrast cheap template agencies vs premium hand-coded systems.",
      summary: "What should you actually pay for a business website in India? We bust the myths surrounding cheap agency packages, detailing the hidden costs of WordPress, and explaining why custom React sites offer superior long-term ROI.",
      content: (
        <div className="space-y-6 text-slate-800 leading-relaxed font-medium">
          <p>
            If you search for \"website development cost in India,\" you will find estimates ranging from ₹3,000 all the way to ₹5,00,000. For a business owner, this massive disparity is incredibly confusing. Why does one developer quote a few thousand rupees while an elite agency quotes ten times that?
          </p>
          <p>
            The difference lies entirely in **architecture, speed, and long-term costs**. Let's peel back the layers to understand what you are paying for.
          </p>

          <h3 className="font-display font-black text-xl text-slate-950 mt-8">The ₹5,000 WordPress Trap</h3>
          <p>
            Many agencies in India offer ultra-cheap websites built on WordPress. They buy a pre-made template, install element builders (like Elementor or Divi), drag-and-drop your text, and hand it over. It sounds like a great deal, but here is what happens next:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Terrible Performance (Lighthouse &lt; 50):</strong> Bloated builders load hundreds of CSS and JS scripts that the page doesn't use. Slow loading times cause visitors to leave and hurt your Google SEO rankings.
            </li>
            <li>
              <strong>Security Vulnerabilities:</strong> WordPress is the most targeted CMS in the world. Outdated plugins, theme vulnerabilities, and database exploits leave your site open to malware and hacking.
            </li>
            <li>
              <strong>Hidden Subscription Fees:</strong> The cheap developer won't mention that you need to pay for premium element builder keys, security plugins, form builders, and backup services year after year.
            </li>
          </ul>

          <div className="bg-yellow-100 border-2 border-black p-5 rounded-2xl my-6">
            <h4 className="font-display font-black text-lg text-slate-900 mb-2 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-800" /> Cost Breakdown in India (2026 Estimates)
            </h4>
            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="pb-2 font-black">Metric</th>
                    <th className="pb-2 font-black text-red-600">Cheap WordPress Site</th>
                    <th className="pb-2 font-black text-emerald-600">WEBXcel Tech Solutions React / Static Site</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  <tr>
                    <td className="py-2.5 font-bold">Initial Setup Cost</td>
                    <td className="py-2.5">₹4,000 - ₹12,000</td>
                    <td className="py-2.5">₹6,999 - ₹19,999</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Annual Hosting Fees</td>
                    <td className="py-2.5">₹3,000 - ₹8,000/yr</td>
                    <td className="py-2.5 text-emerald-600 font-bold">₹0 - ₹1,000/yr (Static free tiers)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Page Speed Score</td>
                    <td className="py-2.5 text-red-600">30 - 55 (Bloated)</td>
                    <td className="py-2.5 text-emerald-600 font-bold">95 - 100 (Hand-coded)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Lifespan & Maintenance</td>
                    <td className="py-2.5">Requires monthly updates</td>
                    <td className="py-2.5">Maintenance-free (No database dependencies)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h3 className="font-display font-black text-xl text-slate-950 mt-6">Why Hand-Coded React Beats WordPress</h3>
          <p>
            At WEBXcel Tech Solutions, we don't use templates. We hand-code our web platforms in React, using styling frameworks like Tailwind CSS.
          </p>
          <p>
            Because the pages compile directly to static HTML and JS, they load instantly (under 0.5 seconds). They can be hosted for free on global Edge networks (like Netlify, Vercel, or Firebase), saving you thousands in annual hosting. There is no WordPress database to hack, and you own 100% of the code assets forever.
          </p>

          <div className="bg-yellow-50 border-4 border-black p-6 rounded-3xl shadow-brutal-sm my-8 text-left">
            <span className="font-mono text-[10px] uppercase font-black text-[#3B82F6] block mb-1">Bottom Line</span>
            <p className="text-sm font-bold text-slate-900">
              A cheap website is a liability, not an asset. Investing in a hand-coded, high-performance web system starting at ₹6,999 ({currency === "USD" ? "$99" : "₹6,999"}) pays for itself in faster Google rankings, higher visitor retention, and zero recurring hosting bloat.
            </p>
          </div>
        </div>
      )
    },
    {
      slug: "top-10-ai-automation-tools",
      title: "Top 10 AI Automation Tools for Business Growth in 2026",
      date: "April 20, 2026",
      readTime: "6 min read",
      author: "Raj Dubey",
      tags: ["AI Tools", "Productivity", "Automation"],
      category: "tech",
      seoDescription: "An expert curation of the top 10 AI automation tools for business operations in 2026, featuring integrations, CRM databases, and outreach.",
      summary: "Curious which AI tools actually drive revenue and efficiency instead of just creating hype? Here is our curated list of the top 10 AI automation tools you should integrate into your workflows this year.",
      content: (
        <div className="space-y-6 text-slate-800 leading-relaxed font-medium">
          <p>
            The market is saturated with AI tools, but most of them are gimmicks. To build a highly competitive business, you must focus on tools that automate real, day-to-day operations: lead intake, scheduling, email follow-ups, database syncing, and marketing outreach.
          </p>
          <p>
            Here is our expert selection of the top 10 AI automation tools that actually deliver return on investment (ROI).
          </p>

          <h3 className="font-display font-black text-xl text-slate-950 mt-8">1. Zapier & Make (Workflow Connectors)</h3>
          <p>
            The foundational glue of modern automation. Zapier and Make let you connect webhooks, databases, and APIs without writing complex integration code.
            <em>Workflow Tip:</em> Automatically send new website lead submissions to OpenAI to summarize client requests before texting your sales executive.
          </p>

          <h3 className="font-display font-black text-xl text-slate-950 mt-6">2. Gemini API / OpenAI API (Reasoning Engines)</h3>
          <p>
            Direct API access to LLMs is the cheapest and most powerful way to run AI. Instead of paying for a monthly AI assistant subscription, direct API calls cost fractions of a cent and can be embedded directly into your custom apps to draft pitches, classify tickets, and analyze reports.
          </p>

          <h3 className="font-display font-black text-xl text-slate-950 mt-6">3. ElevenLabs (Voice Synthesis)</h3>
          <p>
            The undisputed king of AI voice. ElevenLabs generates incredibly realistic, emotionally nuanced voiceovers for marketing reels, video advertisements, and customer phone responses in seconds.
          </p>

          <h3 className="font-display font-black text-xl text-slate-950 mt-6">4. Retool (Internal Admin Panels)</h3>
          <p>
            Retool lets developers build custom internal dashboards, CRM views, and database managers in hours instead of weeks. Perfect for creating custom lead control centers.
          </p>

          <h3 className="font-display font-black text-xl text-slate-950 mt-6">5. Twilio (Outreach Gateway)</h3>
          <p>
            Twilio provides the raw telecommunication APIs to make automated calls, send SMS notifications, and sync WhatsApp pipelines. It is the core engine behind WEBXcel Tech Solutions' custom outreach systems.
          </p>

          <h3 className="font-display font-black text-xl text-slate-950 mt-6">6. Phantombuster / Clay (Lead Scraping & Enrichment)</h3>
          <p>
            These platforms scrape data from LinkedIn and directories, identify contact emails and phone numbers, and use AI to write personalized outreach emails based on a prospect's job history.
          </p>

          <h3 className="font-display font-black text-xl text-slate-950 mt-6">7. Resend (Email Deliverability)</h3>
          <p>
            A high-speed, modern developer tool for sending transactional emails. It ensures your welcome messages and invoices land in the inbox, not the spam folder.
          </p>

          <h3 className="font-display font-black text-xl text-slate-950 mt-6">8. v0.dev (Generative UI Prototyping)</h3>
          <p>
            A tool from Vercel that converts descriptive text prompts into production-ready React component code, drastically shortening development timelines.
          </p>

          <h3 className="font-display font-black text-xl text-slate-950 mt-6">9. Notion AI (Centralized Wiki)</h3>
          <p>
            Excellent for team knowledge bases. Notion AI acts as a search index over your internal guidelines, helping onboarding team members find policies instantly.
          </p>

          <h3 className="font-display font-black text-xl text-slate-950 mt-6">10. WEBXcel Custom AI Agents</h3>
          <p>
            While single tools are powerful, they require constant maintenance. At WEBXcel, we orchestrate these APIs together into a cohesive, custom-built system that requires zero monthly platform fees.
          </p>

          <div className="bg-yellow-50 border-4 border-black p-6 rounded-3xl shadow-brutal-sm my-8 text-left">
            <span className="font-mono text-[10px] uppercase font-black text-[#3B82F6] block mb-1">Key Concept</span>
            <p className="text-sm font-bold text-slate-900">
              Don't buy tools; build systems. Single AI tools are expensive in isolation, but connecting raw APIs directly into a custom business dashboard ensures you only pay for resources you actually use.
            </p>
          </div>
        </div>
      )
    }
  ];

  // Client-side URL routing sync
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname.replace(/^\/+|\/+$/g, "");
      if (path.startsWith("blog/")) {
        const slug = path.split("blog/")[1];
        const post = blogPosts.find((p) => p.slug === slug);
        if (post) {
          setSelectedPost(post);
        } else {
          // If slug invalid, redirect to /blog list
          window.history.replaceState(null, "", "/blog");
          setSelectedPost(null);
        }
      } else {
        setSelectedPost(null);
      }
    }
  }, []);

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `/blog/${post.slug}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBackToList = () => {
    setSelectedPost(null);
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/blog");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === "all" || post.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left animate-fadeIn">
      {selectedPost ? (
        // --- 1. SINGLE POST VIEW ---
        <article className="space-y-8 max-w-4xl mx-auto">
          {/* Breadcrumbs & Back Button */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-black">
            <button
              onClick={handleBackToList}
              className="inline-flex items-center space-x-2 bg-white border-2 border-black px-4 py-2 rounded-xl text-xs font-black uppercase shadow-brutal-sm hover:-translate-y-0.5 hover:shadow-brutal-md transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Back to Blog</span>
            </button>
            <span className="font-mono text-[10px] uppercase font-black text-zinc-500">
              Blog / {selectedPost.title.substring(0, 25)}...
            </span>
          </div>

          {/* Hero Meta Info */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {selectedPost.tags.map((tag, i) => (
                <span 
                  key={i}
                  className="bg-yellow-300 border-2 border-black px-2.5 py-0.5 rounded-lg font-mono text-[9px] font-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_#000000]"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="font-display text-3xl sm:text-5xl font-black text-slate-950 leading-tight">
              {selectedPost.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-zinc-500 font-mono font-bold pt-2">
              <span className="flex items-center space-x-1.5">
                <User className="w-4 h-4 text-[#3B82F6]" />
                <span>By {selectedPost.author}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>{selectedPost.date}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>{selectedPost.readTime}</span>
              </span>
            </div>
          </div>

          {/* Article Banner image replacement matching brutalism */}
          <div className="bg-yellow-100 border-4 border-black p-8 rounded-3xl bg-halftone-yellow relative overflow-hidden shadow-brutal-sm">
            <span className="font-mono text-[10px] uppercase font-black text-[#3B82F6] block mb-2">WEBXcel Editorial</span>
            <p className="font-display font-black text-lg sm:text-xl text-slate-950 max-w-2xl">
              \"{selectedPost.summary}\"
            </p>
          </div>

          {/* Body Content */}
          <div className="prose max-w-none">
            {selectedPost.content}
          </div>

          {/* CTA Box */}
          <div className="bg-[#3B82F6] border-4 border-black p-8 rounded-3xl text-white shadow-brutal-md mt-16 space-y-6 relative overflow-hidden">
            <div className="absolute right-4 bottom-4 opacity-10 pointer-events-none">
              <Cpu className="w-48 h-48" />
            </div>
            <div className="relative z-10 space-y-4 max-w-2xl text-left">
              <span className="bg-yellow-300 text-slate-950 border-2 border-black px-3 py-1 rounded-lg font-mono text-[10px] font-black uppercase tracking-wider inline-block">
                Build With WEBXcel
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-black leading-tight text-white">
                Ready to Stop Wasting Time on Repetitive Logistics?
              </h3>
              <p className="text-sm text-blue-50 font-bold leading-relaxed">
                We build fully custom, hand-coded business websites, tailored database CRM panels, and WhatsApp conversational AI agents. Pay a flat one-time rate, save 20%+ compared to freelance platforms, and own 100% of your software code assets forever.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onPageChange("estimator")}
                  className="bg-yellow-300 text-slate-950 border-2 border-black px-5 py-3 rounded-xl text-xs font-black uppercase shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-xs transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <span>Use Quote Estimator</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </button>
                <button
                  onClick={() => onPageChange("consultant")}
                  className="bg-white text-slate-950 border-2 border-black px-5 py-3 rounded-xl text-xs font-black uppercase shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-xs transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <span>Chat with AI Advisor</span>
                  <MessageSquare className="w-4 h-4 text-[#3B82F6]" />
                </button>
              </div>
            </div>
          </div>
        </article>
      ) : (
        // --- 2. LIST VIEW ---
        <div className="space-y-12">
          {/* Header Banner */}
          <div className="bg-yellow-100 border-4 border-black p-8 sm:p-12 rounded-3xl shadow-brutal-md bg-halftone-yellow">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center space-x-2 bg-black text-yellow-300 px-4 py-1.5 rounded-lg text-xs font-mono font-black uppercase tracking-widest border border-yellow-300 shadow-[2px_2px_0px_#000000]">
                <BookOpen className="w-4 h-4 text-yellow-300" />
                <span>WEBXcel Insights & Strategy</span>
              </div>
              <h1 className="font-display text-4xl sm:text-6xl font-black text-slate-950 leading-tight tracking-tight">
                Software, Systems, and <br />
                AI Strategy for <span className="underline decoration-yellow-400 decoration-8 font-black text-[#3B82F6]">Smart Growth</span>.
              </h1>
              <p className="text-sm sm:text-base text-zinc-700 font-bold leading-relaxed max-w-2xl">
                We cut through the developer jargon. Read our deep-dive reviews and comparisons on custom web speed, CRM migrations, chatbot RAG parameters, and direct software ROI.
              </p>
            </div>
          </div>

          {/* Search and Category Filter Panel */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white border-4 border-black p-4 rounded-2xl shadow-brutal-sm">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search articles, tags, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border-2 border-black rounded-xl text-xs font-bold font-mono placeholder:text-zinc-400 focus:outline-hidden focus:bg-white transition-colors"
              />
            </div>

            {/* Filter buttons */}
            <div className="md:col-span-7 flex flex-wrap gap-1.5 justify-start md:justify-end">
              {[
                { id: "all", label: "All Posts" },
                { id: "automation", label: "Automation" },
                { id: "crm", label: "CRM Systems" },
                { id: "ai", label: "Artificial Intelligence" },
                { id: "web", label: "Web Dev & Speed" },
                { id: "tech", label: "Tech Stack" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[9px] font-black uppercase tracking-wider border-2 transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-[#3B82F6] text-white border-black shadow-[1.5px_1.5px_0px_#000000]"
                      : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:text-black hover:border-black"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Bento Grid / List */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {filteredPosts.map((post, idx) => {
                // Alternating card styles for beautiful brutalist asymmetry
                const colors = [
                  "shadow-brutal-blue border-black hover:bg-zinc-50/20",
                  "shadow-brutal-red border-black hover:bg-zinc-50/20",
                  "shadow-brutal-md border-black hover:bg-zinc-50/20",
                ];
                const cardColorClass = colors[idx % colors.length];

                return (
                  <div
                    key={post.slug}
                    onClick={() => handlePostClick(post)}
                    className={`md:col-span-6 lg:col-span-6 bg-white border-4 p-6 rounded-3xl ${cardColorClass} transition-all duration-200 cursor-pointer flex flex-col justify-between group text-left`}
                  >
                    <div className="space-y-4">
                      {/* Meta Tags & Category badge */}
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[9px] uppercase font-black text-zinc-400">
                          {post.date}
                        </span>
                        <span className="bg-yellow-300 border-2 border-black px-2 py-0.5 rounded-md font-mono text-[8px] font-black uppercase tracking-wider">
                          {post.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#3B82F6] transition-colors leading-tight">
                        {post.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-zinc-600 text-xs font-bold leading-relaxed line-clamp-3">
                        {post.summary}
                      </p>
                    </div>

                    {/* Bottom row / Read more link */}
                    <div className="pt-6 border-t border-zinc-100 flex items-center justify-between mt-6">
                      <span className="font-mono text-[10px] uppercase font-black text-slate-950 flex items-center group-hover:underline">
                        Read Full Post <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#3B82F6]" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-zinc-50 border-4 border-dashed border-zinc-200 rounded-3xl">
              <p className="font-mono text-zinc-400 text-sm font-black">No articles found matching your query.</p>
              <button 
                onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                className="mt-4 font-mono text-xs text-[#3B82F6] font-black uppercase hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Quick FAQ / Consultant CTA */}
          <div className="bg-[#FFFDF6] border-4 border-black p-8 rounded-3xl shadow-brutal-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="font-display text-xl sm:text-2xl font-black text-slate-950">
                Want to calculate exact website & database CRM costs?
              </h3>
              <p className="text-xs text-zinc-600 font-bold">
                Run our customized pricing calculator to outline your precise requirements and get an instant direct developer estimate.
              </p>
            </div>
            <button
              onClick={() => onPageChange("estimator")}
              className="bg-[#3B82F6] text-white border-2 border-black px-6 py-3 rounded-xl text-xs font-black uppercase shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-xs transition-all shrink-0 cursor-pointer flex items-center space-x-1.5"
            >
              <span>Build Custom Website Quote</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
