"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye, MessageCircle, Tag, TrendingUp, Star, Edit3, Pause, Play,
  Trash2, Zap, Plus, BarChart3, CheckCircle2, Clock, XCircle,
  ChevronUp, ChevronDown, ArrowRight, Lock, Loader2,
} from "lucide-react";
import { listings, sellerStats, formatPrice, sellers } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import IslamicPattern from "@/components/ui/IslamicPattern";

const currentSeller = sellers[0];

type ListingStatus = "active" | "paused" | "sold";
const statuses: ListingStatus[] = ["active", "paused", "sold"];

export default function TableauDeBordPage() {
  const { isRTL, locale } = useLanguage();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "listings" | "messages" | "stats">("overview");
  const [listingFilter, setListingFilter] = useState<"all" | ListingStatus>("all");
  const [boostTarget, setBoostTarget] = useState<string | null>(null);
  const [boostedIds, setBoostedIds] = useState<Set<string>>(new Set(["l1"]));

  if (authLoading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-sand-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-sand-gradient flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full shadow-card">
          <div className="w-14 h-14 rounded-full bg-sand-100 flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-sand-400" />
          </div>
          <h2 className="text-lg font-bold text-night-500 mb-2">
            {isRTL ? "تسجيل الدخول مطلوب" : "Connexion requise"}
          </h2>
          <p className="text-sm text-night-400/70 mb-6">
            {isRTL ? "يجب تسجيل الدخول للوصول إلى لوحة التحكم" : "Connectez-vous pour accéder à votre tableau de bord"}
          </p>
          <Link href="/connexion" className="btn-gold w-full justify-center">
            {isRTL ? "تسجيل الدخول" : "Se connecter"}
          </Link>
        </div>
      </div>
    );
  }

  const myListings = listings.slice(0, 6).map((l, i) => ({
    ...l,
    status: (["active", "active", "active", "paused", "sold", "active"][i]) as ListingStatus,
    boosted: boostedIds.has(l.id),
    offers: [3, 0, 1, 0, 2, 0][i],
    messages: [7, 2, 4, 1, 0, 3][i],
  }));

  const filtered = listingFilter === "all" ? myListings : myListings.filter((l) => l.status === listingFilter);

  const kpis = [
    {
      icon: Eye,
      value: sellerStats.totalViews.toLocaleString(),
      labelFr: "Vues totales", labelAr: "إجمالي المشاهدات",
      change: +18,
      color: "#C9A84C",
    },
    {
      icon: Tag,
      value: `${sellerStats.activeListings}/${sellerStats.totalListings}`,
      labelFr: "Annonces actives", labelAr: "الإعلانات النشطة",
      change: +2,
      color: "#2D6A4F",
    },
    {
      icon: MessageCircle,
      value: sellerStats.totalMessages,
      labelFr: "Messages reçus", labelAr: "الرسائل المستلمة",
      change: +5,
      color: "#1B2A4A",
    },
    {
      icon: TrendingUp,
      value: `${formatPrice(sellerStats.revenue)} MRU`,
      labelFr: "Revenus estimés", labelAr: "الإيرادات المقدّرة",
      change: +24,
      color: "#B8922E",
    },
  ];

  const statusConfig = {
    active: { fr: "Active", ar: "نشط", color: "bg-islamic-50 text-islamic-400", dot: "bg-islamic-400" },
    paused: { fr: "En pause", ar: "موقوف", color: "bg-sand-100 text-sand-600", dot: "bg-sand-400" },
    sold: { fr: "Vendu", ar: "مباع", color: "bg-night-50 text-night-400", dot: "bg-night-400" },
  };

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div
        className="relative py-10 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}
      >
        <IslamicPattern opacity={0.05} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              <img src={currentSeller.avatar} alt="" className="w-14 h-14 rounded-full bg-sand-100 border-2 border-sand-400/30" />
              <div className={isRTL ? "text-right" : ""}>
                <p className="text-sand-400/70 text-xs uppercase tracking-widest mb-0.5">
                  {isRTL ? "لوحة التحكم" : "Tableau de bord"}
                </p>
                <h1 className="text-white text-xl font-display font-bold">
                  {isRTL ? currentSeller.nameAr : currentSeller.name}
                </h1>
                <div className={`flex items-center gap-1.5 mt-0.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <CheckCircle2 size={12} className="text-islamic-300" />
                  <span className="text-islamic-300 text-xs">
                    {isRTL ? "بائع موثق" : "Vendeur vérifié"}
                  </span>
                  <span className="text-sand-400/40">·</span>
                  <Star size={12} className="text-sand-400 fill-sand-400" />
                  <span className="text-sand-300 text-xs">{currentSeller.rating}</span>
                </div>
              </div>
            </div>
            <Link href="/vendre" className="btn-gold text-sm py-2.5 px-5 hidden sm:flex gap-1.5">
              <Plus size={15} />
              {isRTL ? "إعلان جديد" : "Nouvelle annonce"}
            </Link>
          </div>

          {/* Onglets */}
          <div className={`flex gap-1 mt-7 ${isRTL ? "flex-row-reverse" : ""}`}>
            {[
              { id: "overview", fr: "Vue d'ensemble", ar: "نظرة عامة" },
              { id: "listings", fr: "Mes annonces", ar: "إعلاناتي" },
              { id: "messages", fr: "Messages", ar: "الرسائل" },
              { id: "stats", fr: "Statistiques", ar: "الإحصائيات" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-night-500"
                    : "text-sand-300/70 hover:text-sand-300 hover:bg-white/10"
                }`}
              >
                {isRTL ? tab.ar : tab.fr}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* === VUE D'ENSEMBLE === */}
        {activeTab === "overview" && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((kpi, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-card">
                  <div className={`flex items-start justify-between mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: kpi.color + "18" }}>
                      <kpi.icon size={18} style={{ color: kpi.color }} />
                    </div>
                    <span className={`flex items-center gap-0.5 text-xs font-semibold ${kpi.change > 0 ? "text-islamic-400" : "text-red-400"}`}>
                      {kpi.change > 0 ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      {Math.abs(kpi.change)}%
                    </span>
                  </div>
                  <p className="text-xl font-bold text-night-500 mb-0.5">{kpi.value}</p>
                  <p className="text-xs text-night-400/60">{isRTL ? kpi.labelAr : kpi.labelFr}</p>
                </div>
              ))}
            </div>

            {/* Annonces récentes + Actions rapides */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Mes 3 dernières annonces */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-card overflow-hidden">
                <div className={`flex items-center justify-between px-5 py-4 border-b border-sand-100 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <h3 className="font-bold text-night-500 text-sm">
                    {isRTL ? "آخر إعلاناتي" : "Mes dernières annonces"}
                  </h3>
                  <button onClick={() => setActiveTab("listings")} className="text-xs text-sand-500 font-semibold hover:underline">
                    {isRTL ? "عرض الكل" : "Tout voir"}
                  </button>
                </div>
                <div className="divide-y divide-sand-50">
                  {myListings.slice(0, 3).map((l) => (
                    <div key={l.id} className={`flex items-center gap-3 px-5 py-3.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <img src={l.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover bg-sand-100 flex-shrink-0" />
                      <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}>
                        <p className="text-sm font-semibold text-night-500 truncate">
                          {isRTL ? l.titleAr : l.title}
                        </p>
                        <div className={`flex items-center gap-3 mt-0.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <span className="text-xs font-bold text-sand-500">{formatPrice(l.price)} MRU</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusConfig[l.status].color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[l.status].dot}`} />
                            {isRTL ? statusConfig[l.status].ar : statusConfig[l.status].fr}
                          </span>
                        </div>
                      </div>
                      <div className={`flex items-center gap-3 text-xs text-night-400/50 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <span className="flex items-center gap-1"><Eye size={11} />{l.views}</span>
                        <span className="flex items-center gap-1"><MessageCircle size={11} />{l.messages}</span>
                        {l.offers > 0 && (
                          <span className="flex items-center gap-1 text-sand-500"><Tag size={11} />{l.offers}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions rapides */}
              <div className="space-y-3">
                <h3 className={`font-bold text-night-500 text-sm ${isRTL ? "text-right" : ""}`}>
                  {isRTL ? "إجراءات سريعة" : "Actions rapides"}
                </h3>
                {[
                  { icon: Plus, fr: "Déposer une annonce", ar: "أضف إعلاناً", href: "/vendre", style: "btn-gold" },
                  { icon: Zap, fr: "Booster une annonce", ar: "عزّز إعلاناً", href: "#", style: "btn-night" },
                  { icon: MessageCircle, fr: "Voir les messages", ar: "اعرض الرسائل", href: "/messages", style: "btn-outline" },
                ].map((action, i) => (
                  <Link key={i} href={action.href} className={`${action.style} w-full py-3 text-sm justify-between`}>
                    <span className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <action.icon size={16} />
                      {isRTL ? action.ar : action.fr}
                    </span>
                    <ArrowRight size={14} className={isRTL ? "rotate-180" : ""} />
                  </Link>
                ))}

                {/* Conseil booster */}
                <div className="bg-sand-50 border border-sand-200 rounded-xl p-4">
                  <p className={`text-xs font-semibold text-night-500 mb-1 flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                    ⚡ {isRTL ? "نصيحة" : "Conseil"}
                  </p>
                  <p className={`text-xs text-night-400/70 ${isRTL ? "text-right" : ""}`}>
                    {isRTL
                      ? "الإعلانات المعززة تحصل على 3× مشاهدات أكثر"
                      : "Les annonces boostées reçoivent 3× plus de vues en moyenne"}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* === MES ANNONCES === */}
        {activeTab === "listings" && (
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            {/* Filtres statut */}
            <div className={`flex items-center justify-between px-5 py-4 border-b border-sand-100 flex-wrap gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className={`flex gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                {(["all", ...statuses] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setListingFilter(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      listingFilter === s
                        ? "text-night-500"
                        : "text-night-400/60 hover:bg-sand-50"
                    }`}
                    style={listingFilter === s ? { background: "linear-gradient(135deg, #C9A84C, #B8922E)" } : undefined}
                  >
                    {s === "all"
                      ? (isRTL ? "الكل" : "Tout")
                      : (isRTL ? statusConfig[s].ar : statusConfig[s].fr)}
                    {" "}
                    ({s === "all" ? myListings.length : myListings.filter((l) => l.status === s).length})
                  </button>
                ))}
              </div>
              <Link href="/vendre" className="btn-gold text-xs py-2 px-4 gap-1">
                <Plus size={13} />
                {isRTL ? "جديد" : "Nouvelle"}
              </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sand-100">
                    {["Annonce", "Prix", "Statut", "Vues", "Msgs", "Offres", "Actions"].map((h) => (
                      <th key={h} className={`px-5 py-3 text-xs text-night-400/60 font-semibold uppercase tracking-wider whitespace-nowrap ${isRTL ? "text-right" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-50">
                  {filtered.map((l) => (
                    <tr key={l.id} className="hover:bg-sand-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <img src={l.images[0]} alt="" className="w-11 h-11 rounded-xl object-cover bg-sand-100 flex-shrink-0" />
                          <div className={isRTL ? "text-right" : ""}>
                            <p className="text-sm font-semibold text-night-500 line-clamp-1 max-w-[180px]">
                              {isRTL ? l.titleAr : l.title}
                            </p>
                            <p className="text-xs text-night-400/50">{l.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="text-sm font-bold text-sand-500">{formatPrice(l.price)}</span>
                        <span className="text-xs text-night-400/50 ml-1">MRU</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[l.status].color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[l.status].dot}`} />
                          {isRTL ? statusConfig[l.status].ar : statusConfig[l.status].fr}
                        </span>
                        {l.boosted && (
                          <span className="ml-1.5 text-[10px] text-sand-500 font-bold">⚡ Boost</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-night-400/70">{l.views.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-sm text-night-400/70">{l.messages}</td>
                      <td className="px-5 py-3.5">
                        {l.offers > 0 ? (
                          <span className="text-sm font-bold text-sand-500">{l.offers}</span>
                        ) : (
                          <span className="text-sm text-night-400/30">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-lg text-night-400/60 hover:text-sand-500 hover:bg-sand-50 transition-all" title={isRTL ? "تعديل" : "Modifier"}>
                            <Edit3 size={14} />
                          </button>
                          <button className="p-1.5 rounded-lg text-night-400/60 hover:text-night-500 hover:bg-sand-50 transition-all" title={l.status === "active" ? (isRTL ? "إيقاف" : "Mettre en pause") : (isRTL ? "تفعيل" : "Activer")}>
                            {l.status === "active" ? <Pause size={14} /> : <Play size={14} />}
                          </button>
                          <button
                            onClick={() => !l.boosted && setBoostTarget(l.id)}
                            className={`p-1.5 rounded-lg transition-all ${l.boosted ? "text-sand-500 bg-sand-50 cursor-default" : "text-night-400/60 hover:text-sand-500 hover:bg-sand-50"}`}
                            title={l.boosted ? (isRTL ? "مُعزَّز" : "Boosté") : "Boost"}
                          >
                            <Zap size={14} className={l.boosted ? "fill-sand-400" : ""} />
                          </button>
                          <button className="p-1.5 rounded-lg text-night-400/60 hover:text-red-500 hover:bg-red-50 transition-all" title={isRTL ? "حذف" : "Supprimer"}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* === STATISTIQUES === */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className={`font-bold text-night-500 mb-6 ${isRTL ? "text-right" : ""}`}>
                {isRTL ? "المشاهدات الشهرية" : "Vues mensuelles"}
              </h3>
              {/* Mini graphique à barres */}
              <div className={`flex items-end gap-1.5 h-32 ${isRTL ? "flex-row-reverse" : ""}`}>
                {sellerStats.viewsChart.map((val, i) => {
                  const max = Math.max(...sellerStats.viewsChart);
                  const height = (val / max) * 100;
                  const isCurrentMonth = i === new Date().getMonth();
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="relative group w-full">
                        <div
                          className="w-full rounded-t-lg transition-all"
                          style={{
                            height: `${height * 1.2}px`,
                            background: isCurrentMonth
                              ? "linear-gradient(180deg, #C9A84C, #B8922E)"
                              : "#EBD9B0",
                          }}
                        />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-night-500 text-white text-[10px] px-2 py-1 rounded-lg whitespace-nowrap pointer-events-none">
                          {val.toLocaleString()}
                        </div>
                      </div>
                      <span className="text-[9px] text-night-400/50">{sellerStats.months[i].slice(0, 3)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats par annonce */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-sand-100">
                <h3 className={`font-bold text-night-500 text-sm ${isRTL ? "text-right" : ""}`}>
                  {isRTL ? "أداء الإعلانات" : "Performance par annonce"}
                </h3>
              </div>
              <div className="divide-y divide-sand-50">
                {myListings.filter((l) => l.status === "active").map((l) => (
                  <div key={l.id} className={`flex items-center gap-4 px-5 py-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <img src={l.images[0]} alt="" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                    <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}>
                      <p className="text-sm font-semibold text-night-500 truncate">{isRTL ? l.titleAr : l.title}</p>
                      {/* Barre de popularité */}
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-sand-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min((l.views / 1500) * 100, 100)}%`,
                              background: "linear-gradient(90deg, #C9A84C, #B8922E)",
                            }}
                          />
                        </div>
                        <span className="text-xs text-night-400/60">{l.views} vues</span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-4 text-xs text-night-400/60 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <span className="flex items-center gap-1"><MessageCircle size={11} />{l.messages}</span>
                      {l.offers > 0 && <span className="flex items-center gap-1 text-sand-500 font-semibold"><Tag size={11} />{l.offers}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === MESSAGES === */}
        {activeTab === "messages" && (
          <div className="bg-white rounded-2xl shadow-card p-6 text-center">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-night-500 mb-2">
              {isRTL ? "انتقل إلى الرسائل" : "Accéder à la messagerie"}
            </h3>
            <Link href="/messages" className="btn-gold inline-flex mt-4 px-8 py-3">
              {isRTL ? "فتح الرسائل" : "Ouvrir la messagerie"}
            </Link>
          </div>
        )}
      </div>

      {/* ── BOOST MODAL ── */}
      {boostTarget && (() => {
        const listing = myListings.find((l) => l.id === boostTarget);
        if (!listing) return null;
        const boostPlans = [
          { days: 3, price: 990, multiplier: 2, labelFr: "3 jours", labelAr: "3 أيام" },
          { days: 7, price: 1990, multiplier: 3, labelFr: "7 jours", labelAr: "7 أيام", popular: true },
          { days: 30, price: 5990, multiplier: 5, labelFr: "30 jours", labelAr: "30 يوماً" },
        ];
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night-800/80 backdrop-blur-sm" onClick={() => setBoostTarget(null)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-gold-lg" onClick={(e) => e.stopPropagation()}>
              <div className={`flex items-start justify-between mb-5 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className={isRTL ? "text-right" : ""}>
                  <h3 className="font-bold text-night-500 text-lg">
                    {isRTL ? "⚡ عزّز إعلانك" : "⚡ Booster l'annonce"}
                  </h3>
                  <p className="text-xs text-night-400/60 mt-0.5 line-clamp-1 max-w-[200px]">
                    {isRTL ? listing.titleAr : listing.title}
                  </p>
                </div>
                <button onClick={() => setBoostTarget(null)} className="p-1 text-night-400/50 hover:text-night-500 transition-colors">
                  <XCircle size={20} />
                </button>
              </div>

              <div className="bg-sand-50 rounded-xl p-3 mb-5 flex items-center gap-3">
                <img src={listing.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <div>
                  <p className="text-xs text-night-400/60">{isRTL ? "الإعلان الحالي" : "Annonce sélectionnée"}</p>
                  <p className="text-sm font-semibold text-night-500 line-clamp-1">{isRTL ? listing.titleAr : listing.title}</p>
                  <p className="text-xs text-sand-500 font-bold">{listing.price.toLocaleString()} MRU</p>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                {boostPlans.map((plan) => (
                  <button
                    key={plan.days}
                    onClick={() => {
                      setBoostedIds((prev) => { const n = new Set(Array.from(prev)); n.add(boostTarget!); return n; });
                      setBoostTarget(null);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:-translate-y-0.5 ${
                      plan.popular ? "border-sand-400 bg-sand-50" : "border-sand-100 hover:border-sand-300"
                    } ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-night-500"
                        style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                        <Zap size={18} />
                      </div>
                      <div className={isRTL ? "text-right" : ""}>
                        <p className="font-bold text-night-500 text-sm">{isRTL ? plan.labelAr : plan.labelFr}</p>
                        <p className="text-xs text-night-400/60">
                          {isRTL ? `×${plan.multiplier} مشاهدات` : `×${plan.multiplier} vues`}
                          {plan.popular && <span className="ml-2 text-sand-500 font-semibold">{isRTL ? "الأفضل" : "Populaire"}</span>}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-sand-500 text-sm">{plan.price.toLocaleString()} MRU</span>
                  </button>
                ))}
              </div>

              <p className="text-center text-xs text-night-400/50">
                {isRTL ? "سيُفعَّل الدفع في الإصدار القادم" : "Paiement disponible prochainement"}
              </p>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
