"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import StarRating from "./StarRating";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

const ratingLabels = {
  fr: ["", "Médiocre", "Passable", "Bien", "Très bien", "Excellent !"],
  ar: ["", "سيئ", "مقبول", "جيد", "جيد جداً", "ممتاز!"],
};

interface ReviewFormProps {
  sellerId?: string;
  listingId?: string;
  sellerName: string;
  sellerNameAr: string;
  onSubmit?: () => void;
}

export default function ReviewForm({ sellerId, listingId, sellerName, sellerNameAr, onSubmit }: ReviewFormProps) {
  const { isRTL, locale } = useLanguage();
  const { token } = useAuth();
  const { success, error: toastError } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ sellerId, listingId, rating, comment }),
      });
      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
        success(isRTL ? "شكراً! تم نشر تقييمك ✨" : "Merci ! Votre avis a été publié ✨");
        onSubmit?.();
      } else {
        toastError(json.error || (isRTL ? "خطأ في نشر التقييم" : "Erreur lors de la publication"));
      }
    } catch {
      toastError(isRTL ? "خطأ في الشبكة" : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-islamic-50 rounded-2xl p-5 flex items-center gap-3">
        <CheckCircle2 size={24} className="text-islamic-400 flex-shrink-0" />
        <p className={`text-sm font-semibold text-islamic-500 ${isRTL ? "font-arabic" : ""}`}>
          {isRTL ? "شكراً! تم نشر تقييمك." : "Merci ! Votre avis a bien été publié."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-card space-y-4">
      <h4 className={`font-semibold text-night-500 ${isRTL ? "text-right" : ""}`}>
        {isRTL ? `قيّم ${sellerNameAr}` : `Laisser un avis pour ${sellerName}`}
      </h4>
      <div className={`flex flex-col gap-2 ${isRTL ? "items-end" : "items-start"}`}>
        <p className="text-xs text-night-400/60">{isRTL ? "تقييمك الإجمالي" : "Votre note globale"}</p>
        <StarRating value={rating} size={28} interactive onChange={setRating} />
        {rating > 0 && (
          <p className="text-xs text-sand-500 font-semibold">{ratingLabels[locale][rating]}</p>
        )}
      </div>
      <div>
        <label className={`text-xs text-night-400/60 mb-1.5 block ${isRTL ? "text-right" : ""}`}>
          {isRTL ? "تعليقك (اختياري)" : "Votre commentaire (optionnel)"}
        </label>
        <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)}
          dir={isRTL ? "rtl" : "ltr"}
          placeholder={isRTL ? "شارك تجربتك مع هذا البائع..." : "Partagez votre expérience avec ce vendeur..."}
          className="input-field resize-none text-sm" />
      </div>
      <button type="submit" disabled={rating === 0 || loading}
        className="w-full btn-gold py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed">
        {loading ? <Loader2 size={16} className="animate-spin" /> : (isRTL ? "نشر التقييم" : "Publier l'avis")}
      </button>
    </form>
  );
}
