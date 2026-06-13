import React, { useState, useEffect } from "react";
import { Play, X, Film, Sparkles, Tv } from "lucide-react";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface ReelItem {
  id: string;
  reelTitle: string;
  instagramReelUrl: string;
  thumbnailUrl: string;
}

export const ReelsShowcase: React.FC<{ itemsChangeTrigger?: number }> = ({ itemsChangeTrigger = 0 }) => {
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [activeReel, setActiveReel] = useState<ReelItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReels = async () => {
      const path = "Reels";
      try {
        const reelsCol = collection(db, path);
        const reelsSnapshot = await getDocs(reelsCol);
        const fetchedReels = reelsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ReelItem[];
        
        setReels(fetchedReels);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, path);
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, [itemsChangeTrigger]);

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500 font-mono text-xs">
        <Film className="w-5 h-5 animate-spin mx-auto mb-2 text-orange-400" />
        Loading video reel showcases...
      </div>
    );
  }

  // If no reels upload existed yet, don't break, keep it clean or show a message
  if (reels.length === 0) {
    return null; // Don't render the section if empty
  }

  return (
    <section id="reels-showcase" className="py-20 sm:py-24 bg-[#0a0a0c] border-t border-white/10 relative overflow-hidden">
      {/* Decorative ambient glowing grids */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35%] h-[35%] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        
        {/* Title */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#a78bfa] font-mono mb-4 uppercase font-bold tracking-wider">
            <Tv className="w-3.5 h-3.5 text-purple-400" />
            <span>VIRAL SMM SHOWCASE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white mb-4">
            Instagram Reels Portfolio
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-sans max-w-md">
            Click any premium social post or editorial motion asset below to view its design frame performance in deep detail.
          </p>
        </div>

        {/* Reels grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {reels.map((reel) => (
            <div
              key={reel.id}
              onClick={() => setActiveReel(reel)}
              className="group cursor-pointer relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-xl hover:border-orange-500/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Cover Poster Image */}
              <img
                src={reel.thumbnailUrl}
                alt={reel.reelTitle}
                className="w-full h-full object-cover group-hover:scale-104 transition-all duration-500"
                referrerPolicy="no-referrer"
              />

              {/* Dynamic overlay shadow */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-transparent flex flex-col justify-end p-4">
                
                {/* Visual Play Button Ring */}
                <div className="w-9 h-9 rounded-full bg-orange-500 text-black flex items-center justify-center shadow-lg mb-2 mx-auto scale-90 group-hover:scale-100 group-hover:opacity-100 opacity-80 transition-all duration-300">
                  <Play className="w-4.5 h-4.5 fill-current ml-0.5" />
                </div>

                <h3 className="text-white text-xs font-display font-bold text-center leading-snug line-clamp-2">
                  {reel.reelTitle}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Lightbox Popup Video Player Modal */}
        {activeReel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-md animate-fadeIn">
            <div className="relative glass-panel rounded-3xl border border-white/10 overflow-hidden max-w-sm w-full shadow-2xl flex flex-col aspect-[9/16] bg-slate-950">
              
              {/* Close helper button */}
              <button
                onClick={() => setActiveReel(null)}
                className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/60 border border-white/10 text-white hover:text-orange-400 hover:scale-105 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Secure Embed Frame Iframe for Instagram */}
              <div className="w-full h-full relative">
                {activeReel.instagramReelUrl.includes("/embed") ? (
                  <iframe
                    src={activeReel.instagramReelUrl}
                    title={activeReel.reelTitle}
                    className="w-full h-full border-0 rounded-3xl"
                    allowTransparency={true}
                    allow="encrypted-media"
                    scrolling="no"
                  ></iframe>
                ) : (
                  /* Fallback if users paste custom watch raw URL instead of /embed (we automatically redirect or show standard card/link) */
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-gray-400 font-sans">
                    <Tv className="w-12 h-12 text-orange-400 mb-4 animate-pulse" />
                    <h4 className="text-white font-bold text-sm mb-2">{activeReel.reelTitle}</h4>
                    <p className="text-xs mb-6 max-w-xs leading-normal">
                      This Instagram post must be opened in a new tab due to cross-origin sandboxed canvas restraints.
                    </p>
                    <a
                      href={activeReel.instagramReelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-orange-600 text-white font-semibold text-xs tracking-wide uppercase transition-transform hover:scale-102"
                    >
                      View on Instagram
                    </a>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
