"use client";

// 1. Import 'use' from React
import ItemCard from "@/components/ItemCard";
import ItemCardSkeleton from "@/components/ItemCardSkeleton";
import ItemGallery from "@/components/ItemGallery";
import SellerReviewsSection from "@/components/SellerReviewsSection";
import StarRating from "@/components/StarRating";
import { createCheckoutSession, getItemById, getItems } from "@/lib/api";
import { useAppSession } from "@/lib/useAppSession";
import { useQuery } from "@tanstack/react-query";
import {
  BadgeCheck,
  CalendarDays,
  CreditCard,
  Loader2,
  MapPin,
  Tag,
} from "lucide-react";
import { use, useState } from "react";

const CONDITION_STYLES: Record<string, string> = {
  "Like New": "badge-success !text-white",
  Good: "badge-info",
  Fair: "badge-warning",
  "Needs Repair": "badge-error",
};

function formatPrice(price: number): string {
  return `৳${price.toLocaleString("en-BD")}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// 2. Type 'params' explicitly as a Promise of an object
export default function ItemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 3. Unwrap the params promise using React's use hook
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { user } = useAppSession();

  const {
    data: item,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["item", id],
    queryFn: () => getItemById(id),
  });

  const { data: related, isLoading: relatedLoading } = useQuery({
    queryKey: ["related-items", item?.category, id],
    queryFn: () =>
      getItems({ category: item!.category, excludeId: id, limit: 4 }),
    enabled: Boolean(item?.category),
  });

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  async function handleBookNow() {
    if (!user) {
      window.location.href = `/login?redirect=/items/${id}`;
      return;
    }
    setCheckoutError("");
    setCheckoutLoading(true);
    try {
      const { url } = await createCheckoutSession(id);
      window.location.href = url;
    } catch (err) {
      setCheckoutError(
        err instanceof Error ? err.message : "Could not start checkout",
      );
      setCheckoutLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="skeleton aspect-[4/3] w-full rounded-card" />
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-ink-muted">
          This listing couldn't be found — it may have been removed.
        </p>
      </div>
    );
  }

  const isSold = item.status === "sold";
  const isOwnListing = user?.id === item.sellerId;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[7fr_3fr]">
        {/* Gallery */}
        <div className="relative">
          <ItemGallery images={item.images} title={item.title} />
          {isSold && (
            <span className="badge badge-neutral absolute left-4 top-4 gap-1 shadow-soft">
              <BadgeCheck size={13} /> Sold
            </span>
          )}
        </div>

        {/* Info card */}
        <div>
          <div className="lg:sticky lg:top-24">
            <div className="rounded-card border border-border bg-surface p-6 shadow-soft">
              <span
                className={`badge badge-sm ${CONDITION_STYLES[item.condition] || "badge-ghost"}`}
              >
                {item.condition}
              </span>
              <h1 className="mt-3 font-display text-2xl font-medium text-ink">
                {item.title}
              </h1>
              <p className="mt-2 font-display text-3xl font-semibold text-cta">
                {formatPrice(item.price)}
              </p>

              <div className="mt-4 flex flex-col gap-2 text-sm text-ink-muted">
                <span className="flex items-center gap-2">
                  <MapPin size={15} /> {item.location}
                </span>
                <span className="flex items-center gap-2">
                  <Tag size={15} /> {item.category}
                </span>
                <span className="flex items-center gap-2">
                  <CalendarDays size={15} /> Posted {formatDate(item.createdAt)}
                </span>
              </div>

              <div className="my-5 h-px bg-border" />

              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lavender text-sm font-semibold text-ink">
                  {(item.sellerName || "R").charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {item.sellerName || "Relive seller"}
                  </p>
                  <StarRating
                    value={item.avgRating || 0}
                    count={item.reviewCount || 0}
                    size={11}
                  />
                </div>
              </div>

              {isSold ? (
                <button
                  type="button"
                  disabled
                  className="btn btn-disabled mt-5 w-full"
                >
                  This item has been sold
                </button>
              ) : isOwnListing ? (
                <button
                  type="button"
                  disabled
                  className="btn btn-disabled mt-5 w-full"
                >
                  This is your own listing
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleBookNow}
                    disabled={checkoutLoading}
                    className="btn btn-primary mt-5 w-full gap-2"
                  >
                    {checkoutLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <CreditCard size={16} />
                    )}
                    Book Now — Pay with Stripe
                  </button>
                  <p className="mt-2 text-center text-[11px] text-ink-faint">
                    Demo checkout charges in USD (Stripe doesn&apos;t settle in
                    BDT).
                  </p>
                  {checkoutError && (
                    <p className="mt-1 text-center text-xs text-error">
                      {checkoutError}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-12 grid gap-10 lg:grid-cols-[7fr_3fr]">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="font-display text-xl font-medium text-ink">
              Description
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-muted">
              {item.fullDescription}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink">
              Key Information
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-4 rounded-card border border-border bg-surface p-5 sm:grid-cols-3">
              <div>
                <p className="text-xs text-ink-faint">Category</p>
                <p className="text-sm font-medium text-ink">{item.category}</p>
              </div>
              <div>
                <p className="text-xs text-ink-faint">Condition</p>
                <p className="text-sm font-medium text-ink">{item.condition}</p>
              </div>
              <div>
                <p className="text-xs text-ink-faint">Location</p>
                <p className="text-sm font-medium text-ink">{item.location}</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <SellerReviewsSection
        sellerId={item.sellerId}
        sellerName={item.sellerName}
        itemId={item._id}
      />

      {/* Related items */}
      {(relatedLoading || (related && related.items.length > 0)) && (
        <section className="mt-14">
          <h2 className="font-display text-xl font-medium text-ink">
            Related Items
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {relatedLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <ItemCardSkeleton key={i} />
                ))
              : related?.items.map((relatedItem) => (
                  <ItemCard key={relatedItem._id} item={relatedItem} />
                ))}
          </div>
        </section>
      )}
    </div>
  );
}
