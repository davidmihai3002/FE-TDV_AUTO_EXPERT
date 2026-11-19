import { useId } from 'react';
import { Icon } from '@/components/ui';
import { cn } from '@/libs';

export interface OptionCardItem {
  value: string;
  icon: string;
  title: string;
  description?: string;
  meta?: string;
  badge?: string;
  disabled?: boolean;
  disabledReason?: string;
}

export interface OptionCardProps extends OptionCardItem {
  name: string;
  checked: boolean;
  /** `detailed`: desktop calc-card; `compact`: mobile option-card (128px tall) */
  density: 'detailed' | 'compact';
  onSelect: (value: string) => void;
}

/**
 * A real radio input (visually hidden, not display:none, so the keyboard works) wrapped in a label.
 * Arrow keys move between options natively; the card shows the input's focus ring.
 */
export function OptionCard({
  name,
  value,
  checked,
  disabled,
  disabledReason,
  icon,
  title,
  description,
  meta,
  badge,
  density,
  onSelect,
}: OptionCardProps) {
  const reasonId = useId();
  const detailed = density === 'detailed';
  return (
    <label
      className={cn(
        'group relative overflow-hidden border transition-all',
        'has-[input:focus-visible]:outline has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-secondary',
        detailed
          ? 'block rounded-lg p-md bg-surface-container border-surface-variant duration-300'
          : 'flex flex-col items-center justify-center text-center gap-base h-32 rounded-xl p-md bg-surface-container-high border-surface-variant duration-200',
        disabled
          ? 'opacity-40 cursor-not-allowed'
          : detailed
            ? 'cursor-pointer hover:border-primary-container hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5),0_8px_10px_-6px_rgba(0,0,0,0.5)]'
            : 'cursor-pointer hover:border-secondary',
        checked &&
          (detailed
            ? 'border-primary-container bg-primary-container/5'
            : 'border-primary-container bg-surface-container-lowest shadow-[0_0_15px_rgba(255,215,0,0.15)]'),
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        aria-describedby={disabled && disabledReason ? reasonId : undefined}
        onChange={() => onSelect(value)}
        className="sr-only"
      />
      {badge && detailed && (
        <span className="absolute top-0 right-0 bg-primary-container text-on-primary-container px-sm py-xs rounded-bl-lg text-label-sm font-bold">
          {badge}
        </span>
      )}
      <Icon
        name={icon}
        size={detailed ? 48 : 30}
        filled={checked}
        className={cn(
          detailed && '!text-[40px] !w-10 !h-10 mb-sm',
          checked ? 'text-primary-container' : cn('text-on-surface-variant', detailed && !disabled && 'group-hover:text-primary-container'),
        )}
      />
      {detailed ? (
        <>
          <span className="block font-headline text-[20px] leading-7 font-bold text-on-surface mb-xs">{title}</span>
          {description && <span className="block text-[14px] leading-5 text-on-surface-variant">{description}</span>}
          {meta && (
            <span className="block mt-sm text-right text-body-md font-semibold tabular-nums text-primary-container">{meta}</span>
          )}
        </>
      ) : (
        <>
          <span className="text-label-md text-on-surface">{title}</span>
          {meta && <span className="text-label-sm text-secondary">{meta}</span>}
        </>
      )}
      {disabled && disabledReason && (
        <span id={reasonId} className="block mt-1 text-label-sm text-on-surface-variant">
          {disabledReason}
        </span>
      )}
    </label>
  );
}
