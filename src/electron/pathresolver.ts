import { app } from "electron";
import path from "path";
import fs from "fs";

export function getPreloadPath() {
  return path.join(app.getAppPath(), "dist-electron", "preload.js");
}

export function getScriptPath(rel: string) {
  return app.isPackaged
    ? path.join(process.resourcesPath, rel)
    : path.join(process.cwd(), rel);
}

function exists(p: string) {
  try { return fs.existsSync(p); } catch { return false; }
}

/**
 * Returns best python executable path.
 * On Windows: prefer pythonw.exe to avoid console windows.
 */
export function getBestPythonPath(): string | null {
  const base = app.isPackaged
    ? path.join(process.resourcesPath, "python")
    : path.join(process.cwd(), "python");

  if (process.platform === "win32") {
    const pythonw = path.join(base, "win", "pythonw.exe");
    const python = path.join(base, "win", "python.exe");
    if (exists(pythonw)) return pythonw;
    if (exists(python)) return python;
    return null;
  }

  if (process.platform === "darwin") {
    const py = path.join(base, "mac", "bin", "python3");
    if (exists(py)) return py;
    return null;
  }

  const pyl = path.join(base, "linux", "bin", "python3");
  if (exists(pyl)) return pyl;
  return null;
}

export function debugPaths() {
  const devBase = path.join(process.cwd(), "python", "win");
  const prodBase = path.join(process.resourcesPath, "python", "win");

  return {
    isPackaged: app.isPackaged,
    appPath: app.getAppPath(),
    resourcesPath: process.resourcesPath,
    scriptExampleDev: path.join(process.cwd(), "scripts", "hello.py"),
    scriptExampleProd: path.join(process.resourcesPath, "scripts", "hello.py"),

    devPythonw: path.join(devBase, "pythonw.exe"),
    devPython: path.join(devBase, "python.exe"),
    prodPythonw: path.join(prodBase, "pythonw.exe"),
    prodPython: path.join(prodBase, "python.exe"),

    devPythonw_exists: exists(path.join(devBase, "pythonw.exe")),
    devPython_exists: exists(path.join(devBase, "python.exe")),
    prodPythonw_exists: exists(path.join(prodBase, "pythonw.exe")),
    prodPython_exists: exists(path.join(prodBase, "python.exe")),
  };
}
