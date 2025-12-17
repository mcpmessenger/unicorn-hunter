"use client"

import type React from "react"

import { useState } from "react"
import { Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface RepoInputProps {
  onAnalyze: (repo: string, includeCodebaseAnalysis?: boolean) => void
  isLoading?: boolean
}

export function RepoInput({ onAnalyze, isLoading }: RepoInputProps) {
  const [repo, setRepo] = useState("")
  const [error, setError] = useState("")
  const [includeCodebaseAnalysis, setIncludeCodebaseAnalysis] = useState(false)

  const normalizeRepo = (input: string): string | null => {
    const trimmed = input.trim()
    if (!trimmed) return null

    // Handle GitHub URLs
    const githubUrlRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+)(?:\/.*)?$/
    const urlMatch = trimmed.match(githubUrlRegex)
    if (urlMatch) {
      return `${urlMatch[1]}/${urlMatch[2]}`
    }

    // Handle owner/repo format
    const repoRegex = /^[\w.-]+\/[\w.-]+$/
    if (repoRegex.test(trimmed)) {
      return trimmed
    }

    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!repo.trim()) {
      setError("Please enter a repository")
      return
    }

    const normalized = normalizeRepo(repo)
    if (!normalized) {
      setError("Please enter a valid GitHub repository (e.g., facebook/react or https://github.com/facebook/react)")
      return
    }

    onAnalyze(normalized, includeCodebaseAnalysis)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter GitHub repo or URL (e.g., facebook/react or https://github.com/facebook/react)"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            className="pl-12 h-14 text-lg bg-background/95 backdrop-blur border-2 focus-visible:ring-primary"
            disabled={isLoading}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={includeCodebaseAnalysis}
                onChange={(e) => setIncludeCodebaseAnalysis(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 rounded border-primary"
              />
              <span className="text-muted-foreground">Deep Analysis</span>
            </label>
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" size="lg" className="w-full h-14 text-lg font-semibold" disabled={isLoading}>
          {isLoading ? (
            <>Analyzing Repository...</>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Hunt Unicorn
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center space-y-2">
        <p className="text-sm text-muted-foreground">Try these examples:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {["vercel/next.js", "facebook/react", "microsoft/vscode"].map((example) => (
            <button
              key={example}
              onClick={() => setRepo(example)}
              className="text-sm px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              disabled={isLoading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
