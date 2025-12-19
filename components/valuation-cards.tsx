"use client"

import { TrendingDown, Target, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"

interface ValuationCardsProps {
  conservative: string
  realistic: string
  optimistic: string
}

export function ValuationCards({ conservative, realistic, optimistic }: ValuationCardsProps) {
  const valuations = [
    {
      title: "Conservative",
      value: conservative,
      icon: TrendingDown,
      description: "Lower bound estimate",
    },
    {
      title: "Realistic",
      value: realistic,
      icon: Target,
      description: "Most likely valuation",
      featured: true,
    },
    {
      title: "Optimistic",
      value: optimistic,
      icon: TrendingUp,
      description: "Upper bound potential",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {valuations.map((val) => {
        const Icon = val.icon
        return (
          <Card
            key={val.title}
            className={`p-6 ${val.featured ? "bg-primary/10 border-primary/50 border-2" : "bg-card/95 backdrop-blur"}`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{val.title}</h3>
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="text-3xl font-bold">{val.value}</div>
              <p className="text-sm text-muted-foreground">{val.description}</p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
