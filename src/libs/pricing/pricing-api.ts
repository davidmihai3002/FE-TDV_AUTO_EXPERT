import type { PricingOptions, QuoteBreakdown, QuoteSelection } from '@/types';
import { api } from '../api-client';

export function getPricingOptions(signal?: AbortSignal): Promise<PricingOptions> {
  return api.get<PricingOptions>('/pricing/options', { signal });
}

export function postQuote(selection: QuoteSelection, signal?: AbortSignal): Promise<QuoteBreakdown> {
  return api.post<QuoteBreakdown>('/pricing/quote', selection, { signal });
}
