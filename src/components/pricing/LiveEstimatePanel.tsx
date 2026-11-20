import { Icon } from '@/components/ui';
import { PRICING_COPY } from '@/libs';
import type { QuoteBreakdownVM } from '@/types';
import { BookNowLink } from './BookNowLink';
import { QuoteBreakdownRows } from './QuoteBreakdownRows';
import { useAnnouncedTotal } from './useAnnouncedTotal';

export interface LiveEstimatePanelProps {
  breakdown: QuoteBreakdownVM | null;
  isRecalculating: boolean;
  checkFailed: boolean;
  bookingHref: string | null;
  bookAriaLabel?: string;
}

export function LiveEstimatePanel({ breakdown, isRecalculating, checkFailed, bookingHref, bookAriaLabel }: LiveEstimatePanelProps) {
  const announcement = useAnnouncedTotal(breakdown?.totalFormatted ?? null);
  return (
    <aside
      aria-labelledby="live-estimate-title"
      className="sticky top-28 bg-surface-container-high border border-surface-variant rounded-xl p-md shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] flex flex-col gap-md"
    >
      <div className="flex justify-between items-center border-b border-surface-variant pb-sm">
        <h2 id="live-estimate-title" className="text-headline-md text-on-surface">
          {PRICING_COPY.estimate.titleDesktop}
        </h2>
        <Icon
          name="sensors"
          className={`text-primary-container ${isRecalculating || breakdown ? 'motion-safe:animate-pulse' : ''}`}
        />
      </div>
      {breakdown ? (
        <QuoteBreakdownRows breakdown={breakdown} />
      ) : (
        <p className="text-body-md text-on-surface-variant font-mono">—</p>
      )}
      <hr className="border-surface-variant" />
      <div className="flex flex-col gap-xs">
        <div className="flex justify-between items-end gap-4">
          <span className="text-label-md text-on-surface-variant uppercase tracking-widest">{PRICING_COPY.estimate.total}</span>
          <span className="font-mono tabular-nums text-[40px] leading-[48px] font-bold text-primary-container">
            {breakdown?.totalFormatted ?? '—'}
          </span>
        </div>
        <p className="text-right text-label-sm text-on-surface-variant">
          {PRICING_COPY.estimate.disclaimer}
          {breakdown?.vatIncluded && ` · ${PRICING_COPY.estimate.vat}`}
        </p>
        {checkFailed && <p className="text-right text-label-sm text-error">{PRICING_COPY.estimate.checkFailed}</p>}
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>
      </div>
      <BookNowLink href={bookingHref} variant="panel" ariaLabel={bookAriaLabel} />
    </aside>
  );
}
