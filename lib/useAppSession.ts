"use client";

import { useEffect, useState } from "react";
import { fetchCurrentUser } from "@/lib/api";
import type { RelivUser } from "@/types/domain";

interface AppSession {
  user: RelivUser | null;
  isPending: boolean;
  refresh: () => Promise<void>;
}

export function useAppSession(): AppSession {
  const [user, setUser] = useState<RelivUser | null>(null);
  const [isPending, setIsPending] = useState(true);

  async function load() {
    setIsPending(true);
    const current = await fetchCurrentUser();
    setUser(current);
    setIsPending(false);
  }

  useEffect(() => {
    load();
  }, []);

  return { user, isPending, refresh: load };
}
