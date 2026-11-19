import { useState } from 'react';
import { ErrorBoundary, ErrorPage, InlineError, PageLoader } from '@/components/feedback';
import { cn } from '@/libs';

const TABS = [
  'loader-fullscreen',
  'loader-inline',
  'error-404',
  'error-500',
  'error-offline',
  'error-500-standalone',
  'inline-error',
  'boundary',
] as const;
type Tab = (typeof TABS)[number];

function Boom(): never {
  throw new Error('Test crash from /__states');
}

/** DEV only (/__states): every loading/error state, for QA without breaking the API. */
export default function StatesPreviewPage() {
  const [tab, setTab] = useState<Tab>('error-404');
  const [crash, setCrash] = useState(false);
  return (
    <div className="flex flex-col">
      <title>Stări · dev</title>
      <nav aria-label="Stări" className="relative z-[110] bg-background flex flex-wrap gap-2 p-4 border-b border-outline-variant/30">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            data-tab={t}
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={cn('px-3 py-1 rounded-xs text-label-sm border', tab === t ? 'bg-primary-container text-on-primary-container border-primary-container' : 'border-outline-variant')}
          >
            {t}
          </button>
        ))}
      </nav>
      {tab === 'loader-fullscreen' && <PageLoader variant="fullscreen" delayMs={0} />}
      {tab === 'loader-inline' && <PageLoader variant="inline" delayMs={0} />}
      {tab === 'error-404' && <ErrorPage variant="not-found" announce />}
      {tab === 'error-500' && (
        <ErrorPage variant="server" announce requestId="7f1c2a9e-1234" onRetry={() => new Promise((r) => setTimeout(r, 1200))} debug={{ message: 'Demo', stack: 'at demo()' }} />
      )}
      {tab === 'error-offline' && <ErrorPage variant="offline" announce onRetry={() => new Promise((r) => setTimeout(r, 800))} />}
      {tab === 'error-500-standalone' && <ErrorPage variant="server" standalone announce />}
      {tab === 'inline-error' && (
        <div className="max-w-xl mx-auto w-full p-6 flex flex-col gap-6">
          <InlineError error={{ variant: 'server', userMessage: '', retryable: true }} section="articole" onRetry={() => new Promise((r) => setTimeout(r, 800))} />
          <InlineError error={{ variant: 'offline', userMessage: '', retryable: true }} onRetry={() => undefined} />
        </div>
      )}
      {tab === 'boundary' && (
        <div className="p-6">
          <ErrorBoundary resetKeys={[tab]}>
            <button type="button" onClick={() => setCrash(true)} className="px-4 py-2 border border-outline-variant rounded-xs">
              Aruncă o eroare în render
            </button>
            {crash && <Boom />}
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
}
