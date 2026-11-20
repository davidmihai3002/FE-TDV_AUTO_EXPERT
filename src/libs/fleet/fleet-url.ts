import type { FleetFilters } from '@/types';
import type { Query } from '../api-client';
import { CATEGORY_URL, FUEL_URL, TRANSMISSION_URL } from './fleet-labels';

export const FLEET_PARAM = { transmission: 'transmisie', fuel: 'combustibil', category: 'nivel' } as const;
const PRESERVED_KEYS = ['rezerva', 'lectii', 'categorie'] as const;

function fromUrl<T extends string>(map: Record<T, string>, value: string | null): T | undefined {
  if (!value) return undefined;
  return (Object.keys(map) as T[]).find((k) => map[k] === value);
}

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

export function fleetFiltersKey(filters: FleetFilters): string {
  return toFleetSearchParams(filters).toString();
}

export function hasInvalidFleetParams(sp: URLSearchParams): boolean {
  const parsed = parseFleetSearchParams(sp);
  return (Object.keys(FLEET_PARAM) as (keyof FleetFilters)[]).some(
    (k) => sp.has(FLEET_PARAM[k]) && parsed[k] === undefined,
  );
}

export function toFleetApiParams(filters: FleetFilters): Query {
  return { transmission: filters.transmission, fuel: filters.fuel, category: filters.category };
}
