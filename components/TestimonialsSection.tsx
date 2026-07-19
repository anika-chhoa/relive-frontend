"use client";

import { useQuery } from "@tanstack/react-query";
import { getFeaturedReviews } from "@/lib/api";
import ReviewCard from "@/components/ReviewCard";

export default function TestimonialsSection() {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["featured-reviews"],
    queryFn: () => getFeaturedReviews(6),
  });

  if (!isLoading && (!reviews || reviews.length === 0)) {
    return null; // no reviews yet — nothing to show, no placeholder content
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-cta">
          Loved by our community
        </p>
        <h2 className="mt-1 font-display text-3xl font-medium text-ink">
          What buyers and sellers say
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-48 rounded-card" />
            ))
          : reviews!.map((review) => <ReviewCard key={review._id} review={review} />)}
      </div>
    </section>
  );
}
