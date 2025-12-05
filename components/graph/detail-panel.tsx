"use client"

import { useMemo } from "react"
import { useGraphStore } from "@/lib/hooks/use-graph-store"
import { NODE_COLORS, NODE_LABELS, type GraphData, type GraphNode } from "@/lib/types/graph"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  X,
  ExternalLink,
  GitBranch,
  ArrowRight,
  ArrowLeft,
  Clock,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

interface DetailPanelProps {
  data: GraphData
}

export function DetailPanel({ data }: DetailPanelProps) {
  const { selectedNodeId, setSelectedNode, setFocusNode } = useGraphStore()

  const selectedNode = useMemo(() => {
    return data.nodes.find((n) => n.id === selectedNodeId)
  }, [data.nodes, selectedNodeId])

  const connections = useMemo(() => {
    if (!selectedNodeId) return { incoming: [], outgoing: [] }

    const incoming: { edge: (typeof data.edges)[0]; node: GraphNode }[] = []
    const outgoing: { edge: (typeof data.edges)[0]; node: GraphNode }[] = []

    data.edges.forEach((edge) => {
      if (edge.to === selectedNodeId) {
        const sourceNode = data.nodes.find((n) => n.id === edge.from)
        if (sourceNode) incoming.push({ edge, node: sourceNode })
      }
      if (edge.from === selectedNodeId) {
        const targetNode = data.nodes.find((n) => n.id === edge.to)
        if (targetNode) outgoing.push({ edge, node: targetNode })
      }
    })

    return { incoming, outgoing }
  }, [data, selectedNodeId])

  if (!selectedNode) {
    return (
      <div className="flex h-full w-80 flex-col border-l border-border bg-card">
        <div className="flex flex-1 items-center justify-center p-8 text-center">
          <div>
            <GitBranch className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">Select a node to view details</p>
          </div>
        </div>
      </div>
    )
  }

  const StatusIcon =
    selectedNode.status === "healthy"
      ? CheckCircle
      : selectedNode.status === "warning"
        ? AlertTriangle
        : selectedNode.status === "error"
          ? AlertCircle
          : Clock

  const statusColor =
    selectedNode.status === "healthy"
      ? "text-green-500"
      : selectedNode.status === "warning"
        ? "text-yellow-500"
        : selectedNode.status === "error"
          ? "text-red-500"
          : "text-gray-500"

  return (
    <div className="flex h-full w-80 flex-col border-l border-border bg-card">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-border p-4">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: NODE_COLORS[selectedNode.type] }} />
            <span className="text-xs text-muted-foreground">{NODE_LABELS[selectedNode.type]}</span>
          </div>
          <h3 className="text-lg font-semibold text-card-foreground">{selectedNode.label}</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSelectedNode(null)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Status & Metadata */}
          <div className="mb-6 rounded-lg bg-muted/50 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <div className={`flex items-center gap-1 ${statusColor}`}>
                <StatusIcon className="h-4 w-4" />
                <span className="text-sm font-medium capitalize">{selectedNode.status || "Unknown"}</span>
              </div>
            </div>
            {selectedNode.importance !== undefined && (
              <>
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Importance</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${selectedNode.importance * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{Math.round(selectedNode.importance * 100)}%</span>
                  </div>
                </div>
              </>
            )}
            {selectedNode.slug && (
              <>
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Project</span>
                  <Badge variant="secondary">{selectedNode.slug}</Badge>
                </div>
              </>
            )}
            {selectedNode.createdAt && (
              <>
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">{selectedNode.createdAt}</span>
                </div>
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start bg-transparent"
              onClick={() => setFocusNode(selectedNode.id)}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Focus on this node
            </Button>
          </div>

          {/* Connections */}
          {connections.incoming.length > 0 && (
            <div className="mb-6">
              <h4 className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <ArrowLeft className="h-3 w-3" />
                Incoming ({connections.incoming.length})
              </h4>
              <div className="space-y-2">
                {connections.incoming.map(({ edge, node }) => (
                  <button
                    key={edge.id}
                    onClick={() => setSelectedNode(node.id)}
                    className="flex w-full items-center gap-2 rounded-md border border-border bg-background p-2 text-left transition-colors hover:bg-muted"
                  >
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: NODE_COLORS[node.type] }} />
                    <span className="flex-1 truncate text-sm">{node.label}</span>
                    <Badge variant="outline" className="text-xs">
                      {edge.type.replace("_", " ")}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {connections.outgoing.length > 0 && (
            <div className="mb-6">
              <h4 className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <ArrowRight className="h-3 w-3" />
                Outgoing ({connections.outgoing.length})
              </h4>
              <div className="space-y-2">
                {connections.outgoing.map(({ edge, node }) => (
                  <button
                    key={edge.id}
                    onClick={() => setSelectedNode(node.id)}
                    className="flex w-full items-center gap-2 rounded-md border border-border bg-background p-2 text-left transition-colors hover:bg-muted"
                  >
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: NODE_COLORS[node.type] }} />
                    <span className="flex-1 truncate text-sm">{node.label}</span>
                    <Badge variant="outline" className="text-xs">
                      {edge.type.replace("_", " ")}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
