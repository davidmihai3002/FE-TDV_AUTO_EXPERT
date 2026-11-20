import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { Icon } from '@/components/ui';
import { cn, useDocumentMeta, useOnlineStatus, type ErrorVariant } from '@/libs';
import { A11Y_COPY, CONTACT_LINE, ERROR_COPY, type ErrorAction, type ErrorCopy } from '../copy';
import { useContactInfo } from '../useContactInfo';

export interface ErrorPageProps {
  variant: ErrorVariant;
  onRetry?: () => void | Promise<unknown>;
  standalone?: boolean;
  copy?: Partial<ErrorCopy>;
  statusCode?: number;
  requestId?: string;
  debug?: { message?: string; stack?: string };
  announce?: boolean;
  connectionError?: boolean;
}

const BTN_BASE =
  'w-full sm:w-auto inline-flex items-center justify-center text-label-md transition-all py-[15px] px-6 rounded-lg uppercase gap-2 active:scale-95 md:py-sm md:px-lg md:rounded-xs md:normal-case md:gap-xs md:active:scale-100';
const BTN_PRIMARY = cn(
  BTN_BASE,
  'bg-primary-container text-on-primary-fixed font-bold border border-primary-container shadow-lg shadow-primary-container/20 hover:bg-primary-fixed-dim md:hover:bg-primary-container md:hover:opacity-90',
);
const BTN_SECONDARY = cn(
  BTN_BASE,
  'bg-transparent border border-outline text-on-surface hover:bg-surface-container md:border-surface-container-highest md:text-on-surface-variant md:backdrop-blur-sm md:hover:bg-transparent md:hover:border-secondary md:hover:text-secondary',
);

