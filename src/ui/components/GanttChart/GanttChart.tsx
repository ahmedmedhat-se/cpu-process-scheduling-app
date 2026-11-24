import type { TimelineEntryView } from "../../hooks/useSimulation";
import styles from "./GanttChart.module.css";

interface GanttChartProps {
  timeline: TimelineEntryView[];
}

const kinds = {
  run: { color: "var(--accent-primary)", label: "Running" },
  idle: { color: "var(--surface-elevated)", label: "Idle" },
  switch: { color: "var(--accent-warning)", label: "Switch" },
} as const;

export function GanttChart({ timeline }: GanttChartProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Execution Timeline</h2>
        <div className={styles.legend}>
          {Object.entries(kinds).map(([kind, meta]) => (
            <span key={kind} className={styles.legendItem}>
              <span className={styles.swatch} style={{ backgroundColor: meta.color }} />
              {meta.label}
            </span>
          ))}
        </div>
      </div>
      <div className="panel-body">
        {timeline.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-bar-chart-steps empty-icon" />
            <div className="empty-title">No execution data</div>
            <p className="empty-description">Run the simulation to generate the timeline.</p>
          </div>
        ) : (
          <div className={styles.track}>
            {timeline.map((entry, index) => (
              <div
                key={index}
                className={styles.segment}
                style={{
                  flexGrow: entry.endTime - entry.startTime,
                  backgroundColor: kinds[entry.kind].color,
                }}
                title={`${entry.processId ?? entry.kind} — ${entry.startTime} to ${entry.endTime}`}
              >
                <span className={styles.label}>{entry.processId ?? entry.kind}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};