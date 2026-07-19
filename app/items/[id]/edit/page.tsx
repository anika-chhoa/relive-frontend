"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useAppSession } from "@/lib/useAppSession";
import { getItemById, updateItem } from "@/lib/api";
import ItemForm, { type ItemFormValues } from "@/components/ItemForm";

export default function EditItemPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { user, isPending: sessionPending } = useAppSession();

  const { data: item, isLoading: itemLoading, isError } = useQuery({
    queryKey: ["item", id],
    queryFn: () => getItemById(id),
  });

  useEffect(() => {
    if (!sessionPending && !user) {
      router.replace(`/login?redirect=/items/${id}/edit`);
    }
  }, [sessionPending, user, router, id]);

  const isLoading = sessionPending || itemLoading;
  const notOwner = item && user && item.sellerId !== user.id;
  const notEditable = item && item.status !== "active";

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-ink-muted">
        <Loader2 className="mr-2 animate-spin" size={18} />
        Loading…
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-ink-muted">
        This listing couldn&apos;t be found.
      </div>
    );
  }

  if (notOwner) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-ink-muted">
        You can only edit your own listings.
      </div>
    );
  }

  if (notEditable) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-ink-muted">
        This listing has already been sold and can no longer be edited.
      </div>
    );
  }

  async function handleSubmit(values: ItemFormValues, images: string[]) {
    await updateItem(id, { ...values, images });
    router.push("/items/manage?updated=1");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-xs font-semibold uppercase tracking-wider text-cta">Sell on Relive</p>
      <h1 className="mt-1 font-display text-3xl font-medium text-ink">Edit listing</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Update your listing details — the AI assistant is here too if you
        want a fresh description.
      </p>

      <div className="mt-8">
        <ItemForm
          initialValues={{
            title: item.title,
            category: item.category,
            condition: item.condition,
            price: String(item.price),
            location: item.location,
            shortDescription: item.shortDescription,
            fullDescription: item.fullDescription,
          }}
          initialImages={item.images}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
          submittingLabel="Saving…"
        />
      </div>
    </div>
  );
}
