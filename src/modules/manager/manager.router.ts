import express, { Router } from "express";
import auth, { UserRole } from "../../midddleware/auth.middleware";
import { managerController } from "./manager.controller";

const router = express.Router();

router.get(
  "/orders",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  managerController.getOrders
);
router.get(
  "/riders",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  managerController.getRiders
);
router.patch(
  "/rider/:id/status",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  managerController.updateRiderStatus
);
router.post(
  "/assign-rider",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  managerController.assignRider
);
router.get(
  "/reports",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  managerController.getReports
);
router.post("/create", auth(UserRole.ADMIN), managerController.createManager);

export const managerRouter: Router = router;
