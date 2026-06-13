import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory array to store captured leads/inquiries
const inquiries: Array<{
  id: string;
  name: string;
  mobile: string;
  requirement: string;
  source: string; // "form" or "chat"
  createdAt: string;
}> = [];

// Initialize GoogleGenAI SDK safely
const getGeminiClient = (): GoogleGenAI => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Chatbot will run in fallback simulation mode.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "MOCK_KEY",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API: Submit a standard contact/quote inquiry
app.post("/api/inquiry", (req, res) => {
  try {
    const { name, mobile, requirement, source = "form" } = req.body;
    if (!name || !mobile || !requirement) {
      return res.status(400).json({ error: "Name, mobile, and requirement are required." });
    }

    const newInquiry = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      mobile,
      requirement,
      source,
      createdAt: new Date().toISOString(),
    };

    inquiries.push(newInquiry);
    console.log("New Inquiry Received:", newInquiry);

    return res.status(200).json({
      success: true,
      message: "Our team will contact you soon.",
      inquiry: newInquiry,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to submit inquiry." });
  }
});

// API: Get inquiries (for dashboard/owner visibility)
app.get("/api/inquiries", (req, res) => {
  res.json(inquiries);
});

// API: AI Chatbot Assistant (serviced by Gemini 3.5 Flash)
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body; // Array of { role: "user" | "model", text: string }

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages parameter." });
  }

  // Fallback if API key is not ready yet
  if (!process.env.GEMINI_API_KEY) {
    const lastUserMessage = messages[messages.length - 1]?.text || "";
    let responseText = "Hi there! I am AB Assistant. Adhwaryu's AB Graphics provides high-quality graphics and video services. Please define your requirement and leave your mobile number so our team can contact you soon!";
    
    if (lastUserMessage.toLowerCase().includes("package")) {
      responseText = "We have two premium action packages for your digital growth:\n\n1. **Social Media Management** (₹27,000/month): Includes 12 reels, 12 creative posters, daily story updates, event coverage, and content calendars.\n2. **15 Days Growth Package** (₹18,000): Includes 6 reels, 8 posters, daily stories, full account handling, and meta ads integration.\n\nWhich one fits your brand goals?";
    } else if (lastUserMessage.toLowerCase().includes("lead") || lastUserMessage.match(/[0-9]{10}/)) {
      responseText = "Brilliant! I have captured your contact request. Adhwaryu and our creative team will contact you soon on 9307643461. Let us craft designs that generate high impacts!";
    }
    
    return res.json({ text: responseText });
  }

  try {
    const ai = getGeminiClient();

    // Compile chat history into contents format matches GenAI guidelines
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: `You are AB Assistant, the expert AI assistant of "AB Graphics", a professional agency specializing in Brand Identity, Graphic Design, Social Media Management, and Video Editing. Your purpose is to convert prospects into customers.

Contact Number: 9307643461
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

    return res.json({ text: response.text });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    return res.status(500).json({ error: err.message || "Failed to generate AI response." });
  }
});

// Configure Vite integration for dev and static serve for prod
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AB Graphics Server] Running on http://0.0.0.0:${PORT} under NODE_ENV=${process.env.NODE_ENV}`);
  });
}

start();
