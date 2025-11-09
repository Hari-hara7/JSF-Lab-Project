// components/ChartRenderer.tsx
"use client";
import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Generate colors for charts
const generateColors = (count: number) => {
  const colors = [
    'rgba(59, 130, 246, 0.8)',   // blue
    'rgba(16, 185, 129, 0.8)',   // green
    'rgba(249, 115, 22, 0.8)',   // orange
    'rgba(239, 68, 68, 0.8)',    // red
    'rgba(168, 85, 247, 0.8)',   // purple
    'rgba(236, 72, 153, 0.8)',   // pink
    'rgba(251, 191, 36, 0.8)',   // yellow
    'rgba(20, 184, 166, 0.8)',   // teal
  ];
  return Array(count).fill(0).map((_, i) => colors[i % colors.length]);
};

const generateBorderColors = (count: number) => {
  const colors = [
    'rgba(59, 130, 246, 1)',
    'rgba(16, 185, 129, 1)',
    'rgba(249, 115, 22, 1)',
    'rgba(239, 68, 68, 1)',
    'rgba(168, 85, 247, 1)',
    'rgba(236, 72, 153, 1)',
    'rgba(251, 191, 36, 1)',
    'rgba(20, 184, 166, 1)',
  ];
  return Array(count).fill(0).map((_, i) => colors[i % colors.length]);
};

type ChartRow = Record<string, string | number | boolean | null>

export default function ChartRenderer({ type, rows }: { type: string; rows: ChartRow[] }) {
  if (!rows || rows.length === 0) {
    return <div className="text-sm text-gray-500 p-4">No data to display</div>;
  }

  const keys = Object.keys(rows[0]);
  const labelKey = keys[0];
  const valueKey = keys[1] ?? keys[0];

  const labels = rows.map((r) => String(r[labelKey] ?? ""));
  const values = rows.map((r) => {
    const v = r[valueKey];
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  });

  const backgroundColors = generateColors(values.length);
  const borderColors = generateBorderColors(values.length);

  const data = {
    labels,
    datasets: [
      {
        label: valueKey,
        data: values,
        backgroundColor: type === 'pie' ? backgroundColors : 'rgba(59, 130, 246, 0.8)',
        borderColor: type === 'pie' ? borderColors : 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        tension: 0.4, // For line charts
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: type === 'pie',
        position: 'bottom' as const,
        labels: {
          color: '#67e8f9', // cyan-300
          font: {
            size: 12,
          },
          padding: 15,
        },
      },
      title: {
        display: true,
        text: `${labelKey} vs ${valueKey}`,
        color: '#22d3ee', // cyan-400
        font: {
          size: 18,
          weight: 'bold' as const,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(6, 182, 212, 0.95)', // cyan-500
        titleColor: '#000',
        bodyColor: '#000',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
        borderColor: '#06b6d4',
        borderWidth: 2,
      },
    },
    scales: type !== 'pie' ? {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#67e8f9', // cyan-300
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(6, 182, 212, 0.1)', // cyan with low opacity
        },
      },
      x: {
        ticks: {
          color: '#67e8f9', // cyan-300
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(6, 182, 212, 0.1)',
        },
      },
    } : undefined,
  };

  return (
    <div className="bg-black/50 p-6 rounded-xl border border-cyan-900/50">
      <div style={{ position: 'relative', height: type === 'pie' ? '450px' : '450px', width: '100%' }}>
        {type === "bar" && <Bar data={data} options={options} />}
        {type === "line" && <Line data={data} options={options} />}
        {type === "pie" && <Pie data={data} options={options} />}
      </div>
    </div>
  );
}
