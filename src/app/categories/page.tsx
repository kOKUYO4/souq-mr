"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Car, Smartphone, Shirt, Sparkles, Home, Briefcase, PawPrint, Grid3X3, ArrowRight, ArrowLeft } from "lucide-react";
import { categories as mockCategories } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";
import IslamicPattern from "@/components/ui/IslamicPattern";

type Category = (typeof mockCategories)[number];

const iconMap: Record<string, React.ReactNode> = {
  vehicles: <Car size={32} strokeWidth={1.5} />,
  phones: <Smartphone size={32} strokeWidth={1.5} />,
  fashion: <Shirt size={32} strokeWidth={1.5} />,
  beauty: <Sparkles size={32} strokeWidth={1.5} />,
  home: <Home size={32} strokeWidth={1.5} />,
  jobs: <Briefcase size={32} strokeWidth={1.5} />,
  animals: <PawPrint size={32} strokeWidth={1.5} />,
  other: <Grid3X3 size={32} strokeWidth={1.5} />,
};

export default function CategoriesPage() {
  const { isRTL, locale } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const [categories, setCategories] = useState<Category[]>(mockCategories);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((json) => {
        if (Array.isArray(json.data) && json.data.length > 0) {
          setCategories(json.data as Category[]);
        }
      })
      .catch(() => {/* keep mockData */});
  }, []);

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* En-tête */}
      <div
        className="relative py-16 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}
      >
        <IslamicPattern opacity={0.05} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className={`text-4xl font-display font-bold text-white mb-3 ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "جميع الأقسام" : "Toutes les catégories"}
          </h1>
          <p className="text-sand-300/70">
            {isRTL ? "تصفح آلاف الإعلانات حسب القسم" : "Parcourez des milliers d'annonces par catégorie"}
          </p>
        </div>
      </div>

      {/* Grille */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.id}`}
              className="group bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              style={{ boxShadow: "0 2px 16px rgba(27,42,74,0.08)" }}
            >
              <div
                className="h-24 flex items-center justify-center text-white relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${cat.color}dd, ${cat.color}88)` }}
              >
                <div className="group-hover:scale-110 transition-transform">
                  {iconMap[cat.id]}
                </div>
              </div>
              <div className={`p-4 ${isRTL ? "text-right" : ""}`}>
                <h3 className={`font-bold text-night-500 mb-1 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? cat.nameAr : cat.name}
                </h3>
                <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className="text-sm text-night-400/60">
                    {cat.count.toLocaleString()} {isRTL ? "إعلان" : "annonces"}
                  </span>
                  <Arrow size={16} className="text-sand-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
