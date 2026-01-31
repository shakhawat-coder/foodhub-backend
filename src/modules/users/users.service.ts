import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    where: { role: { in: ["USER", "PROVIDER"] } },
  });
  return users;
};

export const userServices = {
  getAllUsers,
};
