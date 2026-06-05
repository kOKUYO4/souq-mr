"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, MessageCircle, Tag, Package, Star, Info } from "lucide-react";
import Link from "next/link";
import { useNotifications } from "@/hooks/useNotifications";
import { useLanguage } from "@/context/LanguageContext";

const typeIcon = { message: MessageCircle, offer: Tag, order: Package, review: Star, system: Info };
const typeColor = { message: "text-blue-500", offer: "text-sand-500", order: "text-green-500", review: "text-yellow-500", system: "text-night-400" };

export default function NotificationBell() {
  const { isRTL, locale } = useLanguage();
  const { notifications, unread, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    setOpen(o => !o);
    if (!open && unread > 0) markAllRead();
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={handleOpen}
        className="relative w-9 h-9 rounded-full flex items-center justify-center text-sand-300 hover:text-sand-400 hover:bg-night-400/30 transition-colors">
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-bounce">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className={`absolute top-12 ${isRTL ? "left-0" : "right-0"} w-80 bg-night-500 border border-night-400/30 rounded-2xl shadow-gold-lg overflow-hidden z-50`}>
          <div className={`flex items-center justify-between px-4 py-3 border-b border-night-400/30 ${isRTL ? "flex-row-reverse" : ""}`}>
            <p className="text-sm font-bold text-white">{isRTL ? "الإشعارات" : "Notifications"}</p>
            {unread > 0 && (
              <span className="text-xs text-sand-400/70">{unread} {isRTL ? "جديدة" : "nouvelles"}</span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell size={28} className="text-night-400 mx-auto mb-2" />
                <p className="text-sm text-night-400">{isRTL ? "لا توجد إشعارات" : "Aucune notification"}</p>
              </div>
            ) : (
              notifications.map(n => {
                const Icon = typeIcon[n.type] ?? Info;
                return (
                  <Link key={n.id} href={n.link ?? "#"}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-night-400/20 transition-colors border-b border-night-400/10 ${isRTL ? "flex-row-reverse" : ""} ${!n.read ? "bg-night-400/10" : ""}`}
                    onClick={() => setOpen(false)}>
                    <div className={`w-8 h-8 rounded-full bg-night-400/30 flex items-center justify-center flex-shrink-0 ${typeColor[n.type]}`}>
                      <Icon size={14} />
                    </div>
                    <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}>
                      <p className="text-xs font-semibold text-white truncate">{locale === "ar" ? n.title_ar : n.title}</p>
                      <p className="text-xs text-night-300 line-clamp-2 mt-0.5">{locale === "ar" ? n.body_ar : n.body}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-sand-400 flex-shrink-0 mt-1" />}
                  </Link>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
