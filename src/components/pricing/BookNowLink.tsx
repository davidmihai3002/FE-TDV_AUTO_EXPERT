import { Link } from 'react-router';
import { Icon } from '@/components/ui';
import { PRICING_COPY, cn } from '@/libs';

export interface BookNowLinkProps {
  href: string | null;
  variant: 'panel' | 'docked';
  ariaLabel?: string;
}

export function BookNowLink({ href, variant, ariaLabel }: BookNowLinkProps) {
  const classes = cn(
    'flex items-center justify-center gap-sm bg-primary-container text-on-primary-container transition-all',
    variant === 'panel'
      ? 'w-full mt-sm py-sm rounded-xs font-headline text-[18px] font-bold shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:opacity-90 active:scale-95'
      : 'flex-[2] py-sm rounded-lg text-label-md font-bold shadow-[0_0_15px_rgba(255,215,0,0.2)] hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] active:scale-95',
  );
  const content = (
    <>
      {variant === 'panel' && <Icon name="assignment_turned_in" size={24} />}
      {PRICING_COPY.cta.book}
    </>
  );
  if (!href) {
    return (
      <button type="button" disabled className={cn(classes, 'opacity-50 cursor-not-allowed shadow-none')}>
        {content}
      </button>
    );
  }
  return (
    <Link to={href} aria-label={ariaLabel} className={classes}>
      {content}
    </Link>
  );
}
