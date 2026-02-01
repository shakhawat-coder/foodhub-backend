import { Router } from "express";
import { uploadController } from "./upload.controller";
import { upload } from "../../midddleware/multer";

import auth, { UserRole } from "../../midddleware/auth.middleware";

const router = Router();

router.post("/", auth(UserRole.ADMIN, UserRole.PROVIDER), upload.single("image"), uploadController.uploadImage);

export const uploadRouter = router;
