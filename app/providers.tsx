"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#FFFBFE",
            color: "#2B2440",
            border: "1px solid #EDE6F3",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#3C9A5F", secondary: "#FFFBFE" },
          },
          error: {
            iconTheme: { primary: "#D14343", secondary: "#FFFBFE" },
          },
        }}
      />
    </QueryClientProvider>
  );
}
