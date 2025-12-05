"use client"

import { useMemo } from "react"
import Link from "next/link"
import { sampleGraphData } from "@/lib/data/sample-graph"
import { NODE_COLORS } from "@/lib/types/graph"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, ExternalLink, AlertCircle, AlertTriangle, CheckCircle } from "lucide-react"

export default function IssuesPage() {
  // Extract issues and events from graph data
  const issuesAndEvents = useMemo(() => {
    return sampleGraphData.nodes
      .filter((n) => n.type === "issue" || n.type === "event")
      .map((node) => {
        // Find related nodes
        const relatedEdges = sampleGraphData.edges.filter((e) => e.from === node.id || e.to === node.id)
        const relatedNodes = relatedEdges
          .map((e) => {
            const targetId = e.from === node.id ? e.to : e.from
            return sampleGraphData.nodes.find((n) => n.id === targetId)
          })
          .filter(Boolean)

        return {
          ...node,
          relatedNodes,
        }
      })
      .sort((a, b) => (b.importance || 0) - (a.importance || 0))
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
          <h1 className="text-lg font-semibold">Issues & Events</h1>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">System Health</h2>
          <p className="text-muted-foreground">
            Track issues and events across your ecosystem. Click to view in graph context.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              <span className="text-2xl font-bold">{issuesAndEvents.filter((n) => n.status === "error").length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Critical Issues</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-yellow-500">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-2xl font-bold">{issuesAndEvents.filter((n) => n.status === "warning").length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Warnings</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle className="h-5 w-5" />
              <span className="text-2xl font-bold">{issuesAndEvents.filter((n) => n.type === "event").length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Events</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-primary">
              <span className="text-2xl font-bold">{issuesAndEvents.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Total Items</p>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Related To</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issuesAndEvents.map((item) => {
                const StatusIcon =
                  item.status === "error" ? AlertCircle : item.status === "warning" ? AlertTriangle : CheckCircle
                const statusColor =
                  item.status === "error"
                    ? "text-red-500"
                    : item.status === "warning"
                      ? "text-yellow-500"
                      : "text-green-500"

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <StatusIcon className={`h-4 w-4 ${statusColor}`} />
                    </TableCell>
                    <TableCell className="font-medium">{item.label}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        style={{ borderColor: NODE_COLORS[item.type], color: NODE_COLORS[item.type] }}
                      >
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.relatedNodes.slice(0, 2).map((n: any) => (
                          <Badge key={n.id} variant="secondary" className="text-xs">
                            {n.label}
                          </Badge>
                        ))}
                        {item.relatedNodes.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{item.relatedNodes.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${(item.importance || 0.5) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {Math.round((item.importance || 0.5) * 100)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/graph?focus=${item.id}`}>
                        <Button variant="ghost" size="sm" className="gap-1">
                          View
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}
