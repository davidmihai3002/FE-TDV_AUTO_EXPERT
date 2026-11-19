import { Icon } from '@/components/ui';
import { cn } from '@/libs';
import type { Feature, LandingSection } from '@/types';
import { featureAccentText, featureTileMobile } from './accent';
import { SectionEyebrow } from './SectionEyebrow';

export function FeatureCard({ feature }: { feature: Feature }) {
  const accent = featureAccentText[feature.accent];
  return (
    <article
      className={cn(
        'relative overflow-hidden flex flex-col gap-2 bg-surface-container p-5 rounded-xl shadow-md',
        'md:gap-4 md:p-md md:rounded-lg md:border md:border-outline-variant/30 md:shadow-deep',
        'md:transition-all md:duration-300 md:hover:border-primary-container md:hover:shadow-glow',
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-lg mb-1 md:mb-0 md:w-12 md:h-12 md:rounded-xs md:bg-surface-container-high',
          featureTileMobile[feature.accent],
          accent,
        )}
      >
        <span className="inline-flex md:hidden">
          <Icon name={feature.iconMobile ?? feature.icon} />
        </span>
        <span className="hidden md:inline-flex">
          <Icon name={feature.icon} />
        </span>
      </div>
      <h3 className="font-headline text-[18px] leading-7 font-semibold text-primary md:text-[20px] md:leading-8 md:text-on-surface">
        {feature.title}
      </h3>
      <p className="text-[14px] leading-relaxed text-on-surface-variant md:text-body-md">{feature.description}</p>
      {feature.tags.length > 0 && (
        <ul className="md:hidden flex flex-wrap items-center gap-2 pt-2">
          {feature.tags.map((tag, i) => (
            <li
              key={tag}
              className={cn(
                'text-[11px] leading-4 bg-surface-container-high px-2.5 py-1 rounded-xs',
                i === 0 ? cn(accent, 'font-semibold') : 'text-on-surface-variant',
              )}
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export function ExpertAdvantage({ section, features }: { section: LandingSection; features: Feature[] }) {
  return (
    <section
      aria-labelledby="advantage-heading"
      className="order-3 md:order-2 relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-md px-margin-mobile py-6 md:px-margin-desktop md:py-0 md:gap-0"
    >
      <div className="md:w-2/3 md:mb-lg flex flex-col md:gap-md">
        {section.eyebrow && <SectionEyebrow icon={section.eyebrowIcon} label={section.eyebrow} tone="secondary" />}
        <h2 id="advantage-heading" className="text-headline-md md:text-headline-lg text-primary">
          {section.title}
        </h2>
        {section.subtitle && (
          <p className="mt-2 md:mt-0 text-body-md leading-relaxed md:leading-6 text-on-surface-variant">{section.subtitle}</p>
        )}
      </div>
      <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-gutter">
        {features.map((f) => (
          <FeatureCard key={f.id} feature={f} />
        ))}
      </div>
    </section>
  );
}
