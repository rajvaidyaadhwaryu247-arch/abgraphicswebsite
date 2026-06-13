import React, { useState, useEffect } from "react";
import { Search, Eye, X, MessageSquare, ZoomIn, Film, Sparkles } from "lucide-react";
import { PortfolioItem } from "../types";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

interface PortfolioProps {
  itemsChangeTrigger?: number;
}

export const Portfolio: React.FC<PortfolioProps> = ({ itemsChangeTrigger = 0 }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);
  const [dynamicItems, setDynamicItems] = useState<PortfolioItem[]>([]);

  // Curated static image assets with timestamp matching
  const staticItems: PortfolioItem[] = [
    {
      id: "port-smm-1",
      title: "Luxury Brand Social Media Campaign",
      category: "Social Media",
      image: "/src/assets/images/portfolio_smm_post_1781358950787.jpg",
      description: "A premium social media layout designed for an elite brand of luxury horology. Built with neon purple glowing geometries and premium matte typography on standard Instagram dimensions."
    },
    {
      id: "port-card-1",
      title: "Exquisite Minimalist Visiting Card Mockup",
      category: "Graphics",
      image: "/src/assets/images/portfolio_visiting_card_1781358965648.jpg",
      description: "A dual-sided executive visiting card styled for premium branding. Features copper-orange and neon blue glowing geometric vectors, photographed on a dark high-end marble backdrop."
    },
    {
      id: "port-banner-1",
      title: "Creative Tech Studio Wide Banner",
      category: "Graphics",
      image: "/src/assets/images/portfolio_banner_1781358982617.jpg",
      description: "A 16:9 widescreen canvas masterfully sporting neon teal, bright orange, and dark galactic vectors. Used for a creative developer homepage and corporate channel branding."
    },
    {
      id: "port-wedding-1",
      title: "Royal Navy Wedding Invitation Suite",
      category: "Print",
      image: "/src/assets/images/portfolio_wedding_1781358997455.jpg",
      description: "A premium e-invitation and physical invite designed with gold line-art florals, intricate custom luxury borders, and high-contrast royal navy visual backdrop."
    }
  ];

  useEffect(() => {
    const fetchPortfolio = async () => {
      const path = "Portfolio";
      try {
        const querySnapshot = await getDocs(collection(db, path));
        const fetched = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            category: data.category as any,
            image: data.imageUrl,
            description: data.description || "Custom high-conversion corporate artwork designed dynamically by AB Graphics."
          } as PortfolioItem;
        });
        setDynamicItems(fetched);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, path);
      }
    };

    fetchPortfolio();
  }, [itemsChangeTrigger]);

  // Combine dynamic uploads on top, then fall back to high-fidelity static presets
  const portfolioItems = [...dynamicItems, ...staticItems];

  const categories = ["All", "Graphics", "Social Media", "Video", "Print"];

  const filteredItems = selectedCategory === "All"
    ? portfolioItems
    : portfolioItems.filter(item => item.category === selectedCategory);

  return (
    <section id="portfolio" className="py-20 sm:py-24 bg-[#0a0a0c] relative overflow-hidden">
      {/* Decorative colored glow on background */}
      <div className="absolute top-[20%] left-[-10%] w-[35%] h-[35%] bg-blue-500/10 rounded-full blur-[110px] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Title */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-orange-400 font-mono mb-4 uppercase font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PORTFOLIO SHOWCASE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-white mb-4">
            Designed to Captivate & Convert
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed max-w-lg">
            A hand-picked selection of physical corporate deliverables, elite social media posts, and visual layouts crafted personally by Adhwaryu. Click any design to preview in detail.
          </p>
        </div>

        {/* Categories Tab Navigation */}
        <div id="portfolio-categories-tabs" className="flex flex-wrap items-center justify-center gap-2 mb-10 sm:mb-12 max-w-md mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4.5 py-2 text-xs font-mono font-medium rounded-xl border transition-all ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 text-white border-transparent shadow-lg shadow-purple-500/10 scale-103"
                  : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Dynamic Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group cursor-pointer relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:border-orange-500/30"
            >
              {/* Image box */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-106 transition-all duration-500"
                />
                
                {/* Overlay hover effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-orange-400 mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-white font-display font-extrabold text-base leading-tight mb-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-300 font-mono mt-1">
                    <ZoomIn className="w-3.5 h-3.5 text-blue-400" />
                    <span>View Concept</span>
                  </div>
                </div>
              </div>

              {/* Grid block Footer info (visible always on mobile, hiding category overlay on hover) */}
              <div className="p-4 bg-black/40 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-display font-bold text-sm truncate max-w-[200px]">
                    {item.title}
                  </h4>
                  <span className="text-[10px] font-mono text-gray-400 uppercase mt-0.5 block">
                    {item.category} • Graphic Asset
                  </span>
                </div>
                <div className="p-2 bg-white/5 border border-white/10 rounded-lg text-orange-400 group-hover:bg-orange-500/10 transition-colors">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox pop-up popup preview Modal */}
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
            {/* Modal Container */}
            <div className="relative glass-panel rounded-3xl border-white/10 overflow-hidden max-w-3xl w-full shadow-2xl flex flex-col max-h-[90vh]">
              
              {/* Close Button */}
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/65 border border-white/10 text-white hover:text-orange-400 hover:scale-105 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Main Content Scrollable box */}
              <div className="overflow-y-auto flex flex-col md:flex-row h-full">
                {/* Image Section */}
                <div className="md:w-3/5 bg-black/60 flex items-center justify-center">
                  <img
                    src={activeItem.image}
                    alt={activeItem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-contain max-h-[50vh] md:max-h-[75vh]"
                  />
                </div>

                {/* Details Section */}
                <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-[#0e1423] border-t md:border-t-0 md:border-l border-white/5">
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono text-orange-400 uppercase tracking-widest mb-4">
                      {activeItem.category}
                    </span>
                    <h3 className="text-white font-display font-extrabold text-xl leading-tight mb-4">
                      {activeItem.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                      {activeItem.description}
                    </p>

                    <div className="bg-white/5 rounded-xl p-3.5 border border-white/5 mb-6">
                      <span className="block text-[9px] font-mono text-gray-500 uppercase mb-1">
                        PROJECT PARAMETERS
                      </span>
                      <ul className="text-gray-300 text-xs flex flex-col gap-1.5 list-disc pl-4 font-sans">
                        <li>100% vector scalable layout</li>
                        <li>Designed by Adhwaryu Rajvaidya</li>
                        <li>High conversion color grids</li>
                      </ul>
                    </div>
                  </div>

                  {/* Contact directly using WhatsApp specifically about this concept */}
                  <a
                    href={`https://wa.me/919307643461?text=Hi%20Adhwaryu,%20I'm%20interested%20in%20a%20project%20similar%20to%20your%20portfolio%20item:%20"${encodeURIComponent(activeItem.title)}"`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-display font-bold text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-orange-500/10"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    Ask for Similar Design
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
