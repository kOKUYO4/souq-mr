import { NextRequest, NextResponse } from "next/server";
import { ok, err } from "@/lib/api";
import { verifyToken } from "@/lib/api";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("souq-token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return err("Non authentifié", 401);
  const payload = verifyToken(token);
  if (!payload) return err("Token invalide", 401);
  const userId = payload.userId as string;

  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("orders")
    .select("*, listing:listings(title,images)")
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId},driver_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  return ok(data ?? []);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("souq-token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return err("Non authentifié", 401);
  const payload = verifyToken(token);
  if (!payload) return err("Token invalide", 401);

  const body = await req.json();
  const { listing_id, seller_id, amount, address, address_lat, address_lng, notes } = body;
  if (!seller_id || !amount || !address) return err("Champs requis manquants");

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("orders")
    .insert({ listing_id, buyer_id: payload.userId, seller_id, amount, address, address_lat, address_lng, notes })
    .select()
    .single();

  if (error) return err(error.message);
  return ok(data);
}
