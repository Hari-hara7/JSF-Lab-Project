// components/ResultsTable.tsx
"use client";
import React from "react";
import { Table2 } from "lucide-react";

type TableRow = Record<string, string | number | boolean | null>

export default function ResultsTable({ columns, rows }: { columns: string[]; rows: TableRow[] }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="bg-cyan-950/30 p-12 rounded-xl border border-cyan-800/50 text-center">
        <Table2 className="w-16 h-16 text-cyan-700/50 mx-auto mb-4" />
        <p className="text-cyan-600">No data available</p>
      </div>
    );
  }
  
  if (!columns || columns.length === 0) {
    return <div className="text-cyan-600">No columns to display</div>;
  }

  return (
    <div className="overflow-auto rounded-xl border border-cyan-800/50">
      <table className="min-w-full table-auto">
        <thead className="bg-cyan-950/50 sticky top-0">
          <tr>
            {columns.map((c) => (
              <th key={c} className="text-left px-4 py-3 text-sm font-semibold text-cyan-300 border-b border-cyan-800/50">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={`${i % 2 === 0 ? "bg-black/20" : "bg-black/40"} hover:bg-cyan-950/30 transition-colors`}>
              {columns.map((c) => (
                <td key={c} className="px-4 py-3 text-sm text-cyan-100 border-b border-cyan-900/30 align-top">
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
