import * as React from "react";

export type NodeTypeItem = {
  type: string;      // domain type: "vision" | "llm" | ...
  label: string;     // display label: "YOLO Detect"
  description: string;
};

type Props = {
  available: NodeTypeItem[];
};

const DND_MIME = "application/plai-node";

export function AvailableNodeTypesPanel({ available }: Props) {
  const onDragStart = (e: React.DragEvent, item: NodeTypeItem) => {
    e.dataTransfer.setData(DND_MIME, JSON.stringify(item));
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
            key={n.type + n.label}
            draggable
            onDragStart={(e) => onDragStart(e, n)}
            style={{
              border: "1px solid #eee",
              borderRadius: 10,
              padding: 12,
              display: "grid",
              gap: 4,
              cursor: "grab",
              background: "white",
            }}
            title="Drag into canvas"
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div style={{ fontWeight: 700 }}>{n.label}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{n.type}</div>
            </div>

            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.35 }}>
              {n.description}
            </div>

            <div style={{ marginTop: 6, fontSize: 12, color: "#999" }}>
              Drag to canvas
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
