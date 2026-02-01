import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    where: { role: { in: ["USER", "PROVIDER"] } },
    orderBy: { createdAt: 'desc' }
  });

  const providers = await prisma.provider.findMany({
    select: { email: true }
  });

  const providerEmails = new Set(providers.map(p => p.email));

  const usersWithSyncStatus = users.map(user => {
    if (user.role === 'PROVIDER') {
      return {
        ...user,
        isSynced: providerEmails.has(user.email)
      };
    }
    return {
      ...user,
      isSynced: true // non-providers are always "synced" in this context
    };
  });

  return usersWithSyncStatus;
};

const toggleUserStatus = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isSuspended: !user.isSuspended },
  });
  return updatedUser;
};

interface UpdateUserProfileData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  image?: string;
}

const updateUserProfile = async (userId: string, data: UpdateUserProfileData) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.address !== undefined) updateData.address = data.address;
  if (data.image !== undefined) updateData.image = data.image;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return updatedUser;
};

export const userServices = {
  getAllUsers,
  toggleUserStatus,
  updateUserProfile
};
