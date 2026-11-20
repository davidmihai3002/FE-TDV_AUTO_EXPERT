import { Icon } from '@/components/ui';
import { cn } from '@/libs';

export interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
  label: { mobile: string; desktop: string };
  controls?: string;
}

export function LoadMoreButton({ onClick, isLoading, label, controls }: LoadMoreButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      aria-busy={isLoading || undefined}
      aria-controls={controls}
      className={cn(
        'inline-flex items-center justify-center gap-xs whitespace-nowrap text-label-md transition-all disabled:opacity-70',
        'w-full md:w-auto border border-outline-variant text-on-surface px-lg py-sm rounded-pill',
        'md:border-surface-container-highest md:text-primary md:px-xl md:rounded-xs md:uppercase md:tracking-wider',
        'hover:border-primary-container hover:text-primary-container',
      )}
    >
      {isLoading && <Icon name="progress_activity" size={20} className="motion-safe:animate-spin md:order-last" />}
      <span className="md:hidden">{label.mobile}</span>
      <span className="hidden md:inline">{label.desktop}</span>
      {!isLoading && (
        <span className="hidden md:inline-flex">
          <Icon name="expand_more" size={24} />
        </span>
      )}
    </button>
  );
}
