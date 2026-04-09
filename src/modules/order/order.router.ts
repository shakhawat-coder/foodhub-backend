import express, { Router } from "express";
import { orderController } from "./order.controller";
import auth, { UserRole } from "../../midddleware/auth.middleware";

const router = express.Router();

router.post("/", auth(UserRole.CUSTOMER), orderController.createOrder);
router.get("/", auth(UserRole.ADMIN), orderController.getAllOrders);
router.get(
  "/provider",
  auth(UserRole.PROVIDER),
  orderController.getProviderOrders
);
router.get("/user", auth(UserRole.CUSTOMER), orderController.getUserOrders);
router.get(
  "/:id",
  auth(
    UserRole.CUSTOMER,
    UserRole.PROVIDER,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.RIDER
  ),
  orderController.getOrderById
);
router.put(
  "/status/:id",
  auth(UserRole.CUSTOMER, UserRole.PROVIDER, UserRole.ADMIN, UserRole.MANAGER),
  orderController.updateOrderStatus
);

export const orderRouter: Router = router;
