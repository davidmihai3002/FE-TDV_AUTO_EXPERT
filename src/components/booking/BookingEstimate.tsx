import { BOOKING_COPY, formatRon, pluralRo } from '@/libs';
import type { BookingEstimate as Estimate } from '@/types';

export interface BookingEstimateProps {
  status: 'idle' | 'loading' | 'ready' | 'error';
  estimate: Estimate | null;
}

export function BookingEstimate({ status, estimate }: BookingEstimateProps) {
  const visible = status === 'loading' || (estimate !== null && status !== 'error');
  return (
    <div aria-live="polite">
      {visible && (
        <div className="flex flex-col gap-1 p-3 rounded-lg bg-surface-container-high">
          {estimate ? (
            <>
              <p className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-label-md text-on-surface-variant">{BOOKING_COPY.estimate.label}</span>
                <span className="font-mono tabular-nums text-[18px] leading-6 font-semibold text-primary-container">
                  {formatRon(estimate.total)} {BOOKING_COPY.estimate.for}{' '}
                  {pluralRo(estimate.lessons, 'lecție', 'lecții')}
                </span>
              </p>
              <p className="text-label-sm text-on-surface-variant">{BOOKING_COPY.estimate.note}</p>
            </>
          ) : (
            <p className="text-label-md text-on-surface-variant">{BOOKING_COPY.estimate.loading}</p>
          )}
        </div>
      )}
    </div>
  );
}
