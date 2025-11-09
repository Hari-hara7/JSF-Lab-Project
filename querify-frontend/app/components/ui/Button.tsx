// components/ui/Button.tsx
"use client";
import React from "react";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "danger";
};

export default function Button({ children, className, variant = "default", ...rest }: Props) {
  const base = "px-4 py-2 rounded-md text-sm font-medium focus:outline-none";
  const variants: Record<string, string> = {
    default: "bg-sky-600 text-white hover:bg-sky-700",
    ghost: "bg-transparent text-slate-700 border border-slate-200 hover:bg-slate-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <button className={clsx(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}
