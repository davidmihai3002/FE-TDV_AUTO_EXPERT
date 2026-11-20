import type { Accent } from '@/types';

export const statAccentDesktop: Record<Accent, string> = {
  primary: 'md:text-primary-container',
  secondary: 'md:text-secondary-container',
  tertiary: 'md:text-error',
};
export const statAccentMobile: Record<Accent, string> = {
  primary: 'text-primary-container',
  secondary: 'text-secondary',
  tertiary: 'text-error',
};
export const featureAccentText: Record<Accent, string> = {
  primary: 'text-primary-container',
  secondary: 'text-secondary',
  tertiary: 'text-error',
};
export const featureTileMobile: Record<Accent, string> = {
  primary: 'bg-primary-container/20',
  secondary: 'bg-secondary-container/20',
  tertiary: 'bg-error-container/40',
};
export const specAccent: Record<Accent, string> = featureAccentText;
