import { PythonShell } from "python-shell";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import { getScriptPath, getBundledPythonPath } from "./pathresolver.js";

/** Blocking execution for short scripts (deploy_workflow.py, ai_run.py, etc.) */
export async function runPythonScript(scriptRelOrAbs: string, args: string[] = []) {
  const abs = path.isAbsolute(scriptRelOrAbs) ? scriptRelOrAbs : getScriptPath(scriptRelOrAbs);

  if (!fs.existsSync(abs)) {
    throw new Error(`Python script not found at: ${abs}`);
  }

  let pythonPath = getBundledPythonPath();
  if (!pythonPath) {
    pythonPath = process.platform === "win32" ? "py" : "python3";
  }

  // If using "py" on Windows, use "-3" to force Python 3
  const pythonOptions: string[] = ["-u"];
  const finalArgs =
    process.platform === "win32" && pythonPath.toLowerCase() === "py"
      ? ["-3", abs, ...args]
      : args;

  // PythonShell.run expects script path separately; if using "py -3", we pass via pythonOptions
  const messages = await PythonShell.run(abs, {
    args: finalArgs,
    pythonPath,
    pythonOptions,
  });

  return messages;
}

function resolvePythonPath(): string {
  const bundled = getBundledPythonPath();
  if (bundled) return bundled;

  if (process.platform === "win32") return "py";
  return "python3";
}

function resolveScriptAbs(scriptRelOrAbs: string): string {
  const abs = path.isAbsolute(scriptRelOrAbs) ? scriptRelOrAbs : getScriptPath(scriptRelOrAbs);

  if (!fs.existsSync(abs)) {
    throw new Error(`Python script not found at: ${abs}`);
  }
  return abs;
}

/**
 * Non-blocking spawn for long-running scripts (tkinter windows, opencv loops, etc.)
 * Does NOT wait for script to exit.
 */
export function spawnPythonProcess(scriptRelOrAbs: string, args: string[] = []) {
  const pythonPath = resolvePythonPath();
  const scriptAbs = resolveScriptAbs(scriptRelOrAbs);

  const finalArgs =
    process.platform === "win32" && pythonPath.toLowerCase() === "py"
      ? ["-3", scriptAbs, ...args]
      : [scriptAbs, ...args];

  const child = spawn(pythonPath, finalArgs, {
    stdio: "ignore",
    detached: true,
    windowsHide: false,
  });

  child.unref();

  return { pid: child.pid ?? null, script: scriptAbs };
}
