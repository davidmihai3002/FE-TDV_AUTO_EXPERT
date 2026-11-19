import { Button, Icon, Skeleton } from '@/components/ui';
import { LANDING_COPY } from './landing-copy';

export function LandingSkeleton() {
  return (
    <div aria-busy="true" className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-4 md:pt-xl flex flex-col gap-lg md:gap-xl">
      <p className="sr-only" aria-live="polite">
        {LANDING_COPY.loading}
      </p>
      <div className="flex flex-col gap-3 md:grid md:grid-cols-12 md:gap-gutter md:items-center">
        <div className="md:col-span-6 flex flex-col gap-3">
          <Skeleton className="h-6 w-[120px]" />
          <Skeleton className="h-9 md:h-12 w-full" />
          <Skeleton className="h-9 md:h-12 w-4/5" />
          <Skeleton lines={2} />
          <div className="flex flex-col md:flex-row gap-3 pt-2">
            <Skeleton className="h-[50px] md:h-12 w-full md:w-[180px]" />
            <Skeleton className="h-[50px] md:h-12 w-full md:w-[180px]" />
          </div>
        </div>
        <Skeleton className="md:col-span-6 aspect-square md:aspect-auto md:h-[480px] rounded-xl" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <div className="flex flex-col md:grid md:grid-cols-3 gap-3 md:gap-gutter">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-44" />
        ))}
      </div>
    </div>
  );
}

export function LandingError({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="max-w-2xl mx-auto px-margin-mobile py-xl flex flex-col items-center gap-4 text-center">
      <Icon name="error" size={48} className="text-error" />
      <h1 className="text-headline-lg-mobile md:text-headline-lg text-primary">{LANDING_COPY.errorTitle}</h1>
      <p className="text-body-md text-on-surface-variant">{LANDING_COPY.errorBody}</p>
      <Button onClick={onRetry}>{LANDING_COPY.retry}</Button>
    </div>
  );
}
