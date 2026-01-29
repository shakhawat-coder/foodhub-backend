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
  const providers = await prisma.provider.findMany();
  return providers;
};
const getsingleProvider = async (id: string) => {
  const provider = await prisma.provider.findUnique({ where: { id },include: { meals: true } });
  return provider;
}

export const providerService = {
  createProvider,
  createProvidersFromUsers,
  getAllProviders,
  getsingleProvider
};
