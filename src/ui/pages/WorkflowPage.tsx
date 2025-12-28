import * as React from "react";
import { Navbar } from "../components/layout/Navbar";
import { FlowCanvas } from "../flow/FlowCanvas";
import "../styles/workflow.css";
import { RightSlideBar } from "../components/RightSlideBar";
import { SelectionDetails, type LastClicked } from "../components/SelectionDetails";

export default function WorkflowPage() {
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [lastClicked, setLastClicked] = React.useState<LastClicked>({ kind: "none" });

  return (
    <div className="wf-shell">
      <Navbar
        panelOpen={panelOpen}
        onTogglePanel={() => setPanelOpen((v) => !v)}
      />

      <RightSlideBar open={panelOpen} onClose={() => setPanelOpen(false)} title="Details">
        <SelectionDetails lastClicked={lastClicked} />
      </RightSlideBar>

      <div className="wf-body">
        <FlowCanvas
          onCanvasClick={() => setLastClicked({ kind: "canvas" })}
          onNodeClick={(nodeId, nodeLabel) => {
            setLastClicked({ kind: "node", nodeId, nodeLabel });
            setPanelOpen(true); // common n8n behavior: open panel when a node is selected
          }}
        />
      </div>
    </div>
  );
}
