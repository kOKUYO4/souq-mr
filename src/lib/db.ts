/**
 * Helpers base de données — couche d'abstraction sur Supabase
 * Utilisé côté serveur (API routes)
 */
import { supabaseServer } from "@/lib/supabase";
import type { DbListing, DbProfile, DbConversation, DbMessage, DbFavorite } from "@/lib/supabase";

/* ── LISTINGS ── */

export async function getListingById(id: string): Promise<DbListing | null> {
  const { data } = await supabaseServer
    .from("listings")
    .select("*, profiles!seller_id(*)")
    .eq("id", id)
    .eq("status", "active")
    .single();
  return data;
}

export async function incrementListingViews(id: string) {
  await supabaseServer.rpc("increment_listing_views", { listing_uuid: id });
}

export async function getListingsBySeller(sellerId: string): Promise<DbListing[]> {
  const { data } = await supabaseServer
    .from("listings")
    .select("*")
    .eq("seller_id", sellerId)
    .neq("status", "deleted")
    .order("created_at", { ascending: false });
  return data ?? [];
}

/* ── PROFILES ── */

export async function getProfileById(id: string): Promise<DbProfile | null> {
  const { data } = await supabaseServer
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();
  return data;
}

export async function getProfileByPhone(phone: string): Promise<DbProfile | null> {
  const { data } = await supabaseServer
    .from("profiles")
    .select("*")
    .eq("phone", phone)
    .single();
  return data;
}

export async function upsertProfile(
  id: string,
  phone: string,
  extra: Partial<DbProfile> = {}
): Promise<DbProfile | null> {
  const { data } = await supabaseServer
    .from("profiles")
    .upsert({ id, phone, ...extra }, { onConflict: "id" })
    .select()
    .single();
  return data;
}

/* ── CONVERSATIONS & MESSAGES ── */

export async function getOrCreateConversation(
  listingId: string | null,
  buyerId: string,
  sellerId: string
): Promise<DbConversation | null> {
  // Chercher conversation existante
  let query = supabaseServer
    .from("conversations")
    .select("*")
    .eq("buyer_id", buyerId)
    .eq("seller_id", sellerId);

  if (listingId) query = query.eq("listing_id", listingId);

  const { data: existing } = await query.single();
  if (existing) return existing;

  // Créer une nouvelle conversation
  const { data } = await supabaseServer
    .from("conversations")
    .insert({ listing_id: listingId, buyer_id: buyerId, seller_id: sellerId })
    .select()
    .single();

  return data;
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  text: string
): Promise<DbMessage | null> {
  const { data } = await supabaseServer
    .from("messages")
    .insert({ conversation_id: conversationId, sender_id: senderId, text })
    .select("*, sender:profiles!sender_id(*)")
    .single();
  return data;
}

export async function getMessages(conversationId: string): Promise<DbMessage[]> {
  const { data } = await supabaseServer
    .from("messages")
    .select("*, sender:profiles!sender_id(*)")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  return data ?? [];
}

/* ── FAVORITES ── */

export async function getUserFavoriteIds(userId: string): Promise<string[]> {
  const { data } = await supabaseServer
    .from("favorites")
    .select("listing_id")
    .eq("user_id", userId);
  return (data ?? []).map((f: { listing_id: string }) => f.listing_id);
}

export async function toggleFavorite(
  userId: string,
  listingId: string
): Promise<{ added: boolean }> {
  const { data: existing } = await supabaseServer
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("listing_id", listingId)
    .single();

  if (existing) {
    await supabaseServer.from("favorites").delete().eq("id", existing.id);
    return { added: false };
  }

  await supabaseServer.from("favorites").insert({ user_id: userId, listing_id: listingId });
  return { added: true };
}
