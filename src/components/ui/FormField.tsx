import type { ReactNode } from 'react';
import { cn } from '@/libs';
import { useFieldIds, type FieldBaseProps, type FieldIds } from './field-utils';
import { Icon } from './Icon';

export interface FormFieldProps extends FieldBaseProps {
  children: (ids: FieldIds) => ReactNode;
  className?: string;
}

export function RequiredMark() {
  return (
    <span aria-hidden="true" className="text-primary-container ml-0.5">
      *
    </span>
  );
}

export function FieldHint({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={`${id}-hint`} className="text-label-sm text-on-surface-variant">
      {children}
    </p>
  );
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={`${id}-error`} className="text-label-sm text-error flex items-center gap-1">
      <Icon name="error" size={16} />
      {children}
    </p>
  );
}

export function FormField({ label, hideLabel, required, hint, error, id, children, className }: FormFieldProps) {
  const ids = useFieldIds({ id, hint, error });
  return (
    <div className={cn('flex flex-col gap-xs', className)}>
      <label htmlFor={ids.id} className={cn('text-label-md text-on-surface-variant', hideLabel && 'sr-only')}>
        {label}
        {required && <RequiredMark />}
      </label>
      {children(ids)}
      {hint && <FieldHint id={ids.id}>{hint}</FieldHint>}
      {error && <FieldError id={ids.id}>{error}</FieldError>}
    </div>
  );
}

