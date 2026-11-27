import { useSimulation } from "../hooks/useSimulation";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import { ProcessTable } from "../components/ProcessTable/ProcessTable";
import { SimulationControls } from "../components/SimulationControls/SimulationControls";
import { AlgorithmSelector } from "../components/AlgorithmSelector/AlgorithmSelector";
import { GanttChart } from "../components/GanttChart/GanttChart";
import { MetricsDashboard } from "../components/MetricsDashboard/MetricsDashboard";
import { ComparisonView } from "../components/ComparisonView/ComparisonView";
import "../../dashboard.css";

export function App() {
  const {
    processes,
    config,
    clock,
    timeline,
    metrics,
    isRunning,
    isFinished,
    run,
    pause,
    step,
    reset,
    setAlgorithm,
    setTimeQuantum,
    setContextSwitchCost,
    addProcess,
    updateProcess,
    removeProcess,
  } = useSimulation();

  const configLocked = isRunning || clock > 0;

  return (
    <div className="dashboard-shell">
      <Header clock={clock} isFinished={isFinished} isRunning={isRunning} />

      <div className="dashboard-content">
        <div className="dashboard-grid">
          <aside className="dashboard-column">
            <SimulationControls
              isRunning={isRunning}
              isFinished={isFinished}
              onRun={run}
              onPause={pause}
              onStep={step}
              onReset={reset}
            />
            <AlgorithmSelector
              config={config}
              disabled={configLocked}
              onAlgorithmChange={setAlgorithm}
              onTimeQuantumChange={setTimeQuantum}
              onContextSwitchCostChange={setContextSwitchCost}
            />
            <ProcessTable
              processes={processes}
              isLocked={configLocked}
              onAdd={addProcess}
              onUpdate={updateProcess}
              onRemove={removeProcess}
            />
          </aside>

          <main className="dashboard-column">
            <GanttChart timeline={timeline} />
            <div className="dashboard-row">
              <MetricsDashboard metrics={metrics} />
              <ComparisonView processes={processes} config={config} />
            </div>
          </main>
        </div>
      </div>

      <Footer clock={clock} isFinished={isFinished} />
    </div>
  );
};