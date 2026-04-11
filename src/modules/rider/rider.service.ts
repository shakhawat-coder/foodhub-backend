import { prisma } from "../../lib/prisma";

const getRiderByUserId = async (userId: string) => {
  return prisma.rider.findUnique({
    where: { userId },
    include: { user: true },
  });
};

const getAvailableOrders = async () => {
  return prisma.order.findMany({
    where: {
      status: "PREPARING",
      riderId: null,
    },
    include: {
      user: true,
      items: {
        include: {
          meal: {
            include: {
              provider: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const hasActiveOrder = async (riderId: string) => {
  const activeOrder = await prisma.order.findFirst({
    where: {
      riderId,
      status: {
        in: ["ASSIGNED", "PICKED_UP", "ON_THE_WAY"],
      },
    },
  });
  return !!activeOrder;
};

const acceptOrder = async (riderId: string, orderId: string) => {
  return prisma.$transaction(async (tx) => {
    const rider = await tx.rider.findUnique({ where: { id: riderId } });
    if (!rider || !rider.isAvailable) {
      throw new Error("Rider is currently offline or unavailable");
    }

    const hasActive = await tx.order.findFirst({
      where: {
        riderId,
        status: {
          in: ["ASSIGNED", "PICKED_UP", "ON_THE_WAY"],
        },
      },
    });

    if (hasActive) {
      throw new Error("Rider already has an active order");
    }

    const updated = await tx.order.updateMany({
      where: {
        id: orderId,
        status: "PREPARING",
        riderId: null,
      },
      data: {
        riderId,
        status: "ASSIGNED",
      },
    });

    if (updated.count === 0) {
      throw new Error("Order is no longer available");
    }

    return tx.order.findUnique({
      where: { id: orderId },
      include: { user: true, items: true, rider: true },
    });
  });
};

const updateOrderDeliveryStatus = async (
  riderId: string,
  orderId: string,
  status: "PICKED_UP" | "ON_THE_WAY" | "DELIVERED"
) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");
  if (order.riderId !== riderId)
    throw new Error("Order is not assigned to this rider");

  const validTransitions: Record<string, string[]> = {
    ASSIGNED: ["PICKED_UP"],
    PICKED_UP: ["ON_THE_WAY"],
    ON_THE_WAY: ["DELIVERED"],
  };

  const allowed = validTransitions[order.status] || [];
  if (!allowed.includes(status)) {
    throw new Error(
      `Invalid status transition from ${order.status} to ${status}`
    );
  }

  return prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      deliveryStatus: status,
    },
  });
};

const toggleAvailability = async (riderId: string, isAvailable: boolean) => {
  return prisma.rider.update({
    where: { id: riderId },
    data: { isAvailable },
  });
};

const getHistory = async (riderId: string) => {
  return prisma.order.findMany({
    where: {
      riderId,
      status: "DELIVERED",
    },
    include: {
      user: true,
      items: {
        include: {
          meal: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
};

const updateProfile = async (
  riderId: string,
  data: { phone?: string; vehicleType?: string; lat?: number; lng?: number }
) => {
  return prisma.rider.update({
    where: { id: riderId },
    data,
  });
};

const createRiderProfile = async (
  userId: string,
  phone: string,
  vehicleType: string
) => {
  return prisma.$transaction(async (tx) => {
    const rider = await tx.rider.create({
      data: {
        userId,
        phone,
        vehicleType,
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: { role: "RIDER" },
    });

    return rider;
  });
};

const getMyAssignedOrders = async (riderId: string) => {
  return prisma.order.findMany({
    where: {
      riderId,
      status: {
        in: ["ASSIGNED", "PICKED_UP", "ON_THE_WAY"],
      },
    },
    include: {
      user: true,
      items: {
        include: {
          meal: {
            include: {
              provider: true,
            },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
};

export const riderService = {
  getRiderByUserId,
  getAvailableOrders,
  getMyAssignedOrders,
  hasActiveOrder,
  acceptOrder,
  updateOrderDeliveryStatus,
  toggleAvailability,
  getHistory,
  updateProfile,
  createRiderProfile,
};
