import './globals.css'
import React from 'react'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Querify AI',
  description: 'Natural Language to SQL with Gemini Flash 2.5'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto p-6 md:p-8 lg:p-10">{children}</main>
      </body>
    </html>
  )
}
