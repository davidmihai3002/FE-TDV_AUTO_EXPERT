import { useId } from 'react';
import { cn } from '@/libs';

export interface FieldBaseProps {
  label: string;
  hideLabel?: boolean;
  required?: boolean;
  hint?: string;
  error?: string;
  id?: string;
}

export interface FieldIds {
  id: string;
  describedBy?: string;
  invalid: boolean;
}

export function useFieldIds({ id, hint, error }: Pick<FieldBaseProps, 'id' | 'hint' | 'error'>): FieldIds {
  const generated = useId();
  const fieldId = id ?? generated;
  const describedBy = [error && `${fieldId}-error`, hint && `${fieldId}-hint`].filter(Boolean).join(' ') || undefined;
  return { id: fieldId, describedBy, invalid: Boolean(error) };
}

export const fieldClasses = (invalid: boolean) =>
  cn(
    'w-full rounded-xl md:rounded-lg bg-surface-container-low border text-body-md text-on-surface placeholder:text-outline',
    'px-4 transition-colors hover:border-outline focus:outline-none focus:ring-1',
    invalid
      ? 'border-error focus:border-error focus:ring-error'
      : 'border-outline-variant focus:border-primary-container focus:ring-primary-container',
  );
