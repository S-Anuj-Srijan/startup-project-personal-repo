import { contextBridge, ipcRenderer } from "electron";

console.log("[preload] loaded");

contextBridge.exposeInMainWorld("api", {
  runPython: (scriptPath: string, args: string[] = []) =>
    ipcRenderer.invoke("run-python", { scriptPath, args }),
});
