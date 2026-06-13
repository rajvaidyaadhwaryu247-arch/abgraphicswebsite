import React from "react";
import { Layout, Image, CreditCard, Video, Heart, Share2, Target, TrendingUp, Sparkles, ArrowRight } from "lucide-react";

interface ServicesProps {
  onServiceSelect: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onServiceSelect }) => {
  const serviceList = [
    {
      id: "smm-posts",
      name: "Social Media Posts",
      icon: <Layout className="w-6 h-6 text-blue-400" />,
      description: "Custom branded creative posters, carousel slides, and custom layouts tailored for your brand profile to drive user organic shares.",
      benefits: ["High retention templates", "Bespoke styling colors", "Engaging captions included"]
    },
    {
      id: "banners",
      name: "Banner Design",
      icon: <Image className="w-6 h-6 text-purple-400" />,
      description: "Sleek, high-resolution header banners for LinkedIn profiles, Youtube channels, digital billboards, and business landing pages.",
      benefits: ["Exact dimension matching", "Device responsive framing", "Sleek typographic design"]
    },
    {
      id: "visiting-cards",
      name: "Visiting Card Design",
      icon: <CreditCard className="w-6 h-6 text-orange-400" />,
      description: "Double-sided premium business card templates, vector print-ready layouts with elegant gold/metallic glowing accents.",
      benefits: ["Modern minimal layout", "Ready-to-print PDF file", "Bespoke QR code integration"]
    },
    {
      id: "video-edit",
      name: "Video Editing",
      icon: <Video className="w-6 h-6 text-[#ff5f85]" />,
      description: "Dynamic TikTok, YouTube Shorts, and Instagram Reel edits featuring custom captions, sync cuts, and sound effects.",
      benefits: ["Engaging sound design", "Sleek typography subtitles", "Under 24h turnaround times"]
    },
    {
      id: "wedding",
      name: "Wedding Design",
      icon: <Heart className="w-6 h-6 text-[#fb7185]" />,
      description: "Premium digital royal wedding cards, electronic invites, and complete custom save-the-date layouts.",
      benefits: ["Luxury gold floral motifs", "E-invitation formatting", "High-end file formats"]
    },
    {
      id: "smm-mgmt",
      name: "Social Media Management",
      icon: <Share2 className="w-6 h-6 text-indigo-400" />,
      description: "End-to-end strategy calendars, creative assets drafting, reel scheduling, captioning and daily profile maintenance.",
      benefits: ["Daily story layouts", "Hashtag keyword planning", "Strategic weekly calendar"]
    },
    {
      id: "meta-ads",
      name: "Meta Ads Setup",
      icon: <Target className="w-6 h-6 text-emerald-400" />,
      description: "Complete targeted ad campaigns across Instagram & Facebook, budget allocation, pixel links & ad copy development.",
      benefits: ["Targeted audience profile", "Ad creative graphic tests", "Daily performance audits"]
    },
    {
      id: "lead-gen",
      name: "Lead Generation",
      icon: <TrendingUp className="w-6 h-6 text-amber-400" />,
      description: "High-performance lead funnels, attractive banner ads, contact forms & routing logic targeting high sales conversion rates.",
      benefits: ["Instant customer tracking", "High-intent lead captures", "Direct call connection setup"]
    }
  ];

  return (
    <section id="services" className="py-20 sm:py-24 bg-[#0a0a0c] relative overflow-hidden">
      {/* Decorative backdrop shapes */}
      <div className="absolute bottom-[10%] left-[-10%] w-[45%] h-[45%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-orange-400 font-mono mb-4 uppercase font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OUR CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-white mb-4">
            Bespoke Creative Solutions Custom Tailored For Visual Growth
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            From single custom designs to comprehensive monthly marketing handovers, we deliver pixel-perfect digital assets that set your brand miles apart. Click any card to request a custom quote instantly.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceList.map((service) => (
            <div
              key={service.id}
              className="bg-white/5 rounded-2xl border border-white/10 p-5 flex flex-col justify-between group transition-all hover:bg-white/10 hover:border-orange-500/30"
            >
              <div>
                {/* Icon Circle */}
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 mb-4 group-hover:scale-105 transition-transform duration-300">
                  {service.icon}
                </div>

                {/* Service Name */}
                <h3 className="text-white font-display font-extrabold text-base tracking-tight mb-2 group-hover:text-orange-400 transition-colors">
                  {service.name}
                </h3>

                {/* Description */}
                <p className="text-gray-300 text-xs leading-relaxed mb-4 font-sans">
                  {service.description}
                </p>

                {/* Benefit pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {service.benefits.map((benefit, bIdx) => (
                    <span
                      key={bIdx}
                      className="text-[9px] font-mono bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-md"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              {/* Selection action button */}
              <button
                onClick={() => onServiceSelect(service.name)}
                className="w-full flex items-center justify-between text-left text-xs font-mono font-medium text-gray-400 group-hover:text-white mt-auto pt-3 border-t border-white/10"
              >
                <span>Select for Quote</span>
                <ArrowRight className="w-3.5 h-3.5 text-orange-400 transform group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA for services */}
        <div className="text-center mt-12 text-xs font-mono text-gray-500">
          Need a completely customized setup? Call Adhwaryu directly at{" "}
          <a href="tel:9307643461" className="text-orange-400 underline hover:text-orange-300">
            9307643461
          </a>
        </div>

      </div>
    </section>
  );
};
