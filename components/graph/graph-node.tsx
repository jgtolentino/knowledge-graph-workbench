"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import type { Mesh } from "three"
import type { PositionedNode } from "@/lib/types/graph"
import { NODE_COLORS } from "@/lib/types/graph"

interface GraphNodeProps {
  node: PositionedNode
  isHovered: boolean
  isSelected: boolean
  isNeighbor: boolean
  zoomLevel: number
  onClick: () => void
  onHover: (hovered: boolean) => void
}

export function GraphNode({ node, isHovered, isSelected, isNeighbor, zoomLevel, onClick, onHover }: GraphNodeProps) {
  const meshRef = useRef<Mesh>(null)
  const [hoverScale, setHoverScale] = useState(1)

  const color = NODE_COLORS[node.type]
  const baseSize = 2 + (node.importance || 0.5) * 2
  const size = baseSize * (isHovered || isSelected ? 1.3 : isNeighbor ? 1.1 : 1)

  // Pulsing animation for selected/hovered nodes
  useFrame((state) => {
    if (meshRef.current) {
      if (isSelected || isHovered) {
        const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 1
        meshRef.current.scale.setScalar(size * pulse * hoverScale)
      } else {
        meshRef.current.scale.setScalar(size * hoverScale)
      }
    }
  })

  // Determine visibility based on LOD
  const showLabel = zoomLevel > 0.5 || isHovered || isSelected
  const showDetails = zoomLevel > 0.8 || isSelected

  // Opacity based on state
  const opacity = isSelected || isHovered ? 1 : isNeighbor ? 0.9 : 0.7

  return (
    <group position={[node.x, node.y, node.z]}>
      {/* Glow effect */}
      {(isSelected || isHovered) && (
        <mesh>
          <sphereGeometry args={[size * 1.5, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} />
        </mesh>
      )}

      {/* Main node sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHoverScale(1.1)
          onHover(true)
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => {
          setHoverScale(1)
          onHover(false)
          document.body.style.cursor = "auto"
        }}
      >
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected || isHovered ? 0.5 : 0.2}
          transparent
          opacity={opacity}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Label */}
      {showLabel && (
        <Html
          position={[0, size + 2, 0]}
          center
          style={{
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div
            className={`
              whitespace-nowrap rounded px-2 py-1 text-xs font-medium
              transition-opacity duration-200
              ${isSelected || isHovered ? "bg-card/90 text-foreground" : "bg-card/60 text-muted-foreground"}
            `}
          >
            {node.label}
            {showDetails && node.status && (
              <span
                className={`ml-2 inline-block h-2 w-2 rounded-full ${
                  node.status === "healthy"
                    ? "bg-green-500"
                    : node.status === "warning"
                      ? "bg-yellow-500"
                      : node.status === "error"
                        ? "bg-red-500"
                        : "bg-gray-500"
                }`}
              />
            )}
          </div>
        </Html>
      )}
    </group>
  )
}
