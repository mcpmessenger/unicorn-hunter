"use client"

import { Card } from "@/components/ui/card"
import { Info, Lightbulb, AlertCircle } from "lucide-react"

interface InterpretationDisplayProps {
  scoreMeaning?: string
  valuationNote?: string
  factorsConsidered?: string[]
}

export function InterpretationDisplay({
  scoreMeaning,
  valuationNote,
  factorsConsidered,
}: InterpretationDisplayProps) {
  // Always show disclaimer, even if no other content
  const hasContent = scoreMeaning || factorsConsidered?.length || valuationNote

  return (
    <div className="space-y-4">
      {scoreMeaning && (
        <Card className="p-6 bg-primary/10 border-primary/30 border">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2 text-primary">Score Interpretation</h3>
              <p className="text-foreground/90 leading-relaxed">{scoreMeaning}</p>
            </div>
          </div>
        </Card>
      )}

      {factorsConsidered && factorsConsidered.length > 0 && (
        <Card className="p-6 bg-card/95 backdrop-blur border">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold mb-3">Factors Considered</h3>
              <div className="flex flex-wrap gap-2">
                {factorsConsidered.map((factor, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
                  >
                    {factor.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4 bg-muted/50 border border-border/50">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              <strong>Important:</strong> This analysis is based solely on codebase metrics (stars, forks, commits, contributors, etc.) and does not consider Daily Active Users (DAU), revenue, user engagement, or business metrics. Valuations are speculative estimates and should not be considered financial advice.
            </p>
            {valuationNote && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {valuationNote}
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

