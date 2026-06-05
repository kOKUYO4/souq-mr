"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft, Car, Smartphone, Shirt, Sparkles, Home, Briefcase, PawPrint, Grid3X3 } from "lucide-react";
import { categories } from "@/data/categories";
import { useLanguage } from "@/context/LanguageContext";

const iconMap: Record<string, React.ReactNode> = {
  vehicles: <Car size={28} strokeWidth={1.5} />,
  phones: <Smartphone size={28} strokeWidth={1.5} />,
  fashion: <Shirt size={28} strokeWidth={1.5} />,
  beauty: <Sparkles size={28} strokeWidth={1.5} />,
  home: <Home size={28} strokeWidth={1.5} />,
  jobs: <Briefcase size={28} strokeWidth={1.5} />,
  animals: <PawPrint size={28} strokeWidth={1.5} />,
  other: <Grid3X3 size={28} strokeWidth={1.5} />,
};

/* Motif SVG spécifique par catégorie */
const patternMap: Record<string, string> = {
  vehicles: "M10,30 Q20,10 30,30 Q40,50 50,30",
  phones: "M20,10 L20,40 Q20,50 30,50 Q40,50 40,40 L40,10",
  fashion: "M10,20 Q30,5 50,20 L45,45 Q30,55 15,45 Z",
  beauty: "M30,10 Q50,30 30,50 Q10,30 30,10",
  home: "M10,35 L30,10 L50,35 L50,50 L10,50 Z",
  jobs: "M15,15 L45,15 L45,45 L15,45 Z",
  animals: "M20,20 Q30,5 40,20 Q50,35 30,45 Q10,35 20,20",
  other: "M10,10 L50,10 L50,50 L10,50 Z",
};

export default function Categories() {
  const { t, isRTL, locale } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="py-16 bg-sand-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* En-tête section */}
        <div className={`flex items-end justify-between mb-10 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={isRTL ? "text-right" : ""}>
            <p className="text-sand-500 text-sm font-semibold uppercase tracking-widest mb-1">
              {isRTL ? "تصفح" : "Explorer"}
            </p>
            <h2 className="section-title">{t.categories.title}</h2>
            <p className="text-night-400/70 text-sm mt-1">{t.categories.subtitle}</p>
          </div>
          <Link
            href="/categories"
            className={`hidden sm:flex items-center gap-1.5 text-sand-500 text-sm font-semibold hover:gap-2.5 transition-all ${isRTL ? "flex-row-reverse" : ""}`}
          >
            {t.categories.seeAll}
            <Arrow size={16} />
          </Link>
        </div>

        {/* Grille catégories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat, index) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.id}`}
              className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                animationDelay: `${index * 80}ms`,
                animationFillMode: "forwards",
              }}
            >
              {/* Fond coloré */}
              <div
                className="relative p-5 h-36 flex flex-col justify-between overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${cat.color}dd 0%, ${cat.color}99 100%)`,
                }}
              >
                {/* Motif SVG décoratif */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-10 group-hover:opacity-20 transition-opacity"
                  viewBox="0 0 60 60"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <path
                    d={patternMap[cat.id] || patternMap.other}
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  />
                </svg>

                {/* Icône */}
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  {iconMap[cat.id]}
                </div>

                {/* Nombre d'annonces */}
                <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className="text-white/70 text-xs">
                    {cat.count.toLocaleString()} {isRTL ? "إعلان" : "annonces"}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Arrow size={12} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Nom catégorie */}
              <div
                className={`px-4 py-3 bg-white border-t border-sand-100 ${isRTL ? "text-right" : ""}`}
              >
                <span className={`text-sm font-semibold text-night-500 leading-tight ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? cat.nameAr : cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bouton voir tout — mobile */}
        <div className="mt-6 sm:hidden text-center">
          <Link href="/categories" className="btn-outline text-sm px-6 py-2.5">
            {t.categories.seeAll}
            <Arrow size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
