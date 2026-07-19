"use client";

import { syncGoogleSession } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// 1. Move the logic that interacts with searchParams into an inner component
function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    syncGoogleSession()
      .then(() => {
        if (cancelled) return;
        const redirect = searchParams.get("redirect") || "/";
        router.replace(redirect);
      })
      .catch(() => {
        if (!cancelled)
          setError("Could not complete Google sign-in. Please try again.");
      });

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      {error ? (
        <>
          <p className="text-sm text-error">{error}</p>
          <button
            onClick={() => router.replace("/login")}
            className="btn btn-primary btn-sm"
          >
            Back to login
          </button>
        </>
      ) : (
        <>
          <Loader2 className="animate-spin text-cta" size={22} />
          <p className="text-sm text-ink-muted">Finishing sign-in…</p>
        </>
      )}
    </div>
  );
}

// 2. Export a default wrapper component that handles the Suspense state
export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
          <Loader2 className="animate-spin text-cta" size={22} />
          <p className="text-sm text-ink-muted">Loading environment…</p>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
