import { Request, Response } from "express";
import { cartService } from "./cart.service";

const addToCart = async (req: Request, res: Response) => {
  try {
    const { userId, mealId, quantity } = req.body;
    const cart = await cartService.addToCart(userId, { mealId, quantity });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to add to cart" });
  }
};
const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { userId, mealId } = req.body;
    await cartService.removeFromCart(userId, mealId);
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
};

const clearCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    await cartService.clearCart(userId);
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear cart" });
  }
};

const getCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const cart = await cartService.getCart(userId as string);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to get cart" });
  }
};

const updateCart = async (req: Request, res: Response) => {
  try {
    const { userId, mealId, quantity } = req.body;
    const cart = await cartService.updateCart(userId, { mealId, quantity });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart" });
  }
};

export const cartController = {
  addToCart,
  removeFromCart,
  clearCart,
  getCart,
  updateCart,
};
