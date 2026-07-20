"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CTABanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-card px-8 py-14 text-center text-white sm:py-16"
        style={{
          background:
            "radial-gradient(circle at 25% 30%, #FFAFCC, transparent 55%), radial-gradient(circle at 75% 70%, #A2D2FF, transparent 55%), #2B2440",
        }}
      >
        <div className="grain-overlay" />
        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-3xl font-medium italic sm:text-4xl"
          >
            Have something to sell?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-3 max-w-md text-white/80"
          >
            List it in minutes — our AI assistant helps you write a listing that actually sells.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block mt-7"
          >
            <Link
              href="/items/add"
              className="btn btn-primary gap-1.5 border-none bg-white text-ink hover:bg-white/90"
            >
              List It Now <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}