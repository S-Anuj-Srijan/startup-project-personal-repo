import { Handle, Position, type NodeProps } from "reactflow";

export type NodeCardData = {
  nodeTypeId: string;
  label: string;
  description?: string;

  inputs: { id: string; name: string }[];
  outputs: { id: string; name: string }[];

  params: Record<string, any>;
};

export function NodeCard({ data, selected }: NodeProps<NodeCardData>) {
  const inPorts = data.inputs ?? [];
  const outPorts = data.outputs ?? [];

  const rowH = 18;
  const topPad = 18;

  return (
    <div
      style={{
        minWidth: 250,
        borderRadius: 12,
        border: selected ? "2px solid #111" : "1px solid #e6e6e6",
        background: "white",
        boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
        position: "relative",
      }}
    >
      {/* INPUT HANDLES */}
      {inPorts.map((p, i) => (
        <Handle
          key={`in-${p.id}`}
          id={p.id}
          type="target"
          position={Position.Left}
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            border: "1px solid #111",
            background: "white",
            top: topPad + i * rowH,
          }}
        />
      ))}

      {/* OUTPUT HANDLES */}
      {outPorts.map((p, i) => (
        <Handle
          key={`out-${p.id}`}
          id={p.id}
          type="source"
          position={Position.Right}
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            border: "1px solid #111",
            background: "white",
            top: topPad + i * rowH,
          }}
        />
      ))}

      <div style={{ padding: 12, borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>{data.label}</div>
          <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{data.nodeTypeId}</div>
        </div>

        {data.description ? (
          <div style={{ fontSize: 12, color: "#666", marginTop: 6, lineHeight: 1.35 }}>
            {data.description}
          </div>
        ) : null}
      </div>

      <div style={{ padding: 12, display: "grid", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#666" }}>
          <span style={{ fontWeight: 700 }}>Inputs</span>
          <span>{inPorts.length}</span>
        </div>
        {inPorts.map((p) => (
          <div key={`inlabel-${p.id}`} style={{ fontSize: 12, color: "#444" }}>
            {p.name}
          </div>
        ))}

        <div style={{ marginTop: 4, display: "flex", justifyContent: "space-between", fontSize: 12, color: "#666" }}>
          <span style={{ fontWeight: 700 }}>Outputs</span>
          <span>{outPorts.length}</span>
        </div>
        {outPorts.map((p) => (
          <div key={`outlabel-${p.id}`} style={{ fontSize: 12, color: "#444" }}>
            {p.name}
          </div>
        ))}
      </div>
    </div>
  );
}
