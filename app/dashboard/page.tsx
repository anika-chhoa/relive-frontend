"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Loader2, Plus, ShoppingBag, Tag, Star, TrendingUp } from "lucide-react";
import { useAppSession } from "@/lib/useAppSession";
import { getMyDashboard } from "@/lib/api";
import ReviewCard from "@/components/ReviewCard";

const CHART_COLORS = ["#D6608F", "#A2D2FF", "#CDB4DB", "#FFC8DD", "#BDE0FE", "#FFAFCC"];

function formatPrice(price: number): string {
  return `৳${price.toLocaleString("en-BD")}`;
}
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isPending: sessionPending } = useAppSession();

  useEffect(() => {
    if (!sessionPending && !user) {
      router.replace("/login?redirect=/dashboard");
    }
  }, [sessionPending, user, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["my-dashboard"],
    queryFn: getMyDashboard,
    enabled: Boolean(user),
  });

  if (sessionPending || !user || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-ink-muted">
        <Loader2 className="mr-2 animate-spin" size={18} />
        Loading your dashboard…
      </div>
    );
  }
  if (!data) return null;

  const { stats, recentSales, recentPurchases, recentReviews, salesOverTime, categoryBreakdown } = data;

  const kpis = [
    { label: "Active Listings", value: stats.activeListings, icon: Tag },
    { label: "Total Sales", value: formatPrice(stats.totalSalesAmount), icon: TrendingUp },
    { label: "Items Purchased", value: stats.itemsPurchased, icon: ShoppingBag },
    {
      label: "Seller Rating",
      value: stats.reviewCount > 0 ? `${stats.sellerRating} ★ (${stats.reviewCount})` : "No reviews yet",
      icon: Star,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cta">
            Welcome back, {user.name?.split(" ")[0] || "there"}
          </p>
          <h1 className="mt-1 font-display text-3xl font-medium text-ink">Dashboard</h1>
        </div>
        <Link href="/items/add" className="btn btn-primary btn-sm gap-1.5">
          <Plus size={16} /> Add Item
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-card border border-border bg-surface p-4">
            <kpi.icon size={16} className="text-cta" />
            <p className="mt-2 font-display text-xl font-semibold text-ink">{kpi.value}</p>
            <p className="text-xs text-ink-muted">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-card border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-ink">Sales over time</h2>
          {salesOverTime.length === 0 ? (
            <p className="mt-8 text-center text-sm text-ink-faint">No sales yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={salesOverTime} margin={{ top: 16, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE6F3" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B6478" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6B6478" }} />
                <Tooltip formatter={(v: number) => formatPrice(v)} />
                <Line type="monotone" dataKey="total" stroke="#D6608F" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-card border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-ink">Your listings by category</h2>
          {categoryBreakdown.length === 0 ? (
            <p className="mt-8 text-center text-sm text-ink-faint">No active listings</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="count"
                  nameKey="category"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {categoryBreakdown.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-card border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-ink">Recent Sales</h2>
          {recentSales.length === 0 ? (
            <p className="mt-4 text-sm text-ink-faint">Nothing sold yet.</p>
          ) : (
            <ul className="mt-3 flex flex-col divide-y divide-border">
              {recentSales.map((s) => (
                <li key={s._id} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="truncate text-ink">{s.title}</span>
                  <span className="shrink-0 pl-3 text-right text-ink-muted">
                    {formatPrice(s.price)}
                    <span className="ml-2 text-xs text-ink-faint">{formatDate(s.soldAt)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-card border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-ink">Recent Purchases</h2>
          {recentPurchases.length === 0 ? (
            <p className="mt-4 text-sm text-ink-faint">You haven&apos;t bought anything yet.</p>
          ) : (
            <ul className="mt-3 flex flex-col divide-y divide-border">
              {recentPurchases.map((p) => (
                <li key={p._id} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="truncate text-ink">{p.title}</span>
                  <span className="shrink-0 pl-3 text-right text-ink-muted">
                    {formatPrice(p.price)}
                    <span className="ml-2 text-xs text-ink-faint">{formatDate(p.soldAt)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {recentReviews.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-xl font-medium text-ink">Recent Reviews of You</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {recentReviews.map((r) => (
              <ReviewCard key={r._id} review={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}