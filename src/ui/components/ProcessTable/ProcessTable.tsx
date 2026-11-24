import type { ProcessInput } from "../../../domain/process";

interface ProcessTableProps {
  processes: ProcessInput[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export function ProcessTable({ processes, selectedId, onSelect }: ProcessTableProps) {
  return (
    <div className="panel panel--table">
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
              {processes.map((process) => {
                const isSelected = selectedId === process.id;
                return (
                  <tr
                    key={process.id}
                    className={isSelected ? "row-selected" : undefined}
                    onClick={() => onSelect?.(process.id)}
                    style={{ cursor: onSelect ? "pointer" : "default" }}
                  >
                    <td>
                      <span className="process-name">
                        <span className="process-dot" />
                        {process.name}
                      </span>
                    </td>
                    <td className="text-end">{process.arrivalTime}</td>
                    <td className="text-end">{process.burstTime}</td>
                    <td className="text-end">{process.priority}</td>
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