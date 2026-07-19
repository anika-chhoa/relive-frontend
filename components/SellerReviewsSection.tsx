"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { getSellerReviews, createReview } from "@/lib/api";
import { useAppSession } from "@/lib/useAppSession";
import StarRating from "@/components/StarRating";
import ReviewCard from "@/components/ReviewCard";

interface SellerReviewsSectionProps {
  sellerId: string;
  sellerName?: string;
  itemId: string;
}

export default function SellerReviewsSection({
  sellerId,
  sellerName,
  itemId,
}: SellerReviewsSectionProps) {
  const queryClient = useQueryClient();
  const { user } = useAppSession();
  const isOwnListing = user?.id === sellerId;

  const { data, isLoading } = useQuery({
    queryKey: ["seller-reviews", sellerId],
    queryFn: () => getSellerReviews(sellerId),
  });

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a short review");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await createReview({ itemId, rating, comment });
      setRating(0);
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["seller-reviews", sellerId] });
      queryClient.invalidateQueries({ queryKey: ["item", itemId] });
      queryClient.invalidateQueries({ queryKey: ["featured-reviews"] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit your review");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-12">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-xl font-medium text-ink">
          Reviews of {sellerName || "this seller"}
        </h2>
        {data && data.count > 0 && (
          <StarRating value={data.avgRating} count={data.count} size={14} />
        )}
      </div>
      <p className="mt-1 text-xs text-ink-faint">
        Based on everything this seller has ever listed, not just this item.
      </p>

      {/* Submit form */}
      <div className="mt-4 rounded-card border border-border bg-surface p-5">
        {isOwnListing ? (
          <p className="text-sm text-ink-muted">This is your own listing.</p>
        ) : user ? (
          <>
            <p className="mb-2 text-sm font-medium text-ink">Leave a review</p>
            <StarRating value={rating} interactive onChange={setRating} size={16} />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this seller…"
              rows={3}
              className="textarea textarea-bordered mt-3 w-full text-sm"
            />
            {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="btn btn-primary btn-sm mt-3"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              Submit review
            </button>
          </>
        ) : (
          <p className="text-sm text-ink-muted">
            <Link href="/login" className="font-semibold text-cta hover:underline">
              Log in
            </Link>{" "}
            to leave a review.
          </p>
        )}
      </div>

      {/* Review list */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="skeleton h-40 rounded-card" />
          ))
        ) : data && data.reviews.length > 0 ? (
          data.reviews.map((review) => <ReviewCard key={review._id} review={review} />)
        ) : (
          <p className="text-sm text-ink-muted sm:col-span-2">
            No reviews yet — be the first to share your experience with this seller.
          </p>
        )}
      </div>
    </section>
  );
}
