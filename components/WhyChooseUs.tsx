"use client";

import { Sparkles, ShieldCheck, Star, Lock } from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-Assisted Listings",
    description: "Stuck on what to write? Our AI drafts a polished title and description from a few keywords.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "Every purchase runs through Stripe Checkout — your card details never touch our servers.",
  },
  {
    icon: Star,
    title: "Real Seller Ratings",
    description: "Reviews follow the seller, not a single listing — so their reputation is always trustworthy.",
  },
  {
    icon: ShieldCheck,
    title: "Moderated Community",
    description: "Our team reviews reported listings and accounts to keep the marketplace safe for everyone.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
} as const;

export default function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-cta">Why Relive</p>
        <h2 className="mt-1 font-display text-3xl font-medium text-ink">Built for trust, not just transactions</h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {FEATURES.map((f) => (
          <motion.div
            key={f.title}
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            className="rounded-card border border-border bg-surface p-6 shadow-soft transition-standard hover:shadow-lift"
          >
            <motion.span
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-cta-tint text-cta"
            >
              <f.icon size={20} />
            </motion.span>
            <h3 className="mt-4 text-sm font-semibold text-ink">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}