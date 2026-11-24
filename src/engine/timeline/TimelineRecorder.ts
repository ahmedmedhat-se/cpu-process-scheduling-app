import type { ProcessId } from "../../domain/process";
import type { Timeline, TimelineEntry, TimelineKind } from "../../domain/timeline";

export class TimelineRecorder {
  private entries: TimelineEntry[] = [];

  append(clock: number, processId: ProcessId | null, kind: TimelineKind): void {
    const last = this.entries[this.entries.length - 1];

    if (
      last &&
      last.kind === kind &&
      last.processId === processId &&
      last.endTime === clock
    ) {
      last.endTime = clock + 1;
      return;
    }

    this.entries.push({
      startTime: clock,
      endTime: clock + 1,
      processId,
      kind,
    });
  }

  snapshot(): Timeline {
    return { entries: this.entries.map((entry) => ({ ...entry })) };
  }

  reset(): void {
    this.entries = [];
  }
};