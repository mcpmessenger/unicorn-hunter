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
  interpretation?: {
    scoreMeaning?: string
    valuationNote?: string
    factorsConsidered?: string[]
  }
  packageStats?: {
    status: string
    packageManager?: string
    packageName?: string
    stats?: {
      weeklyDownloads?: number
      monthlyDownloads?: number
      latestVersion?: string
      totalVersions?: number
    }
  }
  ecosystemAdoptionScore?: number
  summary?: string
  codebaseAnalysis?: {
    codeComplexity?: {
      averageCyclomaticComplexity?: number
      maxCyclomaticComplexity?: number
      duplicationPercentage?: number
    }
    qualityScores?: {
      maintainabilityIndex?: number
      technicalDebtRatio?: number
      codeSmellDensity?: number
    }
    testCoverage?: {
      overallCoverage?: number
      unitTestCoverage?: number
    }
    dependencies?: {
      totalDependencies?: number
      outdatedCount?: number
      securityVulnerabilities?: number
    }
    architecture?: {
      modularityScore?: number
      couplingScore?: number
    }
    documentation?: {
      readmeQualityScore?: number
      commentCoverage?: number
    }
  }
}

export async function analyzeRepository(repoName: string, includeCodebaseAnalysis: boolean = true): Promise<AnalysisResult> {
  try {
    console.log("[Unicorn Hunter] Analyzing repository:", repoName, "with codebase analysis:", includeCodebaseAnalysis)

    // Using v1.3.0 endpoint with fixed interpretation matching
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

    // If codebase analysis is requested, use agent_executor which handles it automatically
    if (includeCodebaseAnalysis) {
      console.log("[Unicorn Hunter] Using agent_executor for codebase analysis...")
      const agentResponse = await fetch(`${baseUrl}/mcp/invoke`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tool: "agent_executor",
          arguments: {
            input: `what's the unicorn score for ${owner}/${repo} with codebase analysis?`,
          },
        }),
      })

      if (!agentResponse.ok) {
        const errorText = await agentResponse.text()
        throw new Error(`Failed to analyze repository: ${agentResponse.status} - ${errorText}`)
      }

      const agentData = await agentResponse.json()
      let agentResult
      if (agentData.content && Array.isArray(agentData.content) && agentData.content.length > 0) {
        const textItem = agentData.content.find((item: any) => item.type === "text")
        if (textItem && textItem.text) {
          try {
            agentResult = JSON.parse(textItem.text)
            console.log("[Unicorn Hunter] Agent result keys:", Object.keys(agentResult))
          } catch (e) {
            console.error("[Unicorn Hunter] Failed to parse agent response:", e)
            throw new Error("Failed to parse analysis data")
          }
        }
      }

      if (!agentResult) {
        throw new Error("No data received from agent executor")
      }

      console.log("[Unicorn Hunter] Agent result structure:", {
        hasAnalysis: !!agentResult.analysis,
        hasUnicornHunter: !!agentResult.unicorn_hunter,
        hasCodebaseAnalysis: !!agentResult.codebase_analysis,
        hasPackageStats: !!agentResult.package_stats,
        hasEcosystemAdoptionScore: agentResult.ecosystem_adoption_score !== undefined,
        topLevelKeys: Object.keys(agentResult),
      })

      // Extract data from agent result
      // Agent executor returns: { analysis, codebase_analysis, unicorn_hunter, summary }
      const repoData = agentResult.analysis || agentResult.repo_data || {}
      const metrics = repoData.metrics || {}
      const unicornHunter = agentResult.unicorn_hunter || {}
      const codebaseAnalysis = unicornHunter.codebase_analysis || agentResult.codebase_analysis || {}
      
      console.log("[Unicorn Hunter] Has unicorn_hunter:", !!agentResult.unicorn_hunter)
      if (agentResult.unicorn_hunter) {
        console.log("[Unicorn Hunter] unicorn_hunter keys:", Object.keys(unicornHunter))
        console.log("[Unicorn Hunter] Has component_scores:", !!unicornHunter.component_scores)
      }
      
      // Component scores are in unicorn_hunter.component_scores
      // Try multiple paths to find component scores
      let componentScoresObj = {}
      if (unicornHunter.component_scores) {
        componentScoresObj = unicornHunter.component_scores
        console.log("[Unicorn Hunter] Found component_scores in unicorn_hunter.component_scores")
      } else if (agentResult.component_scores) {
        componentScoresObj = agentResult.component_scores
        console.log("[Unicorn Hunter] Found component_scores at top level")
      } else {
        console.warn("[Unicorn Hunter] WARNING: No component_scores found anywhere!")
        console.log("[Unicorn Hunter] Available keys in unicorn_hunter:", Object.keys(unicornHunter))
        console.log("[Unicorn Hunter] Available keys in agentResult:", Object.keys(agentResult))
      }
      
      console.log("[Unicorn Hunter] Component scores found:", Object.keys(componentScoresObj).length, "scores")
      console.log("[Unicorn Hunter] Component scores raw:", JSON.stringify(componentScoresObj, null, 2))
      
      // Verify we have the codebase analysis scores
      const codebaseScoreKeys = ['code_quality', 'maintainability', 'test_reliability', 'security_posture']
      const foundCodebaseScores = codebaseScoreKeys.filter(key => key in componentScoresObj)
      const missingCodebaseScores = codebaseScoreKeys.filter(key => !(key in componentScoresObj))
      console.log("[Unicorn Hunter] Found codebase scores:", foundCodebaseScores.map(k => `${k}=${componentScoresObj[k]}`))
      if (missingCodebaseScores.length > 0) {
        console.warn("[Unicorn Hunter] Missing codebase scores:", missingCodebaseScores)
      }
      
      const componentScores = Object.entries(componentScoresObj).map(([name, score]: [string, any]) => {
        const formattedName = name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
        const scoreValue = typeof score === "number" ? score : (typeof score === "string" ? parseFloat(score) || 0 : 0)
        if (codebaseScoreKeys.includes(name)) {
          console.log(`[Unicorn Hunter] CODEBASE SCORE: ${name} -> ${formattedName} = ${scoreValue} (raw: ${score})`)
        }
        return {
          name: formattedName,
          score: scoreValue,
          weight: 1,
        }
      })
      
      console.log("[Unicorn Hunter] Final component scores array (first 3):", componentScores.slice(0, 3))
      console.log("[Unicorn Hunter] Total component scores:", componentScores.length)
      
      const valuationRanges = unicornHunter.speculative_valuation_ranges || {}
      const interpretation = unicornHunter.interpretation || {}
      
      // Extract package stats
      const packageStats = agentResult.package_stats || null
      const ecosystemAdoptionScore = agentResult.ecosystem_adoption_score
      const summary = agentResult.summary

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
        interpretation: {
          scoreMeaning: interpretation.score_meaning,
          valuationNote: interpretation.valuation_note,
          factorsConsidered: interpretation.factors_considered || [],
        },
        packageStats: packageStats ? {
          status: packageStats.status || "unknown",
          packageManager: packageStats.package_manager,
          packageName: packageStats.package_name,
          stats: packageStats.stats ? {
            weeklyDownloads: packageStats.stats.weekly_downloads,
            monthlyDownloads: packageStats.stats.monthly_downloads,
            latestVersion: packageStats.stats.latest_version,
            totalVersions: packageStats.stats.total_versions,
          } : undefined,
        } : undefined,
        ecosystemAdoptionScore: ecosystemAdoptionScore !== undefined ? ecosystemAdoptionScore : undefined,
        summary: summary,
        codebaseAnalysis: codebaseAnalysis && Object.keys(codebaseAnalysis).length > 0 ? {
          codeComplexity: codebaseAnalysis.code_complexity ? {
            averageCyclomaticComplexity: codebaseAnalysis.code_complexity.average_cyclomatic_complexity,
            maxCyclomaticComplexity: codebaseAnalysis.code_complexity.max_cyclomatic_complexity,
            duplicationPercentage: codebaseAnalysis.code_complexity.duplication_percentage,
          } : undefined,
          qualityScores: codebaseAnalysis.quality_scores ? {
            maintainabilityIndex: codebaseAnalysis.quality_scores.maintainability_index,
            technicalDebtRatio: codebaseAnalysis.quality_scores.technical_debt_ratio,
            codeSmellDensity: codebaseAnalysis.quality_scores.code_smell_density,
          } : undefined,
          testCoverage: codebaseAnalysis.test_coverage ? {
            overallCoverage: codebaseAnalysis.test_coverage.overall_coverage,
            unitTestCoverage: codebaseAnalysis.test_coverage.unit_test_coverage,
          } : undefined,
          dependencies: codebaseAnalysis.dependencies ? {
            totalDependencies: codebaseAnalysis.dependencies.total_dependencies,
            outdatedCount: codebaseAnalysis.dependencies.outdated_count,
            securityVulnerabilities: codebaseAnalysis.dependencies.security_vulnerabilities,
          } : undefined,
          architecture: codebaseAnalysis.architecture ? {
            modularityScore: codebaseAnalysis.architecture.modularity_score,
            couplingScore: codebaseAnalysis.architecture.coupling_score,
          } : undefined,
          documentation: codebaseAnalysis.documentation ? {
            readmeQualityScore: codebaseAnalysis.documentation.readme_quality_score,
            commentCoverage: codebaseAnalysis.documentation.comment_coverage,
          } : undefined,
        } : undefined,
      }
    }

    // Step 1: Analyze the repository to get repo_data
    console.log("[Unicorn Hunter] Step 1: Analyzing repository...")
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
    
    const analyzeResponse = await fetch(`${baseUrl}/mcp/invoke`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tool: "analyze_github_repository",
        arguments: {
          owner: owner.trim(),
          repo: repo.trim(),
        },
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId))

    if (!analyzeResponse.ok) {
      let errorText = ""
      try {
        errorText = await analyzeResponse.text()
      } catch (e) {
        errorText = "Unable to read error response"
      }
      console.error("[Unicorn Hunter] Analyze failed:", errorText)
      throw new Error(`Failed to analyze repository (${analyzeResponse.status}). Please check the repository name and try again.`)
    }

    const analyzeData = await analyzeResponse.json()
    console.log("[Unicorn Hunter] Analysis complete, got repo_data")

    // Extract repo_data from the MCP response
    // MCP responses have structure: { content: [{ type: "text", text: "JSON string" }] }
    let repoData
    if (analyzeData.content && Array.isArray(analyzeData.content) && analyzeData.content.length > 0) {
      const textItem = analyzeData.content.find((item: any) => item.type === "text")
      if (textItem && textItem.text) {
        try {
          repoData = JSON.parse(textItem.text)
        } catch (e) {
          console.error("[Unicorn Hunter] Failed to parse analyze response:", e)
          throw new Error("Failed to parse repository analysis data")
        }
      } else {
        throw new Error("No text content found in analysis response")
      }
    } else {
      throw new Error("Invalid response format from analysis endpoint")
    }

    // Step 2: Get unicorn hunter valuation
    console.log("[Unicorn Hunter] Step 2: Calculating unicorn score...")
    const controller2 = new AbortController()
    const timeoutId2 = setTimeout(() => controller2.abort(), 30000) // 30 second timeout
    
    const unicornResponse = await fetch(`${baseUrl}/mcp/invoke`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tool: "unicorn_hunter",
        arguments: {
          repo_data: repoData,
        },
      }),
      signal: controller2.signal,
    }).finally(() => clearTimeout(timeoutId2))

    if (!unicornResponse.ok) {
      let errorText = ""
      try {
        errorText = await unicornResponse.text()
      } catch (e) {
        errorText = "Unable to read error response"
      }
      console.error("[Unicorn Hunter] Unicorn hunter failed:", errorText)
      throw new Error(`Failed to calculate unicorn score (${unicornResponse.status}). Please try again.`)
    }

    const unicornData = await unicornResponse.json()
    console.log("[Unicorn Hunter] Unicorn score calculated")

    // Parse the unicorn hunter response from MCP format
    let unicornResult
    if (unicornData.content && Array.isArray(unicornData.content) && unicornData.content.length > 0) {
      const textItem = unicornData.content.find((item: any) => item.type === "text")
      if (textItem && textItem.text) {
        try {
          unicornResult = JSON.parse(textItem.text)
        } catch (e) {
          console.error("[Unicorn Hunter] Failed to parse unicorn response:", e)
          throw new Error("Failed to parse unicorn score data")
        }
      } else {
        throw new Error("No text content found in unicorn response")
      }
    } else {
      throw new Error("Invalid response format from unicorn endpoint")
    }

    // Extract metrics from repo_data
    const metrics = repoData.metrics || {}
    
    // Convert component_scores object to array
    // The API returns: { "community_momentum": 91.2, "development_velocity": 62.1, ... }
    const componentScoresObj = unicornResult.component_scores || {}
    const componentScores = Object.entries(componentScoresObj).map(([name, score]: [string, any]) => ({
      name: name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()), // Convert snake_case to Title Case
      score: typeof score === "number" ? score : 0,
      weight: 1, // Default weight since API doesn't provide it
    }))

    // Extract valuation ranges (they come as numbers, not strings)
    const valuationRanges = unicornResult.speculative_valuation_ranges || {}
    
    // Extract interpretation (natural language explanations)
    const interpretation = unicornResult.interpretation || {}
    
    // Extract codebase analysis if available
    const codebaseAnalysis = unicornResult.codebase_analysis || {}
    
    // Map the response to our expected format
    return {
      score: unicornResult.unicorn_score || 0,
      status: unicornResult.status || getStatusFromScore(unicornResult.unicorn_score || 0),
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
      interpretation: {
        scoreMeaning: interpretation.score_meaning,
        valuationNote: interpretation.valuation_note,
        factorsConsidered: interpretation.factors_considered || [],
      },
      codebaseAnalysis: codebaseAnalysis && Object.keys(codebaseAnalysis).length > 0 ? {
        codeComplexity: codebaseAnalysis.code_complexity ? {
          averageCyclomaticComplexity: codebaseAnalysis.code_complexity.average_cyclomatic_complexity,
          maxCyclomaticComplexity: codebaseAnalysis.code_complexity.max_cyclomatic_complexity,
          duplicationPercentage: codebaseAnalysis.code_complexity.duplication_percentage,
        } : undefined,
        qualityScores: codebaseAnalysis.quality_scores ? {
          maintainabilityIndex: codebaseAnalysis.quality_scores.maintainability_index,
          technicalDebtRatio: codebaseAnalysis.quality_scores.technical_debt_ratio,
          codeSmellDensity: codebaseAnalysis.quality_scores.code_smell_density,
        } : undefined,
        testCoverage: codebaseAnalysis.test_coverage ? {
          overallCoverage: codebaseAnalysis.test_coverage.overall_coverage,
          unitTestCoverage: codebaseAnalysis.test_coverage.unit_test_coverage,
        } : undefined,
        dependencies: codebaseAnalysis.dependencies ? {
          totalDependencies: codebaseAnalysis.dependencies.total_dependencies,
          outdatedCount: codebaseAnalysis.dependencies.outdated_count,
          securityVulnerabilities: codebaseAnalysis.dependencies.security_vulnerabilities,
        } : undefined,
        architecture: codebaseAnalysis.architecture ? {
          modularityScore: codebaseAnalysis.architecture.modularity_score,
          couplingScore: codebaseAnalysis.architecture.coupling_score,
        } : undefined,
        documentation: codebaseAnalysis.documentation ? {
          readmeQualityScore: codebaseAnalysis.documentation.readme_quality_score,
          commentCoverage: codebaseAnalysis.documentation.comment_coverage,
        } : undefined,
      } : undefined,
    }
  } catch (error) {
    console.error("[Unicorn Hunter] Failed to analyze repository:", error)
    
    // Handle AbortError (timeout)
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.")
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Network error. Please check your connection and try again.")
    }
    
    // Ensure error is serializable for Next.js server actions
    if (error instanceof Error) {
      // Create a new error with just the message to ensure serialization
      const serializableError = new Error(error.message || "An unexpected error occurred")
      serializableError.name = error.name
      throw serializableError
    }
    
    throw new Error("Failed to analyze repository. Please check the repository name and try again.")
  }
}

// Helper function to format valuation
function formatValuation(value: any): string {
  if (value === null || value === undefined) return "$0"
  if (typeof value === "string") {
    // If it already has $, return as is
    if (value.includes("$")) return value
    // Try to parse as number
    const num = parseFloat(value)
    if (!isNaN(num)) {
      return `$${Math.round(num).toLocaleString()}`
    }
    return value
  }
  if (typeof value === "number") {
    // Format large numbers with abbreviations (e.g., $3.8M instead of $3,793,157)
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
function getStatusFromScore(score: number): string {
  if (score >= 80) return "Unicorn Potential"
  if (score >= 60) return "High Potential"
  if (score >= 40) return "Moderate Potential"
  if (score >= 20) return "Early Stage"
  return "Needs Growth"
}
