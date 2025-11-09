'use client'
import ChartRenderer from '@/components/ChartRenderer'
import { API_BASE } from '@/lib/api'
import Papa from 'papaparse'
import Button from '@/components/ui/Button'
import { saveAs } from 'file-saver'
import React, { useState } from 'react'
import axios from 'axios'
import ResultsTable from '@/components/ResultsTable'
import { Sparkles, Download, BarChart3, LineChart, PieChart, Table2, Loader2 } from 'lucide-react'

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

  const visualizations = [
    { value: 'table', label: 'Table', icon: Table2 },
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { value: 'line', label: 'Line Chart', icon: LineChart },
    { value: 'pie', label: 'Pie Chart', icon: PieChart },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
          Ask Your Database
        </h1>
        <p className="text-cyan-600 text-sm md:text-base">Transform natural language into powerful SQL queries</p>
      </div>

      {/* Input Section */}
      <div className="bg-gradient-to-br from-cyan-950/30 to-cyan-900/20 border border-cyan-800/50 rounded-2xl p-6 md:p-8 shadow-2xl shadow-cyan-900/20">
        <label className="block text-cyan-300 font-semibold mb-3 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Your Question
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          className="w-full p-4 rounded-xl border-2 border-cyan-800/50 bg-black text-cyan-50 placeholder-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
          placeholder="e.g., Show me total revenue per product for 2024 by month, or List top 10 customers by order count"
        />
        
        {/* Visualization Selector */}
        <div className="mt-6 space-y-3">
          <label className="block text-cyan-300 font-semibold text-sm">Visualization Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {visualizations.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setChartType(value as typeof chartType)}
                className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                  chartType === value
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 shadow-lg shadow-cyan-500/30'
                    : 'border-cyan-800/50 bg-black/30 text-cyan-600 hover:border-cyan-700 hover:bg-cyan-900/20'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-6">
          <Button onClick={runQuery} disabled={loading} className="flex-1 min-w-[200px]">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Run Query
              </>
            )}
          </Button>
          <Button onClick={exportCsv} variant="outline" disabled={rows.length === 0}>
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* SQL Output */}
      {sql && (
        <div className="bg-gradient-to-br from-cyan-950/30 to-cyan-900/20 border border-cyan-800/50 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-3 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Generated SQL
          </div>
          <pre className="text-xs md:text-sm bg-black/50 p-4 rounded-lg text-cyan-300 overflow-x-auto border border-cyan-900/50 font-mono">
            {sql}
          </pre>
        </div>
      )}

      {/* Results Section */}
      {(rows.length > 0 || cols.length > 0) && (
        <div className="bg-gradient-to-br from-cyan-950/30 to-cyan-900/20 border border-cyan-800/50 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
              <BarChart3 className="w-4 h-4" />
              Results
            </div>
            <div className="text-cyan-600 text-xs">
              {rows.length} row{rows.length !== 1 ? 's' : ''} · {cols.length} column{cols.length !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="bg-black/30 rounded-xl p-4 border border-cyan-900/30">
            {chartType === 'table' || rows.length === 0 ? (
              <ResultsTable columns={cols} rows={rows} />
            ) : (
              <ChartRenderer type={chartType} rows={rows} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
