import * as React from "react";
import type { Node, Edge } from "reactflow";

import { Navbar } from "../components/layout/Navbar";
import { FlowCanvas } from "../flow/FlowCanvas";
import "../styles/workflow.css";
import { RightSlideBar } from "../components/RightSlideBar";

import { SelectionDetails, type LastClicked } from "../components/SelectionDetails";
import { ProjectNodeTypesPanel } from "../components/ProjectNodeTypesPanel";
import { AvailableNodeTypesPanel, type NodeDefinition } from "../components/AvailableNodeTypesPanel";
import type { NodeCardData } from "../flow/NodeCard";

type Props = {
  onGoToAiLayout: () => void;
};

type SidebarView = "details" | "projectTypes" | "addTypes";

const initialNodes: Node<NodeCardData>[] = [];
const initialEdges: Edge[] = [];

export default function WorkflowPage({ onGoToAiLayout }: Props) {
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [lastClicked, setLastClicked] = React.useState<LastClicked>({ kind: "none" });
  const [sidebarView, setSidebarView] = React.useState<SidebarView>("details");

  const [nodes, setNodes] = React.useState<Node<NodeCardData>[]>(initialNodes);
  const [edges, setEdges] = React.useState<Edge[]>(initialEdges);

  const [nodeDefs, setNodeDefs] = React.useState<NodeDefinition[]>([]);
  const [nodeDefsById, setNodeDefsById] = React.useState<Record<string, NodeDefinition>>({});

  const resetSelection = () => setLastClicked({ kind: "none" });

  React.useEffect(() => {
    (async () => {
      if (!window.api?.listNodeDefs) {
        alert("Bridge missing: window.api.listNodeDefs not available.");
        return;
      }

      const res = await window.api.listNodeDefs();
      if (!res.success) {
        alert("Failed to load node definitions: " + (res.error ?? "unknown"));
        setNodeDefs([]);
        setNodeDefsById({});
        return;
      }

      const defs = (res.defs ?? []) as NodeDefinition[];
      setNodeDefs(defs);

      const map: Record<string, NodeDefinition> = {};
      for (const d of defs) map[d.id] = d;
      setNodeDefsById(map);
    })();
  }, []);

  const nodeTypesInProject = React.useMemo(() => {
    const set = new Set<string>();
    for (const n of nodes) set.add(n.data?.nodeTypeId ?? "unknown");
    return Array.from(set).sort();
  }, [nodes]);

  const sidebarTitle =
    sidebarView === "details"
      ? "Details"
      : sidebarView === "projectTypes"
      ? "Project Node Types"
      : "Add Node Types";

  const selectedNode =
    lastClicked.kind === "node"
      ? nodes.find((n) => n.id === lastClicked.nodeId) ?? null
      : null;

  const selectedDef = selectedNode ? nodeDefsById[selectedNode.data.nodeTypeId] ?? null : null;

  const updateNodeParams = (nodeId: string, nextParams: Record<string, any>) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== nodeId) return n;
        return { ...n, data: { ...n.data, params: nextParams } };
      })
    );
  };

  return (
    <div className="wf-shell">
      <Navbar
        panelOpen={panelOpen}
        onTogglePanel={() => setPanelOpen((v) => !v)}
        onGoToAiLayout={onGoToAiLayout}
      />

      <RightSlideBar
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        title={sidebarTitle}
        headerActions={
          <>
            <button
              onClick={() => {
                resetSelection();
                setSidebarView("projectTypes");
              }}
              style={{
                border: "1px solid #e5e5e5",
                background: "white",
                borderRadius: 8,
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Project Types
            </button>

            <button
              onClick={() => {
                resetSelection();
                setSidebarView("addTypes");
              }}
              style={{
                border: "1px solid #e5e5e5",
                background: "white",
                borderRadius: 8,
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Add Types
            </button>

            <button
              onClick={() => {
                resetSelection();
                setSidebarView("details");
              }}
              style={{
                border: "1px solid #e5e5e5",
                background: "white",
                borderRadius: 8,
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Reset
            </button>
          </>
        }
      >
        {sidebarView === "details" && (
          <SelectionDetails
            lastClicked={lastClicked}
            selectedNode={selectedNode}
            selectedDef={selectedDef}
            onUpdateNodeParams={updateNodeParams}
          />
        )}

        {sidebarView === "projectTypes" && (
          <ProjectNodeTypesPanel nodeTypesInProject={nodeTypesInProject} />
        )}

        {sidebarView === "addTypes" && <AvailableNodeTypesPanel available={nodeDefs} />}
      </RightSlideBar>

      <div className="wf-body">
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          setEdges={setEdges}
          nodeDefsById={nodeDefsById}
          onCanvasClick={() => {
            setLastClicked({ kind: "canvas" });
            setSidebarView("details");
          }}
          onNodeClick={(nodeId, nodeLabel) => {
            setLastClicked({ kind: "node", nodeId, nodeLabel });
            setSidebarView("details");
            setPanelOpen(true);
          }}
        />
      </div>
    </div>
  );
}
