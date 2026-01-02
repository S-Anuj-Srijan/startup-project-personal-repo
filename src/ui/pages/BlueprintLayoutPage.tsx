import * as React from "react";
import ReactFlow, { Background, Controls, MiniMap, type Node, type Edge } from "reactflow";
import "reactflow/dist/style.css";

import { Button } from "../components/Button";

type Props = {
  onBackToWorkflow: () => void;
};

type MarkerData = { label: string };

function RobotMarkerNode({ data }: { data: MarkerData }) {
  return (
    <div
      style={{
        padding: "8px 10px",
        borderRadius: 10,
        border: "1px solid #111",
        background: "white",
        fontSize: 12,
        fontWeight: 700,
        boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
        minWidth: 110,
        textAlign: "center",
      }}
    >
      {data.label}
    </div>
  );
}

const nodeTypes = { robotMarker: RobotMarkerNode };

export default function BlueprintLayoutPage({ onBackToWorkflow }: Props) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [blueprintPath, setBlueprintPath] = React.useState<string | null>(null);

  // Example “robot layout” nodes (hardcoded for now)
  const [nodes, setNodes] = React.useState<Node<MarkerData>[]>([
    { id: "r1", type: "robotMarker", position: { x: 120, y: 120 }, data: { label: "Robot A" } },
    { id: "r2", type: "robotMarker", position: { x: 380, y: 210 }, data: { label: "Robot B" } },
    { id: "r3", type: "robotMarker", position: { x: 620, y: 140 }, data: { label: "Robot C" } },
  ]);

  const [edges] = React.useState<Edge[]>([]);

  const blueprintUrl = blueprintPath ? `file://${blueprintPath}` : null;

  return (
    <div style={{ height: "100vh", width: "100vw", background: "#fafafa", overflow: "hidden" }}>
      {/* Simple top bar for this page */}
      <div
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          borderBottom: "1px solid #e5e5e5",
          background: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontWeight: 800 }}>AI Layout</div>

          <button
            onClick={onBackToWorkflow}
            style={{
              border: "1px solid #e5e5e5",
              background: "white",
              borderRadius: 10,
              padding: "6px 10px",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            Back to Workflow
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="file"
            accept=".dwg,.dxf,.pdf,.tif,.tiff,.ai"
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
          />

          <Button
            variant="primary"
            action={{
              kind: "python",
              scriptPath: "scripts/ai_run.py",
              args: [],
              onSuccess: (out) => {
                const firstLine = out?.[0]?.trim();
                if (!firstLine) {
                  alert("AI script returned no output path.");
                  return;
                }
                setBlueprintPath(firstLine);
                alert("AI run complete (stub). Blueprint loaded.");
              },
              onError: (err) => alert("AI run failed: " + err),
            }}
          >
            Enter
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ height: "calc(100vh - 56px)", width: "100%", position: "relative" }}>
        {/* Blueprint background */}
        {blueprintUrl ? (
          <img
            src={blueprintUrl}
            alt="Blueprint"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              background: "#f5f5f5",
              zIndex: 0,
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
              fontSize: 14,
              zIndex: 0,
            }}
          >
            Select a file and click Enter to load the placeholder blueprint.
          </div>
        )}

        {/* ReactFlow overlay (transparent background) */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={(changes) => {
              // Minimal inline applyNodeChanges to avoid importing more if you want.
              // If you prefer, I will refactor this to match your FlowCanvas style.
              setNodes((prev) => {
                const next = [...prev];
                for (const c of changes) {
                  if (c.type === "position" && c.id) {
                    const idx = next.findIndex((n) => n.id === c.id);
                    if (idx >= 0 && c.position) next[idx] = { ...next[idx], position: c.position };
                  }
                  if (c.type === "remove" && c.id) {
                    const idx = next.findIndex((n) => n.id === c.id);
                    if (idx >= 0) next.splice(idx, 1);
                  }
                }
                return next;
              });
            }}
            fitView
            style={{ background: "transparent" }}
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>

      {/* Optional: show selected file info */}
      <div style={{ position: "fixed", bottom: 10, left: 10, fontSize: 12, color: "#666" }}>
        Selected: {selectedFile ? selectedFile.name : "None"}
      </div>
    </div>
  );
}
