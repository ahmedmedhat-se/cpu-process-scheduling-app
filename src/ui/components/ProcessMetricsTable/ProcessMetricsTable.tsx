import type { ProcessMetrics } from "../../../domain/metrics";
import styles from "./ProcessMetricsTable.module.css";

interface ProcessMetricsTableProps {
  metrics: ProcessMetrics[];
}

export function ProcessMetricsTable({ metrics }: ProcessMetricsTableProps) {
  return (
    <div className="panel panel--timeline">
      <div className="panel-header">
        <h2 className="panel-title">Per-Process Breakdown</h2>
        <span className="panel-badge">{metrics.length}</span>
      </div>
      <div className="panel-body panel-body--flush">
        {metrics.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-table empty-icon" />
            <div className="empty-title">No completed processes yet</div>
            <p className="empty-description">
              Run the simulation to populate per-process metrics.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dashboard mb-0">
              <thead>
                <tr>
                  <th>Process</th>
                  <th className="text-end">Arrival</th>
                  <th className="text-end">Burst</th>
                  <th className="text-end">Start</th>
                  <th className="text-end">Completion</th>
                  <th className="text-end">Waiting</th>
                  <th className="text-end">Turnaround</th>
                  <th className="text-end">Response</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((row) => (
                  <tr key={row.processId}>
                    <td>
                      <span className={styles.processCell}>
                        <span className={styles.dot} />
                        {row.name}
                      </span>
                    </td>
                    <td className="text-end">{row.arrivalTime}</td>
                    <td className="text-end">{row.burstTime}</td>
                    <td className="text-end">{row.firstStartTime}</td>
                    <td className="text-end">{row.completionTime}</td>
                    <td className="text-end">{row.waitingTime}</td>
                    <td className="text-end">{row.turnaroundTime}</td>
                    <td className="text-end">{row.responseTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};