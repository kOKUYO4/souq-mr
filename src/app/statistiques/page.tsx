"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, BarChart3, Users, Tag, MapPin, Eye } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { categories } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";

function formatPrice(n: number) { return n?.toLocaleString() ?? "0"; }

const weeklyData = [
  { day: { fr: "Lun", ar: "الإث" }, listings: 142, sales: 28 },
  { day: { fr: "Mar", ar: "الثل" }, listings: 198, sales: 41 },
  { day: { fr: "Mer", ar: "الأر" }, listings: 167, sales: 35 },
  { day: { fr: "Jeu", ar: "الخم" }, listings: 220, sales: 52 },
  { day: { fr: "Ven", ar: "الجم" }, listings: 310, sales: 78 },
  { day: { fr: "Sam", ar: "الست" }, listings: 289, sales: 64 },
  { day: { fr: "Dim", ar: "الأح" }, listings: 175, sales: 38 },
];
const maxListings = Math.max(...weeklyData.map((d) => d.listings));

const priceRanges = [
  { labelFr: "< 10K MRU", labelAr: "أقل من 10,000", pct: 28, count: 1120 },
  { labelFr: "10K – 50K", labelAr: "10,000 – 50,000", pct: 35, count: 1400 },
  { labelFr: "50K – 200K", labelAr: "50,000 – 200,000", pct: 22, count: 880 },
  { labelFr: "200K – 1M", labelAr: "200,000 – 1,000,000", pct: 10, count: 400 },
  { labelFr: "> 1M MRU", labelAr: "أكثر من 1,000,000", pct: 5, count: 200 },
];

const locationStats = [
  { city: { fr: "Nouakchott", ar: "نواكشوط" }, count: 3241, pct: 62 },
  { city: { fr: "Nouadhibou", ar: "نواذيبو" }, count: 687, pct: 13 },
  { city: { fr: "Rosso", ar: "روصو" }, count: 312, pct: 6 },
  { city: { fr: "Kiffa", ar: "كيفة" }, count: 261, pct: 5 },
  { city: { fr: "Autres", ar: "مدن أخرى" }, count: 732, pct: 14 },
];

