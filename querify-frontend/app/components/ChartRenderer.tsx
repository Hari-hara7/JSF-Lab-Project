// components/ChartRenderer.tsx
"use client";
import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function ChartRenderer({ type, rows }: { type: string; rows: Record<string, any>[] }) {
  if (!rows.length) return null;

  const keys = Object.keys(rows[0]);
  const labelKey = keys[0];
  const valueKey = keys[1] ?? keys[0];

  const labels = rows.map((r) => String(r[labelKey] ?? ""));
  const values = rows.map((r) => {
    const v = r[valueKey];
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  });

  const data = {
    labels,
    datasets: [
      {
        label: valueKey,
        data: values,
      },
    ],
  };

  switch (type) {
    case "bar":
      return <Bar data={data} />;
    case "line":
      return <Line data={data} />;
    case "pie":
      return <Pie data={data} />;
    default:
      return null;
  }
}
