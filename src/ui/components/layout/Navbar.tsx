import { Button } from "../Button";

type Props = {
  panelOpen: boolean;
  onTogglePanel: () => void;
  onGoToAiLayout: () => void;
  onDeployWorkflow: () => void;
};

export function Navbar({
  panelOpen,
  onTogglePanel,
  onGoToAiLayout,
  onDeployWorkflow,
}: Props) {
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
      {/* Left: brand + panel toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ fontWeight: 700 }}>plai</div>

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
          }}
        >
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

      {/* Right: AI Layout + Deploy */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Button
          variant="secondary"
          action={{
            kind: "click",
            onClick: onGoToAiLayout,
          }}
        >
          AI Layout
        </Button>

        <Button
          action={{
            kind: "click",
            onClick: onDeployWorkflow,
          }}
        >
          Deploy
        </Button>
      </div>
    </div>
  );
}
