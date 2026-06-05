import { NextRequest } from "next/server";
import { ok, err, verifyToken } from "@/lib/api";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sellerId = searchParams.get("seller_id");
  const listingId = searchParams.get("listing_id");
  if (!sellerId && !listingId) return err("seller_id ou listing_id requis");

  const admin = getSupabaseAdmin();
  let query = admin.from("reviews").select("*, author:profiles!author_id(name,name_ar,avatar,badge)").order("created_at", { ascending: false });
  if (sellerId) query = query.eq("seller_id", sellerId);
  if (listingId) query = query.eq("listing_id", listingId);
  const { data } = await query.limit(20);
  return ok(data ?? []);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("souq-token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return err("Non authentifié", 401);
  const payload = verifyToken(token);
  if (!payload) return err("Token invalide", 401);

  const { seller_id, listing_id, rating, comment, comment_ar } = await req.json();
  if (!seller_id || !rating) return err("seller_id et rating requis");
  if (rating < 1 || rating > 5) return err("Note entre 1 et 5");

  const admin = getSupabaseAdmin();

  // Check not already reviewed
  const { data: existing } = await admin.from("reviews")
    .select("id").eq("author_id", payload.userId as string).eq("seller_id", seller_id).maybeSingle();
  if (existing) return err("Vous avez déjà noté ce vendeur", 409);

  const { data, error } = await admin.from("reviews")
    .insert({ author_id: payload.userId, seller_id, listing_id, rating, comment, comment_ar })
    .select("*, author:profiles!author_id(name,name_ar,avatar,badge)")
    .single();
  if (error) return err(error.message);

  // Update seller rating
  const { data: allReviews } = await admin.from("reviews").select("rating").eq("seller_id", seller_id);
  if (allReviews && allReviews.length > 0) {
    const avg = allReviews.reduce((s: number, r: any) => s + r.rating, 0) / allReviews.length;
    await admin.from("profiles").update({ rating: Math.round(avg * 100) / 100, reviews_count: allReviews.length }).eq("id", seller_id);
  }

  return ok(data);
}
