"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3, Users, Tag, AlertTriangle, CheckCircle2, XCircle, Eye,
  TrendingUp, Settings, Bell, Search, Shield, Lock, Loader2,
  UserCheck, UserX, Star, MapPin, Calendar, ChevronUp,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

interface Seller {
  id: string;
  name: string;
  nameAr: string;
  avatar: string;
  badge: "verified" | "pro" | "regular";
  rating: number;
  reviews: number;
  listings: number;
  joinedAt: string;
  phone: string;
}

interface Listing {
  id: string;
  title: string;
  titleAr: string;
  price: number;
  category: string;
  location: string;
  images: string[];
  seller: { name: string; avatar: string };
}

interface AdminUser extends Seller {
  status: string;
  totalSales: number;
  joinedStr: string;
}

const stats = [
  { icon: Tag, value: "24,841", labelFr: "Annonces actives", labelAr: "إعلان نشط", change: "+12%", positive: true, color: "#C9A84C" },
  { icon: Users, value: "8,234", labelFr: "Vendeurs inscrits", labelAr: "بائع مسجل", change: "+8%", positive: true, color: "#2D6A4F" },
  { icon: BarChart3, value: "142K", labelFr: "Vues ce mois", labelAr: "مشاهدة هذا الشهر", change: "+24%", positive: true, color: "#1B2A4A" },
  { icon: AlertTriangle, value: "23", labelFr: "Signalements", labelAr: "بلاغ", change: "-5%", positive: false, color: "#E53E3E" },
];

