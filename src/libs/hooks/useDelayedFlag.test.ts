import { afterEach, describe, expect, it, vi } from 'vitest';
import { createDelayedFlag } from './useDelayedFlag';

afterEach(() => vi.useRealTimers());

describe('createDelayedFlag (no flash < 200ms, ≥ 400ms once shown)', () => {
  it('an active period of 150ms never shows', () => {
    vi.useFakeTimers();
    const changes: boolean[] = [];
    const flag = createDelayedFlag((v) => changes.push(v));
    flag.update(true);
    vi.advanceTimersByTime(150);
    flag.update(false);
    vi.advanceTimersByTime(1000);
    expect(changes).toEqual([]);
  });

  it('an active period of 250ms shows for at least 400ms', () => {
    vi.useFakeTimers();
    const changes: [boolean, number][] = [];
    const flag = createDelayedFlag((v) => changes.push([v, Date.now()]));
    const t0 = Date.now();
    flag.update(true);
    vi.advanceTimersByTime(250);
    flag.update(false);
    vi.advanceTimersByTime(1000);
    expect(changes.map(([v]) => v)).toEqual([true, false]);
    expect(changes[0][1] - t0).toBe(200);
    expect(changes[1][1] - changes[0][1]).toBeGreaterThanOrEqual(400);
  });
});
