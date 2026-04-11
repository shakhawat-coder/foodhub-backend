import { prisma } from "../../lib/prisma";

const createOrder = async (data: {
  userId: string;
  totalAmount: number;
  payableAmount: number;
  discountAmount?: number;
  couponCode?: string;
  address: string;
  items: { mealId: string; quantity: number; price: number }[];
}) => {
  const mealIds = data.items.map((item) => item.mealId);
  const meals = await prisma.meal.findMany({
    where: { id: { in: mealIds } },
    select: { id: true, providerId: true },
  });

  const mealMap = new Map(meals.map((m) => [m.id, m.providerId]));

  return await prisma.$transaction(async (tx) => {
    // 1. Mark coupon as used if applied
    if (data.couponCode) {
      const coupon = await tx.coupon.findUnique({ where: { code: data.couponCode } });
      if (coupon) {
        await tx.userCoupon.updateMany({
          where: { userId: data.userId, couponId: coupon.id, isUsed: false },
          data: { isUsed: true },
        });
      }
    }

    // 2. Create the order
    const order = await tx.order.create({
      data: {
        userId: data.userId,
        totalAmount: data.totalAmount,
        payableAmount: data.payableAmount,
        discountAmount: data.discountAmount ?? null,
        couponCode: data.couponCode ?? null,
        address: data.address,
        items: {
          create: data.items.map((item) => ({
            mealId: item.mealId,
            providerId: mealMap.get(item.mealId) || "",
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // 3. Clear the cart
    const cart = await tx.cart.findUnique({
      where: { userId: data.userId },
    });

    if (cart) {
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return order;
  });
};

const getAllOrders = async () => {
  return await prisma.order.findMany({
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
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getProviderOrders = async (providerId: string, type?: string) => {
  let statusFilter = {};
  if (type === "incoming") {
    statusFilter = {
      status: { in: ["PENDING", "ACCEPTED", "PREPARING", "ASSIGNED", "PICKED_UP", "ON_THE_WAY"] },
    };
  } else if (type === "history") {
    statusFilter = { status: { in: ["DELIVERED", "CANCELLED"] } };
  }

  return await prisma.order.findMany({
    where: {
      items: {
        some: {
          meal: {
            providerId: providerId,
          },
        },
      },
      ...statusFilter,
    },
    include: {
      user: true,
      items: {
        where: {
          meal: {
            providerId: providerId,
          },
        },
        include: {
          meal: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getUserOrders = async (userId: string) => {
  return await prisma.order.findMany({
    where: {
      userId: userId,
    },
    include: {
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
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getOrderById = async (id: string) => {
  return await prisma.order.findUnique({
    where: { id },
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
  });
};

const updateOrderStatus = async (orderId: string, status: any) => {
  return await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
};

export const orderService = {
  createOrder,
  getAllOrders,
  getProviderOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
};
