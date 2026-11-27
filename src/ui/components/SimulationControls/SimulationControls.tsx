import type { SimulationSpeed } from "../../hooks/useSimulation";
import styles from "./SimulationControls.module.css";

interface SimulationControlsProps {
  isRunning: boolean;
  isFinished: boolean;
  speed: SimulationSpeed;
  onRun: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: SimulationSpeed) => void;
}

const speeds: SimulationSpeed[] = ["slow", "normal", "fast"];

export function SimulationControls({
  isRunning,
  isFinished,
  speed,
  onRun,
  onPause,
  onStep,
  onReset,
  onSpeedChange,
}: SimulationControlsProps) {
  return (
    <div className="panel panel--controls">
      <div className="panel-header">
        <h2 className="panel-title">Simulation</h2>
      </div>
      <div className="panel-body">
        <div className="d-grid gap-2">
          <button
            className="btn btn-primary btn-dashboard"
            onClick={onRun}
            disabled={isRunning || isFinished}
          >
            <i className="bi bi-play-fill" /> Run
          </button>
          <button
            className="btn btn-outline-secondary btn-dashboard"
            onClick={onPause}
            disabled={!isRunning}
          >
            <i className="bi bi-pause-fill" /> Pause
          </button>
          <button
            className="btn btn-outline-secondary btn-dashboard"
            onClick={onStep}
            disabled={isRunning || isFinished}
          >
            <i className="bi bi-skip-forward-fill" /> Step
          </button>
          <button
            className="btn btn-outline-danger btn-dashboard mt-1"
            onClick={onReset}
          >
            <i className="bi bi-arrow-counterclockwise" /> Reset
          </button>
        </div>

        <div className={styles.speedRow}>
          <span className={styles.speedLabel}>Speed</span>
          <div className={styles.speedGroup}>
            {speeds.map((option) => (
              <button
                key={option}
                type="button"
                className={`${styles.speedButton} ${speed === option ? styles.speedActive : ""}`}
                onClick={() => onSpeedChange(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};