import type { TimelineEntry } from "../../../domain/timeline";
import styles from "./GanttChart.module.css";

interface GanttChartProps {
  timeline: TimelineEntry[];
  runningId?: string | null;
}

const kinds = {
  run: { color: "var(--accent-primary)", label: "Running" },
  idle: { color: "var(--bg-elevated)", label: "Idle" },
  switch: { color: "var(--accent-warning)", label: "Switch" },
} as const;

function tickStep(segmentCount: number): number {
  if (segmentCount <= 12) return 1;
  if (segmentCount <= 30) return 2;
  if (segmentCount <= 60) return 5;
  return 10;
}

export function GanttChart({ timeline, runningId }: GanttChartProps) {
  const lastIndex = timeline.length - 1;
  const step = tickStep(timeline.length);

  return (
    <div className="panel panel--timeline">
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
          <div className={styles.chart}>
            <div className={styles.track}>
              {timeline.map((entry, index) => {
                const isLive =
                  index === lastIndex &&
                  entry.kind === "run" &&
                  entry.processId !== null &&
                  entry.processId === runningId;
                return (
                  <div
                    key={index}
                    className={isLive ? `${styles.segment} ${styles.segmentLive}` : styles.segment}
                    style={{
                      flexGrow: entry.endTime - entry.startTime,
                      backgroundColor: kinds[entry.kind].color,
                    }}
                    title={`${entry.processId ?? entry.kind} — ${entry.startTime} to ${entry.endTime}`}
                  >
                    <span className={styles.label}>{entry.processId ?? entry.kind}</span>
                  </div>
                );
              })}
            </div>

            <div className={styles.axis}>
              {timeline.map((entry, index) => (
                <div
                  key={index}
                  className={styles.tick}
                  style={{ flexGrow: entry.endTime - entry.startTime }}
                >
                  {index % step === 0 && (
                    <span className={styles.tickLabel}>{entry.startTime}</span>
                  )}
                </div>
              ))}
              <div className={styles.tickEnd}>
                <span className={styles.tickLabel}>
                  {timeline[timeline.length - 1].endTime}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};