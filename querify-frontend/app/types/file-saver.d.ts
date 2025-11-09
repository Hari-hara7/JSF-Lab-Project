declare module 'file-saver' {
  export interface SaveAsOptions {
    autoBom?: boolean
  }
  export function saveAs(data: Blob | File, filename?: string, options?: SaveAsOptions): void
}
