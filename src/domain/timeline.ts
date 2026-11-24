import type { ProcessId } from "./process";

export type TimelineKind = "run" | "idle" | "switch";

export interface TimelineEntry {
  startTime: number;
  endTime: number;
  processId: ProcessId | null;
  kind: TimelineKind;
}

export interface Timeline {
  entries: TimelineEntry[];
};