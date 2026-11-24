import type { SchedulingPolicy } from "./SchedulingPolicy";

export const roundRobinPolicy: SchedulingPolicy = {
  isPreemptive: true,
  selectNext(readyQueue) {
    return readyQueue.length > 0 ? readyQueue[0] : null;
  },
  shouldPreempt(_current, quantumUsed, config) {
    return config.timeQuantum !== undefined && quantumUsed >= config.timeQuantum;
  },
};