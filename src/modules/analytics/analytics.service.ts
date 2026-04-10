import { prisma } from "../../lib/prisma";

type AnalyticsResponse = {
  ordersByDate: Array<{ date: string; count: number }>;
  revenueByDate: Array<{ date: string; revenue: number }>;
  categoryStats: Array<{ category: string; count: number }>;
  deliveryStatusStats: Array<{ status: string; count: number }>;
  summary: {
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
  };
  peakHour: string;
  bestSellingItem: string;
};

function formatDateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function getDateRange(days: number) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const from = new Date(today);
  from.setDate(from.getDate() - (days - 1));
  from.setHours(0, 0, 0, 0);
  return { from, to: today };
}

function buildDateBuckets(days: number) {
  const { from } = getDateRange(days);
  const buckets: string[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(from);
    d.setDate(from.getDate() + i);
    buckets.push(formatDateKey(d));
  }
  return buckets;
}

function topEntry(map: Map<string, number>, fallback: string) {
  let key = fallback;
  let val = -1;
  for (const [k, v] of map.entries()) {
    if (v > val) {
      key = k;
      val = v;
    }
  }
  return key;
}

export async function getAdminAnalytics(days = 7): Promise<AnalyticsResponse> {
  const { from, to } = getDateRange(days);
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: from, lte: to } },
    include: {
      items: { include: { meal: { include: { category: true } } } },
    },
    orderBy: { createdAt: "asc" },
  });

  const orderCountByDate = new Map<string, number>();
  const revenueByDate = new Map<string, number>();
  const categoryCount = new Map<string, number>();
  const deliveryStatusCount = new Map<string, number>([
    ["PREPARING", 0],
    ["ASSIGNED", 0],
    ["DELIVERED", 0],
  ]);
  const itemCount = new Map<string, number>();
  const hourCount = new Map<string, number>();

  for (const order of orders) {
    const date = formatDateKey(order.createdAt);
    orderCountByDate.set(date, (orderCountByDate.get(date) ?? 0) + 1);
    revenueByDate.set(date, (revenueByDate.get(date) ?? 0) + order.totalAmount);

    if (deliveryStatusCount.has(order.status)) {
      deliveryStatusCount.set(
        order.status,
        (deliveryStatusCount.get(order.status) ?? 0) + 1
      );
    }

    const hour = `${order.createdAt.getHours().toString().padStart(2, "0")}:00`;
    hourCount.set(hour, (hourCount.get(hour) ?? 0) + 1);

    for (const item of order.items) {
      const mealName = item.meal.name;
      itemCount.set(mealName, (itemCount.get(mealName) ?? 0) + item.quantity);
    }
  }

  // Category distribution should reflect actual menu coverage, not only recent order slices.
  const categories = await prisma.category.findMany({ include: { meals: true } });
  for (const category of categories) {
    categoryCount.set(category.name, category.meals.length);
  }

  const dateBuckets = buildDateBuckets(days);
  const ordersByDate = dateBuckets.map((date) => ({
    date,
    count: orderCountByDate.get(date) ?? 0,
  }));
  const revenueSeries = dateBuckets.map((date) => ({
    date,
    revenue: Number((revenueByDate.get(date) ?? 0).toFixed(2)),
  }));

  const totalOrders = orders.length;
  const totalRevenue = Number(
    orders.reduce((acc, o) => acc + o.totalAmount, 0).toFixed(2)
  );
  const avgOrderValue =
    totalOrders > 0 ? Number((totalRevenue / totalOrders).toFixed(2)) : 0;

  return {
    ordersByDate,
    revenueByDate: revenueSeries,
    categoryStats: Array.from(categoryCount.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
    deliveryStatusStats: Array.from(deliveryStatusCount.entries()).map(
      ([status, count]) => ({
        status,
        count,
      })
    ),
    summary: {
      totalOrders,
      totalRevenue,
      avgOrderValue,
    },
    peakHour: topEntry(hourCount, "N/A"),
    bestSellingItem: topEntry(itemCount, "N/A"),
  };
}

export async function getProviderAnalytics(
  providerId: string,
  days = 7
): Promise<AnalyticsResponse> {
  const { from, to } = getDateRange(days);
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: from, lte: to },
      items: { some: { meal: { providerId } } },
    },
    include: {
      items: {
        where: { meal: { providerId } },
        include: { meal: { include: { category: true } } },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const orderCountByDate = new Map<string, number>();
  const revenueByDate = new Map<string, number>();
  const categoryCount = new Map<string, number>();
  const deliveryStatusCount = new Map<string, number>([
    ["PREPARING", 0],
    ["ASSIGNED", 0],
    ["DELIVERED", 0],
  ]);
  const itemCount = new Map<string, number>();
  const hourCount = new Map<string, number>();

  for (const order of orders) {
    const date = formatDateKey(order.createdAt);
    orderCountByDate.set(date, (orderCountByDate.get(date) ?? 0) + 1);

    const providerRevenue = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    revenueByDate.set(date, (revenueByDate.get(date) ?? 0) + providerRevenue);

    if (deliveryStatusCount.has(order.status)) {
      deliveryStatusCount.set(
        order.status,
        (deliveryStatusCount.get(order.status) ?? 0) + 1
      );
    }

    const hour = `${order.createdAt.getHours().toString().padStart(2, "0")}:00`;
    hourCount.set(hour, (hourCount.get(hour) ?? 0) + 1);

    for (const item of order.items) {
      const mealName = item.meal.name;
      itemCount.set(mealName, (itemCount.get(mealName) ?? 0) + item.quantity);
    }
  }

  const providerMeals = await prisma.meal.findMany({
    where: { providerId },
    include: { category: true },
  });
  for (const meal of providerMeals) {
    const categoryName = meal.category?.name ?? "Other";
    categoryCount.set(categoryName, (categoryCount.get(categoryName) ?? 0) + 1);
  }

  const dateBuckets = buildDateBuckets(days);
  const ordersByDate = dateBuckets.map((date) => ({
    date,
    count: orderCountByDate.get(date) ?? 0,
  }));
  const revenueSeries = dateBuckets.map((date) => ({
    date,
    revenue: Number((revenueByDate.get(date) ?? 0).toFixed(2)),
  }));

  const totalOrders = orders.length;
  const totalRevenue = Number(
    revenueSeries.reduce((acc, d) => acc + d.revenue, 0).toFixed(2)
  );
  const avgOrderValue =
    totalOrders > 0 ? Number((totalRevenue / totalOrders).toFixed(2)) : 0;

  return {
    ordersByDate,
    revenueByDate: revenueSeries,
    categoryStats: Array.from(categoryCount.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
    deliveryStatusStats: Array.from(deliveryStatusCount.entries()).map(
      ([status, count]) => ({
        status,
        count,
      })
    ),
    summary: {
      totalOrders,
      totalRevenue,
      avgOrderValue,
    },
    peakHour: topEntry(hourCount, "N/A"),
    bestSellingItem: topEntry(itemCount, "N/A"),
  };
}
