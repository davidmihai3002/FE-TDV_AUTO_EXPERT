import { useState, type ImgHTMLAttributes } from 'react';
import { Icon } from '@/components/ui';
import { cn } from '@/libs';
import { LANDING_COPY } from './landing-copy';

/** `<img>` that swaps to a same-size placeholder block on error. */
export function SafeImage({
  fallbackIcon = 'directions_car',
  className,
  ...img
}: ImgHTMLAttributes<HTMLImageElement> & { fallbackIcon?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed || !img.src) {
    return (
      <div
        role="img"
        aria-label={LANDING_COPY.imageFallbackAlt}
        className={cn('flex items-center justify-center bg-surface-container-high', className)}
      >
        <Icon name={fallbackIcon} size={48} className="text-outline-variant" />
      </div>
    );
  }
  return <img {...img} onError={() => setFailed(true)} className={className} />;
}
