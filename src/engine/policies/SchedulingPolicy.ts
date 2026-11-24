import type { ProcessId, ProcessRuntime } from "../../domain/process";
import type { SimulationConfig } from "../../domain/simulation";

export interface SchedulingPolicy {
  isPreemptive: boolean;
  selectNext(readyQueue: ProcessId[], processes: ProcessRuntime[], config: SimulationConfig): ProcessId | null;
  shouldPreempt(current: ProcessRuntime, quantumUsed: number, config: SimulationConfig): boolean;
};