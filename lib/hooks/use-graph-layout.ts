"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import type { GraphData, PositionedNode, LayoutResult } from "@/lib/types/graph"

export function useGraphLayout(data: GraphData) {
  const workerRef = useRef<Worker | null>(null)
  const [positions, setPositions] = useState<Map<string, PositionedNode>>(new Map())
  const [isLayouting, setIsLayouting] = useState(true)
  const [alpha, setAlpha] = useState(1)

  useEffect(() => {
    // Create worker
    workerRef.current = new Worker(new URL("../workers/layout-worker.ts", import.meta.url), {
      type: "module",
    })

    workerRef.current.onmessage = (event: MessageEvent<LayoutResult>) => {
      const { type, nodes, alpha: newAlpha } = event.data

      if (type === "positions") {
        const newPositions = new Map<string, PositionedNode>()
        nodes.forEach((node) => {
          newPositions.set(node.id, node)
        })
        setPositions(newPositions)
        if (newAlpha !== undefined) {
          setAlpha(newAlpha)
        }
      }

      if (type === "done") {
        setIsLayouting(false)
      }
    }

    // Initialize simulation
    workerRef.current.postMessage({
      type: "init",
      nodes: data.nodes,
      edges: data.edges,
    })

    return () => {
      workerRef.current?.postMessage({ type: "stop" })
      workerRef.current?.terminate()
    }
  }, [data])

  const reheat = useCallback(() => {
    setIsLayouting(true)
    workerRef.current?.postMessage({ type: "update" })
  }, [])

  return { positions, isLayouting, alpha, reheat }
}
