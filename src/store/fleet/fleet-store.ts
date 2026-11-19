import { flow, types, type Instance } from 'mobx-state-tree';
import { ApiError, getFleet } from '@/libs';
import type { FleetFacets, FleetFilters, FleetListResponse } from '@/types';
import { RequestStatus } from '../models/request-status';
import { FleetCarModel } from './fleet-car-model';

export const isAbortError = (e: unknown) => e instanceof ApiError && e.kind === 'abort';

export const FleetStore = types
  .model('FleetStore', {
    items: types.array(FleetCarModel),
    total: 0,
    facets: types.maybeNull(types.frozen<FleetFacets>()),
    filters: types.optional(types.frozen<FleetFilters>(), {}),
    status: types.optional(RequestStatus, 'idle'),
    errorStatus: types.maybeNull(types.number),
  })
  .volatile(() => ({ abort: null as AbortController | null }))
  .views((self) => ({
    get hasActiveFilters(): boolean {
      return Object.values(self.filters).some(Boolean);
    },
    /** All active cars regardless of filters (facets ignore filters). */
    get overallTotal(): number {
      return self.facets ? Object.values(self.facets.transmission).reduce((a, b) => a + b, 0) : self.total;
    },
    get isInitialLoading(): boolean {
      return self.status === 'pending' && self.items.length === 0;
    },
    get isRefetching(): boolean {
      return self.status === 'pending' && self.items.length > 0;
    },
    get isEmpty(): boolean {
      return self.status === 'done' && self.items.length === 0;
    },
    findBySlug(slug: string) {
      return self.items.find((c) => c.slug === slug);
    },
  }))
  .actions((self) => ({
    fetch: flow(function* fetch(filters: FleetFilters = self.filters) {
      self.abort?.abort(); // fast chip clicking: never show stale results
      const ctrl = new AbortController();
      self.abort = ctrl;
      self.filters = filters;
      self.status = 'pending';
      self.errorStatus = null;
      try {
        const res: FleetListResponse = yield getFleet(filters, ctrl.signal);
        self.items.replace(res.items as never);
        self.total = res.total;
        self.facets = res.facets;
        self.status = 'done';
      } catch (e) {
        if (isAbortError(e)) return;
        self.status = 'error';
        self.errorStatus = e instanceof ApiError ? (e.status ?? 0) : 0;
        if (import.meta.env.DEV) console.warn('[fleet] fetch failed', e);
      }
    }),
  }));

export type FleetStoreInstance = Instance<typeof FleetStore>;
