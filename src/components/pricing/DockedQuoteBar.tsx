import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui';
import { PRICING_COPY, cn } from '@/libs';
import type { QuoteBreakdownVM } from '@/types';
import { BookNowLink } from './BookNowLink';
import { QuoteBreakdownRows } from './QuoteBreakdownRows';
import { useAnnouncedTotal } from './useAnnouncedTotal';

export interface DockedQuoteBarProps {
  breakdown: QuoteBreakdownVM | null;
  checkFailed: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNext: boolean;
  bookingHref: string | null;
  bookAriaLabel?: string;
  onBack: () => void;
  onNext: () => void;
  onReset: () => void;
}

export function DockedQuoteBar(props: DockedQuoteBarProps) {
  const { breakdown, checkFailed, isFirstStep, isLastStep, canGoNext, bookingHref, bookAriaLabel, onBack, onNext, onReset } = props;
  const total = breakdown?.totalFormatted ?? null;
  const announcement = useAnnouncedTotal(total);
  const [details, setDetails] = useState(false);

  const [shown, setShown] = useState(total);
  const fading = total !== shown;
  useEffect(() => {
    if (total === shown) return;
    const t = window.setTimeout(() => setShown(total), 150);
    return () => window.clearTimeout(t);
  }, [total, shown]);

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-surface-container-lowest border-t border-surface-variant shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto p-margin-mobile pb-[calc(16px+env(safe-area-inset-bottom))] flex flex-col gap-sm">
        <div className="flex justify-between items-end gap-3">
          <div className="min-w-0">
            <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">{PRICING_COPY.estimate.titleMobile}</p>
            <p className="flex flex-wrap items-baseline gap-x-xs">
              <span
                className={cn(
                  'font-headline font-bold text-primary-container text-[40px] leading-[48px] min-[360px]:text-headline-xl tabular-nums motion-safe:transition-opacity motion-safe:duration-150',
                  fading && 'opacity-50',
                )}
              >
                {shown ?? '—'}
              </span>
              {breakdown?.vatIncluded && <span className="text-body-md text-on-surface-variant">{PRICING_COPY.estimate.vat}</span>}
            </p>
            <p className="text-label-sm text-on-surface-variant">{PRICING_COPY.estimate.disclaimer}</p>
            {checkFailed && <p className="text-label-sm text-error">{PRICING_COPY.estimate.checkFailed}</p>}
            <p className="sr-only" aria-live="polite" aria-atomic="true">
              {announcement}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <button type="button" onClick={onReset} className="text-label-sm text-secondary underline hover:text-primary-container">
              {PRICING_COPY.cta.reset}
            </button>
            {breakdown && (
              <button
                type="button"
                aria-expanded={details}
                aria-controls="docked-breakdown"
                onClick={() => setDetails((v) => !v)}
                className="text-label-sm text-secondary"
              >
                {details ? PRICING_COPY.estimate.hideDetails : PRICING_COPY.estimate.showDetails}
              </button>
            )}
          </div>
        </div>
        {breakdown && (
          <div id="docked-breakdown" hidden={!details} className="border-t border-surface-variant pt-sm">
            <QuoteBreakdownRows breakdown={breakdown} />
          </div>
        )}
        <div className="flex gap-sm mt-xs">
          {!isFirstStep && (
            <button
              type="button"
              onClick={onBack}
              className="flex-1 flex items-center justify-center gap-xs border border-surface-variant bg-surface-container-high text-on-surface py-sm rounded-lg text-label-md active:scale-95 transition-transform"
            >
              <Icon name="arrow_back" size={16} />
              {PRICING_COPY.cta.back}
            </button>
          )}
          {isLastStep ? (
            <BookNowLink href={bookingHref} variant="docked" ariaLabel={bookAriaLabel} />
          ) : (
            <button
              type="button"
              onClick={() => canGoNext && onNext()}
              aria-disabled={!canGoNext || undefined}
              title={canGoNext ? undefined : PRICING_COPY.cta.nextDisabledHint}
              aria-describedby={canGoNext ? undefined : 'next-disabled-hint'}
              className={cn(
                'flex-[2] bg-primary-container text-on-primary-container py-sm rounded-lg text-label-md font-bold transition-all',
                canGoNext
                  ? 'shadow-[0_0_15px_rgba(255,215,0,0.2)] hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] active:scale-95'
                  : 'opacity-50 cursor-not-allowed',
              )}
            >
              {PRICING_COPY.cta.next}
            </button>
          )}
          {!canGoNext && !isLastStep && (
            <span id="next-disabled-hint" className="sr-only">
              {PRICING_COPY.cta.nextDisabledHint}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
