import styles from "./Header.module.css";

interface HeaderProps {
  clock: number;
  isFinished: boolean;
}

export function Header({ clock, isFinished }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <i className="bi bi-cpu" />
          </div>
          <div>
            <div className={styles.brandTitle}>CPU Scheduler</div>
            <div className={styles.brandSubtitle}>Process Scheduling Simulator</div>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Clock</span>
            <span className={styles.statValue}>{clock}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.status}>
            <span className={isFinished ? styles.dotIdle : styles.dotActive} />
            {isFinished ? "Finished" : "Ready"}
          </div>
        </div>
      </div>
    </header>
  );
};