export default function AdminPage() {
  const { isRTL } = useLanguage();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "listings" | "users">("overview");
  const [listingSearch, setListingSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());
  const [listings, setListings] = useState<Listing[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    const loadData = async () => {
      setDataLoading(true);
      try {
        const [listingsRes, sellersRes] = await Promise.all([
          fetch("/api/listings?limit=20"),
          fetch("/api/sellers?limit=10"),
        ]);
        const listingsJson = await listingsRes.json();
        const sellersJson = await sellersRes.json();
        if (listingsJson.success) setListings(listingsJson.data?.listings ?? listingsJson.data ?? []);
        if (sellersJson.success) {
          const sellers: Seller[] = sellersJson.data?.sellers ?? sellersJson.data ?? [];
          setAdminUsers(
            sellers.map((s, i) => ({
              ...s,
              status: i === 2 ? "suspended" : "active",
              totalSales: [142, 88, 34, 201, 67, 15][i] ?? 0,
              joinedStr: new Date(s.joinedAt).toLocaleDateString("fr-FR", { year: "numeric", month: "short" }),
            }))
          );
        }
      } catch {
        // silently fail — UI shows empty state
      } finally {
        setDataLoading(false);
      }
    };
    loadData();
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-night-800 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-sand-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-night-800 flex items-center justify-center px-4">
        <div className="bg-night-700 rounded-2xl p-8 text-center max-w-sm w-full border border-night-600">
          <div className="w-14 h-14 rounded-full bg-night-600 flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-sand-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">
            {isRTL ? "وصول محظور" : "Accès restreint"}
          </h2>
          <p className="text-sm text-sand-400/70 mb-6">
            {isRTL
              ? "تحتاج إلى تسجيل الدخول للوصول إلى لوحة الإدارة"
              : "Connectez-vous pour accéder à l'administration"}
          </p>
          <Link href="/connexion" className="btn-gold w-full justify-center">
            {isRTL ? "تسجيل الدخول" : "Se connecter"}
          </Link>
        </div>
      </div>
    );
  }

  const filteredListings = listings.filter((l) =>
    !listingSearch ||
    l.title.toLowerCase().includes(listingSearch.toLowerCase()) ||
    l.category.toLowerCase().includes(listingSearch.toLowerCase())
  );

  const filteredUsers = adminUsers.filter((u) =>
    !userSearch ||
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.phone.includes(userSearch)
  );

  const approve = (id: string) => {
    setApprovedIds((prev) => { const n = new Set(Array.from(prev)); n.add(id); return n; });
    setRejectedIds((prev) => { const n = new Set(Array.from(prev)); n.delete(id); return n; });
  };
  const reject = (id: string) => {
    setRejectedIds((prev) => { const n = new Set(Array.from(prev)); n.add(id); return n; });
    setApprovedIds((prev) => { const n = new Set(Array.from(prev)); n.delete(id); return n; });
  };

  return (
    <div className="min-h-screen bg-night-800 text-white">
      {/* Sidebar */}
      <div className={`fixed top-16 ${isRTL ? "right-0" : "left-0"} w-56 h-full bg-night-700 border-r border-night-600 z-30`}>
        <div className="p-4 border-b border-night-600">
          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="w-8 h-8 rounded-lg bg-sand-400/20 flex items-center justify-center">
              <Shield size={16} className="text-sand-400" />
            </div>
            <p className="text-sand-400 text-xs font-semibold uppercase tracking-widest">
              {isRTL ? "لوحة الإدارة" : "Dashboard Admin"}
            </p>
          </div>
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

        <div className="absolute bottom-20 left-0 right-0 px-3">
          <Link href="/" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-sand-400/60 hover:text-sand-300 hover:bg-night-600/50 transition-all">
            <Eye size={14} />
            {isRTL ? "عرض الموقع" : "Voir le site"}
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className={`${isRTL ? "mr-56" : "ml-56"} p-6`}>
        {/* Header */}
        <div className={`flex items-center justify-between mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
          <h1 className="text-2xl font-display font-bold text-white">
            {activeTab === "overview" && (isRTL ? "نظرة عامة" : "Vue d'ensemble")}
            {activeTab === "listings" && (isRTL ? "إدارة الإعلانات" : "Gestion des annonces")}
            {activeTab === "users" && (isRTL ? "إدارة المستخدمين" : "Gestion des utilisateurs")}
          </h1>
          <div className="flex items-center gap-3">
            <button className="p-2 text-sand-300 hover:text-sand-400 relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-sand-400 rounded-full" />
            </button>
            <button className="p-2 text-sand-300 hover:text-sand-400">
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, i) => (
                <div key={i} className="bg-night-700 rounded-2xl p-5 border border-night-600">
                  <div className={`flex items-start justify-between mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: stat.color + "22" }}>
                      <stat.icon size={18} style={{ color: stat.color }} />
                    </div>
                    <span className={`text-xs font-semibold flex items-center gap-0.5 ${stat.positive ? "text-islamic-300" : "text-red-400"}`}>
                      <ChevronUp size={12} className={stat.positive ? "" : "rotate-180"} />
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-xs text-sand-400/60">{isRTL ? stat.labelAr : stat.labelFr}</p>
                </div>
              ))}
            </div>

            {/* Recent activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Dernières annonces */}
              <div className="bg-night-700 rounded-2xl border border-night-600 overflow-hidden">
                <div className={`flex items-center justify-between p-4 border-b border-night-600 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <h3 className="font-semibold text-sm text-white">{isRTL ? "آخر الإعلانات" : "Dernières annonces"}</h3>
                  <button onClick={() => setActiveTab("listings")} className="text-sand-400 text-xs hover:underline">
                    {isRTL ? "عرض الكل" : "Voir tout"}
                  </button>
                </div>
                <div className="divide-y divide-night-600/50">
                  {dataLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 size={20} className="animate-spin text-sand-400" />
                    </div>
                  ) : listings.slice(0, 5).map((l) => (
                    <div key={l.id} className={`flex items-center gap-3 px-4 py-3 hover:bg-night-600/30 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}>
                      <img src={l.images[0]} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                      <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}>
                        <p className="text-xs font-medium text-white truncate">{l.title}</p>
                        <p className="text-[10px] text-sand-400/50">{l.seller.name} · {l.category}</p>
                      </div>
                      <span className="text-xs text-sand-400 font-bold whitespace-nowrap">{l.price.toLocaleString()} MRU</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top vendeurs */}
              <div className="bg-night-700 rounded-2xl border border-night-600 overflow-hidden">
                <div className={`flex items-center justify-between p-4 border-b border-night-600 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <h3 className="font-semibold text-sm text-white">{isRTL ? "أفضل البائعين" : "Top vendeurs"}</h3>
                  <button onClick={() => setActiveTab("users")} className="text-sand-400 text-xs hover:underline">
                    {isRTL ? "عرض الكل" : "Voir tout"}
                  </button>
                </div>
                <div className="divide-y divide-night-600/50">
                  {dataLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 size={20} className="animate-spin text-sand-400" />
                    </div>
                  ) : adminUsers.slice(0, 5).map((u, i) => (
                    <div key={u.id} className={`flex items-center gap-3 px-4 py-3 hover:bg-night-600/30 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}>
                      <span className="text-sand-400/40 text-sm font-bold w-5 text-center flex-shrink-0">{i + 1}</span>
                      <img src={u.avatar} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
                      <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}>
                        <p className="text-xs font-medium text-white truncate">{u.name}</p>
                        <div className="flex items-center gap-1">
                          <Star size={9} className="text-sand-400 fill-sand-400" />
                          <span className="text-[10px] text-sand-400/60">{u.rating}</span>
                        </div>
                      </div>
                      <span className="text-xs text-sand-400 font-bold whitespace-nowrap">{u.listings} annonces</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── LISTINGS ── */}
        {activeTab === "listings" && (
          <div className="bg-night-700 rounded-2xl border border-night-600 overflow-hidden">
            <div className={`flex items-center justify-between p-5 border-b border-night-600 gap-4 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
              <h3 className="font-semibold text-white text-sm">
                {isRTL ? "الإعلانات — المراجعة" : "Annonces — Modération"}
              </h3>
              <div className="relative">
                <Search size={14} className={`absolute top-1/2 -translate-y-1/2 text-sand-400/60 ${isRTL ? "right-3" : "left-3"}`} />
                <input
                  type="text"
                  value={listingSearch}
                  onChange={(e) => setListingSearch(e.target.value)}
                  placeholder={isRTL ? "بحث..." : "Rechercher..."}
                  className={`bg-night-600 border border-night-500 rounded-xl text-sm text-white placeholder-sand-400/40 py-2 pr-4 outline-none focus:border-sand-400 ${isRTL ? "pr-9 pl-3" : "pl-9 pr-3"}`}
                />
              </div>
            </div>

            {dataLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={24} className="animate-spin text-sand-400" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-night-600">
                      {(isRTL
                        ? ["الإجراءات", "القسم", "السعر", "البائع", "الإعلان"]
                        : ["Annonce", "Vendeur", "Prix", "Catégorie", "Actions"]
                      ).map((h) => (
                        <th key={h} className={`px-5 py-3 text-xs text-sand-400/60 font-semibold uppercase tracking-wider ${isRTL ? "text-right" : "text-left"}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredListings.map((l) => {
                      const approved = approvedIds.has(l.id);
                      const rejected = rejectedIds.has(l.id);
                      return (
                        <tr key={l.id} className={`border-b border-night-600/50 transition-colors ${approved ? "bg-islamic-400/5" : rejected ? "bg-red-400/5" : "hover:bg-night-600/30"}`}>
                          <td className="px-5 py-3">
                            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                              <img src={l.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                              <div className={isRTL ? "text-right" : ""}>
                                <p className="text-white text-xs font-medium line-clamp-1 max-w-[150px]">{l.title}</p>
                                <p className="text-sand-400/50 text-[10px]">{l.location}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
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
                            {approved ? (
                              <span className="flex items-center gap-1 text-xs text-islamic-300 font-semibold">
                                <CheckCircle2 size={13} /> {isRTL ? "مقبول" : "Approuvé"}
                              </span>
                            ) : rejected ? (
                              <span className="flex items-center gap-1 text-xs text-red-300 font-semibold">
                                <XCircle size={13} /> {isRTL ? "مرفوض" : "Rejeté"}
                              </span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button onClick={() => approve(l.id)} className="p-1.5 rounded-lg bg-islamic-400/20 text-islamic-300 hover:bg-islamic-400/30 transition-colors" title="Approuver">
                                  <CheckCircle2 size={14} />
                                </button>
                                <button onClick={() => reject(l.id)} className="p-1.5 rounded-lg bg-red-400/20 text-red-300 hover:bg-red-400/30 transition-colors" title="Rejeter">
                                  <XCircle size={14} />
                                </button>
                                <a href={`/annonce/${l.id}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-sand-400/20 text-sand-300 hover:bg-sand-400/30 transition-colors">
                                  <Eye size={14} />
                                </a>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredListings.length === 0 && (
                  <p className="text-center py-10 text-sand-400/50 text-sm">{isRTL ? "لا توجد نتائج" : "Aucun résultat"}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── USERS ── */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="bg-night-700 rounded-2xl border border-night-600 overflow-hidden">
              <div className={`flex items-center justify-between p-5 border-b border-night-600 gap-4 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
                <h3 className="font-semibold text-white text-sm">
                  {isRTL ? "المستخدمون المسجلون" : "Utilisateurs inscrits"}
                </h3>
                <div className="relative">
                  <Search size={14} className={`absolute top-1/2 -translate-y-1/2 text-sand-400/60 ${isRTL ? "right-3" : "left-3"}`} />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder={isRTL ? "بحث بالاسم أو الهاتف..." : "Nom ou téléphone..."}
                    className={`bg-night-600 border border-night-500 rounded-xl text-sm text-white placeholder-sand-400/40 py-2 outline-none focus:border-sand-400 ${isRTL ? "pr-9 pl-3" : "pl-9 pr-3"}`}
                  />
                </div>
              </div>

              {dataLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 size={24} className="animate-spin text-sand-400" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-night-600">
                        {["Utilisateur", "Téléphone", "Annonces", "Note", "Inscrit", "Statut", "Actions"].map((h) => (
                          <th key={h} className={`px-5 py-3 text-xs text-sand-400/60 font-semibold uppercase tracking-wider ${isRTL ? "text-right" : "text-left"}`}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="border-b border-night-600/50 hover:bg-night-600/30 transition-colors">
                          <td className="px-5 py-3">
                            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                              <img src={u.avatar} alt="" className="w-9 h-9 rounded-full flex-shrink-0" />
                              <div className={isRTL ? "text-right" : ""}>
                                <p className="text-white text-xs font-medium">{u.name}</p>
                                <span
                                  className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5"
                                  style={
                                    u.badge === "pro"
                                      ? { background: "linear-gradient(135deg, #C9A84C, #B8922E)", color: "#1B2A4A" }
                                      : u.badge === "verified"
                                      ? { background: "#E8F4EE", color: "#2D6A4F" }
                                      : { background: "#2A3550", color: "#C9A84C" }
                                  }
                                >
                                  {u.badge === "pro" ? "Pro" : u.badge === "verified" ? "Vérifié" : "Standard"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-sand-300/70 text-xs">{u.phone}</td>
                          <td className="px-5 py-3 text-white text-xs font-bold">{u.listings}</td>
                          <td className="px-5 py-3">
                            <div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                              <Star size={11} className="text-sand-400 fill-sand-400" />
                              <span className="text-xs text-sand-300">{u.rating}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-sand-400/50 text-xs whitespace-nowrap">{u.joinedStr}</td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold ${u.status === "active" ? "bg-islamic-400/15 text-islamic-300" : "bg-red-400/15 text-red-300"}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${u.status === "active" ? "bg-islamic-400" : "bg-red-400"}`} />
                              {u.status === "active" ? (isRTL ? "نشط" : "Actif") : (isRTL ? "موقوف" : "Suspendu")}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1">
                              <a href={`/profil/${u.id}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-sand-400/20 text-sand-300 hover:bg-sand-400/30 transition-colors">
                                <Eye size={13} />
                              </a>
                              {u.status === "active" ? (
                                <button className="p-1.5 rounded-lg bg-red-400/20 text-red-300 hover:bg-red-400/30 transition-colors" title="Suspendre">
                                  <UserX size={13} />
                                </button>
                              ) : (
                                <button className="p-1.5 rounded-lg bg-islamic-400/20 text-islamic-300 hover:bg-islamic-400/30 transition-colors" title="Réactiver">
                                  <UserCheck size={13} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
