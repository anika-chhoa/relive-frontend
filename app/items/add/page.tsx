"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppSession } from "@/lib/useAppSession";
import { createItem } from "@/lib/api";
import ItemForm, { type ItemFormValues } from "@/components/ItemForm";

export default function AddItemPage() {
  const router = useRouter();
  const { user, isPending } = useAppSession();

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login?redirect=/items/add");
    }
  }, [isPending, user, router]);

  if (isPending || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-ink-muted">
        <Loader2 className="mr-2 animate-spin" size={18} />
        Checking your session…
      </div>
    );
  }

  async function handleSubmit(values: ItemFormValues, images: string[]) {
    const created = await createItem({ ...values, images });
    router.push(`/items/manage?added=${created.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-xs font-semibold uppercase tracking-wider text-cta">Sell on Relive</p>
      <h1 className="mt-1 font-display text-3xl font-medium text-ink">List a new item</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Fill in the basics, then let the AI assistant help you write a
        listing — or write it yourself.
      </p>

      <div className="mt-8">
        <ItemForm
          onSubmit={handleSubmit}
          submitLabel="Submit listing"
          submittingLabel="Publishing…"
        />
      </div>
    </div>
  );
}
