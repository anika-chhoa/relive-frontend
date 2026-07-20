"use client";

import { logout } from "@/lib/api";
import { useAppSession } from "@/lib/useAppSession";
import { Menu, Plus, Shield, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface NavLink {
  href: string;
  label: string;
}

const LOGGED_OUT_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const { user, isPending, refresh } = useAppSession();
  const isLoggedIn = Boolean(user);
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardHref = user?.isAdmin ? "/admin" : "/dashboard";

  const loggedInLinks: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/explore", label: "Explore" },
    { href: "/items/manage", label: "Manage Items" },
    { href: dashboardHref, label: "Dashboard" },
    { href: "/chat", label: "Chat" },
    { href: "/about", label: "About" },
    { href: "/privacy", label: "Privacy" },
  ];

  const links = isLoggedIn ? loggedInLinks : LOGGED_OUT_LINKS;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="aura-ring" aria-hidden="true" />
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            Relive
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {links
            .filter((l) => l.href !== "/items/add")
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-ink-muted transition-standard hover:bg-cta-tint hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
        </div>

        {/* Right side */}
        <div className="hidden items-center gap-3 lg:flex">
          {isPending ? (
            <div className="flex items-center gap-3">
              <div className="skeleton h-8 w-16 rounded-full" />
              <div className="skeleton h-9 w-9 rounded-full" />
            </div>
          ) : isLoggedIn ? (
            <>
              <Link
                href="/items/add"
                className="btn btn-primary btn-sm gap-1.5 shadow-soft"
              >
                <Plus size={16} strokeWidth={2.5} />
                Add Items for Sale
              </Link>

              {/* daisyUI CSS-only dropdown — no click-outside JS needed */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar placeholder"
                >
                  {user?.image ? (
                    <div className="w-9 rounded-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={user.image} alt="" />
                    </div>
                  ) : (
                    <div className="w-9 rounded-full bg-lavender text-ink">
                      <span className="text-sm font-semibold">
                        {(user?.name || "R").charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <ul
                  tabIndex={0}
                  className="menu dropdown-content menu-sm z-[60] mt-3 w-56 rounded-card border border-border bg-surface p-2 shadow-lift"
                >
                  <li className="pointer-events-none px-3 py-2">
                    <div className="flex-col items-start gap-0 p-0 hover:bg-transparent">
                      <p className="truncate text-sm font-semibold text-ink">
                        {user?.name || "Relive user"}
                      </p>
                      <p className="truncate text-xs text-ink-muted">
                        {user?.email || "you@example.com"}
                      </p>
                    </div>
                  </li>
                  <div className="my-1 h-px bg-border" />
                  {user?.isAdmin && (
                    <li>
                      <Link
                        href="/admin"
                        className="rounded-field text-sm text-ink-muted"
                      >
                        <Shield size={14} /> Admin
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      href="/profile"
                      className="rounded-field text-sm text-ink-muted"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      className="rounded-field text-sm text-error"
                      onClick={() => {
                        logout().then(() => refresh());
                      }}
                    >
                      Log out
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="btn btn-ghost btn-sm text-ink-muted"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn btn-primary btn-sm shadow-soft"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="btn btn-ghost btn-circle btn-sm lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="border-t border-border bg-bg px-4 pb-6 pt-2 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-field px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-cta-tint hover:text-ink"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            {isLoggedIn ? (
              <>
                <Link href="/items/add" className="btn btn-primary gap-1.5">
                  <Plus size={16} />
                  Sell an item
                </Link>
                {user?.isAdmin && (
                  <Link
                    href="/admin"
                    className="btn btn-ghost justify-start text-ink-muted"
                  >
                    <Shield size={15} /> Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="btn btn-ghost justify-start text-ink-muted"
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
