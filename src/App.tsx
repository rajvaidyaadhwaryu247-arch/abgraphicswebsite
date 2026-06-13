import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Packages } from "./components/Packages";
import { Portfolio } from "./components/Portfolio";
import { QuoteCalculator } from "./components/QuoteCalculator";
import { Contact } from "./components/Contact";
import { Chatbot } from "./components/Chatbot";
import { Phone, MessageSquare, Heart, Sparkles, Check, CheckCircle2, ChevronRight, Menu, X, ArrowUpRight } from "lucide-react";

export default function App() {
  const [selectedService, setSelectedService] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const displayToast = (msg: string) => {
    setToastMessage(msg);
    // Auto clear toast after 4 seconds
    setTimeout(() => {
      setToastMessage(null);
    }, 5500);
  };

  const selectServiceAndScroll = (serviceName: string) => {
    setSelectedService(serviceName);
    displayToast(`Prefilled "${serviceName}" in the quote estimator and contact form!`);
    const quoteSec = document.getElementById("quote-calculator");
    if (quoteSec) {
      quoteSec.scrollIntoView({ behavior: "smooth" });
    }
  };

  const selectPackageAndScroll = (packageName: string) => {
    setSelectedService(packageName);
    displayToast(`Prefilled "${packageName}" package in the contact form!`);
    const contactSec = document.getElementById("contact");
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const whatsappUrl = "https://wa.me/919307643461?text=Hi%20Adhwaryu,%20I'm%20writing%20from%20your%20AB%20Graphics%20website%20and%20want%20to%20discuss%20design%20options!";

  return (
    <div className="bg-[#0a0a0c] min-h-screen text-gray-100 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Top Banner alert on mobile */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-700 via-purple-700 to-orange-600 px-4 py-1.5 text-center text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider block md:hidden select-none">
        Call Adhwaryu Direct: <a href="tel:9307643461" className="underline text-white">9307643461</a> • WhatsApp Enabled
      </div>

      {/* Global Success Notification Toast */}
      {toastMessage && (
        <div id="toast-notification" className="fixed top-20 right-4 left-4 sm:left-auto z-50 max-w-sm rounded-2xl bg-white/5 border border-white/10 p-4 shadow-2xl flex items-start gap-3 animate-fadeIn bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950">
          <div className="p-2 bg-[#ff924a]/10 rounded-lg text-orange-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="block font-display font-extrabold text-sm text-white">AB Graphics Confirm</span>
            <p className="text-gray-300 text-xs mt-1 leading-normal font-sans">
              {toastMessage}
            </p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-auto text-gray-500 hover:text-white font-mono text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Menu */}
      <Navbar
        onQuoteClick={() => scrollToSection("quote-estimator-section")}
        onChatClick={() => {
          // Trigger chatbot floating click
          const chatBtn = document.querySelector("button[onClick*='setIsOpen']");
          if (chatBtn) {
            (chatBtn as HTMLButtonElement).click();
          }
        }}
      />

      {/* Hero Header */}
      <Hero
        logoSrc="/assets/ab-graphics-logo.png"
        onQuoteClick={() => scrollToSection("quote-estimator-section")}
        onChatClick={() => {
          displayToast("Launching automated AB assistant consultant balloon on the bottom-right corner!");
        }}
      />

      {/* About Section */}
      <About />

      {/* Services Section */}
      <Services onServiceSelect={selectServiceAndScroll} />

      {/* Packages Section */}
      <Packages onPackageSelect={selectPackageAndScroll} />

      {/* Portfolio Section */}
      <Portfolio />

      {/* Quote Planner Interactive Widget Section */}
      <section id="quote-estimator-section" className="py-20 sm:py-24 bg-[#0a0a0c] relative overflow-hidden border-t border-white/10">
        <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white mb-2">
              Plan Your Design Budget
            </h2>
            <p className="text-gray-300 text-sm">
              Use our live planner below to check required components and evaluate our starting models.
            </p>
          </div>
          <QuoteCalculator
            initialService={selectedService}
            onSuccess={displayToast}
          />
        </div>
      </section>

      {/* Contact Form Section */}
      <Contact
        prefilledRequirement={selectedService}
        onSuccess={displayToast}
      />

      {/* Floating Chatbot Tool */}
      <Chatbot />

      {/* Permanent floating WhatsApp button requested linked to 9307643461 */}
      <div className="fixed bottom-6 left-6 z-50 group">
        <div className="absolute -inset-1 rounded-full bg-green-500/40 blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center p-3.5 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-2xl transition-all"
          title="Direct WhatsApp link"
        >
          <MessageSquare className="w-5 h-5 fill-white" />
          <span className="absolute left-[115%] bg-slate-900 border border-white/10 text-white font-mono text-[9px] px-2.5 py-1 rounded-lg uppercase tracking-wider whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Chat Adhwaryu on WhatsApp
          </span>
        </a>
      </div>

      {/* Site Footer */}
      <footer className="bg-[#0a0a0c] border-t border-white/10 py-12 relative overflow-hidden select-none">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            {/* Branding col */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/assets/ab-graphics-logo.png"
                  alt="AB Graphics"
                  className="w-10 h-10 rounded-lg object-contain shadow-lg border border-white/10 pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col">
                  <span className="text-white font-display font-bold text-base leading-none">AB Graphics</span>
                  <span className="text-[9px] font-mono tracking-widest text-[#a78bfa] uppercase">Creative Studio</span>
                </div>
              </div>
              {/* Slogan exactly requested */}
              <p className="text-[#a1a1aa] text-xs font-display font-medium tracking-wide">
                "Designing Ideas, Creating Impact"
              </p>
              <p className="text-gray-400 text-xs mt-3 leading-relaxed max-w-sm">
                A premier design and high-converting marketing agency helping modern digital products scaling to global visibility.
              </p>
            </div>

            {/* Quick Links col */}
            <div>
              <span className="block font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-3">
                SERVICES SCOPE
              </span>
              <ul className="text-gray-400 text-xs flex flex-col gap-2 font-sans">
                <li>• Social Media Posts</li>
                <li>• Video Editing & Reels</li>
                <li>• Wedding Card Invitation</li>
                <li>• Meta Ads & SMM setup</li>
              </ul>
            </div>

            {/* Owner contact col */}
            <div>
              <span className="block font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-3">
                DIRECT CHANNELS
              </span>
              <ul className="text-gray-400 text-xs flex flex-col gap-2 font-sans">
                <li>
                  Phone:{" "}
                  <a href="tel:9307643461" className="text-white font-mono hover:underline">
                    9307643461
                  </a>
                </li>
                <li>
                  WhatsApp:{" "}
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-green-400 font-mono hover:underline">
                    9307643461
                  </a>
                </li>
                <li>
                  Hours:{" "}
                  <span className="font-mono text-[11px] text-orange-400">24/7 Premium Cover</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Legal micro terms line */}
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center text-[11px] text-gray-500 font-sans">
            <div>
              © {new Date().getFullYear()} AB Graphics. Crafted for elite digital impact.
            </div>
            <div>
              Founder Lead: <span className="text-gray-400">Adhwaryu Rajvaidya (9307643461)</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
