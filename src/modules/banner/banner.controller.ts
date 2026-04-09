import { Request, Response } from "express";
import { bannerService } from "./banner.service";

const createBanner = async (req: Request, res: Response) => {
  try {
    const {
      images,
      subheading,
      heading,
      shortDescription,
      url,
      buttonText,
      priority,
      isActive,
    } = req.body;

    if (
      !Array.isArray(images) ||
      !subheading ||
      !heading ||
      !shortDescription ||
      !url ||
      !buttonText
    ) {
      return res.status(400).json({
        error:
          "images, subheading, heading, shortDescription, url and buttonText are required",
      });
    }

    const banner = await bannerService.createBanner({
      images,
      subheading,
      heading,
      shortDescription,
      url,
      buttonText,
      priority: typeof priority === "number" ? priority : Number(priority) || 0,
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ error: "Failed to create banner" });
  }
};

const getAllBanners = async (req: Request, res: Response) => {
  try {
    const { isActive } = req.query;

    let parsedStatus: boolean | undefined = undefined;
    if (isActive === "true") parsedStatus = true;
    if (isActive === "false") parsedStatus = false;

    const banners = await bannerService.getAllBanners(parsedStatus);
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ error: "Failed to get banners" });
  }
};

const getBannerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const banner = await bannerService.getSingleBanner(id as string);
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ error: "Failed to get banner" });
  }
};

const updateBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { priority, ...rest } = req.body;

    const banner = await bannerService.updateBanner(id as string, {
      ...rest,
      ...(priority !== undefined
        ? {
            priority:
              typeof priority === "number" ? priority : Number(priority) || 0,
          }
        : {}),
    });
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ error: "Failed to update banner" });
  }
};

const updateBannerStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res
        .status(400)
        .json({ error: "isActive must be a boolean value" });
    }

    const banner = await bannerService.updateBannerStatus(
      id as string,
      isActive
    );
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ error: "Failed to update banner status" });
  }
};

const deleteBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const banner = await bannerService.deleteBanner(id as string);
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete banner" });
  }
};

export const bannerController = {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  updateBannerStatus,
  deleteBanner,
};
