import * as React from "react";

type Variant = "primary" | "secondary" | "ghost";

type PythonAction = {
  kind: "python";
  scriptPath: string;
  args?: string[];
  onSuccess?: (output?: string[]) => void;
  onError?: (error: string) => void;
};

type ClickAction = {
  kind: "click";
  onClick: () => void | Promise<void>;
};

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  action: PythonAction | ClickAction;
};

const base =
  "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition " +
  "focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "bg-black text-white hover:bg-neutral-800 focus:ring-black",
  secondary: "bg-neutral-200 text-black hover:bg-neutral-300 focus:ring-neutral-400",
  ghost: "bg-transparent text-black hover:bg-neutral-100 focus:ring-neutral-300",
};

export function Button({
  variant = "primary",
  className = "",
  action,
  children,
  disabled,
  ...rest
}: Props) {
  const [busy, setBusy] = React.useState(false);

  const handleClick = async () => {
    if (disabled || busy) return;

    if (action.kind === "click") {
      await action.onClick();
      return;
    }

    // action.kind === "python"
    if (!window.api?.runPython) {
      alert("Bridge not ready — check preload & main wiring.");
      return;
    }

    setBusy(true);
    try {
      const result = await window.api.runPython(action.scriptPath, action.args ?? []);
      if (result.success) {
        action.onSuccess?.(result.output);
      } else {
        action.onError?.(result.error ?? "Unknown Python error");
      }
    } catch (err) {
      action.onError?.(String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      {...rest}
      disabled={disabled || busy}
      className={`${base} ${variants[variant]} ${className}`}
      onClick={handleClick}
    >
      {busy ? "Running..." : children}
    </button>
  );
}
