import express, { Router } from "express";
import { providerController } from "./provider.controller";
import auth, { UserRole } from "../../midddleware/auth.middleware";

const router = express.Router();

router.post("/", providerController.createProvider);
router.post(
  "/sync/from-users",
  auth(UserRole.ADMIN),
  providerController.createProvidersFromUsers,
);
router.get("/", providerController.getAllProviders);
router.get("/:id", providerController.getProviderById);
router.put("/:id", providerController.updateProvider);
router.get("/email/:email", providerController.getProviderByEmail);

export const providerRouter: Router = router;
