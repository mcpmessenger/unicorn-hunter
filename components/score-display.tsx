"use client"

import { Trophy, TrendingUp, Rocket, Star, Lightbulb, Sprout } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ScoreDisplayProps {
  score: number
  status: string
}

const getScoreIcon = (score: number) => {
  if (score >= 90) return <Trophy className="h-12 w-12" />
  if (score >= 75) return <Rocket className="h-12 w-12" />
  if (score >= 60) return <Star className="h-12 w-12" />
  if (score >= 40) return <TrendingUp className="h-12 w-12" />
  if (score >= 20) return <Lightbulb className="h-12 w-12" />
  return <Sprout className="h-12 w-12" />
}

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-violet-500"
  if (score >= 75) return "text-emerald-500"
  if (score >= 60) return "text-green-500"
  if (score >= 40) return "text-yellow-500"
  if (score >= 20) return "text-orange-500"
  return "text-red-500"
}

export function ScoreDisplay({ score, status }: ScoreDisplayProps) {
  return (
    <Card className="relative overflow-hidden p-8 text-center bg-card/95 backdrop-blur border-2">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

      <div className="relative space-y-6">
        <div className={`flex justify-center ${getScoreColor(score)}`}>{getScoreIcon(score)}</div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Unicorn Score</h3>
          <div className={`text-7xl font-bold ${getScoreColor(score)}`}>{score}</div>
          <Progress value={score} className="h-3 mt-4" />
        </div>

        <div className="pt-4 border-t">
          <p className="text-lg font-semibold">{status}</p>
        </div>
      </div>
    </Card>
  )
}
