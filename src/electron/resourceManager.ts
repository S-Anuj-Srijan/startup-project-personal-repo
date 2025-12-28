import { PythonShell } from "python-shell";
import path from "path";
import fs from "fs";
import { getScriptPath, getBundledPythonPath } from "./pathresolver.js";

export async function runPythonScript(scriptRelOrAbs: string, args: string[] = []) {
  const abs = path.isAbsolute(scriptRelOrAbs)
    ? scriptRelOrAbs
    : getScriptPath(scriptRelOrAbs);

  if (!fs.existsSync(abs)) {
    throw new Error(`Python script not found at: ${abs}`);
  }

  // Prefer bundled python if present in prod; otherwise fallback to system.
  let pythonPath = getBundledPythonPath();
  if (!pythonPath) {
    // Pick a reasonable default based on platform
    pythonPath = process.platform === "win32" ? "py" : "python3";
  }

  const messages = await PythonShell.run(abs, {
    args,
    pythonPath,
    pythonOptions: ["-u"], // unbuffered output for timely prints
    // cwd: path.dirname(abs),   // uncomment if your script relies on working dir
    // env: { ...process.env }   // add env if needed
  });

  return messages; // array of stdout lines
}
