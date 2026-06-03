"use client";

import { useState } from "react";
import { BarChart3, Users, Tag, AlertTriangle, CheckCircle2, XCircle, Eye, TrendingUp, Settings, Bell, Search } from "lucide-react";
import { listings, sellers } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";

const stats = [
  { icon: Tag, value: "24,841", labelFr: "Annonces actives", labelAr: "إعلان نشط", change: "+12%", color: "#C9A84C" },
  { icon: Users, value: "8,234", labelFr: "Vendeurs inscrits", labelAr: "بائع مسجل", change: "+8%", color: "#2D6A4F" },
  { icon: BarChart3, value: "142K", labelFr: "Vues ce mois", labelAr: "مشاهدة هذا الشهر", change: "+24%", color: "#1B2A4A" },
  { icon: AlertTriangle, value: "23", labelFr: "Signalements", labelAr: "بلاغ", change: "-5%", color: "#E53E3E" },
];

export default function AdminPage() {
  const { isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<"overview" | "listings" | "users">("overview");

  return (
    <div className="min-h-screen bg-night-800 text-white">
      {/* Sidebar */}
      <div className={`fixed top-16 ${isRTL ? "right-0" : "left-0"} w-56 h-full bg-night-700 border-r border-night-600 z-30`}>
        <div className="p-4 border-b border-night-600">
          <p className="text-sand-400 text-xs font-semibold uppercase tracking-widest">
            {isRTL ? "لوحة التحكم" : "Dashboard Admin"}
          </p>
        </div>
        <nav className="p-3 space-y-1">
          {[
            { id: "overview", iconEl: BarChart3, labelFr: "Vue d'ensemble", labelAr: "نظرة عامة" },
            { id: "listings", iconEl: Tag, labelFr: "Annonces", labelAr: "الإعلانات" },
            { id: "users", iconEl: Users, labelFr: "Utilisateurs", labelAr: "المستخدمون" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as typeof activeTab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                activeTab === item.id ? "text-night-500 font-semibold" : "text-sand-300/70 hover:text-sand-300 hover:bg-night-600/50"
              } ${isRTL ? "flex-row-reverse" : ""}`}
              style={activeTab === item.id ? { background: "linear-gradient(135deg, #C9A84C, #B8922E)" } : undefined}
            >
              <item.iconEl size={16} />
              {isRTL ? item.labelAr : item.labelFr}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu */}
      <div className={`${isRTL ? "mr-56" : "ml-56"} p-6`}>
        {/* Header */}
        <div className={`flex items-center justify-between mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
          <h1 className="text-2xl font-display font-bold text-white">
            {isRTL ? "لوحة التحكم" : "Tableau de bord"}
          </h1>
          <div className="flex items-center gap-3">
            <button className="p-2 text-sand-300 hover:text-sand-400 relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-sand-400 rounded-full"></span>
            </button>
            <button className="p-2 text-sand-300 hover:text-sand-400">
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-night-700 rounded-2xl p-5 border border-night-600">
              <div className={`flex items-start justify-between mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: stat.color + "22" }}>
                  <stat.icon size={18} style={{ color: stat.color }} />
                </div>
                <span className={`text-xs font-semibold ${stat.change.startsWith("+") ? "text-islamic-300" : "text-red-400"}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-sand-400/60">{isRTL ? stat.labelAr : stat.labelFr}</p>
            </div>
          ))}
        </div>

        {/* Tableau annonces en attente */}
        <div className="bg-night-700 rounded-2xl border border-night-600 overflow-hidden">
          <div className={`flex items-center justify-between p-5 border-b border-night-600 ${isRTL ? "flex-row-reverse" : ""}`}>
            <h3 className="font-semibold text-white text-sm">
              {isRTL ? "الإعلانات في انتظار الموافقة" : "Annonces en attente de modération"}
            </h3>
            <span className="badge-gold text-xs">{listings.length} en attente</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-night-600">
                  {["Annonce", "Vendeur", "Prix", "Catégorie", "Actions"].map((h) => (
                    <th key={h} className={`px-5 py-3 text-xs text-sand-400/60 font-semibold uppercase tracking-wider ${isRTL ? "text-right" : "text-left"}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {listings.map((l, i) => (
                  <tr key={l.id} className="border-b border-night-600/50 hover:bg-night-600/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={l.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="text-white text-xs font-medium line-clamp-1 max-w-[150px]">{l.title}</p>
                          <p className="text-sand-400/50 text-[10px]">{l.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <img src={l.seller.avatar} alt="" className="w-7 h-7 rounded-full" />
                        <span className="text-sand-300 text-xs">{l.seller.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sand-400 font-bold text-xs">{l.price.toLocaleString()} MRU</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="badge-gold text-[10px]">{l.category}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg bg-islamic-400/20 text-islamic-300 hover:bg-islamic-400/30 transition-colors" title="Approuver">
                          <CheckCircle2 size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg bg-red-400/20 text-red-300 hover:bg-red-400/30 transition-colors" title="Rejeter">
                          <XCircle size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg bg-sand-400/20 text-sand-300 hover:bg-sand-400/30 transition-colors" title="Voir">
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
