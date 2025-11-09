// components/ResultsTable.tsx
"use client";
import React from "react";

export default function ResultsTable({ columns, rows }: { columns: string[]; rows: Record<string, any>[] }) {
  if (!rows.length) return <div className="text-sm text-gray-500">No data</div>;

  return (
    <div className="overflow-auto bg-white rounded-2xl shadow-sm">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th key={c} className="text-left px-4 py-2 text-sm font-medium text-gray-600 border-b">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {columns.map((c) => (
                <td key={c} className="px-4 py-2 text-sm text-gray-700 border-b align-top">
                  {String(r[c] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
