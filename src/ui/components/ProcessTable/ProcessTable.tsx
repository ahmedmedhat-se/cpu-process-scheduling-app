import type { SimulationProcessView } from "../../hooks/useSimulation";

interface ProcessTableProps {
  processes: SimulationProcessView[];
}

export function ProcessTable({ processes }: ProcessTableProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Process Queue</h2>
        <span className="panel-badge">{processes.length}</span>
      </div>
      <div className="panel-body p-0">
        <div className="table-responsive">
          <table className="table table-dashboard mb-0">
            <thead>
              <tr>
                <th>Process</th>
                <th className="text-end">Arrival</th>
                <th className="text-end">Burst</th>
                <th className="text-end">Priority</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((process) => (
                <tr key={process.id}>
                  <td className="fw-medium">{process.name}</td>
                  <td className="text-end font-monospace">{process.arrivalTime}</td>
                  <td className="text-end font-monospace">{process.burstTime}</td>
                  <td className="text-end font-monospace">{process.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};