import type { ProcessId } from "./process";

export interface ProcessMetrics {
  processId: ProcessId;
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