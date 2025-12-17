"use client"

import { Suspense, useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { RepoInput } from "@/components/repo-input"
import { ScoreDisplay } from "@/components/score-display"
import { ValuationCards } from "@/components/valuation-cards"
import { ComponentScores } from "@/components/component-scores"
import { RepoMetrics } from "@/components/repo-metrics"
import { InterpretationDisplay } from "@/components/interpretation-display"
import { CodebaseAnalysis } from "@/components/codebase-analysis"
import GenerativeMountainScene from "@/components/ui/mountain-scene"
import { Button } from "@/components/ui/button"
import { analyzeRepository, type AnalysisResult } from "./actions"

export default function Home() {
  const [analyzed, setAnalyzed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [repoName, setRepoName] = useState("")
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (repo: string, includeCodebaseAnalysis: boolean = true) => {
    setIsLoading(true)
    setRepoName(repo)
    setError(null)

    try {
      const result = await analyzeRepository(repo, includeCodebaseAnalysis)
      setAnalysisData(result)
      setAnalyzed(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setAnalyzed(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setAnalyzed(false)
    setRepoName("")
    setAnalysisData(null)
    setError(null)
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Mountain Scene Background */}
      <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
        <GenerativeMountainScene />
      </Suspense>

      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🦄</span>
              <h1 className="text-xl font-bold">Unicorn Hunter</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          {!analyzed ? (
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Hero Section */}
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <span className="text-base">🦄</span>
                  Discover Your Repository's Potential
                </div>
                <h2 className="text-5xl md:text-7xl font-bold text-balance">
                  Find the Next <span className="text-primary">Unicorn</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                  Get instant valuation estimates and unicorn scores for any GitHub repository. Powered by AI-driven
                  analysis of stars, activity, and community engagement.
                </p>
              </div>

              {/* Input Section */}
              <div className="pt-8">
                {error && (
                  <div className="mb-4 p-4 rounded-lg bg-destructive/10 text-destructive text-center">{error}</div>
                )}
                <RepoInput onAnalyze={handleAnalyze} isLoading={isLoading} />
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-6 pt-12">
                <div className="p-6 rounded-lg bg-card/50 backdrop-blur border">
                  <div className="text-4xl mb-3">⚡</div>
                  <h3 className="font-semibold mb-2">Instant Analysis</h3>
                  <p className="text-sm text-muted-foreground">Get comprehensive valuations in seconds, not hours</p>
                </div>
                <div className="p-6 rounded-lg bg-card/50 backdrop-blur border">
                  <div className="text-4xl mb-3">🎯</div>
                  <h3 className="font-semibold mb-2">Data-Driven Scores</h3>
                  <p className="text-sm text-muted-foreground">Based on real metrics from GitHub's public data</p>
                </div>
                <div className="p-6 rounded-lg bg-card/50 backdrop-blur border">
                  <div className="text-4xl mb-3">📈</div>
                  <h3 className="font-semibold mb-2">Shareable Results</h3>
                  <p className="text-sm text-muted-foreground">Share your unicorn score with investors and team</p>
                </div>
              </div>
            </div>
          ) : (
            analysisData && (
              <div className="max-w-6xl mx-auto space-y-8">
                {/* Results Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Analysis Results</h2>
                    <p className="text-muted-foreground">{repoName}</p>
                  </div>
                  <Button variant="outline" onClick={handleReset}>
                    Analyze Another
                  </Button>
                </div>

                {/* Score Display */}
                <ScoreDisplay score={analysisData.score} status={analysisData.status} />

                {/* Valuation Cards */}
                <ValuationCards
                  conservative={analysisData.valuations.conservative}
                  realistic={analysisData.valuations.realistic}
                  optimistic={analysisData.valuations.optimistic}
                />

                {/* Interpretation / Natural Language */}
                {analysisData.interpretation && (
                  <InterpretationDisplay
                    scoreMeaning={analysisData.interpretation.scoreMeaning}
                    valuationNote={analysisData.interpretation.valuationNote}
                    factorsConsidered={analysisData.interpretation.factorsConsidered}
                  />
                )}

                {/* Codebase Analysis */}
                {analysisData.codebaseAnalysis && (
                  <CodebaseAnalysis codebaseAnalysis={analysisData.codebaseAnalysis} />
                )}

                {/* Bottom Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <ComponentScores scores={analysisData.componentScores} />
                  <RepoMetrics
                    stars={analysisData.metrics.stars}
                    forks={analysisData.metrics.forks}
                    watchers={analysisData.metrics.watchers}
                    contributors={analysisData.metrics.contributors}
                    language={analysisData.metrics.language}
                  />
                </div>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  )
}
