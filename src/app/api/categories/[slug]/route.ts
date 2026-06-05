import { NextRequest } from "next/server";
import { ok, err, filterListings } from "@/lib/api";
import { categories } from "@/data/categories";

/* GET /api/categories/[slug] */
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const cat = categories.find((c) => c.id === params.slug);
  if (!cat) return err("Catégorie introuvable", 404);

  const s = req.nextUrl.searchParams;
  const { items, total } = filterListings({
    category: params.slug,
    subcategory: s.get("subcategory") ?? undefined,
    sort: (s.get("sort") as any) ?? "recent",
    page: s.get("page") ? Number(s.get("page")) : 1,
    limit: s.get("limit") ? Number(s.get("limit")) : 12,
    priceMin: s.get("priceMin") ? Number(s.get("priceMin")) : undefined,
    priceMax: s.get("priceMax") ? Number(s.get("priceMax")) : undefined,
    condition: s.get("condition") ?? undefined,
  });

  return ok({ category: cat, listings: items, total });
}
