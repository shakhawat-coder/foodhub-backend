import express, { Router } from "express";
import auth, { UserRole } from "../../midddleware/auth.middleware";
import { blogController } from "./blog.controller";

const router = express.Router();

router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  blogController.createBlog
);

router.put(
  "/:id",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  blogController.updateBlog
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  blogController.deleteBlog
);

export const blogRouter: Router = router;
