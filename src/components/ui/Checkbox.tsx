import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '@/libs';
import { useFieldIds, type FieldBaseProps } from './field-utils';
import { FieldError, FieldHint, RequiredMark } from './FormField';
import { Icon } from './Icon';

export interface CheckboxProps
  extends Omit<FieldBaseProps, 'label' | 'hideLabel'>,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'required' | 'type'> {
  label: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

export function Checkbox({ label, required, hint, error, id, className, ref, ...rest }: CheckboxProps) {
  const ids = useFieldIds({ id, hint, error });
  return (
    <div className={cn('flex flex-col gap-xs', className)}>
      <label htmlFor={ids.id} className="flex items-start gap-sm min-h-10 py-2 cursor-pointer">
        <span className="relative inline-flex shrink-0 mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            id={ids.id}
            required={required}
            aria-required={required || undefined}
            aria-invalid={ids.invalid || undefined}
            aria-describedby={ids.describedBy}
            className={cn(
              'peer appearance-none size-5 rounded-xs border bg-surface-container-low cursor-pointer transition-colors',
              'checked:bg-primary-container checked:border-primary-container',
              ids.invalid ? 'border-error' : 'border-outline',
            )}
            {...rest}
          />
          <Icon
            name="check"
            size={16}
            className="absolute inset-0 m-auto text-on-primary-container opacity-0 peer-checked:opacity-100 pointer-events-none"
          />
        </span>
        <span className="text-body-md text-on-surface-variant">
          {label}
          {required && <RequiredMark />}
        </span>
      </label>
      {hint && <FieldHint id={ids.id}>{hint}</FieldHint>}
      {error && <FieldError id={ids.id}>{error}</FieldError>}
    </div>
  );
}
