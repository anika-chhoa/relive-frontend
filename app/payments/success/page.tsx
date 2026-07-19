"use client";

import { getPaymentSessionStatus } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// 1. Core Logic Component
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["payment-session", sessionId],
    queryFn: () => getPaymentSessionStatus(sessionId as string),
    enabled: Boolean(sessionId),
  });

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      {isLoading ? (
        <>
          <Loader2 className="animate-spin text-cta" size={28} />
          <p className="mt-3 text-sm text-ink-muted">
            Confirming your payment…
          </p>
        </>
      ) : isError || data?.status !== "paid" ? (
        <>
          <XCircle className="text-error" size={40} />
          <h1 className="mt-4 font-display text-2xl font-medium text-ink">
            We couldn&apos;t confirm this payment
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            If you completed checkout, this may just take a moment to update.
            Otherwise, please try again.
          </p>
        </>
      ) : (
        <>
          <CheckCircle2 className="text-success" size={40} />
          <h1 className="mt-4 font-display text-2xl font-medium text-ink">
            Payment successful!
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            The seller has been notified. This item is now marked as sold.
          </p>
          {data.itemId && (
            <Link
              href={`/items/${data.itemId}`}
              className="btn btn-primary btn-sm mt-6"
            >
              View item
            </Link>
          )}
        </>
      )}

      <Link
        href="/explore"
        className="mt-4 text-sm font-medium text-cta hover:underline"
      >
        Continue exploring
      </Link>
    </div>
  );
}

// 2. Main Page Export wrapped in Suspense
export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
          <Loader2 className="animate-spin text-cta" size={28} />
          <p className="mt-3 text-sm text-ink-muted">Loading payment status…</p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
