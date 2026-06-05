import { NextRequest } from "next/server";
import { ok, err, getTokenFromRequest, verifyToken } from "@/lib/api";
import { supabaseServer } from "@/lib/supabase";
import { createNotification } from "@/lib/notify";

/* GET /api/offers?type=received|sent — offres reçues ou envoyées */
export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload) return err("Non authentifié", 401);

  const userId = payload.userId as string;
  const type   = req.nextUrl.searchParams.get("type") ?? "sent";

  let query = supabaseServer
    .from("offers")
    .select("*, listing:listings(*), buyer:profiles!buyer_id(*), seller:profiles!seller_id(*)")
    .order("created_at", { ascending: false });

  if (type === "received") {
    query = query.eq("seller_id", userId);
  } else {
    query = query.eq("buyer_id", userId);
  }

  const { data, error } = await query;
  if (error) return err(error.message, 500);
  return ok(data ?? []);
}

/* POST /api/offers — créer une offre */
export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload) return err("Non authentifié", 401);

  const { listingId, sellerId, amount, message } = await req.json();
  if (!listingId || !sellerId || !amount) return err("listingId, sellerId et amount requis");
  if (amount <= 0) return err("Montant invalide");

  const buyerId = payload.userId as string;
  if (buyerId === sellerId) return err("Vous ne pouvez pas faire une offre sur votre propre annonce");

  /* Vérifier que l'annonce existe et est négociable */
  const { data: listing, error: listErr } = await supabaseServer
    .from("listings")
    .select("id, price, negotiable, status")
    .eq("id", listingId)
    .single();

  if (listErr || !listing) return err("Annonce introuvable", 404);
  if (listing.status !== "active") return err("Cette annonce n'est plus disponible");
  if (!listing.negotiable) return err("Cette annonce n'est pas négociable");
  if (amount > listing.price) return err("L'offre ne peut pas dépasser le prix affiché");

  /* Expiration dans 48 h */
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabaseServer
    .from("offers")
    .insert({
      listing_id: listingId,
      buyer_id:   buyerId,
      seller_id:  sellerId,
      amount,
      message:    message ?? null,
      status:     "pending",
      expires_at: expiresAt,
    })
    .select("*, listing:listings(*), buyer:profiles!buyer_id(*), seller:profiles!seller_id(*)")
    .single();

  if (error) return err(error.message, 500);

  await createNotification(
    sellerId,
    "offer",
    "Nouvelle offre reçue",
    "عرض سعر جديد",
    `Vous avez reçu une offre de ${amount} MRU`,
    `لديك عرض سعر بقيمة ${amount} أوقية`,
    `/offres`
  );

  return ok(data);
}
