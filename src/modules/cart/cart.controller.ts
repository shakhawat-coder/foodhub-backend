import { Request, Response } from "express"
import * as cartService from "./cart.service"

const addToCart = async (req: Request, res: Response) => {}
const removeFromCart = async (req: Request, res: Response) => {}
const clearCart = async (req: Request, res: Response) => {}
const getCart = async (req: Request, res: Response) => {}
const updateCart = async (req: Request, res: Response) => {}


export const cartController = {
    addToCart, 
    removeFromCart, 
    clearCart, 
    getCart,
    updateCart
} 