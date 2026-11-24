import { useSimulation } from "../hooks/useSimulation";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import { ProcessTable } from "../components/ProcessTable/ProcessTable";
import { SimulationControls } from "../components/SimulationControls/SimulationControls";
import { GanttChart } from "../components/GanttChart/GanttChart";
import { MetricsDashboard } from "../components/MetricsDashboard/MetricsDashboard";
import { ComparisonView } from "../components/ComparisonView/ComparisonView";
import "../../dashboard.css";

export function App() {
  const { processes, clock, timeline, metrics, isFinished, run, pause, step, reset } =
    useSimulation();

  return (
    <div className="dashboard-shell">
      <Header clock={clock} isFinished={isFinished} />

      <div className="dashboard-content">
        <div className="dashboard-grid">
          <aside className="dashboard-column">
            <SimulationControls
              isFinished={isFinished}
              onRun={run}
              onPause={pause}
              onStep={step}
              onReset={reset}
            />
            <ProcessTable processes={processes} />
          </aside>

          <main className="dashboard-column">
            <GanttChart timeline={timeline} />
            <div className="dashboard-row">
              <MetricsDashboard metrics={metrics} />
              <ComparisonView />
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};