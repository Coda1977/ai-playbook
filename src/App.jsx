import { useState, useCallback } from "react";
import { useApp } from "./context/AppContext";
import { generatePrimitives, generatePlaybook } from "./utils/api";
import { CATEGORIES } from "./config/categories";
import PaperGrain from "./components/shared/PaperGrain";
import ErrorBanner from "./components/shared/ErrorBanner";
import Header from "./components/shared/Header";
import GeneratingIndicator from "./components/shared/GeneratingIndicator";
import IntakeView from "./components/views/IntakeView";
import PrimitivesView from "./components/views/PrimitivesView";
import PlaybookView from "./components/views/PlaybookView";
import CommitmentView from "./components/views/CommitmentView";

export default function App() {
  const { state, dispatch } = useApp();
  const [genErr, setGenErr] = useState(null);

  // Primitives generation
  const [primitivesReady, setPrimitivesReady] = useState(false);
  const [pendingPrimitives, setPendingPrimitives] = useState(null);

  // Playbook generation
  const [playbookReady, setPlaybookReady] = useState(false);
  const [pendingPlan, setPendingPlan] = useState(null);

  const handleGeneratePrimitives = async (intake) => {
    setGenErr(null);
    setPrimitivesReady(false);
    setPendingPrimitives(null);
    dispatch({ type: "SET_PHASE", phase: "generating-primitives" });
    try {
      const primitives = await generatePrimitives(intake);
      setPendingPrimitives(primitives);
      setPrimitivesReady(true);
    } catch (err) {
      console.error("Primitives generation failed:", err);
      setGenErr("Something went wrong while discovering AI use cases. This usually means a connection issue.");
      dispatch({ type: "SET_PHASE", phase: "intake" });
    }
  };

  const handlePrimitivesReady = useCallback(() => {
    if (pendingPrimitives) {
      dispatch({ type: "SET_PRIMITIVES", primitives: pendingPrimitives });
      setPendingPrimitives(null);
    }
  }, [pendingPrimitives, dispatch]);

  const getStarredPrimitives = () => {
    const starred = [];
    for (const cat of CATEGORIES) {
      (state.primitives[cat.id] || [])
        .filter((i) => i.starred)
        .forEach((i) => starred.push({ category: cat.title, text: i.text }));
    }
    return starred;
  };

  const handleContinueToPlaybook = async () => {
    setGenErr(null);
    setPlaybookReady(false);
    setPendingPlan(null);
    dispatch({ type: "SET_PHASE", phase: "generating-playbook" });
    try {
      const starredPrimitives = getStarredPrimitives();
      const plan = await generatePlaybook(state.intake, starredPrimitives);
      setPendingPlan(plan);
      setPlaybookReady(true);
    } catch (err) {
      console.error("Playbook generation failed:", err);
      setGenErr("Something went wrong while writing your playbook. This usually means a connection issue.");
      dispatch({ type: "SET_PHASE", phase: "primitives" });
    }
  };

  const handlePlaybookReady = useCallback(() => {
    if (pendingPlan) {
      dispatch({ type: "SET_PLAN", plan: pendingPlan });
      setPendingPlan(null);
    }
  }, [pendingPlan, dispatch]);

  const { phase } = state;

  return (
    <div className="app-root">
      <PaperGrain />

      {genErr && (phase === "intake" || phase === "primitives") && (
        <ErrorBanner message={genErr} onDismiss={() => setGenErr(null)} />
      )}

      {phase !== "intake" && phase !== "generating-primitives" && phase !== "generating-playbook" && (
        <Header state={state} dispatch={dispatch} />
      )}

      <main className="app-main">
        {phase === "intake" && (
          <IntakeView state={state} dispatch={dispatch} onGenerate={handleGeneratePrimitives} />
        )}
        {phase === "generating-primitives" && (
          <>
            <Header state={state} dispatch={dispatch} />
            <GeneratingIndicator mode="primitives" onReady={primitivesReady ? handlePrimitivesReady : null} />
          </>
        )}
        {phase === "primitives" && (
          <PrimitivesView state={state} dispatch={dispatch} onContinue={handleContinueToPlaybook} />
        )}
        {phase === "generating-playbook" && (
          <>
            <Header state={state} dispatch={dispatch} />
            <GeneratingIndicator mode="playbook" onReady={playbookReady ? handlePlaybookReady : null} />
          </>
        )}
        {phase === "playbook" && (
          <PlaybookView state={state} dispatch={dispatch} />
        )}
        {phase === "commitment" && (
          <CommitmentView state={state} dispatch={dispatch} />
        )}
      </main>
    </div>
  );
}
