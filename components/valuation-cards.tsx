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
            className={`p-6 transition-all ${
              val.featured
                ? "bg-primary/20 border-primary border-2 shadow-lg shadow-primary/20 ring-2 ring-primary/30"
                : "bg-card/95 backdrop-blur border"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3
                  className={`font-semibold text-sm uppercase tracking-wider ${
                    val.featured ? "text-primary font-bold" : "text-muted-foreground"
                  }`}
                >
                  {val.title}
                </h3>
                <Icon className={`h-5 w-5 ${val.featured ? "text-primary" : "text-primary/70"}`} />
              </div>
              <div className={`text-3xl font-bold ${val.featured ? "text-foreground" : ""}`}>{val.value}</div>
              <p className={`text-sm ${val.featured ? "text-foreground/80" : "text-muted-foreground"}`}>
                {val.description}
              </p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
