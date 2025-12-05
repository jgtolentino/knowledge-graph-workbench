"use client"

import { Suspense, useMemo, useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Stars, PerspectiveCamera } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import gsap from "gsap"
import type { GraphData, PositionedNode } from "@/lib/types/graph"
import { useGraphLayout } from "@/lib/hooks/use-graph-layout"
import { useGraphStore } from "@/lib/hooks/use-graph-store"
import { GraphNode } from "./graph-node"
import { GraphEdge } from "./graph-edge"

interface BrainGraphCanvasProps {
  data: GraphData
}

function GraphScene({ data }: BrainGraphCanvasProps) {
  const { positions, isLayouting, alpha } = useGraphLayout(data)
  const {
    selectedNodeId,
    hoveredNodeId,
    setSelectedNode,
    setHoveredNode,
    visibleTypes,
    focusNodeId,
    zoomLevel,
    setZoomLevel,
  } = useGraphStore()

  const { camera, gl } = useThree()
  const controlsRef = useRef<any>(null)

  // Filter visible nodes
  const visibleNodes = useMemo(() => {
    const nodes: PositionedNode[] = []
    positions.forEach((node) => {
      if (visibleTypes.has(node.type)) {
        nodes.push(node)
      }
    })
    return nodes
  }, [positions, visibleTypes])

  // Get neighbor IDs for highlighting
  const neighborIds = useMemo(() => {
    const neighbors = new Set<string>()
    const activeId = hoveredNodeId || selectedNodeId
    if (activeId) {
      data.edges.forEach((edge) => {
        if (edge.from === activeId) neighbors.add(edge.to)
        if (edge.to === activeId) neighbors.add(edge.from)
      })
    }
    return neighbors
  }, [data.edges, hoveredNodeId, selectedNodeId])

  // Filter visible edges
  const visibleEdges = useMemo(() => {
    return data.edges.filter((edge) => {
      const sourceNode = positions.get(edge.from)
      const targetNode = positions.get(edge.to)
      return sourceNode && targetNode && visibleTypes.has(sourceNode.type) && visibleTypes.has(targetNode.type)
    })
  }, [data.edges, positions, visibleTypes])

  // Camera animation to focus node
  useEffect(() => {
    if (focusNodeId && controlsRef.current) {
      const node = positions.get(focusNodeId)
      if (node) {
        gsap.to(controlsRef.current.target, {
          x: node.x,
          y: node.y,
          z: node.z,
          duration: 1.2,
          ease: "power2.inOut",
        })
        gsap.to(camera.position, {
          x: node.x + 50,
          y: node.y + 30,
          z: node.z + 50,
          duration: 1.2,
          ease: "power2.inOut",
        })
      }
    }
  }, [focusNodeId, positions, camera])

  // Track zoom level for LOD
  useFrame(() => {
    const distance = camera.position.length()
    const newZoomLevel = Math.max(0, Math.min(1, 1 - distance / 500))
    if (Math.abs(newZoomLevel - zoomLevel) > 0.01) {
      setZoomLevel(newZoomLevel)
    }
  })

  // Subtle breathing animation
  useFrame((state) => {
    if (controlsRef.current && !focusNodeId) {
      const t = state.clock.elapsedTime * 0.1
      controlsRef.current.target.y = Math.sin(t) * 2
    }
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[150, 100, 150]} fov={60} />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        minDistance={30}
        maxDistance={400}
        enablePan
      />

      {/* Ambient light */}
      <ambientLight intensity={0.3} />

      {/* Point lights for dramatic effect */}
      <pointLight position={[100, 100, 100]} intensity={0.8} color="#3ecfcf" />
      <pointLight position={[-100, -100, -100]} intensity={0.5} color="#cf6ecf" />

      {/* Stars background */}
      <Stars radius={300} depth={100} count={3000} factor={4} saturation={0} fade speed={0.5} />

      {/* Edges */}
      {visibleEdges.map((edge) => {
        const source = positions.get(edge.from)
        const target = positions.get(edge.to)
        if (!source || !target) return null

        const activeId = hoveredNodeId || selectedNodeId
        const isHighlighted =
          activeId &&
          (edge.from === activeId || edge.to === activeId || neighborIds.has(edge.from) || neighborIds.has(edge.to))

        return (
          <GraphEdge
            key={edge.id}
            source={source}
            target={target}
            isHighlighted={!!isHighlighted}
            opacity={isHighlighted ? 0.8 : 0.15}
          />
        )
      })}

      {/* Nodes */}
      {visibleNodes.map((node) => (
        <GraphNode
          key={node.id}
          node={node}
          isHovered={hoveredNodeId === node.id}
          isSelected={selectedNodeId === node.id}
          isNeighbor={neighborIds.has(node.id)}
          zoomLevel={zoomLevel}
          onClick={() => setSelectedNode(selectedNodeId === node.id ? null : node.id)}
          onHover={(hovered) => setHoveredNode(hovered ? node.id : null)}
        />
      ))}

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={0.5} />
      </EffectComposer>
    </>
  )
}

export function BrainGraphCanvas({ data }: BrainGraphCanvasProps) {
  return (
    <div className="h-full w-full bg-background">
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <GraphScene data={data} />
        </Suspense>
      </Canvas>
    </div>
  )
}
