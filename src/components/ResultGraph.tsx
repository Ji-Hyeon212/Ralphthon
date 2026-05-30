import { useRef, useEffect, useState, useCallback } from "react";
import type { GraphNode, GraphEdge } from "../types";

interface ResultGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onNodeClick?: (node: GraphNode) => void;
}

interface PositionedNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const NODE_RADIUS = 28;
const CENTER_X = 300;
const CENTER_Y = 250;
const REPULSION = 8000;
const ATTRACTION = 0.005;
const DAMPING = 0.85;
const SPRING_LENGTH = 120;

const TYPE_COLORS: Record<string, string> = {
  value: "var(--primary)",
  strength: "var(--accent-teal)",
  experience: "var(--accent-amber)",
  emotion: "var(--warning)",
  blocker: "var(--error)",
  career: "var(--primary)",
  identity: "var(--ink)",
};

export default function ResultGraph({ nodes, edges, onNodeClick }: ResultGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [simulated, setSimulated] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Initialize positions
  const positioned = useRef<PositionedNode[]>(
    nodes.map((n, i) => ({
      ...n,
      x: CENTER_X + Math.cos((2 * Math.PI * i) / nodes.length) * 140,
      y: CENTER_Y + Math.sin((2 * Math.PI * i) / nodes.length) * 140,
      vx: 0,
      vy: 0,
    }))
  );

  // Run simple force simulation on mount
  useEffect(() => {
    const pNodes = positioned.current;
    const steps = 80;

    for (let s = 0; s < steps; s++) {
      // Repulsion between all pairs
      for (let i = 0; i < pNodes.length; i++) {
        for (let j = i + 1; j < pNodes.length; j++) {
          const dx = pNodes[j].x - pNodes[i].x;
          const dy = pNodes[j].y - pNodes[i].y;
          const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
          const force = REPULSION / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          pNodes[i].vx -= fx;
          pNodes[i].vy -= fy;
          pNodes[j].vx += fx;
          pNodes[j].vy += fy;
        }
      }

      // Edge attraction
      for (const edge of edges) {
        const source = pNodes.find((n) => n.id === edge.source);
        const target = pNodes.find((n) => n.id === edge.target);
        if (!source || !target) continue;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1) continue;

        const displacement = dist - SPRING_LENGTH;
        const force = displacement * ATTRACTION;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        source.vx += fx;
        source.vy += fy;
        target.vx -= fx;
        target.vy -= fy;
      }

      // Center gravity
      for (const node of pNodes) {
        node.vx += (CENTER_X - node.x) * 0.002 * (1 - node.weight * 0.3);
        node.vy += (CENTER_Y - node.y) * 0.002 * (1 - node.weight * 0.3);
      }

      // Apply velocity and damping
      for (const node of pNodes) {
        node.vx *= DAMPING;
        node.vy *= DAMPING;
        node.x += node.vx;
        node.y += node.vy;

        // Clamp to bounds
        node.x = Math.max(50, Math.min(550, node.x));
        node.y = Math.max(50, Math.min(450, node.y));
      }
    }

    setSimulated(true);
  }, [nodes, edges]);

  const handleNodeClick = useCallback(
    (node: PositionedNode) => {
      setSelectedId(node.id === selectedId ? null : node.id);
      onNodeClick?.(node);
    },
    [onNodeClick, selectedId]
  );

  if (!simulated) return null;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 500"
      className="result-graph-svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Edges */}
      {edges.map((edge) => {
        const source = positioned.current.find((n) => n.id === edge.source);
        const target = positioned.current.find((n) => n.id === edge.target);
        if (!source || !target) return null;

        return (
          <g key={edge.id} className="graph-edge">
            <line
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="var(--hairline)"
              strokeWidth={1 + edge.weight * 2}
              opacity={0.4 + edge.weight * 0.3}
            />
            <text
              x={(source.x + target.x) / 2}
              y={(source.y + target.y) / 2 - 6}
              textAnchor="middle"
              fontSize="9"
              fill="var(--muted)"
            >
              {edge.label}
            </text>
          </g>
        );
      })}

      {/* Nodes */}
      {positioned.current.map((node) => {
        const isSelected = node.id === selectedId;
        const color = TYPE_COLORS[node.type] || "var(--primary)";
        const r = NODE_RADIUS * (0.6 + node.weight * 0.6);

        return (
          <g
            key={node.id}
            className={`graph-node ${isSelected ? "selected" : ""}`}
            onClick={() => handleNodeClick(node)}
            style={{ cursor: "pointer" }}
          >
            {/* Glow for selected */}
            {isSelected && (
              <circle
                cx={node.x}
                cy={node.y}
                r={r + 8}
                fill="none"
                stroke={color}
                strokeWidth={2}
                opacity={0.4}
              >
                <animate
                  attributeName="r"
                  values={`${r + 4};${r + 10};${r + 4}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle
              cx={node.x}
              cy={node.y}
              r={r}
              fill={color}
              opacity={isSelected ? 1 : 0.85}
              stroke={isSelected ? "var(--ink)" : "none"}
              strokeWidth={2}
            />
            {/* Weight indicator ring */}
            {node.weight > 0.7 && (
              <circle
                cx={node.x}
                cy={node.y}
                r={r + 3}
                fill="none"
                stroke={color}
                strokeWidth={1}
                opacity={0.3}
              />
            )}
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--on-primary)"
              fontSize={node.label.length > 5 ? "8" : "9"}
              fontWeight={600}
            >
              {node.label.slice(0, 6)}
            </text>
            <text
              x={node.x}
              y={node.y + r + 12}
              textAnchor="middle"
              fontSize="9"
              fill="var(--muted)"
            >
              {typeLabelKorean(node.type)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function typeLabelKorean(type: string): string {
  const labels: Record<string, string> = {
    value: "가치",
    strength: "강점",
    experience: "경험",
    emotion: "감정",
    blocker: "제약",
    career: "커리어",
    identity: "정체성",
  };
  return labels[type] || type;
}
