import type { CreateBookingRequest, CreateBookingResponse } from '@/types';
import { api } from '../api-client';

export function createBooking(body: CreateBookingRequest, signal?: AbortSignal): Promise<CreateBookingResponse> {
  return api.post<CreateBookingResponse>('/bookings', body, { signal });
}
