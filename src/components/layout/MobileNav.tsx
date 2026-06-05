"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, MessageCircle, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";

export default function MobileNav() {
  const pathname = usePathname();
  const { isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { notifications } = useNotifications();
  const unreadMessages = isAuthenticated
    ? notifications.filter((n) => n.type === "message" && !n.read).length
    : 0;

  const items = [
    { href: "/", icon: Home, labelFr: "Accueil", labelAr: "الرئيسية" },
    { href: "/recherche", icon: Search, labelFr: "Chercher", labelAr: "بحث" },
    { href: "/vendre", icon: Plus, labelFr: "Vendre", labelAr: "أبيع", isCTA: true },
    { href: "/messages", icon: MessageCircle, labelFr: "Messages", labelAr: "رسائل" },
    { href: isAuthenticated ? "/tableau-de-bord" : "/connexion", icon: User, labelFr: "Profil", labelAr: "حسابي" },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-sand-100 safe-area-inset-bottom"
      style={{ boxShadow: "0 -2px 16px rgba(27, 42, 74, 0.08)" }}>
      <div className={`flex items-center justify-around h-16 px-2 ${isRTL ? "flex-row-reverse" : ""}`}>
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          if (item.isCTA) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 -mt-5"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-gold"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                  <Icon size={22} className="text-night-500" />
                </div>
                <span className={`text-[10px] font-semibold text-sand-500 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? item.labelAr : item.labelFr}
                </span>
              </Link>
            );
          }

          const isMessages = item.href === "/messages";
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 py-1 px-2 min-w-[48px]"
            >
              <div className="relative">
                <Icon
                  size={20}
                  className={`transition-colors ${isActive ? "text-sand-500" : "text-night-400/50"}`}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                {isMessages && unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-0.5 leading-none">
                    {unreadMessages > 99 ? "99+" : unreadMessages}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-sand-500" : "text-night-400/50"} ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? item.labelAr : item.labelFr}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
