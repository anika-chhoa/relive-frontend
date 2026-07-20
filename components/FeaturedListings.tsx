"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getItems } from "@/lib/api";
import ItemCard from "@/components/ItemCard";
import ItemCardSkeleton from "@/components/ItemCardSkeleton";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
} as const;

export default function FeaturedListings() {
  const { data, isLoading } = useQuery({
    queryKey: ["featured-listings"],
    queryFn: () => getItems({ sort: "newest", limit: 4 }),
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
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
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <motion.div key={i} variants={cardVariants}>
                <ItemCardSkeleton />
              </motion.div>
            ))
          : data?.items.map((item) => (
              <motion.div key={item._id} variants={cardVariants} className="h-full w-full">
                <ItemCard item={item} />
              </motion.div>
            ))}
      </motion.div>

      {!isLoading && data?.items.length === 0 && (
        <p className="mt-10 text-center text-sm text-ink-muted">
          No items listed yet — be the first to sell something on Relive.
        </p>
      )}
    </section>
  );
}