import { populate } from "dotenv";
import { prisma } from "../../lib/prisma";
interface CreateProviderInput {
  name: string;
  logo?: string;
  address?: string;
  phone?: string;
  email: string;
}
const createProvider = async (input: CreateProviderInput) => {
  const { name, logo, address, phone, email } = input;

  try {
    // Check if provider already exists with this email
    const existingProvider = await prisma.provider.findUnique({
      where: { email },
    });

    if (existingProvider) {
      console.log(`Provider already exists for email: ${email}`);
      return existingProvider;
    }

    const provider = await prisma.provider.create({
      data: {
        name,
        logo: logo ?? null,
        address: address || "",
        phone: phone || "",
        email,
      },
    });
    return provider;
  } catch (error) {
    console.error(`Error creating provider for ${email}:`, error);
    throw error;
  }
};

// Create providers from users with PROVIDER role
const createProvidersFromUsers = async () => {
  // Find all users with PROVIDER role
  const providerUsers = await prisma.user.findMany({
    where: {
      role: "PROVIDER",
    },
  });

  const createdProviders = [];

  // Create provider for each user with PROVIDER role
  for (const user of providerUsers) {
    try {
      // Check if provider already exists for this email
      const existingProvider = await prisma.provider.findUnique({
        where: { email: user.email },
      });

      if (!existingProvider) {
        const provider = await prisma.provider.create({
          data: {
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            address: user.address || "",
            logo: null,
          },
        });
        createdProviders.push(provider);
      }
    } catch (error) {
      console.error(`Failed to create provider for user ${user.email}:`, error);
    }
  }
  return createdProviders;
};
const getAllProviders = async () => {
  const providers = await prisma.provider.findMany({
    include: {
      meals: {
        include: {
          category: true,
          reviews: true,
        },
      },
    },
  });

  return providers.map((provider) => {
    const allReviews = provider.meals.flatMap((meal) => meal.reviews);
    const reviewCount = allReviews.length;
    const ratingAverage =
      reviewCount > 0
        ? allReviews.reduce((sum, review) => sum + Number(review.rating), 0) /
        reviewCount
        : 0;

    // Dynamically derive cuisine from meal categories
    const cuisines = Array.from(
      new Set(provider.meals.map((meal) => meal.category?.name).filter(Boolean))
    ).join(", ");

    return {
      ...provider,
      cuisine: cuisines || "Various",
      rating: Number(ratingAverage.toFixed(1)),
      review: reviewCount,
    };
  });
};
const getsingleProvider = async (id: string) => {
  const provider = await prisma.provider.findUnique({
    where: { id },
    include: { meals: true },
  });
  return provider;
};
const updateProvider = async (
  id: string,
  data: Partial<CreateProviderInput>,
) => {
  const updatedProvider = await prisma.provider.update({
    where: { id },
    data,
  });
  return updatedProvider;
};
const getProviderByEmail = async (email: string) => {
  const provider = await prisma.provider.findUnique({
    where: { email },
    include: { meals: true }
  });
  return provider;
};

export const providerService = {
  createProvider,
  createProvidersFromUsers,
  getAllProviders,
  getsingleProvider,
  updateProvider,
  getProviderByEmail
};
