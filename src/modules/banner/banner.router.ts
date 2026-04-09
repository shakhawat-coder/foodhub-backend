import express, { Router } from "express";
import { bannerController } from "./banner.controller";
import auth, { UserRole } from "../../midddleware/auth.middleware";

const router = express.Router();

router.post("/", auth(UserRole.ADMIN), bannerController.createBanner);
router.get("/", bannerController.getAllBanners);
router.get("/:id", bannerController.getBannerById);
router.put("/:id", auth(UserRole.ADMIN), bannerController.updateBanner);
router.patch(
  "/:id/status",
  auth(UserRole.ADMIN),
  bannerController.updateBannerStatus
);
router.delete("/:id", auth(UserRole.ADMIN), bannerController.deleteBanner);

export const bannerRouter: Router = router;
