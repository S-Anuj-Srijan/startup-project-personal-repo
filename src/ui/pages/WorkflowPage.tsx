import * as React from "react";
import type { Node, Edge } from "reactflow";

import { Navbar } from "../components/layout/Navbar";
import { FlowCanvas } from "../flow/FlowCanvas";
import "../styles/workflow.css";
import { RightSlideBar } from "../components/RightSlideBar";

import { SelectionDetails, type LastClicked } from "../components/SelectionDetails";
import { ProjectNodeTypesPanel } from "../components/ProjectNodeTypesPanel";
import { AvailableNodeTypesPanel, type NodeTypeItem } from "../components/AvailableNodeTypesPanel";
import type { NodeCardData } from "../flow/NodeCard";

/* ✅ REQUIRED: Props */
type Props = {
  onGoToAiLayout: () => void;
};

type SidebarView = "details" | "projectTypes" | "addTypes";

const initialNodes: Node<NodeCardData>[] = [
  {
    id: "node-1",
    type: "nodeCard",
    position: { x: 120, y: 120 },
    data: { label: "YOLO Detect", type: "vision", description: "Detect objects from image/video input.", inputs: [], outputs: [] },
  },
  {
    id: "node-2",
    type: "nodeCard",
    position: { x: 460, y: 220 },
    data: { label: "LLM Prompt", type: "llm", description: "Turn detections into structured JSON.", inputs: [], outputs: [] },
  },
];

const initialEdges: Edge[] = [{ id: "e-1-2", source: "node-1", target: "node-2", animated: true }];

export default function WorkflowPage({ onGoToAiLayout }: Props) {
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [lastClicked, setLastClicked] = React.useState<LastClicked>({ kind: "none" });
  const [sidebarView, setSidebarView] = React.useState<SidebarView>("details");

  const [nodes, setNodes] = React.useState<Node<NodeCardData>[]>(initialNodes);
  const [edges, setEdges] = React.useState<Edge[]>(initialEdges);

  const resetSelection = () => setLastClicked({ kind: "none" });

  const nodeTypesInProject = React.useMemo(() => {
    const set = new Set<string>();
    for (const n of nodes) set.add(n.data?.type ?? "unknown");
    return Array.from(set).sort();
  }, [nodes]);

  const addableNodeTypes: NodeTypeItem[] = [
    { type: "vision", label: "YOLO Detect", description: "Detect objects from image/video input." },
    { type: "llm", label: "LLM Prompt", description: "Transform inputs into structured output using an LLM." },
    { type: "http", label: "HTTP Request", description: "Call an API and pass the response downstream." },
    { type: "delay", label: "Delay", description: "Wait for a duration before continuing." },
    { type: "router", label: "Router", description: "Route output into multiple branches." },
    { type: "robot", label: "Robot Node", description: "Convert output JSON into robot instructions." },
  ];

  const sidebarTitle =
    sidebarView === "details"
      ? "Details"
      : sidebarView === "projectTypes"
      ? "Project Node Types"
      : "Add Node Types";

  return (
    <div className="wf-shell">
      {/* ✅ PASS onGoToAiLayout */}
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
        {sidebarView === "details" && <SelectionDetails lastClicked={lastClicked} />}

        {sidebarView === "projectTypes" && (
          <ProjectNodeTypesPanel nodeTypesInProject={nodeTypesInProject} />
        )}

        {sidebarView === "addTypes" && <AvailableNodeTypesPanel available={addableNodeTypes} />}
      </RightSlideBar>

      <div className="wf-body">
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          setEdges={setEdges}
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
