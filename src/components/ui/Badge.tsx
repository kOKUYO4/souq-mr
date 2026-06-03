"use client";

import { ShieldCheck, Star, Store } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type BadgeType = "verified" | "pro" | "regular" | "new" | "used" | "negotiate" | "cod";

interface BadgeProps {
  type: BadgeType;
  size?: "sm" | "md";
}

export default function Badge({ type, size = "sm" }: BadgeProps) {
  const { t } = useLanguage();

  const config: Record<BadgeType, { label: string; icon?: React.ReactNode; className: string }> = {
    verified: {
      label: t.trust.verified,
      icon: <ShieldCheck size={12} />,
      className: "bg-islamic-50 text-islamic-400 border border-islamic-100",
    },
    pro: {
      label: t.trust.pro,
      icon: <Star size={12} fill="currentColor" />,
      className: "text-night-500",
      // gradient via style
    },
    regular: {
      label: t.trust.regular,
      icon: <Store size={12} />,
      className: "bg-sand-100 text-sand-600 border border-sand-200",
    },
    new: {
      label: t.listings.new,
      className: "text-white",
    },
    used: {
      label: t.listings.used,
      className: "bg-night-50 text-night-400 border border-night-100",
    },
    negotiate: {
      label: t.listings.negotiate,
      className: "bg-sand-50 text-sand-500 border border-sand-200",
    },
    cod: {
      label: t.listings.cod,
      className: "bg-islamic-50 text-islamic-400 border border-islamic-100",
    },
  };

  const item = config[type];
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs";

  const isGradient = type === "new" || type === "pro";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${sizeClass} ${item.className}`}
      style={
        isGradient
          ? { background: "linear-gradient(135deg, #C9A84C 0%, #B8922E 100%)" }
          : undefined
      }
    >
      {item.icon}
      {item.label}
    </span>
  );
}
