import type { CreateBookingRequest, CreateBookingResponse } from '@/types';
import { api } from '../api-client';

export function createBooking(body: CreateBookingRequest, signal?: AbortSignal): Promise<CreateBookingResponse> {
  return api.post<CreateBookingResponse>('/bookings', body, { signal });
}

/**
 * TODO(03): `POST /pricing/quote` ships with ticket 03. Until then the estimate is disabled so the dialog never fires a
 * request that is guaranteed to 404. 03 should flip this flag and replace `postQuote` with its own `pricing-api.ts`.
 */
export const PRICING_QUOTE_ENABLED = false;

export interface QuoteSelection {
  categoryCode: string;
  vehicleId: string;
  lessons: number;
}

/** Only the field the dialog needs from 03's response (`total` in lei). */
export interface QuoteResponse {
  total: number;
  currency: 'RON';
  lessons: number;
}

export function postQuote(selection: QuoteSelection, signal?: AbortSignal): Promise<QuoteResponse> {
  return api.post<QuoteResponse>('/pricing/quote', selection, { signal });
}
