import { observer } from 'mobx-react-lite';
import { useId } from 'react';
import { Button, Icon } from '@/components/ui';
import {
  BODY_TYPE_LABEL,
  ELECTRIC_META_LABEL,
  TRANSMISSION_LABEL,
  formatAcceleration,
  formatHorsepower,
} from '@/libs';
import type { FleetCarInstance } from '@/store';
import { FLEET_COPY } from './fleet-copy';
import { FleetCardBadge } from './FleetCardBadge';
import { FleetCardStats } from './FleetCardStats';
import { FleetImage } from './FleetImage';
import { FleetSpecRow } from './FleetSpecRow';
import { InstructorContact } from './InstructorContact';

export interface FleetCardProps {
  car: FleetCarInstance;
  priority?: 'high' | 'eager' | 'lazy';
  showStats?: boolean;
  showInstructor?: boolean;
  onBook: (car: FleetCarInstance) => void;
  bookButtonRef?: (el: HTMLButtonElement | null) => void;
}

export const FleetCard = observer(function FleetCard({
  car,
  priority = 'lazy',
  showStats = false,
  showInstructor = false,
  onBook,
  bookButtonRef,
}: FleetCardProps) {
  const titleId = useId();
  const isElectric = car.fuel === 'electric';
  const secondMeta = isElectric
    ? { icon: 'electric_car', label: ELECTRIC_META_LABEL }
    : car.bodyType
      ? { icon: 'directions_car', label: BODY_TYPE_LABEL[car.bodyType] }
      : null;

  return (
    <article
      aria-labelledby={titleId}
      className="group h-full flex flex-col overflow-hidden bg-surface-container-highest border border-surface-variant md:border-[#334155] rounded-lg md:rounded-xl shadow-deep-mobile md:shadow-deep transition-all duration-300 hover:border-primary-container hover:shadow-glow focus-within:border-primary-container focus-within:shadow-glow"
    >
      <div className="relative w-full h-48 md:h-64 overflow-hidden bg-surface-dim">
        <FleetImage
          src={car.imageUrl}
          alt={car.imageAlt}
          priority={priority}
          imgClassName="motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-105"
        />
        <FleetCardBadge category={car.category} label={car.badgeLabel} className="absolute top-2 right-2 md:top-3 md:right-3" />
      </div>

      <div className="p-6 flex flex-col gap-3 md:gap-0 flex-grow">
        <h2
          id={titleId}
          tabIndex={-1}
          data-car-heading={car.slug}
          className="text-[20px] leading-tight font-semibold text-on-surface md:text-headline-md md:mb-3 focus:outline-none"
        >
          {car.series && (
            <span className="hidden md:inline">
              {car.series}:<br />
            </span>
          )}
          <span className="md:text-secondary-container">{car.carName}</span>
        </h2>

        <dl className={`hidden md:block space-y-3 flex-grow ${showInstructor && car.instructor ? 'mb-6' : 'mb-12'}`}>
          <FleetSpecRow icon="settings" label={FLEET_COPY.spec.transmission} value={car.transmissionText} />
          {car.horsepower != null && (
            <FleetSpecRow icon="speed" label={FLEET_COPY.spec.horsepower} value={formatHorsepower(car.horsepower)} />
          )}
          {car.zeroToHundredSeconds != null && (
            <FleetSpecRow
              icon="timer"
              label={FLEET_COPY.spec.acceleration}
              value={formatAcceleration(car.zeroToHundredSeconds)}
            />
          )}
          {showStats && <FleetCardStats successRate={car.successRate} averageGrade={car.averageGrade} layout="rows" />}
        </dl>

        <dl className="md:hidden flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-label-sm text-on-surface-variant">
          <div className="flex items-center gap-2">
            <dt className="sr-only">{FLEET_COPY.spec.transmission}</dt>
            <Icon name="settings" size={16} className="text-secondary" />
            <dd>{TRANSMISSION_LABEL[car.transmission]}</dd>
          </div>
          {secondMeta && (
            <div className="flex items-center gap-2">
              <Icon name={secondMeta.icon} size={16} className="text-secondary" />
              <dd>{secondMeta.label}</dd>
            </div>
          )}
          {showStats && <FleetCardStats successRate={car.successRate} averageGrade={car.averageGrade} layout="inline" />}
        </dl>

        {showInstructor && car.instructor && <InstructorContact instructor={car.instructor} />}

        <Button
          ref={bookButtonRef}
          variant="primary"
          block
          radius="xs"
          onClick={() => onBook(car)}
          aria-label={FLEET_COPY.card.ctaAria(car.carName)}
          aria-haspopup="dialog"
          className="mt-auto py-3 px-4 rounded-lg md:rounded-xs whitespace-normal text-center uppercase tracking-wide md:normal-case md:tracking-[0.05em] max-md:mt-4 active:scale-95"
        >
          <span className="md:hidden">{FLEET_COPY.card.ctaMobile}</span>
          <span className="hidden md:inline">{FLEET_COPY.card.ctaDesktop}</span>
        </Button>
      </div>
    </article>
  );
});
