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
    console.log("[v0] Analyzing repository:", repoName)

    const baseUrl = "https://valuation-mcp-server-554655392699.us-central1.run.app"

    const endpoints = [
      { url: `${baseUrl}/api/analyze`, method: "POST", body: { repo: repoName } },
      { url: `${baseUrl}/valuation`, method: "POST", body: { repo: repoName } },
      { url: `${baseUrl}/analyze/${repoName}`, method: "GET", body: null },
      { url: `${baseUrl}/api/valuation`, method: "POST", body: { repository: repoName } },
      { url: `${baseUrl}/`, method: "POST", body: { repo: repoName } },
    ]

    let lastError = null

    for (const endpoint of endpoints) {
      console.log("[v0] Trying endpoint:", endpoint.url, "with method:", endpoint.method)

      try {
        const fetchOptions: RequestInit = {
          method: endpoint.method,
          headers: {
            "Content-Type": "application/json",
          },
        }

        if (endpoint.body) {
          fetchOptions.body = JSON.stringify(endpoint.body)
        }

        const response = await fetch(endpoint.url, fetchOptions)

        console.log("[v0] Response status:", response.status, "for", endpoint.url)

        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Success! Response data:", data)

          return {
            score: data.score || 0,
            status: data.status || "Unknown",
            valuations: {
              conservative: data.valuations?.conservative || "$0",
              realistic: data.valuations?.realistic || "$0",
              optimistic: data.valuations?.optimistic || "$0",
            },
            componentScores: data.componentScores || [],
            metrics: {
              stars: data.metrics?.stars || 0,
              forks: data.metrics?.forks || 0,
              watchers: data.metrics?.watchers || 0,
              contributors: data.metrics?.contributors || 0,
              language: data.metrics?.language || "Unknown",
            },
          }
        }

        const errorText = await response.text()
        console.log("[v0] Error response from", endpoint.url, ":", errorText)
        lastError = `${endpoint.url}: ${response.status} - ${errorText}`
      } catch (err) {
        console.log("[v0] Exception for", endpoint.url, ":", err)
        lastError = `${endpoint.url}: ${err}`
      }
    }

    throw new Error(`All endpoints failed. Last error: ${lastError}`)
  } catch (error) {
    console.error("[v0] Failed to analyze repository:", error)
    throw new Error("Failed to analyze repository. Please check the repository name and try again.")
  }
}
