import type { HTMLAttributes } from 'react';
import { cn } from '@/libs';
import { Container, type ContainerProps } from './Container';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: 'none' | 'container' | 'low';
  spacing?: 'none' | 'md' | 'xl';
  bordered?: boolean;
  containerSize?: ContainerProps['size'];
  labelledBy?: string;
}

const TONES = { none: '', container: 'bg-surface-container', low: 'bg-surface-container-low' } as const;
const SPACINGS = { none: '', md: 'py-6 md:py-md', xl: 'py-6 md:py-xl' } as const;

export function Section({
  tone = 'none',
  spacing = 'xl',
  bordered = false,
  containerSize,
  labelledBy,
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cn(TONES[tone], SPACINGS[spacing], bordered && 'border-y border-outline-variant/30', className)}
      {...rest}
    >
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}
