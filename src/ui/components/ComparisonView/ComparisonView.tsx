export function ComparisonView() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Algorithm Comparison</h2>
      </div>
      <div className="panel-body">
        <div className="empty-state">
          <i className="bi bi-diagram-3 empty-icon" />
          <div className="empty-title">No comparison data</div>
          <p className="empty-description">Run multiple algorithms to compare performance.</p>
        </div>
      </div>
    </div>
  );
};