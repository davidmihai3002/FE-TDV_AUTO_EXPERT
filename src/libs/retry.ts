import type { ApiError } from './api-client';

/**
 * Automatic retry for idempotent GETs (ticket 07 §7.3): 3 attempts, backoff 500ms then 1500ms (±100ms jitter).
 * Retries network errors while online, timeouts and HTTP 408/429/502/503/504; never aborted requests, offline,
 * other 4xx or 500 (a 500 is likely deterministic; the user can still retry manually).
 */
export interface RetryPolicy {
  attempts: number;
  baseDelayMs: number;
  /** Retry-After above this gives up immediately */
  maxRetryAfterMs: number;
}

export const DEFAULT_RETRY_POLICY: RetryPolicy = { attempts: 3, baseDelayMs: 500, maxRetryAfterMs: 5000 };

const RETRY_STATUS = new Set([408, 429, 502, 503, 504]);

const isOnline = () => (typeof navigator === 'undefined' ? true : navigator.onLine !== false);

export function shouldRetry(e: unknown): boolean {
  const err = e as Partial<ApiError> | null;
  if (!err || typeof err !== 'object' || !('kind' in err)) return false;
  switch (err.kind) {
    case 'network':
      return isOnline();
    case 'timeout':
      return true;
    case 'http':
      return err.status !== undefined && RETRY_STATUS.has(err.status);
    default:
      return false;
  }
}

/** Delay before attempt n+1 (n = 0, 1, …): 500 × 3^n ± 100ms, or Retry-After when present. */
export function retryDelay(e: unknown, n: number, policy: RetryPolicy = DEFAULT_RETRY_POLICY, random = Math.random): number | null {
  const retryAfter = (e as Partial<ApiError>).retryAfterMs;
  if (retryAfter !== undefined) return retryAfter <= policy.maxRetryAfterMs ? retryAfter : null;
  return policy.baseDelayMs * 3 ** n + Math.round((random() * 2 - 1) * 100);
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);
    const t = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(t);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  { signal, policy = DEFAULT_RETRY_POLICY }: { signal?: AbortSignal; policy?: RetryPolicy } = {},
): Promise<T> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await fn();
    } catch (e) {
      if (attempt >= policy.attempts - 1 || !shouldRetry(e)) throw e;
      const delay = retryDelay(e, attempt, policy);
      if (delay === null) throw e;
      try {
        await sleep(delay, signal);
      } catch {
        throw e; // caller aborted during backoff: surface the original error (its kind decides the UI)
      }
    }
  }
}
