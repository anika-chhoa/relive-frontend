"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  count?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
}

export default function StarRating({
  value,
  count,
  size = 14,
  interactive = false,
  onChange,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            disabled={!interactive}
            onClick={() => interactive && onChange?.(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(null)}
            className={interactive ? "cursor-pointer" : "cursor-default"}
            aria-label={interactive ? `Rate ${star} stars` : undefined}
          >
            <Star
              size={interactive ? size + 8 : size}
              className={star <= display ? "fill-cta text-cta" : "fill-transparent text-border"}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
      {typeof count === "number" && (
        <span className="text-xs text-ink-faint">
          {value > 0 ? value.toFixed(1) : "New"} {count > 0 && `(${count})`}
        </span>
      )}
    </div>
  );
}
