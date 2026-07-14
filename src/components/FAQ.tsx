import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Do I own 100% of the website code?",
      answer: "Yes, absolutely. Unlike generic platforms or cheap firms that lock you into proprietary hosting templates, we hand over complete ownership of the React/Vite source code. You own the code assets forever, with zero platform dependencies.",
    },
    {
      question: "How does the 1-month free revisions period work?",
      answer: "After launch, you get 30 days of 100% free edits. This covers content updates, typography changes, layout tweaks, or visual modifications to align with your business. We stay in touch to ensure your launch is a complete success.",
    },
    {
      question: "Can I connect this to my existing Google Sheet?",
      answer: "Yes! We build secure server-side proxy routes matching your Google Sheets configurations. All contact inquiries, pricing estimates, and customer leads are automatically updated onto your sheet in real-time.",
    },
    {
      question: "What is the typical delivery timeline?",
      answer: "We deliver starter websites in 7 days, CRM dashboards in 10-14 days, and custom AI chatbot systems within 14 days. If you have an urgent timeline request, we work according to your schedules without compromising code quality.",
    },
    {
      question: "Why are your rates more affordable than other companies?",
      answer: "We skip heavy agency overheads, project managers, and bloated licensing models. We write clean, direct code from scratch, providing enterprise-grade systems at a fraction of standard cost.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-transparent border-b-4 border-black relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-[#3B82F6] border-2 border-black px-4 py-1.5 rounded-lg text-white shadow-[3px_3px_0px_#000000] transform rotate-1">
            <HelpCircle className="w-4 h-4 text-white stroke-[2.5]" />
            <span className="text-xs font-black font-comic tracking-widest uppercase">
              * COMMON QUESTIONS *
            </span>
          </div>
          
          <h2 className="font-sfx text-4xl sm:text-5xl font-normal text-slate-950 uppercase tracking-tight leading-none">
            Frequently Asked Questions
          </h2>
          
          <p className="text-zinc-700 text-sm font-bold font-sketch leading-relaxed">
            Quick, honest answers to help you understand our build process, support plans, and codebase handovers.
          </p>
        </div>

        {/* Accordions Stack */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div 
                key={idx}
                className="border-4 border-black rounded-2xl bg-white overflow-hidden shadow-[4px_4px_0px_#000000] transition-all duration-200"
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer hover:bg-zinc-50 transition-colors"
                >
                  <span className="font-display font-black text-sm uppercase tracking-tight text-slate-950">
                    {faq.question}
                  </span>
                  <div className="p-1 rounded-lg border-2 border-black bg-[#FEF3C7] shadow-[1.5px_1.5px_0px_#000000] shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-black stroke-[3]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-black stroke-[3]" />
                    )}
                  </div>
                </button>

                {/* Accordion Answer Wrapper with smooth heights */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-2 border-t-2 border-dashed border-zinc-200">
                        <p className="text-zinc-600 text-xs font-bold leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
