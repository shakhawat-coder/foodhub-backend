import express, { Router } from "express";
import { userController } from "./users.controller";
import auth, { UserRole } from "../../midddleware/auth.middleware";
const router = express.Router();

router.get("/", auth(UserRole.ADMIN), userController.getAllUsers);
router.patch("/:id/status", auth(UserRole.ADMIN), userController.toggleUserStatus);
router.patch("/:id", auth(UserRole.USER), userController.updateUserProfile);

export const usersRouter: Router = router;