export default function StatistiquesPage() {
  const { isRTL, locale } = useLanguage();
  const [chartType, setChartType] = useState<"listings" | "sales">("listings");
  const [popularListings, setPopularListings] = useState<any[]>([]);
  const [avgPrice, setAvgPrice] = useState(0);

  useEffect(() => {
    fetch("/api/listings?limit=10&sort=popular")
      .then((r) => r.json())
      .then((json) => {
        const data = json.data?.listings ?? json.listings ?? [];
        setPopularListings(data);
        if (data.length > 0) {
          setAvgPrice(Math.round(data.reduce((s: number, l: any) => s + (l.price ?? 0), 0) / data.length));
        }
      })
      .catch(() => {});
  }, []);

  // Category distribution using static categories (counts are approximate from known data)
  const catCounts = categories.map((cat, i) => ({
    ...cat,
    count: [320, 280, 210, 185, 150, 120][i] ?? 50,
    pct: [22, 19, 15, 13, 10, 8][i] ?? 5,
  })).slice(0, 6);

  const kpis = [
    { icon: Tag, n: "52 341", label: { fr: "Annonces actives", ar: "إعلانات نشطة" }, change: +18, color: "#C9A84C" },
    { icon: Users, n: "198 400", label: { fr: "Utilisateurs inscrits", ar: "مستخدم مسجل" }, change: +24, color: "#2D6A4F" },
    { icon: BarChart3, n: avgPrice ? formatPrice(avgPrice) : "—", label: { fr: "Prix moyen (MRU)", ar: "متوسط السعر (أوقية)" }, change: +7, color: "#9B4B8A" },
    { icon: Eye, n: "1.2M", label: { fr: "Vues / jour", ar: "مشاهدة / يوم" }, change: +31, color: "#1B2A4A" },
  ];

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Header */}
      <div className="relative py-14 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.05} />
        <div className={`relative max-w-5xl mx-auto px-4 sm:px-6 ${isRTL ? "text-right font-arabic" : ""}`}>
          <div className={`flex items-center gap-3 mb-3 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
            <BarChart3 size={24} className="text-sand-400" />
            <h1 className="text-3xl font-display font-bold text-white">
              {isRTL ? "إحصائيات السوق" : "Statistiques du marché"}
            </h1>
          </div>
          <p className="text-sand-300/70 text-sm">
            {isRTL ? "بيانات وتحليلات سوق.مر — محدّثة يومياً" : "Données et analyses SOUQ.MR — mises à jour quotidiennement"}
          </p>
          <div className={`mt-3 flex items-center gap-2 text-xs text-sand-400/60 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
            <div className="w-2 h-2 bg-islamic-400 rounded-full animate-pulse" />
            {isRTL ? "آخر تحديث: الآن" : "Dernière mise à jour : maintenant"}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-card">
              <div className={`flex items-center justify-between mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${kpi.color}15` }}>
                  <kpi.icon size={18} style={{ color: kpi.color }} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${kpi.change > 0 ? "text-islamic-500" : "text-red-500"} ${isRTL ? "flex-row-reverse" : ""}`}>
                  {kpi.change > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  +{kpi.change}%
                </div>
              </div>
              <p className="text-xl font-display font-bold text-night-500">{kpi.n}</p>
              <p className={`text-xs text-night-400/60 mt-0.5 ${isRTL ? "text-right font-arabic" : ""}`}>{kpi.label[locale]}</p>
            </div>
          ))}
        </div>

        {/* Weekly bar chart */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className={`flex items-center justify-between mb-5 ${isRTL ? "flex-row-reverse" : ""}`}>
            <h2 className={`font-bold text-night-500 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "النشاط الأسبوعي" : "Activité de la semaine"}
            </h2>
            <div className={`flex gap-1 bg-sand-100 rounded-xl p-1 ${isRTL ? "flex-row-reverse" : ""}`}>
              {(["listings", "sales"] as const).map((t) => (
                <button key={t} onClick={() => setChartType(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    chartType === t ? "bg-white text-night-500 shadow-sm" : "text-night-400/60"
                  } ${isRTL ? "font-arabic" : ""}`}>
                  {t === "listings" ? (isRTL ? "إعلانات" : "Annonces") : (isRTL ? "مبيعات" : "Ventes")}
                </button>
              ))}
            </div>
          </div>
          <div className={`flex items-end gap-3 h-40 ${isRTL ? "flex-row-reverse" : ""}`}>
            {weeklyData.map((d, i) => {
              const value = chartType === "listings" ? d.listings : d.sales;
              const max = chartType === "listings" ? maxListings : Math.max(...weeklyData.map((x) => x.sales));
              const height = Math.round((value / max) * 100);
              const isToday = i === 4; // Friday peak
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-semibold text-night-400/60">{value}</span>
                  <div className="w-full flex items-end justify-center" style={{ height: 100 }}>
                    <div
                      className="w-full rounded-t-xl transition-all"
                      style={{
                        height: `${height}%`,
                        background: isToday ? "linear-gradient(to top, #C9A84C, #E8C96A)" : "linear-gradient(to top, #E8E3DA, #F0EBE0)",
                        minHeight: 4,
                      }}
                    />
                  </div>
                  <span className={`text-xs text-night-400/50 ${isRTL ? "font-arabic" : ""}`}>{d.day[locale]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category distribution */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <h2 className={`font-bold text-night-500 mb-5 ${isRTL ? "font-arabic text-right" : ""}`}>
              {isRTL ? "توزيع الفئات" : "Répartition par catégorie"}
            </h2>
            <div className="space-y-3">
              {catCounts.map((cat, i) => (
                <div key={cat.id}>
                  <div className={`flex items-center justify-between mb-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className={`text-xs text-night-500 flex items-center gap-1.5 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
                        {isRTL ? cat.nameAr : cat.name}
                    </span>
                    <span className="text-xs text-night-400/60">{cat.count} ({cat.pct}%)</span>
                  </div>
                  <div className="h-2 bg-sand-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{
                        width: `${cat.pct}%`,
                        background: ["#C9A84C","#2D6A4F","#9B4B8A","#1B2A4A","#E53E3E","#3182CE"][i],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-card">
            <h2 className={`font-bold text-night-500 mb-5 ${isRTL ? "font-arabic text-right" : ""}`}>
              {isRTL ? "توزيع بالمدينة" : "Répartition par ville"}
            </h2>
            <div className="space-y-3">
              {locationStats.map((loc, i) => (
                <div key={i}>
                  <div className={`flex items-center justify-between mb-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className={`text-xs text-night-500 flex items-center gap-1.5 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
                      <MapPin size={10} />
                      {loc.city[locale]}
                    </span>
                    <span className="text-xs text-night-400/60">{loc.count.toLocaleString()} ({loc.pct}%)</span>
                  </div>
                  <div className="h-2 bg-sand-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${loc.pct}%`, background: "linear-gradient(90deg, #C9A84C, #E8C96A)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Price distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className={`font-bold text-night-500 mb-5 ${isRTL ? "font-arabic text-right" : ""}`}>
            {isRTL ? "توزيع نطاقات الأسعار" : "Distribution des tranches de prix"}
          </h2>
          <div className="space-y-3">
            {priceRanges.map((range, i) => (
              <div key={i} className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className={`text-xs text-night-500 w-32 flex-shrink-0 ${isRTL ? "text-right font-arabic" : ""}`}>
                  {isRTL ? range.labelAr : range.labelFr}
                </span>
                <div className="flex-1 h-5 bg-sand-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full flex items-center justify-end pr-2 transition-all"
                    style={{ width: `${range.pct}%`, background: "linear-gradient(90deg, #1B2A4A, #2D4A7A)" }}>
                    <span className="text-[10px] font-bold text-sand-300">{range.pct}%</span>
                  </div>
                </div>
                <span className="text-xs text-night-400/50 w-16 text-right flex-shrink-0">{range.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
