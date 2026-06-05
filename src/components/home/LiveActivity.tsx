"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Activity } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ActivityItem {
  id: string;
  type: "sold" | "new" | "offer";
  listingId: string;
  sellerName: string;
  sellerNameAr: string;
  priceFr: string;
  priceAr: string;
  ago: string;
  agoAr: string;
}

const activityPool: ActivityItem[] = [
  { id: "a1", type: "sold", listingId: "l1", sellerName: "Sidi Ould Vall", sellerNameAr: "سيدي ولد فال", priceFr: "1 200 000 MRU", priceAr: "1,200,000 أوقية", ago: "il y a 2 min", agoAr: "منذ دقيقتين" },
  { id: "a2", type: "new", listingId: "l34", sellerName: "Ahmed Ould Ndiaye", sellerNameAr: "أحمد ولد ديي", priceFr: "280 000 MRU", priceAr: "280,000 أوقية", ago: "il y a 5 min", agoAr: "منذ 5 دقائق" },
  { id: "a3", type: "offer", listingId: "l2", sellerName: "Marième Diallo", sellerNameAr: "مريم جالو", priceFr: "850 000 MRU", priceAr: "850,000 أوقية", ago: "il y a 8 min", agoAr: "منذ 8 دقائق" },
  { id: "a4", type: "new", listingId: "l33", sellerName: "Cheikh Ould Ahmed", sellerNameAr: "شيخ ولد أحمد", priceFr: "85 000 MRU", priceAr: "85,000 أوقية", ago: "il y a 12 min", agoAr: "منذ 12 دقيقة" },
  { id: "a5", type: "sold", listingId: "l5", sellerName: "Fatma Mint Brahim", sellerNameAr: "فاطمة منت إبراهيم", priceFr: "12 000 MRU", priceAr: "12,000 أوقية", ago: "il y a 18 min", agoAr: "منذ 18 دقيقة" },
];

const typeConfig = {
  sold: { dot: "bg-islamic-400", labelFr: "Vendu", labelAr: "تم البيع" },
  new: { dot: "bg-sand-400", labelFr: "Nouveau", labelAr: "جديد" },
  offer: { dot: "bg-blue-400", labelFr: "Offre", labelAr: "عرض" },
};

export default function LiveActivity() {
  const { isRTL, locale } = useLanguage();
  const [visible, setVisible] = useState<ActivityItem[]>(activityPool.slice(0, 3));
  const [fadeIdx, setFadeIdx] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = activityPool[Math.floor(Math.random() * activityPool.length)];
      setFadeIdx(next.id);
      setTimeout(() => {
        setVisible((prev) => {
          const filtered = prev.filter((a) => a.id !== next.id);
          return [next, ...filtered].slice(0, 3);
        });
        setFadeIdx(null);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-10 bg-white border-t border-sand-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`flex items-center gap-2 mb-5 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className="w-2 h-2 rounded-full bg-islamic-400 animate-pulse" />
          <span className={`text-sm font-semibold text-night-500 ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "نشاط مباشر" : "Activité en direct"}
          </span>
          <Activity size={14} className="text-night-400/40" />
        </div>

        <div className="flex flex-wrap gap-3">
          {visible.map((item) => {
            const cfg = typeConfig[item.type];
            return (
              <Link
                key={item.id}
                href={`/annonce/${item.listingId}`}
                className={`flex items-center gap-3 bg-sand-50 hover:bg-sand-100 rounded-xl px-4 py-2.5 transition-all ${fadeIdx === item.id ? "opacity-0" : "opacity-100"} ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <div className={isRTL ? "text-right" : ""}>
                  <div className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    <span className={`text-xs font-bold text-night-500 ${isRTL ? "font-arabic" : ""}`}>
                      {isRTL ? cfg.labelAr : cfg.labelFr}
                    </span>
                    <span className="text-xs text-sand-500 font-semibold">
                      {isRTL ? item.priceAr : item.priceFr}
                    </span>
                  </div>
                  <p className={`text-[10px] text-night-400/50 ${isRTL ? "font-arabic" : ""}`}>
                    {isRTL ? item.sellerNameAr : item.sellerName} · {isRTL ? item.agoAr : item.ago}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
