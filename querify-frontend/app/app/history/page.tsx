'use client'
import React, { useEffect, useState } from 'react'
import { getHistory, HistoryItem } from '@/lib/api'
import Button from '@/components/ui/Button'

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
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Query History</h1>
      <Button onClick={load} disabled={loading}>{loading ? 'Loading...' : 'Refresh'}</Button>
      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Prompt</th>
              <th className="p-2 text-left">SQL</th>
              <th className="p-2 text-left">Rows</th>
              <th className="p-2 text-left">Chart</th>
              <th className="p-2 text-left">Validated</th>
              <th className="p-2 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {items.map(i => (
              <tr key={i.id} className="border-t">
                <td className="p-2 align-top max-w-[200px] wrap-break-word">{i.prompt}</td>
                <td className="p-2 align-top max-w-[280px] wrap-break-word font-mono text-xs">{i.generatedSql}</td>
                <td className="p-2 align-top">{i.resultRowCount}</td>
                <td className="p-2 align-top">{i.chartType || '—'}</td>
                <td className="p-2 align-top">{i.validated ? 'Yes' : 'No'}</td>
                <td className="p-2 align-top whitespace-nowrap">{new Date(i.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr><td colSpan={6} className="p-4 text-center text-gray-500">No history yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
