import type { ApiErrorBody } from '@/types';
import { API_URL } from './env';
import { withRetry } from './retry';

export type ApiErrorKind = 'http' | 'network' | 'timeout' | 'abort' | 'parse';

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly body?: ApiErrorBody;
  /** x-request-id from the response (shown as "Cod referință" for support) */
  readonly requestId?: string;
  readonly url?: string;
  readonly method?: string;
  /** parsed Retry-After (429/503), ms */
  readonly retryAfterMs?: number;

  constructor(
    kind: ApiErrorKind,
    message: string,
    status?: number,
    body?: ApiErrorBody,
    meta: { requestId?: string; url?: string; method?: string; retryAfterMs?: number } = {},
  ) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
    this.body = body;
    this.requestId = meta.requestId;
    this.url = meta.url;
    this.method = meta.method;
    this.retryAfterMs = meta.retryAfterMs;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }
}

export const isApiError = (e: unknown): e is ApiError => e instanceof ApiError;

type QueryValue = string | number | boolean | undefined | null | Array<string | number>;
export type Query = Record<string, QueryValue>;

export interface RequestOptions {
  query?: Query;
  signal?: AbortSignal;
  timeoutMs?: number;
  /** GET only: automatic retries for transient failures (default true) */
  retry?: boolean;
}

const DEFAULT_TIMEOUT_MS = 10_000;

export function buildQueryString(query: Query = {}): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value)) value.forEach((v) => params.append(key, String(v)));
    else params.append(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

function parseRetryAfter(header: string | null): number | undefined {
  if (!header) return undefined;
  const seconds = Number(header);
  if (Number.isFinite(seconds)) return seconds * 1000;
  const date = Date.parse(header);
  return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}

async function request<T>(method: 'GET' | 'POST', path: string, opts: RequestOptions & { body?: unknown }): Promise<T> {
  const url = `${API_URL}${path}${buildQueryString(opts.query)}`;
  // per-attempt timeout
  const timeout = AbortSignal.timeout(opts.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  const signal = opts.signal ? AbortSignal.any([opts.signal, timeout]) : timeout;
  const meta = { url, method };

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      signal,
      headers: {
        Accept: 'application/json',
        ...(opts.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === 'TimeoutError') throw new ApiError('timeout', 'Request timed out', undefined, undefined, meta);
    if (e instanceof DOMException && e.name === 'AbortError') {
      // AbortSignal.any reports the timeout's reason when the timeout fired first
      if (timeout.aborted && !opts.signal?.aborted) throw new ApiError('timeout', 'Request timed out', undefined, undefined, meta);
      throw new ApiError('abort', 'Request aborted', undefined, undefined, meta);
    }
    throw new ApiError('network', e instanceof Error ? e.message : 'Network error', undefined, undefined, meta);
  }

  const requestId = res.headers.get('x-request-id') ?? undefined;
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let body: ApiErrorBody | undefined;
    try {
      body = text ? (JSON.parse(text) as ApiErrorBody) : undefined;
    } catch {
      body = undefined;
    }
    const message = Array.isArray(body?.message) ? body.message.join('; ') : body?.message;
    throw new ApiError('http', message ?? (text || res.statusText), res.status, body, {
      ...meta,
      requestId,
      retryAfterMs: parseRetryAfter(res.headers.get('retry-after')),
    });
  }

  if (res.status === 204) return undefined as T;
  try {
    return (await res.json()) as T;
  } catch {
    throw new ApiError('parse', 'Invalid JSON response', res.status, undefined, { ...meta, requestId });
  }
}

/** GETs retry transient failures (see retry.ts); POSTs never retry. */
export function apiGet<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  if (opts.retry === false) return request<T>('GET', path, opts);
  return withRetry(() => request<T>('GET', path, opts), { signal: opts.signal });
}

export function apiPost<T>(path: string, body: unknown, opts: RequestOptions = {}): Promise<T> {
  return request<T>('POST', path, { ...opts, body });
}

export const api = { get: apiGet, post: apiPost };
