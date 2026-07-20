// lib/AppSessionContext.tsx
"use client";

import { fetchCurrentUser } from "@/lib/api";
import type { RelivUser } from "@/types/domain";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AppSession {
  user: RelivUser | null;
  isPending: boolean;
  refresh: () => Promise<void>;
  setUser: (user: RelivUser | null) => void;
}

const AppSessionContext = createContext<AppSession | null>(null);

export function AppSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RelivUser | null>(null);
  const [isPending, setIsPending] = useState(true);

  const load = useCallback(async () => {
    try {
      const current = await fetchCurrentUser();
      if (current) {
        setUser(current);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch session user:", error);
      setUser(null);
    } finally {
      setIsPending(false);
    }
  }, []);

  useEffect(() => {
    void load();

    const handleAuthChanged = () => {
      void load();
    };

    window.addEventListener("auth:session-changed", handleAuthChanged);
    return () =>
      window.removeEventListener("auth:session-changed", handleAuthChanged);
  }, [load]);

  return (
    <AppSessionContext.Provider
      value={{ user, isPending, refresh: load, setUser }}
    >
      {children}
    </AppSessionContext.Provider>
  );
}

export function useAppSession(): AppSession {
  const ctx = useContext(AppSessionContext);
  if (!ctx) {
    return {
      user: null,
      isPending: false,
      refresh: async () => {},
      setUser: () => {},
    };
  }
  return ctx;
}
