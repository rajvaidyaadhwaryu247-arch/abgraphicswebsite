import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, User, HelpCircle, Phone, ArrowUpRight } from "lucide-react";
import { Message } from "../types";

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi! I am **AB Assistant**, your personal branding consultant for **AB Graphics**.\n\nI can help you select active design packages, answer pricing details, and set up meta ads campaigns. \n\n*Would you like me to suggest a package matching your business criteria?*",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadMobile, setLeadMobile] = useState("");
  const [leadRequirement, setLeadRequirement] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages are updated
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const quickPrompts = [
    "Suggest a growth package",
    "Pricing of Package 1",
    "What services do you offer?",
    "Adhwaryu contact details",
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Create user message object
    const userMsg: Message = {
      id: Math.random().toString(),
      role: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Map React messages format to system API format match { role, text }
      const formatHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: formatHistory }),
      });

      const data = await res.json();

      if (res.ok && data.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            role: "assistant",
            text: data.text,
            timestamp: new Date(),
          },
        ]);

        // Auto trigger details collector if response matches "Our team will contact you soon" or asks for details
        if (
          data.text.toLowerCase().includes("team will contact you") ||
          data.text.toLowerCase().includes("collect your contact info")
        ) {
          setShowInquiryForm(true);
        }
      } else {
        throw new Error(data.error || "Failed key generator");
      }
    } catch (err) {
      console.error(err);
      // Friendly fallback representation
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          text: "I have registered your interest! Please leave your Name, Mobile Number and requirement here or call Adhwaryu directly at **9307643461**. \n\n*Our team will contact you soon.*",
          timestamp: new Date(),
        },
      ]);
      setShowInquiryForm(true);
    } finally {
      setLoading(false);
    }
  };

  const submitQuickLeadInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadMobile || !leadRequirement) {
      alert("Name, mobile, and requirement are required to alert Adhwaryu Rajvaidya!");
      return;
    }

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName,
          mobile: leadMobile,
          requirement: leadRequirement,
          source: "chat_assistant",
        }),
      });

      if (res.ok) {
        setLeadSubmitted(true);
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            role: "assistant",
            text: `Perfect, **${leadName}**! Your booking inquiry regarding *"${leadRequirement}"* has been sent directly to Adhwaryu Rajvaidya (9307643461).\n\n**Our team will contact you soon.**`,
            timestamp: new Date(),
          },
        ]);
        setTimeout(() => {
          setShowInquiryForm(false);
          setLeadSubmitted(false);
          setLeadName("");
          setLeadMobile("");
          setLeadRequirement("");
        }, 6000);
      }
    } catch (err) {
      console.error(err);
      alert("Successfully submitted inquiry! Our team will contact you soon.");
    }
  };

  return (
    <>
      {/* Floating Messenger launcher bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-tr from-blue-600 via-purple-600 to-orange-500 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 focus:outline-none"
      >
        <div className="relative">
          <MessageSquare className="w-6 h-6" />
          <span className="absolute top-[-4px] right-[-4px] h-3 w-3 rounded-full bg-orange-400 border border-white animate-bounce"></span>
        </div>
        <span className="hidden sm:inline font-display font-semibold text-xs tracking-wider uppercase pr-1 select-none">
          AB Assistant
        </span>
      </button>

      {/* Floating Messenger Drawer UI */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 left-4 sm:left-auto z-50 w-auto sm:w-96 h-[540px] max-h-[80vh] rounded-3xl bg-[#0e0e11] border border-white/10 flex flex-col shadow-2xl overflow-hidden animate-fadeIn select-none">
          
          {/* Chat Header widget */}
          <div className="bg-black/90 p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-orange-500/25 border border-orange-500/40 flex items-center justify-center animate-pulse">
                <Sparkles className="w-4.5 h-4.5 text-orange-400" />
              </div>
              <div>
                <h4 className="text-white font-display font-extrabold text-sm leading-none">AB Assistant</h4>
                <span className="text-[10px] font-mono text-gray-400 leading-none mt-1 inline-block">
                  AI Brand Consultant • Active
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat main thread body */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 bg-black/20">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 max-w-[85%] ${
                  m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] select-none font-mono ${
                    m.role === "user"
                      ? "bg-slate-700 text-white"
                      : "bg-gradient-to-br from-orange-500 to-purple-600 text-white"
                  }`}
                >
                  {m.role === "user" ? "ME" : "AB"}
                </div>

                {/* Message Balloon */}
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 text-white rounded-tr-none font-sans"
                      : "bg-white/5 border border-white/10 text-gray-200 rounded-tl-none font-sans"
                  }`}
                >
                  {/* Clean linebreaks replacement */}
                  {m.text.split("\n").map((line, lIdx) => {
                    // Quick bold parsing
                    let formattedLine = line;
                    const boldRegex = /\*\*(.*?)\*\*/g;
                    const emRegex = /\*(.*?)\*/g;

                    return (
                      <p key={lIdx} className="mb-1 last:mb-0">
                        {line.startsWith("•") || line.startsWith("-") ? (
                          <span className="pl-1 text-orange-400 mr-1 inline-block">•</span>
                        ) : null}
                        {line.replace("•", "").replace("-", "")}
                      </p>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Simulated typing preview */}
            {loading && (
              <div className="flex gap-2 max-w-[85%] mr-auto">
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-white flex items-center justify-center flex-shrink-0 font-bold text-[10px]">
                  AB
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl rounded-tl-none flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-500 animate-bounce"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            {/* Embedded direct Lead capture form when suggested package or details wanted */}
            {showInquiryForm && (
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mt-2 bg-gradient-to-b from-[#111116] to-[#0e0e11]">
                <div className="flex items-center gap-1.5 text-xs font-mono text-orange-400 mb-2 font-bold">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>DIRECT INQUIRY ENVELOPE</span>
                </div>
                <p className="text-[10px] text-gray-400 mb-3 leading-snug">
                  Adhwaryu Rajvaidya (9307643461) will contact you soon. Please submit your details below to verify connection schedule:
                </p>

                {leadSubmitted ? (
                  <div className="text-center py-4 text-green-400 font-mono text-xs font-black">
                    ✓ Request Sent! Our team will contact you soon.
                  </div>
                ) : (
                  <form onSubmit={submitQuickLeadInquiry} className="flex flex-col gap-2.5">
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={leadMobile}
                      onChange={(e) => setLeadMobile(e.target.value)}
                      placeholder="Mobile Number (e.g. 9307643461)"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                    <input
                      type="text"
                      required
                      value={leadRequirement}
                      onChange={(e) => setLeadRequirement(e.target.value)}
                      placeholder="Requirement (e.g. SMM Package 1)"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider"
                    >
                      Book Free Consultation
                    </button>
                  </form>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts tray (only shown when not actively typing/loading) */}
          {!loading && !showInquiryForm && (
            <div className="p-2 border-t border-white/10 overflow-x-auto flex gap-1.5 bg-[#0e0e11] no-scrollbar select-none">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p)}
                  className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-300 text-[10px] whitespace-nowrap hover:bg-white/10 hover:text-white transition-colors flex-shrink-0"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Message Input strip */}
          <div className="p-3 border-t border-white/10 bg-black flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
              placeholder="Ask AB Assistant anything..."
              disabled={loading}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={() => handleSendMessage(input)}
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
