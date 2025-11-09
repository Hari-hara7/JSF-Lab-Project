// components/Navbar.tsx
"use client";
import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center text-white font-bold">
            Q
          </div>
          <div>
            <div className="font-semibold">Querify AI</div>
            <div className="text-xs text-gray-500">NL → SQL · Neon Postgres</div>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <a href="/query" className="hover:underline mr-4">Query</a>
          <a href="/history" className="hover:underline">History</a>
        </div>
      </div>
    </nav>
  );
}
