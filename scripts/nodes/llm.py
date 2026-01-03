import json
import sys
import tkinter as tk

def main():
    payload = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}
    params = payload.get("params", {})
    node_id = payload.get("nodeId", "unknown")

    api_key = params.get("apiKey", "")
    prompt = params.get("prompt", "")

    root = tk.Tk()
    root.title(f"LLM Node - {node_id}")
    root.geometry("520x320")

    tk.Label(root, text=f"Node: {node_id}", font=("Segoe UI", 12, "bold")).pack(pady=10)

    tk.Label(root, text="apiKey:", anchor="w").pack(fill="x", padx=12)
    tk.Label(root, text=str(api_key), anchor="w", wraplength=480, justify="left").pack(fill="x", padx=12, pady=4)

    tk.Label(root, text="prompt:", anchor="w").pack(fill="x", padx=12)
    txt = tk.Text(root, height=10)
    txt.pack(fill="both", expand=True, padx=12, pady=6)
    txt.insert("1.0", str(prompt))
    txt.configure(state="disabled")

    root.mainloop()

if __name__ == "__main__":
    main()
