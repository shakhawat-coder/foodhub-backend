import { Request, Response } from "express";
import { managerService } from "./manager.service";

const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await managerService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to get orders" });
  }
};

const getRiders = async (req: Request, res: Response) => {
  try {
    const riders = await managerService.getAllRiders();
    res.status(200).json(riders);
  } catch (error) {
    res.status(500).json({ error: "Failed to get riders" });
  }
};

const updateRiderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["PENDING", "APPROVED", "BLOCKED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid rider status" });
    }
    const rider = await managerService.updateRiderStatus(id, status);
    res.status(200).json(rider);
  } catch (error: any) {
    res
      .status(400)
      .json({ error: error.message || "Failed to update rider status" });
  }
};

const assignRider = async (req: Request, res: Response) => {
  try {
    const { orderId, riderId } = req.body;
    if (!orderId || !riderId) {
      return res
        .status(400)
        .json({ error: "orderId and riderId are required" });
    }
    const order = await managerService.assignRider(orderId, riderId);
    res.status(200).json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to assign rider" });
  }
};

const getReports = async (req: Request, res: Response) => {
  try {
    const reports = await managerService.getReports();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: "Failed to get reports" });
  }
};

const createManager = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, address, image } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "name, email and password are required" });
    }
    const manager = await managerService.createManager({
      name,
      email,
      password,
      phone,
      address,
      image,
    });
    res.status(201).json(manager);
  } catch (error: any) {
    res
      .status(400)
      .json({ error: error.message || "Failed to create manager" });
  }
};

export const managerController = {
  getOrders,
  getRiders,
  updateRiderStatus,
  assignRider,
  getReports,
  createManager,
};
