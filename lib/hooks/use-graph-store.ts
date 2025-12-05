"use client"

import { create } from "zustand"
import type { NodeType } from "@/lib/types/graph"

interface GraphStore {
  // Selection
  selectedNodeId: string | null
  hoveredNodeId: string | null
  setSelectedNode: (id: string | null) => void
  setHoveredNode: (id: string | null) => void

  // Filters
  visibleTypes: Set<NodeType>
  toggleType: (type: NodeType) => void
  setVisibleTypes: (types: NodeType[]) => void

  // Camera
  focusNodeId: string | null
  setFocusNode: (id: string | null) => void

  // Story Mode
  storyMode: boolean
  storyStep: number
  setStoryMode: (enabled: boolean) => void
  nextStoryStep: () => void
  prevStoryStep: () => void

  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void

  // Zoom level for LOD
  zoomLevel: number
  setZoomLevel: (level: number) => void
}

const ALL_TYPES: NodeType[] = [
  "app",
  "agent",
  "spec_constitution",
  "spec_prd",
  "spec_plan",
  "spec_tasks",
  "supabase_table",
  "edge_function",
  "cron_job",
  "monitor",
  "event",
  "issue",
]

export const useGraphStore = create<GraphStore>((set) => ({
  // Selection
  selectedNodeId: null,
  hoveredNodeId: null,
  setSelectedNode: (id) => set({ selectedNodeId: id }),
  setHoveredNode: (id) => set({ hoveredNodeId: id }),

  // Filters
  visibleTypes: new Set(ALL_TYPES),
  toggleType: (type) =>
    set((state) => {
      const newTypes = new Set(state.visibleTypes)
      if (newTypes.has(type)) {
        newTypes.delete(type)
      } else {
        newTypes.add(type)
      }
      return { visibleTypes: newTypes }
    }),
  setVisibleTypes: (types) => set({ visibleTypes: new Set(types) }),

  // Camera
  focusNodeId: null,
  setFocusNode: (id) => set({ focusNodeId: id }),

  // Story Mode
  storyMode: false,
  storyStep: 0,
  setStoryMode: (enabled) => set({ storyMode: enabled, storyStep: 0 }),
  nextStoryStep: () => set((state) => ({ storyStep: state.storyStep + 1 })),
  prevStoryStep: () => set((state) => ({ storyStep: Math.max(0, state.storyStep - 1) })),

  // Search
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Zoom
  zoomLevel: 1,
  setZoomLevel: (level) => set({ zoomLevel: level }),
}))
