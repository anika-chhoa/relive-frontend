"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

interface Slide {
  heading: string;
  subheading: string;
  imageSrc: string;
  imageAlt: string;
  accentColor: string; // Dynamic mapping to match chip highlights perfectly
}

const SLIDES: Slide[] = [
  {
    heading: "Where value lives again.",
    subheading: "Buy and sell authenticated, premium pre-owned items you can genuinely trust.",
    imageSrc: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Minimalist pre-owned luxury clothing boutique apparel display racks",
    accentColor: "var(--color-pink)",
  },
  {
    heading: "Give your old things a new home.",
    subheading: "List your home essentials in minutes — our AI assistant handles the detailing.",
    imageSrc: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Modern organized bright living room furniture and interior setup",
    accentColor: "var(--color-sky)",
  },
  {
    heading: "Shop smarter, not newer.",
    subheading: "Every electronics merchant is fully verified and rated for your absolute peace of mind.",
    imageSrc: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Aesthetic premium creator workspace layout featuring a camera, smartphone, and electronics items",
    accentColor: "var(--color-lavender)",
  },
];

const PLACEHOLDER_QUERIES = ["iPhone...", "Sofa...", "Bicycle...", "Camera...", "Study table..."];
const CHIP_CATEGORIES = CATEGORIES.slice(0, 5);

export default function HeroSlider() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setPlaceholderIndex((i) => (i + 1) % PLACEHOLDER_QUERIES.length),
      2500
    );
    return () => clearInterval(t);
  }, []);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    router.push(query.trim() ? `/explore?search=${encodeURIComponent(query.trim())}` : "/explore");
  }

  return (
    <section 
      className="relative flex h-[75vh] min-h-[560px] items-center justify-center overflow-hidden text-white bg-[var(--color-ink)]"
    >
      {/* 1. PHOTOGRAPHIC IMAGERY LAYER */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 0.45, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="relative h-full w-full"
          >
            <Image
              src={SLIDES[active].imageSrc}
              alt={SLIDES[active].imageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover luminosity filter mix-blend-luminosity" 
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. BRAND COLOR VIGNETTE SHIELD & GRAIN SHIFT */}
      {/* Dynamic linear overlay matching the deep --color-ink base token */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#2B2440] via-[#2B2440]/70 to-[#2B2440]/40" />
      <div className="grain-overlay opacity-[0.25] z-10 pointer-events-none" />

      {/* 3. INTERFACE CONTROLS & CONTENT CANVAS */}
      <div className="relative z-20 mx-auto flex w-full max-w-3xl flex-col items-center px-6 text-center">
        <div className="min-h-[160px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              {/* Heading stylized using the signature editorial serif font */}
              <h1 className="font-display text-4xl font-medium italic tracking-tight sm:text-6xl text-[var(--color-bg)] drop-shadow-sm leading-[1.2]">
                {SLIDES[active].heading}
              </h1>
              {/* Subheading optimized with clean readability tracking */}
              <p className="mt-4 max-w-xl text-sm sm:text-base text-[var(--color-bg)]/85 tracking-wide font-normal font-body">
                {SLIDES[active].subheading}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* FLOATING SEARCH BAR CONSOLE */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-full bg-[var(--color-surface)] p-1.5 shadow-[var(--shadow-lift)] transition-all duration-300 focus-within:ring-2 focus-within:ring-[var(--color-lavender)]"
        >
          <Search size={18} className="ml-4 shrink-0 text-[var(--color-ink-faint)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search for ${PLACEHOLDER_QUERIES[placeholderIndex]}`}
            className="flex-1 bg-transparent px-2 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:outline-none font-medium"
          />
          <button 
            type="submit" 
            className="transition-standard bg-[var(--color-cta)] hover:bg-[var(--color-cta-hover)] text-[var(--color-bg)] font-medium text-xs px-6 h-10 rounded-full shadow-sm"
          >
            Search
          </button>
        </motion.form>

        {/* CONTEXT QUICK-SELECTION CHIPS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 flex flex-wrap justify-center gap-2"
        >
          {CHIP_CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/explore?category=${encodeURIComponent(c)}`}
              className="rounded-full border border-[var(--color-bg)]/20 bg-[var(--color-bg)]/10 px-4 py-1.5 text-xs font-medium text-[var(--color-bg)] backdrop-blur-sm transition-all duration-200 hover:bg-[var(--color-bg)]/20 hover:border-[var(--color-bg)]/40"
            >
              {c}
            </Link>
          ))}
        </motion.div>

        {/* PRIMARY ACTION ROUTE */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/explore"
            className="transition-standard inline-flex items-center gap-2 border-2 border-[var(--color-bg)] text-[var(--color-bg)] rounded-full font-semibold px-6 py-2.5 mt-8 text-sm hover:bg-[var(--color-bg)] hover:text-[var(--color-ink)] shadow-md"
          >
            Browse Now <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>

      {/* TRACK INJECTION DOT SYSTEM WITH ACTIVE CONTRAST */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Switch view to slide option ${i + 1}`}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === active ? "24px" : "8px",
              backgroundColor: i === active ? SLIDES[active].accentColor : "rgba(255, 255, 255, 0.35)"
            }}
          />
        ))}
      </div>
    </section>
  );
}