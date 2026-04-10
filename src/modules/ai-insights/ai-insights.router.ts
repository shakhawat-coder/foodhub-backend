import express, { Router } from "express";
import auth, { UserRole } from "../../midddleware/auth.middleware";
import { aiInsightsController } from "./ai-insights.controller";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.MANAGER, UserRole.PROVIDER),
  aiInsightsController.createInsights
);

export const aiInsightsRouter: Router = router;
