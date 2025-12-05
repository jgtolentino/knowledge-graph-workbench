// Core types for the Knowledge Graph

export type NodeType =
  | "app"
  | "agent"
  | "spec_constitution"
  | "spec_prd"
  | "spec_plan"
  | "spec_tasks"
  | "supabase_table"
  | "edge_function"
  | "cron_job"
  | "monitor"
  | "event"
  | "issue"

export type EdgeType = "has_spec" | "uses_table" | "triggers" | "monitors" | "depends_on" | "related_to" | "caused_by"

export interface GraphNode {
  id: string
  type: NodeType
  label: string
  slug?: string
  importance?: number // 0-1 scale
  createdAt?: string
  status?: "healthy" | "warning" | "error" | "unknown"
  metadata?: Record<string, unknown>
}

export interface GraphEdge {
  id: string
  from: string
  to: string
  type: EdgeType
  weight?: number
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface PositionedNode extends GraphNode {
  x: number
  y: number
  z: number
  vx?: number
  vy?: number
  vz?: number
}

export interface LayoutMessage {
  type: "init" | "update" | "tick" | "stop"
  nodes?: GraphNode[]
  edges?: GraphEdge[]
  alpha?: number
}

export interface LayoutResult {
  type: "positions" | "done"
  nodes: PositionedNode[]
  alpha?: number
}

// Node type colors mapped to CSS custom properties
export const NODE_COLORS: Record<NodeType, string> = {
  app: "#3ecfcf",
  agent: "#cf6ecf",
  spec_constitution: "#cfcf3e",
  spec_prd: "#cfcf3e",
  spec_plan: "#cfcf3e",
  spec_tasks: "#cfcf3e",
  supabase_table: "#6e6ecf",
  edge_function: "#3ecf6e",
  cron_job: "#3ecf6e",
  monitor: "#cf8f3e",
  event: "#cf8f3e",
  issue: "#cf4f4f",
}

export const NODE_LABELS: Record<NodeType, string> = {
  app: "Application",
  agent: "AI Agent",
  spec_constitution: "Constitution",
  spec_prd: "PRD",
  spec_plan: "Plan",
  spec_tasks: "Tasks",
  supabase_table: "Database Table",
  edge_function: "Edge Function",
  cron_job: "Cron Job",
  monitor: "Monitor",
  event: "Event",
  issue: "Issue",
}
