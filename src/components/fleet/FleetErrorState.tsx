import { useEffect, useRef } from 'react';
import { Button, Icon } from '@/components/ui';
import { FLEET_COPY } from './fleet-copy';

/** Inline error (local until ticket 07 ships a shared ErrorState). Focus moves to the heading. */
export function FleetErrorState({ onRetry }: { onRetry: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);
  return (
    <div role="alert" className="py-20 flex flex-col items-center gap-4 text-center">
      <Icon name="error" size={48} className="text-error" />
      <h2 ref={headingRef} tabIndex={-1} className="text-headline-md text-on-surface focus:outline-none">
        {FLEET_COPY.error.title}
      </h2>
      <p className="text-body-md text-on-surface-variant">{FLEET_COPY.error.message}</p>
      <Button onClick={onRetry} leadingIcon="refresh">
        {FLEET_COPY.error.retry}
      </Button>
    </div>
  );
}
