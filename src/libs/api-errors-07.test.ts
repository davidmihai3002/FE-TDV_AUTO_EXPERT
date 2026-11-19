import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from './api-client';
import { API_ERROR_COPY, toUiError, toUserMessage } from './api-errors';

const http = (status: number, body?: object) => new ApiError('http', 'x', status, body as never);
const setOnline = (online: boolean) => vi.stubGlobal('navigator', { onLine: online });

afterEach(() => vi.unstubAllGlobals());

describe('toUserMessage (ticket 07 §5.3)', () => {
  it.each([
    ['400 validation (issues)', http(400, { message: 'Validation failed', issues: [{ path: 'phone' }] }), API_ERROR_COPY.validation],
    ['400 validation (string[])', http(400, { message: ['phone: bad'] }), API_ERROR_COPY.validation],
    ['400 other', http(400, { message: 'Malformed JSON body' }), API_ERROR_COPY.badRequest],
    ['404', http(404), API_ERROR_COPY.notFound],
    ['410', http(410), API_ERROR_COPY.notFound],
    ['409', http(409), API_ERROR_COPY.conflict],
    ['429', http(429), 'Prea multe încercări. Încearcă din nou în câteva minute.'],
    ['500', http(500), API_ERROR_COPY.server],
    ['502', http(502), API_ERROR_COPY.unavailable],
    ['503', http(503), API_ERROR_COPY.unavailable],
    ['504', http(504), API_ERROR_COPY.unavailable],
    ['401', http(401), API_ERROR_COPY.unexpected],
    ['timeout', new ApiError('timeout', 'x'), API_ERROR_COPY.timeout],
    ['parse', new ApiError('parse', 'x'), API_ERROR_COPY.parse],
    ['unknown thrown value', new Error('boom'), API_ERROR_COPY.unexpected],
  ])('%s', (_label, error, expected) => {
    setOnline(true);
    expect(toUserMessage(error)).toBe(expected);
  });

  it('network: offline vs online', () => {
    setOnline(false);
    expect(toUserMessage(new ApiError('network', 'x'))).toBe(API_ERROR_COPY.offline);
    setOnline(true);
    expect(toUserMessage(new ApiError('network', 'x'))).toBe(API_ERROR_COPY.network);
  });

  it('aborted requests show nothing', () => {
    expect(toUserMessage(new ApiError('abort', 'x'))).toBe('');
  });

  it('never returns the English API message', () => {
    setOnline(true);
    expect(toUserMessage(http(500, { message: 'select * from secret' }))).not.toMatch(/secret/);
  });
});

describe('toUiError (ticket 07 §5.2)', () => {
  it('maps variants and retryability', () => {
    setOnline(true);
    expect(toUiError(http(404))).toMatchObject({ variant: 'not-found', retryable: false, statusCode: 404 });
    expect(toUiError(http(503))).toMatchObject({ variant: 'server', retryable: true });
    expect(toUiError(http(500))).toMatchObject({ variant: 'server', retryable: true });
    expect(toUiError(http(400))).toMatchObject({ variant: 'server', retryable: false });
    expect(toUiError(new ApiError('timeout', 'x'))).toMatchObject({ variant: 'server', retryable: true });
    expect(toUiError(new ApiError('network', 'x'))).toMatchObject({ variant: 'server' });
    setOnline(false);
    expect(toUiError(new ApiError('network', 'x'))).toMatchObject({ variant: 'offline', retryable: true });
  });

  it('react-router ErrorResponse 404 → not-found; render crash → server', () => {
    setOnline(true);
    expect(toUiError({ status: 404, statusText: 'Not Found', data: null })).toMatchObject({ variant: 'not-found' });
    expect(toUiError(new TypeError('x is undefined'))).toMatchObject({ variant: 'server', retryable: true });
  });

  it('keeps the request id for support', () => {
    const e = new ApiError('http', 'x', 500, undefined, { requestId: 'abc12345-xyz' });
    expect(toUiError(e).requestId).toBe('abc12345-xyz');
  });
});
