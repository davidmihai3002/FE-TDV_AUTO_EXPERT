import { useId, type ReactNode } from 'react';
import { cn } from '@/libs';
import { Icon } from './Icon';

export interface AccordionItem {
  id: string;
  question: string;
  answer: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Only one item open at a time (native `<details name>`). */
  single?: boolean;
  defaultOpenId?: string;
  className?: string;
}

export function Accordion({ items, single = false, defaultOpenId, className }: AccordionProps) {
  const groupName = useId();
  return (
    <div className={cn('grid grid-cols-1 gap-4', className)}>
      {items.map((item) => (
        <details
          key={item.id}
          name={single ? groupName : undefined}
          open={item.id === defaultOpenId || undefined}
          className="group bg-surface-container border border-outline-variant/30 rounded-lg overflow-hidden"
        >
          <summary className="flex justify-between items-center gap-4 p-md cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <span className="text-label-md text-primary-container uppercase tracking-wider">{item.question}</span>
            <Icon name="expand_more" className="text-primary-container transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-md pb-md pt-4 border-t border-outline-variant/30 text-body-md text-on-surface-variant">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
