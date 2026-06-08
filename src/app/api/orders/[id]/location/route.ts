import { NextRequest } from "next/server";
import { ok, err, verifyToken } from "@/lib/api";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get("nuqta-token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return err("Non authentifié", 401);
  const payload = verifyToken(token);
  if (!payload) return err("Token invalide", 401);

  const { lat, lng, heading } = await req.json();
  if (!lat || !lng) return err("lat/lng requis");

  const admin = getSupabaseAdmin();
  const { error } = await admin.from("delivery_locations").insert({
    order_id: params.id,
    driver_id: payload.userId as string,
    lat, lng, heading,
  });

  if (error) return err(error.message);

  // Update driver_id on order if not set
  await admin.from("orders").update({ driver_id: payload.userId }).eq("id", params.id).is("driver_id", null);

  return ok({ ok: true });
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("delivery_locations")
    .select("lat,lng,heading,created_at")
    .eq("order_id", params.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  return ok(data ?? null);
}
