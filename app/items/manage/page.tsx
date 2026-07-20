"use client";

import { deleteItem, getMyItems } from "@/lib/api";
import { useAppSession } from "@/lib/useAppSession";
import type { Item } from "@/types/domain";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Eye, Loader2, PackageOpen, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function formatPrice(price: number): string {
  return `৳${price.toLocaleString("en-BD")}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_STYLES: Record<string, string> = {
  active: "badge-success text-gray-50",
  sold: "badge-neutral",
};

export default function ManageItemsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isPending: sessionPending } = useAppSession();

  useEffect(() => {
    if (!sessionPending && !user) {
      router.replace("/login?redirect=/items/manage");
    }
  }, [sessionPending, user, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["my-items"],
    queryFn: getMyItems,
    enabled: Boolean(user),
  });

  const items = data?.items || [];
  const activeCount = items.filter((i) => i.status === "active").length;
  const soldCount = items.filter((i) => i.status === "sold").length;

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pendingDelete, setPendingDelete] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  function openDeleteConfirm(item: Item) {
    setPendingDelete(item);
    setDeleteError("");
    dialogRef.current?.showModal();
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteItem(pendingDelete._id);
      queryClient.invalidateQueries({ queryKey: ["my-items"] });
      dialogRef.current?.close();
      setPendingDelete(null);
      toast.success("Listing deleted successfully");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not delete this listing";
      setDeleteError(msg);
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  }

  if (sessionPending || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-ink-muted">
        <Loader2 className="mr-2 animate-spin" size={18} />
        Checking your session…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cta">
            Your listings
          </p>
          <h1 className="mt-1 font-display text-3xl font-medium text-ink">
            Manage Items
          </h1>
        </div>
        <Link href="/items/add" className="btn btn-primary btn-sm gap-1.5">
          <Plus size={16} /> Add Item
        </Link>
      </div>

      {/* Summary stats */}
      <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Total Listings", value: items.length },
          { label: "Active", value: activeCount },
          { label: "Sold", value: soldCount },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-card border border-border bg-surface p-4 text-center sm:text-left"
          >
            <p className="font-display text-2xl font-semibold text-ink">
              {stat.value}
            </p>
            <p className="text-xs text-ink-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="mt-8">
        {isLoading ? (
          <div className="skeleton h-64 w-full rounded-card" />
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border py-16 text-center">
            <PackageOpen size={28} className="text-ink-faint" />
            <p className="text-sm text-ink-muted">
              You haven&apos;t listed anything yet.
            </p>
            <Link href="/items/add" className="btn btn-primary btn-sm mt-1">
              List your first item
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-card border border-border">
            <table className="table">
              <thead>
                <tr className="bg-cta-tint/30 text-ink">
                  <th className="sticky left-0 z-10 bg-cta-tint/30 shadow-[4px_0_6px_-4px_rgba(43,36,64,0.15)]">
                    Item
                  </th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Posted</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const isSold = item.status === "sold";
                  return (
                    <tr key={item._id} className={isSold ? "opacity-70" : ""}>
                      <td className="sticky left-0 z-10 max-w-[260px] bg-surface shadow-[4px_0_6px_-4px_rgba(43,36,64,0.15)]">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-field bg-cta-tint/40">
                            {item.images?.[0] && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.images[0]}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-ink">
                              {item.title}
                            </p>
                            <p className="truncate text-xs text-ink-faint">
                              {item.category}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="text-sm font-medium text-ink">
                        {formatPrice(item.price)}
                      </td>
                      <td>
                        <span
                          className={`badge badge-sm capitalize ${STATUS_STYLES[item.status] || "badge-ghost"}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="text-sm text-ink-muted">
                        {formatDate(item.createdAt)}
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/items/${item._id}`}
                            className="btn btn-ghost btn-xs"
                            aria-label="View"
                            title="View"
                          >
                            <Eye size={15} />
                          </Link>
                          <Link
                            href={isSold ? "#" : `/items/${item._id}/edit`}
                            aria-disabled={isSold}
                            title={
                              isSold ? "Sold listings can't be edited" : "Edit"
                            }
                            className={`btn btn-ghost btn-xs ${isSold ? "btn-disabled" : ""}`}
                          >
                            <Pencil size={15} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => !isSold && openDeleteConfirm(item)}
                            disabled={isSold}
                            title={
                              isSold
                                ? "Sold listings can't be deleted"
                                : "Delete"
                            }
                            className="btn btn-ghost btn-xs text-error"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box max-w-sm rounded-card">
          <h3 className="font-display text-lg font-medium text-ink">
            Delete this listing?
          </h3>
          <p className="mt-2 text-sm text-ink-muted">
            {pendingDelete && (
              <>
                <span className="font-medium text-ink">
                  &ldquo;{pendingDelete.title}&rdquo;
                </span>{" "}
              </>
            )}
            will be removed from Relive. This can&apos;t be undone.
          </p>
          {deleteError && (
            <p className="mt-2 text-xs text-error">{deleteError}</p>
          )}
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn btn-ghost btn-sm">Cancel</button>
            </form>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={deleting}
              className="btn btn-error btn-sm text-white"
            >
              {deleting && <Loader2 size={13} className="animate-spin" />}
              Delete
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
