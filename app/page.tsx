import TestimonialsSection from "@/components/TestimonialsSection";

export default function HomePage() {
  return (
    <div>
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-cta">
          Coming together, section by section
        </p>
        <h1 className="font-display text-4xl font-medium text-ink">
          Homepage sections land here next.
        </h1>
        <p className="mt-4 text-ink-muted">
          Navbar, Login, Register, Add Item, Explore and Details are wired
          up — Hero, Categories, Featured Listings and the rest of the
          homepage will be built in the next passes.
        </p>
      </div>

      <TestimonialsSection />
    </div>
  );
}
