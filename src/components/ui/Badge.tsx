import type { ReactNode } from 'react';
import { cn } from '@/libs';
import { Icon } from './Icon';

export interface BadgeProps {
  variant?: 'pill' | 'primary' | 'secondary' | 'neutral' | 'danger' | 'tag' | 'category';
  /** Text colour for the `category` variant. */
  tone?: 'gold' | 'blue' | 'gold-dim' | 'muted';
  shape?: 'rounded' | 'pill';
  uppercase?: boolean;
  icon?: string;
  iconFilled?: boolean;
  className?: string;
  children: ReactNode;
}

const VARIANTS = {
  pill: 'bg-surface-container-high border border-outline-variant/50 px-3 py-1 rounded-pill uppercase tracking-widest text-on-surface-variant',
  primary: 'bg-primary-container text-on-primary-container px-3 py-1 rounded-xs font-bold',
  secondary: 'bg-secondary-container text-on-secondary-container px-3 py-1 rounded-xs font-bold',
  neutral: 'bg-surface-bright text-on-surface border border-outline-variant px-3 py-1 rounded-xs font-bold',
  danger: 'bg-error-container text-on-error-container px-3 py-1 rounded-xs font-bold',
  tag: 'bg-surface-container-high text-on-surface-variant px-2.5 py-1 rounded-xs text-[11px] leading-4',
  category: 'uppercase tracking-widest font-semibold',
} as const;

const TONES = {
  gold: 'text-primary-container',
  blue: 'text-secondary',
  'gold-dim': 'text-primary-fixed-dim',
  muted: 'text-on-surface-variant',
} as const;

export function Badge({
  variant = 'primary',
  tone = 'gold',
  shape,
  uppercase,
  icon,
  iconFilled,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 w-fit text-label-sm whitespace-nowrap',
        VARIANTS[variant],
        variant === 'category' && TONES[tone],
        shape === 'pill' && 'rounded-pill',
        uppercase && 'uppercase tracking-wider',
        className,
      )}
    >
      {icon && (
        <Icon
          name={icon}
          size={16}
          filled={iconFilled}
          className={variant === 'pill' ? 'text-primary-container' : undefined}
        />
      )}
      {children}
    </span>
  );
}
