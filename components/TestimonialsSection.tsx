"use client";

import { useQuery } from "@tanstack/react-query";
import { getFeaturedReviews } from "@/lib/api";
import ReviewCard from "@/components/ReviewCard";
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
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-cta">
          Loved by our community
        </p>
        <h2 className="mt-1 font-display text-3xl font-medium text-ink">
          What buyers and sellers say
        </h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <motion.div key={i} variants={cardVariants} className="skeleton h-48 rounded-card" />
            ))
          : reviews!.map((review) => (
              <motion.div
                key={review._id}
                variants={cardVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="h-full"
              >
                <ReviewCard review={review} />
              </motion.div>
            ))}
      </motion.div>
    </section>
  );
}
