"use client";

import Link from "next/link";
import { Radio, Users, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function BazaarLiveBanner() {
  const { isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="py-4 bg-night-500 border-y border-night-400/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/30">
              <Radio size={12} className="text-red-400 animate-pulse" />
              <span className="text-red-400 text-xs font-bold">LIVE</span>
            </div>
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="flex items-center gap-1 text-xs text-sand-300">
                <Users size={12} />
                <span>479 {isRTL ? "متابع" : "spectateurs"}</span>
              </div>
              <span className="text-sand-400/30">•</span>
              <span className={`text-sm text-sand-300 ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? "3 عروض مباشرة الآن على Bazaar Live" : "3 ventes en direct sur Bazaar Live"}
              </span>
            </div>
          </div>
          <Link href="/bazaar-live"
            className={`flex items-center gap-1.5 text-sand-400 text-xs font-bold hover:text-sand-300 transition-colors ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
            {isRTL ? "شاهد الآن" : "Regarder maintenant"}
            <Arrow size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
