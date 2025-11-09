declare module 'papaparse' {
  export interface UnparseConfig {
    quotes?: boolean | boolean[]
    quoteChar?: string
    delimiter?: string
    header?: boolean
    newline?: string
    skipEmptyLines?: boolean | 'greedy'
  }
  export function unparse(data: unknown, config?: UnparseConfig): string
  const Papa: {
    unparse: typeof unparse
  }
  export default Papa
}
