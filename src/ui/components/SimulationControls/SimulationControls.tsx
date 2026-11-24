interface SimulationControlsProps {
  isFinished: boolean;
  onRun: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
}

export function SimulationControls({
  isFinished,
  onRun,
  onPause,
  onStep,
  onReset,
}: SimulationControlsProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Simulation</h2>
      </div>
      <div className="panel-body">
        <div className="d-grid gap-2">
          <button className="btn btn-primary btn-dashboard" onClick={onRun} disabled={isFinished}>
            <i className="bi bi-play-fill" /> Run
          </button>
          <button className="btn btn-outline-secondary btn-dashboard" onClick={onPause} disabled={isFinished}>
            <i className="bi bi-pause-fill" /> Pause
          </button>
          <button className="btn btn-outline-secondary btn-dashboard" onClick={onStep} disabled={isFinished}>
            <i className="bi bi-skip-forward-fill" /> Step
          </button>
          <button className="btn btn-outline-danger btn-dashboard mt-1" onClick={onReset}>
            <i className="bi bi-arrow-counterclockwise" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
};