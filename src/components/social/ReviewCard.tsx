"use client";

import { ThumbsUp } from "lucide-react";
import StarRating from "./StarRating";
import { useLanguage } from "@/context/LanguageContext";

export interface Review {
  id: string;
  author: string;
  authorAr: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  commentAr: string;
  sellerId: string;
  listingId?: string;
}

const timeAgo = (date: string, locale: "fr" | "ar"): string => {
  const now = new Date();
  const then = new Date(date);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
  const days = Math.floor(diff / 86400);
  const hours = Math.floor(diff / 3600);
  if (locale === "ar") {
    if (days > 7) return `منذ ${Math.floor(days / 7)} أسابيع`;
    if (days > 0) return `منذ ${days} أيام`;
    if (hours > 0) return `منذ ${hours} ساعات`;
    return "منذ قليل";
  }
  if (days > 7) return `il y a ${Math.floor(days / 7)} semaines`;
  if (days > 0) return `il y a ${days} jours`;
  if (hours > 0) return `il y a ${hours} heures`;
  return "à l'instant";
};

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { isRTL, locale } = useLanguage();

  return (
    <div className={`bg-white rounded-2xl p-5 shadow-card ${isRTL ? "text-right" : ""}`}>
      <div className={`flex items-start gap-3 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
        <img
          src={review.avatar}
          alt={review.author}
          className="w-10 h-10 rounded-full bg-sand-100 flex-shrink-0"
        />
        <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
          <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
            <p className="text-sm font-semibold text-night-500">
              {isRTL ? review.authorAr : review.author}
            </p>
            <span className="text-xs text-night-400/50">{timeAgo(review.date, locale)}</span>
          </div>
          <StarRating value={review.rating} size={13} />
        </div>
      </div>

      <p className={`text-sm text-night-500/80 leading-relaxed ${isRTL ? "font-arabic" : ""}`}>
        {isRTL ? review.commentAr : review.comment}
      </p>

      <div className={`flex items-center gap-1.5 mt-3 ${isRTL ? "flex-row-reverse" : ""}`}>
        <button className="flex items-center gap-1 text-xs text-night-400/50 hover:text-sand-500 transition-colors">
          <ThumbsUp size={12} />
          {isRTL ? "مفيد" : "Utile"}
        </button>
      </div>
    </div>
  );
}
