"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPublicStats } from "@/lib/api";
import { motion } from "framer-motion";

function useCountUp(target: number, active: boolean, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    let frame: number;

    function step(timestamp: number) {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    }

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, target]);

  return value;
}

function formatPrice(price: number): string {
  return `৳${price.toLocaleString("en-BD")}`;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const statVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function StatsStrip() {
  const { data } = useQuery({ queryKey: ["public-stats"], queryFn: getPublicStats });
  const [inView, setInView] = useState(false);

  const users = useCountUp(data?.totalUsers || 0, inView && Boolean(data));
  const listings = useCountUp(data?.totalListings || 0, inView && Boolean(data));
  const gmv = useCountUp(data?.totalGMV || 0, inView && Boolean(data));
  const reviews = useCountUp(data?.totalReviews || 0, inView && Boolean(data));

  const stats = [
    { label: "Members", value: `${users.toLocaleString("en-BD")}+` },
    { label: "Active Listings", value: `${listings.toLocaleString("en-BD")}+` },
    { label: "Total Traded", value: formatPrice(gmv) },
    { label: "Reviews Given", value: `${reviews.toLocaleString("en-BD")}+` },
  ];

  return (
    <motion.section
      onViewportEnter={() => setInView(true)}
      viewport={{ once: true, amount: 0.3 }}
      className="bg-ink py-12"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-6 lg:px-8"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={statVariants} className="text-center">
            <p className="font-display text-3xl font-semibold text-white">{s.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-white/60">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}