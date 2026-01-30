import express, { Router } from 'express';
import { orderController } from './order.controller';
import auth, { UserRole } from '../../midddleware/auth.middleware';

const router = express.Router();

router.post("/", auth(UserRole.USER), orderController.createOrder);
router.get("/", auth(UserRole.ADMIN), orderController.getAllOrders);
router.get("/provider", auth(UserRole.PROVIDER), orderController.getProviderOrders);
router.get("/user", auth(UserRole.USER), orderController.getUserOrders);
router.get("/:id", auth(UserRole.USER, UserRole.PROVIDER, UserRole.ADMIN), orderController.getOrderById);
router.put("/status/:id", auth(UserRole.PROVIDER, UserRole.ADMIN), orderController.updateOrderStatus);

export const orderRouter: Router = router;
