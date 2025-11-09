'use client'
import React, { useEffect, useState } from 'react'
import { getHistory, HistoryItem } from '@/lib/api'
import Button from '@/components/ui/Button'
import { RefreshCw, Clock, CheckCircle2, XCircle, Database, BarChart3, Loader2 } from 'lucide-react'

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await getHistory()
      setItems(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent flex items-center gap-3">
            <Clock className="w-8 h-8 text-cyan-500" />
            Query History
          </h1>
          <p className="text-cyan-600 text-sm mt-1">View your past queries and results</p>
        </div>
        <Button onClick={load} disabled={loading} variant="outline">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </>
          )}
        </Button>
      </div>

      {/* History Table */}
      <div className="bg-gradient-to-br from-cyan-950/30 to-cyan-900/20 border border-cyan-800/50 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cyan-800/50 bg-cyan-950/50">
                <th className="p-4 text-left text-cyan-300 font-semibold">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Prompt
                  </div>
                </th>
                <th className="p-4 text-left text-cyan-300 font-semibold">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    SQL
                  </div>
                </th>
                <th className="p-4 text-left text-cyan-300 font-semibold">Rows</th>
                <th className="p-4 text-left text-cyan-300 font-semibold">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Chart
                  </div>
                </th>
                <th className="p-4 text-left text-cyan-300 font-semibold">Status</th>
                <th className="p-4 text-left text-cyan-300 font-semibold">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Time
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((i, idx) => (
                <tr 
                  key={i.id} 
                  className="border-b border-cyan-900/30 hover:bg-cyan-950/30 transition-colors"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <td className="p-4 align-top max-w-[250px]">
                    <div className="text-cyan-100 break-words">{i.prompt}</div>
                  </td>
                  <td className="p-4 align-top max-w-[300px]">
                    <div className="font-mono text-xs text-cyan-400 break-words bg-black/30 p-2 rounded border border-cyan-900/50">
                      {i.generatedSql}
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-cyan-950/50 text-cyan-300 text-xs font-medium">
                      {i.resultRowCount}
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <div className="text-cyan-400 capitalize">{i.chartType || '—'}</div>
                  </td>
                  <td className="p-4 align-top">
                    {i.validated ? (
                      <div className="inline-flex items-center gap-1 text-green-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs">Valid</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 text-red-400">
                        <XCircle className="w-4 h-4" />
                        <span className="text-xs">Invalid</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 align-top whitespace-nowrap text-cyan-500 text-xs">
                    {new Date(i.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {items.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-cyan-600">
                      <Clock className="w-12 h-12 opacity-50" />
                      <p className="text-lg">No history yet</p>
                      <p className="text-sm">Your query history will appear here</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-cyan-950/30 to-cyan-900/20 border border-cyan-800/50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400">{items.length}</div>
            <div className="text-cyan-600 text-sm mt-1">Total Queries</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-950/30 to-cyan-900/20 border border-cyan-800/50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400">
              {items.filter(i => i.validated).length}
            </div>
            <div className="text-cyan-600 text-sm mt-1">Validated</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-950/30 to-cyan-900/20 border border-cyan-800/50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400">
              {items.reduce((sum, i) => sum + (i.resultRowCount || 0), 0)}
            </div>
            <div className="text-cyan-600 text-sm mt-1">Total Rows</div>
          </div>
        </div>
      )}
    </div>
  )
}

function Sparkles(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}
