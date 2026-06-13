import React from "react";
import { User, Sparkles, Send, CheckCircle } from "lucide-react";

export const About: React.FC = () => {
  const values = [
    "Converting complex ideas into visually stunning, premium-crafted posts and designs.",
    "Data-backed social media reels & poster templates promoting viral organic retention.",
    "Optimized Lead Generation & Meta Ad campaigns connecting businesses with target crowds.",
    "Honest pricing, strict delivery timelines, and direct support with owner Adhwaryu."
  ];

  return (
    <section id="about" className="py-20 sm:py-24 bg-[#0a0a0c] relative overflow-hidden">
      {/* Background neon elements */}
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual card of Adhwaryu Rajvaidya / AB Graphics */}
          <div id="about-visual" className="lg:col-span-5 relative">
            <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-blue-600 via-purple-600 to-orange-500 opacity-20 blur-lg"></div>
            <div className="relative bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
              
              {/* Profile Card Header */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 via-purple-600 to-orange-500 flex items-center justify-center text-white font-black text-xl shadow-lg font-display">
                  AR
                </div>
                <div>
                  <h4 className="text-white font-display font-extrabold text-lg leading-tight">
                    Adhwaryu Rajvaidya
                  </h4>
                  <p className="text-xs font-mono text-gray-400 mt-0.5">
                    Creative Lead & Founder, AB Graphics
                  </p>
                </div>
              </div>

              {/* Stats pill representation */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center">
                  <span className="block font-display font-extrabold text-lg text-orange-400">9307643461</span>
                  <span className="text-[9px] uppercase tracking-wider font-mono text-gray-400 text-center">Call / WhatsApp Support</span>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center flex flex-col justify-center items-center">
                  <div className="flex items-center text-orange-400 font-display font-black text-lg">
                    5★ <span className="text-white text-xs ml-1 font-medium">Ratings</span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider font-mono text-gray-400 mt-0.5">Professional Grade</span>
                </div>
              </div>

              {/* Direct quote */}
              <blockquote className="text-gray-300 italic text-sm font-sans relative border-l-2 border-orange-400 pl-4 leading-relaxed">
                "We don't just sell designs; we design strategic creative assets that captivate audiences, capture conversion leads, and elevate brands to high online credibility."
              </blockquote>
            </div>
          </div>

          {/* Text/Content Area */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-widest font-bold">
              <Sparkles className="w-4 h-4" />
              <span>ABOUT US</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-white animate-pulse">
              Professional Designer Helping Businesses Grow <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">Online</span>
            </h2>

            <p className="text-gray-300 leading-relaxed font-sans text-sm sm:text-base">
              At **AB Graphics**, run by visionary creative designer Adhwaryu Rajvaidya, we craft customized visual media tailored for high audience retention. In the fast-paced online landscape, raw templates lack the capacity to build brand trust. We focus on bespoke, hand-crafted media files from premium post layouts to conversion-boosting meta ad videos.
            </p>

            <p className="text-gray-300 leading-relaxed font-sans text-sm">
              Whether you need daily promotional materials, a premium business visiting card, a beautiful wedding invite interface, or a complete hands-on team managing meta ads setup to yield qualified leads — Adhwaryu helps bridge aesthetic balance with performance marketing.
            </p>

            {/* List of high caliber value points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {values.map((v, idx) => (
                <div key={idx} className="flex gap-2.5 items-start">
                  <CheckCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-xs sm:text-sm font-sans leading-snug">{v}</span>
                </div>
              ))}
            </div>

            {/* Quick call CTA inside about us too */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-mono text-gray-500">HAVE AN IDEA? CHAT WITH ME</span>
                <a
                  href="tel:9307643461"
                  className="text-white font-display font-black text-lg hover:text-[#ff924a] transition-colors"
                >
                  9307643461
                </a>
              </div>
              <a
                href="#contact"
                className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-medium rounded-xl text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                Let's Discuss <Send className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
