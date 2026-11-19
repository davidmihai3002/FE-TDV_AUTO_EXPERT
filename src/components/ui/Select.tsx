import type { Ref, SelectHTMLAttributes } from 'react';
import { VALIDATION_MESSAGES, cn } from '@/libs';
import { fieldClasses, type FieldBaseProps } from './field-utils';
import { FormField } from './FormField';
import { Icon } from './Icon';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends FieldBaseProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'required'> {
  options: SelectOption[];
  placeholder?: string;
  /** `false` makes the empty option selectable (optional fields, e.g. "Nu știu încă"). */
  placeholderDisabled?: boolean;
  ref?: Ref<HTMLSelectElement>;
}

export function Select({
  label,
  hideLabel,
  required,
  hint,
  error,
  id,
  options,
  placeholder = VALIDATION_MESSAGES.select,
  placeholderDisabled = true,
  className,
  ref,
  ...rest
}: SelectProps) {
  return (
    <FormField label={label} hideLabel={hideLabel} required={required} hint={hint} error={error} id={id} className={className}>
      {(ids) => (
        <div className="relative">
          <select
            ref={ref}
            id={ids.id}
            required={required}
            aria-required={required || undefined}
            aria-invalid={ids.invalid || undefined}
            aria-describedby={ids.describedBy}
            className={cn(fieldClasses(ids.invalid), 'h-12 appearance-none pr-10')}
            {...rest}
          >
            <option value="" disabled={placeholderDisabled}>
              {placeholder}
            </option>
            {options.map((o) => (
              <option key={o.value} value={o.value} disabled={o.disabled}>
                {o.label}
              </option>
            ))}
          </select>
          <Icon
            name="expand_more"
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
          />
        </div>
      )}
    </FormField>
  );
}
