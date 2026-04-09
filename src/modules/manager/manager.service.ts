import { prisma } from "../../lib/prisma";

const getAllOrders = async () => {
  return prisma.order.findMany({
    include: {
      user: true,
      rider: { include: { user: true } },
      items: { include: { meal: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getAllRiders = async () => {
  return prisma.rider.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
};

const updateRiderStatus = async (
  riderId: string,
  status: "PENDING" | "APPROVED" | "BLOCKED" | "REJECTED"
) => {
  return prisma.rider.update({
    where: { id: riderId },
    data: { status },
  });
};

const assignRider = async (orderId: string, riderId: string) => {
  return prisma.$transaction(async (tx) => {
    const rider = await tx.rider.findUnique({ where: { id: riderId } });
    if (!rider || rider.status !== "APPROVED") {
      throw new Error("Rider is not approved");
    }

    const activeOrder = await tx.order.findFirst({
      where: {
        riderId,
        status: { in: ["ACCEPTED_BY_RIDER", "PICKED_UP", "ON_THE_WAY"] },
      },
    });
    if (activeOrder) throw new Error("Rider already has an active order");

    return tx.order.update({
      where: { id: orderId },
      data: { riderId, status: "ACCEPTED_BY_RIDER" },
      include: { rider: { include: { user: true } }, user: true, items: true },
    });
  });
};

const getReports = async () => {
  const [totalOrders, deliveredOrders, pendingRiders, activeRiders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.rider.count({ where: { status: "PENDING" } }),
      prisma.rider.count({ where: { isAvailable: true, status: "APPROVED" } }),
    ]);

  return {
    totalOrders,
    deliveredOrders,
    pendingRiders,
    activeRiders,
  };
};

const createManager = async (data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  image?: string;
}) => {
  const { auth } = await import("../../lib/auth");
  return auth.api.signUpEmail({
    body: {
      ...data,
      role: "MANAGER",
    },
  } as any);
};

export const managerService = {
  getAllOrders,
  getAllRiders,
  updateRiderStatus,
  assignRider,
  getReports,
  createManager,
};
