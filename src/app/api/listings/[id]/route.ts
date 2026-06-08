import { NextRequest } from "next/server";
import { ok, err, verifyToken } from "@/lib/api";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("listings")
    .select("*, profiles!seller_id(*)")
    .eq("id", params.id)
    .single();
  if (error || !data) return err("Annonce introuvable", 404);

  // Increment views
  await admin.rpc("increment_listing_views", { listing_uuid: params.id }).catch(() => {});

  return ok(data);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get("nuqta-token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return err("Non authentifié", 401);
  const payload = verifyToken(token);
  if (!payload) return err("Token invalide", 401);

  const body = await req.json();
  const admin = getSupabaseAdmin();

  // Verify ownership
  const { data: listing } = await admin.from("listings").select("seller_id").eq("id", params.id).single();
  if (!listing || listing.seller_id !== payload.userId) return err("Non autorisé", 403);

  const { data, error } = await admin
    .from("listings")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", params.id)
    .select()
    .single();
  if (error) return err(error.message);
  return ok(data);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get("nuqta-token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return err("Non authentifié", 401);
  const payload = verifyToken(token);
  if (!payload) return err("Token invalide", 401);

  const admin = getSupabaseAdmin();
  const { data: listing } = await admin.from("listings").select("seller_id").eq("id", params.id).single();
  if (!listing || listing.seller_id !== payload.userId) return err("Non autorisé", 403);

  await admin.from("listings").update({ status: "deleted" }).eq("id", params.id);
  return ok({ deleted: true });
}
