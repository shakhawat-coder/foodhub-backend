import { Request, Response } from "express";
import { riderService } from "./rider.service";

const getAvailableOrders = async (req: Request, res: Response) => {
  try {
    const riderId = req.user?.riderId;
    const userId = req.user?.id;
    if (!riderId || !userId)
      return res.status(403).json({ error: "Rider profile not found" });

    const rider = await riderService.getRiderByUserId(userId);
    if (!rider || rider.status !== "APPROVED" || !rider.isAvailable) {
      return res
        .status(403)
        .json({ error: "Rider must be APPROVED and ONLINE" });
    }

    const orders = await riderService.getAvailableOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to get available orders" });
  }
};

const acceptOrder = async (req: Request, res: Response) => {
  try {
    const riderId = req.user?.riderId;
    const userId = req.user?.id;
    const { orderId } = req.params;
    if (!riderId || !userId)
      return res.status(403).json({ error: "Rider profile not found" });

    const rider = await riderService.getRiderByUserId(userId);
    if (!rider || rider.status !== "APPROVED" || !rider.isAvailable) {
      return res
        .status(403)
        .json({ error: "Rider must be APPROVED and ONLINE" });
    }

    const order = await riderService.acceptOrder(riderId, orderId);
    res.status(200).json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to accept order" });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const riderId = req.user?.riderId;
    const { id } = req.params;
    const { status } = req.body;

    if (!riderId)
      return res.status(403).json({ error: "Rider profile not found" });
    if (!["PICKED_UP", "ON_THE_WAY", "DELIVERED"].includes(status)) {
      return res.status(400).json({ error: "Invalid delivery status" });
    }

    const order = await riderService.updateOrderDeliveryStatus(
      riderId,
      id,
      status
    );
    res.status(200).json(order);
  } catch (error: any) {
    res
      .status(400)
      .json({ error: error.message || "Failed to update order status" });
  }
};

const toggleAvailability = async (req: Request, res: Response) => {
  try {
    const riderId = req.user?.riderId;
    const { isAvailable } = req.body;
    if (!riderId)
      return res.status(403).json({ error: "Rider profile not found" });
    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({ error: "isAvailable must be a boolean" });
    }
    const rider = await riderService.toggleAvailability(riderId, isAvailable);
    res.status(200).json(rider);
  } catch (error) {
    res.status(500).json({ error: "Failed to update rider availability" });
  }
};

const getHistory = async (req: Request, res: Response) => {
  try {
    const riderId = req.user?.riderId;
    if (!riderId)
      return res.status(403).json({ error: "Rider profile not found" });
    const history = await riderService.getHistory(riderId);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to get rider history" });
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    const riderId = req.user?.riderId;
    if (!riderId)
      return res.status(403).json({ error: "Rider profile not found" });

    const { phone, vehicleType, lat, lng } = req.body;
    const profile = await riderService.updateProfile(riderId, {
      phone,
      vehicleType,
      ...(lat !== undefined ? { lat: Number(lat) } : {}),
      ...(lng !== undefined ? { lng: Number(lng) } : {}),
    });
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: "Failed to update rider profile" });
  }
};

const getProfile = async (req: Request, res: Response) => {
  try {
    const riderId = req.user?.riderId;
    if (!riderId)
      return res.status(403).json({ error: "Rider profile not found" });
    const rider = await riderService.getRiderByUserId(req.user!.id);
    res.status(200).json(rider);
  } catch (error) {
    res.status(500).json({ error: "Failed to get rider profile" });
  }
};

const riderSignup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, vehicleType, address, image } =
      req.body;

    if (!name || !email || !password || !phone || !vehicleType) {
      return res.status(400).json({
        error: "name, email, password, phone and vehicleType are required",
      });
    }

    // Delegate user creation to better-auth, then create Rider profile as PENDING
    const response = await (
      await import("../../lib/auth")
    ).auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        role: "RIDER",
        phone,
        address,
        image,
      },
      headers: req.headers as any,
    } as any);

    const createdUserId = (response as any)?.user?.id;
    if (!createdUserId) {
      return res.status(400).json({ error: "Failed to create rider account" });
    }

    const rider = await riderService.createRiderProfile(
      createdUserId,
      phone,
      vehicleType
    );
    res
      .status(201)
      .json({ message: "Rider account created and pending approval", rider });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to sign up rider" });
  }
};

const getMyOrders = async (req: Request, res: Response) => {
  try {
    const riderId = req.user?.riderId;
    if (!riderId)
      return res.status(403).json({ error: "Rider profile not found" });
    const orders = await riderService.getMyAssignedOrders(riderId);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to get rider orders" });
  }
};

export const riderController = {
  getAvailableOrders,
  getMyOrders,
  getProfile,
  acceptOrder,
  updateOrderStatus,
  toggleAvailability,
  getHistory,
  updateProfile,
  riderSignup,
};
