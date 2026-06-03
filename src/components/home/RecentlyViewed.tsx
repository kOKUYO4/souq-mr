"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, X } from "lucide-react";
import { listings, formatPrice } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";

interface RecentItem { id: string; ts: number; }

export function recordView(id: string) {
  if (typeof window === "undefined") return;
  const key = "souq-recently-viewed";
  const existing: RecentItem[] = JSON.parse(localStorage.getItem(key) || "[]");
  const filtered = existing.filter((r) => r.id !== id);
  filtered.unshift({ id, ts: Date.now() });
  localStorage.setItem(key, JSON.stringify(filtered.slice(0, 8)));
}

export default function RecentlyViewed() {
  const { isRTL, locale } = useLanguage();
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("souq-recently-viewed") || "[]") as RecentItem[];
    setItems(stored);
  }, []);

  const clear = () => {
    localStorage.removeItem("souq-recently-viewed");
    setItems([]);
  };

  if (items.length === 0) return null;

  const viewed = items
    .map((r) => listings.find((l) => l.id === r.id))
    .filter(Boolean) as typeof listings;

  if (viewed.length === 0) return null;

  return (
    <section className="py-10 bg-sand-50 border-t border-sand-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`flex items-center justify-between mb-5 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Clock size={18} className="text-sand-400" />
            <h2 className={`text-lg font-display font-bold text-night-500 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "شاهدتها مؤخراً" : "Récemment consultés"}
            </h2>
          </div>
          <button onClick={clear} className="flex items-center gap-1 text-xs text-night-400/50 hover:text-red-400 transition-colors">
            <X size={12} />
            {isRTL ? "مسح" : "Effacer"}
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {viewed.map((l) => (
            <Link key={l.id} href={`/annonce/${l.id}`}
              className="flex-shrink-0 w-36 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all group overflow-hidden">
              <div className="h-24 bg-sand-100 overflow-hidden">
                {l.images[0] ? (
                  <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>
                )}
              </div>
              <div className="p-2.5">
                <p className={`text-xs font-semibold text-night-500 truncate mb-1 ${isRTL ? "font-arabic text-right" : ""}`}>
                  {isRTL ? l.titleAr : l.title}
                </p>
                <p className="text-xs font-bold text-sand-500">{formatPrice(l.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