export function ErrorPage({
  variant,
  onRetry,
  standalone = false,
  copy: override,
  statusCode,
  requestId,
  debug,
  announce = false,
  connectionError = false,
}: ErrorPageProps) {
  const copy: ErrorCopy = { ...ERROR_COPY[variant], ...override };
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [busy, setBusy] = useState(false);
  const [liveText, setLiveText] = useState('');
  const online = useOnlineStatus();
  const contact = useContactInfo();
  const code = statusCode ?? (variant === 'not-found' ? 404 : variant === 'server' && !connectionError ? 500 : undefined);
  const chip =
    variant === 'server' && connectionError
      ? A11Y_COPY.connectionErrorChip
      : variant === 'server' && code && code !== 500
        ? `Cod eroare ${code}`
        : copy.chip;

  useDocumentMeta({ title: copy.documentTitle, noindex: true });

  useEffect(() => {
    if (announce) return;
    window.scrollTo(0, 0);
    headingRef.current?.focus({ preventScroll: true });
  }, [announce]);

  const retry = async () => {
    if (busy) return;
    setBusy(true);
    setLiveText(A11Y_COPY.retrying);
    try {
      await (onRetry ? onRetry() : window.location.reload());
    } finally {
      setBusy(false);
      setLiveText('');
      headingRef.current?.focus({ preventScroll: true });
    }
  };

  const wasOffline = useRef(!online);
  useEffect(() => {
    if (variant !== 'offline') return;
    if (!online) {
      wasOffline.current = true;
      return;
    }
    if (wasOffline.current) {
      wasOffline.current = false;
      setLiveText(A11Y_COPY.backOnline);
      void retry();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online, variant]);

  const renderAction = (action: ErrorAction, cls: string): ReactNode => {
    const content = (
      <>
        <Icon name={action.icon} size={20} className="max-md:!text-[18px] max-md:!w-[18px] max-md:!h-[18px]" />
        {action.label}
      </>
    );
    if (action.kind === 'retry') {
      return (
        <button type="button" onClick={() => void retry()} disabled={busy} aria-busy={busy || undefined} className={cn(cls, busy && 'opacity-80 cursor-wait')}>
          <Icon name={action.icon} size={20} className={cn('max-md:!text-[18px] max-md:!w-[18px] max-md:!h-[18px]', busy && 'animate-loader-spin')} />
          {action.label}
        </button>
      );
    }
    if (action.kind === 'href') {
      const href = action.href === '{phone}' ? contact.phone?.href : action.href;
      if (!href) return null;
      return (
        <a href={href} className={cls}>
          {content}
        </a>
      );
    }
    return standalone ? (
      <a href={action.to} className={cls}>
        {content}
      </a>
    ) : (
      <Link to={action.to} className={cls}>
        {content}
      </Link>
    );
  };

  const linkTo = (to: string, label: string, cls: string) =>
    standalone ? (
      <a key={to} href={to} className={cls}>
        {label}
      </a>
    ) : (
      <Link key={to} to={to} className={cls}>
        {label}
      </Link>
    );

  return (
    <section
      aria-labelledby="error-title"
      className={cn(
        'motion-static relative isolate flex-grow flex flex-col items-center justify-center overflow-hidden px-margin-mobile py-xl md:px-margin-desktop',
        standalone ? 'min-h-dvh' : 'min-h-[70vh]',
        'md:[background-image:linear-gradient(to_right,rgba(153,144,119,.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(153,144,119,.05)_1px,transparent_1px)] md:[background-size:40px_40px]',
      )}
    >
      <div aria-hidden className="md:hidden absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(28,42,65,0.4),var(--color-background)_70%)]" />

      <div className="relative w-full max-w-sm md:max-w-3xl flex flex-col items-center text-center gap-xl md:gap-0">
        <div aria-hidden className="md:hidden relative w-32 h-32 flex items-center justify-center animate-loader-glow motion-reduce:[filter:drop-shadow(0_0_16px_rgb(255_215_0/0.35))]">
          <div className="absolute inset-0 border-2 border-primary-container/20 rounded-pill scale-125" />
          <div className="absolute inset-0 border border-primary-container/10 rounded-pill scale-150" />
          <Icon name={copy.icon} filled size={48} className="!text-[100px] !w-[100px] !h-[100px] text-primary-container" />
        </div>
        <div aria-hidden className="hidden md:flex relative mb-md items-center justify-center">
          <div className="absolute inset-0 bg-primary-container rounded-pill opacity-10 blur-xl" />
          <div className="relative z-10 p-lg bg-surface-container-high border border-outline-variant/30 rounded-pill flex items-center justify-center animate-error-pulse">
            <Icon name={copy.icon} filled size={48} className="!text-[80px] !w-20 !h-20 text-primary-container [font-variation-settings:'FILL'_1,'wght'_300,'GRAD'_0,'opsz'_48]" />
          </div>
        </div>

        <div className="z-10 flex flex-col items-center gap-sm px-4 md:px-0 md:mb-lg" role={announce ? 'alert' : undefined}>
          <span className="hidden md:inline-flex items-center gap-xs px-sm py-xs mb-xs bg-surface-container-high border border-outline-variant/50 rounded-pill">
            <Icon name={copy.chipIcon} filled size={16} className="text-error" />
            <span className="text-label-sm text-on-surface-variant uppercase tracking-widest">{chip}</span>
          </span>
          <h1
            id="error-title"
            ref={headingRef}
            tabIndex={-1}
            className="focus:outline-none font-headline text-headline-lg-mobile uppercase tracking-wider text-on-background md:text-headline-xl md:normal-case md:tracking-[-0.02em] md:text-primary-fixed md:mb-sm"
          >
            {code !== undefined && <span className="sr-only">{A11Y_COPY.errorPrefix(code)}</span>}
            <span className="md:hidden">{copy.titleMobile}</span>
            <span className="hidden md:inline">{copy.title}</span>
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-[280px] md:max-w-2xl mx-auto">
            <span className="md:hidden">{copy.messageMobile}</span>
            <span className="hidden md:inline">{copy.message}</span>
          </p>
        </div>

        <div className="z-10 w-full flex flex-col items-center">
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-md px-2 sm:w-auto sm:px-0">
            {renderAction(copy.primary, BTN_PRIMARY)}
            {renderAction(copy.secondary, BTN_SECONDARY)}
          </div>
          {copy.tertiary &&
            (copy.tertiary.kind === 'link'
              ? linkTo(copy.tertiary.to, copy.tertiary.label, 'mt-md text-label-md text-on-surface-variant underline-offset-4 decoration-secondary hover:text-secondary hover:underline')
              : renderAction(copy.tertiary, 'mt-md text-label-md text-on-surface-variant hover:text-secondary'))}
          {copy.suggestions && (
            <p className="mt-md flex flex-wrap items-center justify-center gap-x-md gap-y-xs text-label-md text-on-surface-variant">
              <span>{copy.suggestions.label}</span>
              {copy.suggestions.links.map((l) => linkTo(l.to, l.label, 'text-secondary hover:underline underline-offset-4'))}
            </p>
          )}
          <p className="mt-lg text-label-sm text-on-surface-variant">
            {CONTACT_LINE.lead}
            {contact.phone && (
              <a href={contact.phone.href} className="text-secondary hover:underline">
                {contact.phone.display}
              </a>
            )}
            {contact.email && (
              <>
                {CONTACT_LINE.or}
                <a href={`mailto:${contact.email}`} className="text-secondary hover:underline">
                  {contact.email}
                </a>
              </>
            )}
            {CONTACT_LINE.end}
            {requestId && CONTACT_LINE.ref(requestId)}
          </p>
          {import.meta.env.DEV && debug && (debug.message || debug.stack) && (
            <details className="mt-md w-full max-w-2xl text-left text-label-sm text-on-surface-variant">
              <summary className="cursor-pointer">Detalii tehnice (doar în dezvoltare)</summary>
              <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-[11px]">
                {debug.message}
                {debug.stack && `\n\n${debug.stack}`}
              </pre>
            </details>
          )}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {liveText}
      </p>
      {standalone && (
        <>
          <div aria-hidden className="md:hidden fixed top-margin-mobile left-margin-mobile flex gap-1 z-0 opacity-20">
            <span className="w-1 h-1 bg-primary-container rounded-[9999px]" />
            <span className="w-1 h-1 bg-primary-container rounded-[9999px]" />
            <span className="w-1 h-1 bg-primary-container rounded-[9999px]" />
          </div>
          <p aria-hidden className="md:hidden fixed bottom-margin-mobile right-margin-mobile font-mono text-[10px] text-on-surface-variant/30 uppercase z-0">
            {copy.decoCode}
          </p>
        </>
      )}
    </section>
  );
}
