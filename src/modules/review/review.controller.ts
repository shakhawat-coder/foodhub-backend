import { Request, Response } from "express";
import { reviewService } from "./review.service";

const createReview = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const { rating, comment, mealId } = req.body;

        if (!rating || !mealId) {
            return res.status(400).json({ error: "Rating and Meal ID are required" });
        }

        const review = await reviewService.createReview({
            rating: Number(rating),
            comment: comment || "",
            userId,
            mealId,
        });

        res.status(201).json(review);
    } catch (error: any) {
        console.error("Create Review Error:", error);
        res.status(500).json({ error: error.message || "Failed to create review" });
    }
};

const getMealReviews = async (req: Request, res: Response) => {
    try {
        const { mealId } = req.params;
        if (!mealId) {
            return res.status(400).json({ error: "Meal ID is required" });
        }

        const reviews = await reviewService.getMealReviews(mealId as string);
        res.status(200).json(reviews);
    } catch (error: any) {
        console.error("Get Reviews Error:", error);
        res.status(500).json({ error: "Failed to get reviews" });
    }
};

export const reviewController = {
    createReview,
    getMealReviews,
};
