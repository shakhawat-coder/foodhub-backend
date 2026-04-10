import { Request, Response } from "express";
import { hybridAiSearch } from "./search.service";

export const aiSearch = async (req: Request, res: Response) => {
  try {
    const query = typeof req.body?.query === "string" ? req.body.query : "";
    if (!query.trim()) {
      return res.status(400).json({ error: "query is required" });
    }

    const out = await hybridAiSearch(query);
    return res.status(200).json({
      suggestions: out.suggestions,
      results: out.results,
      didYouMean: out.didYouMean ?? null,
      mode: out.mode,
    });
  } catch (error) {
    console.error("[aiSearch]", error);
    return res.status(500).json({ error: "Search failed" });
  }
};
