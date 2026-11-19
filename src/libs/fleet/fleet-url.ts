import type { FleetFilters } from '@/types';
import type { Query } from '../api-client';
import { CATEGORY_URL, FUEL_URL, TRANSMISSION_URL } from './fleet-labels';

export const FLEET_PARAM = { transmission: 'transmisie', fuel: 'combustibil', category: 'nivel' } as const;
/** Booking keys that filter changes must keep (see libs/booking/booking-url.ts). */
const PRESERVED_KEYS = ['rezerva', 'lectii', 'categorie'] as const;

function fromUrl<T extends string>(map: Record<T, string>, value: string | null): T | undefined {
  if (!value) return undefined;
  return (Object.keys(map) as T[]).find((k) => map[k] === value);
}

/** Reads `transmisie` / `combustibil` / `nivel` (Romanian) → API values. Unknown values are dropped. */
export function parseFleetSearchParams(sp: URLSearchParams): FleetFilters {
  const filters: FleetFilters = {};
  const transmission = fromUrl(TRANSMISSION_URL, sp.get(FLEET_PARAM.transmission));
  const fuel = fromUrl(FUEL_URL, sp.get(FLEET_PARAM.fuel));
  const category = fromUrl(CATEGORY_URL, sp.get(FLEET_PARAM.category));
  if (transmission) filters.transmission = transmission;
  if (fuel) filters.fuel = fuel;
  if (category) filters.category = category;
  return filters;
}

/** Writes filters with Romanian keys/values in a stable order; keeps the booking keys from `keep`. */
export function toFleetSearchParams(filters: FleetFilters, keep?: URLSearchParams): URLSearchParams {
  const sp = new URLSearchParams();
  if (filters.transmission) sp.set(FLEET_PARAM.transmission, TRANSMISSION_URL[filters.transmission]);
  if (filters.fuel) sp.set(FLEET_PARAM.fuel, FUEL_URL[filters.fuel]);
  if (filters.category) sp.set(FLEET_PARAM.category, CATEGORY_URL[filters.category]);
  for (const key of PRESERVED_KEYS) {
    const v = keep?.get(key);
    if (v) sp.set(key, v);
  }
  return sp;
}

/** Stable key for effects: only the filter part of the URL. */
export function fleetFiltersKey(filters: FleetFilters): string {
  return toFleetSearchParams(filters).toString();
}

/** True when the URL carries filter params the parser dropped (they should be stripped with `replace`). */
export function hasInvalidFleetParams(sp: URLSearchParams): boolean {
  const parsed = parseFleetSearchParams(sp);
  return (Object.keys(FLEET_PARAM) as (keyof FleetFilters)[]).some(
    (k) => sp.has(FLEET_PARAM[k]) && parsed[k] === undefined,
  );
}

/** English keys for `GET /fleet`. */
export function toFleetApiParams(filters: FleetFilters): Query {
  return { transmission: filters.transmission, fuel: filters.fuel, category: filters.category };
}
