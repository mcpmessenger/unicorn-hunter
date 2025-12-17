"use client"

import { GitFork, Star, Users, Eye } from "lucide-react"
import { Card } from "@/components/ui/card"

interface RepoMetricsProps {
  stars: number
  forks: number
  watchers: number
  contributors: number
  language?: string
}

export function RepoMetrics({ stars, forks, watchers, contributors, language }: RepoMetricsProps) {
  const metrics = [
    { label: "Stars", value: stars.toLocaleString(), icon: Star },
    { label: "Forks", value: forks.toLocaleString(), icon: GitFork },
    { label: "Watchers", value: watchers.toLocaleString(), icon: Eye },
    { label: "Contributors", value: contributors.toLocaleString(), icon: Users },
  ]

  return (
    <Card className="p-6 bg-card/95 backdrop-blur">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Repository Stats</h3>
        {language && (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary">{language}</span>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.label} className="text-center space-y-2">
              <Icon className="h-6 w-6 mx-auto text-primary" />
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
