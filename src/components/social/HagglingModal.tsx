"use client";

import { useState } from "react";
import { X, Send, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import type { Listing } from "@/data/mockData";
import { formatPrice } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";

interface HagglingModalProps {
  listing: Listing;
  onClose: () => void;
}

type Step = "offer" | "counter" | "accepted" | "declined";

export default function HagglingModal({ listing, onClose }: HagglingModalProps) {
  const { isRTL, locale } = useLanguage();
  const [step, setStep] = useState<Step>("offer");
  const [offer, setOffer] = useState("");
  const [counterOffer] = useState(Math.round(listing.price * 0.94));

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offer || parseInt(offer) <= 0) return;
    setTimeout(() => {
      const pct = parseInt(offer) / listing.price;
      setStep(pct >= 0.9 ? "counter" : "declined");
    }, 1200);
    setStep("counter");
  };

  const handleAccept = () => setStep("accepted");
  const handleLastPrice = () => {
    setOffer(String(counterOffer));
    setStep("counter");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-night-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-gold-lg animate-fade-up">
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #1B2A4A, #2D3E6A)" }}
        >
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <span className="text-2xl">🤝</span>
            <div className={isRTL ? "text-right" : ""}>
              <p className="text-white font-bold text-sm">
                {isRTL ? "نظام التفاوض" : "Négocie comme au Souk"}
              </p>
              <p className="text-sand-400/70 text-xs">
                {isRTL ? listing.titleAr : listing.title}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-sand-300 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Prix affiché */}
        <div className={`flex items-center justify-between px-5 py-3 bg-sand-50 border-b border-sand-100 ${isRTL ? "flex-row-reverse" : ""}`}>
          <span className="text-xs text-night-400/60">
            {isRTL ? "السعر المعروض" : "Prix affiché"}
          </span>
          <span className="font-bold text-sand-500 text-lg">{formatPrice(listing.price)} MRU</span>
        </div>

        {/* Contenu par étape */}
        <div className="p-5">
          {/* Timeline messages */}
          <div className="space-y-3 mb-5 min-h-[120px]">
            {/* Message vendeur initial */}
            <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <img src={listing.seller.avatar} alt="" className="w-8 h-8 rounded-full bg-sand-100 flex-shrink-0" />
              <div className="bg-sand-100 rounded-xl rounded-tl-sm px-3 py-2 text-sm text-night-500 max-w-[80%]">
                {isRTL
                  ? `السعر ${formatPrice(listing.price)} أوقية — السعر ثابت لكن التفاوض ممكن 🙂`
                  : `${formatPrice(listing.price)} MRU — Prix ferme mais la négociation reste possible 🙂`}
              </div>
            </div>

            {/* Offre acheteur */}
            {(step === "counter" || step === "accepted" || step === "declined") && offer && (
              <div className={`flex gap-2 justify-end ${isRTL ? "flex-row-reverse justify-start" : ""}`}>
                <div className="text-white rounded-xl rounded-tr-sm px-3 py-2 text-sm max-w-[80%]"
                  style={{ background: "linear-gradient(135deg, #1B2A4A, #364E8F)" }}>
                  {isRTL
                    ? `أعرض ${formatPrice(parseInt(offer))} أوقية 🙏`
                    : `Je vous propose ${formatPrice(parseInt(offer))} MRU 🙏`}
                </div>
              </div>
            )}

            {/* Réponse vendeur */}
            {step === "counter" && (
              <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <img src={listing.seller.avatar} alt="" className="w-8 h-8 rounded-full bg-sand-100 flex-shrink-0" />
                <div className="bg-sand-100 rounded-xl rounded-tl-sm px-3 py-2 text-sm text-night-500 max-w-[80%]">
                  {isRTL
                    ? `أقل سعر ممكن: ${formatPrice(counterOffer)} أوقية 🤝 هل تقبل؟`
                    : `Mon dernier prix : ${formatPrice(counterOffer)} MRU 🤝 Vous acceptez ?`}
                </div>
              </div>
            )}

            {step === "accepted" && (
              <div className="flex items-center justify-center gap-2 py-3 bg-islamic-50 rounded-xl">
                <CheckCircle2 size={20} className="text-islamic-400" />
                <span className="text-sm font-bold text-islamic-500">
                  {isRTL ? "تم الاتفاق! 🎉" : "Accord conclu ! 🎉"}
                </span>
              </div>
            )}

            {step === "declined" && (
              <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <img src={listing.seller.avatar} alt="" className="w-8 h-8 rounded-full bg-sand-100 flex-shrink-0" />
                <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-sm text-red-600 max-w-[80%]">
                  {isRTL
                    ? "عذراً، هذا السعر منخفض جداً. أدنى سعر أقبله: " + formatPrice(counterOffer) + " أوقية"
                    : `Désolé, c'est trop bas. Mon minimum est ${formatPrice(counterOffer)} MRU`}
                </div>
              </div>
            )}

            {/* Indicateur chargement */}
            {step === "counter" && !offer && (
              <div className="flex gap-1 px-3 py-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-sand-300 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            )}
          </div>

          {/* Input offre */}
          {step === "offer" && (
            <form onSubmit={handleSendOffer} className="space-y-3">
              <div>
                <label className={`text-xs text-night-400/60 mb-1 block ${isRTL ? "text-right" : ""}`}>
                  {isRTL ? "عرضك (أوقية)" : "Votre offre (MRU)"}
                </label>
                <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <input
                    type="number"
                    value={offer}
                    onChange={(e) => setOffer(e.target.value)}
                    placeholder={formatPrice(Math.round(listing.price * 0.9))}
                    dir="ltr"
                    required
                    className="flex-1 input-field text-sm font-bold"
                    min={1}
                    max={listing.price}
                  />
                  <button type="submit" className="btn-gold px-4 py-2.5 text-sm">
                    <Send size={14} />
                  </button>
                </div>
                <p className="text-xs text-night-400/40 mt-1">
                  {isRTL
                    ? `تقترح ${offer ? Math.round((1 - parseInt(offer) / listing.price) * 100) : "--"}% أقل من السعر`
                    : `Soit ${offer ? Math.round((1 - parseInt(offer) / listing.price) * 100) : "--"}% de moins que le prix`}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLastPrice}
                className="w-full py-2.5 border-2 border-sand-400 rounded-xl text-sand-500 text-sm font-bold hover:bg-sand-50 transition-colors"
              >
                🤝 {isRTL ? "آخر سعر؟" : "Dernier prix ?"}
              </button>
            </form>
          )}

          {/* Actions après contre-offre */}
          {(step === "counter" || step === "declined") && (
            <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button
                onClick={handleAccept}
                className="flex-1 btn-gold py-2.5 text-sm"
              >
                ✅ {isRTL ? "أقبل" : "J'accepte"}
              </button>
              <button
                onClick={() => { setStep("offer"); setOffer(""); }}
                className="flex-1 btn-outline py-2.5 text-sm"
              >
                {isRTL ? "تفاوض أكثر" : "Négocier encore"}
              </button>
            </div>
          )}

          {/* Accord conclu */}
          {step === "accepted" && (
            <div className="space-y-3">
              <button className="w-full btn-gold py-3 text-sm font-bold">
                📱 {isRTL ? "تواصل مع البائع" : "Contacter le vendeur"}
              </button>
              <p className="text-center text-xs text-night-400/50">
                {isRTL
                  ? "سيتم الاتفاق النهائي عبر الرسائل"
                  : "L'accord final sera finalisé par messagerie"}
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 pb-4 flex items-center gap-1.5 text-xs text-night-400/40">
          <Clock size={11} />
          <span>
            {isRTL
              ? `${listing.seller.nameAr} يرد عادةً خلال ${listing.seller.responseTime || "< 2h"}`
              : `${listing.seller.name} répond habituellement en ${listing.seller.responseTime || "< 2h"}`}
          </span>
        </div>
      </div>
    </div>
  );
}
