import type { AggregateMetrics } from "../../../domain/metrics";
import styles from "./MetricsDashboard.module.css";

interface MetricsDashboardProps {
  metrics: AggregateMetrics;
}

const items = [
  { key: "waiting", label: "Avg Waiting", icon: "bi-hourglass-split" },
  { key: "turnaround", label: "Avg Turnaround", icon: "bi-arrow-repeat" },
  { key: "response", label: "Avg Response", icon: "bi-lightning" },
  { key: "utilization", label: "CPU Utilization", icon: "bi-cpu" },
  { key: "throughput", label: "Throughput", icon: "bi-speedometer2" },
  { key: "switches", label: "Context Switches", icon: "bi-shuffle" },
] as const;

export function MetricsDashboard({ metrics }: MetricsDashboardProps) {
  const values: Record<(typeof items)[number]["key"], string> = {
    waiting: metrics.averageWaitingTime.toFixed(2),
    turnaround: metrics.averageTurnaroundTime.toFixed(2),
    response: metrics.averageResponseTime.toFixed(2),
    utilization: `${(metrics.cpuUtilization * 100).toFixed(1)}%`,
    throughput: metrics.throughput.toFixed(2),
    switches: metrics.contextSwitches.toString(),
  };

  return (
    <div className="panel panel--metrics">
      <div className="panel-header">
        <h2 className="panel-title">Performance Metrics</h2>
      </div>
      <div className="panel-body">
        <div className={styles.grid}>
          {items.map((item) => (
            <div key={item.key} className={styles.card}>
              <div className={styles.icon}>
                <i className={`bi ${item.icon}`} />
              </div>
              <div className={styles.label}>{item.label}</div>
              <div className={styles.value}>{values[item.key]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}