import { ROUTES } from '@/config';

export const PRICING_PARAM = {
  category: 'categorie',
  transmission: 'cutie',
  fuel: 'combustibil',
  vehicle: 'masina',
  lessons: 'lectii',
} as const;

export interface PricingUrlSelection {
  categoryCode: string | null;
  transmission: string | null;
  fuel: string | null;
  vehicleSlug: string | null;
  lessons: number | null;
}

export function parsePricingSearchParams(sp: URLSearchParams): PricingUrlSelection {
  const lessons = Number(sp.get(PRICING_PARAM.lessons));
  return {
    categoryCode: sp.get(PRICING_PARAM.category),
    transmission: sp.get(PRICING_PARAM.transmission),
    fuel: sp.get(PRICING_PARAM.fuel),
    vehicleSlug: sp.get(PRICING_PARAM.vehicle),
    lessons: Number.isInteger(lessons) && lessons > 0 ? lessons : null,
  };
}

export function toPricingSearchParams(s: {
  categoryCode: string | null;
  transmission: string | null;
  fuel: string | null;
  vehicleSlug: string | null;
  lessons: number;
}): URLSearchParams {
  const sp = new URLSearchParams();
  if (s.categoryCode) sp.set(PRICING_PARAM.category, s.categoryCode);
  if (s.transmission) sp.set(PRICING_PARAM.transmission, s.transmission);
  if (s.fuel) sp.set(PRICING_PARAM.fuel, s.fuel);
  if (s.vehicleSlug) sp.set(PRICING_PARAM.vehicle, s.vehicleSlug);
  sp.set(PRICING_PARAM.lessons, String(s.lessons));
  return sp;
}

export function buildBookingHref(slug: string, lessons: number, categoryCode: string): string {
  const p = new URLSearchParams({ rezerva: slug, lectii: String(lessons), categorie: categoryCode });
  return `${ROUTES.fleet}?${p.toString()}`;
}
