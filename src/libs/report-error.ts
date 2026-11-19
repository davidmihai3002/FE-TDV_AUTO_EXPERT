/** Single integration point for error reporting (Sentry later). DEV: console; prod: no-op for now. */
export function reportError(error: unknown, context?: Record<string, unknown>): void {
  if (import.meta.env.DEV) console.error('[reportError]', error, context ?? '');
}
