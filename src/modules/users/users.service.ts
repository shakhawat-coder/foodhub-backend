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

export const userServices = {
  getAllUsers,
  toggleUserStatus
};
