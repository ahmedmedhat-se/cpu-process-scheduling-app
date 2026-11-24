import type { SchedulingPolicy } from "./SchedulingPolicy";

export const fcfsPolicy: SchedulingPolicy = {
  isPreemptive: false,
  selectNext(readyQueue) {
    return readyQueue.length > 0 ? readyQueue[0] : null;
  },
  shouldPreempt() {
    return false;
  },
};