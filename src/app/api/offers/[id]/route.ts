import { NextRequest } from "next/server";
import { ok, err, getTokenFromRequest, verifyToken } from "@/lib/api";
import { supabaseServer } from "@/lib/supabase";
import { createNotification } from "@/lib/notify";

/* PATCH /api/offers/[id] — mettre à jour le statut d'une offre */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = getTokenFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload) return err("Non authentifié", 401);

  const userId = payload.userId as string;
  const offerId = params.id;

  /* Charger l'offre pour vérifier les droits */
  const { data: offer, error: fetchErr } = await supabaseServer
    .from("offers")
    .select("id, buyer_id, seller_id, status")
    .eq("id", offerId)
    .single();

  if (fetchErr || !offer) return err("Offre introuvable", 404);

  const { status, counter_amount } = await req.json();

  const validStatuses = ["accepted", "declined", "countered", "expired"];
  if (!status || !validStatuses.includes(status)) {
    return err(`Statut invalide. Valeurs acceptées : ${validStatuses.join(", ")}`);
  }

  /* Seul le vendeur peut accepter / refuser / contre-offrir */
  if (["accepted", "declined", "countered"].includes(status) && offer.seller_id !== userId) {
    return err("Seul le vendeur peut répondre à cette offre", 403);
  }

  /* L'acheteur peut uniquement annuler (expired) */
  if (status === "expired" && offer.buyer_id !== userId && offer.seller_id !== userId) {
    return err("Accès refusé", 403);
  }

  if (offer.status !== "pending") return err("Cette offre n'est plus modifiable");

  const updates: Record<string, unknown> = { status };
  if (status === "countered") {
    if (!counter_amount || counter_amount <= 0) return err("counter_amount requis pour une contre-offre");
    updates.counter_amount = counter_amount;
  }

  const { data, error } = await supabaseServer
    .from("offers")
    .update(updates)
    .eq("id", offerId)
    .select("*, listing:listings(*), buyer:profiles!buyer_id(*), seller:profiles!seller_id(*)")
    .single();

  if (error) return err(error.message, 500);

  if (status === "accepted") {
    await createNotification(
      offer.buyer_id,
      "offer",
      "Offre acceptée !",
      "تم قبول عرضك!",
      "Le vendeur a accepté votre offre.",
      "قبل البائع عرضك.",
      `/offres`
    );
  } else if (status === "declined") {
    await createNotification(
      offer.buyer_id,
      "offer",
      "Offre refusée",
      "تم رفض عرضك",
      "Le vendeur a refusé votre offre.",
      "رفض البائع عرضك.",
      `/offres`
    );
  }

  return ok(data);
}
