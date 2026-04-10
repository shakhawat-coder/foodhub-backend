import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

const FALLBACK_INSIGHTS = [
  "Orders are stable in the current period.",
  "Peak traffic is concentrated around mealtime hours.",
  "Focus on top-selling categories to maintain growth.",
];

const insightCache = new Map<string, { expiry: number; insights: string[] }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

function hashInput(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}

export async function createAiInsights(
  analyticsData: unknown,
  role: "ADMIN" | "PROVIDER"
): Promise<string[]> {
  if (!process.env.GROQ_API_KEY) {
    return FALLBACK_INSIGHTS;
  }

  const modelId = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
  const raw = JSON.stringify(analyticsData);
  const cacheKey = `${role}:${hashInput(raw)}`;
  const cached = insightCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return cached.insights;
  }

  const prompt =
    role === "PROVIDER"
      ? `Analyze this vendor performance data and return 4 concise bullet points:
- sales insight (best-performing items)
- improvement suggestion
- demand prediction (busy time)
- menu optimization suggestion

Data:
${raw}`
      : `Analyze this food delivery platform data and return 4 concise bullet points:
- key business insight
- trend prediction
- anomaly detection
- actionable recommendation

Data:
${raw}`;
  try {
    const { text } = await generateText({
      model: groq(modelId),
      prompt: `You are an analytics assistant.
Return exactly 4 short bullet lines.
Each line should be factual based only on provided JSON.
Start each line with "- ".
No intro or outro.

${prompt}`,
    });

    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => Boolean(l) && l.startsWith("-"))
      .slice(0, 4);
    const normalized = lines.length ? lines : FALLBACK_INSIGHTS.map((l) => `- ${l}`);
    insightCache.set(cacheKey, {
      expiry: Date.now() + CACHE_TTL_MS,
      insights: normalized,
    });
    return normalized;
  } catch {
    return FALLBACK_INSIGHTS.map((l) => `- ${l}`);
  }
}
