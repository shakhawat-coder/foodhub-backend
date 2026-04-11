import { prisma } from "../lib/prisma";


async function main() {
  const coupons = [
    {
      code: "SAVE50",
      description: "Get 50% off on your next order",
      discountPercent: 50,
      minOrderAmount: 20,
      expiryDate: new Date("2026-12-31"),
    },
    {
      code: "FOODIE20",
      description: "20% off for all foodies",
      discountPercent: 20,
      minOrderAmount: 10,
      expiryDate: new Date("2026-12-31"),
    },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: coupon,
      create: coupon,
    });
  }

  console.log("Coupons seeded successfully");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
