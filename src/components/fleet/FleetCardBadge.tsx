import { CATEGORY_BADGE_CLASS, CATEGORY_LABEL, cn } from '@/libs';
import type { CarCategory } from '@/types';

export interface FleetCardBadgeProps {
  category: CarCategory;
  label?: string | null;
  /** `card`: mobile style below md, desktop pill from md. `compact`: always the small mobile style. */
  size?: 'card' | 'compact';
  className?: string;
}

export function FleetCardBadge({ category, label, size = 'card', className }: FleetCardBadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-2 py-1 rounded-xs text-label-sm font-medium whitespace-nowrap',
        size === 'card' && 'md:px-3 md:rounded-pill md:font-bold md:uppercase md:tracking-wider',
        CATEGORY_BADGE_CLASS[category],
        className,
      )}
    >
      {label ?? CATEGORY_LABEL[category]}
    </span>
  );
}
