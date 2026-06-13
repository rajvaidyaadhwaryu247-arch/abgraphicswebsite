import React from "react";
import { MessageSquare, Phone, ArrowUpRight, Award, ShieldCheck, Zap } from "lucide-react";

interface HeroProps {
  onQuoteClick: () => void;
  onChatClick: () => void;
  logoSrc: string;
}

export const Hero: React.FC<HeroProps> = ({ onQuoteClick, onChatClick, logoSrc }) => {
  const whatsappUrl = "https://wa.me/919307643461?text=Hi%20Adhwaryu,%20I%20visited%20your%20AB%20Graphics%20website%20and%20want%20to%20get%20started%20on%20a%20project!";

  return (
    <section id="home" className="relative min-h-screen pt-28 sm:pt-36 pb-16 flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0c]">
      {/* Background radial/linear glow layout to match corporate branding colors */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none animate-glow-slow"></div>
      <div className="absolute bottom-[10%] right-[-1%] w-[45%] h-[45%] bg-[#ff924a]/10 rounded-full blur-[130px] pointer-events-none animate-glow-slow"></div>
      <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] bg-purple-500/15 rounded-full blur-[120px] pointer-events-none animate-glow-slow"></div>

      {/* Decorative matrix style grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px] opacity-45 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">
        {/* Dynamic Logo Presentation with clean containment responsive to image bounds */}
        <div className="relative mb-6 sm:mb-8 group flex items-center justify-center">
          <div className="absolute inset-[-4px] rounded-2xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-orange-500/20 opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-500"></div>
          <img
            src={logoSrc}
            alt="AB Graphics Logo"
            referrerPolicy="no-referrer"
            className="relative w-[180px] h-[180px] object-contain group-hover:scale-105 transition-transform duration-500 pointer-events-none"
          />
          {/* Subtle badge */}
          <div className="absolute -bottom-2 translate-x-1/2 right-[50%] bg-gradient-to-r from-orange-500 to-purple-600 text-white text-[9px] font-mono uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-md border border-white/20 whitespace-nowrap">
            PRO DESIGN STUDIO
          </div>
        </div>

        {/* Agency Intro micro tagline */}
        <div id="hero-tagline-container" className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 font-mono mb-6 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-orange-400 animate-pulse"></span>
          <span>Creative Design & SMM Studio • Premium Sleek Agency</span>
        </div>

        {/* Main Heading requested exactly */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
          Designing Ideas,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 animate-pulse">Creating Impact</span>
        </h1>

        {/* Subheading requested exactly */}
        <p className="text-gray-300 text-sm sm:text-lg max-w-2xl leading-relaxed mb-8 sm:mb-10 font-sans">
          Professional Graphic Design, Social Media Management & Video Editing. Transforming your online brand with high-retention content, conversion-optimized visuals, and corporate brand kits.
        </p>

        {/* Interactive action call buttons exactly requested */}
        <div id="hero-cta-buttons" className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-md sm:max-w-none px-4 sm:px-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-display font-bold text-sm tracking-wide shadow-xl shadow-green-900/20 hover:scale-103 active:scale-98 transition-all"
          >
            <MessageSquare className="w-5 h-5 fill-white" />
            WhatsApp Us
          </a>
          <button
            onClick={onQuoteClick}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-display font-bold text-sm tracking-wide shadow-xl hover:scale-103 active:scale-98 transition-all"
          >
            Get a Quote <ArrowUpRight className="w-4 h-4 text-orange-200" />
          </button>
          <a
            href="tel:9307643461"
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 text-white font-display font-bold text-sm tracking-wide hover:scale-103 active:scale-98 transition-all"
          >
            <Phone className="w-4 h-4 text-orange-400" />
            9307643461
          </a>
        </div>

        {/* Floating Trust stats (micro details) */}
        <div className="grid grid-cols-3 gap-3 md:gap-8 mt-12 sm:mt-16 max-w-2xl w-full border-t border-white/5 pt-8 font-display">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-white font-black text-lg sm:text-2xl">
              <Zap className="w-4 h-4 text-orange-400" />
              100%
            </div>
            <div className="text-[10px] sm:text-xs text-gray-500 tracking-wider uppercase font-mono mt-1">Custom Work</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-white font-black text-lg sm:text-2xl">
              <Award className="w-4 h-4 text-purple-400" />
              SMM Setup
            </div>
            <div className="text-[10px] sm:text-xs text-gray-500 tracking-wider uppercase font-mono mt-1">Monthly Growth</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-white font-black text-lg sm:text-2xl">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              9307643461
            </div>
            <div className="text-[10px] sm:text-xs text-gray-500 tracking-wider uppercase font-mono mt-1">Direct Support Line</div>
          </div>
        </div>
      </div>
    </section>
  );
};
