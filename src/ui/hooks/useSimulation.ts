import { useCallback, useState } from "react";

export interface SimulationProcessView {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
}

export interface TimelineEntryView {
  startTime: number;
  endTime: number;
  processId: string | null;
  kind: "run" | "idle" | "switch";
}

export interface MetricsView {
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  averageResponseTime: number;
  cpuUtilization: number;
  throughput: number;
  contextSwitches: number;
}

export interface UseSimulationResult {
  processes: SimulationProcessView[];
  clock: number;
  timeline: TimelineEntryView[];
  metrics: MetricsView;
  isFinished: boolean;
  run: () => void;
  pause: () => void;
  step: () => void;
  reset: () => void;
}

const initialProcesses: SimulationProcessView[] = [
  { id: "p1", name: "P1", arrivalTime: 0, burstTime: 5, priority: 2 },
  { id: "p2", name: "P2", arrivalTime: 1, burstTime: 3, priority: 1 },
  { id: "p3", name: "P3", arrivalTime: 2, burstTime: 4, priority: 3 },
];

const initialMetrics: MetricsView = {
  averageWaitingTime: 0,
  averageTurnaroundTime: 0,
  averageResponseTime: 0,
  cpuUtilization: 0,
  throughput: 0,
  contextSwitches: 0,
};

export function useSimulation(): UseSimulationResult {
  const [processes] = useState<SimulationProcessView[]>(initialProcesses);
  const [clock, setClock] = useState(0);
  const [timeline] = useState<TimelineEntryView[]>([]);
  const [metrics] = useState<MetricsView>(initialMetrics);
  const [isFinished] = useState(false);

  const run = useCallback(() => {}, []);
  const pause = useCallback(() => {}, []);
  const step = useCallback(() => setClock((value) => value + 1), []);
  const reset = useCallback(() => setClock(0), []);

  return { processes, clock, timeline, metrics, isFinished, run, pause, step, reset };
};