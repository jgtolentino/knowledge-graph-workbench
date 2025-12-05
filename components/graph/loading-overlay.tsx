"use client"

import { Loader2 } from "lucide-react"

interface LoadingOverlayProps {
  alpha: number
  isLayouting: boolean
}

export function LoadingOverlay({ alpha, isLayouting }: LoadingOverlayProps) {
  if (!isLayouting && alpha < 0.01) return null

  return (
    <div className="absolute left-4 top-4 z-40 flex items-center gap-3 rounded-lg border border-border bg-card/90 px-4 py-2 backdrop-blur-sm">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      <div>
        <p className="text-sm font-medium">Computing layout</p>
        <p className="text-xs text-muted-foreground">{Math.round((1 - alpha) * 100)}% complete</p>
      </div>
    </div>
  )
}
