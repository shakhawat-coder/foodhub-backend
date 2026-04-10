import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

const rankingSchema = z.object({
  rankedIds: z
    .array(z.string())
    .describe("Meal IDs in best match order for the user query"),
  suggestions: z
    .array(z.string())
    .max(8)
    .describe(
      "Short search phrase suggestions (e.g. spicy snacks, healthy bowls)"
    ),
  didYouMean: z
    .string()
    .optional()
    .describe("Corrected query if the user likely made a typo"),
});

export type SearchMealResult = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  categoryId: string;
  categoryName: string;
  providerId: string;
  providerName: string;
};

function mapMeal(m: {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  categoryId: string;
  category: { name: string };
  provider: { id: string; name: string };
}): SearchMealResult {
  return {
    id: m.id,
    name: m.name,
    description: m.description,
    price: m.price,
    image: m.image,
    categoryId: m.categoryId,
    categoryName: m.category.name,
    providerId: m.provider.id,
    providerName: m.provider.name,
  };
}

async function fetchMealPool(query: string) {
  const q = query.trim();
  if (!q) {
    return prisma.meal.findMany({
      where: { isPopular: true },
      include: { category: true, provider: true },
      take: 20,
      orderBy: { createdAt: "desc" },
    });
  }

  const meals = await prisma.meal.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { category: { name: { contains: q, mode: "insensitive" } } },
        { provider: { name: { contains: q, mode: "insensitive" } } },
      ],
    },
    include: { category: true, provider: true },
    take: 20,
    orderBy: { createdAt: "desc" },
  });

  if (meals.length > 0) return meals;

  return prisma.meal.findMany({
    where: { isPopular: true },
    include: { category: true, provider: true },
    take: 20,
    orderBy: { createdAt: "desc" },
  });
}

export async function hybridAiSearch(query: string) {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      suggestions: [] as string[],
      results: [] as SearchMealResult[],
      didYouMean: undefined as string | undefined,
      mode: "empty" as const,
    };
  }

  const pool = await fetchMealPool(trimmed);
  const mapped = pool.map(mapMeal);

  if (mapped.length === 0) {
    return {
      suggestions: [],
      results: [],
      didYouMean: undefined,
      mode: "empty" as const,
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      suggestions: mapped.slice(0, 5).map((m) => m.name),
      results: mapped.slice(0, 12),
      didYouMean: undefined,
      mode: "db-only" as const,
    };
  }

  const modelId = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const compact = mapped.map((m) => ({
    id: m.id,
    name: m.name,
    description: m.description.slice(0, 200),
    category: m.categoryName,
    price: m.price,
  }));

  try {
    const { object } = await generateObject({
      model: openai(modelId),
      schema: rankingSchema,
      prompt: `You are a food delivery search assistant.

User query: "${trimmed}"

Intent: Understand healthy food, cheap/budget options, spicy snacks, vegetarian, dinner ideas, typos (e.g. "piza" → pizza), and casual language.

Meals available (only these IDs exist; pick from this list only):
${JSON.stringify(compact, null, 2)}

Tasks:
1) Order rankedIds by relevance to the query (best first). Include only IDs from the list above. If none match well, still order the closest matches.
2) suggestions: 3–6 short, diverse search phrases users might like next.
3) didYouMean: only if the query looks like a typo of a food name or category.

Return JSON matching the schema.`,
    });

    const byId = new Map(mapped.map((m) => [m.id, m]));
    const ordered = object.rankedIds
      .map((id) => byId.get(id))
      .filter((m): m is SearchMealResult => Boolean(m));

    const seen = new Set(ordered.map((m) => m.id));
    for (const m of mapped) {
      if (!seen.has(m.id)) ordered.push(m);
    }

    return {
      suggestions: object.suggestions.slice(0, 8),
      results: ordered.slice(0, 20),
      didYouMean: object.didYouMean,
      mode: "ai" as const,
    };
  } catch (err) {
    console.error("[hybridAiSearch] AI failed, falling back to DB order:", err);
    return {
      suggestions: mapped.slice(0, 5).map((m) => m.name),
      results: mapped.slice(0, 15),
      didYouMean: undefined,
      mode: "fallback" as const,
    };
  }
}
