import type { AlgorithmKind, SimulationConfig } from "../../../domain/simulation";

interface AlgorithmSelectorProps {
  config: SimulationConfig;
  disabled?: boolean;
  onAlgorithmChange: (algorithm: AlgorithmKind) => void;
  onTimeQuantumChange: (quantum: number) => void;
  onContextSwitchCostChange: (cost: number) => void;
}

const algorithms: { value: AlgorithmKind; label: string; description: string }[] = [
  { value: "fcfs", label: "FCFS", description: "First Come, First Served" },
  { value: "sjf", label: "SJF", description: "Shortest Job First" },
  { value: "rr", label: "Round Robin", description: "Preemptive, quantum-based" },
  { value: "priority", label: "Priority", description: "Lower value = higher priority" },
];

export function AlgorithmSelector({
  config,
  disabled = false,
  onAlgorithmChange,
  onTimeQuantumChange,
  onContextSwitchCostChange,
}: AlgorithmSelectorProps) {
  return (
    <div className="panel panel--controls">
      <div className="panel-header">
        <h2 className="panel-title">Configuration</h2>
      </div>
      <div className="panel-body">
        <label className="form-label-dashboard" htmlFor="algorithm-select">
          Algorithm
        </label>
        <select
          id="algorithm-select"
          className="form-select form-select-dashboard mb-3"
          value={config.algorithm}
          disabled={disabled}
          onChange={(event) => onAlgorithmChange(event.target.value as AlgorithmKind)}
        >
          {algorithms.map((algo) => (
            <option key={algo.value} value={algo.value}>
              {algo.label} — {algo.description}
            </option>
          ))}
        </select>

        {config.algorithm === "rr" && (
          <>
            <label className="form-label-dashboard" htmlFor="quantum-input">
              Time Quantum
            </label>
            <input
              id="quantum-input"
              type="number"
              min={1}
              className="form-control form-control-dashboard mb-3"
              value={config.timeQuantum ?? 2}
              disabled={disabled}
              onChange={(event) => onTimeQuantumChange(Math.max(1, Number(event.target.value)))}
            />
          </>
        )}

        <label className="form-label-dashboard" htmlFor="switch-cost-input">
          Context Switch Cost
        </label>
        <input
          id="switch-cost-input"
          type="number"
          min={0}
          className="form-control form-control-dashboard"
          value={config.contextSwitchCost}
          disabled={disabled}
          onChange={(event) => onContextSwitchCostChange(Math.max(0, Number(event.target.value)))}
        />
      </div>
    </div>
  );
};