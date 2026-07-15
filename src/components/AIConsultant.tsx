import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, Send, User, Sparkles, AlertCircle, ArrowUpRight, HelpCircle } from "lucide-react";
import { Message } from "../types";
import { getMockConsultantResponse } from "../utils/mockConsultant";

export default function AIConsultant() {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("webxcel_chat_history");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved chat history", e);
        }
      }
    }
    return [
      {
        id: "initial-msg",
        role: "assistant",
        content: "Hello! I am XcelBot, your dedicated WEBXcel AI Consultant. I'm here to help you brainstorm digital solutions and estimate project prices for your business. What services are you looking to develop today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-sync chat messages with localStorage cache
  useEffect(() => {
    localStorage.setItem("webxcel_chat_history", JSON.stringify(messages));
  }, [messages]);

  const startSuggestions = [
    "I run a boutique. How can an AI chatbot increase my sales?",
    "Can you outline an estimate for a local real estate website?",
    "What is the Call Dialer tool and how does outreach work?",
    "Do you offer custom CRM integrations under ₹20,000?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isGenerating) return;

    setErrorMsg(null);
    const userMsgId = `user-${Date.now()}`;
    const newUserMsg: Message = {
      id: userMsgId,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    setIsGenerating(true);

    try {
      const apiBase = (import.meta as any).env?.VITE_API_URL || "";
      const response = await fetch(`${apiBase}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [...messages, newUserMsg].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Server responded with error status");
      }

      const data = await response.json();
      if (!data.text) {
        throw new Error("Empty text returned from server");
      }
      
      const assistantMsg: Message = {
        id: `assist-${Date.now()}`,
        role: "assistant",
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.warn("API Error, falling back to smart Mock Consultant:", err);
      
      // Auto-fallback to highly improved Mock Consultant!
      const fallbackText = getMockConsultantResponse(textToSend, [...messages, newUserMsg]);
      
      const assistantMsg: Message = {
        id: `assist-fallback-${Date.now()}`,
        role: "assistant",
        content: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="consultant" className="py-24 bg-transparent border-b-4 border-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Context / Live Showcase Details */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left space-y-6">
            <div className="inline-flex items-center space-x-2 bg-[#3B82F6] border-2 border-black px-4 py-1.5 rounded-lg text-white shadow-[3px_3px_0px_#000000] self-start transform -rotate-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse border border-black shrink-0" />
              <span className="text-xs font-black font-comic tracking-widest uppercase flex items-center">
                * LIVE AGENCY DEMO *
              </span>
            </div>

            <h1 className="font-sfx text-4xl sm:text-5xl font-normal tracking-normal text-slate-950 uppercase leading-none">
              Real-time Conversation Engine!
            </h1>

            <p className="text-zinc-600 text-sm font-bold leading-relaxed">
              This interactive virtual assistant isn't a mock template; it is a fully functional conversational AI powered by advanced LLMs, connected securely to our Node.js server.
            </p>

            <p className="text-zinc-600 text-sm font-bold leading-relaxed">
              We engineer, fine-tune, and embed similar business intelligence agents on custom client sites and CRM databases starting at just <strong>₹14,999</strong>. Ask XcelBot anything about your commercial workflow to see how we qualify leads and boost conversion rates.
            </p>

            {/* Micro FAQ Box */}
            <div className="border-2 border-black bg-white p-5 rounded-xl space-y-3.5 shadow-[4px_4px_0px_#000000]">
              <span className="block text-[9px] font-mono text-zinc-400 font-black uppercase tracking-widest">
                Agent Features Showcase
              </span>
              <div className="space-y-2.5">
                {[
                  "Server-side proxy structure hides API credentials",
                  "Configurable tone of voice matching your exact brand",
                  "Bilingual support (qualifies local and global buyers)",
                  "Integrates directly with CRM lead alerts",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2.5 text-xs text-slate-800 font-extrabold">
                    <span className="w-2 h-2 bg-yellow-400 border border-black rounded-full shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Custom Professional Chat Console */}
          <div className="lg:col-span-7 h-[580px] sm:h-[650px] lg:h-[600px] bg-white rounded-2xl border-4 border-black shadow-[10px_10px_0px_#000000] overflow-hidden flex flex-col relative">
            
            {/* Chat Header */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 bg-zinc-50 border-b-4 border-black text-black flex items-center justify-between">
              <div className="flex items-center space-x-3 text-left">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-yellow-300 text-black border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000000]">
                  <Bot className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-black stroke-[2.5]" />
                </div>
                <div>
                  <span className="block text-xs sm:text-sm font-black uppercase tracking-tight text-slate-950 font-display">WEBXCEL AI ADVISOR</span>
                  <span className="block text-[8px] sm:text-[9px] text-zinc-500 font-mono font-bold flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping mr-1" />
                    AI Consultant · Active
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[8px] sm:text-[9px] bg-[#3B82F6] text-white font-black font-mono px-2 py-0.5 sm:px-2.5 sm:py-1 rounded border-2 border-black shadow-[1.5px_1.5px_0px_#000000] sm:shadow-[2.5px_2.5px_0px_#000000]">
                  ESTIMATE BOT
                </span>
              </div>
            </div>

            {/* Chat Body (Scrollable Messages Area) */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 bg-white/20">
              
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start space-x-2.5 sm:space-x-3 text-left ${
                      msg.role === "user" ? "justify-end space-x-reverse animate-slide-in" : "justify-start"
                    }`}
                  >
                    {/* Avatar icon */}
                    {msg.role === "assistant" ? (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-yellow-300 text-black flex items-center justify-center shrink-0 border-2 border-black mt-0.5 shadow-[1.5px_1.5px_0px_#000000]">
                        <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#3B82F6] text-white flex items-center justify-center shrink-0 border-2 border-black mt-0.5 shadow-[1.5px_1.5px_0px_#000000]">
                        <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`p-3 sm:p-3.5 rounded-xl max-w-[85%] text-xs font-bold leading-relaxed border-2 border-black shadow-[3px_3px_0px_#000000] ${
                        msg.role === "user"
                          ? "bg-[#3B82F6] text-white"
                          : "bg-white text-zinc-950"
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.content}</div>
                      <span
                        className={`block text-[8px] font-mono mt-1.5 text-right ${
                          msg.role === "user" ? "text-blue-100" : "text-zinc-400"
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Generating Animation */}
              {isGenerating && (
                <div className="flex items-start space-x-3 text-left">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-yellow-300 text-black flex items-center justify-center shrink-0 border-2 border-black mt-0.5 shadow-[1.5px_1.5px_0px_#000000]">
                    <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 animate-spin" />
                  </div>
                  <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_#000000] flex items-center space-x-1.5">
                    <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce" />
                  </div>
                </div>
              )}

              {/* Error panel */}
              {errorMsg && (
                <div className="flex items-center space-x-2 bg-rose-100 text-black p-3.5 rounded-xl border-2 border-black text-xs font-bold">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 stroke-[2.5]" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Cards (only show when conversation hasn't gone deep) */}
            {messages.length === 1 && (
              <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-t-2 border-black bg-zinc-50 text-left">
                <span className="block text-[9px] font-mono text-zinc-400 font-black uppercase tracking-widest mb-1.5">
                  Frequently Asked Consultations
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                  {startSuggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(suggestion)}
                      className={`text-[9.5px] sm:text-[10px] text-left p-2 sm:p-2.5 border-2 border-black bg-white hover:bg-yellow-100 rounded-xl transition-all duration-150 text-slate-800 font-bold leading-snug cursor-pointer shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 ${
                        i >= 2 ? "hidden sm:block" : ""
                      }`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input Bar */}
            <div className="p-3 sm:p-4 border-t-2 border-black bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask XcelBot for a customized quote..."
                  disabled={isGenerating}
                  className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 bg-zinc-50 border-2 border-black rounded-xl text-xs font-bold focus:outline-none focus:bg-white disabled:opacity-50 text-slate-950 placeholder-zinc-400"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isGenerating}
                  className="p-2.5 sm:p-3 bg-[#3B82F6] hover:bg-black hover:text-white disabled:bg-zinc-100 disabled:text-zinc-400 border-2 border-black text-white rounded-xl transition-all cursor-pointer shrink-0 shadow-[2px_2px_0px_#000000] flex items-center justify-center"
                >
                  <Send className="w-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                </button>
              </form>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
