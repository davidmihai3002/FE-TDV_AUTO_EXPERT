import type { ApiIssue } from '@/types';
import { ApiError } from './api-client';
import { VALIDATION_MESSAGES } from './validation-messages';

/** Romanian user-facing copy for an error. Never shows the API `message`. Final wording owned by ticket 07. */
export const ERROR_MESSAGES = {
  network: 'Nu ne putem conecta la server. Verifică conexiunea la internet.',
  timeout: 'Serverul răspunde greu. Încearcă din nou.',
  notFound: 'Nu am găsit ce căutai.',
  tooMany: 'Prea multe încercări. Încearcă din nou în câteva minute.',
  generic: VALIDATION_MESSAGES.generic,
} as const;

export function getErrorMessage(e: unknown): string {
  if (e instanceof ApiError) {
    if (e.kind === 'network') return ERROR_MESSAGES.network;
    if (e.kind === 'timeout') return ERROR_MESSAGES.timeout;
    if (e.status === 404) return ERROR_MESSAGES.notFound;
    if (e.status === 429) return ERROR_MESSAGES.tooMany;
  }
  return ERROR_MESSAGES.generic;
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

/** Maps BE validation issues to `{ field: RomanianMessage }` (reason → code → "Câmp invalid"). First issue per field wins. */
export function mapApiIssues(issues: ApiIssue[] = []): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    if (out[issue.path]) continue;
    out[issue.path] =
      (issue.reason && REASON_MESSAGES[issue.reason]) || CODE_MESSAGES[issue.code] || VALIDATION_MESSAGES.invalid;
  }
  return out;
}
