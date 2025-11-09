// components/Navbar.tsx
"use client";
import React from "react";
import { Database, History, Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-black border-b border-cyan-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-black font-bold text-xl shadow-lg shadow-cyan-500/50">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-cyan-400 text-lg flex items-center gap-2">
              Querify AI <Sparkles className="w-4 h-4 text-cyan-300" />
            </div>
            <div className="text-xs text-cyan-600">Natural Language → SQL · Powered by Gemini</div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <a href="/query" className="flex items-center gap-2 text-cyan-300 hover:text-cyan-400 transition-colors font-medium">
            <Database className="w-4 h-4" />
            Query
          </a>
          <a href="/history" className="flex items-center gap-2 text-cyan-300 hover:text-cyan-400 transition-colors font-medium">
            <History className="w-4 h-4" />
            History
          </a>
        </div>
      </div>
    </nav>
  );
}
