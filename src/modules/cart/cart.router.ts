import auth, { UserRole } from "../../midddleware/auth.middleware";
import { cartController } from "./cart.controller";
import express, { Router } from "express";
const router = express.Router();

router.post("/", auth(UserRole.CUSTOMER), cartController.addToCart);
router.get("/", auth(UserRole.CUSTOMER), cartController.getCart);
router.put("/update", auth(UserRole.CUSTOMER), cartController.updateCart);
router.post("/remove", auth(UserRole.CUSTOMER), cartController.removeFromCart);
router.post("/clear", auth(UserRole.CUSTOMER), cartController.clearCart);

export const cartRouter: Router = router;
