import StarRating from "@/components/StarRating";
import type { Item } from "@/types/domain";
import { MapPin } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

const CONDITION_STYLES: Record<string, string> = {
  "Like New": "badge-success text-gray-50",
  Good: "badge-info",
  Fair: "badge-warning",
  "Needs Repair": "badge-error",
};

function formatPrice(price: number): string {
  return `৳${price.toLocaleString("en-BD")}`;
}

export default function ItemCard({ item }: { item: Item }) {
  return (
    <div className="card h-full w-full overflow-hidden rounded-card border border-border bg-surface shadow-soft transition-standard hover:-translate-y-0.5 hover:shadow-lift">
      <figure className="relative aspect-[4/3] w-full overflow-hidden bg-cta-tint/40">
        {item.status === "sold" && (
          <span className="badge badge-neutral badge-sm absolute left-2 top-2 z-10 shadow-soft">
            Sold
          </span>
        )}
        <span className="badge badge-sm absolute right-2 top-2 z-10 border-none bg-green-100 text-ink shadow-soft backdrop-blur-sm">
          {item.category}
        </span>
        {item.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.images[0]}
            alt={item.title}
            className="h-full w-full object-cover transition-standard hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span
              className="aura-ring"
              style={{ "--ring-size": "48px" } as CSSProperties}
            />
          </div>
        )}
      </figure>

      <div className="card-body gap-2 p-4">
        <h3 className="truncate font-display text-base font-medium text-ink">
          {item.title}
        </h3>
        <StarRating
          value={item.avgRating || 0}
          count={item.reviewCount || 0}
          size={12}
        />
        <p className="line-clamp-2 text-sm text-ink-muted">
          {item.shortDescription}
        </p>

        <div className="mt-1 flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-cta">
            {formatPrice(item.price)}
          </span>
          <span
            className={`badge badge-sm ${CONDITION_STYLES[item.condition] || "badge-ghost"}`}
          >
            {item.condition}
          </span>
        </div>

        <p className="flex items-center gap-1 text-xs text-ink-faint">
          <MapPin size={12} />
          {item.location}
        </p>

        <Link
          href={`/items/${item._id}`}
          className="btn btn-primary btn-sm mt-2 w-full"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
