"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function RamadanBanner() {
  const { isRTL } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("ramadan-banner-dismissed");
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("ramadan-banner-dismissed", "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="relative overflow-hidden border-b border-sand-400/20"
      style={{ background: "linear-gradient(135deg, #C9A84C 0%, #B8922E 50%, #A07820 100%)" }}>
      {/* Stars decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
            style={{ left: `${5 + i * 10}%`, top: `${15 + (i % 3) * 30}%`, animationDelay: `${i * 0.4}s` }} />
        ))}
      </div>

      <div className={`relative max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className={`flex items-center gap-2.5 ${isRTL ? "flex-row-reverse" : ""}`}>
          <span className="text-xl leading-none">🌙</span>
          <div className={isRTL ? "text-right" : ""}>
            <p className={`text-sm font-bold text-night-500 leading-tight ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "رمضان كريم! — عروض خاصة على نقطة.مر" : "Ramadan Kareem ! — Offres spéciales sur NUQTA.MR"}
            </p>
            <p className={`text-xs font-medium text-night-500/75 leading-tight mt-0.5 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "تخفيضات حتى 40% على الملابس والإلكترونيات طوال رمضان" : "Jusqu'à -40% sur la mode et l'électronique tout le mois de Ramadan"}
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-2 flex-shrink-0 ${isRTL ? "flex-row-reverse" : ""}`}>
          <a href="/annonces?ramadan=1"
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-sand-300 whitespace-nowrap border border-night-500/20 transition-opacity hover:opacity-80"
            style={{ background: "rgba(27,42,74,0.85)" }}>
            {isRTL ? "تسوق الآن" : "Voir les offres"}
          </a>
          <button onClick={dismiss} className="p-1 text-night-500/60 hover:text-night-500 transition-colors">
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
