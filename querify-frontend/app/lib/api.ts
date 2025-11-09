import axios from 'axios'

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api'

export type QueryResponse = {
  sql?: string
  rows?: Array<Record<string, string | number | boolean | null>>
  columns?: string[]
  error?: string
}

export async function queryAPI(prompt: string, chartType?: 'table' | 'bar' | 'line' | 'pie'): Promise<QueryResponse> {
  const res = await axios.post(`${API_BASE}/query`, { prompt, chartType })
  return res.data as QueryResponse
}

export interface HistoryItem {
  id: string
  prompt: string
  generatedSql: string
  validated: boolean
  resultRowCount: number
  chartType?: string
  createdAt: string
}

export async function getHistory(): Promise<HistoryItem[]> {
  const res = await axios.get(`${API_BASE}/history`)
  return res.data as HistoryItem[]
}
