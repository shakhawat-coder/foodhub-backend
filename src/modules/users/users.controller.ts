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

const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userServices.toggleUserStatus(id as string);
    res.status(200).json({ message: "User status updated", data: user });
  } catch (error) {
    console.error("Error in toggleUserStatus:", error);
    res.status(500).json({ error: "Failed to update user status" });
  }
};

const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, image } = req.body;

    const user = await userServices.updateUserProfile(id as string, {
      name,
      email,
      phone,
      address,
      image
    });

    res.status(200).json({ message: "Profile updated successfully", data: user });
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const userController = {
  getAllUsers,
  toggleUserStatus,
  updateUserProfile
};
