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

const getTestimonials = async () => {
    return await prisma.review.findMany({
        where: {
            rating: {
                gte: 4.5, 
            },
        },
        take: 5,
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

export const reviewService = {
    createReview,
    getMealReviews,
    getTestimonials,
};
