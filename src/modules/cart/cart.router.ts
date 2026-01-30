import auth, { UserRole } from "../../midddleware/auth.middleware";
import { cartController } from "./cart.controller";
import express, { Router } from "express";
const router = express.Router();

router.post("/", auth(UserRole.USER), cartController.addToCart);
router.get("/", auth(UserRole.USER), cartController.getCart);
router.put("/update", auth(UserRole.USER), cartController.updateCart);
router.post("/remove", auth(UserRole.USER), cartController.removeFromCart);
router.post("/clear", auth(UserRole.USER), cartController.clearCart);

export const cartRouter: Router = router;
