"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export type Notification = {
  id: string;
  type: "message" | "offer" | "order" | "review" | "system";
  title: string;
  title_ar: string;
  body: string;
  body_ar: string;
  link: string | null;
  read: boolean;
  created_at: string;
};

export function useNotifications() {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    const token = localStorage.getItem("nuqta-token");
    setLoading(true);
    const res = await fetch("/api/notifications", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    setLoading(false);
    if (res.ok) {
      const { data } = await res.json();
      setNotifications(data.notifications ?? []);
      setUnread(data.unread ?? 0);
    }
  }, [isAuthenticated]);

  const markAllRead = useCallback(async () => {
    const token = localStorage.getItem("nuqta-token");
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnread(0);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    fetchNotifications();

    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev]);
        setUnread(prev => prev + 1);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isAuthenticated, user?.id]);

  return { notifications, unread, loading, markAllRead, refetch: fetchNotifications };
}
