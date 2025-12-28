import * as React from "react";

type Props = {
  nodeTypesInProject: string[];
};

export function ProjectNodeTypesPanel({ nodeTypesInProject }: Props) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div>
        <div style={{ fontWeight: 700 }}>Node types used in this workflow</div>
        <div style={{ color: "#666", fontSize: 13, marginTop: 4 }}>
          These types currently exist in the project graph.
        </div>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {nodeTypesInProject.length === 0 ? (
          <div style={{ color: "#999", fontSize: 13 }}>No nodes yet.</div>
        ) : (
          nodeTypesInProject.map((t) => (
            <div
              key={t}
              style={{
                border: "1px solid #eee",
                borderRadius: 10,
                padding: 12,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontWeight: 600 }}>{t}</span>
              <span style={{ color: "#666", fontSize: 12 }}>In project</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
