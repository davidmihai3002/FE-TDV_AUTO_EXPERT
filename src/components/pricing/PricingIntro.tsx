import { PRICING_COPY } from '@/libs';

/** The page's only H1 (copy per breakpoint). */
export function PricingIntro({ variant }: { variant: 'desktop' | 'mobile' }) {
  if (variant === 'desktop') {
    return (
      <header>
        <h1 className="text-headline-xl text-on-surface mb-sm">{PRICING_COPY.title.desktop}</h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl">{PRICING_COPY.lead.desktop}</p>
      </header>
    );
  }
  return (
    <header className="flex flex-col gap-base">
      <h1 className="text-headline-lg-mobile text-on-surface">{PRICING_COPY.title.mobile}</h1>
      <p className="text-body-md text-on-surface-variant">{PRICING_COPY.lead.mobile}</p>
    </header>
  );
}
