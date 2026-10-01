import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const PORT = 3000;

// Lazy initialization of Gemini client as per guidelines
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));
  app.use(express.static(path.join(process.cwd(), "public")));

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "CarbonLens API",
      timestamp: new Date().toISOString(),
      aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // AI Sustainability Advisor Recommendations Endpoint
  app.post("/api/ai/recommendations", async (req, res) => {
    try {
      const {
        businessName = "Business",
        industry = "Food & Beverage",
        totalEmissions = 128.6,
        scope1 = 31.4,
        scope2 = 54.7,
        scope3 = 42.5,
        targetReduction = 30,
        hotspots = ["Electricity", "Fuel", "Business Travel"],
      } = req.body;

      const ai = getAIClient();

      if (!ai) {
        // Deterministic heuristic fallback when GEMINI_API_KEY is not configured
        return res.json({
          source: "heuristic",
          recommendations: getFallbackRecommendations(industry, {
            totalEmissions,
            scope1,
            scope2,
            scope3,
            targetReduction,
          }),
        });
      }

      const prompt = `You are a certified sustainability & carbon accounting advisor for SMEs using the CarbonLens platform.
Provide 4 highly actionable, practical, and grounded carbon reduction recommendations for the following business.
CRITICAL RULE: Do NOT invent fake precision percentages (like "reduces footprint by exactly 14.3%") unless derived from raw inputs.
Evaluate realistic SME operational levers.

Company Profile:
- Name: ${businessName}
- Industry: ${industry}
- Total Annual Footprint: ${totalEmissions} tCO2e
- Scope 1 (Direct fuel/vehicles): ${scope1} tCO2e
- Scope 2 (Purchased electricity/heat): ${scope2} tCO2e
- Scope 3 (Supply chain & travel): ${scope3} tCO2e
- Target Reduction: ${targetReduction}%
- Top Hotspots: ${hotspots.join(", ")}

Respond with STRICT JSON format matching this structure:
{
  "summary": "Concise 2-sentence assessment of the emission profile and highest ROI decarbonization opportunities.",
  "recommendations": [
    {
      "id": "rec-1",
      "title": "Action title",
      "scope": "Scope 2",
      "category": "Electricity",
      "impact": "High" | "Medium" | "Potentially meaningful",
      "effort": "Low" | "Medium" | "High",
      "priority": "High" | "Medium" | "Quick Win",
      "timeframe": "1-3 months",
      "description": "Why this matters for this SME.",
      "suggestedActions": [
        "Action step 1",
        "Action step 2",
        "Action step 3"
      ],
      "estimatedPayback": "e.g. 6-12 months or Immediate"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const responseText = response.text?.trim() || "{}";
      const parsed = JSON.parse(responseText);
      res.json({
        source: "gemini-3.8-flash",
        summary: parsed.summary,
        recommendations: parsed.recommendations || [],
      });
    } catch (error: any) {
      console.warn("AI recommendation generation error:", error.message);
      // Seamless fallback to heuristic advisor
      const fallback = getFallbackRecommendations(req.body?.industry, req.body);
      res.json({
        source: "heuristic_fallback",
        recommendations: fallback,
      });
    }
  });

  // AI Interactive Copilot Chat Endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { prompt, businessProfile, inventoryMetrics } = req.body;
      const ai = getAIClient();

      if (!ai) {
        return res.json({
          reply: `For ${businessProfile?.name || "your business"} (total: ${inventoryMetrics?.totalEmissionsTonne?.toFixed(1) || "128.6"} tCO₂e), focusing on Scope 2 electricity reduction via rooftop solar or green tariffs yields the fastest financial payback (~2.5 years). In addition, conducting vehicle route optimization for your logistics fleet will trim operational diesel expenses immediately.`,
        });
      }

      const systemInstruction = `You are CarbonLens AI, an expert SME carbon accounting and sustainability advisor.
You help small and medium business owners, CFOs, and sustainability managers understand their GHG footprint and navigate customer ESG questionnaires.
Business Profile: ${businessProfile?.name || "GreenBrew Foods"} (${businessProfile?.industry || "Food & Beverage"}, ${businessProfile?.employees || 48} employees in ${businessProfile?.city || "Bengaluru"}, ${businessProfile?.country || "India"}).
Current Baseline Inventory:
- Total Footprint: ${inventoryMetrics?.totalEmissionsTonne?.toFixed(1) || 128.6} tCO2e
- Scope 1: ${inventoryMetrics?.scope1Tonne?.toFixed(1) || 31.4} tCO2e (direct fuel/gas)
- Scope 2: ${inventoryMetrics?.scope2Tonne?.toFixed(1) || 54.7} tCO2e (electricity)
- Scope 3: ${inventoryMetrics?.scope3Tonne?.toFixed(1) || 42.5} tCO2e (supply chain/waste)
Keep answers clear, highly grounded, practical for an SME (avoid unfeasible multi-million dollar tech), concise (2-3 short paragraphs max), and encouraging.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `${systemInstruction}\n\nUser Question: ${prompt}`,
      });

      res.json({ reply: response.text?.trim() });
    } catch (error: any) {
      console.warn("AI chat error:", error.message);
      res.json({
        reply: "To reduce your operational footprint effectively, begin with an energy audit of high-draw machinery and explore renewable power procurement tariffs with your utility provider.",
      });
    }
  });

  // AI Narrative Report Generator Endpoint
  app.post("/api/ai/report-narrative", async (req, res) => {
    try {
      const { businessName, industry, reportingYear, totalEmissions, scopeBreakdown } = req.body;
      const ai = getAIClient();

      if (!ai) {
        return res.json({
          narrative: `During the ${reportingYear || 2026} reporting cycle, ${businessName || "the organization"} accounted for an estimated total of ${totalEmissions || "128.6"} tCO₂e across operations. Scope 2 emissions from purchased electricity represent the largest operational exposure, followed by Scope 3 supply chain inputs and Scope 1 direct fuel usage. Systematic initiatives focusing on facility energy management and fleet efficiency present immediate pathways toward the stated reduction targets.`,
        });
      }

      const prompt = `Write a formal, objective, 2-paragraph Executive Sustainability Narrative for an SME ESG Carbon Report.
Company: ${businessName} (${industry})
Year: ${reportingYear || 2026}
Total: ${totalEmissions} tCO2e
Breakdown: Scope 1: ${scopeBreakdown?.scope1 || 31.4} tCO2e, Scope 2: ${scopeBreakdown?.scope2 || 54.7} tCO2e, Scope 3: ${scopeBreakdown?.scope3 || 42.5} tCO2e.
Tone: Professional, measured, GHG Protocol aligned, zero marketing fluff or unverified claims.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      res.json({ narrative: response.text?.trim() });
    } catch (err: any) {
      res.json({
        narrative: `During the reporting cycle, ${req.body?.businessName || "the organization"} accounted for an aggregate footprint of ${req.body?.totalEmissions || "128.6"} tCO₂e. Ongoing monitoring under GHG Protocol guidance highlights electricity and operational fuel usage as prime opportunities for resource optimization.`,
      });
    }
  });

  // Vite middleware setup (development only)
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CarbonLens server running on http://localhost:${PORT}`);
  });
}

