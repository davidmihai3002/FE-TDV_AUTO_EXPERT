import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from './api-client';
import { retryDelay, shouldRetry, withRetry } from './retry';

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('retry policy (ticket 07 §7.3)', () => {
  it('retries only transient failures', () => {
    vi.stubGlobal('navigator', { onLine: true });
    expect(shouldRetry(new ApiError('network', 'x'))).toBe(true);
    expect(shouldRetry(new ApiError('timeout', 'x'))).toBe(true);
    for (const s of [408, 429, 502, 503, 504]) expect(shouldRetry(new ApiError('http', 'x', s))).toBe(true);
    for (const s of [400, 404, 409, 500]) expect(shouldRetry(new ApiError('http', 'x', s))).toBe(false);
    expect(shouldRetry(new ApiError('abort', 'x'))).toBe(false);
    vi.stubGlobal('navigator', { onLine: false });
    expect(shouldRetry(new ApiError('network', 'x'))).toBe(false);
  });

  it('backs off 500ms then 1500ms (±100ms) and honours a short Retry-After', () => {
    const mid = () => 0.5;
    expect(retryDelay(new ApiError('timeout', 'x'), 0, undefined, mid)).toBe(500);
    expect(retryDelay(new ApiError('timeout', 'x'), 1, undefined, mid)).toBe(1500);
    expect(retryDelay(new ApiError('timeout', 'x'), 0, undefined, () => 1)).toBe(600);
    expect(retryDelay(new ApiError('http', 'x', 429, undefined, { retryAfterMs: 2000 }), 0)).toBe(2000);
    expect(retryDelay(new ApiError('http', 'x', 503, undefined, { retryAfterMs: 30_000 }), 0)).toBeNull();
  });

  it('makes at most 3 attempts, then throws the last error', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('navigator', { onLine: true });
    const fn = vi.fn().mockRejectedValue(new ApiError('http', 'x', 503));
    const p = withRetry(fn);
    const assertion = expect(p).rejects.toMatchObject({ status: 503 });
    await vi.advanceTimersByTimeAsync(3000);
    await assertion;
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('does not retry a 500 and succeeds after a transient failure', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('navigator', { onLine: true });
    const once500 = vi.fn().mockRejectedValue(new ApiError('http', 'x', 500));
    await expect(withRetry(once500)).rejects.toMatchObject({ status: 500 });
    expect(once500).toHaveBeenCalledTimes(1);
    const flaky = vi.fn().mockRejectedValueOnce(new ApiError('timeout', 'x')).mockResolvedValue('ok');
    const p = withRetry(flaky);
    await vi.advanceTimersByTimeAsync(700);
    await expect(p).resolves.toBe('ok');
  });
});
