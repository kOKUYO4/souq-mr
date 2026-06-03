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
    <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A 0%, #0C1426 100%)" }}>
      {/* Crescent + stars decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute w-0.5 h-0.5 bg-sand-300 rounded-full opacity-60 animate-pulse"
            style={{ left: `${8 + i * 8}%`, top: `${20 + (i % 3) * 25}%`, animationDelay: `${i * 0.3}s` }} />
        ))}
      </div>

      <div className={`relative max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <span className="text-2xl">🌙</span>
          <div className={isRTL ? "text-right" : ""}>
            <p className={`text-sm font-bold text-sand-300 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "رمضان كريم! — عروض خاصة على سوق.مر" : "Ramadan Kareem ! — Offres spéciales sur SOUQ.MR"}
            </p>
            <p className={`text-xs text-sand-400/70 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "تخفيضات حتى 40% على الملابس والإلكترونيات طوال رمضان" : "Jusqu'à -40% sur la mode et l'électronique tout le mois de Ramadan"}
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-3 flex-shrink-0 ${isRTL ? "flex-row-reverse" : ""}`}>
          <a href="/annonces?ramadan=1"
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-night-500 whitespace-nowrap"
            style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
            {isRTL ? "تسوق الآن" : "Voir les offres"}
          </a>
          <button onClick={dismiss} className="p-1.5 text-sand-400/60 hover:text-sand-400 transition-colors">
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