function getFallbackRecommendations(industry = "Food & Beverage", stats: any) {
  return [
    {
      id: "rec-1",
      title: "Transition to Renewable Energy Tariff (EACs/PPA)",
      scope: "Scope 2",
      category: "Purchased Electricity",
      impact: "High",
      effort: "Low",
      priority: "Quick Win",
      timeframe: "1-2 months",
      description:
        "Electricity accounts for over 40% of your reported emissions. Switching to a certified green energy tariff or purchasing Energy Attribute Certificates directly addresses Scope 2 market-based emissions.",
      suggestedActions: [
        "Audit existing utility contract for green power rider availability",
        "Request quotes for 100% renewable supply from local energy suppliers",
        "Record verified Guarantees of Origin (GoO) or RECs in the Scope 2 ledger",
      ],
      estimatedPayback: "Immediate to negligible cost delta",
    },
    {
      id: "rec-2",
      title: "Commercial Refrigeration & Heat Recovery Audit",
      scope: "Scope 1",
      category: "Refrigerants & Heating",
      impact: "High",
      effort: "Medium",
      priority: "High",
      timeframe: "3-6 months",
      description:
        "Fugitive refrigerant leaks and natural gas boilers contribute substantially to Scope 1 direct emissions. Preventive maintenance reduces operational expenses while curtailing high-GWP gases.",
      suggestedActions: [
        "Schedule biannual leak detection for walk-in coolers and chillers",
        "Inspect boiler burner efficiency and tune air-fuel ratio",
        "Evaluate replacing legacy R-404A with low-GWP natural refrigerants during equipment refresh",
      ],
      estimatedPayback: "4-9 months",
    },
    {
      id: "rec-3",
      title: "Consolidate Logistics & Fleet Route Optimization",
      scope: "Scope 1 & 3",
      category: "Company Vehicles & Freight",
      impact: "Medium",
      effort: "Medium",
      priority: "Medium",
      timeframe: "2-4 months",
      description:
        "Diesel and petrol usage from distribution vans can be cut by 10-15% through computerized route planning, payload optimization, and driver eco-coaching.",
      suggestedActions: [
        "Deploy route scheduling to avoid high-congestion windows",
        "Batch supplier pickups to maximize freight fill-rate",
        "Implement tire pressure monitoring schedules across all company vehicles",
      ],
      estimatedPayback: "2-5 months",
    },
    {
      id: "rec-4",
      title: "Sustainable Packaging & Supplier Engagement",
      scope: "Scope 3",
      category: "Purchased Goods & Services",
      impact: "Potentially meaningful",
      effort: "High",
      priority: "Medium",
      timeframe: "6-12 months",
      description:
        "Upstream raw materials and packaging represent embodied carbon in Scope 3 Category 1. Requesting environmental product declarations (EPDs) encourages supply chain decarbonization.",
      suggestedActions: [
        "Send carbon disclosure questionnaires to top 5 suppliers by spend",
        "Test recycled corrugated cardboard and lightweight glass or tin containers",
        "Partner with regional producers to minimize long-distance inbound freight",
      ],
      estimatedPayback: "Long-term brand equity & customer compliance",
    },
  ];
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
