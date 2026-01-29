import express, { Router } from 'express';
import { mealController } from './meal.controller';

const router = express.Router();

router.post("/", mealController.createMeal);
router.get("/", mealController.getAllMeals);
router.get("/:id", mealController.getMealById);
router.put("/:id", mealController.updateMeal);
router.delete("/:id", mealController.deleteMealItem);


export const mealRouter: Router = router;