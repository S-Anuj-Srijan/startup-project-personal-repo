import type { Node } from "reactflow";
import type { NodeCardData } from "../flow/NodeCard";
import type { NodeDefinition, NodeParam } from "./AvailableNodeTypesPanel";

export type LastClicked =
  | { kind: "none" }
  | { kind: "canvas" }
  | { kind: "node"; nodeId: string; nodeLabel?: string }
  | { kind: "deploy" };

type Props = {
  lastClicked: LastClicked;

  selectedNode?: Node<NodeCardData> | null;
  selectedDef?: NodeDefinition | null;

  onUpdateNodeParams?: (nodeId: string, nextParams: Record<string, any>) => void;
};

function Field({
  p,
  value,
  onChange,
}: {
  p: NodeParam;
  value: any;
  onChange: (v: any) => void;
}) {
  const label = (
    <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>
      {p.label} {p.required ? <span style={{ color: "#b00020" }}>*</span> : null}
    </div>
  );

  if (p.type === "textarea") {
    return (
      <div>
        {label}
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          style={{ width: "100%", border: "1px solid #e5e5e5", borderRadius: 10, padding: 10 }}
        />
      </div>
    );
  }

  if (p.type === "password") {
    return (
      <div>
        {label}
        <input
          type="password"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "100%", border: "1px solid #e5e5e5", borderRadius: 10, padding: 10 }}
        />
      </div>
    );
  }

  if (p.type === "number") {
    return (
      <div>
        {label}
        <input
          type="number"
          value={value ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ width: "100%", border: "1px solid #e5e5e5", borderRadius: 10, padding: 10 }}
        />
      </div>
    );
  }

  if (p.type === "file") {
    return (
      <div>
        {label}
        <input
          type="file"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;

            // Electron usually provides file.path
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const anyF: any = f;
            const filePath = anyF.path ?? f.name;

            onChange({ name: f.name, path: filePath });
          }}
          style={{ width: "100%" }}
        />

        {value?.name ? (
          <div style={{ marginTop: 6, fontSize: 12, color: "#444" }}>
            Selected: <span style={{ fontWeight: 700 }}>{value.name}</span>
            {value.path ? <div style={{ color: "#666" }}>{value.path}</div> : null}
          </div>
        ) : (
          <div style={{ marginTop: 6, fontSize: 12, color: "#999" }}>No file selected.</div>
        )}
      </div>
    );
  }

  // string
  return (
    <div>
      {label}
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", border: "1px solid #e5e5e5", borderRadius: 10, padding: 10 }}
      />
    </div>
  );
}

export function SelectionDetails({
  lastClicked,
  selectedNode,
  selectedDef,
  onUpdateNodeParams,
}: Props) {
  if (lastClicked.kind === "none") {
    return (
      <div>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Nothing selected</div>
        <div style={{ color: "#666", fontSize: 13 }}>Click a node to view details.</div>
      </div>
    );
  }

  if (lastClicked.kind === "canvas") {
    return (
      <div>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Canvas</div>
        <div style={{ color: "#666", fontSize: 13 }}>You clicked the workspace background.</div>
      </div>
    );
  }

  if (lastClicked.kind === "deploy") {
    return (
      <div>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Deploy</div>
        <div style={{ color: "#666", fontSize: 13 }}>
          You last clicked Deploy. You can show logs, status, or output here.
        </div>
      </div>
    );
  }

  // node selected
  const node = selectedNode ?? null;
  const def = selectedDef ?? null;

  if (!node || !def) {
    return (
      <div>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Node Selected</div>
        <div style={{ color: "#666", fontSize: 13 }}>Definition not loaded yet.</div>
      </div>
    );
  }

  const params = node.data.params ?? {};

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div>
        <div style={{ fontWeight: 800 }}>{node.data.label}</div>
        <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>
          Type: <span style={{ fontWeight: 700 }}>{node.data.nodeTypeId}</span>
        </div>
        {node.data.description ? (
          <div style={{ color: "#666", fontSize: 13, marginTop: 6 }}>{node.data.description}</div>
        ) : null}
      </div>

      <div style={{ borderTop: "1px solid #eee", paddingTop: 12, display: "grid", gap: 12 }}>
        <div style={{ fontWeight: 700 }}>Node Parameters</div>

        {(def.params ?? []).length === 0 ? (
          <div style={{ color: "#999", fontSize: 13 }}>No parameters for this node.</div>
        ) : (
          (def.params ?? []).map((p: NodeParam) => (
            <Field
              key={p.id}
              p={p}
              value={params[p.id]}
              onChange={(v) => {
                const next = { ...params, [p.id]: v };
                onUpdateNodeParams?.(node.id, next);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
