// app/layout.tsx
import "./globals.css";
import React from "react";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Querify AI",
  description: "Natural language to SQL — Querify AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Navbar />
        <main className="p-6 max-w-6xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
