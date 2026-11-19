import { Skeleton } from '@/components/ui';
import { ARTICLE_COPY } from './copy';

/** Mirrors the real layout so nothing shifts on swap. */
export function ArticleSkeleton() {
  return (
    <div aria-busy="true">
      <p className="sr-only" aria-live="polite">
        {ARTICLE_COPY.state.loading}
      </p>
      {/* mobile */}
      <div className="lg:hidden pt-[72px]">
        <Skeleton className="h-72 w-full rounded-none" />
        <div className="px-margin-mobile -mt-16 relative flex flex-col gap-3">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-12 w-full mt-4" />
          <Skeleton lines={8} className="mt-4" />
        </div>
      </div>
      {/* desktop */}
      <div className="hidden lg:block">
        <div className="min-h-[614px] bg-surface-container-low flex items-end">
          <div className="max-w-[1280px] w-full mx-auto px-margin-desktop pb-24 flex flex-col gap-4">
            <Skeleton className="h-6 w-[120px]" />
            <Skeleton className="h-14 w-[70%]" />
            <Skeleton className="h-14 w-[50%]" />
            <div className="flex items-center gap-4 mt-6">
              <Skeleton shape="circle" className="size-12" />
              <Skeleton lines={2} className="w-48" />
            </div>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto px-margin-desktop py-xl grid grid-cols-12 gap-6">
          <Skeleton className="col-span-3 h-40" />
          <div className="col-span-6 flex flex-col gap-6">
            <Skeleton lines={6} />
            <Skeleton className="h-64" />
          </div>
          <Skeleton className="col-span-3 h-[420px]" />
        </div>
      </div>
    </div>
  );
}
