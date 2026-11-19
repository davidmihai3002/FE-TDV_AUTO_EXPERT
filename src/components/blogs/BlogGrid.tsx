import type { ReactNode } from 'react';
import { cn } from '@/libs';

export interface BlogGridProps {
  id?: string;
  variant: 'card' | 'row';
  busy?: boolean;
  dimmed?: boolean;
  children: ReactNode;
}

/** `<ul role="list">`: 1/2/3-column grid of cards at md+, a column of rows on mobile. */
export function BlogGrid({ id, variant, busy, dimmed, children }: BlogGridProps) {
  return (
    <ul
      id={id}
      role="list"
      aria-busy={busy || undefined}
      className={cn(
        'transition-opacity',
        variant === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter' : 'flex flex-col gap-md',
        dimmed && 'opacity-60 pointer-events-none',
      )}
    >
      {children}
    </ul>
  );
}
