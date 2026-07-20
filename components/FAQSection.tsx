"use client";

import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "How does Relive work?",
    a: "Relive is a peer-to-peer marketplace for secondhand goods. Sellers list items with photos and descriptions. Buyers browse, purchase securely through Stripe Checkout, and arrange pickup or delivery directly with the seller.",
  },
  {
    q: "Is it free to list items?",
    a: "Yes — listing items on Relive is completely free. We only take a small transaction fee when an item is sold, which helps us cover payment processing and platform maintenance.",
  },
  {
    q: "How are payments handled?",
    a: "All payments go through Stripe Checkout, a secure payment processor. Your payment details are never stored on our servers. Funds are held securely and released to the seller after the transaction is confirmed.",
  },
  {
    q: "Can I return an item I bought?",
    a: "Returns are handled between the buyer and seller directly. We encourage both parties to communicate and come to a fair agreement. If you run into an issue, our moderation team can help mediate.",
  },
  {
    q: "How do I contact a seller?",
    a: "Each listing has a contact option that lets you message the seller directly through the platform. You can ask questions, arrange meetups, or negotiate pricing before making a purchase.",
  },
  {
    q: "How is my account protected?",
    a: "We use JWT-based authentication with optional Google sign-in. Your data is encrypted in transit and at rest. Our moderation team reviews reported accounts and listings to keep the community safe.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
} as const;

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-cta">Help Center</p>
        <h2 className="mt-1 font-display text-3xl font-medium text-ink">Frequently Asked Questions</h2>
        <p className="mt-2 text-sm text-ink-muted">Everything you need to know about buying and selling on Relive</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="mt-10 space-y-3"
      >
        {FAQ_ITEMS.map((item, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="rounded-card border border-border bg-surface shadow-soft transition-standard"
          >
            <button
              type="button"
              onClick={() => toggle(i)}
              className="flex w-full items-center gap-3 px-5 py-4 text-left sm:px-6"
              aria-expanded={openIndex === i}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cta-tint text-cta">
                <HelpCircle size={16} />
              </span>
              <span className="flex-1 text-sm font-semibold text-ink">{item.q}</span>
              <motion.span
                animate={{ rotate: openIndex === i ? 180 : 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="shrink-0 text-ink-faint"
              >
                <ChevronDown size={18} />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {openIndex === i && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border px-5 pb-5 pt-3 sm:px-6">
                    <p className="text-sm leading-relaxed text-ink-muted">{item.a}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
