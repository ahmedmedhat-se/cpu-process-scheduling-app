import type { ProcessInput, ProcessRuntime } from "../domain/process";
import type { SimulationConfig, SimulationState, TickResult } from "../domain/simulation";
import type { ProcessId } from "../domain/process";
import type { AggregateMetrics } from "../domain/metrics";
import { TimelineRecorder } from "./timeline/TimelineRecorder";
import { computeMetrics } from "./metrics/computeMetrics";
import type { SchedulingPolicy } from "./policies/SchedulingPolicy";
import { fcfsPolicy } from "./policies/fcfs";
import { sjfPolicy } from "./policies/sjf";
import { roundRobinPolicy } from "./policies/roundRobin";
import { priorityPolicy } from "./policies/priority";

const policies: Record<SimulationConfig["algorithm"], SchedulingPolicy> = {
  fcfs: fcfsPolicy,
  sjf: sjfPolicy,
  rr: roundRobinPolicy,
  priority: priorityPolicy,
};

export class SimulationEngine {
  private readonly policy: SchedulingPolicy;
  private readonly config: SimulationConfig;
  private readonly inputs: ProcessInput[];
  private readonly recorder = new TimelineRecorder();

  private processes: ProcessRuntime[];
  private readyQueue: ProcessId[] = [];
  private runningId: ProcessId | null = null;
  private clock = 0;
  private contextSwitchRemaining = 0;
  private currentQuantumUsed = 0;
  private contextSwitchCount = 0;
  private idleTime = 0;
  private finished = false;

  constructor(inputs: ProcessInput[], config: SimulationConfig) {
    if (config.algorithm === "rr" && (config.timeQuantum === undefined || config.timeQuantum <= 0)) {
      throw new Error("Round Robin requires a positive timeQuantum.");
    }

    this.inputs = inputs.map((input) => ({ ...input }));
    this.config = { ...config };
    this.policy = policies[config.algorithm];
    this.processes = this.buildRuntime();
  }

  private buildRuntime(): ProcessRuntime[] {
    return this.inputs.map((input) => ({
      input,
      state: "ready",
      remainingTime: input.burstTime,
    }));
  }

  step(): TickResult {
    if (this.finished) {
      return this.tickResult(null, true, false, [], true);
    }

    this.admitArrivals();

    if (this.contextSwitchRemaining > 0) {
      this.contextSwitchRemaining -= 1;
      this.recorder.append(this.clock, null, "switch");
      this.clock += 1;
      this.checkCompletion();
      return this.tickResult(null, true, false, [], this.finished);
    }

    let ranId: ProcessId | null = null;
    let switched = false;
    const completed: ProcessId[] = [];

    if (this.runningId) {
      const running = this.getRuntime(this.runningId)!;
      running.remainingTime -= 1;
      this.currentQuantumUsed += 1;
      this.recorder.append(this.clock, running.input.id, "run");
      ranId = running.input.id;
      this.clock += 1;

      if (running.remainingTime === 0) {
        running.state = "terminated";
        running.completionTime = this.clock;
        this.runningId = null;
        this.currentQuantumUsed = 0;
        completed.push(running.input.id);
      } else if (this.policy.isPreemptive && this.policy.shouldPreempt(running, this.currentQuantumUsed, this.config)) {
        running.state = "ready";
        this.readyQueue.push(running.input.id);
        this.runningId = null;
        this.currentQuantumUsed = 0;
      }
    } else {
      const nextId = this.policy.selectNext(this.readyQueue, this.processes, this.config);

      if (nextId === null) {
        this.idleTime += 1;
        this.recorder.append(this.clock, null, "idle");
        this.clock += 1;
      } else {
        this.readyQueue = this.readyQueue.filter((id) => id !== nextId);
        const next = this.getRuntime(nextId)!;
        next.state = "running";
        next.firstStartTime ??= this.clock;
        this.runningId = nextId;
        this.currentQuantumUsed = 0;

        if (this.config.contextSwitchCost > 0) {
          this.contextSwitchRemaining = this.config.contextSwitchCost;
          this.contextSwitchCount += 1;
          switched = true;
          this.recorder.append(this.clock, null, "switch");
          this.clock += 1;
        }
      }
    }

    this.checkCompletion();
    return this.tickResult(ranId, ranId === null && !switched, switched, completed, this.finished);
  }

  runToCompletion(): void {
    while (!this.finished) {
      this.step();
    }
  }

  getMetrics(): AggregateMetrics {
    return computeMetrics({
      processes: this.processes,
      timeline: this.recorder.snapshot(),
      contextSwitches: this.contextSwitchCount,
    });
  }

  getState(): SimulationState {
    return {
      clock: this.clock,
      processes: this.processes.map((p) => ({ ...p })),
      readyQueue: [...this.readyQueue],
      runningId: this.runningId,
      contextSwitchRemaining: this.contextSwitchRemaining,
      currentQuantumUsed: this.currentQuantumUsed,
      timeline: this.recorder.snapshot(),
      contextSwitchCount: this.contextSwitchCount,
      idleTime: this.idleTime,
      finished: this.finished,
    };
  }

  private admitArrivals(): void {
    for (const process of this.processes) {
      if (process.state === "ready" && process.remainingTime === process.input.burstTime) {
        if (process.input.arrivalTime === this.clock && !this.readyQueue.includes(process.input.id) && this.runningId !== process.input.id) {
          this.readyQueue.push(process.input.id);
        }
      }
    }
  }

  private getRuntime(id: ProcessId): ProcessRuntime | undefined {
    return this.processes.find((process) => process.input.id === id);
  }

  private checkCompletion(): void {
    this.finished = this.processes.every((process) => process.state === "terminated");
  }

  private tickResult(
    ranProcessId: ProcessId | null,
    idle: boolean,
    switched: boolean,
    completedProcessIds: ProcessId[],
    finished: boolean
  ): TickResult {
    return {
      clock: this.clock,
      ranProcessId,
      idle,
      switched,
      completedProcessIds,
      finished,
    };
  }
};