import express, { Router } from "express";
import auth, { UserRole } from "../../midddleware/auth.middleware";
import { analyticsController } from "./analytics.controller";

const router = express.Router();

router.get(
  "/admin",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  analyticsController.getAdmin
);
router.get("/provider", auth(UserRole.PROVIDER), analyticsController.getProvider);
router.get("/public", analyticsController.getPublic);

export const analyticsRouter: Router = router;
