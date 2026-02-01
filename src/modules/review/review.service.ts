import { prisma } from "../../lib/prisma";

const createReview = async (data: {
    rating: number;
    comment: string;
    userId: string;
    mealId: string;
}) => {
    return await prisma.review.create({
        data,
        include: {
            user: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
    });
};

const getMealReviews = async (mealId: string) => {
    return await prisma.review.findMany({
        where: { mealId },
        include: {
            user: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const reviewService = {
    createReview,
    getMealReviews,
};
