import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui';
import { useOnlineStatus, type UiError } from '@/libs';
import { A11Y_COPY, INLINE_ERROR_COPY } from './copy';

export interface InlineErrorProps {
  error: UiError;
  onRetry?: () => void | Promise<unknown>;
  /** replaces the generic server-error title only (offline / not-found keep theirs) */
  title?: string;
  /** used in the retry button's accessible name */
  section?: string;
  className?: string;
}

/** Section-level error: the rest of the page keeps working. */
export function InlineError({ error, onRetry, title, section, className }: InlineErrorProps) {
  const copy = INLINE_ERROR_COPY[error.variant];
  const [busy, setBusy] = useState(false);
  const retry = async () => {
    if (!onRetry || busy) return;
    setBusy(true);
    try {
      await onRetry();
    } finally {
      setBusy(false);
    }
  };
  // offline auto-recovery: retry once when the connection comes back
  const online = useOnlineStatus();
  const wasOffline = useRef(!online);
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => {
    if (error.variant !== 'offline') return;
    if (!online) {
      wasOffline.current = true;
      return;
    }
    if (wasOffline.current) {
      wasOffline.current = false;
      setAnnouncement(A11Y_COPY.backOnline);
      void retry();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online, error.variant]);

  return (
    <div
      role="alert"
      className={`flex flex-col items-center text-center gap-sm py-lg px-md rounded-xl bg-surface-container-low border border-outline-variant/30 ${className ?? ''}`}
    >
      <span aria-hidden className="material-symbols-outlined icon-filled text-primary-container" style={{ fontSize: 40, width: 40, height: 40 }}>
        {error.variant === 'offline' ? 'wifi_off' : 'warning'}
      </span>
      <p className="font-headline text-headline-md text-on-surface">
        {error.variant === 'server' ? (title ?? copy.title) : copy.title}
      </p>
      <p className="text-body-md text-on-surface-variant">{copy.message}</p>
      {onRetry && error.variant !== 'not-found' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => void retry()}
          aria-busy={busy || undefined}
          disabled={busy}
          aria-label={section ? A11Y_COPY.retrySection(section) : undefined}
          leadingIcon="refresh"
          className={busy ? '[&_.material-symbols-outlined]:animate-loader-spin' : undefined}
        >
          {busy ? INLINE_ERROR_COPY.busy : INLINE_ERROR_COPY.button}
        </Button>
      )}
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}
