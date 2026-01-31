import express, { Router } from "express";
import { providerController } from "./provider.controller";

const router = express.Router();

router.post("/", providerController.createProvider);
router.post("/sync/from-users", providerController.createProvidersFromUsers);
router.get("/", providerController.getAllProviders);
router.get("/:id", providerController.getProviderById);
router.put("/:id", providerController.updateProvider);
router.get("/email/:email", providerController.getProviderByEmail);
// router.delete("/:id", providerController.deleteProvider);

export const providerRouter: Router = router;
