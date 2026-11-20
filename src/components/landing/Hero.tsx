import { Button, Icon } from '@/components/ui';
import type { LandingSection } from '@/types';
import { SafeImage } from './SafeImage';

export interface HeroProps {
  hero: LandingSection;
  bookingHref: string;
  pricingHref: string;
}

export function Hero({ hero, bookingHref, pricingHref }: HeroProps) {
  const extra = hero.extra as { telemetryLabel?: string; telemetryStatus?: string };
  return (
    <section
      aria-labelledby="hero-heading"
      className="order-1 relative z-10 overflow-hidden md:overflow-visible w-full max-w-7xl mx-auto px-margin-mobile pt-4 pb-base md:px-margin-desktop md:pt-xl md:pb-0"
    >
      <div aria-hidden className="md:hidden absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative flex flex-col gap-sm md:grid md:grid-cols-12 md:gap-gutter md:items-center md:min-h-[60vh]">
        <div className="flex flex-col gap-sm md:col-span-6 md:gap-md">
          {hero.eyebrow && (
            <p className="flex items-center gap-xs md:gap-2 w-fit px-3 py-1 rounded-pill bg-surface-container-high shadow-sm md:shadow-none md:border md:border-outline-variant/50">
              {hero.eyebrowIcon && (
                <>
                  <span className="inline-flex md:hidden">
                    <Icon name={hero.eyebrowIcon} size={16} filled className="text-primary-container" />
                  </span>
                  <span className="hidden md:inline-flex">
                    <Icon name={hero.eyebrowIcon} size={16} className="text-primary-container" />
                  </span>
                </>
              )}
              <span className="text-[11px] leading-4 font-semibold uppercase tracking-wider text-primary-container md:text-label-sm md:font-medium md:tracking-widest md:text-on-surface-variant">
                {hero.eyebrow}
              </span>
            </p>
          )}
          <h1 id="hero-heading" className="text-headline-lg-mobile tracking-tight text-primary mt-1 md:mt-0 md:text-headline-xl">
            {hero.title}
            {hero.titleHighlight && (
              <span className="text-primary-container">
                {hero.titleHighlight}
                {hero.titleSuffix}
              </span>
            )}
          </h1>
          {hero.subtitle && (
            <p className="text-body-md leading-relaxed text-on-surface-variant md:text-body-lg md:max-w-lg md:border-l-2 md:border-primary-container md:pl-4">
              {hero.subtitle}
            </p>
          )}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-sm md:gap-4 pt-2 md:pt-4">
            <Button
              to={bookingHref}
              trailingIcon="arrow_forward"
              className="max-md:w-full max-md:py-3.5 max-md:shadow-md md:shadow-glow-strong whitespace-normal md:whitespace-nowrap text-center"
            >
              {hero.primaryCtaLabel ?? 'Programează o lecție'}
            </Button>
            {hero.secondaryCtaLabel && (
              <>
                <Button
                  to={pricingHref}
                  variant="tonal"
                  leadingIcon={hero.secondaryCtaIcon ?? undefined}
                  className="md:hidden w-full py-3.5 whitespace-normal text-center"
                >
                  {hero.secondaryCtaLabel}
                </Button>
                <Button to={pricingHref} variant="outline" className="hidden md:inline-flex whitespace-nowrap">
                  {hero.secondaryCtaLabel}
                </Button>
              </>
            )}
          </div>
        </div>

        {hero.imageUrl && (
          <div className="relative mt-3 md:mt-0 md:col-span-6 md:h-full md:flex md:items-center md:justify-center">
            <div aria-hidden className="hidden md:block absolute inset-0 bg-gradient-to-tr from-secondary-container/20 to-primary-container/20 opacity-50 rounded-xl blur-3xl" />
            <SafeImage
              src={hero.imageUrl}
              alt={hero.imageAlt ?? ''}
              width={1024}
              height={1024}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="hidden md:block relative z-10 w-full h-full object-cover rounded-xl drop-shadow-2xl motion-safe:hover:scale-105 motion-safe:transition-transform motion-safe:duration-500 ease-out"
            />
            <div className="md:hidden relative rounded-xl overflow-hidden bg-surface-container-low shadow-xl">
              <SafeImage
                src={hero.imageUrl}
                alt={hero.imageAltMobile ?? hero.imageAlt ?? ''}
                width={1024}
                height={1024}
                loading="eager"
                decoding="async"
                className="w-full aspect-square object-cover object-center"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
              {extra.telemetryLabel && (
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 bg-surface-container-highest/85 backdrop-blur-md px-3 py-2 rounded-lg">
                  <span className="flex items-center gap-2 min-w-0">
                    <span aria-hidden className="relative flex h-2 w-2 shrink-0">
                      <span className="motion-safe:animate-ping absolute h-full w-full rounded-full bg-secondary-container opacity-75" />
                      <span className="relative h-2 w-2 rounded-full bg-secondary-container" />
                    </span>
                    <span className="text-label-sm font-medium text-on-surface truncate">{extra.telemetryLabel}</span>
                  </span>
                  {extra.telemetryStatus && (
                    <span className="text-[11px] leading-4 font-semibold uppercase text-primary-container shrink-0">
                      {extra.telemetryStatus}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
