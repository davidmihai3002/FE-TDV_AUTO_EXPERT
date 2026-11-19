import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { cn } from '@/libs';
import { Icon } from './Icon';

export interface ArrowLinkProps {
  to?: string;
  href?: string;
  tone?: 'blue' | 'gold';
  uppercase?: boolean;
  icon?: string;
  size?: 'sm' | 'md';
  className?: string;
  children: ReactNode;
}

export function ArrowLink({
  to,
  href,
  tone = 'blue',
  uppercase = false,
  icon = 'arrow_forward',
  size = 'md',
  className,
  children,
}: ArrowLinkProps) {
  const classes = cn(
    'group inline-flex items-center gap-1 transition-colors',
    size === 'md' ? 'text-label-md' : 'text-label-sm',
    tone === 'blue' ? 'text-secondary hover:text-secondary-fixed' : 'text-primary-container hover:text-primary',
    uppercase && 'uppercase tracking-wider',
    className,
  );
  const content = (
    <>
      {children}
      <Icon name={icon} size={16} className="transition-transform group-hover:translate-x-0.5" />
    </>
  );
  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <a href={href} className={classes}>
      {content}
    </a>
  );
}
