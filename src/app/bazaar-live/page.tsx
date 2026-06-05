"use client";

import { useState, useEffect } from "react";
import { Radio, Users, Flame, MessageCircle, ArrowRight, ArrowLeft, Play, Clock } from "lucide-react";
import Link from "next/link";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";

const staticSellers = [
  { id: "s1", name: "Mohamed Ould Saleck", nameAr: "محمد ولد سالك", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohamed" },
  { id: "s2", name: "Fatimetou Mint Ahmed", nameAr: "فاطمة بنت أحمد", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatimetou" },
  { id: "s3", name: "Abdallahi Ould Brahim", nameAr: "عبدالله ولد إبراهيم", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abdallahi" },
];

const liveStreams = [
  {
    id: "live1",
    seller: staticSellers[0],
    listingId: "l1",
    viewers: 234,
    currentBid: 1180000,
    startingPrice: 1200000,
    titleFr: "Vente Live — Toyota Land Cruiser 2018",
    titleAr: "بيع مباشر — تويوتا لاند كروزر 2018",
    thumb: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400",
    timeLeft: "14:32",
    hot: true,
  },
  {
    id: "live2",
    seller: staticSellers[1],
    listingId: "l34",
    viewers: 89,
    currentBid: 265000,
    startingPrice: 280000,
    titleFr: "Déstockage iPhones — Prix cassés",
    titleAr: "تصفية آيفونات — أسعار مكسورة",
    thumb: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400",
    timeLeft: "28:15",
    hot: false,
  },
  {
    id: "live3",
    seller: staticSellers[2],
    listingId: "l8",
    viewers: 156,
    currentBid: 6800,
    startingPrice: 7500,
    titleFr: "Collection Daraa & Abaya — Artisanat mauritanien",
    titleAr: "مجموعة درّاعات وعبايات — حرف موريتانية",
    thumb: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
    timeLeft: "45:00",
    hot: true,
  },
];

const upcomingStreams = [
  { timeFr: "Demain 10h00", timeAr: "غداً الساعة 10:00", titleFr: "Vente bijoux or mauritanien", titleAr: "بيع مجوهرات ذهبية موريتانية" },
  { timeFr: "Demain 14h30", timeAr: "غداً الساعة 14:30", titleFr: "Lot électroménager — Samsung", titleAr: "مجموعة أجهزة سامسونج" },
  { timeFr: "Samedi 09h00", timeAr: "السبت الساعة 09:00", titleFr: "Marché camions Hino & Mitsubishi", titleAr: "سوق شاحنات هينو ومتسوبيشي" },
];

export default function BazaarLivePage() {
  const { isRTL, locale } = useLanguage();
  const { success } = useToast();
  const [watchingId, setWatchingId] = useState<string | null>(null);
  const [bids, setBids] = useState<Record<string, number>>({});
  const [chatMessages, setChatMessages] = useState([
    { from: "Sidi", text: "Macha Allah ce prix !", textAr: "ما شاء الله هذا السعر!" },
    { from: "Marième", text: "Je prends si prix final 1.15M", textAr: "آخذه إذا السعر 1.15 مليون" },
    { from: "Ahmed", text: "Toujours disponible ?", textAr: "لا يزال متوفراً؟" },
  ]);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const watching = liveStreams.find((l) => l.id === watchingId);

  const placeBid = (stream: typeof liveStreams[0]) => {
    const current = bids[stream.id] || stream.currentBid;
    const newBid = current - Math.floor(current * 0.02);
    setBids((prev) => ({ ...prev, [stream.id]: newBid }));
    success(isRTL ? `عرضك: ${newBid.toLocaleString()} أوقية ✓` : `Votre offre : ${newBid.toLocaleString()} MRU ✓`);
  };

  if (watchingId && watching) {
    const currentBid = bids[watching.id] || watching.currentBid;
    return (
      <div className="min-h-screen bg-night-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <button onClick={() => setWatchingId(null)}
            className={`flex items-center gap-2 text-sand-300 hover:text-white mb-4 text-sm font-semibold ${isRTL ? "flex-row-reverse" : ""}`}>
            {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            {isRTL ? "العودة" : "Retour"}
          </button>

          <div className="grid lg:grid-cols-3 gap-4">
            {/* Video */}
            <div className="lg:col-span-2">
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
                <img src={watching.thumb} alt="" className="w-full h-full object-cover opacity-70" />
                {/* Live badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold">
                    <Radio size={11} className="animate-pulse" />
                    LIVE
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 text-white text-xs">
                    <Users size={11} />
                    {watching.viewers}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-black/60 rounded-xl text-white text-sm">
                  <Clock size={13} />
                  {watching.timeLeft}
                </div>
                {/* Seller overlay */}
                <div className={`absolute bottom-3 left-3 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <img src={watching.seller.avatar} alt="" className="w-8 h-8 rounded-full border-2 border-white" />
                  <span className="text-xs text-white font-semibold">
                    {isRTL ? watching.seller.nameAr : watching.seller.name}
                  </span>
                </div>
              </div>

              {/* Bid section */}
              <div className="bg-night-600/40 border border-night-400/30 rounded-2xl p-5 mt-4">
                <div className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className={isRTL ? "text-right" : ""}>
                    <p className={`text-xs text-sand-400/60 ${isRTL ? "font-arabic" : ""}`}>
                      {isRTL ? "العرض الحالي" : "Prix actuel"}
                    </p>
                    <p className="text-3xl font-display font-bold text-sand-400">
                      {currentBid.toLocaleString()} <span className="text-xl">MRU</span>
                    </p>
                  </div>
                  <button
                    onClick={() => placeBid(watching)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-night-500 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}
                    style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                    <Flame size={16} />
                    {isRTL ? "قدّم عرضاً" : "Faire une offre"}
                  </button>
                </div>
                <p className={`text-xs text-sand-400/40 ${isRTL ? "font-arabic text-right" : ""}`}>
                  {isRTL ? "كل عرض يخفض السعر بـ 2%" : "Chaque offre réduit le prix de 2%"}
                </p>
              </div>
            </div>

            {/* Chat */}
            <div className="bg-night-600/40 border border-night-400/30 rounded-2xl overflow-hidden flex flex-col" style={{ height: "400px" }}>
              <div className="px-4 py-3 border-b border-night-400/30">
                <p className={`text-sm font-semibold text-white flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <MessageCircle size={14} className="text-sand-400" />
                  {isRTL ? "المحادثة المباشرة" : "Chat en direct"}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {chatMessages.map((m, i) => (
                  <div key={i} className={`text-sm ${isRTL ? "text-right" : ""}`}>
                    <span className="text-sand-400 font-semibold text-xs">{m.from}: </span>
                    <span className={`text-sand-200/80 ${isRTL ? "font-arabic" : ""}`}>
                      {isRTL ? m.textAr : m.text}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-night-400/30">
                <input
                  type="text"
                  placeholder={isRTL ? "أكتب في الدردشة..." : "Écrire dans le chat..."}
                  dir={isRTL ? "rtl" : "ltr"}
                  className="w-full bg-night-500/60 border border-night-400/40 text-white placeholder-sand-400/40 rounded-xl px-3 py-2 text-xs outline-none focus:border-sand-400/60"
                  onKeyDown={(e) => {
                    const val = (e.target as HTMLInputElement).value;
                    if (e.key === "Enter" && val.trim()) {
                      setChatMessages((prev) => [...prev, { from: "Vous", text: val, textAr: val }]);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="relative py-14 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.05} />
        <div className={`relative max-w-6xl mx-auto px-4 sm:px-6 ${isRTL ? "text-right" : ""}`}>
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">
              <Radio size={22} className="text-red-400 animate-pulse" />
            </div>
            <div>
              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <h1 className={`text-3xl font-display font-bold text-white ${isRTL ? "font-arabic" : ""}`}>
                  Bazaar Live
                </h1>
                <span className="px-2 py-0.5 bg-red-500 rounded-full text-xs font-bold text-white animate-pulse">LIVE</span>
              </div>
              <p className={`text-sand-300/70 text-sm ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? "بيع وشراء في الوقت الفعلي" : "Ventes en direct et enchères en temps réel"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Live streams */}
        <div className="mb-8">
          <h2 className={`font-bold text-night-500 text-lg mb-4 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {isRTL ? "بث مباشر الآن" : "En direct maintenant"}
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {liveStreams.map((stream) => {
              const currentBid = bids[stream.id] || stream.currentBid;
              return (
                <button key={stream.id}
                  onClick={() => setWatchingId(stream.id)}
                  className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 text-left group">
                  <div className="relative">
                    <img src={stream.thumb} alt="" className="w-full h-40 object-cover" />
                    <div className="absolute top-2 left-2 flex items-center gap-2">
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                        <Radio size={8} className="animate-pulse" /> LIVE
                      </span>
                      {stream.hot && (
                        <span className="px-2 py-0.5 rounded-full text-white text-[10px] font-bold bg-orange-500">
                          🔥 HOT
                        </span>
                      )}
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px]">
                      <Users size={9} /> {stream.viewers}
                    </div>
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-black/60 rounded-lg text-white text-[10px]">
                      <Clock size={9} /> {stream.timeLeft}
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center transition-all">
                      <Play size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" />
                    </div>
                  </div>
                  <div className={`p-4 ${isRTL ? "text-right" : ""}`}>
                    <div className={`flex items-center gap-2 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <img src={stream.seller.avatar} alt="" className="w-6 h-6 rounded-full" />
                      <p className={`text-xs text-night-400/60 ${isRTL ? "font-arabic" : ""}`}>
                        {isRTL ? stream.seller.nameAr : stream.seller.name}
                      </p>
                    </div>
                    <p className={`text-sm font-semibold text-night-500 mb-2 line-clamp-1 ${isRTL ? "font-arabic" : ""}`}>
                      {isRTL ? stream.titleAr : stream.titleFr}
                    </p>
                    <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className={isRTL ? "text-right" : ""}>
                        <p className={`text-xs text-night-400/50 ${isRTL ? "font-arabic" : ""}`}>
                          {isRTL ? "العرض الحالي" : "Prix actuel"}
                        </p>
                        <p className="text-lg font-bold text-sand-500">{currentBid.toLocaleString()} MRU</p>
                      </div>
                      <span className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-night-500 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}
                        style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                        <Play size={11} fill="currentColor" />
                        {isRTL ? "شاهد" : "Regarder"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upcoming */}
        <div>
          <h2 className={`font-bold text-night-500 text-lg mb-4 ${isRTL ? "font-arabic text-right" : ""}`}>
            {isRTL ? "البث القادم" : "Prochains live"}
          </h2>
          <div className="space-y-3">
            {upcomingStreams.map((s, i) => (
              <div key={i} className={`flex items-center justify-between bg-white rounded-2xl px-5 py-4 shadow-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center">
                    <Clock size={18} className="text-sand-400" />
                  </div>
                  <div className={isRTL ? "text-right" : ""}>
                    <p className={`text-sm font-semibold text-night-500 ${isRTL ? "font-arabic" : ""}`}>{isRTL ? s.titleAr : s.titleFr}</p>
                    <p className={`text-xs text-night-400/50 ${isRTL ? "font-arabic" : ""}`}>{isRTL ? s.timeAr : s.timeFr}</p>
                  </div>
                </div>
                <button onClick={() => success(isRTL ? "تم التذكير! ستتلقى إشعاراً" : "Rappel activé ! Vous serez notifié")}
                  className={`text-xs font-semibold text-sand-500 hover:text-sand-600 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? "🔔 تذكير" : "🔔 Me rappeler"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
