import { NextRequest } from "next/server";
import { ok, err, filterListings, getTokenFromRequest, verifyToken, type CreateListingBody } from "@/lib/api";
import { listings } from "@/data/mockData";

/* GET /api/listings — liste paginée avec filtres */
export async function GET(req: NextRequest) {
  const s = req.nextUrl.searchParams;

  const { items, total } = filterListings({
    q: s.get("q") ?? undefined,
    category: s.get("category") ?? undefined,
    subcategory: s.get("subcategory") ?? undefined,
    condition: s.get("condition") ?? undefined,
    priceMin: s.get("priceMin") ? Number(s.get("priceMin")) : undefined,
    priceMax: s.get("priceMax") ? Number(s.get("priceMax")) : undefined,
    negotiable: s.get("negotiable") === "true",
    cod: s.get("cod") === "true",
    featured: s.get("featured") === "true",
    location: s.get("location") ?? undefined,
    sort: (s.get("sort") as any) ?? "recent",
    page: s.get("page") ? Number(s.get("page")) : 1,
    limit: s.get("limit") ? Number(s.get("limit")) : 12,
  });

  const page = s.get("page") ? Number(s.get("page")) : 1;
  const limit = s.get("limit") ? Number(s.get("limit")) : 12;

  return ok(items, { total, page, limit, hasMore: page * limit < total });
}

/* POST /api/listings — créer une annonce (auth requise) */
export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token || !verifyToken(token)) return err("Non authentifié", 401);

  const body: CreateListingBody = await req.json();
  if (!body.title || !body.price || !body.category) return err("Champs obligatoires manquants");

  const newListing = {
    id: `l${Date.now()}`,
    ...body,
    images: body.images ?? [],
    featured: false,
    views: 0,
    createdAt: new Date().toISOString().split("T")[0],
    seller: listings[0].seller,
  };

  return ok(newListing, undefined);
}
