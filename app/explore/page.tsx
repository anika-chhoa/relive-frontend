"use client";

import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { getItems } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import ItemCard from "@/components/ItemCard";
import ItemCardSkeleton from "@/components/ItemCardSkeleton";
import type { SortOption } from "@/types/domain";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const LIMIT = 8;

export default function ExplorePage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Debounce the search box so we're not firing a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["items", { search, category, minPrice, maxPrice, sort, page }],
    queryFn: () =>
      getItems({ search, category, minPrice, maxPrice, sort, page, limit: LIMIT }),
    placeholderData: keepPreviousData,
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / LIMIT)) : 1;
  const hasActiveFilters = Boolean(category || minPrice || maxPrice);

  function resetFilters() {
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  }

  function handleFilterChange(setter: (v: string) => void) {
    return (value: string) => {
      setter(value);
      setPage(1);
    };
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-cta">Explore</p>
        <h1 className="mt-1 font-display text-3xl font-medium text-ink">
          Find your next favorite thing
        </h1>
      </div>

      {/* Search bar */}
      <div className="mb-4 flex gap-2">
        <label className="input input-bordered flex flex-1 items-center gap-2">
          <Search size={16} className="text-ink-faint" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for items…"
            className="grow text-sm"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              aria-label="Clear search"
              className="text-ink-faint hover:text-ink-muted"
            >
              <X size={15} />
            </button>
          )}
        </label>
        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          className={`btn gap-1.5 sm:hidden ${filtersOpen ? "btn-primary" : "btn-outline"}`}
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters sidebar */}
        <aside className={`w-full shrink-0 lg:block lg:w-64 ${filtersOpen ? "block" : "hidden"}`}>
          <div className="rounded-card border border-border bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">Filters</h2>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-medium text-cta hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="mb-5">
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => handleFilterChange(setCategory)(e.target.value)}
                className="select select-bordered select-sm w-full"
              >
                <option value="">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">
                Price range (৳)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) => handleFilterChange(setMinPrice)(e.target.value)}
                  placeholder="Min"
                  className="input input-bordered input-sm w-full"
                />
                <span className="text-ink-faint">–</span>
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => handleFilterChange(setMaxPrice)(e.target.value)}
                  placeholder="Max"
                  className="input input-bordered input-sm w-full"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-ink-muted">
              {isLoading ? "Loading…" : `${data?.total ?? 0} items found`}
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="select select-bordered select-sm"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {isError && (
            <div className="alert alert-error text-sm">
              <span>Could not load listings right now. Please try again.</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: LIMIT }).map((_, i) => <ItemCardSkeleton key={i} />)
              : data?.items.map((item) => <ItemCard key={item._id} item={item} />)}
          </div>

          {!isLoading && data?.items.length === 0 && (
            <div className="mt-10 text-center text-sm text-ink-muted">
              No items match your search. Try adjusting your filters.
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <div className="join">
                <button
                  className="btn join-item btn-sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  «
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={`btn join-item btn-sm ${page === i + 1 ? "btn-primary" : ""}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="btn join-item btn-sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  »
                </button>
              </div>
            </div>
          )}

          {isFetching && !isLoading && (
            <p className="mt-3 text-center text-xs text-ink-faint">Updating results…</p>
          )}
        </div>
      </div>
    </div>
  );
}
