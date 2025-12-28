import * as React from "react";
import { Button } from "../Button";

type Props = {
  panelOpen: boolean;
  onTogglePanel: () => void;
};

export function Navbar({ panelOpen, onTogglePanel }: Props) {
  return (
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
      {/* Left: brand + arrow */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ fontWeight: 700 }}>plai</div>

        {/* Arrow toggle (in navbar) */}
        <button
          onClick={onTogglePanel}
          aria-label={panelOpen ? "Close side panel" : "Open side panel"}
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            border: "1px solid #e5e5e5",
            background: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
          }}
        >
          {/* Simple arrow: points right when closed, left when open */}
          <span
            style={{
              width: 0,
              height: 0,
              borderTop: "6px solid transparent",
              borderBottom: "6px solid transparent",
              borderLeft: "8px solid #111",
              transform: panelOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 180ms ease",
            }}
          />
        </button>
      </div>

      {/* Right: deploy */}
      <Button
        action={{
          kind: "python",
          scriptPath: "scripts/deploy_workflow.py",
          args: ["--env=local"],
          onSuccess: (out) => alert(out?.join("\n") || "Deploy complete"),
          onError: (err) => alert("Deploy failed: " + err),
        }}
      >
        Deploy
      </Button>
    </div>
  );
}
