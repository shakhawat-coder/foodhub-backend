import express, { Router } from "express";
import { userController } from "./users.controller";
import auth, { UserRole } from "../../midddleware/auth.middleware";
const router = express.Router();

router.get("/", auth(UserRole.ADMIN), userController.getAllUsers);

export const usersRouter: Router = router;
