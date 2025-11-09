'use client'
import ChartRenderer from '@/components/ChartRenderer'
import { API_BASE } from '@/lib/api'
import Papa from 'papaparse'
import Button from '@/components/ui/Button'
import { saveAs } from 'file-saver'
import React, { useState } from 'react'
import axios from 'axios'
import ResultsTable from '@/components/ResultsTable'

type Primitive = string | number | boolean | null
type Row = Record<string, Primitive>

export default function QueryPage() {
  const [prompt, setPrompt] = useState('')
  const [rows, setRows] = useState<Row[]>([])
  const [cols, setCols] = useState<string[]>([])
  const [sql, setSql] = useState('')
  const [chartType, setChartType] = useState<'table' | 'bar' | 'line' | 'pie'>('table')
  const [loading, setLoading] = useState(false)

  const runQuery = async () => {
    if (!prompt.trim()) return alert('Please enter a prompt')
    setLoading(true)
    try {
      const res = await axios.post(`${API_BASE}/query`, { prompt, chartType })
      const data = res.data
      setSql(data.sql || '')
      setRows(data.rows || [])
      setCols(data.columns || [])
    } catch (err: unknown) {
      let msg = 'Unknown error'
      if (axios.isAxiosError(err)) {
        const data = err.response?.data
        if (data && typeof data === 'object' && 'error' in data) {
          msg = String((data as { error?: unknown }).error ?? err.message)
        } else {
          msg = err.message
        }
      } else if (err instanceof Error) {
        msg = err.message
      }
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  const exportCsv = () => {
    if (!rows.length) return alert('No rows to export')
    const csv = Papa.unparse(rows)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'querify_results.csv')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Querify AI — Ask your database</h1>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
        className="w-full p-3 rounded border bg-white"
        placeholder="e.g. Total revenue per product for 2024 by month"
      />
      <div className="flex gap-3 items-center">
        <select
          value={chartType}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setChartType(e.target.value as 'table' | 'bar' | 'line' | 'pie')
          }
          className="p-2 border rounded bg-white"
        >
          <option value="table">Table</option>
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
        </select>
        <Button onClick={runQuery} disabled={loading}>{loading ? 'Running...' : 'Run Query'}</Button>
        <Button onClick={exportCsv} variant="ghost">Export CSV</Button>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500 mb-2">Generated SQL</div>
        <pre className="text-xs bg-gray-50 p-3 rounded">{sql || '—'}</pre>
      </div>
      <div>
        {chartType === 'table' || rows.length === 0 ? (
          <ResultsTable columns={cols} rows={rows} />
        ) : (
          <ChartRenderer type={chartType} rows={rows} />
        )}
      </div>
    </div>
  )
}
