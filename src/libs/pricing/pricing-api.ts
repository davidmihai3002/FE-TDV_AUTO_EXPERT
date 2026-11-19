import type { PricingOptions, QuoteBreakdown, QuoteSelection } from '@/types';
import { api } from '../api-client';

export function getPricingOptions(signal?: AbortSignal): Promise<PricingOptions> {
  return api.get<PricingOptions>('/pricing/options', { signal });
}

/** Server-side (authoritative) estimate. Also used by 06's BookingDialog for its estimate line. */
export function postQuote(selection: QuoteSelection, signal?: AbortSignal): Promise<QuoteBreakdown> {
  return api.post<QuoteBreakdown>('/pricing/quote', selection, { signal });
}
