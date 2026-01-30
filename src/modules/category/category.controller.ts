import { Request, Response } from "express";
import { categoryService } from "./category.service";

const createCategory = async (req: Request, res: Response) => {
    try {
        const category = await categoryService.createCategory(req.body.name, req.body.image)
        res.status(201).json(category)

    } catch (error) {
        res.status(500).json({ error: "Failed to create category" });
    }
};
const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.getAllCategories()
        res.status(200).json(categories)
    } catch (error) {
        res.status(500).json({ error: "Failed to get categories" });
    }
};
const getCategoryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const category = await categoryService.getsingleCategory(id as string)
        res.status(200).json(category)
    } catch (error) {
        res.status(500).json({ error: "Failed to get category" });
    }
};
const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const category = await categoryService.updateCategory(id as string, req.body)
        res.status(200).json(category)
    } catch (error) {
        res.status(500).json({ error: "Failed to update category" });
    }
};
const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const category = await categoryService.deleteCategory(id as string)
        res.status(200).json(category)
    } catch (error) {
        res.status(500).json({ error: "Failed to delete category" });
    }
};

export const categoryController = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};

