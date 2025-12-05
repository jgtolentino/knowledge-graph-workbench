"use client"

import { BrainGraphCanvas } from "@/components/graph/brain-graph-canvas"
import { FilterPanel } from "@/components/graph/filter-panel"
import { DetailPanel } from "@/components/graph/detail-panel"
import { StoryModeOverlay } from "@/components/graph/story-mode-overlay"
import { sampleGraphData } from "@/lib/data/sample-graph"

export default function GraphPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Left Sidebar - Filters */}
      <FilterPanel />

      {/* Main Canvas */}
      <div className="relative flex-1">
        <BrainGraphCanvas data={sampleGraphData} />
        <StoryModeOverlay data={sampleGraphData} />
      </div>

      {/* Right Sidebar - Details */}
      <DetailPanel data={sampleGraphData} />
    </div>
  )
}
