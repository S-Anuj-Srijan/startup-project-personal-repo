
export type LastClicked =
  | { kind: "none" }
  | { kind: "canvas" }
  | { kind: "node"; nodeId: string; nodeLabel?: string }
  | { kind: "deploy" };

type Props = {
  lastClicked: LastClicked;
};

export function SelectionDetails({ lastClicked }: Props) {
  if (lastClicked.kind === "none") {
    return (
      <div>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Nothing selected</div>
        <div style={{ color: "#666", fontSize: 13 }}>
          Click a node to view details.
        </div>
      </div>
    );
  }

  if (lastClicked.kind === "canvas") {
    return (
      <div>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Canvas</div>
        <div style={{ color: "#666", fontSize: 13 }}>
          You clicked the workspace background.
        </div>
        <div style={{ marginTop: 10, fontSize: 13 }}>
          Suggested actions:
          <ul style={{ marginTop: 6 }}>
            <li>Add a node</li>
            <li>Paste/import a workflow</li>
            <li>Zoom and arrange</li>
          </ul>
        </div>
      </div>
    );
  }

  if (lastClicked.kind === "node") {
    return (
      <div>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Node Selected</div>
        <div style={{ fontSize: 13 }}>
          <div>
            <span style={{ color: "#666" }}>ID:</span>{" "}
            <span style={{ fontWeight: 600 }}>{lastClicked.nodeId}</span>
          </div>
          <div style={{ marginTop: 4 }}>
            <span style={{ color: "#666" }}>Label:</span>{" "}
            <span style={{ fontWeight: 600 }}>
              {lastClicked.nodeLabel ?? "—"}
            </span>
          </div>
        </div>

        <div style={{ marginTop: 12, borderTop: "1px solid #eee", paddingTop: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Parameters (placeholder)</div>
          <div style={{ color: "#666", fontSize: 13 }}>
            Later you will render node-specific forms here.
          </div>
        </div>
      </div>
    );
  }

  // lastClicked.kind === "deploy"
  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>Deploy</div>
      <div style={{ color: "#666", fontSize: 13 }}>
        You last clicked Deploy. You can show logs, status, or output here.
      </div>
    </div>
  );
}
