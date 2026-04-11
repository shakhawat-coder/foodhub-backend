import express, { Router } from "express";
import auth, { UserRole } from "../../midddleware/auth.middleware";
import { riderController } from "./rider.controller";

const router = express.Router();

router.get(
  "/available-orders",
  auth(UserRole.RIDER),
  riderController.getAvailableOrders
);
router.get("/my-orders", auth(UserRole.RIDER), riderController.getMyOrders);
router.post(
  "/accept-order/:orderId",
  auth(UserRole.RIDER),
  riderController.acceptOrder
);
router.patch(
  "/order/:id/status",
  auth(UserRole.RIDER),
  riderController.updateOrderStatus
);
router.patch(
  "/availability",
  auth(UserRole.RIDER),
  riderController.toggleAvailability
);
router.get("/history", auth(UserRole.RIDER), riderController.getHistory);
router.get("/profile", auth(UserRole.RIDER), riderController.getProfile);
router.patch("/profile", auth(UserRole.RIDER), riderController.updateProfile);

export const riderRouter: Router = router;
