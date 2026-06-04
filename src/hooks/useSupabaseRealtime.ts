"use client";
/**
 * Hook — messages en temps réel via Supabase Realtime
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { DbMessage } from "@/lib/supabase";

export function useRealtimeMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<DbMessage[]>([]);
  const [loading, setLoading]   = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Charger l'historique
  const loadMessages = useCallback(async () => {
    if (!conversationId) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from("messages")
      .select("*, sender:profiles!sender_id(*)")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    setMessages(data ?? []);
    setLoading(false);
  }, [conversationId]);

  useEffect(() => {
    loadMessages();

    if (!conversationId) return;

    // Écouter les nouveaux messages en temps réel
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as DbMessage]);
        }
      )
      .subscribe();

    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [conversationId, loadMessages]);

  return { messages, loading };
}

export function useRealtimeConversations(userId: string | null) {
  const [conversations, setConversations] = useState<unknown[]>([]);

  useEffect(() => {
    if (!userId) return;

    supabase
      .from("conversations")
      .select("*, buyer:profiles!buyer_id(*), seller:profiles!seller_id(*), listing:listings(*)")
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order("last_at", { ascending: false })
      .then(({ data }) => setConversations(data ?? []));

    const channel = supabase
      .channel(`conversations:${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        () => {
          supabase
            .from("conversations")
            .select("*, buyer:profiles!buyer_id(*), seller:profiles!seller_id(*), listing:listings(*)")
            .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
            .order("last_at", { ascending: false })
            .then(({ data }) => setConversations(data ?? []));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  return { conversations };
}
