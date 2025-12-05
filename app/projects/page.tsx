"use client"

import { useMemo } from "react"
import Link from "next/link"
import { sampleGraphData } from "@/lib/data/sample-graph"
import { NODE_COLORS } from "@/lib/types/graph"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ExternalLink, FileText, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react"

export default function ProjectsPage() {
  // Extract projects from graph data
  const projects = useMemo(() => {
    const apps = sampleGraphData.nodes.filter((n) => n.type === "app")
    return apps.map((app) => {
      const specNodes = sampleGraphData.nodes.filter(
        (n) => n.slug === app.slug && ["spec_constitution", "spec_prd", "spec_plan", "spec_tasks"].includes(n.type),
      )
      const relatedIssues = sampleGraphData.edges
        .filter((e) => e.to === app.id && e.type === "related_to")
        .map((e) => sampleGraphData.nodes.find((n) => n.id === e.from))
        .filter(Boolean)

      return {
        ...app,
        specs: specNodes,
        issues: relatedIssues,
      }
    })
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-6">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Projects</h1>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">All Projects</h2>
          <p className="text-muted-foreground">Browse your Spec Kit projects and jump to their focused graph view.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const StatusIcon =
              project.status === "healthy" ? CheckCircle : project.status === "warning" ? AlertTriangle : AlertCircle
            const statusColor =
              project.status === "healthy"
                ? "text-green-500"
                : project.status === "warning"
                  ? "text-yellow-500"
                  : "text-red-500"

            return (
              <div key={project.id} className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="border-b border-border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: NODE_COLORS.app }} />
                        <span className="text-xs text-muted-foreground">Application</span>
                      </div>
                      <h3 className="text-lg font-semibold">{project.label}</h3>
                    </div>
                    <div className={`flex items-center gap-1 ${statusColor}`}>
                      <StatusIcon className="h-4 w-4" />
                      <span className="text-xs capitalize">{project.status}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  {/* Spec Kit files */}
                  <div className="mb-4">
                    <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Spec Kit
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.specs.map((spec) => (
                        <Badge key={spec.id} variant="secondary" className="gap-1">
                          <FileText className="h-3 w-3" />
                          {spec.type.replace("spec_", "")}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Issues count */}
                  {project.issues.length > 0 && (
                    <div className="mb-4">
                      <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {project.issues.length} issue{project.issues.length > 1 ? "s" : ""}
                      </Badge>
                    </div>
                  )}

                  {/* Actions */}
                  <Link href={`/graph?focus=${project.id}`}>
                    <Button className="w-full gap-2">
                      View in Graph
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
