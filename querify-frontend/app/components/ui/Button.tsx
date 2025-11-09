// components/ui/Button.tsx
"use client";
import React from "react";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "danger" | "outline";
};

export default function Button({ children, className, variant = "default", ...rest }: Props) {
  const base = "px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center";
  const variants: Record<string, string> = {
    default: "bg-cyan-500 text-black hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/50",
    outline: "bg-transparent text-cyan-400 border-2 border-cyan-500 hover:bg-cyan-500/10 hover:shadow-lg hover:shadow-cyan-500/30",
    ghost: "bg-transparent text-cyan-300 hover:bg-cyan-500/10",
    danger: "bg-red-600 text-white hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/50",
  };
  return (
    <button className={clsx(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}
