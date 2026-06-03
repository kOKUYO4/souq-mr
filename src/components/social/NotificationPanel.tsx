"use client";

import { useState } from "react";
import { Bell, X, Check, MessageCircle, Tag, Star, Settings, AlertCircle } from "lucide-react";
import type { Notification } from "@/data/mockData";
import { notifications as initialNotifications } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";

const iconMap = {
  offer: <Tag size={14} className="text-sand-400" />,
  message: <MessageCircle size={14} className="text-night-400" />,
  sold: <Check size={14} className="text-islamic-400" />,
  review: <Star size={14} className="text-sand-400 fill-sand-400" />,
  system: <Settings size={14} className="text-night-400/60" />,
};

export default function NotificationPanel() {
  const { isRTL, locale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unread = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const timeLabel = (iso: string) => {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (diff < 60) return `${diff}min`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h`;
    return `${Math.floor(diff / 1440)}j`;
  };

  return (
    <div className="relative">
      {/* Cloche */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-sand-300 hover:text-sand-400 transition-colors rounded-lg hover:bg-night-600/50"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold text-night-500 flex items-center justify-center px-1"
            style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
            {unread}
          </span>
        )}
      </button>

      {/* Panneau */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className={`absolute top-full mt-2 ${isRTL ? "left-0" : "right-0"} w-80 bg-white rounded-2xl shadow-card-hover border border-sand-100 z-50 overflow-hidden`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-3 border-b border-sand-100 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <h4 className="font-semibold text-night-500 text-sm">
                  {isRTL ? "الإشعارات" : "Notifications"}
                </h4>
                {unread > 0 && (
                  <span className="badge text-[10px] text-white px-2 py-0.5 rounded-full"
                    style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                    {unread} {isRTL ? "جديد" : "nouveau"}
                  </span>
                )}
              </div>
              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-xs text-sand-500 hover:underline">
                    {isRTL ? "قراءة الكل" : "Tout lire"}
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-night-400/50 hover:text-night-500">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Liste */}
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-night-400/50">
                  {isRTL ? "لا توجد إشعارات" : "Aucune notification"}
                </div>
              ) : (
                notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => markRead(notif.id)}
                    className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-sand-50 transition-colors border-b border-sand-50 last:border-0 ${isRTL ? "flex-row-reverse text-right" : ""} ${!notif.read ? "bg-sand-50/50" : ""}`}
                  >
                    {/* Avatar ou icône */}
                    <div className="flex-shrink-0 relative mt-0.5">
                      {notif.avatar ? (
                        <img src={notif.avatar} alt="" className="w-9 h-9 rounded-full bg-sand-100" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-sand-100 flex items-center justify-center">
                          {iconMap[notif.type]}
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white flex items-center justify-center">
                        {iconMap[notif.type]}
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className={`flex items-start justify-between gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <p className={`text-xs font-semibold text-night-500 leading-tight ${!notif.read ? "font-bold" : ""}`}>
                          {isRTL ? notif.titleAr : notif.titleFr}
                        </p>
                        <span className="text-[10px] text-night-400/40 flex-shrink-0">{timeLabel(notif.createdAt)}</span>
                      </div>
                      <p className="text-xs text-night-400/70 mt-0.5 line-clamp-2">
                        {isRTL ? notif.bodyAr : notif.bodyFr}
                      </p>
                    </div>

                    {/* Pastille non lu */}
                    {!notif.read && (
                      <div className="w-2 h-2 rounded-full bg-sand-400 flex-shrink-0 mt-2" />
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-sand-100 text-center">
              <button className="text-xs text-sand-500 font-semibold hover:underline">
                {isRTL ? "عرض كل الإشعارات" : "Voir toutes les notifications"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
