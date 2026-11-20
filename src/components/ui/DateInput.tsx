import type { InputHTMLAttributes, Ref } from 'react';
import { cn } from '@/libs';
import { fieldClasses, type FieldBaseProps } from './field-utils';
import { FormField } from './FormField';
import { Icon } from './Icon';

export interface DateInputProps
  extends FieldBaseProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'required' | 'type' | 'min' | 'max'> {
  min?: string;
  max?: string;
  ref?: Ref<HTMLInputElement>;
}

export function DateInput({ label, hideLabel, required, hint, error, id, className, ref, ...rest }: DateInputProps) {
  return (
    <FormField label={label} hideLabel={hideLabel} required={required} hint={hint} error={error} id={id} className={className}>
      {(ids) => (
        <div className="relative">
          <input
            ref={ref}
            type="date"
            id={ids.id}
            required={required}
            aria-required={required || undefined}
            aria-invalid={ids.invalid || undefined}
            aria-describedby={ids.describedBy}
            className={cn(
              fieldClasses(ids.invalid),
              'h-12 pr-11 relative',
              '[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0',
              '[&::-webkit-calendar-picker-indicator]:w-11 [&::-webkit-calendar-picker-indicator]:h-full',
              '[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer',
            )}
            {...rest}
          />
          <Icon
            name="calendar_month"
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
          />
        </div>
      )}
    </FormField>
  );
}
