import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span>Operating Systems Laboratory</span>
        <span className={styles.meta}>Simulation Engine v0.1</span>
      </div>
    </footer>
  );
};