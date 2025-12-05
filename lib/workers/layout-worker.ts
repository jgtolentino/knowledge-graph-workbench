// D3-Force layout worker for off-main-thread computation
import type { GraphNode, GraphEdge, PositionedNode, LayoutMessage, LayoutResult } from "@/lib/types/graph"
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceZ,
  type Simulation,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from "d3-force-3d"

interface SimNode extends SimulationNodeDatum {
  id: string
  type: string
  label: string
  importance?: number
  x?: number
  y?: number
  z?: number
  vx?: number
  vy?: number
  vz?: number
}

interface SimLink extends SimulationLinkDatum<SimNode> {
  source: string | SimNode
  target: string | SimNode
}

let simulation: Simulation<SimNode, SimLink> | null = null
let nodes: SimNode[] = []

function initSimulation(graphNodes: GraphNode[], graphEdges: GraphEdge[]) {
  // Convert nodes to simulation format with initial positions
  nodes = graphNodes.map((n) => ({
    ...n,
    x: (Math.random() - 0.5) * 200,
    y: (Math.random() - 0.5) * 200,
    z: (n.importance || 0.5) * 100 - 50, // Z based on importance
  }))

  // Convert edges to link format
  const links: SimLink[] = graphEdges.map((e) => ({
    source: e.from,
    target: e.to,
  }))

  // Create 3D force simulation
  simulation = forceSimulation<SimNode, SimLink>(nodes)
    .numDimensions(3)
    .force(
      "link",
      forceLink<SimNode, SimLink>(links)
        .id((d) => d.id)
        .distance(60)
        .strength(0.3),
    )
    .force("charge", forceManyBody<SimNode>().strength(-120).distanceMax(300))
    .force("center", forceCenter<SimNode>(0, 0, 0))
    .force("collide", forceCollide<SimNode>(15))
    .force(
      "z",
      forceZ<SimNode>()
        .z((d) => ((d.importance || 0.5) - 0.5) * 100)
        .strength(0.1),
    )
    .alphaDecay(0.02)
    .velocityDecay(0.3)
    .on("tick", () => {
      const result: LayoutResult = {
        type: "positions",
        nodes: nodes.map((n) => ({
          id: n.id,
          type: n.type as PositionedNode["type"],
          label: n.label,
          importance: n.importance,
          x: n.x || 0,
          y: n.y || 0,
          z: n.z || 0,
          vx: n.vx,
          vy: n.vy,
          vz: n.vz,
        })),
        alpha: simulation?.alpha(),
      }
      self.postMessage(result)
    })
    .on("end", () => {
      self.postMessage({ type: "done", nodes })
    })
}

self.onmessage = (event: MessageEvent<LayoutMessage>) => {
  const { type, nodes: graphNodes, edges } = event.data

  switch (type) {
    case "init":
      if (graphNodes && edges) {
        initSimulation(graphNodes, edges)
      }
      break
    case "update":
      if (simulation && graphNodes) {
        // Update node positions for focused view
        simulation.alpha(0.3).restart()
      }
      break
    case "stop":
      if (simulation) {
        simulation.stop()
      }
      break
  }
}
