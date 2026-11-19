import { Accordion } from '@/components/ui';
import type { Faq, LandingSection } from '@/types';
import { SectionEyebrow } from './SectionEyebrow';

/** 01's Accordion (native <details>): several items may be open; keyboard-accessible. */
export function FaqSection({ section, faqs }: { section: LandingSection; faqs: Faq[] }) {
  return (
    <section
      aria-labelledby="faq-heading"
      className="order-6 relative z-10 w-full max-w-7xl mx-auto px-margin-mobile py-6 md:px-margin-desktop md:pt-xl md:pb-0 md:border-t md:border-outline-variant/30"
    >
      <div className="flex flex-col md:gap-md mb-md md:mb-lg">
        {section.eyebrow && <SectionEyebrow icon={section.eyebrowIcon} label={section.eyebrow} tone="secondary" />}
        <h2 id="faq-heading" className="text-headline-md md:text-headline-lg text-primary">
          {section.title}
        </h2>
        {section.subtitle && <p className="mt-2 md:mt-0 text-body-md text-on-surface-variant">{section.subtitle}</p>}
      </div>
      <Accordion items={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} />
    </section>
  );
}
