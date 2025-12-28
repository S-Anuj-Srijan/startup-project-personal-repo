import * as React from "react";

type Props = {
  open: boolean;
  onClose?: () => void;

  title?: string;
  width?: number;
  topOffsetPx?: number;
  showOverlay?: boolean;
  closeOnEsc?: boolean;

  headerActions?: React.ReactNode; // NEW
  children: React.ReactNode;
};

export function RightSlideBar({
  open,
  onClose,
  title = "Details",
  width = 360,
  topOffsetPx = 56,
  showOverlay = false,
  closeOnEsc = true,
  headerActions,
  children,
}: Props) {
  React.useEffect(() => {
    if (!closeOnEsc || !open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeOnEsc, onClose]);

  return (
    <>
      {showOverlay && (
        <div
          onClick={() => onClose?.()}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.22)",
            opacity: open ? 1 : 0,
            transition: "opacity 180ms ease",
            pointerEvents: open ? "auto" : "none",
            zIndex: 40,
          }}
        />
      )}

      <aside
        aria-hidden={!open}
        style={{
          position: "fixed",
          top: topOffsetPx,
          right: 0,
          height: `calc(100vh - ${topOffsetPx}px)`,
          width,
          background: "#fff",
          borderLeft: "1px solid #e5e5e5",
          boxShadow: "-14px 0 28px rgba(0,0,0,0.08)",
          transform: open ? "translateX(0)" : `translateX(${width}px)`,
          transition: "transform 180ms ease",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 14px 12px 14px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ fontWeight: 700 }}>{title}</div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {headerActions}

            {onClose && (
              <button
                onClick={onClose}
                style={{
                  border: "1px solid #e5e5e5",
                  background: "white",
                  borderRadius: 8,
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 14, overflow: "auto", flex: 1 }}>{children}</div>
      </aside>
    </>
  );
}
