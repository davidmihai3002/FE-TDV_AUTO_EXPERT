import { Link } from 'react-router';
import { ArrowLink, Icon } from '@/components/ui';
import { cn } from '@/libs';
import type { FleetHighlight, LandingSection } from '@/types';
import { specAccent } from './accent';
import { LANDING_COPY } from './landing-copy';
import { SafeImage } from './SafeImage';
import { SectionEyebrow } from './SectionEyebrow';

const STRETCH = "after:absolute after:inset-0 after:content-[''] focus-visible:outline-none";
const RING =
  'has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-primary-container';

export function FleetHighlightCard({ highlight, href }: { highlight: FleetHighlight; href: string }) {
  const link = (
    <Link to={href} aria-label={LANDING_COPY.fleetCardAria(highlight.name)} className={STRETCH}>
      {highlight.name}
    </Link>
  );
  return (
    <article className={cn('relative', RING, 'rounded-xl md:rounded-lg')}>
      <div className="hidden md:block relative bg-surface-container border border-outline-variant/30 rounded-lg overflow-hidden group">
        <div className="aspect-video w-full bg-surface-container relative">
          <SafeImage
            src={highlight.imageUrl}
            alt={highlight.imageAlt}
            loading="lazy"
            width={1280}
            height={720}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 motion-safe:transition-opacity motion-safe:duration-500"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 w-full p-md flex justify-between items-center gap-4">
          <div>
            <h3 className="text-headline-md text-on-surface">{link}</h3>
            <p className="text-label-sm text-on-surface-variant">{highlight.tagline}</p>
          </div>
          <span className="shrink-0 bg-primary-container text-on-primary-container px-3 py-1 rounded-xs text-label-sm font-bold shadow-lg">
            {highlight.badgeLabel}
          </span>
        </div>
      </div>
      <div className="md:hidden bg-surface-container rounded-xl overflow-hidden shadow-md flex flex-col">
        <div className="relative h-44 w-full overflow-hidden bg-surface-container-high">
          <SafeImage src={highlight.imageUrl} alt={highlight.imageAlt} loading="lazy" width={640} height={360} className="w-full h-full object-cover" />
          <span
            className={cn(
              'absolute top-3 left-3 px-2.5 py-1 rounded-xs text-[11px] leading-4 font-bold uppercase',
              highlight.badgeVariantMobile === 'secondary'
                ? 'bg-secondary-container text-on-secondary'
                : 'bg-primary-container text-on-primary-container',
            )}
          >
            {highlight.badgeLabel}
          </span>
        </div>
        <div className="p-4 flex flex-col gap-1.5">
          <div className="flex justify-between items-center gap-2">
            <h3 className="font-headline text-[18px] leading-7 font-semibold text-primary">{link}</h3>
            {highlight.highlightLabel && (
              <span className="shrink-0 flex items-center gap-1 text-label-sm font-semibold text-secondary">
                {highlight.highlightIcon && <Icon name={highlight.highlightIcon} size={16} />}
                {highlight.highlightLabel}
              </span>
            )}
          </div>
          <p className="text-[14px] leading-5 text-on-surface-variant">{highlight.description}</p>
          {highlight.specs.length > 0 && (
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 pt-2 border-t border-surface-container-high text-[12px] leading-4 text-on-surface-variant">
              {highlight.specs.map((spec) => (
                <li key={spec.label} className="flex items-center gap-1">
                  <Icon name={spec.icon} size={16} className={specAccent[spec.accent]} />
                  {spec.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}

export function FleetTeaser({ section, highlights, href }: { section: LandingSection; highlights: FleetHighlight[]; href: string }) {
  return (
    <section aria-labelledby="fleet-heading" className="order-4 relative z-10 bg-surface-container-low md:bg-transparent">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-sm px-margin-mobile py-6 md:px-margin-desktop md:py-0 md:mb-lg md:gap-0">
        <div className="flex items-end justify-between gap-3 md:mb-lg">
          <div className="flex flex-col md:gap-md md:w-2/3">
            {section.eyebrow && <SectionEyebrow icon={section.eyebrowIcon} label={section.eyebrow} tone="secondary" className="md:hidden tracking-wider" />}
            <h2 id="fleet-heading" className="text-headline-md md:text-headline-lg text-primary mt-1 md:mt-0">
              {section.title}
            </h2>
            {section.subtitle && <p className="hidden md:block text-body-md text-on-surface-variant">{section.subtitle}</p>}
          </div>
          <ArrowLink to={href} uppercase className="shrink-0">
            <span className="hidden md:inline">{section.primaryCtaLabel ?? LANDING_COPY.viewAllCars}</span>
            <span className="md:hidden text-[13px]">{LANDING_COPY.viewAllCarsShort}</span>
          </ArrowLink>
        </div>
        {section.subtitle && <p className="md:hidden text-body-md text-on-surface-variant">{section.subtitle}</p>}
        <div className="flex flex-col gap-4 mt-2 md:mt-0 md:grid md:grid-cols-2 md:gap-gutter">
          {highlights.map((h) => (
            <FleetHighlightCard key={h.id} highlight={h} href={href} />
          ))}
        </div>
      </div>
    </section>
  );
}
