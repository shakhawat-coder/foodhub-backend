import { prisma } from "../../lib/prisma";

const createBlog = async (data: { title: string; content: string; image?: string }) => {
  return prisma.blog.create({
    data,
  });
};

const getAllBlogs = async () => {
  return prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
  });
};

const getBlogById = async (id: string) => {
  return prisma.blog.findUnique({
    where: { id },
  });
};

const updateBlog = async (id: string, data: { title?: string; content?: string; image?: string }) => {
  return prisma.blog.update({
    where: { id },
    data,
  });
};

const deleteBlog = async (id: string) => {
  return prisma.blog.delete({
    where: { id },
  });
};

export const blogService = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
