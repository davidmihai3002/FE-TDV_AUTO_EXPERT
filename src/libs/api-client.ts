import type { ApiErrorBody } from '@/types';
import { API_URL } from './env';

export type ApiErrorKind = 'http' | 'network' | 'timeout' | 'abort' | 'parse';

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly body?: ApiErrorBody;

  constructor(kind: ApiErrorKind, message: string, status?: number, body?: ApiErrorBody) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
    this.body = body;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }
}

type QueryValue = string | number | boolean | undefined | null | Array<string | number>;
export type Query = Record<string, QueryValue>;

export interface RequestOptions {
  query?: Query;
  signal?: AbortSignal;
  timeoutMs?: number;
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

async function request<T>(method: 'GET' | 'POST', path: string, opts: RequestOptions & { body?: unknown }): Promise<T> {
  const url = `${API_URL}${path}${buildQueryString(opts.query)}`;
  const timeout = AbortSignal.timeout(opts.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  const signal = opts.signal ? AbortSignal.any([opts.signal, timeout]) : timeout;

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
    if (e instanceof DOMException && e.name === 'TimeoutError') throw new ApiError('timeout', 'Request timed out');
    if (e instanceof DOMException && e.name === 'AbortError') {
      // AbortSignal.any reports the timeout's reason when the timeout fired first
      if (timeout.aborted) throw new ApiError('timeout', 'Request timed out');
      throw new ApiError('abort', 'Request aborted');
    }
    throw new ApiError('network', e instanceof Error ? e.message : 'Network error');
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let body: ApiErrorBody | undefined;
    try {
      body = text ? (JSON.parse(text) as ApiErrorBody) : undefined;
    } catch {
      body = undefined;
    }
    throw new ApiError('http', body?.message ?? (text || res.statusText), res.status, body);
  }

  if (res.status === 204) return undefined as T;
  try {
    return (await res.json()) as T;
  } catch {
    throw new ApiError('parse', 'Invalid JSON response', res.status);
  }
}

export function apiGet<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  return request<T>('GET', path, opts);
}

export function apiPost<T>(path: string, body: unknown, opts: RequestOptions = {}): Promise<T> {
  return request<T>('POST', path, { ...opts, body });
}

export const api = { get: apiGet, post: apiPost };
