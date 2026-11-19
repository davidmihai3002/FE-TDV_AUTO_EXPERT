import { useState } from 'react';
import { Icon } from '@/components/ui';
import type { FigureBlockData } from '@/types';
import { ARTICLE_COPY } from '../copy';

export function FigureBlock({ block }: { block: FigureBlockData }) {
  const [failed, setFailed] = useState(false);
  if (!block.image) {
    if (import.meta.env.DEV) console.warn(`[blog-article] figure "${block.id}" has no image`);
    return null;
  }
  const { url, alt, width, height } = block.image;
  return (
    <figure className="my-8 lg:mt-0 lg:mb-8 lg:rounded-xl lg:overflow-hidden lg:border lg:border-surface-variant lg:shadow-2xl">
      <div className="h-48 lg:h-64 rounded-lg lg:rounded-none overflow-hidden border border-surface-variant lg:border-0 bg-surface-container-high">
        {failed ? (
          <div role="img" aria-label={ARTICLE_COPY.imageFallback} className="w-full h-full flex items-center justify-center">
            <Icon name="image" size={48} className="text-outline-variant" />
          </div>
        ) : (
          <img
            src={url}
            alt={alt}
            width={width ?? undefined}
            height={height ?? undefined}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      {block.caption && (
        <figcaption className="mt-3 text-center text-label-sm text-outline lg:mt-0 lg:text-left lg:flex lg:items-center lg:gap-2 lg:bg-surface-container-high lg:p-4 lg:text-on-surface-variant lg:border-t lg:border-surface-variant">
          <span className="hidden lg:inline-flex">
            <Icon name="info" size={16} />
          </span>
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
