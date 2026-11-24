import styles from "./Footer.module.css";

interface FooterProps {
  clock: number;
  isFinished: boolean;
}

export function Footer({ clock, isFinished }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.lab}>Operating Systems Laboratory</span>
          <span className={styles.sep}>·</span>
          <span className={styles.version}>Simulation Engine v0.1</span>
        </div>

        <div className={styles.right}>
          <span className={styles.tick}>
            <span className={styles.tickDot} data-finished={isFinished} />
            Tick {clock.toString().padStart(3, "0")}
          </span>
        </div>
      </div>
    </footer>
  );
};