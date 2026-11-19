import type { InputHTMLAttributes, Ref } from 'react';
import { cn } from '@/libs';
import { fieldClasses, type FieldBaseProps } from './field-utils';
import { FormField } from './FormField';
import { Icon } from './Icon';

export interface InputProps extends FieldBaseProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'required'> {
  leadingIcon?: string;
  ref?: Ref<HTMLInputElement>;
}

export function Input({ label, hideLabel, required, hint, error, id, leadingIcon, className, ref, ...rest }: InputProps) {
  return (
    <FormField label={label} hideLabel={hideLabel} required={required} hint={hint} error={error} id={id} className={className}>
      {(ids) => (
        <div className="relative">
          {leadingIcon && (
            <Icon
              name={leadingIcon}
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
            />
          )}
          <input
            ref={ref}
            id={ids.id}
            required={required}
            aria-required={required || undefined}
            aria-invalid={ids.invalid || undefined}
            aria-describedby={ids.describedBy}
            className={cn(fieldClasses(ids.invalid), 'h-12', leadingIcon && 'pl-11')}
            {...rest}
          />
        </div>
      )}
    </FormField>
  );
}
