import { cartController } from "./cart.controller";
import express, { Router } from "express";
const router = express.Router();

router.post("/", cartController.addToCart);
router.get("/:userId", cartController.getCart);
router.put("/update", cartController.updateCart);
router.post("/remove", cartController.removeFromCart);
router.post("/clear", cartController.clearCart);

export const cartRouter: Router = router;
