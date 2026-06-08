"use client";

import { useState } from "react";
import { Bell, Heart, MessageCircle, Tag, TrendingUp, Star, CheckCheck, Trash2, Settings } from "lucide-react";
import Link from "next/link";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

type NotifType = "message" | "favorite" | "price" | "boost" | "review" | "system";

interface Notification {
  id: string;
  type: NotifType;
  titleFr: string;
  titleAr: string;
  bodyFr: string;
  bodyAr: string;
  time: string;
  read: boolean;
  href?: string;
  avatar?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "n1", type: "message",
    titleFr: "Nouveau message", titleAr: "رسالة جديدة",
    bodyFr: "Ahmed Ould Ndiaye vous a envoyé une offre pour votre iPhone 15 Pro", bodyAr: "أحمد ولد ديي أرسل لك عرضاً لهاتف آيفون 15 برو",
    time: "14:32", read: false, href: "/messages",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AhmedN",
  },
  {
    id: "n2", type: "price",
    titleFr: "Alerte prix activée", titleAr: "تنبيه السعر مُفعَّل",
    bodyFr: "Le prix de la Toyota Hilux 2020 a baissé de 15% — 850 000 MRU", bodyAr: "انخفض سعر تويوتا هايلوكس 2020 بنسبة 15% — 850,000 أوقية",
    time: "12:15", read: false, href: "/annonce/l2",
  },
  {
    id: "n3", type: "favorite",
    titleFr: "Annonce sauvegardée vue 3×", titleAr: "إعلانك المحفوظ شوهد 3 مرات",
    bodyFr: "MacBook Air M2 — Toujours disponible, ne tardez pas !", bodyAr: "ماك بوك إير M2 — لا يزال متاحاً، لا تتأخر!",
    time: "10:00", read: true, href: "/annonce/l34",
  },
  {
    id: "n4", type: "boost",
    titleFr: "Boost terminé", titleAr: "انتهى التعزيز",
    bodyFr: "Votre annonce « Daraa traditionnelle » a reçu 342 vues supplémentaires", bodyAr: "إعلانك «دراعة تقليدية» حصل على 342 مشاهدة إضافية",
    time: "Hier", read: true, href: "/tableau-de-bord",
  },
  {
    id: "n5", type: "review",
    titleFr: "Nouvel avis reçu", titleAr: "تقييم جديد",
    bodyFr: "Marième Diallo vous a laissé un avis 5 étoiles ⭐⭐⭐⭐⭐", bodyAr: "مريم جالو تركت لك تقييم 5 نجوم ⭐⭐⭐⭐⭐",
    time: "Lun", read: true, href: "/profil/s1",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marieme",
  },
  {
    id: "n6", type: "message",
    titleFr: "Contre-offre acceptée", titleAr: "تم قبول العرض المضاد",
    bodyFr: "Sidi Ould Vall a accepté votre offre de 185 000 MRU pour la Toyota", bodyAr: "سيدي ولد فال قبل عرضك بـ 185,000 أوقية للتويوتا",
    time: "Lun", read: true, href: "/messages",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SidiVall",
  },
  {
    id: "n7", type: "system",
    titleFr: "Bienvenue sur NUQTA.MR !", titleAr: "مرحباً بك في نقطة.مر!",
    bodyFr: "Votre compte est vérifié. Commencez à vendre ou achetez dès maintenant.", bodyAr: "تم التحقق من حسابك. ابدأ البيع أو الشراء الآن.",
    time: "03/06", read: true,
  },
];

