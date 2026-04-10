import { Request, Response } from "express";
import { createAiInsights } from "./ai-insights.service";

const createInsights = async (req: Request, res: Response) => {
  try {
    const { analyticsData, role } = req.body as {
      analyticsData?: unknown;
      role?: "ADMIN" | "PROVIDER";
    };
    if (!analyticsData) {
      return res.status(400).json({ error: "analyticsData is required" });
    }
    const safeRole = role === "PROVIDER" ? "PROVIDER" : "ADMIN";
    const insights = await createAiInsights(analyticsData, safeRole);
    res.status(200).json({ insights });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Failed to generate AI insights" });
  }
};

export const aiInsightsController = {
  createInsights,
};
