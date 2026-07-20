"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Smartphone,
  Sofa,
  Shirt,
  Car,
  BookOpen,
  Dumbbell,
  Baby,
  Refrigerator,
  type LucideIcon,
} from "lucide-react";
import { getCategoryCounts } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import { motion } from "framer-motion";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Electronics & Gadgets": Smartphone,
  "Furniture & Home": Sofa,
  "Fashion & Accessories": Shirt,
  Vehicles: Car,
  "Books & Stationery": BookOpen,
  "Sports & Outdoor": Dumbbell,
  "Baby & Kids": Baby,
  "Home Appliances": Refrigerator,
};

const MotionLink = motion(Link);

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
} as const;

export default function CategoryGrid() {
  const { data } = useQuery({
    queryKey: ["category-counts"],
    queryFn: getCategoryCounts,
  });

  const countFor = (category: string) =>
    data?.find((c) => c.category === category)?.count || 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-cta">
          Start browsing
        </p>
        <h2 className="mt-1 font-display text-3xl font-medium text-ink">Browse by Category</h2>
        <p className="mt-2 text-sm text-ink-muted">Find exactly what you're looking for</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >
        {CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category] || Smartphone;
          const count = countFor(category);
          return (
            <MotionLink
              key={category}
              href={`/explore?category=${encodeURIComponent(category)}`}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex flex-col items-center gap-3 rounded-card border border-border bg-surface p-6 text-center shadow-soft transition-standard hover:shadow-lift"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cta-tint text-cta transition-standard group-hover:bg-cta group-hover:text-white">
                <Icon size={24} />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{category}</p>
                <p className="mt-0.5 text-xs text-ink-faint">
                  {count > 0 ? `${count}+ items` : "New"}
                </p>
              </div>
            </MotionLink>
          );
        })}
      </motion.div>
    </section>
  );
}