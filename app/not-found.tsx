import Link from "next/link";
import { ArrowLeft, Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-lavender/30 via-pink/20 to-sky/30 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-card border border-border bg-surface p-8 text-center shadow-soft sm:p-10">
          <p className="font-display text-7xl font-bold tracking-tight text-cta/20">
            404
          </p>

          <div className="mx-auto -mt-2 mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cta-tint">
            <SearchX size={28} className="text-cta" />
          </div>

          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            Page Not Found
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let&apos;s get you back on track.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="btn btn-sm gap-1.5 rounded-field bg-ink text-white hover:bg-ink/90"
            >
              <Home size={15} />
              Go Home
            </Link>

            <Link
              href="/explore"
              className="btn btn-primary btn-sm gap-1.5 rounded-field"
            >
              Explore Items
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-ink-faint">
          If you think this is a mistake, contact us at{" "}
          <a
            href="mailto:support@relive.app"
            className="underline underline-offset-2 transition-colors hover:text-cta"
          >
            support@relive.app
          </a>
        </p>
      </div>
    </div>
  );
}
