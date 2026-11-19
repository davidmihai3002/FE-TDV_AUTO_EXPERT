import type { BodyType, CarCategory, FuelType, TransmissionType } from '@/types';

export const TRANSMISSION_LABEL: Record<TransmissionType, string> = { manual: 'Manuală', automatic: 'Automată' };

export const FUEL_LABEL: Record<FuelType, string> = {
  petrol: 'Benzină',
  diesel: 'Motorină',
  hybrid: 'Hibrid',
  electric: 'Electric',
};

/** Mobile meta row uses the feminine form ("mașină electrică"). */
export const ELECTRIC_META_LABEL = 'Electrică';

export const BODY_TYPE_LABEL: Record<BodyType, string> = {
  compact: 'Compactă',
  hatchback: 'Hatchback',
  sedan: 'Sedan',
  coupe: 'Coupé',
  suv: 'SUV',
};

/** Default badge copy (overridable per car via `badgeLabel`). */
export const CATEGORY_LABEL: Record<CarCategory, string> = {
  beginner: 'Pentru începători',
  fundamentals: 'Fundamente',
  advanced: 'Avansat',
  mastery: 'Măiestrie',
};

/** Filter chip copy. */
export const CATEGORY_FILTER_LABEL: Record<CarCategory, string> = {
  beginner: 'Începător',
  fundamentals: 'Fundamente',
  advanced: 'Avansat',
  mastery: 'Măiestrie',
};

// "advanced" uses the mobile red so it differs from "beginner" blue (ticket 06 Q6)
export const CATEGORY_BADGE_CLASS: Record<CarCategory, string> = {
  mastery: 'bg-primary-container text-on-primary-container',
  advanced: 'bg-error-container text-on-error-container',
  fundamentals: 'bg-surface-bright text-on-surface border border-outline-variant',
  beginner: 'bg-secondary-container text-on-secondary-container',
};

/** API value ↔ Romanian URL value. */
export const TRANSMISSION_URL: Record<TransmissionType, string> = { manual: 'manuala', automatic: 'automata' };
export const FUEL_URL: Record<FuelType, string> = {
  petrol: 'benzina',
  diesel: 'motorina',
  hybrid: 'hibrid',
  electric: 'electric',
};
export const CATEGORY_URL: Record<CarCategory, string> = {
  beginner: 'incepator',
  fundamentals: 'fundamente',
  advanced: 'avansat',
  mastery: 'maestrie',
};

export const TRANSMISSIONS = Object.keys(TRANSMISSION_URL) as TransmissionType[];
export const FUELS = Object.keys(FUEL_URL) as FuelType[];
export const CATEGORIES = Object.keys(CATEGORY_URL) as CarCategory[];
