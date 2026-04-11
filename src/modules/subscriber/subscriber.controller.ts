import { Request, Response } from "express";
import { subscriberService } from "./subscriber.service";

const subscribe = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) throw new Error("Email is required");
      const subscriber = await subscriberService.subscribe(email);
      res.status(201).json({
        success: true,
        message: "Subscribed successfully",
        data: subscriber,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to subscribe",
      });
    }
  }
  const getAllSubscribers = async (req: Request, res: Response) => {
    try {
      const subscribers = await subscriberService.getAllSubscribers();
      res.status(200).json({
        success: true,
        data: subscribers,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch subscribers",
      });
    }
  }
  const getStats = async (req: Request, res: Response) => {
    try {
      const stats = await subscriberService.getSubscriberStats();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
       res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch stats",
      });
    }
  }
  export const subscriberController = {
    subscribe,
    getAllSubscribers,
    getStats,
  };
