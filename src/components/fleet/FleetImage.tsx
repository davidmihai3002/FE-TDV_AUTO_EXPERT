import { useState } from 'react';
import { Icon } from '@/components/ui';
import { cn } from '@/libs';
import { FLEET_COPY } from './fleet-copy';

export interface FleetImageProps {
  src: string;
  alt: string;
  priority?: 'high' | 'eager' | 'lazy';
  className?: string;
  imgClassName?: string;
}

/** Car photo with a same-size fallback block on load error (keeps card height). */
export function FleetImage({ src, alt, priority = 'lazy', className, imgClassName }: FleetImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        role="img"
        aria-label={FLEET_COPY.imageFallbackAria}
        className={cn('w-full h-full flex items-center justify-center bg-surface-container-high', className)}
      >
        <Icon name="directions_car" size={48} className="text-outline-variant" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      width={1200}
      height={800}
      decoding="async"
      loading={priority === 'lazy' ? 'lazy' : 'eager'}
      fetchPriority={priority === 'high' ? 'high' : undefined}
      onError={() => setFailed(true)}
      className={cn('w-full h-full object-cover', className, imgClassName)}
    />
  );
}
