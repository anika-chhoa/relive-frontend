"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

interface Slide {
  heading: string;
  subheading: string;
  gradient: string;
}

const SLIDES: Slide[] = [
  {
    heading: "Where value lives again.",
    subheading: "Buy and sell pre-owned items you can actually trust.",
    gradient:
      "radial-gradient(circle at 20% 20%, #FFAFCC, transparent 55%), radial-gradient(circle at 80% 30%, #A2D2FF, transparent 55%), radial-gradient(circle at 50% 90%, #CDB4DB, transparent 60%), #2B2440",
  },
  {
    heading: "Give your old things a new home.",
    subheading: "List in minutes — our AI assistant helps write the description for you.",
    gradient:
      "radial-gradient(circle at 75% 25%, #FFC8DD, transparent 55%), radial-gradient(circle at 25% 75%, #BDE0FE, transparent 55%), radial-gradient(circle at 60% 60%, #D6608F, transparent 60%), #2B2440",
  },
  {
    heading: "Shop smarter, not newer.",
    subheading: "Every seller is rated — so you always know who you're buying from.",
    gradient:
      "radial-gradient(circle at 30% 70%, #A2D2FF, transparent 55%), radial-gradient(circle at 70% 20%, #FFAFCC, transparent 55%), radial-gradient(circle at 50% 40%, #CDB4DB, transparent 60%), #2B2440",
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
    const t = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), 5000);
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
      className="relative flex h-[70vh] min-h-[520px] items-center justify-center overflow-hidden text-white transition-[background] duration-1000"
      style={{ background: SLIDES[active].gradient }}
    >
      <div className="grain-overlay" />
      <div className="absolute inset-0 bg-ink/25" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6 text-center">
        <div className="min-h-[140px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <h1 className="font-display text-4xl italic leading-tight sm:text-5xl">
                {SLIDES[active].heading}
              </h1>
              <p className="mt-4 max-w-xl text-white/85">{SLIDES[active].subheading}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-full bg-white p-1.5 shadow-lift"
        >
          <Search size={18} className="ml-3 shrink-0 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search for ${PLACEHOLDER_QUERIES[placeholderIndex]}`}
            className="flex-1 bg-transparent px-1 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
          />
          <button type="submit" className="btn btn-primary btn-sm rounded-full">
            Search
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 flex flex-wrap justify-center gap-2"
        >
          {CHIP_CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/explore?category=${encodeURIComponent(c)}`}
              className="rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-standard hover:bg-white/20"
            >
              {c}
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/explore"
            className="btn btn-outline mt-7 gap-1.5 border-white text-white hover:bg-pink-100 hover:text-white"
          >
            Browse Now <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-6 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}