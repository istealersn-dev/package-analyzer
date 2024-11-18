"use client";

export class RateLimiter {
  private queue: Array<() => void> = [];
  private running = 0;
  private readonly concurrency: number;

  constructor(concurrency = 3) {
    this.concurrency = concurrency;
  }

  async add<T>(fn: () => Promise<T>): Promise<T> {
    if (this.running >= this.concurrency) {
      await new Promise<void>(resolve => this.queue.push(resolve));
    }

    this.running++;
    try {
      const result = await fn();
      return result;
    } finally {
      this.running--;
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        next?.();
      }
    }
  }
}