import type { Accent } from '@/types';

/** Desktop stat values (#ffd700 / #00abec / #ffb4ab). */
export const statAccentDesktop: Record<Accent, string> = {
  primary: 'md:text-primary-container',
  secondary: 'md:text-secondary-container',
  tertiary: 'md:text-error',
};
/** Mobile stat values (#ffd700 / #82cfff). */
export const statAccentMobile: Record<Accent, string> = {
  primary: 'text-primary-container',
  secondary: 'text-secondary',
  tertiary: 'text-error',
};
/** Feature icon colour (both breakpoints). */
export const featureAccentText: Record<Accent, string> = {
  primary: 'text-primary-container',
  secondary: 'text-secondary',
  tertiary: 'text-error',
};
/** Mobile tinted icon tiles. */
export const featureTileMobile: Record<Accent, string> = {
  primary: 'bg-primary-container/20',
  secondary: 'bg-secondary-container/20',
  tertiary: 'bg-error-container/40',
};
/** Fleet spec icons. */
export const specAccent: Record<Accent, string> = featureAccentText;
