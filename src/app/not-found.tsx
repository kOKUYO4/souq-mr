"use client";

import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";
import Logo from "@/components/ui/Logo";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFound() {
  const { isRTL } = useLanguage();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0C1426, #1B2A4A)" }}
    >
      <IslamicPattern opacity={0.05} />

      <div className="relative text-center max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="md" />
        </div>

        {/* 404 stylisé */}
        <div
          className="text-8xl font-display font-bold mb-4"
          style={{
            background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #B8922E 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </div>

        <div className="text-5xl mb-6">🐪</div>

        <h1 className={`text-2xl font-bold text-white mb-3 ${isRTL ? "font-arabic" : "font-display"}`}>
          {isRTL ? "هذه الصفحة ضاعت في الصحراء!" : "Cette page s'est perdue dans le désert !"}
        </h1>
        <p className={`text-sand-300/70 mb-8 ${isRTL ? "font-arabic" : ""}`}>
          {isRTL
            ? "لا يمكن العثور على الصفحة التي تبحث عنها"
            : "La page que vous cherchez n'existe pas ou a été déplacée."}
        </p>

        <div className={`flex flex-col sm:flex-row gap-3 justify-center ${isRTL ? "sm:flex-row-reverse" : ""}`}>
          <Link href="/" className="btn-gold py-3 px-6 gap-2">
            <Home size={16} />
            {isRTL ? "الصفحة الرئيسية" : "Retour à l'accueil"}
          </Link>
          <Link href="/annonces" className="btn-outline py-3 px-6 gap-2 text-sand-300 border-sand-400/40 hover:bg-sand-400/10">
            <Search size={16} />
            {isRTL ? "تصفح الإعلانات" : "Voir les annonces"}
          </Link>
        </div>
      </div>
    </div>
  );
}
