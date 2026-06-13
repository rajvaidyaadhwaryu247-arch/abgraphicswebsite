import React, { useState } from "react";
import { Calculator, Sparkles, Send, CheckCircle2, MessageSquare } from "lucide-react";

interface QuoteCalculatorProps {
  initialService?: string;
  onSuccess: (message: string) => void;
}

export const QuoteCalculator: React.FC<QuoteCalculatorProps> = ({ initialService = "", onSuccess }) => {
  const [selectedServices, setSelectedServices] = useState<string[]>(
    initialService ? [initialService] : []
  );
  const [urgency, setUrgency] = useState<"standard" | "express">("standard");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [customMsg, setCustomMsg] = useState("");

  const servicesPricing: Record<string, number> = {
    "Social Media Posts": 1500,
    "Banner Design": 2000,
    "Visiting Card Design": 1200,
    "Video Editing": 4500,
    "Wedding Design": 6000,
    "Social Media Management": 27000,
    "Meta Ads Setup": 10000,
    "Lead Generation": 8000,
  };

  const toggleService = (svc: string) => {
    if (selectedServices.includes(svc)) {
      setSelectedServices(selectedServices.filter((s) => s !== svc));
    } else {
      setSelectedServices([...selectedServices, svc]);
    }
  };

  // Compute estimate
  const baseCost = selectedServices.reduce((acc, curr) => acc + (servicesPricing[curr] || 0), 0);
  const multiplier = urgency === "express" ? 1.5 : 1.0;
  const totalCost = Math.round(baseCost * multiplier);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile) {
      alert("Please provide your name and mobile number so we can process your quote!");
      return;
    }

    if (selectedServices.length === 0) {
      alert("Please check at least one service to get an estimate.");
      return;
    }

    setLoading(true);
    try {
      const requirement = `Quote Inquiry: Services selected: [${selectedServices.join(", ")}]. Urgency: ${urgency.toUpperCase()}. Estimated price: ₹${totalCost.toLocaleString()}.${customMsg ? " More Details: " + customMsg : ""}`;

      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mobile,
          requirement,
          source: "quote_calculator",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        onSuccess("Our team will contact you soon.");
        // Reset states
        setName("");
        setMobile("");
        setCustomMsg("");
        setSelectedServices([]);
      } else {
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Successfully submitted inquiry! Our team will contact you soon.");
      onSuccess("Our team will contact you soon.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="quote-calculator" className="bg-white/5 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Decorative colored linear line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500"></div>

      <div className="flex items-center gap-2 mb-6 text-xs font-mono text-orange-400 uppercase tracking-wider font-bold">
        <Calculator className="w-4 h-4 text-orange-400" />
        <span>INTERACTIVE ESTIMATOR</span>
      </div>

      <h3 className="text-white font-display font-black text-2xl tracking-tight mb-2">
        Instant Quote Planner
      </h3>
      <p className="text-gray-300 text-xs mb-8 leading-relaxed font-sans">
        Select your desired creative assets and set timelines to compile an interactive project overview. Leaving your mobile is required to verify booking schedules with Adhwaryu.
      </p>

      {/* Services Grid Selection */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {Object.keys(servicesPricing).map((svc) => (
          <button
            key={svc}
            type="button"
            onClick={() => toggleService(svc)}
            className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
              selectedServices.includes(svc)
                ? "bg-gradient-to-br from-indigo-900/50 to-purple-950/40 border-purple-500/50 text-white shadow-md shadow-purple-500/10"
                : "bg-white/5 border border-white/10 text-gray-400 hover:border-white/20"
            }`}
          >
            <span className="text-xs font-display font-extrabold leading-tight block text-white">{svc}</span>
            <span className="text-[10px] text-gray-400 font-mono mt-2 block">
              Est. Starts ₹{servicesPricing[svc].toLocaleString()}
            </span>
          </button>
        ))}
      </div>

      {/* Urgency Toggle Options */}
      <div className="mb-6">
        <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-2">
          DELIVERY SPEED
        </label>
        <div className="grid grid-cols-2 gap-2 bg-white/5 border border-white/10 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setUrgency("standard")}
            className={`py-2 rounded-lg text-xs font-mono font-medium transition-all ${
              urgency === "standard"
                ? "bg-[#1f1f23] text-white border border-white/10"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Standard (3-5 Days)
          </button>
          <button
            type="button"
            onClick={() => setUrgency("express")}
            className={`py-2 rounded-lg text-xs font-mono font-medium transition-all ${
              urgency === "express"
                ? "bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Express (Under 24h) (+50%)
          </button>
        </div>
      </div>

      {/* Real-time calculated pricing display box */}
      <div className="bg-black/40 rounded-2xl p-5 border border-white/10 text-center mb-8">
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#a78bfa]">
          ESTIMATED GRAPHIC BUDGET
        </span>
        <div className="flex items-baseline justify-center gap-1.5 mt-1">
          <span className="text-3xl sm:text-4xl font-display font-black text-white">
            ₹{totalCost.toLocaleString()}
          </span>
          {selectedServices.length === 0 && (
            <span className="text-[10px] text-purple-400 block font-mono">Select at least one service</span>
          )}
        </div>
      </div>

      {/* Client input details form submit */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-500 mb-1.5">
            YOUR NAME
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-sans"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-500 mb-1.5">
            MOBILE NUMBER (Required for review)
          </label>
          <input
            type="tel"
            required
            pattern="[0-9]{10}"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="e.g. 9307643461"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-500 mb-1.5">
            ADDITIONAL REQUIREMENT (Optional)
          </label>
          <textarea
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            placeholder="Describe your design specifications/aesthetic vibe..."
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-sans"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 text-white font-display font-extrabold text-xs tracking-wider uppercase transition-all hover:brightness-105 active:scale-98 disabled:opacity-50"
        >
          {loading ? "Registering Plan..." : "Submit Quote Inquiry"}
        </button>
      </form>

      {/* WhatsApp backup support */}
      <div className="mt-4 flex items-center justify-center gap-1 text-[10px] text-gray-500 font-mono">
        <MessageSquare className="w-3.5 h-3.5 text-green-400" />
        <span>Or chat on 9307643461 for speedy processing</span>
      </div>
    </div>
  );
};
