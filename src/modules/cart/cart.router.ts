import { cartController } from "./cart.controller";
import express, { Router } from 'express';
const router = express.Router();

router.post("/", cartController.addToCart);
router.get("/", cartController.getCart);
router.delete("/clear", cartController.clearCart);
router.put("/:id", cartController.updateCart);
router.delete("/:id", cartController.removeFromCart);


export const cartRouter: Router = router;