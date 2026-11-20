import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { BookingDialog } from '@/components/booking';
import {
  FLEET_COPY,
  FleetCard,
  FleetCardSkeleton,
  FleetEmptyState,
  FleetFilters,
  FleetGrid,
  FleetHero,
  FleetNotice,
} from '@/components/fleet';
import { InlineError } from '@/components/feedback/InlineError';
import { ROUTES } from '@/config';
import {
  BOOKING_PARAM,
  FLEET_PARAM,
  bookingKey,
  fleetFiltersKey,
  hasInvalidFleetParams,
  parseBookingSearchParams,
  parseFleetSearchParams,
  toFleetSearchParams,
  withBooking,
  withoutBooking,
} from '@/libs';
import { useStore, type FleetCarInstance } from '@/store';
import type { FleetFilters as Filters } from '@/types';
import { FLEET_UI } from './fleet.config';

const NOINDEX_PARAMS = [...Object.values(FLEET_PARAM), ...Object.values(BOOKING_PARAM)];

const FleetPage = observer(function FleetPage() {
  const { fleet, booking } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseFleetSearchParams(searchParams), [searchParams]);
  const filtersKey = fleetFiltersKey(filters);
  const bKey = bookingKey(searchParams);
  const bookButtons = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    if (hasInvalidFleetParams(searchParams)) {
      setSearchParams(toFleetSearchParams(filters, searchParams), { replace: true });
    }
  }, [searchParams, filters, setSearchParams]);

  useEffect(() => {
    void fleet.fetch(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, fleet]);

  useEffect(() => {
    const { slug, prefill } = parseBookingSearchParams(searchParams);
    if (slug) void booking.openForSlug(slug, prefill);
    else booking.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bKey, booking]);

  const { notice } = booking;
  useEffect(() => {
    if (notice) setSearchParams((sp) => withoutBooking(sp), { replace: true });
  }, [notice, setSearchParams]);

  const onBook = useCallback(
    (car: FleetCarInstance) => setSearchParams((sp) => withBooking(sp, car.slug), { replace: true }),
    [setSearchParams],
  );

  const onCloseDialog = useCallback(() => {
    const slug = booking.car?.slug;
    booking.close();
    setSearchParams((sp) => withoutBooking(sp), { replace: true });
    window.requestAnimationFrame(() => {
      const target =
        (slug && bookButtons.current.get(slug)) ||
        (slug && document.querySelector<HTMLElement>(`[data-car-heading="${slug}"]`)) ||
        document.querySelector<HTMLElement>('main');
      target?.focus();
    });
  }, [booking, setSearchParams]);

  const onFiltersChange = useCallback(
    (next: Filters) => setSearchParams((sp) => toFleetSearchParams(next, sp), { replace: true }),
    [setSearchParams],
  );
  const onClearFilters = useCallback(() => onFiltersChange({}), [onFiltersChange]);

  const registerButton = useCallback(
    (slug: string) => (el: HTMLButtonElement | null) => {
      if (el) bookButtons.current.set(slug, el);
      else bookButtons.current.delete(slug);
    },
    [],
  );

  const showSkeleton = fleet.status === 'idle' || fleet.isInitialLoading;
  const noindex = NOINDEX_PARAMS.some((k) => searchParams.has(k));
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="flex flex-col">
      <title>{FLEET_COPY.meta.title}</title>
      <meta name="description" content={FLEET_COPY.meta.description} />
      <link rel="canonical" href={`${origin}${ROUTES.fleet}`} />
      {noindex && <meta name="robots" content="noindex,follow" />}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={FLEET_COPY.meta.title} />
      <meta property="og:description" content={FLEET_COPY.meta.description} />
      <meta property="og:url" content={`${origin}${ROUTES.fleet}`} />
      {fleet.items[0] && <meta property="og:image" content={new URL(fleet.items[0].imageUrl, origin).href} />}

      <FleetHero
        titleMobile={FLEET_COPY.hero.titleMobile}
        titleDesktop={FLEET_COPY.hero.titleDesktop}
        introMobile={FLEET_COPY.hero.introMobile}
        introDesktop={FLEET_COPY.hero.introDesktop}
      >
        {FLEET_UI.showFilters && (
          <FleetFilters
            value={filters}
            facets={fleet.facets}
            total={fleet.total}
            overallTotal={fleet.overallTotal}
            onChange={onFiltersChange}
            onClear={onClearFilters}
            disabled={showSkeleton}
          />
        )}
      </FleetHero>

      <div className="w-full mx-auto max-w-md md:max-w-7xl px-margin-mobile md:px-margin-desktop pt-12 md:pt-0 pb-20">
        {booking.notice && (
          <FleetNotice message={FLEET_COPY.notice[booking.notice]} onDismiss={booking.dismissNotice} />
        )}

        {fleet.status === 'error' ? (
          <InlineError
            error={fleet.error ?? { variant: 'server', userMessage: '', retryable: true }}
            title={FLEET_COPY.error.title}
            section="mașini"
            onRetry={() => fleet.fetch(filters)}
            className="my-md"
          />
        ) : showSkeleton ? (
          <>
            <p className="sr-only" aria-live="polite">
              {FLEET_COPY.loadingSr}
            </p>
            <FleetGrid busy>
              <FleetCardSkeleton />
            </FleetGrid>
          </>
        ) : fleet.isEmpty ? (
          <FleetEmptyState
            variant={fleet.hasActiveFilters ? 'filtered' : 'none'}
            onClear={onClearFilters}
          />
        ) : (
          <FleetGrid busy={fleet.isRefetching} dimmed={fleet.isRefetching}>
            {fleet.items.map((car, i) => (
              <li key={car.id}>
                <FleetCard
                  car={car}
                  priority={i === 0 ? 'high' : i < 3 ? 'eager' : 'lazy'}
                  showStats={FLEET_UI.showStats}
                  showInstructor={FLEET_UI.showInstructor}
                  onBook={onBook}
                  bookButtonRef={registerButton(car.slug)}
                />
              </li>
            ))}
          </FleetGrid>
        )}
      </div>

      {fleet.items.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: fleet.items.map((car, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Car',
                name: car.carName,
                vehicleTransmission: car.transmission,
                fuelType: car.fuel,
                ...(car.bodyType ? { bodyType: car.bodyType } : {}),
                image: new URL(car.imageUrl, origin).href,
                url: `${origin}${ROUTES.fleet}?${BOOKING_PARAM.slug}=${car.slug}`,
              },
            })),
          })}
        </script>
      )}

      <BookingDialog onClose={onCloseDialog} />
    </div>
  );
});

export default FleetPage;
