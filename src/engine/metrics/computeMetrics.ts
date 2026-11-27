import type { AggregateMetrics, ProcessMetrics } from "../../domain/metrics";
import type { ProcessRuntime } from "../../domain/process";
import type { Timeline, TimelineKind } from "../../domain/timeline";

interface ComputeMetricsInput {
  processes: ProcessRuntime[];
  timeline: Timeline;
  contextSwitches: number;
}

function sumDuration(timeline: Timeline, kind: TimelineKind): number {
  return timeline.entries
    .filter((entry) => entry.kind === kind)
    .reduce((total, entry) => total + (entry.endTime - entry.startTime), 0);
}

function average(values: number[]): number {
  return values.length === 0 ? 0 : values.reduce((a, b) => a + b, 0) / values.length;
}

export function computeMetrics({
  processes,
  timeline,
  contextSwitches,
}: ComputeMetricsInput): AggregateMetrics {
  const perProcess: ProcessMetrics[] = processes
    .filter(
      (process) =>
        process.completionTime !== undefined && process.firstStartTime !== undefined
    )
    .map((process) => {
      const { id, name, arrivalTime, burstTime } = process.input;
      const completionTime = process.completionTime as number;
      const firstStartTime = process.firstStartTime as number;
      return {
        processId: id,
        name,
        arrivalTime,
        burstTime,
        firstStartTime,
        completionTime,
        turnaroundTime: completionTime - arrivalTime,
        waitingTime: completionTime - arrivalTime - burstTime,
        responseTime: firstStartTime - arrivalTime,
      };
    });

  const totalTime =
    timeline.entries.length > 0
      ? timeline.entries[timeline.entries.length - 1].endTime
      : 0;

  const runTime = sumDuration(timeline, "run");
  const idleTime = sumDuration(timeline, "idle");
  const switchTime = sumDuration(timeline, "switch");

  return {
    perProcess,
    averageWaitingTime: average(perProcess.map((m) => m.waitingTime)),
    averageTurnaroundTime: average(perProcess.map((m) => m.turnaroundTime)),
    averageResponseTime: average(perProcess.map((m) => m.responseTime)),
    cpuUtilization: totalTime === 0 ? 0 : runTime / totalTime,
    throughput: totalTime === 0 ? 0 : perProcess.length / totalTime,
    contextSwitches,
    idleTime,
    switchTime,
    totalTime,
  };
};