"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Search, Phone, MoreVertical, CheckCheck, Smile, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import type { DbConversation, DbMessage } from "@/lib/supabase";
import HagglingModal from "@/components/social/HagglingModal";

export default function MessagesPage() {
  const { isRTL } = useLanguage();
  const { success } = useToast();
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();

  const [conversations, setConversations] = useState<DbConversation[]>([]);
  const [activeConv, setActiveConv] = useState<DbConversation | null>(null);
  const [messages, setMessages] = useState<DbMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [hagglingOpen, setHagglingOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const realtimeRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  /* Scroll to bottom */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Load conversations */
  const loadConversations = useCallback(async () => {
    if (!token) return;
    setLoadingConvs(true);
    try {
      const res = await fetch("/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const { data } = await res.json();
        setConversations(data ?? []);
        if (data?.length > 0 && !activeConv) {
          setActiveConv(data[0]);
        }
      }
    } finally {
      setLoadingConvs(false);
    }
  }, [token, activeConv]);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadConversations();
    }
  }, [isAuthenticated, token]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Load messages when active conversation changes */
  const loadMessages = useCallback(async (convId: string) => {
    if (!token) return;
    setLoadingMsgs(true);
    try {
      const res = await fetch(`/api/messages?conversationId=${convId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const { data } = await res.json();
        setMessages(data ?? []);
      }
    } finally {
      setLoadingMsgs(false);
    }
  }, [token]);

  useEffect(() => {
    if (!activeConv) return;

    loadMessages(activeConv.id);

    /* Cleanup previous subscription */
    if (realtimeRef.current) {
      supabase.removeChannel(realtimeRef.current);
    }

    /* Supabase Realtime subscription */
    const channel = supabase
      .channel(`messages-${activeConv.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeConv.id}`,
        },
        (payload) => {
          setMessages((prev) => {
            // avoid duplicates
            if (prev.some((m) => m.id === (payload.new as DbMessage).id)) return prev;
            return [...prev, payload.new as DbMessage];
          });
        }
      )
      .subscribe();

    realtimeRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConv?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConv || sending) return;
    setSending(true);
    const text = newMessage.trim();
    setNewMessage("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ conversation_id: activeConv.id, text }),
      });
      if (res.ok) {
        const { data } = await res.json();
        // Realtime will add it; but add optimistically if not already present
        setMessages((prev) => {
          if (prev.some((m) => m.id === data.id)) return prev;
          return [...prev, data];
        });
        success(isRTL ? "تم الإرسال" : "Message envoyé");
      }
    } finally {
      setSending(false);
    }
  };

  /* Helpers to get display name/avatar for other party in a conversation */
  const getOtherParty = (conv: DbConversation) => {
    // We don't know which side is "us" here without userId; default to seller info
    return {
      name: conv.seller?.name ?? "…",
      nameAr: conv.seller?.name_ar ?? "…",
      avatar: conv.seller?.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.seller_id}`,
    };
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays === 0) return d.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" });
    if (diffDays === 1) return isRTL ? "أمس" : "Hier";
    return d.toLocaleDateString("fr", { day: "numeric", month: "short" });
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-sand-50">
      {hagglingOpen && activeConv?.listing && (
        <HagglingModal listing={activeConv.listing as any} onClose={() => setHagglingOpen(false)} />
      )}
      <div className="max-w-7xl mx-auto px-0 sm:px-6 py-0 sm:py-6">
        <div className="flex h-[calc(100vh-80px)] bg-white sm:rounded-2xl overflow-hidden shadow-card">

          {/* Sidebar conversations */}
          <div className={`${showChat ? "hidden sm:flex" : "flex"} w-full sm:w-80 flex-shrink-0 border-${isRTL ? "l" : "r"} border-sand-100 flex-col`}>
            <div className="p-4 border-b border-sand-100">
              <h2 className={`font-bold text-night-500 mb-3 ${isRTL ? "text-right" : ""}`}>
                {isRTL ? "الرسائل" : "Messages"}
              </h2>
              <div className="relative">
                <input type="text" placeholder={isRTL ? "بحث..." : "Rechercher..."} className="w-full input-field py-2 text-sm pl-9" />
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-300" />
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {loadingConvs && (
                <div className="p-6 text-center text-sand-400 text-sm">
                  {isRTL ? "جارٍ التحميل…" : "Chargement…"}
                </div>
              )}
              {!loadingConvs && conversations.length === 0 && (
                <div className="p-6 text-center text-sand-400 text-sm">
                  {isRTL ? "لا توجد محادثات" : "Aucune conversation"}
                </div>
              )}
              {conversations.map((conv) => {
                const other = getOtherParty(conv);
                return (
                  <button
                    key={conv.id}
                    onClick={() => { setActiveConv(conv); setShowChat(true); }}
                    className={`w-full flex items-center gap-3 p-4 border-b border-sand-50 hover:bg-sand-50 transition-colors ${activeConv?.id === conv.id ? "bg-sand-50" : ""} ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <div className="relative flex-shrink-0">
                      <img src={other.avatar} alt="" className="w-12 h-12 rounded-full bg-sand-100" />
                    </div>
                    <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}>
                      <div className={`flex items-center justify-between mb-0.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <p className="text-sm font-semibold text-night-500 truncate">{isRTL ? other.nameAr : other.name}</p>
                        <span className="text-xs text-night-400/50 flex-shrink-0 ml-2">
                          {conv.last_at ? formatTime(conv.last_at) : ""}
                        </span>
                      </div>
                      <p className="text-xs text-night-400/60 truncate">{conv.last_message ?? ""}</p>
                      {conv.listing && (
                        <p className="text-[10px] text-sand-400/70 truncate mt-0.5">
                          {isRTL ? (conv.listing as any).title_ar : (conv.listing as any).title}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat zone */}
          <div className={`${showChat ? "flex" : "hidden sm:flex"} flex-1 flex-col min-w-0`}>
            {!activeConv ? (
              <div className="flex-1 flex items-center justify-center text-sand-400 text-sm">
                {isRTL ? "اختر محادثة" : "Sélectionnez une conversation"}
              </div>
            ) : (
              <>
                {/* Header */}
                {(() => {
                  const other = getOtherParty(activeConv);
                  return (
                    <div className={`flex items-center gap-3 px-5 py-4 border-b border-sand-100 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <button onClick={() => setShowChat(false)} className="sm:hidden p-1.5 text-night-400 hover:text-sand-500 mr-1">
                        <ArrowLeft size={18} />
                      </button>
                      <img src={other.avatar} alt="" className="w-10 h-10 rounded-full bg-sand-100" />
                      <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                        <p className="font-semibold text-night-500 text-sm">{isRTL ? other.nameAr : other.name}</p>
                      </div>
                      <div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <a href={`tel:+222`} className="p-2 text-night-400 hover:text-sand-500 transition-colors rounded-lg hover:bg-sand-50"><Phone size={16} /></a>
                        <button className="p-2 text-night-400 hover:text-sand-500 transition-colors rounded-lg hover:bg-sand-50"><MoreVertical size={16} /></button>
                      </div>
                    </div>
                  );
                })()}

                {/* Listing reference */}
                {activeConv.listing && (
                  <div className={`flex items-center gap-3 px-5 py-3 bg-sand-50 border-b border-sand-100 ${isRTL ? "flex-row-reverse" : ""}`}>
                    {(activeConv.listing as any).images?.[0] && (
                      <img src={(activeConv.listing as any).images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    )}
                    <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}>
                      <p className="text-xs font-semibold text-night-500 truncate">
                        {isRTL ? (activeConv.listing as any).title_ar : (activeConv.listing as any).title}
                      </p>
                      <p className="text-xs text-sand-500 font-bold">
                        {(activeConv.listing as any).price?.toLocaleString()} MRU
                      </p>
                    </div>
                    {(activeConv.listing as any).negotiable && (
                      <button
                        onClick={() => setHagglingOpen(true)}
                        className="flex-shrink-0 px-3 py-1.5 text-xs font-bold text-night-500 rounded-xl"
                        style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}
                      >
                        🤝 {isRTL ? "فاوض" : "Négocier"}
                      </button>
                    )}
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-sand-50/30">
                  {loadingMsgs && (
                    <div className="text-center text-sand-400 text-sm py-4">
                      {isRTL ? "جارٍ التحميل…" : "Chargement…"}
                    </div>
                  )}
                  {messages.map((msg) => {
                    const isMine = msg.sender_id === activeConv.buyer_id;
                    return (
                      <div key={msg.id} className={`flex ${isMine ? (isRTL ? "justify-start" : "justify-end") : (isRTL ? "justify-end" : "justify-start")}`}>
                        <div
                          className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isMine ? "text-white rounded-br-md" : "bg-white text-night-500 shadow-sm rounded-bl-md"}`}
                          style={isMine ? { background: "linear-gradient(135deg, #1B2A4A, #2D3E6A)" } : undefined}
                        >
                          <p>{msg.text}</p>
                          <div className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
                            <span className={`text-[10px] ${isMine ? "text-white/50" : "text-night-400/40"}`}>
                              {new Date(msg.created_at).toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {isMine && <CheckCheck size={12} className="text-sand-400/70" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className={`flex items-center gap-3 px-4 py-3 border-t border-sand-100 bg-white ${isRTL ? "flex-row-reverse" : ""}`}>
                  <button className="p-2 text-night-400 hover:text-sand-500 transition-colors"><Smile size={20} /></button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder={isRTL ? "اكتب رسالتك..." : "Écrivez votre message..."}
                    dir={isRTL ? "rtl" : "ltr"}
                    className="flex-1 bg-sand-50 rounded-xl px-4 py-2.5 text-sm text-night-500 placeholder-sand-300 outline-none focus:ring-2 focus:ring-sand-300"
                    disabled={sending}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}
                  >
                    <Send size={16} className="text-night-500" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
