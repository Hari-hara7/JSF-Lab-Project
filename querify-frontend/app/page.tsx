import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Database, Sparkles, Zap, Shield, BarChart3, ArrowRight } from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered',
      description: 'Leverage Google Gemini 2.0 for intelligent SQL generation',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get instant results with optimized query execution',
    },
    {
      icon: Shield,
      title: 'Secure',
      description: 'Built-in SQL validation and injection protection',
    },
    {
      icon: BarChart3,
      title: 'Visualize',
      description: 'Beautiful charts and tables for your data',
    },
  ]

  return (
    <div className="space-y-16 py-12">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-950/50 border border-cyan-800/50 text-cyan-400 text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          Powered by Google Gemini 2.0 Flash
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 bg-clip-text text-transparent leading-tight">
          Ask Your Database
          <br />
          <span className="text-cyan-300">In Plain English</span>
        </h1>
        
        <p className="text-cyan-600 text-lg md:text-xl max-w-2xl leading-relaxed">
          Transform natural language into powerful SQL queries instantly. No SQL knowledge required.
          Just ask your question and let AI do the work.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/query">
            <Button className="text-base px-8 py-4">
              <Database className="w-5 h-5" />
              Start Querying
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/history">
            <Button variant="outline" className="text-base px-8 py-4">
              View History
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {features.map((feature, idx) => {
          const Icon = feature.icon
          return (
            <div
              key={idx}
              className="bg-gradient-to-br from-cyan-950/30 to-cyan-900/20 border border-cyan-800/50 rounded-2xl p-6 hover:border-cyan-600/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-cyan-300 font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-cyan-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          )
        })}
      </div>

      {/* Tech Stack */}
      <div className="bg-gradient-to-br from-cyan-950/30 to-cyan-900/20 border border-cyan-800/50 rounded-2xl p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">Built With Modern Technologies</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-2">
            <div className="text-3xl">⚛️</div>
            <div className="text-cyan-300 font-medium">Next.js 16</div>
            <div className="text-cyan-600 text-xs">Frontend</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl">🍃</div>
            <div className="text-cyan-300 font-medium">Spring Boot</div>
            <div className="text-cyan-600 text-xs">Backend</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl">🗄️</div>
            <div className="text-cyan-300 font-medium">PostgreSQL</div>
            <div className="text-cyan-600 text-xs">Database</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl">✨</div>
            <div className="text-cyan-300 font-medium">Gemini AI</div>
            <div className="text-cyan-600 text-xs">Intelligence</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-cyan-400">Ready to get started?</h2>
        <p className="text-cyan-600">Start asking questions to your database in natural language.</p>
        <Link href="/query">
          <Button className="text-base px-8 py-4">
            <Sparkles className="w-5 h-5" />
            Try Querify Now
          </Button>
        </Link>
      </div>
    </div>
  )
}
