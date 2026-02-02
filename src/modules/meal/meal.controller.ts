import { Request, Response } from "express";
import { mealService } from "./meal.service";

const createMeal = async (req: Request, res: Response) => {
  try {
    const providerId = req.user?.providerId;
    if (!providerId) {
      return res.status(403).json({ error: "Provider profile not found Pleases Contact Admin" });
    }

    const { price, isPopular, ...rest } = req.body;

    const mealData = {
      ...rest,
      price: price ? parseFloat(price) : 0,
      isPopular: isPopular === true || isPopular === "true",
      providerId,
    };

    const meal = await mealService.createMeal(mealData);
    res.status(201).json(meal);
  } catch (error: any) {
    console.error("Create Meal Error:", error);
    res.status(500).json({ error: error.message || "Failed to create meal" });
  }
};

const getAllMeals = async (req: Request, res: Response) => {
  try {
    const { providerId, providerEmail } = req.query;
    const meals = await mealService.getAllMeals(
      providerId as string,
      providerEmail as string
    );
    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ error: "Failed to get meals" });
  }
};

const getMealById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Meal ID is required" });
    }
    const meal = await mealService.getsingleMeal(id);
    res.status(200).json(meal);
  } catch (error) {
    res.status(500).json({ error: "Failed to get meal" });
  }
};

const updateMeal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Meal ID is required" });
    }

    const { price, isPopular, ...rest } = req.body;

    const updateData: any = { ...rest };
    if (price !== undefined) {
      updateData.price = typeof price === "string" ? parseFloat(price) : price;
    }
    if (isPopular !== undefined) {
      updateData.isPopular = isPopular === true || isPopular === "true";
    }

    const meal = await mealService.updateMeal(id, updateData);
    res.status(200).json(meal);
  } catch (error) {
    console.error("Update Meal Error:", error);
    res.status(500).json({ error: "Failed to update meal" });
  }
};

const deleteMealItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const providerId = req.user?.providerId;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Meal ID is required" });
    }

    if (!providerId) {
      return res.status(403).json({ error: "Provider profile not found. Please contact admin" });
    }

    // Check if the meal belongs to this provider
    const existingMeal = await mealService.getsingleMeal(id);
    if (!existingMeal) {
      return res.status(404).json({ error: "Meal not found." });
    }

    if (existingMeal.providerId !== providerId) {
      return res.status(403).json({ error: "You are not authorized to delete this meal." });
    }

    const meal = await mealService.deleteMeal(id);
    res.status(200).json({ meal, message: "Meal deleted successfully" });
  } catch (error) {
    console.error("Delete Meal Error:", error);
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
