"use client";

import { useState } from "react";
import { Tag, TrendingDown, CheckCircle2, XCircle, Clock, MessageCircle, Lock, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { listings, formatPrice } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

type OfferStatus = "pending" | "accepted" | "declined" | "countered" | "expired";

interface Offer {
  id: string;
  type: "received" | "sent";
  listing: typeof listings[0];
  offerPrice: number;
  counterPrice?: number;
  status: OfferStatus;
  createdAt: string;
  buyerName: string;
  buyerNameAr: string;
  buyerAvatar: string;
}

const mockOffers: Offer[] = [
  {
    id: "o1", type: "received",
    listing: listings[0],
    offerPrice: 185000,
    status: "pending",
    createdAt: "2025-01-15T10:30:00",
    buyerName: "Fatimetou M. Ahmed", buyerNameAr: "فاطيمتو منت أحمد",
    buyerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=f1",
  },
  {
    id: "o2", type: "received",
    listing: listings[2],
    offerPrice: 95000,
    counterPrice: 110000,
    status: "countered",
    createdAt: "2025-01-14T15:20:00",
    buyerName: "Abdallahi B. Sidi", buyerNameAr: "عبد الله باه سيدي",
    buyerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=a2",
  },
  {
    id: "o3", type: "sent",
    listing: listings[4],
    offerPrice: 62000,
    status: "accepted",
    createdAt: "2025-01-13T09:15:00",
    buyerName: "Mohamed O. Vall", buyerNameAr: "محمد ولد فال",
    buyerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=m3",
  },
  {
    id: "o4", type: "sent",
    listing: listings[6],
    offerPrice: 28000,
    status: "declined",
    createdAt: "2025-01-12T14:00:00",
    buyerName: "Mariem M. Bah", buyerNameAr: "مريم منت باه",
    buyerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=m4",
  },
  {
    id: "o5", type: "received",
    listing: listings[1],
    offerPrice: 2800000,
    status: "expired",
    createdAt: "2025-01-10T11:00:00",
    buyerName: "Cheikh O. Hamed", buyerNameAr: "شيخ ولد حامد",
    buyerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=c5",
  },
];

const statusConfig: Record<OfferStatus, { fr: string; ar: string; color: string; bg: string; Icon: typeof Clock }> = {
  pending: { fr: "En attente", ar: "قيد الانتظار", color: "text-sand-600", bg: "bg-sand-50", Icon: Clock },
  accepted: { fr: "Acceptée", ar: "مقبولة", color: "text-islamic-500", bg: "bg-islamic-50", Icon: CheckCircle2 },
  declined: { fr: "Refusée", ar: "مرفوضة", color: "text-red-500", bg: "bg-red-50", Icon: XCircle },
  countered: { fr: "Contre-offre", ar: "عرض مضاد", color: "text-purple-500", bg: "bg-purple-50", Icon: TrendingDown },
  expired: { fr: "Expirée", ar: "منتهية", color: "text-night-400/60", bg: "bg-sand-100", Icon: Clock },
};

export default function OffresPage() {
  const { isRTL, locale } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();
  const { success, error: toastError } = useToast();
  const [tab, setTab] = useState<"received" | "sent">("received");
  const [offers, setOffers] = useState(mockOffers);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const filteredOffers = offers.filter((o) => o.type === tab);
  const pendingCount = offers.filter((o) => o.type === "received" && o.status === "pending").length;

  const handleAccept = (id: string) => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status: "accepted" as OfferStatus } : o)));
    success(isRTL ? "تم قبول العرض!" : "Offre acceptée !");
  };

  const handleDecline = (id: string) => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status: "declined" as OfferStatus } : o)));
    toastError(isRTL ? "تم رفض العرض" : "Offre refusée");
  };

  if (isLoading) {
    return <div className="min-h-screen bg-sand-gradient flex items-center justify-center"><Loader2 size={28} className="animate-spin text-sand-400" /></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-sand-gradient flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm shadow-card">
          <Lock size={26} className="text-sand-400 mx-auto mb-4" />
          <h2 className={`text-lg font-bold text-night-500 mb-2 ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "تسجيل الدخول مطلوب" : "Connexion requise"}
          </h2>
          <Link href="/connexion" className="btn-gold w-full justify-center mt-4">{isRTL ? "تسجيل الدخول" : "Se connecter"}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Header */}
      <div className="relative py-12 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #2D4A7A)" }}>
        <div className={`relative max-w-3xl mx-auto px-4 sm:px-6 ${isRTL ? "text-right font-arabic" : ""}`}>
          <h1 className="text-2xl font-display font-bold text-white mb-1">
            {isRTL ? "إدارة العروض" : "Gestion des offres"}
          </h1>
          <p className="text-sand-300/70 text-sm">
            {isRTL ? "تتبع عروض الشراء المرسلة والمستلمة" : "Suivez vos offres d'achat envoyées et reçues"}
          </p>
          {pendingCount > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-sand-400/20 rounded-xl text-sand-300 text-xs">
              <Clock size={12} />
              {pendingCount} {isRTL ? "عرض قيد الانتظار" : "offre(s) en attente de réponse"}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className={`flex gap-1 bg-sand-100 rounded-xl p-1 w-fit mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
          {([
            { id: "received" as const, fr: `Reçues (${offers.filter((o) => o.type === "received").length})`, ar: `مستلمة (${offers.filter((o) => o.type === "received").length})` },
            { id: "sent" as const, fr: `Envoyées (${offers.filter((o) => o.type === "sent").length})`, ar: `مرسلة (${offers.filter((o) => o.type === "sent").length})` },
          ]).map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t.id ? "bg-white text-night-500 shadow-sm" : "text-night-400/60 hover:text-night-500"
              } ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? t.ar : t.fr}
            </button>
          ))}
        </div>

        {/* Offer cards */}
        <div className="space-y-4">
          {filteredOffers.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center shadow-card">
              <Tag size={28} className="text-sand-300 mx-auto mb-3" />
              <p className={`text-night-400/60 text-sm ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? "لا توجد عروض حتى الآن" : "Aucune offre pour l'instant"}
              </p>
            </div>
          )}
          {filteredOffers.map((offer) => {
            const status = statusConfig[offer.status];
            const StatusIcon = status.Icon;
            const discount = Math.round(((offer.listing.price - offer.offerPrice) / offer.listing.price) * 100);
            return (
              <div key={offer.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-card transition-all">
                <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  {/* Listing image */}
                  <img src={offer.listing.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />

                  <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                    <div className={`flex items-start justify-between gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div>
                        <p className={`font-semibold text-night-500 text-sm line-clamp-1 ${isRTL ? "font-arabic" : ""}`}>
                          {isRTL ? offer.listing.titleAr : offer.listing.title}
                        </p>
                        <p className="text-xs text-night-400/50 mt-0.5">
                          {new Date(offer.createdAt).toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-FR", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold flex-shrink-0 ${status.bg} ${status.color} ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
                        <StatusIcon size={11} />
                        {status[locale]}
                      </span>
                    </div>

                    {/* Prices */}
                    <div className={`flex items-center gap-3 mt-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className={`${isRTL ? "text-right" : ""}`}>
                        <p className="text-xs text-night-400/50">{isRTL ? "السعر الأصلي" : "Prix affiché"}</p>
                        <p className="text-sm font-bold text-night-500">{formatPrice(offer.listing.price)} MRU</p>
                      </div>
                      <Arrow size={14} className="text-sand-400 flex-shrink-0" />
                      <div className={`${isRTL ? "text-right" : ""}`}>
                        <p className="text-xs text-night-400/50">{isRTL ? "عرضك" : "Votre offre"}</p>
                        <p className={`text-sm font-bold ${discount > 0 ? "text-islamic-500" : "text-sand-500"}`}>
                          {formatPrice(offer.offerPrice)} MRU
                          {discount > 0 && <span className="text-xs ml-1">(-{discount}%)</span>}
                        </p>
                      </div>
                      {offer.counterPrice && (
                        <>
                          <Arrow size={14} className="text-sand-400 flex-shrink-0" />
                          <div className={`${isRTL ? "text-right" : ""}`}>
                            <p className="text-xs text-night-400/50">{isRTL ? "العرض المضاد" : "Contre-offre"}</p>
                            <p className="text-sm font-bold text-purple-500">{formatPrice(offer.counterPrice)} MRU</p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Buyer info */}
                    <div className={`flex items-center gap-2 mt-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <img src={offer.buyerAvatar} alt="" className="w-5 h-5 rounded-lg" />
                      <span className={`text-xs text-night-400/60 ${isRTL ? "font-arabic" : ""}`}>
                        {isRTL ? offer.buyerNameAr : offer.buyerName}
                      </span>
                    </div>

                    {/* Actions for pending received offers */}
                    {offer.type === "received" && offer.status === "pending" && (
                      <div className={`flex gap-2 mt-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <button onClick={() => handleAccept(offer.id)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-islamic-400/10 text-islamic-500 hover:bg-islamic-400/20 transition-all ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
                          <CheckCircle2 size={13} />
                          {isRTL ? "قبول" : "Accepter"}
                        </button>
                        <button onClick={() => handleDecline(offer.id)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-all ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
                          <XCircle size={13} />
                          {isRTL ? "رفض" : "Refuser"}
                        </button>
                        <Link href={`/messages?listing=${offer.listing.id}`}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sand-100 text-night-500 hover:bg-sand-200 transition-all ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
                          <MessageCircle size={13} />
                          {isRTL ? "ردّ" : "Répondre"}
                        </Link>
                      </div>
                    )}

                    {offer.status === "countered" && (
                      <div className={`flex gap-2 mt-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <button onClick={() => handleAccept(offer.id)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-night-500 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}
                          style={{ background: "linear-gradient(135deg, #C9A84C30, #B8922E20)", border: "1px solid #C9A84C50" }}>
                          <CheckCircle2 size={13} />
                          {isRTL ? "قبول العرض المضاد" : "Accepter la contre-offre"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats summary */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { n: offers.filter((o) => o.status === "accepted").length, l: { fr: "Acceptées", ar: "مقبولة" }, color: "text-islamic-500" },
            { n: offers.filter((o) => o.status === "pending").length, l: { fr: "En attente", ar: "قيد الانتظار" }, color: "text-sand-500" },
            { n: offers.filter((o) => o.status === "declined").length, l: { fr: "Refusées", ar: "مرفوضة" }, color: "text-red-500" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <p className={`text-2xl font-display font-bold ${s.color}`}>{s.n}</p>
              <p className={`text-xs text-night-400/60 mt-0.5 ${isRTL ? "font-arabic" : ""}`}>{s.l[locale]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
