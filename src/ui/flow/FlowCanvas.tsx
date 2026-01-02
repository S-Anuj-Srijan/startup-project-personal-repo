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
  type ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";

import { nodeTypes } from "./nodeTypes";
import type { NodeCardData } from "./NodeCard";
import type { NodeTypeItem } from "../components/AvailableNodeTypesPanel";

type Props = {
  nodes: Node<NodeCardData>[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node<NodeCardData>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onCanvasClick?: () => void;
  onNodeClick?: (nodeId: string, nodeLabel?: string) => void;
};

const DND_MIME = "application/plai-node";

function makeId(prefix = "node") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyCrypto: any = globalThis.crypto;
  const uid =
    anyCrypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${uid}`;
}

export function FlowCanvas({
  nodes,
  edges,
  setNodes,
  setEdges,
  onCanvasClick,
  onNodeClick,
}: Props) {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const [rfInstance, setRfInstance] = React.useState<ReactFlowInstance | null>(null);

  const onNodesChange: OnNodesChange = React.useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = React.useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect: OnConnect = React.useCallback(
    (connection: Connection) => {
      if (connection.source === connection.target) return;
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
    },
    [setEdges]
  );

  const onDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!rfInstance || !wrapperRef.current) return;

      const raw = e.dataTransfer.getData(DND_MIME);
      if (!raw) return;

      let item: NodeTypeItem;
      try {
        item = JSON.parse(raw);
      } catch {
        return;
      }

      const bounds = wrapperRef.current.getBoundingClientRect();
      const position = rfInstance.project({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });

      const newNode: Node<NodeCardData> = {
        id: makeId("node"),
        type: "nodeCard",
        position,
        data: {
          label: item.label,
          type: item.type,
          description: item.description,
          inputs: [],
          outputs: [],
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [rfInstance, setNodes]
  );

  const deleteNodeAndEdges = React.useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    },
    [setNodes, setEdges]
  );

  return (
    <div ref={wrapperRef} style={{ height: "100%", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onInit={setRfInstance}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={() => onCanvasClick?.()}
        onNodeClick={(_, node) => onNodeClick?.(node.id, (node.data as NodeCardData)?.label)}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        deleteKeyCode={["Backspace", "Delete"]}
        onEdgeContextMenu={(event, edge) => {
          event.preventDefault();
          setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }}
        onNodeContextMenu={(event, node) => {
          event.preventDefault();
          deleteNodeAndEdges(node.id);
        }}
        onNodesDelete={(deleted) => {
          const deletedIds = new Set(deleted.map((n) => n.id));
          setEdges((eds) =>
            eds.filter((e) => !deletedIds.has(e.source) && !deletedIds.has(e.target))
          );
        }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
