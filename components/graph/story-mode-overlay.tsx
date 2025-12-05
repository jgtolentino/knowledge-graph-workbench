"use client"

import { useEffect, useCallback } from "react"
import { useGraphStore } from "@/lib/hooks/use-graph-store"
import type { GraphData } from "@/lib/types/graph"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, Play } from "lucide-react"

interface StoryModeOverlayProps {
  data: GraphData
}

const STORY_SCENES = [
  {
    title: "Welcome to Your Ecosystem",
    description: "This is your complete development ecosystem visualized as an interactive 3D knowledge graph.",
    focusFilter: null,
    focusNode: null,
  },
  {
    title: "Applications & Agents",
    description: "Your core applications and AI agents form the backbone of your system.",
    focusFilter: ["app", "agent"],
    focusNode: "app-guardian",
  },
  {
    title: "Spec Kit Overview",
    description: "Each project has a 4-file Spec Kit: Constitution, PRD, Plan, and Tasks.",
    focusFilter: ["app", "spec_constitution", "spec_prd", "spec_plan", "spec_tasks"],
    focusNode: "spec-guardian-constitution",
  },
  {
    title: "Infrastructure Layer",
    description: "Database tables, edge functions, and cron jobs power your backend.",
    focusFilter: ["supabase_table", "edge_function", "cron_job"],
    focusNode: "table-users",
  },
  {
    title: "Observability & Health",
    description: "Monitors track your system health, while issues and events show recent activity.",
    focusFilter: ["monitor", "event", "issue"],
    focusNode: "monitor-uptime",
  },
]

export function StoryModeOverlay({ data }: StoryModeOverlayProps) {
  const { storyMode, storyStep, setStoryMode, nextStoryStep, prevStoryStep, setVisibleTypes, setFocusNode } =
    useGraphStore()

  const currentScene = STORY_SCENES[storyStep] || STORY_SCENES[0]
  const isLastStep = storyStep >= STORY_SCENES.length - 1
  const isFirstStep = storyStep === 0

  // Apply scene effects
  useEffect(() => {
    if (storyMode && currentScene) {
      if (currentScene.focusFilter) {
        setVisibleTypes(currentScene.focusFilter as any)
      }
      if (currentScene.focusNode) {
        setTimeout(() => setFocusNode(currentScene.focusNode), 300)
      }
    }
  }, [storyMode, storyStep, currentScene, setVisibleTypes, setFocusNode])

  const handleNext = useCallback(() => {
    if (isLastStep) {
      setStoryMode(false)
    } else {
      nextStoryStep()
    }
  }, [isLastStep, nextStoryStep, setStoryMode])

  const handlePrev = useCallback(() => {
    if (!isFirstStep) {
      prevStoryStep()
    }
  }, [isFirstStep, prevStoryStep])

  // Keyboard navigation
  useEffect(() => {
    if (!storyMode) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault()
        handleNext()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        handlePrev()
      } else if (e.key === "Escape") {
        setStoryMode(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [storyMode, handleNext, handlePrev, setStoryMode])

  if (!storyMode) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-end justify-center p-8">
      <div className="pointer-events-auto w-full max-w-2xl rounded-xl border border-border bg-card/95 p-6 shadow-2xl backdrop-blur-sm">
        {/* Close button */}
        <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={() => setStoryMode(false)}>
          <X className="h-4 w-4" />
        </Button>

        {/* Progress */}
        <div className="mb-4 flex gap-1">
          {STORY_SCENES.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${i <= storyStep ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="mb-6">
          <h2 className="mb-2 text-xl font-semibold text-card-foreground">{currentScene.title}</h2>
          <p className="text-muted-foreground">{currentScene.description}</p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handlePrev} disabled={isFirstStep}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            {storyStep + 1} / {STORY_SCENES.length}
          </span>

          <Button onClick={handleNext}>
            {isLastStep ? (
              <>
                Finish
                <Play className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
