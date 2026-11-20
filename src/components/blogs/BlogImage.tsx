import { useState } from 'react';
import { Icon } from '@/components/ui';
import { cn } from '@/libs';
import { BLOGS_COPY } from './blogs-copy';

export interface BlogImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}

export function BlogImage({ src, alt, width, height, priority = false, className }: BlogImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        role="img"
        aria-label={BLOGS_COPY.a11y.imageFallback}
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
      width={width}
      height={height}
      decoding="async"
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      onError={() => setFailed(true)}
      className={cn('w-full h-full object-cover', className)}
    />
  );
}
