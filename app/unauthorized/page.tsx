"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, Home, LogIn, ShieldOff } from "lucide-react";

function UnauthorizedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const isForbidden = reason === "forbidden";

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-lavender/30 via-pink/20 to-sky/30 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-card border border-border bg-surface p-8 text-center shadow-soft sm:p-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cta-tint">
            {isForbidden ? (
              <ShieldOff size={28} className="text-cta" />
            ) : (
              <LogIn size={28} className="text-cta" />
            )}
          </div>

          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            {isForbidden ? "Access Denied" : "Authentication Required"}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            {isForbidden
              ? "You don't have permission to access this page. If you believe this is a mistake, please reach out to our support team."
              : "You need to be logged in to access this page. Sign in to your account or create a new one to get started."}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-outline btn-sm gap-1.5 rounded-field border-border text-ink-muted hover:border-ink-faint hover:text-ink"
            >
              <ArrowLeft size={15} />
              Go Back
            </button>

            <Link href="/" className="btn btn-sm gap-1.5 rounded-field bg-ink text-white hover:bg-ink/90">
              <Home size={15} />
              Go Home
            </Link>

            {!isForbidden && (
              <Link href="/login" className="btn btn-primary btn-sm gap-1.5 rounded-field">
                <LogIn size={15} />
                Log In
              </Link>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-ink-faint">
          If you need help, contact us at{" "}
          <a href="mailto:support@relive.app" className="underline underline-offset-2 hover:text-cta transition-colors">
            support@relive.app
          </a>
        </p>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center text-ink-muted">
          Loading…
        </div>
      }
    >
      <UnauthorizedContent />
    </Suspense>
  );
}
