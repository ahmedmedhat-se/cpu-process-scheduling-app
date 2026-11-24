import type { ProcessId, ProcessInput, ProcessRuntime } from "./process";
import type { Timeline } from "./timeline";

export type AlgorithmKind = "fcfs" | "sjf" | "rr" | "priority";

export interface SimulationConfig {
  algorithm: AlgorithmKind;
  timeQuantum?: number;
  contextSwitchCost: number;
}

export interface SimulationState {
  clock: number;
  processes: ProcessRuntime[];
  readyQueue: ProcessId[];
  runningId: ProcessId | null;
  contextSwitchRemaining: number;
  currentQuantumUsed: number;
  timeline: Timeline;
  contextSwitchCount: number;
  idleTime: number;
  finished: boolean;
}

export interface TickResult {
  clock: number;
  ranProcessId: ProcessId | null;
  idle: boolean;
  switched: boolean;
  completedProcessIds: ProcessId[];
  finished: boolean;
}

export interface SimulationSetup {
  inputs: ProcessInput[];
  config: SimulationConfig;
};