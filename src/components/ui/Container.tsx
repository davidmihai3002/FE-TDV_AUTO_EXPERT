import type { ElementType, HTMLAttributes } from 'react';
import { cn } from '@/libs';

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  size?: 'default' | 'narrow' | 'prose';
}

const SIZES = {
  default: 'max-w-7xl',
  narrow: 'max-w-3xl',
  prose: 'max-w-2xl',
} as const;

export function Container({ as: Tag = 'div', size = 'default', className, ...rest }: ContainerProps) {
  return <Tag className={cn('w-full mx-auto px-margin-mobile md:px-margin-desktop', SIZES[size], className)} {...rest} />;
}
