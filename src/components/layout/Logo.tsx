import { cn } from '@/libs';

export interface LogoProps {
  size?: 32 | 40;
  withWordmark?: boolean;
  wordmark?: string;
  wordmarkClassName?: string;
  className?: string;
}

export function Logo({ size = 40, withWordmark = true, wordmark = 'TDV Auto Expert', wordmarkClassName, className }: LogoProps) {
  return (
    <span className={cn('flex items-center', size === 40 ? 'gap-sm' : 'gap-2', className)}>
      <img
        src="/images/tdv-logo.jpg"
        alt=""
        width={size}
        height={size}
        className={cn('object-contain bg-white p-1 rounded-pill shrink-0', size === 40 ? 'size-10' : 'size-8')}
      />
      {withWordmark && (
        <span
          className={cn(
            'font-headline font-bold tracking-tight text-primary-fixed whitespace-nowrap',
            size === 40 ? 'text-headline-md' : 'text-[20px] leading-7',
            wordmarkClassName,
          )}
        >
          {wordmark}
        </span>
      )}
    </span>
  );
}
