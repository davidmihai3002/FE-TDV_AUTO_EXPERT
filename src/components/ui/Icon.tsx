import { cn } from '@/libs';

export interface IconProps {
  name: string;
  size?: 16 | 18 | 20 | 24 | 30 | 36 | 48;
  filled?: boolean;
  /** When set, the icon is announced (`role="img"`); otherwise it is decorative. */
  label?: string;
  className?: string;
}

export function Icon({ name, size = 24, filled = false, label, className }: IconProps) {
  return (
    <span
      className={cn('material-symbols-outlined shrink-0', filled && 'icon-filled', className)}
      style={{ fontSize: size, width: size, height: size }}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      {name}
    </span>
  );
}
