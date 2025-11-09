import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4">
      <h2 className="text-2xl font-semibold">Convert natural language into SQL instantly!</h2>
      <p className="text-gray-600">Powered by Gemini Flash 2.5 + Spring Boot</p>
      <Link href="/query"><Button>Go to Query Generator</Button></Link>
    </div>
  )
}
