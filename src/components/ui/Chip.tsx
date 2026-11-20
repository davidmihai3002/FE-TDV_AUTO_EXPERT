import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/libs';

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  selected: boolean;
  children: ReactNode;
}

export function Chip({ selected, className, children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'px-md py-xs rounded-pill text-label-md whitespace-nowrap transition-colors',
        selected
          ? 'bg-primary-container text-on-primary-container border border-primary-container'
          : 'bg-surface-container text-on-surface-variant border border-surface-container-highest hover:border-primary-container hover:text-primary',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
