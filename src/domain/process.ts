export type ProcessId = string;

export interface ProcessInput {
  id: ProcessId;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
}

export type ProcessState = "ready" | "running" | "terminated";

export interface ProcessRuntime {
  input: ProcessInput;
  state: ProcessState;
  remainingTime: number;
  firstStartTime?: number;
  completionTime?: number;
};