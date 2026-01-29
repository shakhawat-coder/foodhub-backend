import { Request, Response } from "express";
import { mealService } from "./meal.service";

const createMeal = async (req: Request, res: Response) => {
  try {
    const { name, image, price, description, providerId, categoryId } =
      req.body;
    const meal = await mealService.createMeal({
      name,
      image,
      price,
      description,
      providerId,
      categoryId,
    });
    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({ error: "Failed to create meal" });
  }
};
const getAllMeals = async (req: Request, res: Response) => {
  try {
    const meals = await mealService.getAllMeals();
    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ error: "Failed to get meals" });
  }
};
const getMealById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const meal = await mealService.getsingleMeal(id as string);
    res.status(200).json(meal);
  } catch (error) {
    res.status(500).json({ error: "Failed to get meal" });
  }
};
const updateMeal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const meal = await mealService.updateMeal(id as string, req.body);
    res.status(200).json(meal);
  } catch (error) {
    res.status(500).json({ error: "Failed to update meal" });
  }
};
const deleteMealItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const meal = await mealService.deleteMeal(id as string);
    res.status(200).json({ meal, message: "Meal deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete meal" });
  }
};

export const mealController = {
  createMeal,
  getAllMeals,
  getMealById,
  updateMeal,
  deleteMealItem,
};
