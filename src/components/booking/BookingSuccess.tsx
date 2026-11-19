import type { RefObject } from 'react';
import { Icon } from '@/components/ui';
import { BOOKING_COPY, formatDate, formatRon, pluralRo } from '@/libs';
import type { BookingDraft, BookingEstimate, FleetCar } from '@/types';

export interface BookingSuccessProps {
  car: FleetCar;
  draft: BookingDraft;
  estimate: BookingEstimate | null;
  headingRef: RefObject<HTMLHeadingElement | null>;
}

export function BookingSuccess({ car, draft, estimate, headingRef }: BookingSuccessProps) {
  const S = BOOKING_COPY.success;
  const rows: [string, string][] = [
    [S.car, car.carName],
    [S.date, formatDate(draft.preferredDate)],
    [S.slot, draft.preferredTimeSlot ? BOOKING_COPY.slots[draft.preferredTimeSlot] : ''],
  ];
  if (draft.lessonsCount != null) rows.push([S.lessons, pluralRo(draft.lessonsCount, 'lecție', 'lecții')]);
  if (estimate) rows.push([S.estimate, formatRon(estimate.total)]);

  return (
    <div className="flex flex-col items-center gap-md text-center py-md">
      <Icon name="check_circle" size={48} filled className="text-primary-container" />
      <h3 ref={headingRef} tabIndex={-1} className="text-headline-md text-on-surface focus:outline-none">
        {S.title}
      </h3>
      <dl className="w-full flex flex-col gap-2 text-body-md text-left">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 border-b border-outline-variant/30 pb-2">
            <dt className="text-on-surface-variant">{label}</dt>
            <dd className="text-on-surface text-right">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
