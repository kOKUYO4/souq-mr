import { NextRequest } from "next/server";
import { ok, err, filterListings } from "@/lib/api";
import { categories } from "@/data/mockData";

/* GET /api/search?q=...&category=...&... */
export async function GET(req: NextRequest) {
  const s = req.nextUrl.searchParams;
  const q = s.get("q");

  if (!q || q.length < 2) return err("Recherche trop courte (min 2 caractères)");

  const { items, total } = filterListings({
    q,
    category: s.get("category") ?? undefined,
    condition: s.get("condition") ?? undefined,
    priceMin: s.get("priceMin") ? Number(s.get("priceMin")) : undefined,
    priceMax: s.get("priceMax") ? Number(s.get("priceMax")) : undefined,
    sort: (s.get("sort") as any) ?? "popular",
    page: 1,
    limit: 20,
  });

  /* Suggestions de catégories correspondantes */
  const catSuggestions = categories.filter(
    (c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.nameAr.includes(q)
  ).slice(0, 3);

  return ok({ listings: items, total, categories: catSuggestions, query: q });
}
