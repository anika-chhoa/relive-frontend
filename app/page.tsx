import FeaturedListings from "@/components/FeaturedListings";
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
          Hero and Categories are still coming — Featured Listings and
          Testimonials are live below.
        </p>
      </div>

      <FeaturedListings />
      <TestimonialsSection />
    </div>
  );
}