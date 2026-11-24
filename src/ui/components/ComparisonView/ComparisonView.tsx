import { useMemo } from "react";
import { SimulationEngine } from "../../../engine/SimulationEngine";
import type { ProcessInput } from "../../../domain/process";
import type { AlgorithmKind, SimulationConfig } from "../../../domain/simulation";
import type { AggregateMetrics } from "../../../domain/metrics";
import styles from "./ComparisonView.module.css";

interface ComparisonViewProps {
  processes: ProcessInput[];
  config: SimulationConfig;
}

const algorithms: { kind: AlgorithmKind; label: string }[] = [
  { kind: "fcfs", label: "FCFS" },
  { kind: "sjf", label: "SJF" },
  { kind: "rr", label: "Round Robin" },
  { kind: "priority", label: "Priority" },
];

interface Row {
  algorithm: AlgorithmKind;
  label: string;
  metrics: AggregateMetrics;
}

function runComparison(processes: ProcessInput[], config: SimulationConfig): Row[] {
  return algorithms.map(({ kind, label }) => {
    const engine = new SimulationEngine(processes, {
      algorithm: kind,
      contextSwitchCost: config.contextSwitchCost,
      timeQuantum: kind === "rr" ? config.timeQuantum ?? 2 : undefined,
    });
    engine.runToCompletion();
    return { algorithm: kind, label, metrics: engine.getMetrics() };
  });
}

export function ComparisonView({ processes, config }: ComparisonViewProps) {
  const rows = useMemo(() => runComparison(processes, config), [processes, config]);

  return (
    <div className="panel panel--comparison">
      <div className="panel-header">
        <h2 className="panel-title">Algorithm Comparison</h2>
      </div>
      <div className="panel-body panel-body--flush">
        <div className="table-responsive">
          <table className="table table-dashboard mb-0">
            <thead>
              <tr>
                <th>Algorithm</th>
                <th className="text-end">Avg Wait</th>
                <th className="text-end">Avg Turn</th>
                <th className="text-end">CPU %</th>
                <th className="text-end">Switches</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const isActive = row.algorithm === config.algorithm;
                return (
                  <tr key={row.algorithm} className={isActive ? "row-selected" : undefined}>
                    <td>
                      <span className={styles.algorithmCell}>
                        {row.label}
                        {isActive && <span className={styles.activeTag}>active</span>}
                      </span>
                    </td>
                    <td className="text-end">{row.metrics.averageWaitingTime.toFixed(2)}</td>
                    <td className="text-end">{row.metrics.averageTurnaroundTime.toFixed(2)}</td>
                    <td className="text-end">{(row.metrics.cpuUtilization * 100).toFixed(1)}</td>
                    <td className="text-end">{row.metrics.contextSwitches}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};