"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getItems } from "@/lib/api";
import ItemCard from "@/components/ItemCard";
import ItemCardSkeleton from "@/components/ItemCardSkeleton";

export default function FeaturedListings() {
  const { data, isLoading } = useQuery({
    queryKey: ["featured-listings"],
    queryFn: () => getItems({ sort: "newest", limit: 4 }),
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cta">
            Fresh on Relive
          </p>
          <h2 className="mt-1 font-display text-3xl font-medium text-ink">
            Featured Listings
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            Recently added items from trusted sellers
          </p>
        </div>
        <Link
          href="/explore"
          className="flex items-center gap-1 text-sm font-semibold text-cta hover:underline"
        >
          View All <ArrowRight size={15} />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <ItemCardSkeleton key={i} />)
          : data?.items.map((item) => <ItemCard key={item._id} item={item} />)}
      </div>

      {!isLoading && data?.items.length === 0 && (
        <p className="mt-10 text-center text-sm text-ink-muted">
          No items listed yet — be the first to sell something on Relive.
        </p>
      )}
    </section>
  );
}