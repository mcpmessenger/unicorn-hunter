"use server"

export interface AnalysisResult {
  score: number
  status: string
  valuations: {
    conservative: string
    realistic: string
    optimistic: string
  }
  componentScores: Array<{
    name: string
    score: number
    weight: number
  }>
  metrics: {
    stars: number
    forks: number
    watchers: number
    contributors: number
    language: string
  }
}

export async function analyzeRepository(repoName: string): Promise<AnalysisResult> {
  try {
    console.log("[Unicorn Hunter] Analyzing repository:", repoName)

    // Using v1.3.0 endpoint with MCP protocol
    const baseUrl = "https://valuation-mcp-server-lwo3sf5jba-uc.a.run.app"

    // Parse owner and repo - handle both "owner/repo" and GitHub URLs
    let owner: string
    let repo: string

    // Check if it's a GitHub URL
    const githubUrlRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+)(?:\/.*)?$/
    const urlMatch = repoName.match(githubUrlRegex)
    if (urlMatch) {
      owner = urlMatch[1]
      repo = urlMatch[2]
    } else {
      // Try owner/repo format
      const parts = repoName.split("/")
      if (parts.length < 2 || !parts[0] || !parts[1]) {
        throw new Error(
          "Invalid repository format. Please use 'owner/repo' format (e.g., 'facebook/react') or a GitHub URL"
        )
      }
      owner = parts[0]
      repo = parts[1]
    }

    // Use agent_executor for comprehensive analysis
    console.log("[Unicorn Hunter] Using agent_executor for analysis...")
    const response = await fetch(`${baseUrl}/mcp/invoke`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tool: "agent_executor",
        arguments: {
          input: `what's the unicorn score for "${owner}/${repo}" with codebase analysis?`,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[Unicorn Hunter] Failed to analyze repository:", response.status, errorText)
      throw new Error(`Failed to analyze repository: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("[Unicorn Hunter] Response received")

    // Parse the MCP response format
    let result
    if (data.content && Array.isArray(data.content) && data.content.length > 0) {
      const textItem = data.content.find((item: any) => item.type === "text")
      if (textItem && textItem.text) {
        try {
          result = JSON.parse(textItem.text)
          console.log("[Unicorn Hunter] Parsed result keys:", Object.keys(result))
        } catch (e) {
          console.error("[Unicorn Hunter] Failed to parse response:", e)
          throw new Error("Failed to parse repository analysis data")
        }
      } else {
        throw new Error("No text content found in analysis response")
      }
    } else {
      throw new Error("Invalid response format from analysis endpoint")
    }

    // Extract data from agent result
    const repoData = result.analysis || result.repo_data || {}
    const metrics = repoData.metrics || {}
    const unicornHunter = result.unicorn_hunter || {}
    
    // Component scores are in unicorn_hunter.component_scores
    const componentScoresObj = unicornHunter.component_scores || {}
    const componentScores = Object.entries(componentScoresObj).map(([name, score]: [string, any]) => {
      const formattedName = name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
      const scoreValue = typeof score === "number" ? score : (typeof score === "string" ? parseFloat(score) || 0 : 0)
      return {
        name: formattedName,
        score: scoreValue,
        weight: 1,
      }
    })

    const valuationRanges = unicornHunter.speculative_valuation_ranges || {}
    
    // Helper function to format valuation
    const formatValuation = (value: any): string => {
      if (value === null || value === undefined) return "$0"
      if (typeof value === "string") {
        if (value.includes("$")) return value
        const num = parseFloat(value)
        if (!isNaN(num)) {
          return `$${Math.round(num).toLocaleString()}`
        }
        return value
      }
      if (typeof value === "number") {
        if (value >= 1000000) {
          return `$${(value / 1000000).toFixed(1)}M`
        } else if (value >= 1000) {
          return `$${(value / 1000).toFixed(1)}K`
        }
        return `$${Math.round(value).toLocaleString()}`
      }
      return "$0"
    }

    // Helper function to get status from score
    const getStatusFromScore = (score: number): string => {
      if (score >= 80) return "Unicorn Potential"
      if (score >= 60) return "High Potential"
      if (score >= 40) return "Moderate Potential"
      if (score >= 20) return "Early Stage"
      return "Needs Growth"
    }

    return {
      score: unicornHunter.unicorn_score || 0,
      status: unicornHunter.status || getStatusFromScore(unicornHunter.unicorn_score || 0),
      valuations: {
        conservative: formatValuation(valuationRanges.conservative),
        realistic: formatValuation(valuationRanges.realistic),
        optimistic: formatValuation(valuationRanges.optimistic),
      },
      componentScores: componentScores,
      metrics: {
        stars: metrics.stars || 0,
        forks: metrics.forks || 0,
        watchers: metrics.watchers || 0,
        contributors: repoData.development?.contributors || 0,
        language: repoData.basic_info?.primary_language || "Unknown",
      },
    }
  } catch (error) {
    console.error("[Unicorn Hunter] Failed to analyze repository:", error)
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Network error. Please check your connection and try again.")
    }
    
    // Ensure error is serializable for Next.js server actions
    if (error instanceof Error) {
      throw error
    }
    
    throw new Error("Failed to analyze repository. Please check the repository name and try again.")
  }
}
