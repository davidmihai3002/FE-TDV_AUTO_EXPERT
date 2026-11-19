import { Fragment } from 'react';
import { cn } from '@/libs';
import type { ParagraphBlockData } from '@/types';

/** Plain text only (no HTML); a single `\n` becomes a line break. */
export function ParagraphBlock({ block }: { block: ParagraphBlockData }) {
  const lines = block.text.split('\n');
  return (
    <p
      className={cn(
        'max-w-[68ch] text-[18px] leading-7',
        block.variant === 'lead'
          ? 'text-on-background lg:text-on-surface/90 lg:leading-relaxed'
          : 'text-on-surface-variant mb-4 lg:mb-md lg:text-body-md lg:leading-relaxed',
      )}
    >
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </p>
  );
}
