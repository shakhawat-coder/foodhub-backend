import { prisma } from "../../lib/prisma";

type CreateBannerInput = {
  images: string[];
  subheading: string;
  heading: string;
  shortDescription: string;
  url: string;
  buttonText: string;
  priority?: number;
  isActive?: boolean;
};

const createBanner = async (input: CreateBannerInput) => {
  const banner = await prisma.banner.create({
    data: input,
  });
  return banner;
};

const getAllBanners = async (isActive?: boolean) => {
  const banners = await prisma.banner.findMany({
    where: typeof isActive === "boolean" ? { isActive } : {},
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });
  return banners;
};

const getSingleBanner = async (id: string) => {
  const banner = await prisma.banner.findUnique({
    where: { id },
  });
  return banner;
};

const updateBanner = async (id: string, data: Partial<CreateBannerInput>) => {
  const banner = await prisma.banner.update({
    where: { id },
    data,
  });
  return banner;
};

const updateBannerStatus = async (id: string, isActive: boolean) => {
  const banner = await prisma.banner.update({
    where: { id },
    data: { isActive },
  });
  return banner;
};

const deleteBanner = async (id: string) => {
  const banner = await prisma.banner.delete({
    where: { id },
  });
  return banner;
};

export const bannerService = {
  createBanner,
  getAllBanners,
  getSingleBanner,
  updateBanner,
  updateBannerStatus,
  deleteBanner,
};
