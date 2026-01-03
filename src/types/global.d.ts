export {};

declare global {
  interface Window {
    api: {
      runPython: (
        scriptPath: string,
        args?: string[]
      ) => Promise<{ success: boolean; output?: string[]; error?: string }>;

      listNodeDefs: () => Promise<{ success: boolean; defs: unknown[]; error?: string }>;

      runWorkflow: (
        payload: any
      ) => Promise<{ success: boolean; spawned?: any[]; error?: string }>;
    };
  }
}
