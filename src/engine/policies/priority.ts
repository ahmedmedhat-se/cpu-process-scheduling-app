import type { ProcessId, ProcessRuntime } from "../../domain/process";
import type { SchedulingPolicy } from "./SchedulingPolicy";

function pickHighestPriority(readyQueue: ProcessId[], processes: ProcessRuntime[]): ProcessId | null {
  let best: ProcessRuntime | null = null;

  for (const id of readyQueue) {
    const process = processes.find((p) => p.input.id === id);
    if (!process) continue;
    if (!best || process.input.priority < best.input.priority) {
      best = process;
    }
  }

  return best ? best.input.id : null;
}

export const priorityPolicy: SchedulingPolicy = {
  isPreemptive: false,
  selectNext(readyQueue, processes) {
    return pickHighestPriority(readyQueue, processes);
  },
  shouldPreempt() {
    return false;
  },
};