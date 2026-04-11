import { Request, Response } from "express";
import { couponService } from "./coupon.service";

const getAllActiveCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await couponService.getAllActiveCoupons();
    res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch coupons",
    });
  }
};

const collectCoupon = async (req: Request, res: Response) => {
  try {
    const { couponId } = req.body;
    const userId = (req as any).user.id;
    if (!couponId) throw new Error("Coupon ID is required");

    const result = await couponService.collectCoupon(userId, couponId);
    res.status(201).json({
      success: true,
      message: "Coupon collected successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to collect coupon",
    });
  }
};

const getUserCoupons = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const coupons = await couponService.getUserCoupons(userId);
    res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user coupons",
    });
  }
};

const getAllCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await couponService.getAllCoupons();
    res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch coupons",
    });
  }
};

const createCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await couponService.createCoupon(req.body);
    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create coupon",
    });
  }
};

const updateCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const coupon = await couponService.updateCoupon(id as string, req.body);
    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: coupon,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update coupon",
    });
  }
};

const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await couponService.deleteCoupon(id as string);
    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete coupon",
    });
  }
};

export const couponController = {
  getAllActiveCoupons,
  collectCoupon,
  getUserCoupons,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
