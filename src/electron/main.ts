import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import { isDev } from "./util.js";
import { getPreloadPath, getScriptPath, debugPaths } from "./pathresolver.js";
import { runPythonScript, spawnPythonProcess } from "./resourceManager.js";

function readNodeDefinitions() {
  const dir = getScriptPath("scripts/nodes");
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".json"));
  const defs: any[] = [];

  for (const f of files) {
    const abs = path.join(dir, f);
    try {
      const raw = fs.readFileSync(abs, "utf-8");
      defs.push(JSON.parse(raw));
    } catch (e) {
      console.error("[nodes] failed parsing:", abs, e);
    }
  }

  return defs;
}

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  console.log("[PATHS]", debugPaths());

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }
});

ipcMain.handle(
  "run-python",
  async (_evt, { scriptPath, args }: { scriptPath: string; args?: string[] }) => {
    try {
      const out = await runPythonScript(scriptPath, args ?? []);
      return { success: true, output: out };
    } catch (e: any) {
      return { success: false, error: e?.message || String(e) };
    }
  }
);

// Load node definitions from scripts/nodes/*.json
ipcMain.handle("list-node-defs", async () => {
  try {
    const defs = readNodeDefinitions();
    return { success: true, defs };
  } catch (e: any) {
    return { success: false, error: e?.message || String(e), defs: [] };
  }
});

// Spawn one python process per node instance (non-blocking)
ipcMain.handle("run-workflow", async (_evt, payload: any) => {
  try {
    const nodes = payload?.nodes ?? [];
    const nodeDefsById = payload?.nodeDefsById ?? {};

    const spawned: Array<{
      nodeId: string;
      nodeTypeId: string;
      pid: number | null;
      script: string;
    }> = [];

    for (const n of nodes) {
      const nodeId = String(n.id);
      const nodeTypeId = String(n.nodeTypeId);

      const def = nodeDefsById[nodeTypeId];
      const script = def?.script;

      if (!script) {
        throw new Error(`Node type '${nodeTypeId}' has no script in its JSON definition.`);
      }

      const params = n.params ?? {};
      const inputs = n.inputs ?? [];
      const outputs = n.outputs ?? [];

      const jsonArg = JSON.stringify({
        nodeId,
        nodeTypeId,
        label: n.label,
        params,
        inputs,
        outputs,
      });

      const res = spawnPythonProcess(script, [jsonArg]);

      spawned.push({
        nodeId,
        nodeTypeId,
        pid: res.pid,
        script: res.script,
      });
    }

    return { success: true, spawned };
  } catch (e: any) {
    return { success: false, error: e?.message || String(e) };
  }
});
