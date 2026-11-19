import { cn } from '@/libs';

export type ButtonVariant = 'primary' | 'outline' | 'tonal' | 'tonal-neutral' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonRadius = 'responsive' | 'xs' | 'xl';

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  glow?: boolean;
  radius?: ButtonRadius;
  className?: string;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-primary-container text-on-primary-container font-bold hover:bg-primary-fixed-dim',
  outline: 'border border-secondary-container text-secondary-container hover:bg-secondary-container/10',
  tonal: 'bg-surface-container-high text-secondary hover:bg-surface-variant active:bg-surface-variant',
  'tonal-neutral': 'bg-surface-container-high text-primary hover:bg-surface-variant',
  ghost:
    'border border-surface-container-highest text-primary hover:border-primary-container hover:text-primary-container',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-6 py-2',
  md: 'px-8 py-3',
  lg: 'px-6 py-3.5',
};

const RADII = { responsive: 'rounded-xl md:rounded-xs', xs: 'rounded-xs', xl: 'rounded-xl' } as const;

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  block,
  glow,
  radius = 'responsive',
  className,
}: ButtonStyleProps) {
  return cn(
    'inline-flex items-center justify-center gap-2 text-label-md font-label-md whitespace-nowrap select-none',
    'transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
    'aria-disabled:opacity-50 aria-disabled:pointer-events-none',
    VARIANTS[variant],
    SIZES[size],
    RADII[radius],
    block && 'w-full',
    glow && variant === 'primary' && 'shadow-glow-strong',
    className,
  );
}
