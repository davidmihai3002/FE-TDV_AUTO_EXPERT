import { Button, Icon } from '@/components/ui';
import { cn } from '@/libs';
import type { LandingSection } from '@/types';

const VISIBILITY = (s: LandingSection) =>
  s.showOnDesktop && s.showOnMobile ? '' : !s.showOnMobile ? 'hidden md:block' : 'md:hidden';

export function CtaBanner({ section, href }: { section: LandingSection; href: string }) {
  return (
    <section
      aria-labelledby="cta-heading"
      className={cn('order-7 relative z-10 w-full max-w-7xl mx-auto px-margin-mobile pt-2 pb-8 md:px-margin-desktop md:pt-0 md:pb-0', VISIBILITY(section))}
    >
      <div className="relative overflow-hidden flex flex-col items-center text-center gap-3 bg-gradient-to-br from-surface-container-high to-surface-container p-6 rounded-2xl shadow-xl md:max-w-3xl md:mx-auto md:p-lg">
        <div aria-hidden className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-container/10 rounded-full blur-xl pointer-events-none" />
        {section.eyebrowIcon && <Icon name={section.eyebrowIcon} size={30} className="text-primary-container" />}
        <h2 id="cta-heading" className="font-headline text-[20px] leading-8 font-semibold text-primary md:text-headline-lg">
          {section.title}
        </h2>
        {section.subtitle && <p className="text-[14px] leading-5 text-on-surface-variant md:text-body-lg">{section.subtitle}</p>}
        <Button to={href} className="w-full mt-2 py-3.5 max-md:shadow-md md:w-auto md:px-8 md:py-3 whitespace-normal text-center">
          {section.primaryCtaLabel ?? 'Programează o lecție'}
        </Button>
      </div>
    </section>
  );
}
