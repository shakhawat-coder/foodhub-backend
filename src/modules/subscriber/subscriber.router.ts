import { Router } from "express";
import { subscriberController } from "./subscriber.controller";

const router = Router();

router.post("/", subscriberController.subscribe);
router.get("/", subscriberController.getAllSubscribers);
router.get("/stats", subscriberController.getStats);

export const subscriberRouter = router;
