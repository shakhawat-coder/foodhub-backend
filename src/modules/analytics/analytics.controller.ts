import { Request, Response } from "express";
import { getAdminAnalytics, getProviderAnalytics } from "./analytics.service";

const getAdmin = async (req: Request, res: Response) => {
  try {
    const days = Number(req.query.days ?? 7);
    const data = await getAdminAnalytics(Number.isFinite(days) ? days : 7);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to load admin analytics" });
  }
};

const getProvider = async (req: Request, res: Response) => {
  try {
    const providerId = req.user?.providerId;
    if (!providerId) {
      return res.status(403).json({ error: "Provider profile not found" });
    }
    const days = Number(req.query.days ?? 7);
    const data = await getProviderAnalytics(
      providerId,
      Number.isFinite(days) ? days : 7
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to load provider analytics" });
  }
};

export const analyticsController = {
  getAdmin,
  getProvider,
};
