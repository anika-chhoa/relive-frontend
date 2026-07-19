import StarRating from "@/components/StarRating";
import type { Review } from "@/types/domain";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-card border border-border bg-surface p-5 shadow-soft">
      <StarRating value={review.rating} size={13} />
      <p className="flex-1 text-sm leading-relaxed text-ink-muted">&ldquo;{review.comment}&rdquo;</p>

      <div className="mt-1 flex items-center gap-3 border-t border-border pt-4">
        {review.reviewerImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.reviewerImage}
            alt=""
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lavender text-sm font-semibold text-ink">
            {review.reviewerName.charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{review.reviewerName}</p>
          <p className="truncate text-xs text-ink-faint">
            {review.itemTitle ? `on ${review.itemTitle}` : formatDate(review.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
