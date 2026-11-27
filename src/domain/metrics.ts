import type { ProcessId } from "./process";

export interface ProcessMetrics {
  processId: ProcessId;
  name: string;
  arrivalTime: number;
  burstTime: number;
  firstStartTime: number;
  completionTime: number;
  waitingTime: number;
  turnaroundTime: number;
  responseTime: number;
}

export interface AggregateMetrics {
  perProcess: ProcessMetrics[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  averageResponseTime: number;
  cpuUtilization: number;
  throughput: number;
  contextSwitches: number;
  idleTime: number;
  switchTime: number;
  totalTime: number;
};