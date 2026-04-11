import { prisma } from "../../lib/prisma";

const subscribe = async (email: string) => {
  return await prisma.subscriber.upsert({
    where: { email },
      update: {},
      create: { email },
    });
  }
  const getAllSubscribers = async () => {
    return await prisma.subscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
  const getSubscriberStats = async () => {
    const subscribers = await prisma.subscriber.findMany();
    // Group by month for chart
    const stats = subscribers.reduce((acc: any, sub) => {
      const date = new Date(sub.createdAt);
      const month = date.toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
    
    // Sort months or just return
    return Object.entries(stats).map(([name, count]) => ({ name, count }));
  }
  export const subscriberService = {
    subscribe,
    getAllSubscribers,
    getSubscriberStats,
  };
