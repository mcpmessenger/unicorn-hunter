"use client"

import { Activity, GitFork, Star, Users, Zap, Code, Shield, TestTube, Wrench, FileCode } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ComponentScore {
  name: string
  score: number
  weight: number
}

interface ComponentScoresProps {
  scores: ComponentScore[]
}

const getIcon = (name: string) => {
  const nameLower = name.toLowerCase().replace(/\s+/g, "")
  const icons: Record<string, any> = {
    popularity: Star,
    activity: Activity,
    community: Users,
    engagement: GitFork,
    velocity: Zap,
    communitymomentum: Star,
    developmentvelocity: Zap,
    technologyquality: Code,
    marketpotential: Star,
    networkeffects: Users,
    codequality: Code,
    maintainability: Wrench,
    testreliability: TestTube,
    securityposture: Shield,
  }
  const Icon = icons[nameLower] || Activity
  return <Icon className="h-5 w-5" />
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-500"
  if (score >= 60) return "text-blue-500"
  if (score >= 40) return "text-yellow-500"
  return "text-red-500"
}

export function ComponentScores({ scores }: ComponentScoresProps) {
  return (
    <Card className="p-6 bg-card/95 backdrop-blur">
      <h3 className="text-xl font-bold mb-6">Score Breakdown</h3>
      <div className="space-y-6">
        {scores.map((item) => (
          <div key={item.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-primary">{getIcon(item.name)}</div>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Weight: {item.weight}%</p>
                </div>
              </div>
              <span className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                {item.score.toFixed(1)}
              </span>
            </div>
            <Progress value={item.score} className="h-2" />
          </div>
        ))}
      </div>
    </Card>
  )
}
