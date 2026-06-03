"use client";

import { ThumbsUp } from "lucide-react";
import type { Review } from "@/data/mockData";
import { timeAgo } from "@/data/mockData";
import StarRating from "./StarRating";
import { useLanguage } from "@/context/LanguageContext";

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
