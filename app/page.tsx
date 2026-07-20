import CategoryGrid from "@/components/CategoryGrid";
import CTABanner from "@/components/CTABanner";
import FAQSection from "@/components/FAQSection";
import FeaturedListings from "@/components/FeaturedListings";
import HeroSlider from "@/components/HeroSlider";
import HowItWorks from "@/components/HowItWorks";
import StatsStrip from "@/components/StatsStrip";
import TestimonialsSection from "@/components/TestimonialsSection";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      <CategoryGrid />
      <FeaturedListings />
       <HowItWorks />
      <StatsStrip />
      <TestimonialsSection />
      <WhyChooseUs />
      <FAQSection />
      <CTABanner />
    </div>
  );
}