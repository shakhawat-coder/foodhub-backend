import express, { Router } from 'express';
import { mealController } from './meal.controller';
import auth, { UserRole } from '../../midddleware/auth.middleware';

const router = express.Router();

router.post("/", auth(UserRole.PROVIDER), mealController.createMeal);
router.get("/", mealController.getAllMeals);
router.get("/:id", mealController.getMealById);
router.put("/update/:id", auth(UserRole.PROVIDER), mealController.updateMeal);
router.delete("/delete/:id", auth(UserRole.PROVIDER), mealController.deleteMealItem);


export const mealRouter: Router = router;