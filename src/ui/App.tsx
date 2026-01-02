import * as React from "react";
import WorkflowPage from "./pages/WorkflowPage";
import BlueprintLayoutPage from "./pages/BlueprintLayoutPage";

export default function App() {
  const [page, setPage] = React.useState<"workflow" | "ai-layout">("workflow");

  if (page === "ai-layout") {
    return <BlueprintLayoutPage onBackToWorkflow={() => setPage("workflow")} />;
  }

  return <WorkflowPage onGoToAiLayout={() => setPage("ai-layout")} />;
}