const typeConfig: Record<NotifType, { icon: React.ElementType; color: string; bg: string }> = {
  message: { icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-50" },
  favorite: { icon: Heart, color: "text-red-500", bg: "bg-red-50" },
  price: { icon: TrendingUp, color: "text-islamic-400", bg: "bg-islamic-50" },
  boost: { icon: Tag, color: "text-sand-500", bg: "bg-sand-100" },
  review: { icon: Star, color: "text-sand-400", bg: "bg-sand-50" },
  system: { icon: Bell, color: "text-night-400", bg: "bg-sand-50" },
};

export default function NotificationsPage() {
  const { isRTL, locale } = useLanguage();
  const [notifs, setNotifs] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifs.filter((n) => !n.read).length;
  const displayed = filter === "unread" ? notifs.filter((n) => !n.read) : notifs;

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const deleteNotif = (id: string) => setNotifs((prev) => prev.filter((n) => n.id !== id));

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="relative py-10 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.05} />
        <div className={`relative max-w-2xl mx-auto px-4 sm:px-6 ${isRTL ? "text-right" : ""}`}>
          <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-12 h-12 rounded-2xl bg-sand-400/20 flex items-center justify-center">
                <Bell size={22} className="text-sand-400" />
              </div>
              <div className={isRTL ? "text-right" : ""}>
                <h1 className={`text-2xl font-display font-bold text-white ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? "الإشعارات" : "Notifications"}
                </h1>
                {unreadCount > 0 && (
                  <p className={`text-sand-300/70 text-sm ${isRTL ? "font-arabic" : ""}`}>
                    {isRTL ? `${unreadCount} غير مقروء` : `${unreadCount} non lue(s)`}
                  </p>
                )}
              </div>
            </div>
            <Link href="/aide" className="p-2 text-white/50 hover:text-white transition-colors">
              <Settings size={18} />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className="flex gap-1 bg-sand-100 rounded-xl p-1">
            {(["all", "unread"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filter === f ? "bg-white text-night-500 shadow-sm" : "text-night-400/60 hover:text-night-500"}`}>
                {f === "all"
                  ? (isRTL ? "الكل" : "Tout")
                  : (isRTL ? `غير مقروء (${unreadCount})` : `Non lu (${unreadCount})`)}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className={`flex items-center gap-1.5 text-xs text-sand-500 hover:text-sand-600 font-semibold ${isRTL ? "flex-row-reverse" : ""}`}>
              <CheckCheck size={14} />
              {isRTL ? "قراءة الكل" : "Tout lire"}
            </button>
          )}
        </div>

        {/* Liste */}
        {displayed.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔔</div>
            <p className={`text-night-400/60 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "لا توجد إشعارات" : "Aucune notification"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayed.map((notif) => {
              const cfg = typeConfig[notif.type];
              const Icon = cfg.icon;
              const content = (
                <div
                  className={`relative flex items-start gap-3 bg-white rounded-2xl p-4 shadow-sm transition-all hover:shadow-card cursor-pointer ${!notif.read ? "border-l-4 border-sand-400" : ""} ${isRTL ? "flex-row-reverse" : ""}`}
                  onClick={() => markRead(notif.id)}
                >
                  {/* Dot unread */}
                  {!notif.read && (
                    <div className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} w-2 h-2 rounded-full bg-sand-400`} />
                  )}

                  {/* Avatar ou icône */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notif.avatar ? "" : cfg.bg}`}>
                    {notif.avatar
                      ? <img src={notif.avatar} alt="" className="w-10 h-10 rounded-full" />
                      : <Icon size={18} className={cfg.color} />
                    }
                  </div>

                  <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}>
                    <p className={`text-sm font-semibold text-night-500 ${isRTL ? "font-arabic" : ""}`}>
                      {isRTL ? notif.titleAr : notif.titleFr}
                    </p>
                    <p className={`text-xs text-night-400/70 mt-0.5 leading-relaxed ${isRTL ? "font-arabic" : ""}`}>
                      {isRTL ? notif.bodyAr : notif.bodyFr}
                    </p>
                    <p className="text-[10px] text-night-400/40 mt-1">{notif.time}</p>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }}
                    className="flex-shrink-0 p-1.5 text-night-400/30 hover:text-red-400 transition-colors rounded-lg"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );

              return notif.href ? (
                <Link key={notif.id} href={notif.href}>
                  {content}
                </Link>
              ) : (
                <div key={notif.id}>{content}</div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
