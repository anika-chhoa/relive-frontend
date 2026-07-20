"use client";

import {
  adminDeleteItem,
  getAdminItems,
  getAdminOverview,
  getAdminUsers,
  toggleSuspendUser,
} from "@/lib/api";
import { useAppSession } from "@/lib/useAppSession";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  ShieldCheck,
  ShieldOff,
  Star,
  Tag,
  Trash2,
  Users,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_COLORS = [
  "#D6608F",
  "#A2D2FF",
  "#CDB4DB",
  "#FFC8DD",
  "#BDE0FE",
  "#FFAFCC",
];

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

type Tab = "overview" | "items" | "users";

export default function AdminPage() {
  const router = useRouter();
  const { user, isPending: sessionPending } = useAppSession();
  const [tab, setTab] = useState<Tab>("overview");

  console.log("[AdminPage]", { sessionPending, user });
  useEffect(() => {
    if (sessionPending) return;
    if (!user) {
      router.replace("/login?redirect=/admin");
    } else if (!user.isAdmin) {
      router.replace("/");
    }
  }, [sessionPending, user, router]);

  if (sessionPending || !user || !user.isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-ink-muted">
        <Loader2 className="mr-2 animate-spin" size={18} />
        Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-cta">
        Platform oversight
      </p>
      <h1 className="mt-1 font-display text-3xl font-medium text-ink">Admin</h1>

      <div role="tablist" className="tabs tabs-boxed mt-6 w-fit">
        <button
          role="tab"
          onClick={() => setTab("overview")}
          className={`tab ${tab === "overview" ? "tab-active" : ""}`}
        >
          Overview
        </button>
        <button
          role="tab"
          onClick={() => setTab("items")}
          className={`tab ${tab === "items" ? "tab-active" : ""}`}
        >
          Listings
        </button>
        <button
          role="tab"
          onClick={() => setTab("users")}
          className={`tab ${tab === "users" ? "tab-active" : ""}`}
        >
          Users
        </button>
      </div>

      <div className="mt-6">
        {tab === "overview" && <OverviewTab />}
        {tab === "items" && <ItemsTab />}
        {tab === "users" && <UsersTab />}
      </div>
    </div>
  );
}

function OverviewTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: getAdminOverview,
  });
  console.log("Admin Overview Data From API:", data);
  if (isLoading) return <div className="skeleton h-64 w-full rounded-card" />;
  if (!data) return null;

  const kpis = [
    { label: "Total Users", value: data.stats.totalUsers, icon: Users },
    { label: "Active Listings", value: data.stats.totalListings, icon: Tag },
    {
      label: "Total GMV",
      value: formatPrice(data.stats.totalGMV),
      icon: Wallet,
    },
    { label: "Total Reviews", value: data.stats.totalReviews, icon: Star },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-card border border-border bg-surface p-4"
          >
            <kpi.icon size={16} className="text-cta" />
            <p className="mt-2 font-display text-xl font-semibold text-ink">
              {kpi.value}
            </p>
            <p className="text-xs text-ink-muted">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="rounded-card border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-ink">
            New users over time
          </h2>
          {data.newUsersOverTime.length === 0 ? (
            <p className="mt-8 text-center text-sm text-ink-faint">
              No data yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={data.newUsersOverTime}
                margin={{ top: 16, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE6F3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#6B6478" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6B6478" }}
                  allowDecimals={false}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#A2D2FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-card border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-ink">GMV over time</h2>
          {data.salesOverTime.length === 0 ? (
            <p className="mt-8 text-center text-sm text-ink-faint">
              No sales yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={data.salesOverTime}
                margin={{ top: 16, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE6F3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#6B6478" }}
                />
                <YAxis tick={{ fontSize: 11, fill: "#6B6478" }} />
                <Tooltip formatter={(value) => formatPrice(Number(value))} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#D6608F"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-card border border-border bg-surface p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-ink">
            Listings by category (platform-wide)
          </h2>
          {data.categoryBreakdown.length === 0 ? (
            <p className="mt-8 text-center text-sm text-ink-faint">
              No active listings
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={data.categoryBreakdown}
                  dataKey="count"
                  nameKey="category"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                  label={(d: any) => d.category}
                >
                  {data.categoryBreakdown.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </>
  );
}

function ItemsTab() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-items"],
    queryFn: getAdminItems,
  });
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function handleRemove(id: string) {
    setRemovingId(id);
    try {
      await adminDeleteItem(id);
      queryClient.invalidateQueries({ queryKey: ["admin-items"] });
    } finally {
      setRemovingId(null);
    }
  }

  if (isLoading) return <div className="skeleton h-64 w-full rounded-card" />;
  const items = data?.items || [];

  return (
    <div className="overflow-x-auto rounded-card border border-border">
      <table className="table">
        <thead>
          <tr className="bg-cta-tint/30 text-ink">
            <th className="sticky left-0 z-10 bg-cta-tint/30 shadow-[4px_0_6px_-4px_rgba(43,36,64,0.15)]">
              Item
            </th>
            <th>Seller</th>
            <th>Price</th>
            <th>Status</th>
            <th>Posted</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td className="sticky left-0 z-10 max-w-[220px] bg-surface shadow-[4px_0_6px_-4px_rgba(43,36,64,0.15)]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-field bg-cta-tint/40">
                    {item.images?.[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.images[0]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <p className="truncate text-sm font-medium text-ink">
                    {item.title}
                  </p>
                </div>
              </td>
              <td className="text-sm text-ink-muted">
                {item.sellerName || "—"}
              </td>
              <td className="text-sm font-medium text-ink">
                {formatPrice(item.price)}
              </td>
              <td>
                <span
                  className={`badge badge-sm capitalize ${item.status === "sold" ? "badge-neutral" : "badge-success"}`}
                >
                  {item.status}
                </span>
              </td>
              <td className="text-sm text-ink-muted">
                {formatDate(item.createdAt)}
              </td>
              <td className="text-right">
                <button
                  type="button"
                  onClick={() => handleRemove(item._id)}
                  disabled={removingId === item._id}
                  title="Remove listing"
                  className="btn btn-ghost btn-xs text-error"
                >
                  {removingId === item._id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UsersTab() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getAdminUsers,
  });
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleToggle(id: string, current: boolean) {
    setUpdatingId(id);
    try {
      await toggleSuspendUser(id, !current);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    } finally {
      setUpdatingId(null);
    }
  }

  if (isLoading) return <div className="skeleton h-64 w-full rounded-card" />;
  const users = data?.users || [];

  return (
    <div className="overflow-x-auto rounded-card border border-border min-h-screen">
      <table className="table">
        <thead>
          <tr className="bg-cta-tint/30 text-ink">
            <th className="sticky left-0 z-10 bg-cta-tint/30 shadow-[4px_0_6px_-4px_rgba(43,36,64,0.15)]">
              User
            </th>
            <th>Provider</th>
            <th>Joined</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="sticky left-0 z-10 max-w-[240px] bg-surface shadow-[4px_0_6px_-4px_rgba(43,36,64,0.15)]">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lavender text-xs font-semibold text-ink">
                    {(u.name || "?").charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">
                      {u.name || "—"}
                    </p>
                    <p className="truncate text-xs text-ink-faint">{u.email}</p>
                  </div>
                </div>
              </td>
              <td>
                <span className="badge badge-ghost badge-sm capitalize">
                  {u.provider}
                </span>
              </td>
              <td className="text-sm text-ink-muted">
                {formatDate(u.createdAt)}
              </td>
              <td>
                <span
                  className={`badge badge-sm ${u.suspended ? "badge-error" : "badge-success"}`}
                >
                  {u.suspended ? "Suspended" : "Active"}
                </span>
              </td>
              <td className="text-right">
                <button
                  type="button"
                  onClick={() => handleToggle(u.id, u.suspended)}
                  disabled={updatingId === u.id}
                  className={`btn btn-xs gap-1 ${u.suspended ? "btn-success" : "btn-error"} text-white`}
                >
                  {updatingId === u.id ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : u.suspended ? (
                    <ShieldCheck size={13} />
                  ) : (
                    <ShieldOff size={13} />
                  )}
                  {u.suspended ? "Unsuspend" : "Suspend"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
