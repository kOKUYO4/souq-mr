import { NextRequest } from "next/server";
import { ok, err, getTokenFromRequest, verifyToken } from "@/lib/api";
import { sellers, listings, reviews } from "@/data/mockData";

/* GET /api/profile/[id] */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const seller = sellers.find((s) => s.id === params.id);
  if (!seller) return err("Profil introuvable", 404);

  const sellerListings = listings.filter((l) => l.seller.id === params.id);
  const sellerReviews = reviews.filter((r) => r.sellerId === params.id);

  return ok({ seller, listings: sellerListings, reviews: sellerReviews });
}

/* PATCH /api/profile/[id] — mettre à jour le profil */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const token = getTokenFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.userId !== params.id) return err("Non autorisé", 403);

  const seller = sellers.find((s) => s.id === params.id);
  if (!seller) return err("Profil introuvable", 404);

  const body = await req.json();
  const allowed = ["name", "nameAr", "phone", "avatar"];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) if (body[key] !== undefined) updates[key] = body[key];

  return ok({ ...seller, ...updates });
}
