import { Search, MessageCircle, CreditCard, Star } from "lucide-react";

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

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-cta">Simple by design</p>
        <h2 className="mt-1 font-display text-3xl font-medium text-ink">How Relive Works</h2>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <div key={step.title} className="relative flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cta text-white shadow-soft">
              <step.icon size={22} />
            </span>
            <span className="mt-3 font-display text-xs font-semibold text-cta">
              STEP {i + 1}
            </span>
            <h3 className="mt-1 text-sm font-semibold text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}