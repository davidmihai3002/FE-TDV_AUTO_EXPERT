import type { ReactNode } from 'react';
import { Icon } from '@/components/ui';

/** Desktop section: `<fieldset>` + `<legend>` (blue filled icon, bottom rule). */
export function PricingSection({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-md min-w-0">
      <legend className="w-full flex items-center gap-sm border-b border-surface-variant pb-sm mb-md">
        <Icon name={icon} filled className="text-secondary-container" />
        <span className="font-headline text-headline-md text-on-surface">{title}</span>
      </legend>
      {children}
    </fieldset>
  );
}
