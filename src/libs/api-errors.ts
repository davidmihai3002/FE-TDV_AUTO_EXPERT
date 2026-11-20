import type { ApiIssue } from '@/types';
import { ApiError } from './api-client';
import { VALIDATION_MESSAGES } from './validation-messages';

export type ErrorVariant = 'not-found' | 'server' | 'offline';

export interface UiError {
  variant: ErrorVariant;
  statusCode?: number;
  message?: string;
  userMessage: string;
  requestId?: string;
  retryable: boolean;
}

export const API_ERROR_COPY = {
  validation: 'Unele câmpuri nu sunt completate corect. Verifică datele și încearcă din nou.',
  badRequest: 'Cererea nu a putut fi procesată. Încearcă din nou.',
  notFound: 'Nu am găsit ce căutai. Este posibil să fi fost mutat sau șters.',
  conflict: 'Această cerere a fost deja trimisă. Te contactăm în curând.',
  tooMany: 'Prea multe încercări. Încearcă din nou în câteva minute.',
  server: 'A apărut o eroare de partea noastră. Încearcă din nou în câteva momente.',
  unavailable: 'Serviciul este temporar indisponibil. Încearcă din nou în câteva minute.',
  unexpected: 'A apărut o eroare neașteptată. Încearcă din nou.',
  offline: 'Nu ești conectat la internet. Verifică conexiunea și încearcă din nou.',
  network: 'Nu am putut contacta serverul. Încearcă din nou în câteva momente.',
  timeout: 'Serverul răspunde greu. Încearcă din nou.',
  parse: 'Am primit un răspuns neașteptat de la server. Încearcă din nou.',
} as const;

const isOffline = () => typeof navigator !== 'undefined' && navigator.onLine === false;

export function toUserMessage(e: unknown): string {
  if (!(e instanceof ApiError)) return API_ERROR_COPY.unexpected;
  switch (e.kind) {
    case 'abort':
      return '';
    case 'network':
      return isOffline() ? API_ERROR_COPY.offline : API_ERROR_COPY.network;
    case 'timeout':
      return API_ERROR_COPY.timeout;
    case 'parse':
      return API_ERROR_COPY.parse;
    case 'http': {
      const s = e.status ?? 0;
      if (s === 400 || s === 422) {
        const validation = Array.isArray(e.body?.message) || (e.body?.issues?.length ?? 0) > 0;
        return validation ? API_ERROR_COPY.validation : API_ERROR_COPY.badRequest;
      }
      if (s === 404 || s === 410) return API_ERROR_COPY.notFound;
      if (s === 409) return API_ERROR_COPY.conflict;
      if (s === 429) return API_ERROR_COPY.tooMany;
      if (s === 500) return API_ERROR_COPY.server;
      if (s === 502 || s === 503 || s === 504) return API_ERROR_COPY.unavailable;
      return API_ERROR_COPY.unexpected;
    }
  }
}

export function toUiError(e: unknown): UiError {
  const userMessage = toUserMessage(e) || API_ERROR_COPY.unexpected;
  if (e instanceof ApiError) {
    const base = { userMessage, message: e.message, requestId: e.requestId, statusCode: e.status };
    switch (e.kind) {
      case 'network':
        return isOffline() ? { ...base, variant: 'offline', retryable: true } : { ...base, variant: 'server', retryable: true };
      case 'timeout':
      case 'parse':
      case 'abort':
        return { ...base, variant: 'server', retryable: true };
      case 'http': {
        const s = e.status ?? 0;
        if (s === 404 || s === 410) return { ...base, variant: 'not-found', retryable: false };
        return { ...base, variant: 'server', retryable: [408, 429].includes(s) || s >= 500 };
      }
    }
  }
  if (e && typeof e === 'object' && 'status' in e && 'statusText' in e) {
    const status = Number((e as { status: unknown }).status);
    return status === 404
      ? { variant: 'not-found', statusCode: 404, userMessage: API_ERROR_COPY.notFound, retryable: false }
      : { variant: 'server', statusCode: status, userMessage: API_ERROR_COPY.unexpected, retryable: true };
  }
  return {
    variant: isOffline() ? 'offline' : 'server',
    userMessage,
    message: e instanceof Error ? e.message : String(e),
    retryable: true,
  };
}

export const isAbortError = (e: unknown) => e instanceof ApiError && e.kind === 'abort';

export const ERROR_MESSAGES = {
  network: API_ERROR_COPY.network,
  timeout: API_ERROR_COPY.timeout,
  notFound: API_ERROR_COPY.notFound,
  tooMany: API_ERROR_COPY.tooMany,
  generic: VALIDATION_MESSAGES.generic,
} as const;

export function getErrorMessage(e: unknown): string {
  return toUserMessage(e) || ERROR_MESSAGES.generic;
}

const REASON_MESSAGES: Record<string, string> = {
  required: VALIDATION_MESSAGES.required,
  phone: VALIDATION_MESSAGES.phone,
  email: VALIDATION_MESSAGES.email,
  dateMin: VALIDATION_MESSAGES.dateMin,
  dateInvalid: VALIDATION_MESSAGES.dateInvalid,
  consent: VALIDATION_MESSAGES.consent,
  select: VALIDATION_MESSAGES.select,
};

const CODE_MESSAGES: Record<string, string> = {
  invalid_type: VALIDATION_MESSAGES.required,
  invalid_format: VALIDATION_MESSAGES.invalid,
  invalid_string: VALIDATION_MESSAGES.invalid,
  invalid_value: VALIDATION_MESSAGES.select,
  invalid_enum_value: VALIDATION_MESSAGES.select,
};

export function mapApiIssues(issues: ApiIssue[] = []): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    if (out[issue.path]) continue;
    out[issue.path] =
      (issue.reason && REASON_MESSAGES[issue.reason]) || CODE_MESSAGES[issue.code] || VALIDATION_MESSAGES.invalid;
  }
  return out;
}
