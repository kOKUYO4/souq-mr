import { NextRequest } from "next/server";
import { ok, err, getTokenFromRequest, verifyToken } from "@/lib/api";
import { reviews } from "@/data/mockData";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sellerId = searchParams.get("sellerId");
  const listingId = searchParams.get("listingId");

  let filtered = [...reviews];
  if (sellerId) filtered = filtered.filter((r) => r.sellerId === sellerId);
  if (listingId) filtered = filtered.filter((r) => (r as any).listingId === listingId);

  return ok({ reviews: filtered, total: filtered.length });
}

export async function POST(req: NextRequest) {
  const tokenData = getTokenFromRequest(req);
  if (!tokenData) return err("Non authentifié", 401);

  const body = await req.json().catch(() => null);
  if (!body?.sellerId || !body?.rating || !body?.comment) {
    return err("sellerId, rating et comment sont requis");
  }
  if (body.rating < 1 || body.rating > 5) return err("Note entre 1 et 5");

  const user = verifyToken(tokenData);
  if (!user) return err("Token invalide", 401);

  const newReview = {
    id: `rev-${Date.now()}`,
    sellerId: body.sellerId,
    listingId: body.listingId || null,
    buyerName: user.name,
    buyerNameAr: user.nameAr || user.name,
    buyerAvatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=${user.id}`,
    rating: body.rating,
    comment: body.comment,
    commentAr: body.commentAr || body.comment,
    helpful: 0,
    createdAt: new Date().toISOString(),
  };

  return ok({ review: newReview });
}
