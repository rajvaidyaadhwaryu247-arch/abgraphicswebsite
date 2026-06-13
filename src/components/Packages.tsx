import React from "react";
import { Sparkles, CheckCircle2, ChevronRight, Zap } from "lucide-react";

interface PackagesProps {
  onPackageSelect: (packageName: string) => void;
}

export const Packages: React.FC<PackagesProps> = ({ onPackageSelect }) => {
  const packages = [
    {
      id: "pkg-smm",
      name: "Social Media Management",
      price: "₹27,000",
      term: "/ month",
      description: "End-to-end full service social media growth bundle to amplify community reach and maintain a stunning corporate aesthetic.",
      popular: true,
      color: "from-blue-500 via-purple-600 to-indigo-600",
      features: [
        "12 Cinematic High-Retention Reels",
        "12 Creative Custom Poster Designs",
        "Daily Stories & Engagement Boosters",
        "On-Location Event Coverage Integration",
        "Curated Highlight Reels Generation",
        "Strategic Content Planning & Calendars",
        "Dedicated Monthly Performance Audits",
        "WhatsApp Sync Support with Adhwaryu"
      ]
    },
    {
      id: "pkg-15d",
      name: "15 Days Growth Package",
      price: "₹18,000",
      term: " flat",
      description: "Fast-tracked visual takeover geared towards lead generation, meta ads setup, and scaling account reach instantly.",
      popular: false,
      color: "from-purple-500 via-pink-600 to-orange-500",
      features: [
        "6 High-Retention Reels (Edited)",
        "8 Creative Branded Poster Designs",
        "Daily Stories & Campaign Teasers",
        "Account Overhaul & Theme Handling",
        "Meta Ads Setup (FB & IG Targets)",
        "Lead Generation Funnel Graphics",
        "15 Days Fast-Track Delivery",
        "Direct Call Support: 9307643461"
      ]
    }
  ];

  return (
    <section id="packages" className="py-20 sm:py-24 bg-[#0a0a0c] relative overflow-hidden">
      {/* Background glow filters */}
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[60%] h-[30%] bg-purple-600/10 rounded-full blur-[110px] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-orange-400 font-mono mb-4 uppercase font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>GROWTH PACKAGES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-white mb-4">
            Select Your Brand Speed Accelerator
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed max-w-xl">
            Choose between our high-impact monthly management handover or our fast-tracked 15-day scaling sprint. No hidden charges. Clear deliverables.
          </p>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-3xl bg-white/5 p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden transition-transform duration-300 hover:scale-[1.01] ${
                pkg.popular ? "border-purple-500/40 ring-1 ring-purple-500/20" : ""
              }`}
            >
              {/* Popular Ribbon / Glow */}
              {pkg.popular && (
                <div className="absolute -top-3 -right-3 w-28 h-28 pointer-events-none overflow-hidden">
                  <div className="absolute top-6 right-[-24px] bg-gradient-to-r from-blue-500 to-purple-600 font-mono text-[9px] font-black uppercase text-center text-white py-1.5 px-8 rotate-45 shadow-lg tracking-widest leading-none">
                    POPULAR
                  </div>
                </div>
              )}

              {/* Card Content Top */}
              <div>
                {/* Visual Accent Bar */}
                <div className={`h-1.5 w-16 rounded-full bg-gradient-to-r ${pkg.color} mb-6`}></div>

                {/* Package Name */}
                <h3 className="text-white font-display font-extrabold text-2xl tracking-normal mb-1 animate-pulse">
                  {pkg.name}
                </h3>
                
                {/* Description */}
                <p className="text-gray-300 text-xs leading-relaxed mb-6 font-sans">
                  {pkg.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl sm:text-5xl font-display font-black text-white bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                    {pkg.price}
                  </span>
                  <span className="text-sm font-mono text-gray-400 lowercase">{pkg.term}</span>
                </div>

                {/* Feature checklist */}
                <div className="border-t border-white/10 pt-6 flex flex-col gap-3.5 mb-8">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-gray-400">
                    PACKAGE DELIVERABLES:
                  </span>
                  {pkg.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-xs sm:text-sm font-sans leading-normal">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Selection button */}
              <button
                onClick={() => onPackageSelect(pkg.name)}
                className={`w-full py-4 text-center rounded-2xl font-display font-bold text-sm tracking-wide transition-all ${
                  pkg.popular
                    ? "bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 text-white shadow-xl shadow-purple-500/10 hover:shadow-orange-500/25 hover:brightness-105"
                    : "bg-white/5 border border-white/10 hover:bg-white/10 text-white"
                }`}
              >
                Select {pkg.name} <ChevronRight className="w-4 h-4 inline-block -mt-0.5 ml-1" />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom micro notice */}
        <div className="text-center mt-12 bg-white/5 max-w-xl mx-auto rounded-2xl p-4 border border-white/10 text-xs text-gray-400 font-sans">
          All payments are transparently structured. Custom monthly retention combinations are available on pricing request. Call Adhwaryu Rajvaidya directly at <a href="tel:9307643461" className="text-orange-400 font-mono hover:underline font-bold font-display">9307643461</a> to draft customized graphics briefs.
        </div>

      </div>
    </section>
  );
};
