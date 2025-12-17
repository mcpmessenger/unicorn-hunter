"use client"

import { Card } from "@/components/ui/card"
import { Package, Download, Tag, TrendingUp } from "lucide-react"

interface PackageStatsProps {
  packageStats: {
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
}

const getPackageManagerIcon = (pm?: string) => {
  switch (pm?.toLowerCase()) {
    case "npm":
      return "📦"
    case "pypi":
      return "🐍"
    case "cargo":
      return "🦀"
    default:
      return "📦"
  }
}

const formatNumber = (num?: number): string => {
  if (!num) return "N/A"
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`
  }
  return num.toString()
}

export function PackageStats({ packageStats, ecosystemAdoptionScore }: PackageStatsProps) {
  // Don't render if no package stats or status is not success
  if (!packageStats || packageStats.status !== "success") {
    return null
  }

  const { packageManager, packageName, stats } = packageStats

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
        <div className="flex items-start gap-4">
          <div className="text-4xl">{getPackageManagerIcon(packageManager)}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold">Ecosystem Adoption</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">Package Manager:</span>
                  <span className="px-2 py-1 rounded bg-primary/20 text-primary font-semibold">
                    {packageManager?.toUpperCase() || "Unknown"}
                  </span>
                </div>
                {packageName && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium">Package:</span>
                    <code className="px-2 py-1 rounded bg-muted text-foreground font-mono">
                      {packageName}
                    </code>
                  </div>
                )}
              </div>
              
              {stats?.latestVersion && (
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Latest Version:</span>
                  <span className="px-2 py-1 rounded bg-muted font-mono font-semibold">
                    {stats.latestVersion}
                  </span>
                </div>
              )}
            </div>

            {/* Download Statistics */}
            {(stats?.weeklyDownloads || stats?.monthlyDownloads) && (
              <div className="grid md:grid-cols-2 gap-4 mb-4 p-4 rounded-lg bg-background/50 border border-border/50">
                {stats.weeklyDownloads && (
                  <div className="flex items-center gap-3">
                    <Download className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Weekly Downloads</div>
                      <div className="text-lg font-bold">{formatNumber(stats.weeklyDownloads)}</div>
                    </div>
                  </div>
                )}
                {stats.monthlyDownloads && (
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Monthly Downloads</div>
                      <div className="text-lg font-bold">{formatNumber(stats.monthlyDownloads)}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Adoption Score */}
            {ecosystemAdoptionScore !== undefined && (
              <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Ecosystem Adoption Score
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {ecosystemAdoptionScore.toFixed(1)}/100
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(ecosystemAdoptionScore, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Based on package download statistics and registry metrics
                </p>
              </div>
            )}

            {stats?.totalVersions && (
              <div className="mt-2 text-xs text-muted-foreground">
                {stats.totalVersions} version{stats.totalVersions !== 1 ? "s" : ""} published
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

