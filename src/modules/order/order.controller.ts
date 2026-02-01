import { Request, Response } from "express";
import { orderService } from "./order.service";

const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const order = await orderService.createOrder({ ...req.body, userId });
        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create order" });
    }
};

const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await orderService.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: "Failed to get orders" });
    }
};

const getProviderOrders = async (req: Request, res: Response) => {
    try {
        const providerId = req.user?.providerId;
        const type = req.query.type as string | undefined;

        if (!providerId) {
            return res.status(403).json({ error: "Provider profile not found Pleases Contact Admin" });
        }
        const orders = await orderService.getProviderOrders(providerId, type);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: "Failed to get provider orders" });
    }
};

const getUserOrders = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const orders = await orderService.getUserOrders(userId);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: "Failed to get user orders" });
    }
};

const getOrderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = req.user;

        if (!id) {
            return res.status(400).json({ error: "Order ID is required" });
        }

        const order = await orderService.getOrderById(id as string);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        // --- OWNERSHIP CHECK ---
        const isCustomer = user?.role === "USER" && order.userId === user.id;
        const isAdmin = user?.role === "ADMIN";
        const isProviderOfThisOrder = user?.role === "PROVIDER" &&
            order.items.some((item: any) => item.providerId === user.providerId);

        if (!isCustomer && !isAdmin && !isProviderOfThisOrder) {
            return res.status(403).json({ error: "Access denied. You do not have permission to view this order." });
        }
        // -----------------------

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get order" });
    }
};

const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const user = req.user;

        if (!id || typeof id !== "string") {
            return res.status(400).json({ error: "Order ID is required" });
        }

        const existingOrder = await orderService.getOrderById(id);
        if (!existingOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (user?.role === "USER") {
            if (existingOrder.userId !== user.id) {
                return res.status(403).json({ error: "You can only update your own orders." });
            }

            if (status !== "CANCELLED") { 
                return res.status(403).json({ error: "You only have permission to cancel your order." });
            }

            const restrictStatus = ["OUT_FOR_DELIVERY", "DELIVERED"];
            if (restrictStatus.includes(existingOrder.status)) {
                return res.status(403).json({ error: `Cannot cancel order. It is already ${existingOrder.status.toLowerCase().replace(/_/g, ' ')}.` });
            }
        }

        const order = await orderService.updateOrderStatus(id as string, status);
        res.status(200).json(order);
    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ error: "Failed to update order status" });
    }
};

export const orderController = {
    createOrder,
    getAllOrders,
    getProviderOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
};
