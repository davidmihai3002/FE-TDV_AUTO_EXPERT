import { cn } from '@/libs';

export interface SkeletonProps {
  shape?: 'rect' | 'text' | 'circle';
  lines?: number;
  className?: string;
}

const SHAPES = { rect: 'rounded-lg', text: 'h-4 rounded-xs', circle: 'rounded-full' } as const;

export function Skeleton({ shape = 'rect', lines, className }: SkeletonProps) {
  if (lines && lines > 1) {
    return (
      <div className={cn('flex flex-col gap-2', className)} aria-hidden>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={cn('animate-pulse bg-surface-container-high', SHAPES.text, i === lines - 1 ? 'w-2/3' : 'w-full')}
          />
        ))}
      </div>
    );
  }
  return <div aria-hidden className={cn('animate-pulse bg-surface-container-high', SHAPES[shape], className)} />;
}
