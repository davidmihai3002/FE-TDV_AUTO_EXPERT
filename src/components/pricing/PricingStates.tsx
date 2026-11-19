import { observer } from 'mobx-react-lite';
import { Button, Icon, Skeleton } from '@/components/ui';
import { PRICING_COPY } from '@/libs';
import { useStore } from '@/store';

export function PricingSkeleton({ variant }: { variant: 'desktop' | 'mobile' }) {
  return (
    <div aria-busy="true" className="flex flex-col gap-md">
      <p className="sr-only" aria-live="polite">
        {PRICING_COPY.state.loading}
      </p>
      {variant === 'desktop' ? (
        [0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-md">
            <Skeleton className="h-8 w-64" />
            <div className="grid md:grid-cols-3 gap-md">
              <Skeleton className="h-40 bg-surface-container" />
              <Skeleton className="h-40 bg-surface-container" />
            </div>
          </div>
        ))
      ) : (
        <>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </>
      )}
    </div>
  );
}

export function PricingError({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-start gap-4 p-md rounded-xl bg-surface-container border border-surface-variant">
      <p className="flex items-center gap-2 text-body-md text-on-surface">
        <Icon name="error" className="text-error" />
        {PRICING_COPY.state.loadError}
      </p>
      <Button onClick={onRetry}>{PRICING_COPY.state.retry}</Button>
    </div>
  );
}

/** No priced cars yet: point to the phone number (placeholder from site settings, D2). */
export const PricingEmpty = observer(function PricingEmpty() {
  const { siteSettings } = useStore();
  const phone = siteSettings.phone;
  return (
    <div className="flex flex-col items-start gap-4 p-md rounded-xl bg-surface-container border border-surface-variant">
      <p className="text-body-md text-on-surface">{PRICING_COPY.state.empty}</p>
      {phone && (
        <Button href={phone.href} leadingIcon="call">
          {phone.display}
        </Button>
      )}
    </div>
  );
});
