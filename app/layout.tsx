import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Relive — Where value lives again",
  description:
    "Buy and sell pre-owned items you can trust. Relive gives everyday things a second life.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="relive">
      <body className="bg-bg text-ink font-body antialiased">
        <Providers>
          <Navbar />
          <main>{children}</main>
          
        </Providers>
      </body>
    </html>
  );
}