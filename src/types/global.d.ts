export {};

declare global {
  interface Window {
    api: {
      runPython: (
        scriptPath: string,
        args?: string[]
      ) => Promise<{ success: boolean; output?: string[]; error?: string }>;
    };
  }
}
