import { NextRequest } from "next/server";
import { ok, err, getTokenFromRequest, verifyToken } from "@/lib/api";
import { supabaseServer } from "@/lib/supabase";
import { createNotification } from "@/lib/notify";

/* GET /api/messages — liste des conversations ou messages d'une conversation
 *   Without conversationId → returns conversations list for the user
 *   With ?conversationId=xxx → returns messages for that conversation
 */
export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload) return err("Non authentifié", 401);

  const userId = payload.userId as string;
  const conversationId = req.nextUrl.searchParams.get("conversationId");

  /* ── Conversations list ── */
  if (!conversationId) {
    const { data, error } = await supabaseServer
      .from("conversations")
      .select("*, buyer:profiles!buyer_id(*), seller:profiles!seller_id(*), listing:listings(*)")
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order("last_at", { ascending: false });

    if (error) return err(error.message, 500);
    return ok(data ?? []);
  }

  /* ── Messages for a conversation ── */
  const { data: conv, error: convErr } = await supabaseServer
    .from("conversations")
    .select("id, buyer_id, seller_id")
    .eq("id", conversationId)
    .single();

  if (convErr || !conv) return err("Conversation introuvable", 404);

  if (conv.buyer_id !== userId && conv.seller_id !== userId) {
    return err("Accès refusé", 403);
  }

  const { data, error } = await supabaseServer
    .from("messages")
    .select("*, sender:profiles!sender_id(*)")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) return err(error.message, 500);
  return ok(data ?? []);
}

/* POST /api/messages — envoyer un message
 *   Option A: { conversation_id, text } — répondre dans une conversation existante
 *   Option B: { sellerId, listingId, text } — créer/trouver une conversation et envoyer
 */
export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload) return err("Non authentifié", 401);

  const body = await req.json();
  const { text } = body;
  if (!text?.trim()) return err("text requis");

  const buyerId = payload.userId as string;

  /* Option A: conversation_id fourni directement */
  if (body.conversation_id) {
    const { data: conv, error: convErr } = await supabaseServer
      .from("conversations")
      .select("id, buyer_id, seller_id")
      .eq("id", body.conversation_id)
      .single();

    if (convErr || !conv) return err("Conversation introuvable", 404);
    if (conv.buyer_id !== buyerId && conv.seller_id !== buyerId) return err("Accès refusé", 403);

    /* Update last_message */
    await supabaseServer
      .from("conversations")
      .update({ last_message: text.trim(), last_at: new Date().toISOString() })
      .eq("id", body.conversation_id);

    const { data: msg, error: msgErr } = await supabaseServer
      .from("messages")
      .insert({ conversation_id: body.conversation_id, sender_id: buyerId, text: text.trim() })
      .select("*, sender:profiles!sender_id(*)")
      .single();

    if (msgErr) return err(msgErr.message, 500);

    // Notify the other party
    const recipientId = conv.buyer_id === buyerId ? conv.seller_id : conv.buyer_id;
    const { data: convFull } = await supabaseServer
      .from("conversations")
      .select("listing:listings(title, title_ar)")
      .eq("id", body.conversation_id)
      .single();
    const listingTitle = (convFull?.listing as any)?.title ?? "une annonce";
    const listingTitleAr = (convFull?.listing as any)?.title_ar ?? "إعلان";
    await createNotification(
      recipientId,
      "message",
      "Nouveau message",
      "رسالة جديدة",
      `Vous avez reçu un message concernant "${listingTitle}"`,
      `لديك رسالة جديدة حول "${listingTitleAr}"`,
      `/messages`
    );

    return ok(msg);
  }

  /* Option B: sellerId requis pour créer/trouver la conversation */
  const { sellerId, listingId } = body;
  if (!sellerId) return err("sellerId ou conversation_id requis");

  /* Upsert de la conversation buyer/seller/listing */
  const { data: conv, error: convErr } = await supabaseServer
    .from("conversations")
    .upsert(
      {
        buyer_id:   buyerId,
        seller_id:  sellerId,
        listing_id: listingId ?? null,
        last_message: text.trim(),
        last_at:    new Date().toISOString(),
      },
      { onConflict: "buyer_id,seller_id,listing_id", ignoreDuplicates: false }
    )
    .select("id")
    .single();

  if (convErr || !conv) return err(convErr?.message ?? "Erreur conversation", 500);

  /* Insérer le message */
  const { data: msg, error: msgErr } = await supabaseServer
    .from("messages")
    .insert({
      conversation_id: conv.id,
      sender_id:       buyerId,
      text:            text.trim(),
    })
    .select("*, sender:profiles!sender_id(*)")
    .single();

  if (msgErr) return err(msgErr.message, 500);

  // Notify the seller (recipient) about the new message
  const { data: convFull2 } = await supabaseServer
    .from("conversations")
    .select("buyer_id, seller_id, listing:listings(title, title_ar)")
    .eq("id", conv.id)
    .single();
  if (convFull2) {
    const recipientId2 = convFull2.buyer_id === buyerId ? convFull2.seller_id : convFull2.buyer_id;
    const listingTitle2 = (convFull2.listing as any)?.title ?? "une annonce";
    const listingTitleAr2 = (convFull2.listing as any)?.title_ar ?? "إعلان";
    await createNotification(
      recipientId2,
      "message",
      "Nouveau message",
      "رسالة جديدة",
      `Vous avez reçu un message concernant "${listingTitle2}"`,
      `لديك رسالة جديدة حول "${listingTitleAr2}"`,
      `/messages`
    );
  }

  return ok(msg);
}
