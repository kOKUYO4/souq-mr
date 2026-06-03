"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
}

export default function StarRating({
  value,
  max = 5,
  size = 16,
  interactive = false,
  onChange,
  showValue = false,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => interactive && onChange?.(i + 1)}
          disabled={!interactive}
          className={`transition-transform ${interactive ? "hover:scale-110 cursor-pointer" : "cursor-default"}`}
        >
          <Star
            size={size}
            className={i < value ? "text-sand-400 fill-sand-400" : "text-sand-200"}
          />
        </button>
      ))}
      {showValue && (
        <span className="text-sm font-bold text-night-500 ml-1">{value.toFixed(1)}</span>
      )}
    </div>
  );
}
