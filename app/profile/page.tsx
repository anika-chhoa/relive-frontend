"use client";

import ProfileCard from "@/components/ProfileCard";
import { updateMyProfile } from "@/lib/api";
import { useAppSession } from "@/lib/useAppSession";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user, isPending, refresh } = useAppSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login?redirect=/profile");
    }
  }, [isPending, user, router]);

  if (isPending || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-ink-muted">
        <Loader2 className="mr-2 animate-spin" size={18} />
        Loading profile…
      </div>
    );
  }

  async function handleSave(data: { name: string; image: string | null }) {
    setSaving(true);
    try {
      await updateMyProfile({ name: data.name, image: data.image });
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  const quickLinks = [
    { href: user.isAdmin ? "/admin" : "/dashboard", label: "Dashboard" },
    { href: "/items/manage", label: "Manage Items" },
    { href: "/items/add", label: "Add Item" },
    { href: "/chat", label: "Chat" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-cta">
        Account
      </p>
      <h1 className="mt-1 font-display text-3xl font-medium text-ink">
        Profile
      </h1>

      <div className="mt-8">
        <ProfileCard user={user} onSave={handleSave} isSaving={saving} />
      </div>

      <div className="mt-8 rounded-card border border-border bg-surface p-6 shadow-soft">
        <h2 className="font-display text-lg font-semibold text-ink">
          Quick Links
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-field border border-border px-4 py-3 text-center text-sm font-medium text-ink-muted transition-standard hover:border-cta/40 hover:bg-cta-tint hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
