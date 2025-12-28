import { app } from "electron";
import path from "path";
import fs from "fs";

export function getPreloadPath() {
  // Option A: preload is inside app files
  return path.join(app.getAppPath(), "dist-electron", "preload.js");
}

/** Resolve script path in dev (cwd) and prod (resources). Pass e.g. "scripts/hello.py". */
export function getScriptPath(rel: string) {
  const p = app.isPackaged
    ? path.join(process.resourcesPath, rel)
    : path.join(process.cwd(), rel);
  return p;
}

/** OPTIONAL: Resolve a bundled Python interpreter if you ship one. */
export function getBundledPythonPath(): string | null {
  if (!app.isPackaged) return null;

  // Example layout you place under your repo's ./python/ folder (copied via extraResources)
  // - Windows:   python/win/python.exe
  // - macOS:     python/mac/bin/python3
  // - Linux:     python/linux/bin/python3
  const base = path.join(process.resourcesPath, "python");
  const candidates =
    process.platform === "win32"
      ? [path.join(base, "win", "python.exe")]
      : process.platform === "darwin"
      ? [path.join(base, "mac", "bin", "python3")]
      : [path.join(base, "linux", "bin", "python3")];

  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

/** FOR DEBUGGING: print where we think things are. */
export function debugPaths() {
  const info = {
    isPackaged: app.isPackaged,
    appPath: app.getAppPath(),
    resourcesPath: process.resourcesPath,
    scriptExampleDev: path.join(process.cwd(), "scripts", "hello.py"),
    scriptExampleProd: path.join(process.resourcesPath, "scripts", "hello.py"),
  };
  return info;
}
