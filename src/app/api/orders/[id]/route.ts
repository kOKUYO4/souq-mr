import { NextRequest, NextResponse } from "next/server";
import { ok, err, verifyToken } from "@/lib/api";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createNotification } from "@/lib/notify";

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

  const statusMessages: Record<string, { fr: string; ar: string; titleFr: string; titleAr: string }> = {
    confirmed:  { titleFr: "Commande confirmée",    titleAr: "الطلب مؤكد",         fr: "Votre commande a été confirmée.",          ar: "تم تأكيد طلبك." },
    picked_up:  { titleFr: "Colis récupéré",        titleAr: "تم استلام الطرد",     fr: "Le livreur a récupéré votre colis.",       ar: "استلم السائق طلبك." },
    en_route:   { titleFr: "Colis en route",        titleAr: "الطرد في الطريق",     fr: "Votre colis est en route vers vous.",      ar: "طلبك في الطريق إليك." },
    delivered:  { titleFr: "Livraison effectuée !", titleAr: "تم التسليم!",         fr: "Votre commande a été livrée.",             ar: "تم تسليم طلبك." },
  };
  if (body.status && statusMessages[body.status] && data.buyer_id) {
    const msg = statusMessages[body.status];
    await createNotification(data.buyer_id, "order", msg.titleFr, msg.titleAr, msg.fr, msg.ar, `/suivi/${data.id}`);
  }

  return ok(data);
}
