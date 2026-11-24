import type { ProcessId, ProcessRuntime } from "../../domain/process";
import type { SchedulingPolicy } from "./SchedulingPolicy";

function pickShortest(readyQueue: ProcessId[], processes: ProcessRuntime[]): ProcessId | null {
  let best: ProcessRuntime | null = null;

  for (const id of readyQueue) {
    const process = processes.find((p) => p.input.id === id);
    if (!process) continue;
    if (!best || process.input.burstTime < best.input.burstTime) {
      best = process;
    }
  }

  return best ? best.input.id : null;
}

export const sjfPolicy: SchedulingPolicy = {
  isPreemptive: false,
  selectNext(readyQueue, processes) {
    return pickShortest(readyQueue, processes);
  },
  shouldPreempt() {
    return false;
  },
};