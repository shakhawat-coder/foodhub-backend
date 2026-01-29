import { prisma } from "../../lib/prisma";

type CreateMealInput = {
  name: string;
  image?: string;
  price: number;
  description: string;
  providerId: string;
  categoryId: string;
};

const createMeal = async (input: CreateMealInput) => {
  const meal = await prisma.meal.create({
    data: input,
  });
  return meal;
};

const getAllMeals = async () => {
  const meals = await prisma.meal.findMany({ include: { category: true } });
  return meals;
};

const getsingleMeal = async (id: string) => {
  const meal = await prisma.meal.findUnique({
    where: { id },
    include: { category: true },
  });
  return meal;
};

const updateMeal = async (id: string, data: Partial<CreateMealInput>) => {
  const meal = await prisma.meal.update({ where: { id }, data });
  return meal;
};
const deleteMeal = async (id: string) => {
  const meal = await prisma.meal.delete({ where: { id } });
  return meal;
};

export const mealService = {
  createMeal,
  getAllMeals,
  getsingleMeal,
  updateMeal,
  deleteMeal,
};
