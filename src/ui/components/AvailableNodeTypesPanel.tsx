import * as React from "react";

export type NodePort = { id: string; name: string };

export type NodeParam =
  | {
      id: string;
      label: string;
      type: "string" | "number" | "textarea" | "password";
      default?: any;
      required?: boolean;
    }
  | {
      id: string;
      label: string;
      type: "file";
      required?: boolean;
    };

export type NodeDefinition = {
  id: string;
  label: string;
  description?: string;
  inputs: NodePort[];
  outputs: NodePort[];
  params?: NodeParam[];
  script?: string;
};

type Props = {
  available: NodeDefinition[];
};

const DND_MIME = "application/plai-node-type";

export function AvailableNodeTypesPanel({ available }: Props) {
  const onDragStart = (e: React.DragEvent, def: NodeDefinition) => {
    e.dataTransfer.setData(DND_MIME, def.id);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div>
        <div style={{ fontWeight: 700 }}>Addable node types</div>
        <div style={{ color: "#666", fontSize: 13, marginTop: 4 }}>
          Drag a node type into the canvas to create a new node.
        </div>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {available.map((n) => (
          <div
            key={n.id}
            draggable
            onDragStart={(e) => onDragStart(e, n)}
            style={{
              border: "1px solid #eee",
              borderRadius: 10,
              padding: 12,
              display: "grid",
              gap: 6,
              cursor: "grab",
              background: "white",
            }}
            title="Drag into canvas"
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div style={{ fontWeight: 700 }}>{n.label}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{n.id}</div>
            </div>

            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.35 }}>
              {n.description ?? "—"}
            </div>

            <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#999" }}>
              <span>In: {n.inputs?.length ?? 0}</span>
              <span>Out: {n.outputs?.length ?? 0}</span>
              <span>Params: {(n.params ?? []).length}</span>
            </div>

            <div style={{ fontSize: 12, color: "#999" }}>Drag to canvas</div>
          </div>
        ))}
      </div>
    </div>
  );
}
