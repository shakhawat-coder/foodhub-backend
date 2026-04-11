import express, { Router } from "express";
import auth, { UserRole } from "../../midddleware/auth.middleware";
import { couponController } from "./coupon.controller";

const router = express.Router();

router.get("/active", couponController.getAllActiveCoupons);
router.post("/collect", auth(UserRole.CUSTOMER), couponController.collectCoupon);
router.get("/my", auth(UserRole.CUSTOMER), couponController.getUserCoupons);

// Manager Routes
router.get("/", auth(UserRole.MANAGER), couponController.getAllCoupons);
router.post("/", auth(UserRole.MANAGER), couponController.createCoupon);
router.put("/:id", auth(UserRole.MANAGER), couponController.updateCoupon);
router.delete("/:id", auth(UserRole.MANAGER), couponController.deleteCoupon);

export const couponRouter: Router = router;
