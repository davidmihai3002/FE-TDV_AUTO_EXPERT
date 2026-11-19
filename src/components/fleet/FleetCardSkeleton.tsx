import { Skeleton } from '@/components/ui';

/** Same frame as FleetCard, no hover. Decorative; the grid carries aria-busy. */
export function FleetCardSkeleton({ count = 3 }: { count?: number }) {
  return Array.from({ length: count }, (_, i) => (
    <li key={i} aria-hidden>
      <div className="h-full flex flex-col overflow-hidden bg-surface-container-highest border border-surface-variant md:border-[#334155] rounded-lg md:rounded-xl shadow-deep-mobile md:shadow-deep">
        <Skeleton className="h-48 md:h-64 rounded-none" />
        <div className="p-6 flex flex-col gap-3">
          <Skeleton shape="text" className="h-6 w-3/4" />
          <div className="hidden md:flex flex-col gap-3 mb-6">
            <Skeleton shape="text" className="h-5 w-full" />
            <Skeleton shape="text" className="h-5 w-full" />
            <Skeleton shape="text" className="h-5 w-full" />
          </div>
          <Skeleton shape="text" className="md:hidden h-4 w-1/2" />
          <Skeleton className="h-11 w-full rounded-xs" />
        </div>
      </div>
    </li>
  ));
}
