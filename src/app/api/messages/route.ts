import { NextRequest } from "next/server";
import { ok, err, getTokenFromRequest, verifyToken } from "@/lib/api";
import { supabaseServer } from "@/lib/supabase";

/* GET /api/messages?conversationId=... — messages d'une conversation */
export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload) return err("Non authentifié", 401);

  const conversationId = req.nextUrl.searchParams.get("conversationId");
  if (!conversationId) return err("conversationId requis");

  /* Vérifier que l'utilisateur est bien membre de cette conversation */
  const { data: conv, error: convErr } = await supabaseServer
    .from("conversations")
    .select("id, buyer_id, seller_id")
    .eq("id", conversationId)
    .single();

  if (convErr || !conv) return err("Conversation introuvable", 404);

  const userId = payload.userId as string;
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

/* POST /api/messages — envoyer un message */
export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload) return err("Non authentifié", 401);

  const { sellerId, listingId, text } = await req.json();
  if (!sellerId || !text?.trim()) return err("sellerId et text requis");

  const buyerId = payload.userId as string;

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
  return ok(msg);
}
