export default function ItemCardSkeleton() {
  return (
    <div className="card h-full w-full overflow-hidden rounded-card border border-border bg-surface shadow-soft">
      <div className="skeleton aspect-[4/3] w-full rounded-none" />
      <div className="card-body gap-2 p-4">
        <div className="skeleton h-4 w-3/4 rounded-field" />
        <div className="skeleton h-3 w-full rounded-field" />
        <div className="skeleton h-3 w-2/3 rounded-field" />
        <div className="mt-1 flex items-center justify-between">
          <div className="skeleton h-5 w-16 rounded-field" />
          <div className="skeleton h-5 w-14 rounded-full" />
        </div>
        <div className="skeleton mt-2 h-9 w-full rounded-full" />
      </div>
    </div>
  );
}
