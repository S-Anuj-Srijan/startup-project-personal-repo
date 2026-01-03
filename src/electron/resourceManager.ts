import { PythonShell } from "python-shell";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import { getScriptPath, getBestPythonPath } from "./pathresolver.js";

export async function runPythonScript(scriptRelOrAbs: string, args: string[] = []) {
  const abs = path.isAbsolute(scriptRelOrAbs) ? scriptRelOrAbs : getScriptPath(scriptRelOrAbs);

  if (!fs.existsSync(abs)) throw new Error(`Python script not found at: ${abs}`);

  // For short scripts where you want output back, python.exe is OK.
  // But still prefer bundled python if available.
  let pythonPath = getBestPythonPath();
  if (!pythonPath) pythonPath = process.platform === "win32" ? "py" : "python3";

  const messages = await PythonShell.run(abs, {
    args,
    pythonPath,
    pythonOptions: ["-u"],
  });

  return messages;
}

function resolvePythonForSpawn(): string {
  // For GUI long-running nodes, prefer pythonw on Windows
  const bundled = getBestPythonPath();
  if (bundled) return bundled;

  if (process.platform === "win32") {
    // If user has Python installed, pythonw is usually available on PATH
    return "pythonw";
  }
  return "python3";
}

function resolveScriptAbs(scriptRelOrAbs: string): string {
  const abs = path.isAbsolute(scriptRelOrAbs) ? scriptRelOrAbs : getScriptPath(scriptRelOrAbs);
  if (!fs.existsSync(abs)) throw new Error(`Python script not found at: ${abs}`);
  return abs;
}

export function spawnPythonProcess(scriptRelOrAbs: string, args: string[] = []) {
  const pythonPath = resolvePythonForSpawn();
  const scriptAbs = resolveScriptAbs(scriptRelOrAbs);

  const finalArgs = [scriptAbs, ...args];

  const child = spawn(pythonPath, finalArgs, {
    stdio: "ignore",
    detached: true,
    windowsHide: true,   // IMPORTANT: hide console window
  });

  child.unref();
  return { pid: child.pid ?? null, script: scriptAbs, python: pythonPath };
}
