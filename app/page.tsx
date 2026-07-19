import CategoryGrid from "@/components/CategoryGrid";
import FeaturedListings from "@/components/FeaturedListings";
import HeroSlider from "@/components/HeroSlider";
import TestimonialsSection from "@/components/TestimonialsSection";

export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      <CategoryGrid />
      <FeaturedListings />
      <TestimonialsSection />
    </div>
  );
}