import { NextRequest, NextResponse } from "next/server";
import { ok, err, verifyToken } from "@/lib/api";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getSupabaseAdmin();
  // Support lookup by tracking_code OR uuid
  const isUuid = /^[0-9a-f-]{36}$/i.test(params.id);
  const query = admin.from("orders").select("*, listing:listings(title,title_ar,images), buyer:profiles!buyer_id(name,name_ar,phone), seller:profiles!seller_id(name,name_ar,phone,avatar)");
  const { data, error } = isUuid
    ? await query.eq("id", params.id).single()
    : await query.eq("tracking_code", params.id.toUpperCase()).single();

  if (error || !data) return err("Commande introuvable", 404);
  return ok(data);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get("souq-token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return err("Non authentifié", 401);
  const payload = verifyToken(token);
  if (!payload) return err("Token invalide", 401);

  const body = await req.json();
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("orders")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return err(error.message);
  return ok(data);
}
