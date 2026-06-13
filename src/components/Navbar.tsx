import React, { useState } from "react";
import { Phone, MessageSquare, Menu, X, Flame } from "lucide-react";

interface NavbarProps {
  onQuoteClick: () => void;
  onChatClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onQuoteClick, onChatClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Packages", href: "#packages" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top micro-bar displaying WhatsApp/Phone details */}
      <div className="bg-black/50 border-b border-white/10 py-1 px-4 text-center text-xs tracking-wide text-gray-400 font-mono hidden sm:block">
        Creative Design & SMM Studio • Active Support Number:{" "}
        <a href="tel:9307643461" className="text-orange-400 hover:underline">
          9307643461
        </a>
      </div>

      {/* Main glass nav bar */}
      <div className="bg-black/40 backdrop-blur-md border-b border-white/10 mx-4 mt-3 sm:mt-2 rounded-2xl px-4 sm:px-6 py-3 shadow-2xl">
        <div className="flex items-center justify-between">
          {/* Logo / Branding */}
          <a href="#home" className="flex items-center gap-2 group">
            <img
              src="/src/assets/images/ab_graphics_logo_1781358933777.jpg"
              alt="AB Graphics Logo"
              className="w-10 h-10 rounded-lg object-cover shadow-lg group-hover:scale-105 transition-transform duration-300 pointer-events-none border border-white/10"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-white font-display font-bold text-base leading-none group-hover:text-[#ff924a] transition-all">
                AB GRAPHICS
              </span>
              <span className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">
                Creative Studio
              </span>
            </div>
          </a>

          {/* Desktop Nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-white font-sans text-sm font-medium transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="tel:9307643461"
              id="nav-call-btn"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 px-4 py-2 rounded-full transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-mono font-semibold text-white">9307643461</span>
            </a>
            <button
              id="nav-quote-btn"
              onClick={onQuoteClick}
              className="px-4 py-2 text-xs font-display font-semibold rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 text-white shadow-lg hover:shadow-orange-500/20 hover:scale-103 active:scale-98 transition-all"
            >
              Get Custom Quote
            </button>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onQuoteClick}
              className="px-3 py-1.5 text-[11px] font-display font-semibold rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 text-white shadow-md"
            >
              Quote
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden mx-4 mt-2 px-4 py-5 rounded-2xl glass-panel border-white/10 flex flex-col gap-4 animate-fadeIn transition-all">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-[#ff924a] py-1 border-b border-white/5 font-sans text-sm font-medium transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <a
              href="tel:9307643461"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-center text-xs font-mono font-medium text-gray-300 bg-white/5 border border-white/10"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              Call 9307643461
            </a>
            <button
              onClick={() => {
                setIsOpen(false);
                onChatClick();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-center text-xs font-display font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
              AI Chat
            </button>
          </div>
          <div className="text-center font-mono text-[9px] text-gray-500">
            9307643461
          </div>
        </div>
      )}
    </nav>
  );
};
