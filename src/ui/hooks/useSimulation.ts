import { useCallback, useEffect, useRef, useState } from "react";
import { SimulationEngine } from "../../engine/SimulationEngine";
import type { ProcessInput } from "../../domain/process";
import type { AlgorithmKind, SimulationConfig } from "../../domain/simulation";
import type { AggregateMetrics } from "../../domain/metrics";
import type { TimelineEntry } from "../../domain/timeline";

const defaultInputs: ProcessInput[] = [
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
}

const STEP_INTERVAL_MS = 400;

export function useSimulation(): UseSimulationResult {
  const engineRef = useRef<SimulationEngine | null>(null);
  const intervalRef = useRef<number | null>(null);

  const [config, setConfig] = useState<SimulationConfig>(defaultConfig);
  const [clock, setClock] = useState(0);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [metrics, setMetrics] = useState<AggregateMetrics>(emptyMetrics);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  if (engineRef.current === null) {
    engineRef.current = new SimulationEngine(defaultInputs, defaultConfig);
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
    (nextConfig: SimulationConfig) => {
      clearTimer();
      engineRef.current = new SimulationEngine(defaultInputs, nextConfig);
      setClock(0);
      setTimeline([]);
      setMetrics(emptyMetrics);
      setIsRunning(false);
      setIsFinished(false);
    },
    [clearTimer]
  );

  const reset = useCallback(() => {
    rebuild(config);
  }, [config, rebuild]);

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
      rebuild(nextConfig);
    },
    [config, rebuild]
  );

  const setTimeQuantum = useCallback(
    (timeQuantum: number) => {
      const nextConfig = { ...config, timeQuantum };
      setConfig(nextConfig);
      rebuild(nextConfig);
    },
    [config, rebuild]
  );

  const setContextSwitchCost = useCallback(
    (contextSwitchCost: number) => {
      const nextConfig = { ...config, contextSwitchCost };
      setConfig(nextConfig);
      rebuild(nextConfig);
    },
    [config, rebuild]
  );

  return {
    processes: defaultInputs,
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
  };
};