import { GoogleGenAI } from "@google/genai";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages parameter." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback if API key is not ready yet
      const lastUserMessage = messages[messages.length - 1]?.text || "";
      let responseText = "Hi there! I am AB Assistant. Adhwaryu's AB Graphics provides high-quality graphics and video services. Please define your requirement and leave your mobile number so our team can contact you soon!";
      
      if (lastUserMessage.toLowerCase().includes("package")) {
        responseText = "We have two premium action packages for your digital growth:\n\n1. **Social Media Management** (₹27,000/month): Includes 12 reels, 12 creative posters, daily story updates, event coverage, and content calendars.\n2. **15 Days Growth Package** (₹18,000): Includes 6 reels, 8 posters, daily stories, full account handling, and meta ads integration.\n\nWhich one fits your brand goals?";
      } else if (lastUserMessage.toLowerCase().includes("lead") || lastUserMessage.match(/[0-9]{10}/)) {
        responseText = "Brilliant! I have captured your contact request. Adhwaryu and our creative team will contact you soon on 9307643461. Let us craft designs that generate high impacts!";
      }
      
      return new Response(JSON.stringify({ text: responseText }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: `You are AB Assistant, the expert AI assistant of "AB Graphics", a professional agency specializing in Brand Identity, Graphic Design, Social Media Management, and Video Editing. Your purpose is to convert prospects into customers.

Owner: Adhwaryu Rajvaidya
Mobile Number: 9307643461 (Always show or refer to 9307643461 for WhatsApp/Calls)
Services we offer:
1. Social Media Posts (Modern visual posts, multi-slide carousels, custom-themed layouts)
2. Banner Design (Sleek professional digital headers, Youtube channels, Linkedin, company banners)
3. Visiting Card Design (Exquisite minimalist branding cards, mockups, corporate styles)
4. Video Editing (Dynamic Instagram/TikTok Reels, highlight cuts, synced captioning, smooth transitions)
5. Wedding Design (Luxury custom theme invitations, e-invitations, digital save-the-date cards)
6. Social Media Management (Content strategy, monthly planning calendars, caption creation, daily scheduling)
7. Meta Ads Setup (Instagram, Facebook target optimization, custom lookalike audience generation)
8. Lead Generation (High-performance lead forms, conversion funnel assets, dynamic lead capturing design)

Pricing Packages:
- Package 1: Social Media Management
  • Price: ₹27,000 / month
  • Scope: 12 Reels, 12 Creative Posters, Daily Stories, Event Coverage integration, Highlight Reels, Content calendars & strategy planning
- Package 2: 15 Days Growth Package
  • Price: ₹18,000 flat
  • Scope: 6 Reels, 8 Creative Posters, Daily Stories, Account profile Handling, Meta Ads optimization, Dynamic Lead Generation funnels

Goals:
1. Actively answer questions about our services, prices, capabilities, and packages.
2. Ask probing questions to understand their requirements (e.g. "Are you looking to scale your Instagram reels or do you want to run paid lead ads?").
3. Suggest the most suitable package based on their requirement:
   - If they want comprehensive ongoing growth, suggest Package 1 (₹27,000/month).
   - If they want quick acceleration and lead conversion, suggest Package 2 (15 Days Growth, ₹18,000).
4. Promptly try to capture their Name, Mobile Number, and Requirement.
5. Once they provide this contact info, acknowledge it with enthusiasm and MUST state exactly: "Our team will contact you soon." Wait, also inform them that they can call or WhatsApp Adhwaryu Rajvaidya directly at 9307643461.

Important Tone / Formats:
- Answer with vibrant, youthful, confident, and professional creative energy.
- Format pricing beautifully (e.g. ₹27,000/month) and keep details concise using bullet points.
- NEVER invent services outside our list. Be hyper-accurate.`,
        temperature: 0.7,
      },
    });

    return new Response(JSON.stringify({ text: response.text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Netlify Function Gemini Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to generate AI response." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
