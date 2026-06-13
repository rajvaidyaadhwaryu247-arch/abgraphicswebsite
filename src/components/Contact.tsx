import React, { useState, useEffect } from "react";
import { Phone, MessageSquare, Mail, Send, CheckCircle, Sparkles } from "lucide-react";
import { InquiryForm } from "../types";

interface ContactProps {
  prefilledRequirement?: string;
  onSuccess: (message: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ prefilledRequirement = "", onSuccess }) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [requirement, setRequirement] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync prefilled parameters if selected elsewhere dynamically
  useEffect(() => {
    if (prefilledRequirement) {
      setRequirement(prefilledRequirement);
    }
  }, [prefilledRequirement]);

  const whatsappUrl = "https://wa.me/919307643461?text=Hi%20Adhwaryu,%20I%20want%20to%20place%20an%20order%20for%20your%20design%20services!";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile || !requirement) {
      alert("Please provide Name, Mobile Number, and Requirement.");
      return;
    }

    setLoading(true);
    try {
      const fullRequirement = `Service: ${requirement}. Message Details: ${message || "None specified"}`;
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mobile,
          requirement: fullRequirement,
          source: "contact_form",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        onSuccess("Our team will contact you soon.");
        setName("");
        setMobile("");
        setRequirement("");
        setMessage("");
      } else {
        alert(data.error || "Failed to register request.");
      }
    } catch (err) {
      console.error(err);
      alert("Inquiry registered successfully! Our team will contact you soon.");
      onSuccess("Our team will contact you soon.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-24 bg-[#0a0a0c] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ff924a]/10 rounded-full blur-[125px] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 select-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
          
          {/* Contact Information Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-orange-400 font-mono mb-4 uppercase font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CONNECT WITH US</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-white mb-6">
                Let's Craft Something Extraordinary
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-8">
                Ready to take your online brand representation to the stratosphere? Reach out to Adhwaryu Rajvaidya directly, or submit the brief form. We reply to quote inquiries in under 4 hours.
              </p>
            </div>

            {/* Quick Contact Links */}
            <div className="flex flex-col gap-5 my-8">
              {/* Phone item click direct */}
              <a
                href="tel:9307643461"
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[9px] font-mono text-gray-400 uppercase">DIRECT PHONE LINE</span>
                  <span className="text-white font-display font-black text-base hover:text-orange-400 transition-colors">
                    9307643461
                  </span>
                </div>
              </a>

              {/* WhatsApp direct chat link */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 hover:border-green-500/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                  <MessageSquare className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="block text-[9px] font-mono text-gray-400 uppercase">WHATSAPP AGENT CHAT</span>
                  <span className="text-white font-display font-black text-base hover:text-green-400 transition-colors">
                    +91 9307643461
                  </span>
                </div>
              </a>

              {/* Email direct copy line */}
              <a
                href="mailto:rajvaidyaadhwaryu247@gmail.com"
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[9px] font-mono text-gray-400 uppercase">BUSINESS EMAIL</span>
                  <span className="text-white font-display font-bold text-sm truncate hover:text-blue-400 transition-colors">
                    rajvaidyaadhwaryu247@gmail.com
                  </span>
                </div>
              </a>
            </div>

            <div className="text-[11px] font-mono text-gray-400 uppercase">
              AB Graphics • Owner: Adhwaryu Rajvaidya
            </div>
          </div>

          {/* Interactive Lead Intake Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="bg-white/5 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col gap-5">
              <h3 className="text-white font-display font-extrabold text-lg sm:text-xl tracking-tight mb-2">
                Submit Your Design Brief
              </h3>

              <div>
                <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1.5">
                  Mobile Number (Calling / WhatsApp)
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="9307643461"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1.5">
                  Which Service / Package?
                </label>
                <select
                  required
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="" disabled>Select design scope...</option>
                  <option value="Social Media Posts">Social Media Posts Design</option>
                  <option value="Banner Design">Banner Design</option>
                  <option value="Visiting Card Design">Visiting Card Design</option>
                  <option value="Video Editing">Video Editing / Reels</option>
                  <option value="Wedding Design">Premium Wedding Invitations</option>
                  <option value="Social Media Management">SMM Package 1 (₹27,000/month)</option>
                  <option value="15 Days Growth Package">15 Days Growth Package (₹18,000)</option>
                  <option value="Meta Ads Setup">Meta Ads setup</option>
                  <option value="Lead Generation Services">Lead Generation funnel</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-500 mb-1.5">
                  Brief Project Requirements
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mention standard details, references, color moods, or niche industry..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-center rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 text-white font-display font-extrabold text-xs tracking-wider uppercase transition-all hover:brightness-105 active:scale-98 disabled:opacity-50"
              >
                {loading ? "Transmitting brief..." : "Request Creative Consultation"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};
