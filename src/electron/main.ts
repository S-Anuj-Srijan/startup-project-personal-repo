import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import { isDev } from "./util.js";
import { getPreloadPath, getScriptPath, debugPaths } from "./pathresolver.js";
import { runPythonScript } from "./resourceManager.js";

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

  const dbg = debugPaths();
  console.log("[PATHS]", dbg);

  const testScriptPath = getScriptPath("scripts/hello.py");
  console.log("[CHECK] script exists?", testScriptPath, fs.existsSync(testScriptPath));

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

// NEW: load node definitions from scripts/nodes/*.json
ipcMain.handle("list-node-defs", async () => {
  try {
    const defs = readNodeDefinitions();
    return { success: true, defs };
  } catch (e: any) {
    return { success: false, error: e?.message || String(e), defs: [] };
  }
});
