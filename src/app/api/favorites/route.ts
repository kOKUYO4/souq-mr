import { NextRequest } from "next/server";
import { ok, err, getTokenFromRequest, verifyToken } from "@/lib/api";
import { supabaseServer } from "@/lib/supabase";

/* GET /api/favorites — favoris de l'utilisateur connecté */
export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload) return err("Non authentifié", 401);

  const { data, error } = await supabaseServer
    .from("favorites")
    .select("*, listing:listings(*, profiles!seller_id(*))")
    .eq("user_id", payload.userId as string)
    .order("created_at", { ascending: false });

  if (error) return err(error.message, 500);
  return ok(data ?? []);
}

/* POST /api/favorites — ajouter un favori */
export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload) return err("Non authentifié", 401);

  const { listingId } = await req.json();
  if (!listingId) return err("listingId requis");

  const { data, error } = await supabaseServer
    .from("favorites")
    .upsert({ user_id: payload.userId, listing_id: listingId }, { onConflict: "user_id,listing_id" })
    .select()
    .single();

  if (error) return err(error.message, 500);
  return ok(data);
}

/* DELETE /api/favorites?listingId=... — supprimer un favori */
export async function DELETE(req: NextRequest) {
  const token = getTokenFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload) return err("Non authentifié", 401);

  const listingId = req.nextUrl.searchParams.get("listingId");
  if (!listingId) return err("listingId requis");

  const { error } = await supabaseServer
    .from("favorites")
    .delete()
    .eq("user_id", payload.userId as string)
    .eq("listing_id", listingId);

  if (error) return err(error.message, 500);
  return ok({ removed: true });
}
