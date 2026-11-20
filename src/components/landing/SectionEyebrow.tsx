import { Icon } from '@/components/ui';
import { cn } from '@/libs';

export interface SectionEyebrowProps {
  icon?: string | null;
  label: string;
  tone: 'primary' | 'secondary';
  className?: string;
}

export function SectionEyebrow({ icon, label, tone, className = 'md:hidden' }: SectionEyebrowProps) {
  return (
    <p
      className={cn(
        'flex items-center gap-1.5 mb-1 text-[12px] leading-4 uppercase tracking-widest font-semibold',
        tone === 'primary' ? 'text-primary-container' : 'text-secondary',
        className,
      )}
    >
      {icon && <Icon name={icon} size={18} />}
      {label}
    </p>
  );
}
