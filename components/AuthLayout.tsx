import Link from "next/link";
import type { ReactNode } from "react";

interface Stat {
  value: string;
  label: string;
}

const STATS: Stat[] = [
  { value: "10,000+", label: "Items relisted" },
  { value: "5,000+", label: "Members" },
  { value: "50+", label: "Categories" },
];

interface AuthLayoutProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AuthLayout({ eyebrow, title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] w-full">
      {/* Branding panel — hidden below lg, this is the signature "aura" moment */}
      <div className="relative hidden w-[44%] shrink-0 overflow-hidden bg-ink lg:flex lg:flex-col lg:justify-between">
        <div className="aura-field" />
        <div className="grain-overlay" />

        <div className="relative z-10 p-12">
          <Link href="/" className="flex items-center gap-2.5">
            <span
              className="aura-ring"
              style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.25))" }}
              aria-hidden="true"
            />
            <span className="font-display text-2xl font-semibold text-white">
              Relive
            </span>
          </Link>
        </div>

        <div className="relative z-10 px-12 pb-14">
          <h2 className="font-display text-[2.35rem] italic leading-[1.15] text-white">
            Where value lives again.
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/75">
            Every item here has a story. List what you no longer need, find
            what someone else let go of — and give it a second life.
          </p>

          <div className="mt-10 flex gap-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-semibold text-white">
                  {s.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-white/60">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-[420px]">
          {eyebrow && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cta">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-[2rem] font-medium text-ink">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>
          )}

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
