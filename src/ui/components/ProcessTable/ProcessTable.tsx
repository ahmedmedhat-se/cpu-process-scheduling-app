import type { ProcessInput } from "../../../domain/process";
import styles from "./ProcessTable.module.css";

interface ProcessTableProps {
  processes: ProcessInput[];
  selectedId?: string | null;
  isLocked?: boolean;
  onSelect?: (id: string) => void;
  onAdd?: () => void;
  onUpdate?: (id: string, patch: Partial<Omit<ProcessInput, "id" | "name">>) => void;
  onRemove?: (id: string) => void;
}

export function ProcessTable({
  processes,
  selectedId,
  isLocked = false,
  onSelect,
  onAdd,
  onUpdate,
  onRemove,
}: ProcessTableProps) {
  const handleNumberChange = (
    id: string,
    field: "arrivalTime" | "burstTime" | "priority",
    rawValue: string,
    minimum: number
  ) => {
    const parsed = Number(rawValue);
    if (Number.isNaN(parsed)) return;
    onUpdate?.(id, { [field]: Math.max(minimum, Math.floor(parsed)) });
  };

  return (
    <div className="panel panel--table">
      <div className="panel-header">
        <h2 className="panel-title">Process Queue</h2>
        <div className={styles.headerActions}>
          <span className="panel-badge">{processes.length}</span>
          <button
            type="button"
            className="btn btn-outline-secondary btn-dashboard"
            onClick={onAdd}
            disabled={isLocked || !onAdd}
          >
            <i className="bi bi-plus-lg" /> Add
          </button>
        </div>
      </div>
      <div className="panel-body panel-body--flush">
        <div className="table-responsive">
          <table className="table table-dashboard mb-0">
            <thead>
              <tr>
                <th>Process</th>
                <th className="text-end">Arrival</th>
                <th className="text-end">Burst</th>
                <th className="text-end">Priority</th>
                <th className="text-end" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {processes.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.emptyRow}>
                    No processes yet. Click <strong>Add</strong> to create one.
                  </td>
                </tr>
              ) : (
                processes.map((process) => {
                  const isSelected = selectedId === process.id;
                  return (
                    <tr
                      key={process.id}
                      className={isSelected ? "row-selected" : undefined}
                      onClick={() => onSelect?.(process.id)}
                      style={{ cursor: onSelect ? "pointer" : "default" }}
                    >
                      <td>
                        <span className="process-name">
                          <span className="process-dot" />
                          {process.name}
                        </span>
                      </td>
                      <td className="text-end">
                        <input
                          type="number"
                          min={0}
                          className={styles.cellInput}
                          value={process.arrivalTime}
                          disabled={isLocked}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleNumberChange(process.id, "arrivalTime", e.target.value, 0)
                          }
                        />
                      </td>
                      <td className="text-end">
                        <input
                          type="number"
                          min={1}
                          className={styles.cellInput}
                          value={process.burstTime}
                          disabled={isLocked}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleNumberChange(process.id, "burstTime", e.target.value, 1)
                          }
                        />
                      </td>
                      <td className="text-end">
                        <input
                          type="number"
                          min={0}
                          className={styles.cellInput}
                          value={process.priority}
                          disabled={isLocked}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleNumberChange(process.id, "priority", e.target.value, 0)
                          }
                        />
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemove?.(process.id);
                          }}
                          disabled={isLocked}
                          aria-label={`Remove ${process.name}`}
                        >
                          <i className="bi bi-trash3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};