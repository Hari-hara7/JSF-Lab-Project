// components/ui/Badge.tsx
"use client";
import React from "react";
import clsx from "clsx";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "error" | "warning";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-cyan-950/50 text-cyan-300 border-cyan-700",
    success: "bg-green-950/50 text-green-300 border-green-700",
    error: "bg-red-950/50 text-red-300 border-red-700",
    warning: "bg-yellow-950/50 text-yellow-300 border-yellow-700",
  };

  return (
    <div
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
