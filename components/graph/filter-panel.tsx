"use client"

import type React from "react"

import { useGraphStore } from "@/lib/hooks/use-graph-store"
import { NODE_LABELS, type NodeType } from "@/lib/types/graph"
import { NODE_COLORS } from "@/lib/types/graph"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Filter,
  Box,
  Bot,
  FileText,
  Database,
  Zap,
  Clock,
  Activity,
  AlertTriangle,
  Calendar,
  Play,
  Pause,
} from "lucide-react"

const TYPE_ICONS: Record<NodeType, React.ReactNode> = {
  app: <Box className="h-4 w-4" />,
  agent: <Bot className="h-4 w-4" />,
  spec_constitution: <FileText className="h-4 w-4" />,
  spec_prd: <FileText className="h-4 w-4" />,
  spec_plan: <FileText className="h-4 w-4" />,
  spec_tasks: <FileText className="h-4 w-4" />,
  supabase_table: <Database className="h-4 w-4" />,
  edge_function: <Zap className="h-4 w-4" />,
  cron_job: <Clock className="h-4 w-4" />,
  monitor: <Activity className="h-4 w-4" />,
  event: <Calendar className="h-4 w-4" />,
  issue: <AlertTriangle className="h-4 w-4" />,
}

const TYPE_GROUPS = {
  Core: ["app", "agent"] as NodeType[],
  "Spec Kit": ["spec_constitution", "spec_prd", "spec_plan", "spec_tasks"] as NodeType[],
  Infrastructure: ["supabase_table", "edge_function", "cron_job"] as NodeType[],
  Observability: ["monitor", "event", "issue"] as NodeType[],
}

export function FilterPanel() {
  const { visibleTypes, toggleType, setVisibleTypes, searchQuery, setSearchQuery, storyMode, setStoryMode } =
    useGraphStore()

  const allTypes = Object.values(TYPE_GROUPS).flat()
  const allVisible = allTypes.every((t) => visibleTypes.has(t))

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
      <div className="border-b border-sidebar-border p-4">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-sidebar-foreground">
          <Filter className="h-4 w-4" />
          Filters
        </h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-sidebar-accent pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {/* Quick Actions */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Quick Actions</span>
          </div>
          <div className="space-y-2">
            <Button
              variant={allVisible ? "secondary" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setVisibleTypes(allVisible ? [] : allTypes)}
            >
              {allVisible ? "Hide All" : "Show All"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start bg-transparent"
              onClick={() => setVisibleTypes(["app", "issue", "monitor"])}
            >
              Health Overview
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start bg-transparent"
              onClick={() => setVisibleTypes(["app", "spec_constitution", "spec_prd", "spec_plan", "spec_tasks"])}
            >
              Spec Kits Only
            </Button>
          </div>
        </div>

        {/* Node Types by Group */}
        {Object.entries(TYPE_GROUPS).map(([group, types]) => (
          <div key={group} className="mb-6">
            <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{group}</div>
            <div className="space-y-2">
              {types.map((type) => (
                <div
                  key={type}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-sidebar-accent"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded"
                      style={{ backgroundColor: `${NODE_COLORS[type]}20`, color: NODE_COLORS[type] }}
                    >
                      {TYPE_ICONS[type]}
                    </div>
                    <span className="text-sm text-sidebar-foreground">{NODE_LABELS[type]}</span>
                  </div>
                  <Switch checked={visibleTypes.has(type)} onCheckedChange={() => toggleType(type)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>

      {/* Story Mode Toggle */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {storyMode ? <Pause className="h-4 w-4 text-primary" /> : <Play className="h-4 w-4" />}
            <span className="text-sm font-medium">Story Mode</span>
          </div>
          <Switch checked={storyMode} onCheckedChange={setStoryMode} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Guided tour through your ecosystem</p>
      </div>
    </div>
  )
}
