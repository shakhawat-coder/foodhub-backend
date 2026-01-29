import { prisma } from "../../lib/prisma";

interface AddToCartInput {
  mealId: string;
  quantity?: number;
}
export const getOrCreateCart = async (userId: string) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { meal: true } } },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: { include: { meal: true } } },
    });
  }

  return cart;
};
const addToCart = async (userId: string, data: AddToCartInput) => {
  const cart = await getOrCreateCart(userId);

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_mealId: {
        cartId: cart.id,
        mealId: data.mealId,
      },
    },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: existingItem.quantity + (data.quantity || 1),
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        mealId: data.mealId,
        quantity: data.quantity || 1,
      },
    });
  }
};
const getCart = async (userId: string) => {
  const cart = await getOrCreateCart(userId);
  return cart;
};
const removeFromCart = async (userId: string, mealId: string) => {
  const cart = await getOrCreateCart(userId);

  return prisma.cartItem.delete({
    where: {
      cartId_mealId: {
        cartId: cart.id,
        mealId,
      },
    },
  });
};

const clearCart = async (userId: string) => {
  const cart = await getOrCreateCart(userId);

  return prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });
};

const updateCart = async (userId: string, data: AddToCartInput) => {
  const cart = await getOrCreateCart(userId);

  return prisma.cartItem.update({
    where: {
      cartId_mealId: {
        cartId: cart.id,
        mealId: data.mealId,
      },
    },
    data: {
      quantity: data.quantity || 1,
    },
  });
};
// export const getOrCreateCart = async (userId: string) => {
//   let cart = await prisma.cart.findUnique({
//     where: { userId },
//     include: { items: { include: { meal: true } } }
//   })

//   if (!cart) {
//     cart = await prisma.cart.create({
//       data: { userId },
//       include: { items: { include: { meal: true } } }
//     })
//   }

//   return cart
// }

// export const addToCart = async (userId: string, data: AddToCartInput) => {
//   const cart = await getOrCreateCart(userId)

//   const existingItem = await prisma.cartItem.findUnique({
//     where: {
//       cartId_mealId: {
//         cartId: cart.id,
//         mealId: data.mealId
//       }
//     }
//   })

//   if (existingItem) {
//     return prisma.cartItem.update({
//       where: { id: existingItem.id },
//       data: {
//         quantity: existingItem.quantity + (data.quantity ?? 1)
//       }
//     })
//   }

//   return prisma.cartItem.create({
//     data: {
//       cartId: cart.id,
//       mealId: data.mealId,
//       quantity: data.quantity ?? 1
//     }
//   })
// }

// export const removeFromCart = async (userId: string, mealId: string) => {
//   const cart = await getOrCreateCart(userId)

//   return prisma.cartItem.delete({
//     where: {
//       cartId_mealId: {
//         cartId: cart.id,
//         mealId
//       }
//     }
//   })
// }

// export const clearCart = async (userId: string) => {
//   const cart = await getOrCreateCart(userId)

//   return prisma.cartItem.deleteMany({
//     where: { cartId: cart.id }
//   })
// }

export const cartService = {
  addToCart,
  removeFromCart,
  clearCart,
  getCart,
  updateCart,
};
