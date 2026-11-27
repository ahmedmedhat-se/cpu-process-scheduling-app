import { useCallback, useEffect, useRef, useState } from "react";
import { SimulationEngine } from "../../engine/SimulationEngine";
import type { ProcessInput } from "../../domain/process";
import type { AlgorithmKind, SimulationConfig } from "../../domain/simulation";
import type { AggregateMetrics } from "../../domain/metrics";
import type { TimelineEntry } from "../../domain/timeline";

const seedProcesses: ProcessInput[] = [
  { id: "p1", name: "P1", arrivalTime: 0, burstTime: 5, priority: 2 },
  { id: "p2", name: "P2", arrivalTime: 1, burstTime: 3, priority: 1 },
  { id: "p3", name: "P3", arrivalTime: 2, burstTime: 4, priority: 3 },
];

const defaultConfig: SimulationConfig = {
  algorithm: "fcfs",
  contextSwitchCost: 0,
  timeQuantum: 2,
};

const emptyMetrics: AggregateMetrics = {
  perProcess: [],
  averageWaitingTime: 0,
  averageTurnaroundTime: 0,
  averageResponseTime: 0,
  cpuUtilization: 0,
  throughput: 0,
  contextSwitches: 0,
  idleTime: 0,
  switchTime: 0,
  totalTime: 0,
};

export interface UseSimulationResult {
  processes: ProcessInput[];
  config: SimulationConfig;
  clock: number;
  timeline: TimelineEntry[];
  metrics: AggregateMetrics;
  isRunning: boolean;
  isFinished: boolean;
  run: () => void;
  pause: () => void;
  step: () => void;
  reset: () => void;
  setAlgorithm: (algorithm: AlgorithmKind) => void;
  setTimeQuantum: (quantum: number) => void;
  setContextSwitchCost: (cost: number) => void;
  addProcess: () => void;
  updateProcess: (id: string, patch: Partial<Omit<ProcessInput, "id" | "name">>) => void;
  removeProcess: (id: string) => void;
  resetProcesses: () => void;
}

const STEP_INTERVAL_MS = 400;

function nextProcessName(processes: ProcessInput[]): string {
  const used = new Set(processes.map((p) => p.name));
  let i = 1;
  while (used.has(`P${i}`)) i += 1;
  return `P${i}`;
}

export function useSimulation(): UseSimulationResult {
  const engineRef = useRef<SimulationEngine | null>(null);
  const intervalRef = useRef<number | null>(null);

  const [processes, setProcesses] = useState<ProcessInput[]>(seedProcesses);
  const [config, setConfig] = useState<SimulationConfig>(defaultConfig);
  const [clock, setClock] = useState(0);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [metrics, setMetrics] = useState<AggregateMetrics>(emptyMetrics);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  if (engineRef.current === null) {
    engineRef.current = new SimulationEngine(seedProcesses, defaultConfig);
  }

  const sync = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    const state = engine.getState();
    setClock(state.clock);
    setTimeline(state.timeline.entries);
    setMetrics(engine.getMetrics());
    setIsFinished(state.finished);
    if (state.finished) {
      setIsRunning(false);
    }
  }, []);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  const rebuild = useCallback(
    (nextProcesses: ProcessInput[], nextConfig: SimulationConfig) => {
      clearTimer();
      engineRef.current = new SimulationEngine(nextProcesses, nextConfig);
      setClock(0);
      setTimeline([]);
      setMetrics(emptyMetrics);
      setIsRunning(false);
      setIsFinished(false);
    },
    [clearTimer]
  );

  const reset = useCallback(() => {
    rebuild(processes, config);
  }, [processes, config, rebuild]);

  const step = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.step();
    sync();
  }, [sync]);

  const run = useCallback(() => {
    if (intervalRef.current !== null) return;
    setIsRunning(true);

    intervalRef.current = window.setInterval(() => {
      const engine = engineRef.current;
      if (!engine) return;
      engine.step();
      sync();

      if (engine.getState().finished) {
        clearTimer();
        setIsRunning(false);
      }
    }, STEP_INTERVAL_MS);
  }, [sync, clearTimer]);

  const pause = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const setAlgorithm = useCallback(
    (algorithm: AlgorithmKind) => {
      const nextConfig = { ...config, algorithm };
      setConfig(nextConfig);
      rebuild(processes, nextConfig);
    },
    [config, processes, rebuild]
  );

  const setTimeQuantum = useCallback(
    (timeQuantum: number) => {
      const nextConfig = { ...config, timeQuantum };
      setConfig(nextConfig);
      rebuild(processes, nextConfig);
    },
    [config, processes, rebuild]
  );

  const setContextSwitchCost = useCallback(
    (contextSwitchCost: number) => {
      const nextConfig = { ...config, contextSwitchCost };
      setConfig(nextConfig);
      rebuild(processes, nextConfig);
    },
    [config, processes, rebuild]
  );

  const addProcess = useCallback(() => {
    setProcesses((prev) => {
      const name = nextProcessName(prev);
      const maxArrival = prev.length === 0 ? 0 : Math.max(...prev.map((p) => p.arrivalTime));
      const next: ProcessInput = {
        id: `proc-${Date.now()}-${prev.length}`,
        name,
        arrivalTime: maxArrival,
        burstTime: 1,
        priority: 1,
      };
      const updated = [...prev, next];
      rebuild(updated, config);
      return updated;
    });
  }, [config, rebuild]);

  const updateProcess = useCallback(
    (id: string, patch: Partial<Omit<ProcessInput, "id" | "name">>) => {
      setProcesses((prev) => {
        const updated = prev.map((p) => (p.id === id ? { ...p, ...patch } : p));
        rebuild(updated, config);
        return updated;
      });
    },
    [config, rebuild]
  );

  const removeProcess = useCallback(
    (id: string) => {
      setProcesses((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        rebuild(updated, config);
        return updated;
      });
    },
    [config, rebuild]
  );

  const resetProcesses = useCallback(() => {
    setProcesses(seedProcesses);
    rebuild(seedProcesses, config);
  }, [config, rebuild]);

  return {
    processes,
    config,
    clock,
    timeline,
    metrics,
    isRunning,
    isFinished,
    run,
    pause,
    step,
    reset,
    setAlgorithm,
    setTimeQuantum,
    setContextSwitchCost,
    addProcess,
    updateProcess,
    removeProcess,
    resetProcesses,
  };
};