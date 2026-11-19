import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/libs';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'article' | 'li';
  tone?: 'default' | 'low' | 'highest';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'deep';
  interactive?: 'none' | 'glow' | 'lift';
  /** Media card: no padding wrapper, `overflow-hidden`, enables `group` hover on CardMedia. */
  media?: boolean;
}

const TONES = {
  default: 'bg-surface-container border-outline-variant/30',
  low: 'bg-surface-container-low border-outline-variant/30',
  highest: 'bg-surface-container-highest border-surface-variant',
} as const;
const PADDINGS = { none: '', sm: 'p-4', md: 'p-md', lg: 'p-lg' } as const;
const INTERACTIVE = {
  none: '',
  glow: 'hover:border-primary-container hover:shadow-glow',
  lift: 'hover:border-primary-container hover:shadow-lift hover:-translate-y-1',
} as const;

export function Card({
  as: Tag = 'div',
  tone = 'default',
  padding,
  shadow = 'none',
  interactive = 'none',
  media = false,
  className,
  children,
  ...rest
}: CardProps) {
  const resolvedPadding = padding ?? (media ? 'none' : 'md');
  return (
    <Tag
      className={cn(
        'relative border rounded-lg transition-all duration-300',
        TONES[tone],
        PADDINGS[resolvedPadding],
        shadow === 'deep' && 'shadow-deep',
        INTERACTIVE[interactive],
        media && 'overflow-hidden flex flex-col group',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export interface CardMediaProps {
  src: string;
  alt: string;
  aspect?: 'video' | 'square' | 'h-44' | 'h-56' | 'h-64';
  /** opacity-80 → 100 on card hover */
  dim?: boolean;
  zoom?: boolean;
  /** gradient from the page background at the bottom */
  overlay?: boolean;
  className?: string;
  children?: ReactNode;
}

const ASPECTS = {
  video: 'aspect-video',
  square: 'aspect-square',
  'h-44': 'h-44',
  'h-56': 'h-56',
  'h-64': 'h-64',
} as const;

export function CardMedia({
  src,
  alt,
  aspect = 'video',
  dim = true,
  zoom = true,
  overlay = false,
  className,
  children,
}: CardMediaProps) {
  return (
    <div className={cn('relative overflow-hidden bg-surface-container', ASPECTS[aspect], className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn(
          'w-full h-full object-cover transition-all duration-500',
          dim && 'opacity-80 group-hover:opacity-100',
          zoom && 'group-hover:scale-105',
        )}
      />
      {overlay && <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" aria-hidden />}
      {children}
    </div>
  );
}
