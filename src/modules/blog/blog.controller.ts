import { Request, Response } from "express";
import { blogService } from "./blog.service";

const createBlog = async (req: Request, res: Response) => {
  try {
    const blog = await blogService.createBlog(req.body);
    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllBlogs = async (_req: Request, res: Response) => {
  try {
    const blogs = await blogService.getAllBlogs();
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getBlogById = async (req: Request, res: Response) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, error: "Blog not found" });
    }
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateBlog = async (req: Request, res: Response) => {
  try {
    const blog = await blogService.updateBlog(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteBlog = async (req: Request, res: Response) => {
  try {
    await blogService.deleteBlog(req.params.id);
    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const blogController = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
