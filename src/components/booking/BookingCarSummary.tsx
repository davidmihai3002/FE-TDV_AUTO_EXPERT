import { Icon } from '@/components/ui';
import { BOOKING_COPY, TRANSMISSION_LABEL } from '@/libs';
import type { FleetCar } from '@/types';
import { FleetCardBadge } from '../fleet/FleetCardBadge';

export interface BookingCarSummaryProps {
  car: FleetCar;
  licenseCategory: string | null;
  /** id of the name, referenced by the dialog's aria-describedby */
  nameId: string;
}

export function BookingCarSummary({ car, licenseCategory, nameId }: BookingCarSummaryProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-container border border-outline-variant/30">
      <img
        src={car.imageUrl}
        alt=""
        width={96}
        height={64}
        loading="eager"
        className="w-24 h-16 shrink-0 object-cover rounded-xs bg-surface-container-high"
      />
      <div className="flex flex-col gap-1 min-w-0">
        <p id={nameId} className="font-headline text-[18px] leading-6 font-semibold text-on-surface">
          {car.carName}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-label-sm text-on-surface-variant">
          <span className="inline-flex items-center gap-1">
            <Icon name="settings" size={16} />
            {TRANSMISSION_LABEL[car.transmission]}
          </span>
          <FleetCardBadge category={car.category} label={car.badgeLabel} size="compact" />
          {licenseCategory && (
            <span className="px-2 py-0.5 rounded-xs bg-surface-container-high text-on-surface">
              {BOOKING_COPY.summaryCategory(licenseCategory)}
            </span>
          )}
        </div>
        {car.instructor && (
          <p className="inline-flex items-center gap-1 text-label-sm text-on-surface-variant">
            <Icon name="person" size={16} />
            {BOOKING_COPY.summaryInstructor(car.instructor.fullName)}
          </p>
        )}
      </div>
    </div>
  );
}
