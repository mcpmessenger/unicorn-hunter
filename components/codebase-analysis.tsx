"use client"

import { Card } from "@/components/ui/card"
import { Code, Shield, TestTube, Wrench, FileText, Layers, AlertCircle, CheckCircle2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface CodebaseAnalysisProps {
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

export function CodebaseAnalysis({ codebaseAnalysis }: CodebaseAnalysisProps) {
  if (!codebaseAnalysis) return null

  const { codeComplexity, qualityScores, testCoverage, dependencies, architecture, documentation } =
    codebaseAnalysis

  return (
    <Card className="p-6 bg-card/95 backdrop-blur">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Code className="h-5 w-5 text-primary" />
        Codebase Analysis
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Code Quality */}
        {qualityScores && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="h-4 w-4 text-primary" />
              <h4 className="font-semibold">Code Quality</h4>
            </div>
            {qualityScores.maintainabilityIndex !== undefined && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Maintainability</span>
                  <span className="font-medium">{qualityScores.maintainabilityIndex.toFixed(1)}/100</span>
                </div>
                <Progress value={qualityScores.maintainabilityIndex} className="h-2" />
              </div>
            )}
            {qualityScores.technicalDebtRatio !== undefined && (
              <div className="text-sm text-muted-foreground">
                Technical Debt: {(qualityScores.technicalDebtRatio * 100).toFixed(1)}%
              </div>
            )}
            {qualityScores.codeSmellDensity !== undefined && (
              <div className="text-sm text-muted-foreground">
                Code Smells: {qualityScores.codeSmellDensity.toFixed(1)} per 1K lines
              </div>
            )}
          </div>
        )}

        {/* Test Coverage */}
        {testCoverage && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <TestTube className="h-4 w-4 text-primary" />
              <h4 className="font-semibold">Test Coverage</h4>
            </div>
            {testCoverage.overallCoverage !== undefined && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Coverage</span>
                  <span className="font-medium">{testCoverage.overallCoverage.toFixed(1)}%</span>
                </div>
                <Progress value={testCoverage.overallCoverage} className="h-2" />
              </div>
            )}
            {testCoverage.unitTestCoverage !== undefined && (
              <div className="text-sm text-muted-foreground">
                Unit Tests: {testCoverage.unitTestCoverage.toFixed(1)}%
              </div>
            )}
          </div>
        )}

        {/* Dependencies & Security */}
        {dependencies && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-primary" />
              <h4 className="font-semibold">Dependencies & Security</h4>
            </div>
            {dependencies.totalDependencies !== undefined && (
              <div className="text-sm">
                Total Dependencies: <span className="font-medium">{dependencies.totalDependencies}</span>
              </div>
            )}
            {dependencies.outdatedCount !== undefined && dependencies.totalDependencies !== undefined && (
              <div className="text-sm text-muted-foreground">
                Outdated: {dependencies.outdatedCount} (
                {((dependencies.outdatedCount / dependencies.totalDependencies) * 100).toFixed(1)}%)
              </div>
            )}
            {dependencies.securityVulnerabilities !== undefined && (
              <div className="flex items-center gap-2">
                {dependencies.securityVulnerabilities === 0 ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">No security vulnerabilities</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-500">
                      {dependencies.securityVulnerabilities} vulnerability
                      {dependencies.securityVulnerabilities !== 1 ? "ies" : ""} found
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Architecture */}
        {architecture && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="h-4 w-4 text-primary" />
              <h4 className="font-semibold">Architecture</h4>
            </div>
            {architecture.modularityScore !== undefined && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Modularity</span>
                  <span className="font-medium">{architecture.modularityScore.toFixed(1)}/10</span>
                </div>
                <Progress value={architecture.modularityScore * 10} className="h-2" />
              </div>
            )}
            {architecture.couplingScore !== undefined && (
              <div className="text-sm text-muted-foreground">
                Coupling Score: {architecture.couplingScore.toFixed(1)} (lower is better)
              </div>
            )}
          </div>
        )}

        {/* Code Complexity */}
        {codeComplexity && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Code className="h-4 w-4 text-primary" />
              <h4 className="font-semibold">Complexity</h4>
            </div>
            {codeComplexity.averageCyclomaticComplexity !== undefined && (
              <div className="text-sm">
                Avg Complexity: <span className="font-medium">{codeComplexity.averageCyclomaticComplexity.toFixed(1)}</span>
              </div>
            )}
            {codeComplexity.maxCyclomaticComplexity !== undefined && (
              <div className="text-sm text-muted-foreground">
                Max Complexity: {codeComplexity.maxCyclomaticComplexity}
              </div>
            )}
            {codeComplexity.duplicationPercentage !== undefined && (
              <div className="text-sm text-muted-foreground">
                Duplication: {codeComplexity.duplicationPercentage.toFixed(1)}%
              </div>
            )}
          </div>
        )}

        {/* Documentation */}
        {documentation && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-primary" />
              <h4 className="font-semibold">Documentation</h4>
            </div>
            {documentation.readmeQualityScore !== undefined && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>README Quality</span>
                  <span className="font-medium">{documentation.readmeQualityScore.toFixed(1)}/10</span>
                </div>
                <Progress value={documentation.readmeQualityScore * 10} className="h-2" />
              </div>
            )}
            {documentation.commentCoverage !== undefined && (
              <div className="text-sm text-muted-foreground">
                Comment Coverage: {documentation.commentCoverage.toFixed(1)}%
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

