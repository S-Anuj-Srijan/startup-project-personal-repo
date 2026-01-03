import json
import sys
import tkinter as tk

def main():
    payload = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}
    params = payload.get("params", {})
    node_id = payload.get("nodeId", "unknown")

    robot_ip = params.get("robotIp", "")
    robot_speed = params.get("robotSpeed", 0)

    root = tk.Tk()
    root.title(f"Robot Node - {node_id}")
    root.geometry("420x220")

    tk.Label(root, text=f"Node: {node_id}", font=("Segoe UI", 12, "bold")).pack(pady=10)

    tk.Label(root, text=f"Robot IP: {robot_ip}", font=("Segoe UI", 10)).pack(pady=6)
    tk.Label(root, text=f"Robot Speed: {robot_speed}", font=("Segoe UI", 10)).pack(pady=6)

    root.mainloop()

if __name__ == "__main__":
    main()
