import express, { Router } from "express";
import { reviewController } from "./review.controller";
import auth, { UserRole } from "../../midddleware/auth.middleware";

const router = express.Router();

router.post("/", auth(UserRole.CUSTOMER), reviewController.createReview);
router.get("/:mealId", reviewController.getMealReviews);

export const reviewRouter: Router = router;
