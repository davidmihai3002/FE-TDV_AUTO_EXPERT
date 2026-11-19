import type { ReactNode } from 'react';
import { cn } from '@/libs';

export interface FleetHeroProps {
  titleMobile: string;
  titleDesktop: string;
  introMobile: string;
  introDesktop: string;
  /** Filters slot (sits under the intro). */
  children?: ReactNode;
}

/** One `<h1>`; the hidden span is display:none so only the visible text is announced. */
export function FleetHero({ titleMobile, titleDesktop, introMobile, introDesktop, children }: FleetHeroProps) {
  return (
    <section className="relative overflow-hidden px-margin-mobile pt-12 md:px-margin-desktop md:pt-20 md:pb-12 text-center">
      <div
        aria-hidden
        className="hidden md:block absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,var(--color-secondary-container)_0%,transparent_70%)]"
      />
      <div className="relative z-10 mx-auto max-w-md md:max-w-7xl flex flex-col gap-3 md:gap-0">
        <h1 className="text-headline-lg-mobile text-on-surface md:text-headline-xl md:text-primary-container md:uppercase md:tracking-tight md:mb-6">
          <span className="md:hidden">{titleMobile}</span>
          <span className="hidden md:inline">{titleDesktop}</span>
        </h1>
        <p
          className={cn(
            'text-body-md text-on-surface-variant md:text-body-lg md:max-w-2xl md:mx-auto',
            children ? 'md:mb-12' : 'md:mb-20',
          )}
        >
          <span className="md:hidden">{introMobile}</span>
          <span className="hidden md:inline">{introDesktop}</span>
        </p>
        {children}
      </div>
    </section>
  );
}
