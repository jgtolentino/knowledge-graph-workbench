"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { PositionedNode } from "@/lib/types/graph"

interface GraphEdgeProps {
  source: PositionedNode
  target: PositionedNode
  isHighlighted: boolean
  opacity: number
}

export function GraphEdge({ source, target, isHighlighted, opacity }: GraphEdgeProps) {
  const lineRef = useRef<THREE.Line>(null)

  const points = useMemo(() => {
    return [new THREE.Vector3(source.x, source.y, source.z), new THREE.Vector3(target.x, target.y, target.z)]
  }, [source.x, source.y, source.z, target.x, target.y, target.z])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points)
    return geo
  }, [points])

  // Animate edge opacity
  useFrame(() => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial
      material.opacity = THREE.MathUtils.lerp(material.opacity, opacity, 0.1)
    }
  })

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color={isHighlighted ? "#3ecfcf" : "#4a5568"}
        transparent
        opacity={opacity}
        linewidth={isHighlighted ? 2 : 1}
      />
    </line>
  )
}
