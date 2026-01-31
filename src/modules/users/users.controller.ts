import { Request, Response } from "express";
import { userServices } from "./users.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userServices.getAllUsers();
    res.status(200).json({ message: "Get all users", data: users });
  } catch (error) {
    res.status(500).json({ error: "Failed to get users" });
  }
};
export const userController = {
  getAllUsers,
};
