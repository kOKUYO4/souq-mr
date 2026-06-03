"use client";

import { useState } from "react";
import { X, Send, CheckCircle2, AlertCircle, Clock, Loader2 } from "lucide-react";
import type { Listing } from "@/data/mockData";
import { formatPrice } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface HagglingModalProps {
  listing: Listing;
  onClose: () => void;
}

type Step = "offer" | "pending" | "counter" | "accepted" | "declined";

export default function HagglingModal({ listing, onClose }: HagglingModalProps) {
  const { isRTL, locale } = useLanguage();
  const { token } = useAuth();
  const { success, warning, error: toastError } = useToast();
  const [step, setStep] = useState<Step>("offer");
  const [offer, setOffer] = useState("");
  const [serverCounter, setServerCounter] = useState(0);
  const [floorPrice, setFloorPrice] = useState(0);

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(offer);
    if (!amount || amount <= 0) return;
    setStep("pending");
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ listingId: listing.id, amount }),
      });
      const json = await res.json();
      if (json.success) {
        const { status, counterOffer: co, floorPrice: fp } = json.data;
        setServerCounter(co || 0);
        setFloorPrice(fp || 0);
        setStep(status === "accepted" ? "accepted" : status === "counter" ? "counter" : "declined");
        if (status === "accepted") success(isRTL ? "تم قبول عرضك! 🎉" : "Offre acceptée ! 🎉");
        if (status === "declined") toastError(isRTL ? "تم رفض العرض" : "Offre refusée");
      } else {
        toastError(json.error || (isRTL ? "خطأ في إرسال العرض" : "Erreur lors de l'envoi de l'offre"));
        setStep("offer");
      }
    } catch {
      toastError(isRTL ? "خطأ في الشبكة" : "Erreur réseau");
      setStep("offer");
    }
  };

  const handleLastPrice = () => {
    setOffer(String(Math.round(listing.price * 0.9)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-gold-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sand-100">
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center text-lg">🤝</div>
            <div className={isRTL ? "text-right" : ""}>
              <h3 className="font-bold text-night-500 text-sm">{isRTL ? "التفاوض على السعر" : "Négocier le prix"}</h3>
              <p className="text-xs text-night-400/60">{isRTL ? listing.titleAr : listing.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-night-400 hover:text-night-500 rounded-xl hover:bg-sand-50 transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {/* Prix affiché */}
          <div className={`flex items-center justify-between mb-6 p-4 bg-sand-50 rounded-2xl ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={isRTL ? "text-right" : ""}>
              <p className="text-xs text-night-400/60 mb-0.5">{isRTL ? "السعر المطلوب" : "Prix demandé"}</p>
              <p className="text-xl font-bold text-night-500">{formatPrice(listing.price)} <span className="text-sm font-normal text-night-400/60">MRU</span></p>
            </div>
            <div className={`text-right ${isRTL ? "text-left" : ""}`}>
              <p className="text-xs text-night-400/60 mb-0.5">{isRTL ? "وقت الرد" : "Temps de réponse"}</p>
              <p className="text-xs font-semibold text-islamic-400 flex items-center gap-1">
                <Clock size={11} />
                {isRTL ? "أقل من دقيقة" : "Moins d'1 min"}
              </p>
            </div>
          </div>

          {step === "offer" && (
            <form onSubmit={handleSendOffer} className="space-y-4">
              <div>
                <label className={`text-sm font-semibold text-night-500 mb-2 block ${isRTL ? "text-right" : ""}`}>
                  {isRTL ? "عرضك (MRU)" : "Votre offre (MRU)"}
                </label>
                <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <input type="number" value={offer} onChange={(e) => setOffer(e.target.value)}
                    placeholder={formatPrice(Math.round(listing.price * 0.9))}
                    min={1} max={listing.price} dir="ltr"
                    className="input-field flex-1 text-right font-bold text-night-500 text-lg" />
                  <button type="button" onClick={handleLastPrice}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-night-500 flex-shrink-0 whitespace-nowrap"
                    style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                    {isRTL ? "آخر سعر؟" : "Dernier prix ?"}
                  </button>
                </div>
                {offer && parseInt(offer) < listing.price * 0.5 && (
                  <p className="text-xs text-red-500 mt-1">
                    {isRTL ? "العرض منخفض جداً" : "Offre trop basse — risque de refus"}
                  </p>
                )}
              </div>

              {/* Barres de suggestion */}
              <div className="space-y-1.5">
                {[0.95, 0.88, 0.80].map((pct) => {
                  const val = Math.round(listing.price * pct);
                  return (
                    <button key={pct} type="button" onClick={() => setOffer(String(val))}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border-2 transition-all text-sm ${offer === String(val) ? "border-sand-400 bg-sand-50" : "border-sand-100 hover:border-sand-300"} ${isRTL ? "flex-row-reverse" : ""}`}>
                      <span className="text-night-400/60">
                        {pct === 0.95 ? (isRTL ? "عرض قوي — احتمال قبول ✅" : "Offre forte — acceptation probable ✅")
                          : pct === 0.88 ? (isRTL ? "عرض معتدل — ربما تفاوض 🤝" : "Offre raisonnable — contre-offre possible 🤝")
                          : (isRTL ? "عرض جريء — قد يُرفض ⚠️" : "Offre audacieuse — risque de refus ⚠️")}
                      </span>
                      <span className="font-bold text-night-500">{formatPrice(val)} MRU</span>
                    </button>
                  );
                })}
              </div>

              <button type="submit" disabled={!offer || parseInt(offer) <= 0}
                className="w-full btn-gold py-3.5 font-bold disabled:opacity-40">
                <Send size={16} />
                {isRTL ? "أرسل العرض" : "Envoyer l'offre"}
              </button>
            </form>
          )}

          {step === "pending" && (
            <div className="py-8 text-center">
              <Loader2 size={36} className="animate-spin text-sand-400 mx-auto mb-4" />
              <p className={`text-night-500 font-semibold ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? "جارٍ إرسال عرضك..." : "Envoi de votre offre..."}
              </p>
              <p className={`text-sm text-night-400/60 mt-1 ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? "البائع يراجع عرضك" : "Le vendeur examine votre offre"}
              </p>
            </div>
          )}

          {step === "counter" && (
            <div className="space-y-4">
              <div className="bg-sand-50 rounded-2xl p-4 text-center">
                <p className={`text-xs text-night-400/60 mb-2 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? "عرض مضاد من البائع" : "Contre-offre du vendeur"}
                </p>
                <p className="text-3xl font-bold text-night-500">{formatPrice(serverCounter || Math.round(listing.price * 0.94))} <span className="text-sm text-night-400/60">MRU</span></p>
                <p className="text-xs text-islamic-400 mt-1">
                  {isRTL ? `خصم ${Math.round((1 - (serverCounter || listing.price * 0.94) / listing.price) * 100)}%` : `−${Math.round((1 - (serverCounter || listing.price * 0.94) / listing.price) * 100)}% par rapport au prix initial`}
                </p>
              </div>
              <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <button onClick={() => { success(isRTL ? "تم قبول العرض المضاد! 🎉" : "Contre-offre acceptée ! 🎉"); onClose(); }}
                  className="flex-1 btn-gold py-3 text-sm">
                  {isRTL ? "✓ أقبل" : "✓ Accepter"}
                </button>
                <button onClick={() => setStep("offer")}
                  className="flex-1 py-3 rounded-xl border-2 border-sand-200 text-night-500 text-sm font-semibold hover:border-sand-400 transition-all">
                  {isRTL ? "عرض آخر" : "Faire une autre offre"}
                </button>
              </div>
            </div>
          )}

          {step === "accepted" && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-islamic-50 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} className="text-islamic-400" />
              </div>
              <div>
                <h4 className={`text-lg font-bold text-night-500 mb-1 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? "تم قبول عرضك! 🎉" : "Offre acceptée ! 🎉"}
                </h4>
                <p className={`text-sm text-night-400/70 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? "تواصل مع البائع لإتمام الصفقة" : "Contactez le vendeur pour finaliser la transaction"}
                </p>
              </div>
              <a href="/messages" className="btn-gold w-full justify-center text-sm">
                {isRTL ? "الذهاب إلى الرسائل" : "Aller aux messages"}
              </a>
            </div>
          )}

          {step === "declined" && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                <AlertCircle size={32} className="text-red-400" />
              </div>
              <div>
                <h4 className={`text-lg font-bold text-night-500 mb-1 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? "تم رفض العرض" : "Offre déclinée"}
                </h4>
                <p className={`text-sm text-night-400/70 ${isRTL ? "font-arabic" : ""}`}>
                  {floorPrice > 0
                    ? (isRTL ? `أدنى سعر مقبول: ${formatPrice(floorPrice)} MRU` : `Prix plancher : ${formatPrice(floorPrice)} MRU`)
                    : (isRTL ? "جرب تقديم عرض أعلى" : "Essayez une offre plus élevée")}
                </p>
              </div>
              <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <button onClick={() => { setOffer(""); setStep("offer"); }}
                  className="flex-1 btn-gold py-3 text-sm">
                  {isRTL ? "عرض جديد" : "Nouvelle offre"}
                </button>
                <button onClick={onClose}
                  className="flex-1 py-3 rounded-xl border-2 border-sand-200 text-night-500 text-sm font-semibold hover:border-sand-400 transition-all">
                  {isRTL ? "إغلاق" : "Fermer"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
