"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Scale, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import IslamicPattern from "@/components/ui/IslamicPattern";

function formatPrice(n: number) { return n?.toLocaleString() ?? ""; }

function CompareContent() {
  const { isRTL, locale } = useLanguage();
  const searchParams = useSearchParams();
  const ids = (searchParams.get("ids") || "").split(",").filter(Boolean).slice(0, 3);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(ids.length > 0);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  useEffect(() => {
    if (ids.length === 0) { setLoading(false); return; }
    Promise.all(ids.map((id) => fetch(`/api/listings/${id}`).then((r) => r.json()).then((j) => j.data ?? j)))
      .then((results) => setItems(results.filter(Boolean)))
      .catch(() => {})
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("ids")]);

  if (loading) return <div className="min-h-screen bg-sand-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-sand-200 border-t-sand-400 rounded-full animate-spin" /></div>;

  if (items.length < 2) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">⚖️</div>
          <h2 className={`text-xl font-bold text-night-500 mb-2 ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "اختر إعلانين على الأقل للمقارنة" : "Sélectionnez au moins 2 annonces à comparer"}
          </h2>
          <p className={`text-night-400/60 text-sm mb-6 ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "استخدم زر «المقارنة» على بطاقات الإعلانات" : "Utilisez le bouton «Comparer» sur les fiches annonces"}
          </p>
          <Link href="/annonces" className="btn-gold text-sm py-2.5 px-6">
            {isRTL ? "تصفح الإعلانات" : "Parcourir les annonces"}
          </Link>
        </div>
      </div>
    );
  }

  // Collect all attribute keys across all items
  const allAttrKeys = Array.from(
    new Set(items.flatMap((l) => Object.keys(l.attributes || {})))
  );

  const rows: { labelFr: string; labelAr: string; key: string; getValue: (l: any) => string | null }[] = [
    { key: "price", labelFr: "Prix", labelAr: "السعر", getValue: (l) => `${l.price?.toLocaleString()} MRU` },
    { key: "condition", labelFr: "État", labelAr: "الحالة", getValue: (l) => l.condition === "new" ? (locale === "fr" ? "Neuf" : "جديد") : (locale === "fr" ? "Occasion" : "مستعمل") },
    { key: "location", labelFr: "Lieu", labelAr: "الموقع", getValue: (l) => l.location },
    { key: "negotiable", labelFr: "Négociable", labelAr: "قابل للتفاوض", getValue: (l) => l.negotiable ? "✓" : "✗" },
    { key: "cod", labelFr: "Livraison", labelAr: "توصيل", getValue: (l) => l.cod ? "✓" : "✗" },
    ...allAttrKeys.map((k) => ({
      key: k, labelFr: k.charAt(0).toUpperCase() + k.slice(1), labelAr: k,
      getValue: (l: any) => l.attributes?.[k] ?? null,
    })),
  ];

  const lowestPrice = Math.min(...items.map((l) => l.price));

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="relative py-12 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.05} />
        <div className={`relative max-w-5xl mx-auto px-4 sm:px-6 ${isRTL ? "text-right" : ""}`}>
          <div className={`flex items-center gap-3 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="w-10 h-10 rounded-xl bg-sand-400/20 flex items-center justify-center">
              <Scale size={20} className="text-sand-400" />
            </div>
            <h1 className={`text-2xl font-display font-bold text-white ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "مقارنة الإعلانات" : "Comparer les annonces"}
            </h1>
          </div>
          <p className={`text-sand-300/60 text-sm ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? `تقييم ${items.length} إعلانات جنباً إلى جنب` : `${items.length} annonces évaluées côte à côte`}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Cartes produits en haut */}
        <div className={`grid gap-4 mb-8`} style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
          {items.map((item) => (
            <div key={item.id} className={`bg-white rounded-2xl overflow-hidden shadow-card ${item.price === lowestPrice ? "ring-2 ring-sand-400" : ""}`}>
              {item.price === lowestPrice && (
                <div className="py-1.5 text-center text-xs font-bold text-night-500"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                  {isRTL ? "⭐ أفضل سعر" : "⭐ Meilleur prix"}
                </div>
              )}
              <img src={item.images?.[0]} alt="" className="w-full h-36 object-cover" />
              <div className={`p-4 ${isRTL ? "text-right" : ""}`}>
                <p className={`text-sm font-semibold text-night-500 line-clamp-2 mb-2 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? (item.title_ar || item.titleAr) : item.title}
                </p>
                <p className="text-lg font-bold text-sand-500">{item.price.toLocaleString()} MRU</p>
                <Link href={`/annonce/${item.id}`}
                  className={`mt-3 flex items-center gap-1.5 text-xs font-semibold text-sand-500 hover:text-sand-600 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                  {isRTL ? "عرض الإعلان" : "Voir l'annonce"}
                  <Arrow size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Tableau comparatif */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-sand-100">
            <h2 className={`font-bold text-night-500 ${isRTL ? "font-arabic text-right" : ""}`}>
              {isRTL ? "جدول المقارنة" : "Tableau comparatif"}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-sand-50 border-b border-sand-100">
                  <th className={`px-5 py-3 text-xs font-semibold text-night-400/60 w-40 ${isRTL ? "text-right" : "text-left"}`}>
                    {isRTL ? "الخاصية" : "Caractéristique"}
                  </th>
                  {items.map((item) => (
                    <th key={item.id} className={`px-4 py-3 text-xs font-semibold text-night-500 ${isRTL ? "text-right" : "text-left"}`}>
                      <span className={`line-clamp-1 ${isRTL ? "font-arabic" : ""}`}>
                        {isRTL ? (item.title_ar || item.titleAr) : item.title}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const values = items.map((item) => row.getValue(item));
                  const hasData = values.some((v) => v !== null && v !== "");
                  if (!hasData) return null;

                  return (
                    <tr key={row.key} className={`border-b border-sand-50 ${i % 2 === 0 ? "" : "bg-sand-50/30"}`}>
                      <td className={`px-5 py-3 text-xs font-semibold text-night-400 ${isRTL ? "text-right font-arabic" : ""}`}>
                        {isRTL ? row.labelAr : row.labelFr}
                      </td>
                      {values.map((val, j) => (
                        <td key={j} className={`px-4 py-3 text-sm ${isRTL ? "text-right font-arabic" : ""}`}>
                          {val === "✓" ? (
                            <CheckCircle2 size={16} className="text-islamic-400" />
                          ) : val === "✗" ? (
                            <XCircle size={16} className="text-red-400/60" />
                          ) : (
                            <span className={`text-night-500 ${row.key === "price" ? "font-bold text-sand-500" : ""}`}>
                              {val ?? <span className="text-night-400/30">—</span>}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA bas */}
        <div className={`flex flex-wrap gap-3 mt-6 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Link href="/annonces" className={`flex items-center gap-2 text-sm text-night-400 hover:text-sand-500 font-semibold ${isRTL ? "flex-row-reverse" : ""}`}>
            {isRTL ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
            {isRTL ? "العودة للإعلانات" : "Retour aux annonces"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ComparerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-sand-50" />}>
      <CompareContent />
    </Suspense>
  );
}
