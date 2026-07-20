import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div
        className="relative overflow-hidden rounded-card px-8 py-14 text-center text-white sm:py-16"
        style={{
          background:
            "radial-gradient(circle at 25% 30%, #FFAFCC, transparent 55%), radial-gradient(circle at 75% 70%, #A2D2FF, transparent 55%), #2B2440",
        }}
      >
        <div className="grain-overlay" />
        <div className="relative z-10">
          <h2 className="font-display text-3xl font-medium italic sm:text-4xl">
            Have something to sell?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/80">
            List it in minutes — our AI assistant helps you write a listing that actually sells.
          </p>
          <Link
            href="/items/add"
            className="btn btn-primary mt-7 gap-1.5 border-none bg-white text-ink hover:bg-white/90"
          >
            List It Now <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}