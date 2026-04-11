import { prisma } from "../../lib/prisma";

const getAllActiveCoupons = async () => {
  return await prisma.coupon.findMany({
    where: {
      isActive: true,
      expiryDate: { gt: new Date() },
    },
  });
};

const collectCoupon = async (userId: string, couponId: string) => {
  const coupon = await prisma.coupon.findUnique({
    where: { id: couponId },
  });

  if (!coupon || !coupon.isActive || coupon.expiryDate < new Date()) {
    throw new Error("Coupon is invalid or expired");
  }

  return await prisma.userCoupon.upsert({
    where: {
      userId_couponId: { userId, couponId },
    },
    update: {},
    create: {
      userId,
      couponId,
    },
  });
};

const getUserCoupons = async (userId: string) => {
  return await prisma.userCoupon.findMany({
    where: { userId },
    include: { coupon: true },
    orderBy: { collectedAt: "desc" },
  });
};

const getAllCoupons = async () => {
  return await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });
};

const createCoupon = async (data: any) => {
  return await prisma.coupon.create({
    data: {
      ...data,
      expiryDate: new Date(data.expiryDate),
    },
  });
};

const updateCoupon = async (id: string, data: any) => {
  return await prisma.coupon.update({
    where: { id },
    data: {
      ...data,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
    },
  });
};

const deleteCoupon = async (id: string) => {
  return await prisma.coupon.delete({
    where: { id },
  });
};

export const couponService = {
  getAllActiveCoupons,
  collectCoupon,
  getUserCoupons,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
