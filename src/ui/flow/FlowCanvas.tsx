import * as React from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "reactflow";
import "reactflow/dist/style.css";

import { nodeTypes } from "./nodeTypes";
import type { NodeCardData } from "./NodeCard";

type Props = {
  onCanvasClick?: () => void;
  onNodeClick?: (nodeId: string, nodeLabel?: string) => void;
};

const initialNodes: Node<NodeCardData>[] = [
  {
    id: "node-1",
    type: "nodeCard",
    position: { x: 120, y: 120 },
    data: { label: "YOLO Detect", type: "vision" },
  },
  {
    id: "node-2",
    type: "nodeCard",
    position: { x: 460, y: 220 },
    data: { label: "LLM Prompt", type: "llm" },
  },
];

const initialEdges: Edge[] = [
  { id: "e-1-2", source: "node-1", target: "node-2", animated: true },
];

export function FlowCanvas({ onCanvasClick, onNodeClick }: Props) {
  const [nodes, setNodes] = React.useState<Node<NodeCardData>[]>(initialNodes);
  const [edges, setEdges] = React.useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = React.useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = React.useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = React.useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        onPaneClick={() => onCanvasClick?.()}
        onNodeClick={(_, node) => onNodeClick?.(node.id, (node.data as NodeCardData)?.label)}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
