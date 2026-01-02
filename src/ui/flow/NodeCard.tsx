import { Handle, Position, type NodeProps } from "reactflow";

export type NodeCardData = {
  label: string;
  type: string; // ✅ IMPORTANT: WorkflowPage expects this
  description?: string;
  inputs?: string[];
  outputs?: string[];
};

export function NodeCard({ data, selected }: NodeProps<NodeCardData>) {
  const inCount = (data.inputs ?? []).length;
  const outCount = (data.outputs ?? []).length;

  return (
    <div
      style={{
        minWidth: 220,
        borderRadius: 12,
        border: selected ? "2px solid #111" : "1px solid #e6e6e6",
        background: "white",
        boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          border: "1px solid #111",
          background: "white",
        }}
      />

      <div style={{ padding: 12, borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>{data.label}</div>
          <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{data.type}</div>
        </div>

        {data.description ? (
          <div style={{ fontSize: 12, color: "#666", marginTop: 6, lineHeight: 1.35 }}>
            {data.description}
          </div>
        ) : null}
      </div>

      <div
        style={{
          padding: 12,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          color: "#666",
        }}
      >
        <span>In: {inCount}</span>
        <span>Out: {outCount}</span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          border: "1px solid #111",
          background: "white",
        }}
      />
    </div>
  );
}
