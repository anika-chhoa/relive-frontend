"use client";

import { Search, MessageCircle, CreditCard, Star } from "lucide-react";
import { motion } from "framer-motion";

const STEPS = [
  {
    icon: Search,
    title: "Browse or List",
    description: "Search for what you need, or list something you no longer use — with AI help writing the description.",
  },
  {
    icon: MessageCircle,
    title: "Ask Questions",
    description: "Chat with Riva, our AI assistant, or reach out to the seller directly before you commit.",
  },
  {
    icon: CreditCard,
    title: "Book & Pay Securely",
    description: "Hit \"Book Now\" and pay through Stripe Checkout — no cash handoffs, no guesswork.",
  },
  {
    icon: Star,
    title: "Rate the Seller",
    description: "Leave a review after your purchase — it becomes part of that seller's permanent reputation.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
} as const;

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-cta">Simple by design</p>
        <h2 className="mt-1 font-display text-3xl font-medium text-ink">How Relive Works</h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
      >
        {STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            variants={stepVariants}
            className="relative flex flex-col items-center text-center"
          >
            <motion.span
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-cta text-white shadow-soft cursor-default"
            >
              <step.icon size={22} />
            </motion.span>
            <span className="mt-3 font-display text-xs font-semibold text-cta">
              STEP {i + 1}
            </span>
            <h3 className="mt-1 text-sm font-semibold text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}