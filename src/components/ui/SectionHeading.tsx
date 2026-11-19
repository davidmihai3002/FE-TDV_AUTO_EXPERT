import type { ReactNode } from 'react';
import { cn } from '@/libs';
import { ArrowLink } from './ArrowLink';
import { Icon } from './Icon';

export interface SectionHeadingProps {
  title: string;
  description?: ReactNode;
  eyebrow?: string;
  eyebrowIcon?: string;
  eyebrowTone?: 'blue' | 'gold';
  /** The desktop design has no eyebrow; show it from md up only when asked. */
  eyebrowOnDesktop?: boolean;
  action?: { label: string; to: string; mobileLabel?: string };
  actionOnMobile?: boolean;
  align?: 'left' | 'center';
  narrow?: boolean;
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  className?: string;
}

export function SectionHeading({
  title,
  description,
  eyebrow,
  eyebrowIcon,
  eyebrowTone = 'blue',
  eyebrowOnDesktop = false,
  action,
  actionOnMobile = false,
  align = 'left',
  narrow = false,
  as: Heading = 'h2',
  id,
  className,
}: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-lg',
        centered && 'items-center text-center md:justify-center',
        className,
      )}
    >
      <div className={cn('flex flex-col gap-0 md:gap-md', narrow && 'md:w-2/3', centered && 'items-center mx-auto')}>
        {eyebrow && (
          <p
            className={cn(
              'flex items-center gap-1.5 mb-1 md:mb-0 text-[12px] uppercase tracking-widest font-semibold font-body',
              eyebrowTone === 'blue' ? 'text-secondary' : 'text-primary-container',
              !eyebrowOnDesktop && 'md:hidden',
            )}
          >
            {eyebrowIcon && <Icon name={eyebrowIcon} size={18} />}
            {eyebrow}
          </p>
        )}
        <Heading id={id} className="text-headline-md md:text-headline-lg text-primary">
          {title}
        </Heading>
        {description && (
          <div className="mt-2 md:mt-0 text-body-md text-on-surface-variant leading-relaxed md:leading-6">
            {description}
          </div>
        )}
      </div>
      {action && (
        <ArrowLink
          to={action.to}
          uppercase
          className={cn('shrink-0', !actionOnMobile && 'hidden md:inline-flex')}
        >
          <span className="hidden md:inline">{action.label}</span>
          <span className="md:hidden text-[13px]">{action.mobileLabel ?? action.label}</span>
        </ArrowLink>
      )}
    </div>
  );
}

export interface PageTitleProps {
  children: ReactNode;
  /** Text rendered after the title in brand gold. */
  accent?: string;
  className?: string;
}

export function PageTitle({ children, accent, className }: PageTitleProps) {
  return (
    <h1 className={cn('text-headline-lg-mobile md:text-headline-xl text-primary', className)}>
      {children}
      {accent && <span className="text-primary-container"> {accent}</span>}
    </h1>
  );
}
