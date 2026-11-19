import type { FleetCar, FleetFilters, FleetListResponse } from '@/types';
import { api } from '../api-client';
import { toFleetApiParams } from './fleet-url';

export function getFleet(filters: FleetFilters, signal?: AbortSignal): Promise<FleetListResponse> {
  return api.get<FleetListResponse>('/fleet', { query: toFleetApiParams(filters), signal });
}

export function getFleetCar(idOrSlug: string, signal?: AbortSignal): Promise<FleetCar> {
  return api.get<FleetCar>(`/fleet/${encodeURIComponent(idOrSlug)}`, { signal });
}
