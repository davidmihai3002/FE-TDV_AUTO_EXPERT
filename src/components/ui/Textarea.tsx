import type { Ref, TextareaHTMLAttributes } from 'react';
import { cn } from '@/libs';
import { fieldClasses, type FieldBaseProps } from './field-utils';
import { FormField } from './FormField';

export interface TextareaProps
  extends FieldBaseProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'required'> {
  showCounter?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
}

export function Textarea({
  label,
  hideLabel,
  required,
  hint,
  error,
  id,
  showCounter = true,
  className,
  ref,
  ...rest
}: TextareaProps) {
  const length = typeof rest.value === 'string' ? rest.value.length : 0;
  const max = rest.maxLength;
  const nearLimit = max !== undefined && max - length <= 20;
  return (
    <FormField label={label} hideLabel={hideLabel} required={required} hint={hint} error={error} id={id} className={className}>
      {(ids) => (
        <div className="relative">
          <textarea
            ref={ref}
            id={ids.id}
            required={required}
            aria-required={required || undefined}
            aria-invalid={ids.invalid || undefined}
            aria-describedby={ids.describedBy}
            className={cn(fieldClasses(ids.invalid), 'min-h-28 py-3 resize-y', showCounter && max && 'pb-7')}
            {...rest}
          />
          {showCounter && max !== undefined && (
            <span
              className="absolute right-3 bottom-2 text-label-sm text-on-surface-variant"
              aria-live={nearLimit ? 'polite' : 'off'}
            >
              {length} / {max}
            </span>
          )}
        </div>
      )}
    </FormField>
  );
}
