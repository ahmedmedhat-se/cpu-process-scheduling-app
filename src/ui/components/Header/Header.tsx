import styles from "./Header.module.css";

interface HeaderProps {
  clock: number;
  isFinished: boolean;
  isRunning: boolean;
}

export function Header({ clock, isFinished, isRunning }: HeaderProps) {
  const state = isFinished ? "finished" : isRunning ? "running" : "ready";
  const stateLabel = isFinished ? "Finished" : isRunning ? "Running" : "Ready";

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <i className="bi bi-cpu" />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>CPU Scheduler</span>
            <span className={styles.brandSubtitle}>Process Scheduling Simulator</span>
          </div>
        </div>

        <div className={styles.metrics}>
          <div className={styles.clock}>
            <span className={styles.clockLabel}>Virtual Clock</span>
            <span className={styles.clockValue}>{clock.toString().padStart(3, "0")}</span>
          </div>

          <div className={styles.divider} />

          <div className={styles.status}>
            <span className={`${styles.statusDot} ${styles[state]}`} />
            <span className={styles.statusLabel}>{stateLabel}</span>
          </div>
        </div>
      </div>
    </header>
  );
};