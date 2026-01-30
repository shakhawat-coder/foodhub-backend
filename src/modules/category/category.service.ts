import { prisma } from "../../lib/prisma"



const createCategory = async (name: string, image: string) => {
    const category = await prisma.category.create({
        data: { name, image }
    })
    return category
}
const getAllCategories = async () => {
    const categories = await prisma.category.findMany({ include: { meals: true } })
    return categories
}
const getsingleCategory = async (id: string) => {
    const category = await prisma.category.findUnique({
        where: { id },
        include: { meals: true }
    })
    return category
}
const updateCategory = async (id: string, data: { name?: string; image?: string; isActive?: boolean }) => {
    const category = await prisma.category.update({
        where: { id },
        data
    })
    return category
}
const deleteCategory = async (id: string) => {
    const category = await prisma.category.delete({
        where: { id }
    })
    return category
}

export const categoryService = {
    getAllCategories,
    createCategory,
    getsingleCategory,
    updateCategory,
    deleteCategory
}