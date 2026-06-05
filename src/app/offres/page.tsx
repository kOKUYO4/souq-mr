"use client";

import { useState, useEffect, useCallback } from "react";
import { Tag, TrendingDown, CheckCircle2, XCircle, Clock, MessageCircle, Lock, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import type { DbOffer } from "@/lib/supabase";

type OfferStatus = "pending" | "accepted" | "declined" | "countered" | "expired";

const statusConfig: Record<OfferStatus, { fr: string; ar: string; color: string; bg: string; Icon: typeof Clock }> = {
  pending:   { fr: "En attente",    ar: "قيد الانتظار", color: "text-sand-600",      bg: "bg-sand-50",    Icon: Clock },
  accepted:  { fr: "Acceptée",      ar: "مقبولة",        color: "text-islamic-500",   bg: "bg-islamic-50", Icon: CheckCircle2 },
  declined:  { fr: "Refusée",       ar: "مرفوضة",        color: "text-red-500",       bg: "bg-red-50",     Icon: XCircle },
  countered: { fr: "Contre-offre",  ar: "عرض مضاد",      color: "text-purple-500",    bg: "bg-purple-50",  Icon: TrendingDown },
  expired:   { fr: "Expirée",       ar: "منتهية",         color: "text-night-400/60",  bg: "bg-sand-100",   Icon: Clock },
};

function formatPrice(n: number) {
  return n?.toLocaleString("fr-FR") ?? "—";
}

export default function OffresPage() {
  const { isRTL, locale } = useLanguage();
  const { isAuthenticated, isLoading: authLoading, token } = useAuth();
  const { success, error: toastError } = useToast();

  const [tab, setTab]           = useState<"received" | "sent">("received");
  const [offers, setOffers]     = useState<DbOffer[]>([]);
  const [loading, setLoading]   = useState(false);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const loadOffers = useCallback(async (type: "received" | "sent") => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/offers?type=${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const { data } = await res.json();
        setOffers(data ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadOffers(tab);
    }
  }, [isAuthenticated, token, tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const patchOffer = async (id: string, status: OfferStatus, counter_amount?: number) => {
    if (!token) return;
    const res = await fetch(`/api/offers/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, ...(counter_amount ? { counter_amount } : {}) }),
    });
    if (res.ok) {
      const { data } = await res.json();
      setOffers((prev) => prev.map((o) => (o.id === id ? data : o)));
    } else {
      const { error } = await res.json().catch(() => ({ error: "Erreur" }));
      toastError(error ?? "Erreur");
    }
  };

  const handleAccept = async (id: string) => {
    await patchOffer(id, "accepted");
    success(isRTL ? "تم قبول العرض!" : "Offre acceptée !");
  };

  const handleDecline = async (id: string) => {
    await patchOffer(id, "declined");
    toastError(isRTL ? "تم رفض العرض" : "Offre refusée");
  };

  const pendingCount = offers.filter((o) => o.status === "pending").length;

  if (authLoading) {
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
            { id: "received" as const, fr: "Reçues", ar: "مستلمة" },
            { id: "sent"     as const, fr: "Envoyées", ar: "مرسلة" },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t.id ? "bg-white text-night-500 shadow-sm" : "text-night-400/60 hover:text-night-500"
              } ${isRTL ? "font-arabic" : ""}`}
            >
              {isRTL ? t.ar : t.fr}
            </button>
          ))}
        </div>

        {/* Offer cards */}
        <div className="space-y-4">
          {loading && (
            <div className="flex justify-center py-10">
              <Loader2 size={24} className="animate-spin text-sand-400" />
            </div>
          )}
          {!loading && offers.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center shadow-card">
              <Tag size={28} className="text-sand-300 mx-auto mb-3" />
              <p className={`text-night-400/60 text-sm ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? "لا توجد عروض حتى الآن" : "Aucune offre pour l'instant"}
              </p>
            </div>
          )}
          {!loading && offers.map((offer) => {
            const status = statusConfig[offer.status];
            const StatusIcon = status.Icon;
            const listingPrice = offer.listing?.price ?? 0;
            const discount = listingPrice > 0 ? Math.round(((listingPrice - offer.amount) / listingPrice) * 100) : 0;
            const otherParty = tab === "received" ? offer.buyer : offer.seller;

            return (
              <div key={offer.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-card transition-all">
                <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  {/* Listing image */}
                  {offer.listing?.images?.[0] && (
                    <img src={offer.listing.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  )}

                  <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                    <div className={`flex items-start justify-between gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div>
                        <p className={`font-semibold text-night-500 text-sm line-clamp-1 ${isRTL ? "font-arabic" : ""}`}>
                          {isRTL ? offer.listing?.title_ar : offer.listing?.title}
                        </p>
                        <p className="text-xs text-night-400/50 mt-0.5">
                          {new Date(offer.created_at).toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-FR", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold flex-shrink-0 ${status.bg} ${status.color} ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
                        <StatusIcon size={11} />
                        {status[locale as "fr" | "ar"]}
                      </span>
                    </div>

                    {/* Prices */}
                    <div className={`flex items-center gap-3 mt-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className={isRTL ? "text-right" : ""}>
                        <p className="text-xs text-night-400/50">{isRTL ? "السعر الأصلي" : "Prix affiché"}</p>
                        <p className="text-sm font-bold text-night-500">{formatPrice(listingPrice)} MRU</p>
                      </div>
                      <Arrow size={14} className="text-sand-400 flex-shrink-0" />
                      <div className={isRTL ? "text-right" : ""}>
                        <p className="text-xs text-night-400/50">{isRTL ? "مبلغ العرض" : "Montant offre"}</p>
                        <p className={`text-sm font-bold ${discount > 0 ? "text-islamic-500" : "text-sand-500"}`}>
                          {formatPrice(offer.amount)} MRU
                          {discount > 0 && <span className="text-xs ml-1">(-{discount}%)</span>}
                        </p>
                      </div>
                      {offer.counter_amount && (
                        <>
                          <Arrow size={14} className="text-sand-400 flex-shrink-0" />
                          <div className={isRTL ? "text-right" : ""}>
                            <p className="text-xs text-night-400/50">{isRTL ? "العرض المضاد" : "Contre-offre"}</p>
                            <p className="text-sm font-bold text-purple-500">{formatPrice(offer.counter_amount)} MRU</p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Other party info */}
                    {otherParty && (
                      <div className={`flex items-center gap-2 mt-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <img
                          src={otherParty.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherParty.id}`}
                          alt=""
                          className="w-5 h-5 rounded-lg"
                        />
                        <span className={`text-xs text-night-400/60 ${isRTL ? "font-arabic" : ""}`}>
                          {isRTL ? (otherParty as any).name_ar : otherParty.name}
                        </span>
                      </div>
                    )}

                    {/* Actions for pending received offers */}
                    {tab === "received" && offer.status === "pending" && (
                      <div className={`flex gap-2 mt-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <button
                          onClick={() => handleAccept(offer.id)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-islamic-400/10 text-islamic-500 hover:bg-islamic-400/20 transition-all ${isRTL ? "flex-row-reverse font-arabic" : ""}`}
                        >
                          <CheckCircle2 size={13} />
                          {isRTL ? "قبول" : "Accepter"}
                        </button>
                        <button
                          onClick={() => handleDecline(offer.id)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-all ${isRTL ? "flex-row-reverse font-arabic" : ""}`}
                        >
                          <XCircle size={13} />
                          {isRTL ? "رفض" : "Refuser"}
                        </button>
                        <Link
                          href={`/messages?listing=${offer.listing_id}`}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sand-100 text-night-500 hover:bg-sand-200 transition-all ${isRTL ? "flex-row-reverse font-arabic" : ""}`}
                        >
                          <MessageCircle size={13} />
                          {isRTL ? "ردّ" : "Répondre"}
                        </Link>
                      </div>
                    )}

                    {offer.status === "countered" && (
                      <div className={`flex gap-2 mt-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <button
                          onClick={() => handleAccept(offer.id)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-night-500 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}
                          style={{ background: "linear-gradient(135deg, #C9A84C30, #B8922E20)", border: "1px solid #C9A84C50" }}
                        >
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
        {!loading && offers.length > 0 && (
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { n: offers.filter((o) => o.status === "accepted").length, l: { fr: "Acceptées", ar: "مقبولة" }, color: "text-islamic-500" },
              { n: offers.filter((o) => o.status === "pending").length,  l: { fr: "En attente", ar: "قيد الانتظار" }, color: "text-sand-500" },
              { n: offers.filter((o) => o.status === "declined").length, l: { fr: "Refusées", ar: "مرفوضة" }, color: "text-red-500" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 text-center shadow-sm">
                <p className={`text-2xl font-display font-bold ${s.color}`}>{s.n}</p>
                <p className={`text-xs text-night-400/60 mt-0.5 ${isRTL ? "font-arabic" : ""}`}>{s.l[locale as "fr" | "ar"]}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
