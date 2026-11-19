import type { ReactNode } from 'react';
import { cn } from '@/libs';

export interface FleetGridProps {
  children: ReactNode;
  busy?: boolean;
  dimmed?: boolean;
}

export function FleetGrid({ children, busy, dimmed }: FleetGridProps) {
  return (
    <ul
      role="list"
      aria-busy={busy || undefined}
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity',
        dimmed && 'opacity-60',
      )}
    >
      {children}
    </ul>
  );
}
